#!/usr/bin/env node
/**
 * crear-plantilla-jugadores.js — `npm run plantilla-jugadores`
 *
 * Crea excel/plantilla-jugadores.xlsx: una plantilla para rellenar los
 * datos que van en js/data-jugadores.js (jugadores y entrenadores), con
 * desplegables para que no se cuelen variantes ("PO"/"POR", "Española"/
 * "española"...). Las listas de nacionalidades y países salen de los
 * datos ya metidos, así que al volver a crearla se actualizan solas.
 *
 * La carpeta excel/ se sube a GitHub con el resto, para tenerla igual en
 * todos los ordenadores (en uno nuevo: `npm install` una vez).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ExcelJS = require('exceljs');

const RAIZ = path.join(__dirname, '..');
const SALIDA = path.join(RAIZ, 'excel', 'plantilla-jugadores.xlsx');

// ── Datos existentes, para las listas ──────────────────────────
const ctx = { window: {} };
vm.createContext(ctx);
['data-club', 'data-jugadores'].forEach((f) =>
  vm.runInContext(
    fs.readFileSync(path.join(RAIZ, 'js', `${f}.js`), 'utf8').replace(/^const CLUB_DATA/m, 'var CLUB_DATA'),
    ctx,
  ),
);
const CD = ctx.CLUB_DATA;
const personas = [
  ...Object.values(CD.jugadoresMaestro || {}),
  ...Object.values(CD.entrenadorMaestro || {}),
];

const unicos = (arr) =>
  [...new Set(arr.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));

const NACIONALIDADES = unicos(personas.flatMap((d) => d.nacionalidad || []));
const PROVINCIAS = unicos(personas.map((d) => d.provinciaNacimiento));
const paises = new Map();
personas.forEach((d) =>
  [d.seleccion, ...(d.otrasSelecciones || []), d.seleccionComoEntrenador]
    .filter(Boolean)
    .forEach((s) => {
      const m = String(s.bandera || '').match(/\/([a-z-]+)\.webp$/);
      if (s.pais && m) paises.set(s.pais, m[1]);
    }),
);
const PAISES = [...paises.entries()].sort((a, b) => a[0].localeCompare(b[0], 'es'));

const POSICIONES = ['Portero', 'Defensa', 'Centrocampista', 'Delantero'];
const POS_CORTAS = [
  ['PO', 'Portero'],
  ['DC', 'Defensa central'],
  ['LD', 'Lateral derecho'],
  ['LI', 'Lateral izquierdo'],
  ['MCD', 'Mediocentro defensivo'],
  ['MC', 'Mediocentro'],
  ['MCO', 'Mediocentro ofensivo / mediapunta'],
  ['MD', 'Medio derecho'],
  ['MI', 'Medio izquierdo'],
  ['ED', 'Extremo derecho'],
  ['EI', 'Extremo izquierdo'],
  ['DL', 'Delantero'],
];
const CATEGORIAS = ['Absoluta', 'U23', 'U21', 'U20', 'U19', 'U18', 'U17', 'U16', 'U15'];
const CATEGORIAS_ENT = ['Absoluta', 'Sub-23', 'Sub-21', 'Sub-20', 'Sub-19', 'Sub-18', 'Sub-17', 'Sub-16'];
const CARGOS = [
  'Entrenador Principal',
  'Segundo Entrenador',
  'Preparador Físico',
  'Entrenador de Porteros',
  'Analista',
  'Médico',
];

// ── Estilos ─────────────────────────────────────────────────────
const AZUL = 'FF1A365D';
const ORO = 'FFC9A227';
const GRIS = 'FFF3F4F6';

function cabecera(ws, columnas) {
  ws.columns = columnas.map((c) => ({ header: c.titulo, key: c.clave, width: c.ancho || 16 }));
  const fila = ws.getRow(1);
  fila.height = 34;
  fila.eachCell((cell, i) => {
    const obligatoria = columnas[i - 1].obligatoria;
    cell.font = { bold: true, color: { argb: obligatoria ? 'FF1A1A1A' : 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: obligatoria ? ORO : AZUL } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    if (columnas[i - 1].nota) cell.note = columnas[i - 1].nota;
  });
  ws.views = [{ state: 'frozen', ySplit: 1 }];
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columnas.length } };
}

// Validaciones para las filas 2..FILAS de una columna.
const FILAS = 300;
function validar(ws, letra, regla) {
  for (let r = 2; r <= FILAS; r++) ws.getCell(`${letra}${r}`).dataValidation = regla;
}
const lista = (rango, estricta = true, aviso) => ({
  type: 'list',
  allowBlank: true,
  formulae: [rango],
  showErrorMessage: true,
  errorStyle: estricta ? 'stop' : 'warning',
  errorTitle: estricta ? 'Valor no válido' : 'Valor nuevo',
  error:
    aviso ||
    (estricta
      ? 'Elige un valor del desplegable.'
      : 'No está en la lista. Si es correcto, pulsa "Sí" para dejarlo.'),
});
const entero = (min, max) => ({
  type: 'whole',
  operator: 'between',
  allowBlank: true,
  formulae: [min, max],
  showErrorMessage: true,
  error: `Número entero entre ${min} y ${max}.`,
});
const fecha = {
  type: 'date',
  operator: 'between',
  allowBlank: true,
  formulae: [new Date(1880, 0, 1), new Date(2030, 11, 31)],
  showErrorMessage: true,
  error: 'Escribe una fecha válida (dd/mm/aaaa).',
};
function formatoFecha(ws, letra) {
  for (let r = 2; r <= FILAS; r++) ws.getCell(`${letra}${r}`).numFmt = 'dd/mm/yyyy';
}

async function main() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Sangre Carbayona';

  // ── Instrucciones ──
  const ins = wb.addWorksheet('Instrucciones', { properties: { tabColor: { argb: ORO } } });
  ins.getColumn(1).width = 110;
  [
    ['PLANTILLA DE DATOS DE JUGADORES Y ENTRENADORES (js/data-jugadores.js)', true],
    [''],
    ['• Una fila por persona. Columnas en DORADO = obligatorias; en AZUL = opcionales (déjalas vacías si no las sabes).'],
    ['• Usa los desplegables siempre que los haya. Pasa el ratón por el título de una columna para ver una explicación.'],
    ['• No hace falta escribir el código interno ni el nombre completo: se calculan solos a partir de nombre y apellidos.'],
    ['• Altura en metros con coma o punto (1,84). Si no se sabe, déjala vacía (no pongas "-" ni 0).'],
    ['• Fechas en formato dd/mm/aaaa.'],
    ['• Nacionalidad: elige de la lista. Si es una nueva, escríbela igual que las demás (en femenino y con mayúscula: "Japonesa") y acepta el aviso.'],
    ['• Imagen: nombre del archivo en img/jugadores/ (p. ej. "Estanis.webp") o un enlace https completo. Si la dejas vacía, se propone "img/jugadores/<Apodo>.webp".'],
    [''],
    ['HOJAS', true],
    ['• Jugadores: datos personales de cada jugador.'],
    ['• Seleccion: solo si el jugador ha sido internacional. Una fila por jugador, país y categoría. Usa el MISMO apodo que en la hoja Jugadores (o el de un jugador que ya esté en la web). La bandera se pone sola según el país.'],
    ['   "Tipo": Principal = la selección que sale primero en su ficha; Otra = una segunda selección (p. ej. jugó en categorías inferiores de otro país).'],
    ['• Posiciones anteriores: solo si un jugador jugó en otra posición en temporadas pasadas (años de inicio de temporada: 2013 = 2013/14).'],
    ['• Entrenadores y Seleccion entrenador: lo mismo para los técnicos.'],
    [''],
    ['CÓMO SE SUBE', true],
    ['Guarda el Excel y pásaselo a Claude (o dile en qué carpeta está). Se revisa todo antes de meterlo: si hay algún jugador repetido o un dato raro, te avisa en lugar de meterlo mal.'],
    ['La carpeta excel/ se sube a GitHub con "npm run subir", así que la tienes igual en todos tus ordenadores.'],
  ].forEach(([texto, negrita], i) => {
    const c = ins.getCell(`A${i + 1}`);
    c.value = texto;
    c.font = { bold: !!negrita, size: negrita ? 13 : 11, color: { argb: negrita ? AZUL : 'FF1F2937' } };
    c.alignment = { wrapText: true, vertical: 'top' };
  });

  // ── Listas (oculta) ──
  const L = wb.addWorksheet('Listas', { state: 'veryHidden' });
  const columnasListas = {
    A: ['Posición', POSICIONES],
    B: ['Posición corta', POS_CORTAS.map((p) => p[0])],
    C: ['Significado', POS_CORTAS.map((p) => p[1])],
    D: ['Nacionalidad', NACIONALIDADES],
    E: ['País', PAISES.map((p) => p[0])],
    F: ['Código bandera', PAISES.map((p) => p[1])],
    G: ['Categoría', CATEGORIAS],
    H: ['Categoría entrenador', CATEGORIAS_ENT],
    I: ['Cargo', CARGOS],
    J: ['Sí/No', ['Sí', 'No']],
    K: ['Tipo selección', ['Principal', 'Otra']],
    L: ['Provincia', PROVINCIAS],
  };
  const rango = {};
  Object.entries(columnasListas).forEach(([col, [titulo, valores]]) => {
    L.getCell(`${col}1`).value = titulo;
    valores.forEach((v, i) => (L.getCell(`${col}${i + 2}`).value = v));
    rango[titulo] = `Listas!$${col}$2:$${col}$${Math.max(valores.length + 1, 2)}`;
  });

  // ── Jugadores ──
  const J = wb.addWorksheet('Jugadores', { properties: { tabColor: { argb: AZUL } } });
  cabecera(J, [
    { titulo: 'Nombre', clave: 'nombre', obligatoria: true, ancho: 18, nota: 'Nombre de pila, p. ej. "Estanislau".' },
    { titulo: 'Apellidos', clave: 'apellidos', obligatoria: true, ancho: 22, nota: 'P. ej. "Pedrola Fortuny".' },
    { titulo: 'Apodo', clave: 'apodo', obligatoria: true, ancho: 16, nota: 'Como se le conoce y como sale en la web, p. ej. "Estanis".' },
    { titulo: 'Posición', clave: 'posicion', obligatoria: true, ancho: 15 },
    { titulo: 'Posición corta', clave: 'posicionCorta', obligatoria: true, ancho: 12, nota: POS_CORTAS.map((p) => `${p[0]} = ${p[1]}`).join('\n') },
    { titulo: 'Altura (m)', clave: 'altura', ancho: 10, nota: 'En metros, p. ej. 1,84. Vacía si no se sabe.' },
    { titulo: 'Nacionalidad 1', clave: 'nac1', obligatoria: true, ancho: 16 },
    { titulo: 'Nacionalidad 2', clave: 'nac2', ancho: 16, nota: 'Solo si tiene doble nacionalidad.' },
    { titulo: 'Lugar de nacimiento', clave: 'lugar', ancho: 20 },
    { titulo: 'Provincia / región', clave: 'provincia', ancho: 18, nota: 'Elige de la lista o escribe una nueva.' },
    { titulo: 'Fecha de nacimiento', clave: 'fechaNacimiento', ancho: 14 },
    { titulo: 'Imagen', clave: 'imagen', ancho: 26, nota: 'Archivo en img/jugadores/ (p. ej. "Estanis.webp") o enlace https. Vacía = img/jugadores/<Apodo>.webp' },
    { titulo: 'Fallecido', clave: 'fallecido', ancho: 10 },
    { titulo: 'Fecha de fallecimiento', clave: 'fechaFallecimiento', ancho: 14 },
  ]);
  validar(J, 'D', lista(rango['Posición']));
  validar(J, 'E', lista(rango['Posición corta']));
  validar(J, 'F', { type: 'decimal', operator: 'between', allowBlank: true, formulae: [1.4, 2.2], showErrorMessage: true, error: 'Altura en metros entre 1,40 y 2,20.' });
  validar(J, 'G', lista(rango['Nacionalidad'], false));
  validar(J, 'H', lista(rango['Nacionalidad'], false));
  validar(J, 'J', lista(rango['Provincia'], false));
  validar(J, 'K', fecha);
  validar(J, 'M', lista(rango['Sí/No']));
  validar(J, 'N', fecha);
  formatoFecha(J, 'K');
  formatoFecha(J, 'N');
  for (let r = 2; r <= FILAS; r++) J.getCell(`F${r}`).numFmt = '0.00';

  // ── Selección ──
  const S = wb.addWorksheet('Seleccion');
  cabecera(S, [
    { titulo: 'Apodo del jugador', clave: 'apodo', obligatoria: true, ancho: 20 },
    { titulo: 'País', clave: 'pais', obligatoria: true, ancho: 18, nota: 'Elige de la lista; si es un país nuevo, escríbelo y acepta el aviso (habrá que decir su bandera).' },
    { titulo: 'Tipo', clave: 'tipo', obligatoria: true, ancho: 11, nota: 'Principal = la que sale primero en su ficha. Otra = una segunda selección.' },
    { titulo: 'Categoría', clave: 'categoria', obligatoria: true, ancho: 11 },
    { titulo: 'Partidos', clave: 'partidos', ancho: 10 },
    { titulo: 'Goles', clave: 'goles', ancho: 8 },
    { titulo: 'Asistencias', clave: 'asistencias', ancho: 11 },
    { titulo: 'Minutos', clave: 'minutos', ancho: 9 },
    { titulo: 'Amarillas', clave: 'amarillas', ancho: 10 },
    { titulo: 'Rojas', clave: 'rojas', ancho: 8 },
  ]);
  validar(S, 'B', lista(rango['País'], false));
  validar(S, 'C', lista(rango['Tipo selección']));
  validar(S, 'D', lista(rango['Categoría']));
  ['E', 'F', 'G', 'I', 'J'].forEach((c) => validar(S, c, entero(0, 500)));
  validar(S, 'H', entero(0, 50000));

  // ── Posiciones anteriores ──
  const P = wb.addWorksheet('Posiciones anteriores');
  cabecera(P, [
    { titulo: 'Apodo del jugador', clave: 'apodo', obligatoria: true, ancho: 20 },
    { titulo: 'Desde (año)', clave: 'desde', obligatoria: true, ancho: 12, nota: 'Año de inicio de la primera temporada: 2013 = 2013/14.' },
    { titulo: 'Hasta (año)', clave: 'hasta', obligatoria: true, ancho: 12, nota: 'Año de inicio de la última temporada: 2018 = 2018/19.' },
    { titulo: 'Posición', clave: 'posicion', obligatoria: true, ancho: 15 },
    { titulo: 'Posición corta', clave: 'posicionCorta', obligatoria: true, ancho: 12, nota: POS_CORTAS.map((p) => `${p[0]} = ${p[1]}`).join('\n') },
  ]);
  validar(P, 'B', entero(1900, 2100));
  validar(P, 'C', entero(1900, 2100));
  validar(P, 'D', lista(rango['Posición']));
  validar(P, 'E', lista(rango['Posición corta']));

  // ── Entrenadores ──
  const E = wb.addWorksheet('Entrenadores', { properties: { tabColor: { argb: AZUL } } });
  cabecera(E, [
    { titulo: 'Nombre', clave: 'nombre', obligatoria: true, ancho: 18 },
    { titulo: 'Apellidos', clave: 'apellidos', obligatoria: true, ancho: 22 },
    { titulo: 'Apodo', clave: 'apodo', obligatoria: true, ancho: 16 },
    { titulo: 'Cargo', clave: 'cargo', obligatoria: true, ancho: 22 },
    { titulo: 'Nacionalidad 1', clave: 'nac1', obligatoria: true, ancho: 16 },
    { titulo: 'Nacionalidad 2', clave: 'nac2', ancho: 16 },
    { titulo: 'Lugar de nacimiento', clave: 'lugar', ancho: 20 },
    { titulo: 'Provincia / región', clave: 'provincia', ancho: 18 },
    { titulo: 'Fecha de nacimiento', clave: 'fechaNacimiento', ancho: 14 },
    { titulo: 'Imagen', clave: 'imagen', ancho: 26, nota: 'Archivo en img/entrenadores/ o enlace https. Vacía = img/entrenadores/<Apodo>.webp' },
  ]);
  validar(E, 'D', lista(rango['Cargo']));
  validar(E, 'E', lista(rango['Nacionalidad'], false));
  validar(E, 'F', lista(rango['Nacionalidad'], false));
  validar(E, 'H', lista(rango['Provincia'], false));
  validar(E, 'I', fecha);
  formatoFecha(E, 'I');

  // ── Selección como entrenador ──
  const SE = wb.addWorksheet('Seleccion entrenador');
  cabecera(SE, [
    { titulo: 'Apodo del entrenador', clave: 'apodo', obligatoria: true, ancho: 20 },
    { titulo: 'País', clave: 'pais', obligatoria: true, ancho: 18 },
    { titulo: 'Categoría', clave: 'categoria', obligatoria: true, ancho: 12 },
    { titulo: 'Partidos', clave: 'partidos', ancho: 10 },
    { titulo: 'Victorias', clave: 'victorias', ancho: 10 },
    { titulo: 'Empates', clave: 'empates', ancho: 10 },
    { titulo: 'Derrotas', clave: 'derrotas', ancho: 10 },
  ]);
  validar(SE, 'B', lista(rango['País'], false));
  validar(SE, 'C', lista(rango['Categoría entrenador']));
  ['D', 'E', 'F', 'G'].forEach((c) => validar(SE, c, entero(0, 500)));

  wb.views = [{ activeTab: 0 }];
  fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
  await wb.xlsx.writeFile(SALIDA);
  console.log(`✔ Plantilla creada: ${path.relative(RAIZ, SALIDA)}`);
  console.log(`  ${NACIONALIDADES.length} nacionalidades, ${PAISES.length} países, ${PROVINCIAS.length} provincias en los desplegables.`);
}

main().catch((e) => {
  console.error('✖', e.message);
  process.exit(1);
});
