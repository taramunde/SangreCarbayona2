const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE_BASE_URL = 'https://taramunde.github.io/SangreCarbayona2';
const PC = require('./partidos-comun');

console.log('🚀 Iniciando generador de fichas...');

// 1. Rutas de los archivos de datos (en orden de carga)
const dataFiles = [
  path.join(__dirname, '../js/data-club.js'),
  path.join(__dirname, '../js/data-jugadores.js'),
  path.join(__dirname, '../js/data-temporada-actual.js'),
  path.join(__dirname, '../js/data-historico.js'),
  path.join(__dirname, '../js/data-utils.js'),
];
const templatePath = path.join(__dirname, 'plantilla.html');

// Comprobar que existen todos los archivos de datos
dataFiles.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    console.error(
      `❌ ERROR: No encuentro ${path.basename(filePath)} en la carpeta js/.`,
    );
    process.exit(1);
  }
});

// 2. Crear un contexto simulado (como si fuera un navegador)
const sandbox = {
  window: {},
  console: console,
  localStorage: { getItem: () => 'es' },
};
vm.createContext(sandbox);

// 3. Ejecutar los archivos de datos en orden
dataFiles.forEach((filePath) => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  try {
    vm.runInContext(rawData, sandbox);
  } catch (e) {
    console.error(`❌ ERROR ejecutando ${path.basename(filePath)}:`, e.message);
    process.exit(1);
  }
});

const CLUB_DATA = sandbox.window.CLUB_DATA;

if (!CLUB_DATA) {
  console.error(
    '❌ ERROR: Los archivos de datos se ejecutaron pero no se encontró window.CLUB_DATA.',
  );
  process.exit(1);
}

// 3b. Lista única de partidos (la misma que usa generar-partidos.js),
//     para enlazar desde cada ficha a la página de cada partido.
const { partidos: listaPartidos } = PC.construirPartidos(CLUB_DATA);
const partidoPorFecha = PC.indicePorFecha(listaPartidos);

// Partidos de un jugador o entrenador en TODAS sus temporadas, sin
// repetir, de más reciente a más antiguo.
function partidosDe(codigo, esEntrenador) {
  const vistos = new Map();
  Object.entries(CLUB_DATA.temporadas).forEach(([tid, temp]) => {
    const lista = esEntrenador ? temp.cuerpoTecnico : temp.jugadores;
    (lista || []).forEach((m) => {
      const cod = esEntrenador ? String(m.codigo || m.id) : m.codigo;
      if (cod !== codigo) return;
      (m.partidos || []).forEach((p) => {
        const partido = partidoPorFecha[`${tid}|${p.fecha}`];
        if (partido) vistos.set(partido.slug, partido);
      });
    });
  });
  return [...vistos.values()].sort((a, b) => b.fecha.localeCompare(a.fecha));
}

function htmlPartidosEstaticos(nombre, codigo, esEntrenador) {
  const lista = partidosDe(codigo, esEntrenador);
  if (!lista.length) return '';
  const e = PC.escaparHtml;
  const items = lista
    .map(
      (p) =>
        `<li>${PC.bi(e(PC.fechaCorta(p.fecha)), e(PC.fechaCortaEn(p.fecha)), 'small')}<a href="../partidos/${e(p.slug)}.html">${e(p.local)} ${e(PC.marcador(p))} ${e(p.visitante)}</a></li>`,
    )
    .join('\n          ');
  return `<section class="ficha-partidos-estaticos">
      <div class="container">
        <details>
          <summary>${PC.bi(
            `${esEntrenador ? 'Partidos dirigidos' : 'Partidos'} de ${e(nombre)} con el Real Oviedo (${lista.length})`,
            `${esEntrenador ? 'Matches managed' : 'Matches'} by ${e(nombre)} with Real Oviedo (${lista.length})`,
          )}</summary>
          <ul>
          ${items}
          </ul>
        </details>
      </div>
    </section>`;
}


// ─────────────────────────────────────────────────────────────
// SEO: título, descripción y resumen en TEXTO VISIBLE de cada ficha.
// Google decide si indexa una página según el contenido que ve; si el
// HTML servido es casi todo JavaScript sin texto, la marca como
// "rastreada/descubierta, actualmente sin indexar". Este bloque mete
// en el HTML un párrafo real con nombre, apodo, posición y números.
// ─────────────────────────────────────────────────────────────
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function nombreTemp(tid) {
  return tid.replace('-', '/');
}

// Temporadas (ordenadas) y totales de un jugador/entrenador.
function trayectoriaEnOviedo(codigo, esEntrenador) {
  const temporadas = [];
  let goles = 0;
  let asistencias = 0;
  temporadasOrdenadas.forEach((tid) => {
    const temp = CLUB_DATA.temporadas[tid];
    if (!temp) return;
    const lista = esEntrenador ? temp.cuerpoTecnico : temp.jugadores;
    const m = (lista || []).find((x) =>
      esEntrenador ? String(x.codigo || x.id) === codigo : x.codigo === codigo,
    );
    if (!m) return;
    temporadas.push(tid);
    (m.partidos || []).forEach((pp) => {
      if (pp.minutos === 0) return;
      goles += Number(pp.goles) || 0;
      asistencias += Number(pp.asistencias) || 0;
    });
  });
  temporadas.sort();
  return {
    temporadas,
    partidos: partidosDe(codigo, esEntrenador).length,
    goles,
    asistencias,
    enActivo: temporadas.includes(temporadaActualId),
  };
}

function rangoTemporadas(t) {
  if (!t.length) return '';
  if (t.length === 1) return nombreTemp(t[0]);
  return `${nombreTemp(t[0])} a ${nombreTemp(t[t.length - 1])}`;
}

function nombreParaTitulo(datos, nombreMostrar) {
  const apodo = (datos.apodo || '').trim();
  if (apodo && !nombreMostrar.toLowerCase().includes(apodo.toLowerCase())) {
    return `${apodo} (${nombreMostrar})`;
  }
  return nombreMostrar;
}

function seoFicha(datos, nombreMostrar, codigo, esEntrenador, cargo) {
  const e = PC.escaparHtml;
  const tr = trayectoriaEnOviedo(codigo, esEntrenador);
  const esPortero = /portero/i.test(datos.posicion || '');
  const rol = (esEntrenador ? cargo || 'Entrenador' : datos.posicion || 'Jugador').toLowerCase();
  const rolEn = esEntrenador
    ? /principal|primer/i.test(cargo || '') || !cargo
      ? 'head coach'
      : rol
    : String(PC.posicionEn(datos.posicion || '') || 'player').toLowerCase();
  const nombreTitulo = nombreParaTitulo(datos, nombreMostrar);
  const nT = tr.temporadas.length;
  const rango = rangoTemporadas(tr.temporadas);

  // Título: el apodo (como lo busca la gente) + nombre + club + marca
  const titulo = `${nombreTitulo} – ${esEntrenador ? 'Entrenador' : datos.posicion || 'Jugador'} del Real Oviedo | Sangre Carbayona`;

  const cifras = [];
  if (tr.partidos) cifras.push(`${tr.partidos} ${esEntrenador ? (tr.partidos === 1 ? 'partido dirigido' : 'partidos dirigidos') : tr.partidos === 1 ? 'partido' : 'partidos'}`);
  if (!esEntrenador && !esPortero && tr.goles) cifras.push(`${tr.goles} ${tr.goles === 1 ? 'gol' : 'goles'}`);
  if (!esEntrenador && tr.asistencias) cifras.push(`${tr.asistencias} ${tr.asistencias === 1 ? 'asistencia' : 'asistencias'}`);
  const descripcion =
    `${nombreTitulo}, ${rol} del Real Oviedo` +
    (rango ? ` (${rango})` : '') +
    (cifras.length ? `: ${cifras.join(', ')}` : '') +
    `. Estadísticas, partidos y trayectoria en Sangre Carbayona.`;

  // Frase de nacimiento (solo con datos confirmados)
  let nacimiento = '';
  let nacimientoEn = '';
  if (datos.lugarNacimiento || datos.fechaNacimiento) {
    const lugar = datos.lugarNacimiento
      ? `${datos.lugarNacimiento}${datos.provinciaNacimiento && datos.provinciaNacimiento !== datos.lugarNacimiento ? ` (${datos.provinciaNacimiento})` : ''}`
      : '';
    let fecha = '';
    let fechaEn = '';
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datos.fechaNacimiento || '');
    if (m) {
      fecha = `el ${Number(m[3])} de ${MESES[Number(m[2]) - 1]} de ${m[1]}`;
      fechaEn = `on ${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
    }
    nacimiento = ` Nació${lugar ? ` en ${e(lugar)}` : ''}${fecha ? ` ${fecha}` : ''}.`;
    nacimientoEn = ` Born${lugar ? ` in ${e(lugar)}` : ''}${fechaEn ? ` ${fechaEn}` : ''}.`;
  }

  const apodoTxt =
    datos.apodo && datos.apodo !== nombreMostrar
      ? `, conocido como <strong>${e(datos.apodo)}</strong>,`
      : '';
  const apodoTxtEn =
    datos.apodo && datos.apodo !== nombreMostrar
      ? `, known as <strong>${e(datos.apodo)}</strong>,`
      : '';
  const verbo = tr.enActivo ? 'forma parte' : 'formó parte';
  const verboEn = tr.enActivo ? 'is part' : 'was part';
  const quePlantilla = esEntrenador ? 'del cuerpo técnico' : 'de la plantilla';
  const quePlantillaEn = esEntrenador ? 'of the coaching staff' : 'of the squad';
  const tempTxt = nT
    ? ` en ${nT === 1 ? `la temporada ${rango}` : `${nT} temporadas (${rango})`}`
    : '';
  const tempTxtEn = nT
    ? ` in ${nT === 1 ? `the ${rango.replace(' a ', '–')} season` : `${nT} seasons (${rango.replace(' a ', '–')})`}`
    : '';
  const cifrasTxt = cifras.length ? ` Con el club suma ${cifras.join(', ')}.` : '';
  const cifrasEn = [];
  if (tr.partidos) cifrasEn.push(`${tr.partidos} ${tr.partidos === 1 ? 'match' : 'matches'}${esEntrenador ? ' in charge' : ''}`);
  if (!esEntrenador && !esPortero && tr.goles) cifrasEn.push(`${tr.goles} ${tr.goles === 1 ? 'goal' : 'goals'}`);
  if (!esEntrenador && tr.asistencias) cifrasEn.push(`${tr.asistencias} ${tr.asistencias === 1 ? 'assist' : 'assists'}`);
  const cifrasTxtEn = cifrasEn.length ? ` With the club: ${cifrasEn.join(', ')}.` : '';

  const parrafoEs =
    `<strong>${e(nombreMostrar)}</strong>${apodoTxt} ${verbo} ${quePlantilla} del Real Oviedo` +
    ` como ${e(rol)}${tempTxt}.${cifrasTxt}${nacimiento}`;
  const parrafoEn =
    `<strong>${e(nombreMostrar)}</strong>${apodoTxtEn} ${verboEn} of Real Oviedo's ${esEntrenador ? 'coaching staff' : 'squad'}` +
    ` as ${e(rolEn)}${tempTxtEn}.${cifrasTxtEn}${nacimientoEn}`;

  const resumenHtml = `<section class="ficha-resumen-estatico">
      <div class="container">
        <div class="ficha-resumen-caja">
          <h2>${PC.bi(`${e(nombreTitulo)} en el Real Oviedo`, `${e(nombreTitulo)} at Real Oviedo`)}</h2>
          <p>${PC.bi(parrafoEs, parrafoEn)}</p>
          <p class="ficha-resumen-enlaces"><a href="../partidos/jugadores.html">${PC.bi('Todos los jugadores y entrenadores de la A a la Z', 'All players and managers from A to Z')}</a> · <a href="../partidos/index.html">${PC.bi('Resultados del Real Oviedo', 'Real Oviedo results')}</a></p>
        </div>
      </div>
    </section>`;

  return { titulo: e(titulo), descripcion: e(descripcion), resumenHtml };
}

// 4. Leer Plantilla
const template = fs.readFileSync(templatePath, 'utf-8');

// 5. Crear carpeta de salida
const outputDir = path.join(__dirname, '..', 'fichas');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('📁 Carpeta "fichas" creada.');
}

// 6. Recopilar todas las apariciones de cada jugador por temporada.
//    - mapaJugadores:   codigo → { jugador, temporadaId }  (temporada más reciente → ficha sin sufijo)
//    - fichasHistoricas: array de { jugador, temporadaId } para cada aparición (fichas con sufijo)

const temporadasOrdenadas = CLUB_DATA.temporadasDisponibles.map((t) => t.id);
const temporadaActualId = CLUB_DATA.temporadaActual;

const mapaJugadores = {}; // ficha canónica sin sufijo
const fichasHistoricas = []; // una entrada por jugador × temporada

[...temporadasOrdenadas].reverse().forEach((temporadaId) => {
  const temporada = CLUB_DATA.temporadas[temporadaId];
  if (!temporada) return;

  temporada.jugadores.forEach((jugadorTemp) => {
    const maestro =
      (CLUB_DATA.jugadoresMaestro &&
        CLUB_DATA.jugadoresMaestro[jugadorTemp.codigo]) ||
      {};
    const jugador = { ...maestro, ...jugadorTemp };

    if (!jugador.nombreCompleto && !jugador.imagen) {
      console.log(
        `  ⚠ Omitido ${jugadorTemp.codigo} (${temporadaId}): sin datos en jugadoresMaestro`,
      );
      return;
    }

    // La temporada más reciente gana la ficha canónica
    mapaJugadores[jugador.codigo] = { jugador, temporadaId };

    // Registrar para ficha con sufijo de temporada
    fichasHistoricas.push({ jugador, temporadaId });
  });
});

// Construye el JSON-LD (schema.org Person) de una ficha, omitiendo con
// cuidado los campos que no tengamos confirmados en vez de dejarlos
// vacíos o inventarlos (mismo criterio que el resto del proyecto).
function construirJsonLdPersona(
  datos,
  nombreMostrar,
  imagenUrl,
  canonicalUrl,
  posicion,
) {
  const persona = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: nombreMostrar,
    url: canonicalUrl,
  };

  if (imagenUrl) persona.image = imagenUrl;
  if (posicion) persona.jobTitle = posicion;
  if (datos.fechaNacimiento) persona.birthDate = datos.fechaNacimiento;
  if (datos.altura) persona.height = `${datos.altura} m`;
  if (datos.nacionalidad && datos.nacionalidad.length) {
    persona.nationality = datos.nacionalidad[0];
  }
  if (datos.lugarNacimiento) {
    const address = {
      '@type': 'PostalAddress',
      addressLocality: datos.lugarNacimiento,
    };
    if (
      datos.provinciaNacimiento &&
      datos.provinciaNacimiento !== datos.lugarNacimiento
    ) {
      address.addressRegion = datos.provinciaNacimiento;
    }
    persona.birthPlace = { '@type': 'Place', address };
  }

  persona.memberOf = {
    '@type': 'SportsTeam',
    name: 'Real Oviedo',
    sport: 'Fútbol',
  };

  return JSON.stringify(persona, null, 2);
}

// Helper: rellena la plantilla con los datos de un jugador/temporada
function generarHtmlFicha(jugador, temporadaId, slug) {
  const temporadaNombre = temporadaId.replace('-', '/');
  const nombreMostrar =
    jugador.nombreCompleto || jugador.nombre || jugador.codigo;
  // encodeURI convierte paréntesis y otros caracteres reservados que confunden
  // a los crawlers de WhatsApp / Telegram / Twitter al leer og:image
  const codificarImagenUrl = (url) => {
    if (!url) return '';
    let urlLimpia = url.replace(/^\/+/, '');
    return encodeURI(urlLimpia)
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/'/g, '%27');
  };

  const imagenMostrar = jugador.imagen
    ? jugador.imagen.startsWith('http')
      ? codificarImagenUrl(jugador.imagen)
      : `${SITE_BASE_URL}/${codificarImagenUrl(jugador.imagen)}`
    : '';
  // La ficha canónica de un jugador es siempre la que no lleva sufijo
  // de temporada (la de su temporada más reciente). Tanto si "slug"
  // es esa ficha canónica como si es una variante histórica
  // (jugador-2024-25.html), el canonical apunta al mismo sitio.
  const canonicalUrl = `${SITE_BASE_URL}/fichas/${jugador.codigo}.html`;
  const jsonLdPersona = construirJsonLdPersona(
    jugador,
    nombreMostrar,
    imagenMostrar,
    canonicalUrl,
    jugador.posicion || '',
  );

  const seo = seoFicha(jugador, nombreMostrar, jugador.codigo, false);

  return template
    .replace(/\{\{NOMBRE\}\}/g, nombreMostrar)
    .replace(/\{\{IMAGEN\}\}/g, imagenMostrar)
    .replace(/\{\{ID\}\}/g, jugador.codigo)
    .replace(/\{\{TEMPORADA_ID\}\}/g, temporadaId)
    .replace(/\{\{TEMPORADA_NOMBRE\}\}/g, temporadaNombre)
    .replace(/\{\{POSICION\}\}/g, jugador.posicion || '')
    .replace(/\{\{SLUG\}\}/g, slug)
    .replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl)
    .replace(/\{\{JSON_LD_PERSONA\}\}/g, jsonLdPersona)
    .replace(/\{\{TITULO\}\}/g, () => seo.titulo)
    .replace(/\{\{DESCRIPCION\}\}/g, () => seo.descripcion)
    .replace(/\{\{RESUMEN_ESTATICO\}\}/g, () => seo.resumenHtml)
    .replace(
      /\{\{PARTIDOS_ESTATICOS\}\}/g,
      () => htmlPartidosEstaticos(nombreMostrar, jugador.codigo, false),
    );
}

// 7. Generar fichas de jugadores
let contador = 0;

// 7a. Ficha canónica sin sufijo (temporada más reciente del jugador)
Object.values(mapaJugadores).forEach(({ jugador, temporadaId }) => {
  const slug = jugador.codigo;
  fs.writeFileSync(
    path.join(outputDir, `${slug}.html`),
    generarHtmlFicha(jugador, temporadaId, slug),
  );
  contador++;
  console.log(`  ✔ ${slug}.html  (datos de ${temporadaId})`);
});

// 7b. Ficha con sufijo de temporada para todas las apariciones
//     ej: alvaro-lemos-collazo-2024-25.html
fichasHistoricas.forEach(({ jugador, temporadaId }) => {
  const slug = `${jugador.codigo}-${temporadaId}`;
  fs.writeFileSync(
    path.join(outputDir, `${slug}.html`),
    generarHtmlFicha(jugador, temporadaId, slug),
  );
  contador++;
  console.log(`  ✔ ${slug}.html`);
});

// ===================================
// 7b. Generar fichas de ENTRENADORES
// ===================================
//
// Un entrenador puede aparecer en varias temporadas.
// Recorremos de MÁS ANTIGUA a MÁS RECIENTE para que la
// temporada más reciente gane (igual que con jugadores).
// El slug lleva el prefijo "entrenador-" para evitar
// colisiones con jugadores que tengan el mismo nombre.

const mapaEntrenadores = {}; // slug → { miembro, temporadaId }

[...temporadasOrdenadas].reverse().forEach((temporadaId) => {
  const temporada = CLUB_DATA.temporadas[temporadaId];
  if (!temporada || !temporada.cuerpoTecnico) return;

  temporada.cuerpoTecnico.forEach((miembro) => {
    // Usar codigo si existe, si no construir slug desde el nombre
    let entId = miembro.codigo || miembro.id;
    if (!entId || typeof entId === 'number') {
      // Generar slug desde el nombre
      entId = miembro.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
    const slug = `entrenador-${entId}`;
    mapaEntrenadores[slug] = { miembro, temporadaId };
  });
});

let contadorEnt = 0;

Object.entries(mapaEntrenadores).forEach(([slug, { miembro, temporadaId }]) => {
  const fileName = `${slug}.html`;
  const filePath = path.join(outputDir, fileName);
  const temporadaNombre = temporadaId.replace('-', '/');

  // Fusionar con datos maestros si existen
  const entId = miembro.codigo || miembro.id;
  const maestro =
    (CLUB_DATA.entrenadorMaestro &&
      CLUB_DATA.entrenadorMaestro[String(entId)]) ||
    {};
  const nombre = maestro.nombreCompleto || miembro.nombre || '';
  const imagenRaw = maestro.imagen || miembro.imagen || '';
  // encodeURI convierte paréntesis y otros caracteres reservados que confunden
  // a los crawlers de WhatsApp / Telegram / Twitter al leer og:image
  const codificarImagenUrlEnt = (url) => {
    if (!url) return '';
    let urlLimpia = url.replace(/^\/+/, '');
    return encodeURI(urlLimpia)
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/'/g, '%27');
  };
  const imagen = imagenRaw
    ? imagenRaw.startsWith('http')
      ? codificarImagenUrlEnt(imagenRaw)
      : `${SITE_BASE_URL}/${codificarImagenUrlEnt(imagenRaw)}`
    : '';

  // Un entrenador no tiene variantes históricas con sufijo, así que
  // su ficha siempre es canónica a sí misma.
  const canonicalUrlEnt = `${SITE_BASE_URL}/fichas/${slug}.html`;

  const jsonLdPersonaEnt = construirJsonLdPersona(
    maestro,
    nombre,
    imagen,
    canonicalUrlEnt,
    miembro.cargo || 'Entrenador',
  );

  const seoEnt = seoFicha(
    { ...maestro, apodo: maestro.apodo },
    nombre,
    String(entId),
    true,
    miembro.cargo || 'Entrenador',
  );

  let htmlContent = template
    .replace(/\{\{NOMBRE\}\}/g, nombre)
    .replace(/\{\{IMAGEN\}\}/g, imagen)
    .replace(/\{\{ID\}\}/g, String(entId))
    .replace(/\{\{TEMPORADA_ID\}\}/g, temporadaId)
    .replace(/\{\{TEMPORADA_NOMBRE\}\}/g, temporadaNombre)
    .replace(/\{\{POSICION\}\}/g, miembro.cargo || 'Entrenador')
    .replace(/\{\{SLUG\}\}/g, slug)
    .replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrlEnt)
    .replace(/\{\{JSON_LD_PERSONA\}\}/g, jsonLdPersonaEnt)
    .replace(/\{\{TITULO\}\}/g, () => seoEnt.titulo)
    .replace(/\{\{DESCRIPCION\}\}/g, () => seoEnt.descripcion)
    .replace(/\{\{RESUMEN_ESTATICO\}\}/g, () => seoEnt.resumenHtml)
    .replace(
      /\{\{PARTIDOS_ESTATICOS\}\}/g,
      () => htmlPartidosEstaticos(nombre, String(entId), true),
    );

  // Inyectar tipo=entrenador en el PLAYER_DATA_STATIC
  htmlContent = htmlContent.replace(
    'window.PLAYER_DATA_STATIC = {',
    "window.PLAYER_DATA_STATIC = {\n        tipo: 'entrenador',",
  );

  fs.writeFileSync(filePath, htmlContent);
  contadorEnt++;
  console.log(`  ✔ ${fileName}  [entrenador] (datos de ${temporadaId})`);
});

// 8. Borrar fichas antiguas que ya no tienen jugador/entrenador activo
const slugsValidos = new Set([
  ...Object.keys(mapaJugadores),
  ...fichasHistoricas.map(
    ({ jugador, temporadaId }) => `${jugador.codigo}-${temporadaId}`,
  ),
  ...Object.keys(mapaEntrenadores),
]);
const archivosExistentes = fs.readdirSync(outputDir);
let borrados = 0;

archivosExistentes.forEach((archivo) => {
  if (!archivo.endsWith('.html')) return;
  // Las fichas de derbi (derbi-*.html) las gestiona en exclusiva
  // generar-derbis.js: este script no sabe nada de ellas, así que no
  // debe borrarlas por no reconocerlas.
  if (archivo.startsWith('derbi-')) return;
  const nombreSinExtension = archivo.replace('.html', '');
  if (!slugsValidos.has(nombreSinExtension)) {
    fs.unlinkSync(path.join(outputDir, archivo));
    borrados++;
    console.log(`  🗑 Eliminada ficha antigua: ${archivo}`);
  }
});

console.log(
  `\n✅ ¡ÉXITO! ${contador} fichas de jugadores + ${contadorEnt} fichas de entrenadores generadas, ${borrados} fichas antiguas eliminadas.`,
);
