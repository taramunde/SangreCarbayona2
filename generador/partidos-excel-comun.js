/**
 * partidos-excel-comun.js — piezas compartidas por
 * crear-plantilla-partidos.js e importar-partidos.js.
 *
 * Carga los datos de la web, define las listas de los desplegables y la
 * forma de nombrar a jugadores/entrenadores en el Excel
 * ("Apodo (Nombre Completo)"), que es lo que luego se traduce a código.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.join(__dirname, '..');
const CLUB = 'Real Oviedo';

function cargarDatos() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  ['data-club', 'data-jugadores', 'data-historico'].forEach((f) =>
    vm.runInContext(
      fs
        .readFileSync(path.join(RAIZ, 'js', `${f}.js`), 'utf8')
        .replace(/^const CLUB_DATA/m, 'var CLUB_DATA'),
      ctx,
    ),
  );
  const CD = ctx.CLUB_DATA;
  return {
    MJ: CD.jugadoresMaestro || {},
    ME: CD.entrenadorMaestro || {},
    TEMPORADAS: CD.temporadas || {},
  };
}

const norm = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
const codigoDe = (texto) =>
  norm(texto)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Cómo sale cada persona en los desplegables del Excel.
const etiqueta = (d) =>
  d.apodo && norm(d.apodo) !== norm(d.nombreCompleto)
    ? `${d.apodo} (${d.nombreCompleto})`
    : d.nombreCompleto;

// Posición corta de la ficha maestra → posición detallada de la temporada.
const POS_DE_CORTA = {
  PO: 'Portero',
  DC: 'Central',
  LD: 'Lateral Derecho',
  LI: 'Lateral Izquierdo',
  MCD: 'Mediocentro Defensivo',
  MC: 'Mediocentro',
  MCO: 'Mediocentro Ofensivo',
  MD: 'Medio Derecho',
  MI: 'Medio Izquierdo',
  ED: 'Extremo Derecho',
  EI: 'Extremo Izquierdo',
  DL: 'Delantero Centro',
};
// Posiciones detalladas y su grupo (para ordenar en data-historico.js).
const GRUPOS = [
  ['PORTEROS', ['Portero']],
  [
    'DEFENSAS',
    [
      'Central',
      'Lateral Derecho',
      'Lateral Izquierdo',
      'Carrilero Derecho',
      'Carrilero Izquierdo',
      'Líbero',
    ],
  ],
  [
    'CENTROCAMPISTAS',
    [
      'Pivote',
      'Mediocentro Defensivo',
      'Mediocentro',
      'Mediocentro Ofensivo',
      'Mediapunta',
      'Interior Derecho',
      'Interior Izquierdo',
      'Medio Derecho',
      'Medio Izquierdo',
    ],
  ],
  [
    'DELANTEROS',
    [
      'Extremo Derecho',
      'Extremo Izquierdo',
      'Segundo Delantero',
      'Delantero Centro',
    ],
  ],
];
const POSICIONES = GRUPOS.flatMap((g) => g[1]);
function grupoDe(posicion, maestro) {
  const g = GRUPOS.findIndex((x) => x[1].includes(posicion));
  if (g >= 0) return g;
  const general = { Portero: 0, Defensa: 1, Centrocampista: 2, Delantero: 3 }[
    maestro && maestro.posicion
  ];
  return general ?? 2;
}

const RONDAS = [
  'Previa Regional',
  'Primera Ronda',
  'Primera Ronda (Ida)',
  'Primera Ronda (Vuelta)',
  'Segunda Ronda',
  'Segunda Ronda (Ida)',
  'Segunda Ronda (Vuelta)',
  'Tercera Ronda',
  'Dieciseisavos de Final',
  'Dieciseisavos de Final (Ida)',
  'Dieciseisavos de Final (Vuelta)',
  'Octavos de Final',
  'Octavos de Final (Ida)',
  'Octavos de Final (Vuelta)',
  'Cuartos de Final',
  'Cuartos de Final (Ida)',
  'Cuartos de Final (Vuelta)',
  'Semifinal',
  'Semifinal (Ida)',
  'Semifinal (Vuelta)',
  'Final',
  'Final (Ida)',
  'Final (Vuelta)',
  'Ida',
  'Vuelta',
];

const COMPETICIONES_BASE = [
  'Primera División',
  'Segunda División',
  'Segunda División B',
  'Tercera División',
  'Fase de Ascenso',
  'Copa del Rey (Juan Carlos I)',
  'Copa del Rey (Felipe VI)',
  'Copa de la R.F.E.F. (Fase Regional)',
  'Copa R.F.E.F.',
];

// Tarjetas: un solo desplegable que cubre todos los casos de app.js.
const TARJETAS = {
  Amarilla: { amarilla: true, roja: false },
  'Roja directa': { amarilla: false, roja: true },
  'Doble amarilla (expulsado)': { amarilla: true, roja: true },
  'Amarilla y luego roja directa': {
    amarilla: true,
    roja: true,
    rojaDirecta: true,
  },
};
function tarjetaDe(p) {
  if (p.amarilla && p.roja)
    return p.rojaDirecta
      ? 'Amarilla y luego roja directa'
      : 'Doble amarilla (expulsado)';
  if (p.roja) return 'Roja directa';
  if (p.amarilla) return 'Amarilla';
  return null;
}

const SITUACIONES = ['Baja', 'Cedido', 'Cedido y después baja'];
const CARGOS = [
  'Entrenador Principal',
  'Segundo Entrenador',
  'Preparador Físico',
  'Entrenador de Porteros',
  'Analista',
  'Médico',
];

// Listas sacadas de los datos ya metidos.
function listas({ MJ, ME, TEMPORADAS }) {
  const equipos = new Set([CLUB]);
  const comps = new Set(COMPETICIONES_BASE);
  const clubes = new Set();
  Object.values(TEMPORADAS).forEach((t) => {
    [...(t.jugadores || []), ...(t.cuerpoTecnico || [])].forEach((j) => {
      (j.partidos || []).forEach((p) => {
        equipos.add(p.local);
        equipos.add(p.visitante);
        comps.add(p.competicion);
      });
      if (j.cedidoEn) clubes.add(j.cedidoEn);
      (j.estados || []).forEach((e) => e.club && clubes.add(e.club));
    });
  });
  const orden = (a, b) => String(a).localeCompare(String(b), 'es');
  const jugadores = Object.entries(MJ)
    .map(([codigo, d]) => [etiqueta(d), codigo])
    .sort((a, b) => orden(a[0], b[0]));
  const entrenadores = Object.entries(ME)
    .map(([codigo, d]) => [etiqueta(d), codigo])
    .sort((a, b) => orden(a[0], b[0]));
  return {
    equipos: [...equipos].filter(Boolean).sort(orden),
    competiciones: [...comps].filter(Boolean).sort(orden),
    clubes: [...new Set([...clubes, ...equipos])]
      .filter((c) => c && c !== CLUB)
      .sort(orden),
    jugadores,
    entrenadores,
  };
}

module.exports = {
  RAIZ,
  CLUB,
  cargarDatos,
  norm,
  codigoDe,
  etiqueta,
  POS_DE_CORTA,
  GRUPOS,
  POSICIONES,
  grupoDe,
  RONDAS,
  TARJETAS,
  tarjetaDe,
  SITUACIONES,
  CARGOS,
  listas,
};
