const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE_BASE_URL = 'https://taramunde.github.io/SangreCarbayona2';

console.log('🚀 Iniciando generador de fichas de derbis...');

// 1. Rutas de los archivos de datos necesarios
const dataFiles = [
  path.join(__dirname, '../js/data-club.js'),
  path.join(__dirname, '../js/data-derbis.js'),
];
const templatePath = path.join(__dirname, 'plantilla-derbi.html');

dataFiles.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    console.error(
      `❌ ERROR: No encuentro ${path.basename(filePath)} en la carpeta js/.`,
    );
    process.exit(1);
  }
});

// 2. Sandbox tipo navegador, igual que generar.js
const sandbox = {
  window: {},
  console: console,
  localStorage: { getItem: () => 'es' },
};
vm.createContext(sandbox);

dataFiles.forEach((filePath) => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  try {
    vm.runInContext(rawData, sandbox, { filename: path.basename(filePath) });
  } catch (e) {
    console.error(`❌ ERROR ejecutando ${path.basename(filePath)}:`, e.message);
    process.exit(1);
  }
});

const DERBIS_DATA = sandbox.window.DERBIS_DATA;

if (!DERBIS_DATA || !Array.isArray(DERBIS_DATA)) {
  console.error(
    '❌ ERROR: data-derbis.js se ejecutó pero no se encontró window.DERBIS_DATA (array).',
  );
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf-8');

// 3. Carpeta de salida: reutilizamos /fichas/ con el prefijo "derbi-",
//    igual que ya se hace con "entrenador-" para los técnicos.
const outputDir = path.join(__dirname, '..', 'fichas');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('📁 Carpeta "fichas" creada.');
}

// Convierte fechas en español ("10 de Diciembre de 1944") a ISO
// (2026-08-02 style) para el JSON-LD. Si el formato no encaja,
// devuelve null y simplemente se omite el startDate (mejor omitir
// que mandar una fecha inventada o mal formada).
const MESES_ES = {
  enero: '01',
  febrero: '02',
  marzo: '03',
  abril: '04',
  mayo: '05',
  junio: '06',
  julio: '07',
  agosto: '08',
  septiembre: '09',
  octubre: '10',
  noviembre: '11',
  diciembre: '12',
};

function fechaAIso(fechaTexto) {
  if (!fechaTexto) return null;

  // Ya viene en ISO (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}/.test(fechaTexto)) {
    return fechaTexto.slice(0, 10);
  }

  // Formato "10 de Diciembre de 1944"
  const match = fechaTexto
    .toLowerCase()
    .match(/(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})/i);
  if (!match) return null;

  const [, dia, mesTexto, anio] = match;
  const mesNormalizado = mesTexto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const mes = MESES_ES[mesNormalizado];
  if (!mes) return null;

  return `${anio}-${mes}-${dia.padStart(2, '0')}`;
}

function escaparHtml(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let contador = 0;

DERBIS_DATA.forEach((partido) => {
  const slug = `derbi-${partido.id}`;
  const canonicalUrl = `${SITE_BASE_URL}/fichas/${slug}.html`;
  const temporadaAnio = (partido.temporada || '').split('/')[0];
  const isoFecha = fechaAIso(partido.fecha);
  const startDateJson = isoFecha ? `,\n        "startDate": "${isoFecha}"` : '';

  const html = template
    .replace(/\{\{ID\}\}/g, escaparHtml(partido.id))
    .replace(/\{\{LOCAL\}\}/g, escaparHtml(partido.local.nombre))
    .replace(/\{\{VISITANTE\}\}/g, escaparHtml(partido.visitante.nombre))
    .replace(/\{\{RESULTADO\}\}/g, escaparHtml(partido.resultado))
    .replace(/\{\{COMPETICION\}\}/g, escaparHtml(partido.competicion))
    .replace(/\{\{JORNADA\}\}/g, escaparHtml(partido.jornada))
    .replace(/\{\{TEMPORADA\}\}/g, escaparHtml(partido.temporada))
    .replace(/\{\{TEMPORADA_ANIO\}\}/g, escaparHtml(temporadaAnio))
    .replace(/\{\{FECHA\}\}/g, escaparHtml(partido.fecha))
    .replace(/\{\{ESTADIO\}\}/g, escaparHtml(partido.estadio))
    .replace(/\{\{ESCUDO_LOCAL\}\}/g, partido.local.escudo || '')
    .replace(/\{\{ESCUDO_VISITANTE\}\}/g, partido.visitante.escudo || '')
    .replace(/\{\{CANONICAL_URL\}\}/g, canonicalUrl)
    .replace(/\{\{STARTDATE_JSON\}\}/g, startDateJson);

  fs.writeFileSync(path.join(outputDir, `${slug}.html`), html);
  contador++;
  console.log(`  ✔ ${slug}.html  (${partido.local.nombre} ${partido.resultado} ${partido.visitante.nombre})`);
});

console.log(`\n✅ ¡ÉXITO! ${contador} fichas de derbis generadas.`);