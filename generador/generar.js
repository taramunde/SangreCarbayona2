const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🚀 Iniciando generador de fichas...');

// 1. Leer Data
const dataPath = path.join(__dirname, '../js/data.js');
const templatePath = path.join(__dirname, 'plantilla.html');

if (!fs.existsSync(dataPath)) {
    console.error('❌ ERROR: No encuentro data.js dentro de la carpeta Generador.');
    process.exit(1);
}

const rawData = fs.readFileSync(dataPath, 'utf-8');

// 2. Crear un contexto simulado (como si fuera un navegador)
const sandbox = { 
    window: {}, 
    console: console, 
    localStorage: { getItem: () => 'es' }
};
vm.createContext(sandbox);

try {
    vm.runInContext(rawData, sandbox);
} catch (e) {
    console.error('❌ ERROR ejecutando data.js. Revisa el archivo:', e.message);
    process.exit(1);
}

const CLUB_DATA = sandbox.window.CLUB_DATA;

if (!CLUB_DATA) {
    console.error('❌ ERROR: data.js se ejecutó pero no encontró window.CLUB_DATA al final.');
    process.exit(1);
}

// 3. Leer Plantilla
const template = fs.readFileSync(templatePath, 'utf-8');

// 4. Crear carpeta de salida
const outputDir = path.join(__dirname, '..', 'fichas');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log('📁 Carpeta "fichas" creada.');
}

// 5. Construir mapa de jugadores: una sola ficha por "codigo",
//    usando siempre los datos de la temporada más reciente.
//
//    temporadasDisponibles[0] es la más reciente (actual: true).
//    Recorremos de MÁS ANTIGUA a MÁS RECIENTE para que la más
//    reciente sobreescriba siempre a las anteriores.

const temporadasOrdenadas = CLUB_DATA.temporadasDisponibles.map(t => t.id);

const mapaJugadores = {}; // codigo → { jugador, temporadaId }

[...temporadasOrdenadas].reverse().forEach(temporadaId => {
    const temporada = CLUB_DATA.temporadas[temporadaId];
    if (!temporada) return;

    temporada.jugadores.forEach(jugador => {
        mapaJugadores[jugador.codigo] = { jugador, temporadaId };
    });
});

// 6. Generar una ficha por jugador
let contador = 0;

Object.values(mapaJugadores).forEach(({ jugador, temporadaId }) => {
    const slug = jugador.codigo; // ej: "javi-martinez" (sin temporada)
    const fileName = `${slug}.html`;
    const filePath = path.join(outputDir, fileName);
    const temporadaNombre = temporadaId.replace('-', '/');

    let htmlContent = template
        .replace(/\{\{NOMBRE\}\}/g,          jugador.nombreCompleto)
        .replace(/\{\{IMAGEN\}\}/g,           jugador.imagen)
        .replace(/\{\{ID\}\}/g,               jugador.id)
        .replace(/\{\{TEMPORADA_ID\}\}/g,     temporadaId)
        .replace(/\{\{TEMPORADA_NOMBRE\}\}/g, temporadaNombre)
        .replace(/\{\{POSICION\}\}/g,         jugador.posicion)
        .replace(/\{\{SLUG\}\}/g,             slug);

    fs.writeFileSync(filePath, htmlContent);
    contador++;
    console.log(`  ✔ ${fileName}  (datos de ${temporadaId})`);
});

// 7. Borrar fichas antiguas con formato "codigo-temporada.html"
//    que ya no se usan (ej: javi-martinez-2024-25.html)
const slugsValidos = new Set(Object.keys(mapaJugadores));
const archivosExistentes = fs.readdirSync(outputDir);
let borrados = 0;

archivosExistentes.forEach(archivo => {
    if (!archivo.endsWith('.html')) return;
    const nombreSinExtension = archivo.replace('.html', '');
    if (!slugsValidos.has(nombreSinExtension)) {
        fs.unlinkSync(path.join(outputDir, archivo));
        borrados++;
        console.log(`  🗑 Eliminada ficha antigua: ${archivo}`);
    }
});

console.log(`\n✅ ¡ÉXITO! ${contador} fichas generadas, ${borrados} fichas antiguas eliminadas.`);