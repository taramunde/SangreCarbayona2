const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🚀 Iniciando generador de fichas...');

// 1. Rutas de los archivos de datos (en orden de carga)
const dataFiles = [
  path.join(__dirname, '../js/data-club.js'),
  path.join(__dirname, '../js/data-jugadores.js'),
  path.join(__dirname, '../js/data-temporada-actual.js'),
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

// 4. Leer Plantilla
const template = fs.readFileSync(templatePath, 'utf-8');

// 5. Crear carpeta de salida
const outputDir = path.join(__dirname, '..', 'fichas');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('📁 Carpeta "fichas" creada.');
}

// 6. Construir mapa de jugadores: una sola ficha por "codigo",
//    usando siempre los datos de la temporada más reciente.
//
//    temporadasDisponibles[0] es la más reciente (actual: true).
//    Recorremos de MÁS ANTIGUA a MÁS RECIENTE para que la más
//    reciente sobreescriba siempre a las anteriores.

const temporadasOrdenadas = CLUB_DATA.temporadasDisponibles.map((t) => t.id);

const mapaJugadores = {}; // codigo → { jugador, temporadaId }

[...temporadasOrdenadas].reverse().forEach((temporadaId) => {
  const temporada = CLUB_DATA.temporadas[temporadaId];
  if (!temporada) return;

  temporada.jugadores.forEach((jugador) => {
    mapaJugadores[jugador.codigo] = { jugador, temporadaId };
  });
});

// 7. Generar una ficha por jugador
let contador = 0;

Object.values(mapaJugadores).forEach(({ jugador, temporadaId }) => {
  const slug = jugador.codigo; // ej: "javi-martinez" (sin temporada)
  const fileName = `${slug}.html`;
  const filePath = path.join(outputDir, fileName);
  const temporadaNombre = temporadaId.replace('-', '/');

  let htmlContent = template
    .replace(/\{\{NOMBRE\}\}/g, jugador.nombreCompleto)
    .replace(/\{\{IMAGEN\}\}/g, jugador.imagen)
    .replace(/\{\{ID\}\}/g, jugador.codigo)
    .replace(/\{\{TEMPORADA_ID\}\}/g, temporadaId)
    .replace(/\{\{TEMPORADA_NOMBRE\}\}/g, temporadaNombre)
    .replace(/\{\{POSICION\}\}/g, jugador.posicion)
    .replace(/\{\{SLUG\}\}/g, slug);

  fs.writeFileSync(filePath, htmlContent);
  contador++;
  console.log(`  ✔ ${fileName}  (datos de ${temporadaId})`);
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
  const imagen = maestro.imagen || miembro.imagen || '';

  let htmlContent = template
    .replace(/\{\{NOMBRE\}\}/g, nombre)
    .replace(/\{\{IMAGEN\}\}/g, imagen)
    .replace(/\{\{ID\}\}/g, String(entId))
    .replace(/\{\{TEMPORADA_ID\}\}/g, temporadaId)
    .replace(/\{\{TEMPORADA_NOMBRE\}\}/g, temporadaNombre)
    .replace(/\{\{POSICION\}\}/g, miembro.cargo || 'Entrenador')
    .replace(/\{\{SLUG\}\}/g, slug);

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
  ...Object.keys(mapaEntrenadores),
]);
const archivosExistentes = fs.readdirSync(outputDir);
let borrados = 0;

archivosExistentes.forEach((archivo) => {
  if (!archivo.endsWith('.html')) return;
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
