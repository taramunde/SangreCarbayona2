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

// 8. Borrar fichas antiguas con formato "codigo-temporada.html"
//    que ya no se usan (ej: javi-martinez-2024-25.html)
const slugsValidos = new Set(Object.keys(mapaJugadores));
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
  `\n✅ ¡ÉXITO! ${contador} fichas generadas, ${borrados} fichas antiguas eliminadas.`,
);
