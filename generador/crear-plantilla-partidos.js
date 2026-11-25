#!/usr/bin/env node
/**
 * crear-plantilla-partidos.js — `npm run plantilla-partidos -- 2007-08`
 *
 * Crea un Excel para meter los partidos de una temporada pasada
 * (js/data-historico.js) sin escribir el mismo partido una y otra vez:
 *
 *   • Partidos      → cada partido del equipo, UNA sola vez.
 *   • Plantilla     → los jugadores de esa temporada (dorsal, posición...).
 *   • Entrenadores  → el cuerpo técnico.
 *   • Actuaciones   → una fila por jugador y partido: solo Nº de partido,
 *                     jugador, minutos, goles, asistencias y tarjetas.
 *                     Fecha, rival y resultado salen solos.
 *
 * Si la temporada ya existe en data-historico.js, el Excel sale RELLENO
 * con lo que ya hay metido (partidos, jugadores y sus actuaciones), para
 * seguir desde ahí. Sin temporada crea excel/plantilla-partidos.xlsx vacío.
 *
 * Nunca pisa un Excel que ya exista (podría tener trabajo tuyo dentro);
 * para rehacerlo, añade --sobrescribir.
 *
 * Después: `npm run importar-partidos -- "excel/partidos-2007-08.xlsx"`.
 */

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const C = require('./partidos-excel-comun');

const args = process.argv.slice(2);
const SOBRESCRIBIR = args.includes('--sobrescribir');
// --desde "excel/partidos-2007-08.xlsx": rehace ese Excel con el formato
// nuevo conservando todo lo que tenga escrito (no mira data-historico.js).
const iDesde = args.indexOf('--desde');
const DESDE = iDesde >= 0 ? args[iDesde + 1] : null;
let TEMPORADA =
  args.find(
    (a, i) => !a.startsWith('--') && !(iDesde >= 0 && i === iDesde + 1),
  ) || null;
if (TEMPORADA && !/^\d{4}-\d{2}$/.test(TEMPORADA)) {
  console.error('La temporada va así: 2007-08');
  process.exit(1);
}
let SALIDA = DESDE
  ? path.resolve(C.RAIZ, DESDE)
  : path.join(
      C.RAIZ,
      'excel',
      TEMPORADA ? `partidos-${TEMPORADA}.xlsx` : 'plantilla-partidos.xlsx',
    );

const datos = C.cargarDatos();
const L = C.listas(datos);
let T = TEMPORADA && !DESDE ? datos.TEMPORADAS[TEMPORADA] : null;

// ── Estilos (los mismos que la plantilla de jugadores) ──────────
const AZUL = 'FF1A365D';
const ORO = 'FFC9A227';
const GRIS = 'FFE5E7EB';
const GRIS_TXT = 'FF4B5563';

const FILAS = {
  Partidos: 150,
  Plantilla: 80,
  Entrenadores: 15,
  Actuaciones: 1500,
};

function cabecera(ws, columnas, filas) {
  ws.columns = columnas.map((c) => ({
    header: c.titulo,
    key: c.clave,
    width: c.ancho || 14,
  }));
  const fila = ws.getRow(1);
  fila.height = 36;
  columnas.forEach((col, i) => {
    const cell = fila.getCell(i + 1);
    const tipo = col.tipo || 'opcional';
    cell.font = {
      bold: true,
      color: { argb: tipo === 'opcional' ? 'FFFFFFFF' : 'FF1A1A1A' },
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: { obligatoria: ORO, opcional: AZUL, auto: GRIS }[tipo] },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    if (col.nota) cell.note = col.nota;
    if (tipo === 'auto') {
      for (let r = 2; r <= filas + 1; r++) {
        const c = ws.getCell(r, i + 1);
        c.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF3F4F6' },
        };
        c.font = { color: { argb: GRIS_TXT }, italic: true };
      }
    }
  });
  ws.views = [{ state: 'frozen', ySplit: 1 }];
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columnas.length },
  };
}

const letra = (n) => String.fromCharCode(64 + n);
function validar(ws, col, filas, regla) {
  for (let r = 2; r <= filas + 1; r++)
    ws.getCell(`${col}${r}`).dataValidation = regla;
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
const fechaRegla = {
  type: 'date',
  operator: 'between',
  allowBlank: true,
  formulae: [new Date(1900, 0, 1), new Date(2100, 11, 31)],
  showErrorMessage: true,
  error: 'Escribe una fecha válida (dd/mm/aaaa).',
};
// Texto de cada partido en el desplegable de Actuaciones. Tiene que
// coincidir con la fórmula de la columna N de Partidos.
const dd = (n) => String(n).padStart(2, '0');
function textoPartido(p) {
  const [a, m, d] = String(p.fecha).split('-');
  const j = typeof p.jornada === 'number' ? `J${p.jornada}` : p.jornada;
  return `${p.n} · ${j} · ${d}/${m}/${a} · ${p.local} ${p.golesLocal ?? ''}-${p.golesVisitante ?? ''} ${p.visitante}`;
}
const fechaExcel = (iso) => {
  const [a, m, d] = String(iso).split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, d));
};

// ── Lo que ya hay de esa temporada ───────────────────────────────
function extraerTemporada(t) {
  // Un mismo partido viene repetido en cada jugador que lo jugó. Se junta
  // por fecha (el Oviedo no juega dos veces el mismo día) y, si algún
  // jugador lo tiene escrito distinto, se queda lo que tiene la mayoría y
  // se avisa.
  const partidos = [];
  const porFecha = new Map();
  const CAMPOS = [
    'competicion',
    'jornada',
    'local',
    'visitante',
    'golesLocal',
    'golesVisitante',
    'penaltisLocal',
    'penaltisVisitante',
  ];
  const registrar = (p, quien) => {
    let m = porFecha.get(p.fecha);
    if (!m) {
      m = { fecha: p.fecha, prorroga: false, entrenador: null, votos: {} };
      CAMPOS.forEach((c) => (m.votos[c] = new Map()));
      porFecha.set(p.fecha, m);
      partidos.push(m);
    }
    CAMPOS.forEach((c) => {
      const v = p[c] ?? null;
      const k = JSON.stringify(v);
      const voto = m.votos[c].get(k) || { v, quien: [] };
      voto.quien.push(quien);
      m.votos[c].set(k, voto);
    });
    if (p.minutos > 90 || p.penaltisLocal != null) m.prorroga = true;
    return m;
  };
  const plantilla = (t.jugadores || []).map((j) => {
    const d = datos.MJ[j.codigo];
    const estados =
      j.estados ||
      (j.estado ? [{ tipo: j.estado, club: j.cedidoEn || null }] : []);
    const cedido = estados.find((e) => e.tipo === 'cedido');
    const baja = estados.some((e) => e.tipo === 'baja');
    return {
      j,
      nombre: d ? C.etiqueta(d) : j.codigo,
      situacion:
        cedido && baja
          ? 'Cedido y después baja'
          : cedido
            ? 'Cedido'
            : baja
              ? 'Baja'
              : null,
      cedidoEn: cedido ? cedido.club || null : null,
      actuaciones: (j.partidos || []).map((p) => ({
        m: registrar(p, j.codigo),
        p,
      })),
    };
  });
  const tecnicos = (t.cuerpoTecnico || []).map((e) => {
    const d = datos.ME[e.codigo];
    const nombre = d ? C.etiqueta(d) : e.nombre || e.codigo;
    (e.partidos || []).forEach((p) => {
      const m = registrar(p, e.codigo);
      if (
        (e.esPrincipal || e.cargo === 'Entrenador Principal') &&
        !m.entrenador
      )
        m.entrenador = nombre;
    });
    return { e, nombre };
  });
  const conflictos = [];
  // Para la competición manda el nombre que usan las estadísticas del
  // equipo de esa temporada (así no quedan dos nombres para la misma copa).
  const oficiales = new Set(
    Object.keys((t.estadisticasEquipo && t.estadisticasEquipo.desglose) || {}),
  );
  partidos.forEach((m) => {
    Object.entries(m.votos).forEach(([campo, votos]) => {
      const peso = (x) =>
        x.quien.length +
        (campo === 'competicion' && oficiales.has(x.v) ? 1000 : 0);
      const lista = [...votos.values()].sort((a, b) => peso(b) - peso(a));
      m[campo] = lista[0].v;
      if (lista.length > 1)
        conflictos.push(
          `${m.fecha} ${m.local ?? ''}: ${campo} distinto según el jugador → se deja "${lista[0].v}"; ` +
            lista
              .slice(1)
              .map((x) => `"${x.v}" en ${x.quien.join(', ')}`)
              .join('; '),
        );
    });
    delete m.votos;
  });
  partidos.sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  partidos.forEach((m, i) => (m.n = i + 1));
  return { partidos, plantilla, tecnicos, conflictos };
}

// Lee un Excel de partidos ya rellenado (cualquier versión de esta
// plantilla) y lo deja con la misma forma que extraerTemporada().
async function leerExcel(ruta) {
  const v = (c) => {
    let x = c.value;
    if (x && typeof x === 'object' && !(x instanceof Date)) {
      if ('formula' in x || 'sharedFormula' in x) return null;
      if ('richText' in x) x = x.richText.map((t) => t.text).join('');
      else if ('text' in x) x = x.text;
    }
    return x === '' ? null : (x ?? null);
  };
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(ruta);
  const hoja = (n) => wb.getWorksheet(n);
  const conf = {};
  hoja('Temporada').eachRow((row, i) => {
    if (i > 1) conf[C.norm(v(row.getCell(1)))] = v(row.getCell(2));
  });
  TEMPORADA = String(conf['temporada'] || '');
  const iso = (x) =>
    x instanceof Date
      ? x.toISOString().slice(0, 10)
      : x == null
        ? null
        : String(x);
  const partidos = [];
  hoja('Partidos').eachRow((row, i) => {
    if (i === 1) return;
    const c = (k) => v(row.getCell(k));
    if ([2, 3, 4, 5, 6, 7, 8].every((k) => c(k) == null)) return;
    partidos.push({
      n: c(1),
      competicion: c(2),
      jornada: c(3),
      fecha: iso(c(4)),
      local: c(5),
      visitante: c(6),
      golesLocal: c(7),
      golesVisitante: c(8),
      prorroga: C.norm(c(9)) === 'si',
      penaltisLocal: c(10),
      penaltisVisitante: c(11),
      entrenador: c(13),
    });
  });
  const porN = new Map(partidos.map((p) => [Number(p.n), p]));
  const plantilla = [];
  hoja('Plantilla').eachRow((row, i) => {
    const c = (k) => v(row.getCell(k));
    if (i === 1 || c(1) == null) return;
    plantilla.push({
      nombre: c(1),
      j: {
        dorsal: c(3) ?? '-',
        posicion: c(4),
        enClubDesde: c(5),
        contratoHasta: c(6),
      },
      situacion: c(7),
      cedidoEn: c(8),
      actuaciones: [],
      crudas: [],
    });
  });
  const tecnicos = [];
  hoja('Entrenadores').eachRow((row, i) => {
    const c = (k) => v(row.getCell(k));
    if (i === 1 || c(1) == null) return;
    tecnicos.push({
      nombre: c(1),
      e: {
        cargo: c(3),
        enClubDesde: c(4),
        contratoHasta: c(5),
        estado: C.norm(c(6)) === 'baja' ? 'baja' : null,
      },
    });
  });
  // Actuaciones: se conservan TODAS las filas tal cual, en su orden.
  const actuaciones = [];
  hoja('Actuaciones').eachRow((row, i) => {
    const c = (k) => v(row.getCell(k));
    if (i === 1) return;
    const vals = [1, 5, 7, 8, 9, 10, 11].map(c);
    if (vals.every((x) => x == null)) return;
    const num =
      vals[0] == null ? null : Number(String(vals[0]).match(/^\s*(\d+)/)?.[1]);
    actuaciones.push({
      partido: porN.get(num) || null,
      original: vals[0],
      vals,
    });
  });
  return { partidos, plantilla, tecnicos, conflictos: [], actuaciones, conf };
}

async function main() {
  if (fs.existsSync(SALIDA) && !SOBRESCRIBIR && !DESDE) {
    console.error(
      `✖ Ya existe ${path.relative(C.RAIZ, SALIDA)} y puede tener datos tuyos.`,
    );
    console.error(
      '  Ábrelo y sigue rellenándolo, o añade --sobrescribir para crearlo de nuevo.',
    );
    process.exit(1);
  }
  const previo = DESDE
    ? await leerExcel(SALIDA)
    : T
      ? extraerTemporada(T)
      : null;

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Sangre Carbayona';
  wb.calcProperties.fullCalcOnLoad = true;

  // ── Instrucciones ──
  const ins = wb.addWorksheet('Instrucciones', {
    properties: { tabColor: { argb: ORO } },
  });
  ins.getColumn(1).width = 120;
  [
    [
      'PLANTILLA DE PARTIDOS DE UNA TEMPORADA PASADA (js/data-historico.js)',
      true,
    ],
    [''],
    [
      '• Columnas en DORADO = obligatorias; en AZUL = opcionales; en GRIS = se rellenan solas (no hace falta tocarlas).',
    ],
    [
      '• Usa los desplegables. Pasa el ratón por el título de una columna para ver la explicación.',
    ],
    [''],
    ['ORDEN RECOMENDADO', true],
    [
      '1. Temporada: comprueba la temporada (2007-08). Liga, grupo y posición solo se usan si la temporada todavía no existe en la web.',
    ],
    [
      '2. Partidos: TODOS los partidos oficiales del equipo esa temporada (liga, copa, ascenso), cada uno UNA sola vez. El Nº es el que usarás en Actuaciones.',
    ],
    [
      '   Resultado sale solo. Si hubo penaltis, rellena las dos columnas de penaltis: el partido cuenta como V/D según la tanda (no suman goles).',
    ],
    [
      '   Entrenador: quién dirigió ese partido. Si en toda la temporada hubo un solo entrenador principal, puedes dejarlo vacío.',
    ],
    [
      '3. Plantilla: un jugador por fila. Si no está en el desplegable, escríbelo y acepta el aviso (saldrá como jugador sin ficha hasta que lo metas con la plantilla de jugadores).',
    ],
    ['4. Entrenadores: igual que la plantilla.'],
    [
      '5. Actuaciones: una fila por jugador y partido que JUGÓ. Elige el partido en la lista y el jugador; fecha, competición y resultado aparecen solos.',
    ],
    [
      '   Minutos vacío = 90 (o 120 si el partido tuvo prórroga). Goles/asistencias vacíos = 0.',
    ],
    [
      '   PORTEROS: en "Goles" van los goles ENCAJADOS. Si lo dejas vacío y jugó el partido entero, se ponen solos los del rival.',
    ],
    [
      '   Tarjetas: Amarilla / Roja directa / Doble amarilla (expulsado) / Amarilla y luego roja directa (dos acciones distintas).',
    ],
    [
      '   Partido: elígelo en el desplegable (escribe un trozo para buscar: la fecha, el rival, J19...). Consejo: escribe el jugador una vez y arrástralo hacia abajo para todos sus partidos.',
    ],
    [''],
    ['CÓMO SE SUBE', true],
    [
      'npm run importar-partidos -- "excel/partidos-2007-08.xlsx"           → solo REVISA y enseña lo que haría (no cambia nada).',
    ],
    [
      'npm run importar-partidos -- "excel/partidos-2007-08.xlsx" --aplicar → lo mete en js/data-historico.js. Después, npm run subir como siempre.',
    ],
    [
      'El Excel es la versión completa de la temporada: al aplicarlo, los jugadores y entrenadores de esa temporada se reescriben con lo que hay aquí.',
    ],
    [
      'Si la temporada ya existía, este Excel ya trae dentro todo lo que había metido, así que no se pierde nada.',
    ],
  ].forEach(([texto, negrita], i) => {
    const c = ins.getCell(`A${i + 1}`);
    c.value = texto;
    c.font = {
      bold: !!negrita,
      size: negrita ? 13 : 11,
      color: { argb: negrita ? AZUL : 'FF1F2937' },
    };
    c.alignment = { wrapText: true, vertical: 'top' };
  });

  // ── Listas (oculta) ──
  const LS = wb.addWorksheet('Listas', { state: 'veryHidden' });
  const columnasListas = {
    A: ['Competición', L.competiciones],
    B: [
      'Jornada',
      [...Array.from({ length: 42 }, (_, i) => i + 1), ...C.RONDAS],
    ],
    C: ['Equipo', L.equipos],
    D: ['Jugador', L.jugadores.map((x) => x[0])],
    E: ['Código jugador', L.jugadores.map((x) => x[1])],
    F: ['Entrenador', L.entrenadores.map((x) => x[0])],
    G: ['Código entrenador', L.entrenadores.map((x) => x[1])],
    H: ['Posición', C.POSICIONES],
    I: ['Situación', C.SITUACIONES],
    J: ['Tarjetas', Object.keys(C.TARJETAS)],
    K: ['Sí/No', ['Sí', 'No']],
    L: ['Cargo', C.CARGOS],
    M: ['Club', L.clubes],
  };
  const rango = {};
  Object.entries(columnasListas).forEach(([col, [titulo, valores]]) => {
    LS.getCell(`${col}1`).value = titulo;
    valores.forEach((v, i) => (LS.getCell(`${col}${i + 2}`).value = v));
    rango[titulo] =
      `Listas!$${col}$2:$${col}$${Math.max(valores.length + 1, 2)}`;
  });

  // ── Temporada ──
  const TS = wb.addWorksheet('Temporada', {
    properties: { tabColor: { argb: ORO } },
  });
  TS.getColumn(1).width = 34;
  TS.getColumn(2).width = 30;
  TS.getColumn(3).width = 70;
  [
    ['Pregunta', 'Respuesta', 'Explicación'],
    ['Temporada', TEMPORADA || '', 'Así: 2007-08'],
    [
      'Competición de liga',
      T ? T.competicion : '',
      'Solo si la temporada es nueva. También se usa si dejas vacía la competición de un partido.',
    ],
    [
      'Grupo',
      T ? (T.grupo === 'null' ? '' : T.grupo) : '',
      'Solo si la temporada es nueva. P. ej. "Grupo: 2". Vacío si no había grupos.',
    ],
    [
      'Posición final en liga',
      T && T.estadisticasEquipo ? (T.estadisticasEquipo.posicion ?? '') : '',
      'Solo si la temporada es nueva.',
    ],
    [
      'Recalcular estadísticas del equipo',
      'No',
      'Sí = rehace las estadísticas del equipo (partidos, V/E/D, goles por competición) a partir de la hoja Partidos. Úsalo cuando la hoja tenga TODOS los partidos.',
    ],
  ]
    .map((f) =>
      previo && previo.conf && C.norm(f[0]) in previo.conf
        ? [f[0], previo.conf[C.norm(f[0])] ?? '', f[2]]
        : f,
    )
    .forEach((fila, i) => {
      fila.forEach((v, j) => {
        const c = TS.getCell(i + 1, j + 1);
        c.value = v;
        c.alignment = { wrapText: true, vertical: 'middle' };
        if (i === 0) {
          c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          c.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: AZUL },
          };
        } else if (j === 0) c.font = { bold: true };
        else if (j === 2) c.font = { color: { argb: GRIS_TXT }, italic: true };
      });
    });
  TS.getCell('B3').dataValidation = lista(rango['Competición'], false);
  TS.getCell('B6').dataValidation = lista(rango['Sí/No']);

  // ── Partidos ──
  const P = wb.addWorksheet('Partidos', {
    properties: { tabColor: { argb: AZUL } },
  });
  const nP = FILAS.Partidos;
  cabecera(
    P,
    [
      {
        titulo: 'Nº',
        clave: 'n',
        tipo: 'obligatoria',
        ancho: 6,
        nota: 'Número del partido. Es el que se pone en la hoja Actuaciones. Ya vienen numerados.',
      },
      {
        titulo: 'Competición',
        clave: 'competicion',
        ancho: 30,
        nota: 'Vacío = la liga de la hoja Temporada.',
      },
      {
        titulo: 'Jornada / Ronda',
        clave: 'jornada',
        tipo: 'obligatoria',
        ancho: 24,
        nota: 'Número de jornada en liga; en copa o ascenso, la ronda (Primera Ronda, Semifinal (Ida)...).',
      },
      { titulo: 'Fecha', clave: 'fecha', tipo: 'obligatoria', ancho: 13 },
      {
        titulo: 'Local',
        clave: 'local',
        tipo: 'obligatoria',
        ancho: 30,
        nota: 'Elige de la lista para escribir el nombre igual que en el resto de la web. Si es nuevo, escríbelo y acepta el aviso.',
      },
      {
        titulo: 'Visitante',
        clave: 'visitante',
        tipo: 'obligatoria',
        ancho: 30,
      },
      { titulo: 'Goles local', clave: 'gl', tipo: 'obligatoria', ancho: 8 },
      {
        titulo: 'Goles visitante',
        clave: 'gv',
        tipo: 'obligatoria',
        ancho: 10,
      },
      {
        titulo: 'Prórroga',
        clave: 'prorroga',
        ancho: 9,
        nota: 'Sí si hubo prórroga: los minutos vacíos en Actuaciones serán 120 en vez de 90. Si hay penaltis se da por hecho.',
      },
      {
        titulo: 'Penaltis local',
        clave: 'pl',
        ancho: 9,
        nota: 'Solo si se decidió en la tanda de penaltis.',
      },
      { titulo: 'Penaltis visitante', clave: 'pv', ancho: 10 },
      {
        titulo: 'Resultado',
        clave: 'res',
        tipo: 'auto',
        ancho: 10,
        nota: 'Sale solo: V, E o D para el Real Oviedo.',
      },
      {
        titulo: 'Entrenador',
        clave: 'entrenador',
        ancho: 28,
        nota: 'Quién dirigió el partido (de la hoja Entrenadores). Vacío vale si solo hubo un entrenador principal.',
      },
      {
        titulo: 'Partido (para elegir en Actuaciones)',
        clave: 'texto',
        tipo: 'auto',
        ancho: 60,
        nota: 'Sale solo. Es lo que aparece en el desplegable "Partido" de la hoja Actuaciones.',
      },
    ],
    nP,
  );
  for (let r = 2; r <= nP + 1; r++) {
    P.getCell(`A${r}`).value = r - 1;
    P.getCell(`D${r}`).numFmt = 'dd/mm/yyyy';
    const d = `IF(E${r}="${C.CLUB}",G${r}-H${r},H${r}-G${r})`;
    const dp = `IF(E${r}="${C.CLUB}",J${r}-K${r},K${r}-J${r})`;
    const fecha = `RIGHT("0"&DAY(D${r}),2)&"/"&RIGHT("0"&MONTH(D${r}),2)&"/"&YEAR(D${r})`;
    P.getCell(`N${r}`).value = {
      formula: `IF(OR(D${r}="",E${r}="",F${r}=""),"",A${r}&" · "&IF(ISNUMBER(C${r}),"J"&C${r},C${r})&" · "&${fecha}&" · "&E${r}&" "&G${r}&"-"&H${r}&" "&F${r})`,
    };
    P.getCell(`L${r}`).value = {
      formula: `IF(OR(G${r}="",H${r}=""),"",IF(AND(E${r}<>"${C.CLUB}",F${r}<>"${C.CLUB}"),"¿Oviedo?",IF(${d}>0,"V",IF(${d}<0,"D",IF(AND(J${r}<>"",K${r}<>""),IF(${dp}>0,"V (pen.)","D (pen.)"),"E")))))`,
    };
  }
  validar(P, 'A', nP, entero(1, 999));
  validar(P, 'B', nP, lista(rango['Competición'], false));
  validar(P, 'C', nP, lista(rango['Jornada'], false));
  validar(P, 'D', nP, fechaRegla);
  validar(P, 'E', nP, lista(rango['Equipo'], false));
  validar(P, 'F', nP, lista(rango['Equipo'], false));
  ['G', 'H', 'J', 'K'].forEach((c) => validar(P, c, nP, entero(0, 30)));
  validar(P, 'I', nP, lista(rango['Sí/No']));
  validar(
    P,
    'M',
    nP,
    lista(
      `Entrenadores!$A$2:$A$${FILAS.Entrenadores + 1}`,
      false,
      'Ese entrenador no está en la hoja Entrenadores.',
    ),
  );

  // ── Plantilla ──
  const J = wb.addWorksheet('Plantilla', {
    properties: { tabColor: { argb: AZUL } },
  });
  const nJ = FILAS.Plantilla;
  cabecera(
    J,
    [
      {
        titulo: 'Jugador',
        clave: 'jugador',
        tipo: 'obligatoria',
        ancho: 40,
        nota: 'Elige de la lista (apodo y nombre completo, como en data-jugadores.js). Escribe un trozo del nombre para buscar.',
      },
      {
        titulo: 'Código interno',
        clave: 'codigo',
        tipo: 'auto',
        ancho: 32,
        nota: 'Sale solo. "(nuevo)" = no tiene ficha en data-jugadores.js; se creará el código a partir del nombre.',
      },
      {
        titulo: 'Dorsal',
        clave: 'dorsal',
        ancho: 8,
        nota: 'Vacío = sin dorsal ("-").',
      },
      {
        titulo: 'Posición',
        clave: 'posicion',
        ancho: 22,
        nota: 'Posición en el campo esa temporada. Vacío = la de su ficha.',
      },
      {
        titulo: 'En el club desde',
        clave: 'desde',
        tipo: 'obligatoria',
        ancho: 10,
        nota: 'Año, p. ej. 2006.',
      },
      {
        titulo: 'En el club hasta',
        clave: 'hasta',
        tipo: 'obligatoria',
        ancho: 10,
        nota: 'Año en que termina contrato o se marcha, p. ej. 2008.',
      },
      {
        titulo: 'Situación',
        clave: 'situacion',
        ancho: 20,
        nota: 'Vacío = sigue en el club. Baja = se marchó durante/al final de la temporada. Cedido = cedido a otro club.',
      },
      {
        titulo: 'Cedido en (club)',
        clave: 'cedidoEn',
        ancho: 30,
        nota: 'Solo si está cedido: a qué club.',
      },
    ],
    nJ,
  );
  for (let r = 2; r <= nJ + 1; r++) {
    J.getCell(`B${r}`).value = {
      formula: `IF(A${r}="","",IFERROR(VLOOKUP(A${r},${rango['Jugador'].replace(':$D$', ':$E$')},2,FALSE),"(nuevo)"))`,
    };
  }
  validar(
    J,
    'A',
    nJ,
    lista(
      rango['Jugador'],
      false,
      'No está en data-jugadores.js. Si es un jugador nuevo, pulsa "Sí" (saldrá sin ficha hasta que lo metas).',
    ),
  );
  validar(J, 'C', nJ, entero(0, 99));
  validar(J, 'D', nJ, lista(rango['Posición'], false));
  validar(J, 'E', nJ, entero(1900, 2100));
  validar(J, 'F', nJ, entero(1900, 2100));
  validar(J, 'G', nJ, lista(rango['Situación']));
  validar(J, 'H', nJ, lista(rango['Club'], false));

  // ── Entrenadores ──
  const E = wb.addWorksheet('Entrenadores', {
    properties: { tabColor: { argb: AZUL } },
  });
  const nE = FILAS.Entrenadores;
  cabecera(
    E,
    [
      {
        titulo: 'Entrenador',
        clave: 'entrenador',
        tipo: 'obligatoria',
        ancho: 40,
      },
      { titulo: 'Código interno', clave: 'codigo', tipo: 'auto', ancho: 32 },
      {
        titulo: 'Cargo',
        clave: 'cargo',
        ancho: 22,
        nota: 'Vacío = Entrenador Principal.',
      },
      {
        titulo: 'En el club desde',
        clave: 'desde',
        tipo: 'obligatoria',
        ancho: 10,
      },
      {
        titulo: 'En el club hasta',
        clave: 'hasta',
        tipo: 'obligatoria',
        ancho: 10,
      },
      {
        titulo: 'Situación',
        clave: 'situacion',
        ancho: 14,
        nota: 'Baja = fue destituido o se marchó durante la temporada.',
      },
    ],
    nE,
  );
  for (let r = 2; r <= nE + 1; r++) {
    E.getCell(`B${r}`).value = {
      formula: `IF(A${r}="","",IFERROR(VLOOKUP(A${r},${rango['Entrenador'].replace(':$F$', ':$G$')},2,FALSE),"(nuevo)"))`,
    };
  }
  validar(
    E,
    'A',
    nE,
    lista(
      rango['Entrenador'],
      false,
      'No está en data-jugadores.js (entrenadorMaestro). Si es nuevo, pulsa "Sí".',
    ),
  );
  validar(E, 'C', nE, lista(rango['Cargo']));
  validar(E, 'D', nE, entero(1900, 2100));
  validar(E, 'E', nE, entero(1900, 2100));
  validar(E, 'F', nE, lista(`"Baja"`));

  // ── Actuaciones ──
  const A = wb.addWorksheet('Actuaciones', {
    properties: { tabColor: { argb: ORO } },
  });
  const nA = FILAS.Actuaciones;
  cabecera(
    A,
    [
      {
        titulo: 'Partido (elige en la lista)',
        clave: 'n',
        tipo: 'obligatoria',
        ancho: 50,
        nota: 'Elige el partido en el desplegable. Puedes escribir un trozo para buscarlo (la fecha 06/01, el rival, J19...). El número del principio es el Nº del partido.',
      },
      { titulo: 'Fecha', clave: 'fecha', tipo: 'auto', ancho: 13 },
      { titulo: 'Competición', clave: 'comp', tipo: 'auto', ancho: 26 },
      { titulo: 'Res.', clave: 'res', tipo: 'auto', ancho: 8 },
      {
        titulo: 'Jugador',
        clave: 'jugador',
        tipo: 'obligatoria',
        ancho: 36,
        nota: 'De la hoja Plantilla.',
      },
      { titulo: 'Posición', clave: 'posicion', tipo: 'auto', ancho: 16 },
      {
        titulo: 'Minutos',
        clave: 'minutos',
        ancho: 9,
        nota: 'Vacío = 90 (120 si hubo prórroga).',
      },
      {
        titulo: 'Goles (encajados si portero)',
        clave: 'goles',
        ancho: 12,
        nota: 'Jugadores: goles marcados. PORTEROS: goles ENCAJADOS (vacío y partido entero = los del rival).',
      },
      { titulo: 'Asistencias', clave: 'asistencias', ancho: 10 },
      {
        titulo: 'Tarjetas',
        clave: 'tarjetas',
        ancho: 28,
        nota: 'Vacío = ninguna.\nDoble amarilla = expulsado por segunda amarilla.\nAmarilla y luego roja directa = dos acciones distintas.',
      },
      {
        titulo: 'Goles en propia puerta',
        clave: 'propia',
        ancho: 10,
        nota: 'Solo si metió un gol en su propia portería.',
      },
    ],
    nA,
  );
  const pR = (col) => `Partidos!$${col}$2:$${col}$${nP + 1}`;
  // El número del partido es lo que hay antes del primer espacio
  // ("25 · J19 · ..." → 25); también vale si solo se escribe el número.
  const m = (r) =>
    `MATCH(IFERROR(VALUE(LEFT($A${r},FIND(" ",$A${r}&" ")-1)),$A${r}),${pR('A')},0)`;
  for (let r = 2; r <= nA + 1; r++) {
    A.getCell(`B${r}`).value = {
      formula: `IF($A${r}="","",IFERROR(INDEX(${pR('D')},${m(r)}),"¿Nº?"))`,
    };
    A.getCell(`B${r}`).numFmt = 'dd/mm/yyyy';
    A.getCell(`C${r}`).value = {
      formula: `IF($A${r}="","",IFERROR(INDEX(${pR('B')},${m(r)})&"","¿no existe ese partido?"))`,
    };
    A.getCell(`D${r}`).value = {
      formula: `IF($A${r}="","",IFERROR(INDEX(${pR('L')},${m(r)})&"",""))`,
    };
    A.getCell(`F${r}`).value = {
      formula: `IF($E${r}="","",IFERROR(INDEX(Plantilla!$D$2:$D$${nJ + 1},MATCH($E${r},Plantilla!$A$2:$A$${nJ + 1},0))&"","¿no está en Plantilla?"))`,
    };
  }
  validar(
    A,
    'A',
    nA,
    lista(
      pR('N'),
      false,
      'Ese partido no está en la lista. Elígelo en el desplegable.',
    ),
  );
  validar(
    A,
    'E',
    nA,
    lista(
      `Plantilla!$A$2:$A$${nJ + 1}`,
      true,
      'Ese jugador no está en la hoja Plantilla. Añádelo allí primero.',
    ),
  );
  validar(A, 'G', nA, entero(0, 130));
  validar(A, 'H', nA, entero(0, 20));
  validar(A, 'I', nA, entero(0, 20));
  validar(A, 'J', nA, lista(rango['Tarjetas']));
  validar(A, 'K', nA, entero(0, 5));

  // ── Relleno con lo que ya hay ──
  if (previo) {
    if (previo.partidos.length > nP || previo.plantilla.length > nJ)
      throw new Error(
        'La temporada tiene más filas de las previstas en la plantilla.',
      );
    previo.partidos.forEach((p) => {
      const r = p.n + 1;
      P.getCell(`B${r}`).value = p.competicion;
      P.getCell(`C${r}`).value = p.jornada;
      P.getCell(`D${r}`).value = fechaExcel(p.fecha);
      P.getCell(`E${r}`).value = p.local;
      P.getCell(`F${r}`).value = p.visitante;
      P.getCell(`G${r}`).value = p.golesLocal;
      P.getCell(`H${r}`).value = p.golesVisitante;
      if (p.prorroga) P.getCell(`I${r}`).value = 'Sí';
      if (p.penaltisLocal != null) {
        P.getCell(`J${r}`).value = p.penaltisLocal;
        P.getCell(`K${r}`).value = p.penaltisVisitante;
      }
      if (p.entrenador) P.getCell(`M${r}`).value = p.entrenador;
    });
    previo.plantilla.forEach((x, i) => {
      const r = i + 2;
      J.getCell(`A${r}`).value = x.nombre;
      if (x.j.dorsal !== '-' && x.j.dorsal != null && x.j.dorsal !== '')
        J.getCell(`C${r}`).value = Number(x.j.dorsal);
      if (x.j.posicion) J.getCell(`D${r}`).value = x.j.posicion;
      if (x.j.enClubDesde) J.getCell(`E${r}`).value = Number(x.j.enClubDesde);
      if (x.j.contratoHasta)
        J.getCell(`F${r}`).value = Number(x.j.contratoHasta);
      if (x.situacion) J.getCell(`G${r}`).value = x.situacion;
      if (x.cedidoEn) J.getCell(`H${r}`).value = x.cedidoEn;
    });
    previo.tecnicos.forEach((x, i) => {
      const r = i + 2;
      E.getCell(`A${r}`).value = x.nombre;
      if (x.e.cargo && x.e.cargo !== 'Entrenador Principal')
        E.getCell(`C${r}`).value = x.e.cargo;
      if (x.e.enClubDesde) E.getCell(`D${r}`).value = Number(x.e.enClubDesde);
      if (x.e.contratoHasta)
        E.getCell(`E${r}`).value = Number(x.e.contratoHasta);
      if (x.e.estado === 'baja') E.getCell(`F${r}`).value = 'Baja';
    });
    let r = 2;
    (previo.actuaciones || []).forEach(({ partido, original, vals }) => {
      A.getCell(`A${r}`).value = partido ? textoPartido(partido) : original;
      ['E', 'G', 'H', 'I', 'J', 'K'].forEach((col, k) => {
        if (vals[k + 1] != null) A.getCell(`${col}${r}`).value = vals[k + 1];
      });
      r++;
    });
    previo.plantilla.forEach((x) =>
      x.actuaciones
        .slice()
        .sort((a, b) => a.m.n - b.m.n)
        .forEach(({ m: partido, p }) => {
          A.getCell(`A${r}`).value = textoPartido(partido);
          A.getCell(`E${r}`).value = x.nombre;
          A.getCell(`G${r}`).value = p.minutos;
          A.getCell(`H${r}`).value = p.goles || 0;
          A.getCell(`I${r}`).value = p.asistencias || 0;
          const tj = C.tarjetaDe(p);
          if (tj) A.getCell(`J${r}`).value = tj;
          if (p.golesPropia) A.getCell(`K${r}`).value = p.golesPropia;
          r++;
        }),
    );
    if (r - 2 > nA)
      throw new Error('Demasiadas actuaciones para la plantilla.');
  }

  wb.views = [{ activeTab: previo ? 5 : 0 }];
  if (DESDE) SALIDA = path.resolve(C.RAIZ, DESDE);
  fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
  await wb.xlsx.writeFile(SALIDA);
  console.log(`✔ Plantilla creada: ${path.relative(C.RAIZ, SALIDA)}`);
  if (DESDE) {
    console.log(
      `  Rehecho con el formato nuevo: ${previo.partidos.length} partidos, ${previo.plantilla.length} jugadores, ${previo.tecnicos.length} entrenadores, ${previo.actuaciones.length} actuaciones conservadas.`,
    );
  } else if (previo) {
    const act = previo.plantilla.reduce((s, x) => s + x.actuaciones.length, 0);
    console.log(
      `  Rellena con lo que ya hay de ${TEMPORADA}: ${previo.partidos.length} partidos, ${previo.plantilla.length} jugadores, ${previo.tecnicos.length} entrenadores, ${act} actuaciones.`,
    );
    previo.conflictos.forEach((c) => console.log(`  ⚠ ${c}`));
  } else if (TEMPORADA) {
    console.log(
      `  ${TEMPORADA} todavía no existe en data-historico.js: rellena también la hoja Temporada.`,
    );
  }
}

main().catch((e) => {
  console.error('✖', e.message);
  process.exit(1);
});
