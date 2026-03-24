const fs = require('fs');
const path = require('path');
const vm = require('vm'); // Módulo seguro para ejecutar código

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
// Ejecutamos el script en este contexto seguro
const sandbox = { 
    window: {}, 
    console: console, 
    localStorage: { getItem: () => 'es' } // Simulamos localStorage por si data.js lo usa
};
vm.createContext(sandbox);

try {
    // Ejecutamos el contenido de data.js dentro del sandbox
    vm.runInContext(rawData, sandbox);
} catch (e) {
    console.error('❌ ERROR ejecutando data.js. Revisa el archivo:', e.message);
    process.exit(1);
}

// Ahora el objeto CLUB_DATA está dentro de sandbox.window.CLUB_DATA
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

let contador = 0;

// 5. Iterar y crear archivos
Object.keys(CLUB_DATA.temporadas).forEach(temporadaId => {
    const temporada = CLUB_DATA.temporadas[temporadaId];
    
    temporada.jugadores.forEach(jugador => {
        const slug = `${jugador.codigo}-${temporadaId.replace('/', '-')}`;
        const fileName = `${slug}.html`;
        const filePath = path.join(outputDir, fileName);

        let htmlContent = template
            .replace(/\{\{NOMBRE\}\}/g, jugador.nombreCompleto)
            .replace(/\{\{IMAGEN\}\}/g, jugador.imagen)
            .replace(/\{\{ID\}\}/g, jugador.id)
            .replace(/\{\{TEMPORADA_ID\}\}/g, temporadaId)
            .replace(/\{\{TEMPORADA_NOMBRE\}\}/g, temporadaId.replace('-', '/'))
            .replace(/\{\{POSICION\}\}/g, jugador.posicion);

        fs.writeFileSync(filePath, htmlContent);
        contador++;
    });
});

console.log(`✅ ¡ÉXITO! Se generaron ${contador} fichas en la carpeta 'fichas'.`);