/* ===================================
   GENERAR-SITEMAP.JS
   Vive en la misma carpeta que generar.js y reutiliza su misma forma
   de cargar los datos (simula un navegador con `vm` para ejecutar los
   archivos de js/data-*.js y leer window.CLUB_DATA).

   Genera sitemap.xml con:
     1. Las páginas estáticas fijas del sitio (home, noticias, etc.)
     2. Solo las fichas CANÓNICAS de jugadores/entrenadores (sin sufijo
        de temporada) — las variantes históricas llevan
        <link rel="canonical"> hacia la canónica, así que no deben
        listarse aparte en el sitemap.
     3. Las fichas estáticas de derbis (/fichas/derbi-{id}.html),
        generadas por generar-derbis.js a partir de data-derbis.js.

   Uso (desde la carpeta donde está generar.js):
     node generar-sitemap.js

   Ejecutar después de generar.js, cada vez que cambie la plantilla o
   se generen fichas nuevas.
   =================================== */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE_BASE_URL = 'https://taramunde.github.io/SangreCarbayona2';

// Páginas estáticas indexables del sitio. Actualizar esta lista a mano
// si se añade o se quita alguna página pública.
// (juegos/quiz.html y juegos/puzzlecarbayon.html asumen que viven en
// una carpeta "juegos/"; ajustar la ruta si no es así.)
const PAGINAS_ESTATICAS = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  { loc: '/noticias.html', changefreq: 'daily', priority: '0.9' },
  { loc: '/primer-equipo.html', changefreq: 'weekly', priority: '0.8' },
  { loc: '/clasificacion.html', changefreq: 'weekly', priority: '0.7' },
  { loc: '/calendario.html', changefreq: 'weekly', priority: '0.7' },
  { loc: '/primera-division.html', changefreq: 'monthly', priority: '0.6' },
  { loc: '/derbis.html', changefreq: 'monthly', priority: '0.6' },
  { loc: '/juegos.html', changefreq: 'monthly', priority: '0.5' },
  { loc: '/videos.html', changefreq: 'weekly', priority: '0.5' },
  { loc: '/juegos/quiz.html', changefreq: 'monthly', priority: '0.4' },
  { loc: '/juegos/puzzlecarbayon.html', changefreq: 'monthly', priority: '0.4' },
  // Nota: ficha-jugador.html y derbi.html NO se incluyen a propósito:
  // ambas llevan noindex,nofollow porque son plantillas dinámicas sin
  // versión estática (las fichas de jugador sí tienen su versión
  // estática en /fichas/, que se añade más abajo).
];

// Mismos archivos de datos y mismo orden que usa generar.js
const dataFiles = [
  path.join(__dirname, '../js/data-club.js'),
  path.join(__dirname, '../js/data-jugadores.js'),
  path.join(__dirname, '../js/data-temporada-actual.js'),
  path.join(__dirname, '../js/data-historico.js'),
  path.join(__dirname, '../js/data-utils.js'),
];

// data-derbis.js se carga aparte: no depende de CLUB_DATA ni le hace
// falta a calcularFichasCanonicas, solo se usa para listar los derbis.
const derbisFile = path.join(__dirname, '../js/data-derbis.js');

function cargarClubData() {
  dataFiles.forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      console.error(
        `❌ ERROR: No encuentro ${path.basename(filePath)} en la carpeta js/.`,
      );
      process.exit(1);
    }
  });

  const sandbox = {
    window: {},
    console: console,
    localStorage: { getItem: () => 'es' },
  };
  vm.createContext(sandbox);

  dataFiles.forEach((filePath) => {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    vm.runInContext(rawData, sandbox);
  });

  if (!sandbox.window.CLUB_DATA) {
    console.error(
      '❌ ERROR: los archivos de datos se ejecutaron pero no se encontró window.CLUB_DATA.',
    );
    process.exit(1);
  }

  // data-derbis.js es opcional: si no existe todavía, seguimos sin
  // fichas de derbis en el sitemap en vez de romper todo el script.
  let derbisData = [];
  if (fs.existsSync(derbisFile)) {
    const rawDerbis = fs.readFileSync(derbisFile, 'utf-8');
    vm.runInContext(rawDerbis, sandbox);
    derbisData = sandbox.window.DERBIS_DATA || [];
  } else {
    console.warn('⚠ No encuentro data-derbis.js: el sitemap no incluirá fichas de derbis.');
  }

  return { CLUB_DATA: sandbox.window.CLUB_DATA, DERBIS_DATA: derbisData };
}

// Reconstruye exactamente los mismos "mapaJugadores" (ficha canónica =
// temporada más reciente en la que aparece cada jugador) y
// "mapaEntrenadores" que calcula generar.js, para no duplicar lógica
// de negocio en dos sitios con reglas distintas.
function calcularFichasCanonicas(CLUB_DATA) {
  const temporadasOrdenadas = CLUB_DATA.temporadasDisponibles.map((t) => t.id);
  const mapaJugadores = {};
  const mapaEntrenadores = {};

  [...temporadasOrdenadas].reverse().forEach((temporadaId) => {
    const temporada = CLUB_DATA.temporadas[temporadaId];
    if (!temporada) return;

    (temporada.jugadores || []).forEach((jugadorTemp) => {
      const maestro =
        (CLUB_DATA.jugadoresMaestro &&
          CLUB_DATA.jugadoresMaestro[jugadorTemp.codigo]) ||
        {};
      const jugador = { ...maestro, ...jugadorTemp };
      if (!jugador.nombreCompleto && !jugador.imagen) return;
      mapaJugadores[jugador.codigo] = true;
    });

    (temporada.cuerpoTecnico || []).forEach((miembro) => {
      let entId = miembro.codigo || miembro.id;
      if (!entId || typeof entId === 'number') {
        entId = miembro.nombre
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }
      mapaEntrenadores[`entrenador-${entId}`] = true;
    });
  });

  return { slugsJugadores: Object.keys(mapaJugadores), slugsEntrenadores: Object.keys(mapaEntrenadores) };
}

function bloqueUrl(loc, changefreq, priority, hoy) {
  return (
    `  <url>\n` +
    `    <loc>${SITE_BASE_URL}${loc}</loc>\n` +
    `    <lastmod>${hoy}</lastmod>\n` +
    `    <changefreq>${changefreq}</changefreq>\n` +
    `    <priority>${priority}</priority>\n` +
    `  </url>`
  );
}

function generarSitemap() {
  const { CLUB_DATA, DERBIS_DATA } = cargarClubData();
  const { slugsJugadores, slugsEntrenadores } = calcularFichasCanonicas(CLUB_DATA);
  const hoy = new Date().toISOString().split('T')[0];
  const urls = [];

  PAGINAS_ESTATICAS.forEach((p) => {
    urls.push(bloqueUrl(p.loc, p.changefreq, p.priority, hoy));
  });

  slugsJugadores.forEach((slug) => {
    urls.push(bloqueUrl(`/fichas/${slug}.html`, 'weekly', '0.6', hoy));
  });

  slugsEntrenadores.forEach((slug) => {
    urls.push(bloqueUrl(`/fichas/${slug}.html`, 'weekly', '0.5', hoy));
  });

  DERBIS_DATA.forEach((partido) => {
    urls.push(bloqueUrl(`/fichas/derbi-${partido.id}.html`, 'yearly', '0.5', hoy));
  });

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.join('\n') +
    `\n</urlset>\n`;

  const outputPath = path.join(__dirname, '..', 'sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(
    `✅ sitemap.xml regenerado con ${urls.length} URLs ` +
      `(${PAGINAS_ESTATICAS.length} páginas fijas, ${slugsJugadores.length} jugadores, ${slugsEntrenadores.length} entrenadores, ${DERBIS_DATA.length} derbis).`,
  );
}

generarSitemap();