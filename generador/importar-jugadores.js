#!/usr/bin/env node
/**
 * importar-jugadores.js — `npm run importar-jugadores -- "excel/archivo.xlsx"`
 *
 * Lee una plantilla rellena (la de `npm run plantilla-jugadores`) y añade
 * los jugadores/entrenadores nuevos a js/data-jugadores.js.
 *
 * Primero SOLO revisa y enseña lo que haría. Para escribir de verdad:
 *   npm run importar-jugadores -- "excel/archivo.xlsx" --aplicar
 *
 * Las filas con algún problema (apodo repetido, posición que no cuadra,
 * jugador que ya existe...) no se meten: se avisa y se sigue con el resto.
 * Con --saltar "Apodo1,Apodo2" se pueden dejar fuera filas concretas.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ExcelJS = require('exceljs');

const RAIZ = path.join(__dirname, '..');
const ARCHIVO_DATOS = path.join(RAIZ, 'js', 'data-jugadores.js');

const args = process.argv.slice(2);
const APLICAR = args.includes('--aplicar');
const iSaltar = args.indexOf('--saltar');
const SALTAR = new Set(
  iSaltar >= 0 ? String(args[iSaltar + 1] || '').split(',').map((s) => s.trim()).filter(Boolean) : [],
);
const excel = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--saltar');
if (!excel) {
  console.error('Uso: npm run importar-jugadores -- "excel/archivo.xlsx" [--aplicar]');
  process.exit(1);
}

// Qué posiciones cortas casan con cada posición general.
const CORTAS_DE = {
  Portero: ['PO'],
  Defensa: ['DC', 'LD', 'LI'],
  Centrocampista: ['MCD', 'MC', 'MCO', 'MD', 'MI'],
  Delantero: ['DL', 'ED', 'EI'],
};
const CARGO_CORTO = {
  'Entrenador Principal': 'ENT',
  'Segundo Entrenador': '2ENT',
  'Preparador Físico': 'PF',
  'Entrenador de Porteros': 'EPO',
  Analista: 'AN',
  Médico: 'MED',
};

// ── Datos actuales ──────────────────────────────────────────────
const ctx = { window: {} };
vm.createContext(ctx);
['data-club', 'data-jugadores'].forEach((f) =>
  vm.runInContext(
    fs.readFileSync(path.join(RAIZ, 'js', `${f}.js`), 'utf8').replace(/^const CLUB_DATA/m, 'var CLUB_DATA'),
    ctx,
  ),
);
const MJ = ctx.CLUB_DATA.jugadoresMaestro || {};
const ME = ctx.CLUB_DATA.entrenadorMaestro || {};

const norm = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
const codigoDe = (texto) =>
  norm(texto).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Países conocidos → código de bandera (flagcdn), sacados de los datos.
const BANDERAS = {};
[...Object.values(MJ), ...Object.values(ME)].forEach((d) =>
  [d.seleccion, ...(d.otrasSelecciones || []), d.seleccionComoEntrenador]
    .filter(Boolean)
    .forEach((s) => {
      const m = String(s.bandera || '').match(/\/([a-z-]+)\.webp$/);
      if (s.pais && m) BANDERAS[norm(s.pais)] = m[1];
    }),
);

// ── Lectura de celdas ───────────────────────────────────────────
function valor(celda) {
  let v = celda && celda.value;
  if (v && typeof v === 'object') {
    if (v instanceof Date) return v;
    if ('result' in v) v = v.result; // fórmula
    else if ('text' in v) v = v.text; // hipervínculo
    else if (Array.isArray(v.richText)) v = v.richText.map((t) => t.text).join('');
  }
  if (typeof v === 'string') v = v.replace(/\s+/g, ' ').trim();
  return v === '' ? null : v ?? null;
}
const texto = (v) => (v == null ? null : String(v).trim() || null);
function fechaISO(v) {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const m = String(v).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(v))) return String(v);
  return undefined; // inválida
}
const numero = (v) => (v == null ? null : Number(String(v).replace(',', '.')));

function filas(ws) {
  if (!ws) return [];
  const cab = ws.getRow(1).values.slice(1).map((c) => texto(c));
  const res = [];
  ws.eachRow((row, n) => {
    if (n === 1) return;
    const o = { _fila: n };
    cab.forEach((c, i) => (o[c] = valor(row.getCell(i + 1))));
    if (cab.some((c) => o[c] != null)) res.push(o);
  });
  return res;
}

// ── Construcción y validación ───────────────────────────────────
function construirPersona(f, tipo) {
  const problemas = [];
  const nombre = texto(f['Nombre']);
  const apellidos = texto(f['Apellidos']);
  const apodo = texto(f['Apodo']);
  if (!nombre) problemas.push('falta el nombre');
  if (!apellidos) problemas.push('faltan los apellidos');
  if (!apodo) problemas.push('falta el apodo');
  const nac = [texto(f['Nacionalidad 1']), texto(f['Nacionalidad 2'])].filter(Boolean);
  if (!nac.length) problemas.push('falta la nacionalidad');

  const d = {
    nombre,
    apellidos,
    nombreCompleto: [nombre, apellidos].filter(Boolean).join(' '),
    apodo,
  };
  if (tipo === 'jugador') {
    d.posicion = texto(f['Posición']);
    d.posicionCorta = texto(f['Posición corta']);
    if (!CORTAS_DE[d.posicion]) problemas.push(`posición "${d.posicion}" no válida`);
    else if (!CORTAS_DE[d.posicion].includes(d.posicionCorta))
      problemas.push(
        `la posición corta "${d.posicionCorta}" no casa con "${d.posicion}" (vale: ${CORTAS_DE[d.posicion].join(', ')})`,
      );
    const alt = numero(f['Altura (m)']);
    if (alt != null && !(alt >= 1.4 && alt <= 2.2)) problemas.push(`altura rara: ${alt}`);
    d.altura = alt == null ? null : Math.round(alt * 100) / 100;
  } else {
    d.cargo = texto(f['Cargo']);
    if (!CARGO_CORTO[d.cargo]) problemas.push(`cargo "${d.cargo}" no válido`);
    d.cargoCorto = CARGO_CORTO[d.cargo];
  }
  d.nacionalidad = nac;
  d.lugarNacimiento = texto(f['Lugar de nacimiento']) || '';
  d.provinciaNacimiento = texto(f['Provincia / región']) || '';
  const fn = fechaISO(f['Fecha de nacimiento']);
  if (fn === undefined) problemas.push('fecha de nacimiento no válida');
  d.fechaNacimiento = fn || '';
  let img = texto(f['Imagen']);
  const carpeta = tipo === 'jugador' ? 'img/jugadores/' : 'img/entrenadores/';
  if (!img && apodo) img = `${carpeta}${apodo.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '')}.webp`;
  else if (img && !/^https?:\/\//.test(img) && !img.startsWith('img/')) img = carpeta + img;
  d.imagen = img;
  if (tipo === 'jugador' && norm(f['Fallecido']) === 'si') {
    d.fallecido = true;
    const ff = fechaISO(f['Fecha de fallecimiento']);
    if (ff === undefined) problemas.push('fecha de fallecimiento no válida');
    if (ff) d.fechaFallecimiento = ff;
  }

  const codigo = codigoDe(d.nombreCompleto);
  const maestro = tipo === 'jugador' ? MJ : ME;
  if (maestro[codigo]) problemas.push(`ya existe en la web (código ${codigo})`);
  const mismoApodo = Object.entries({ ...MJ, ...ME })
    .filter(([k, x]) => apodo && norm(x.apodo) === norm(apodo) && k !== codigo)
    .map(([k]) => k);
  if (mismoApodo.length) problemas.push(`el apodo "${apodo}" ya lo usa ${mismoApodo.join(', ')}`);
  return { codigo, d, problemas, fila: f._fila, apodo };
}

function bloquesSeleccion(filasSel, conjunto, entrenador) {
  const porApodo = {};
  const problemas = [];
  filasSel.forEach((f) => {
    const apodo = texto(f['Apodo del jugador'] ?? f['Apodo del entrenador']);
    const pais = texto(f['País']);
    const cat = texto(f['Categoría']);
    const destino = conjunto.find((p) => norm(p.apodo) === norm(apodo));
    if (!destino) {
      problemas.push(`fila ${f._fila}: "${apodo}" no está entre los nuevos que se importan (si ya existía en la web, su selección se mete a mano)`);
      return;
    }
    const cod = BANDERAS[norm(pais)];
    if (!cod) {
      problemas.push(`fila ${f._fila}: no conozco la bandera de "${pais}" (dime el código de 2 letras y lo añado)`);
      return;
    }
    const tipo = entrenador ? 'Principal' : texto(f['Tipo']) || 'Principal';
    const k = `${destino.codigo}|${tipo}|${pais}`;
    porApodo[k] = porApodo[k] || {
      destino,
      tipo,
      bloque: { pais, bandera: `https://flagcdn.com/16x12/${cod}.webp`, datos: [] },
    };
    const n = (c) => numero(f[c]) || 0;
    porApodo[k].bloque.datos.push(
      entrenador
        ? { categoria: cat, partidos: n('Partidos'), victorias: n('Victorias'), empates: n('Empates'), derrotas: n('Derrotas') }
        : { categoria: cat, partidos: n('Partidos'), goles: n('Goles'), asistencias: n('Asistencias'), minutos: n('Minutos'), amarillas: n('Amarillas'), rojas: n('Rojas') },
    );
  });
  Object.values(porApodo).forEach(({ destino, tipo, bloque }) => {
    if (entrenador) destino.d.seleccionComoEntrenador = bloque;
    else if (tipo === 'Principal') {
      if (destino.d.seleccion) problemas.push(`${destino.apodo}: dos selecciones "Principal"; la segunda va como "Otra"`);
      else destino.d.seleccion = bloque;
    } else (destino.d.otrasSelecciones = destino.d.otrasSelecciones || []).push(bloque);
  });
  return problemas;
}

// ── Escritura con el mismo estilo que el archivo ────────────────
function aTexto(v, sangria) {
  const pad = ' '.repeat(sangria);
  if (v === null) return 'null';
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x !== 'object')) return `[${v.map((x) => aTexto(x, 0)).join(', ')}]`;
    return `[\n${v.map((x) => `${pad}  ${aTexto(x, sangria + 2)},`).join('\n')}\n${pad}]`;
  }
  if (typeof v === 'object')
    return `{\n${Object.entries(v)
      .filter(([, x]) => x !== undefined)
      .map(([k, x]) => `${pad}  ${k}: ${aTexto(x, sangria + 2)},`)
      .join('\n')}\n${pad}}`;
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  return String(v);
}
const entrada = (p) => `  '${p.codigo}': ${aTexto(p.d, 2)},`;

function insertarAlFinalDe(fuente, marcadorObjeto, bloques) {
  if (!bloques.length) return fuente;
  const ini = fuente.indexOf(marcadorObjeto);
  if (ini < 0) throw new Error(`No encuentro ${marcadorObjeto} en data-jugadores.js`);
  const fin = fuente.indexOf('\n};', ini);
  if (fin < 0) throw new Error(`No encuentro el cierre de ${marcadorObjeto}`);
  const NL = fuente.includes('\r\n') ? '\r\n' : '\n';
  const texto = bloques.join('\n').replace(/\n/g, NL);
  return fuente.slice(0, fin) + NL + texto + fuente.slice(fin);
}

async function main() {
  const ruta = path.resolve(RAIZ, excel);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(ruta);

  const leer = (n) => filas(wb.getWorksheet(n));
  const jug = leer('Jugadores').map((f) => construirPersona(f, 'jugador'));
  const ent = leer('Entrenadores').map((f) => construirPersona(f, 'entrenador'));

  // Apodos repetidos dentro del propio Excel.
  [...jug, ...ent].forEach((p, i, todos) => {
    if (p.apodo && todos.findIndex((x) => norm(x.apodo) === norm(p.apodo)) !== i)
      p.problemas.push(`apodo "${p.apodo}" repetido dentro del Excel`);
  });
  [...jug, ...ent].forEach((p) => {
    if (SALTAR.has(p.apodo)) p.problemas.push('dejado fuera a propósito (--saltar)');
  });

  const okJ = jug.filter((p) => !p.problemas.length);
  const okE = ent.filter((p) => !p.problemas.length);
  const avisos = [
    ...bloquesSeleccion(leer('Seleccion'), okJ, false),
    ...bloquesSeleccion(leer('Seleccion entrenador'), okE, true),
  ];
  leer('Posiciones anteriores').forEach((f) => {
    const p = okJ.find((x) => norm(x.apodo) === norm(f['Apodo del jugador']));
    if (!p) return avisos.push(`Posiciones anteriores fila ${f._fila}: "${f['Apodo del jugador']}" no está entre los nuevos`);
    const pos = texto(f['Posición']);
    const corta = texto(f['Posición corta']);
    if (!CORTAS_DE[pos] || !CORTAS_DE[pos].includes(corta))
      return avisos.push(`Posiciones anteriores fila ${f._fila}: "${corta}" no casa con "${pos}"`);
    (p.d.posiciones = p.d.posiciones || []).push({ desde: numero(f['Desde (año)']), hasta: numero(f['Hasta (año)']), posicion: pos, posicionCorta: corta });
  });

  console.log(`\nExcel: ${path.relative(RAIZ, ruta)}\n`);
  const lineas = (lista, etiqueta) =>
    lista.forEach((p) => {
      const extra = [p.d.seleccion && 'selección', p.d.otrasSelecciones && 'otras selecciones', p.d.posiciones && 'posiciones anteriores', p.d.seleccionComoEntrenador && 'selección']
        .filter(Boolean)
        .join(', ');
      if (p.problemas.length) console.log(`  ✖ ${etiqueta} fila ${p.fila} ${p.apodo || ''}: ${p.problemas.join('; ')}`);
      else console.log(`  ✔ ${etiqueta} ${p.apodo} → ${p.codigo}${extra ? ` (+ ${extra})` : ''}`);
    });
  lineas(jug, 'Jugador');
  lineas(ent, 'Entrenador');
  avisos.forEach((a) => console.log(`  ⚠ ${a}`));

  if (!APLICAR) {
    console.log(`\nSolo revisión: no se ha cambiado nada. Para meter los ${okJ.length + okE.length} correctos, añade --aplicar.`);
    return;
  }
  let fuente = fs.readFileSync(ARCHIVO_DATOS, 'utf8');
  fuente = insertarAlFinalDe(fuente, 'CLUB_DATA.jugadoresMaestro = {', okJ.map(entrada));
  fuente = insertarAlFinalDe(fuente, 'CLUB_DATA.entrenadorMaestro = {', okE.map(entrada));
  const prueba = { window: {} };
  vm.createContext(prueba);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js', 'data-club.js'), 'utf8').replace(/^const CLUB_DATA/m, 'var CLUB_DATA'), prueba);
  vm.runInContext(fuente, prueba); // si algo quedara mal escrito, falla aquí y no se guarda
  fs.writeFileSync(ARCHIVO_DATOS, fuente);
  console.log(`\n✔ Añadidos ${okJ.length} jugador(es) y ${okE.length} entrenador(es) a js/data-jugadores.js`);
}

main().catch((e) => {
  console.error('✖', e.message);
  process.exit(1);
});
