/* ===================================
   PARTIDOS-COMUN.JS
   Lógica compartida por generar-partidos.js, generar.js y
   generar-sitemap.js para construir la lista ÚNICA de partidos del
   Real Oviedo a partir de los datos por jugador.

   En los datos no existe una lista de partidos del equipo: cada
   jugador lleva en su `partidos[]` los partidos que jugó, así que el
   mismo partido aparece repetido una vez por cada jugador. Aquí se
   agrupan por temporada + fecha (el Oviedo nunca juega dos partidos
   el mismo día) y, cuando las copias no coinciden entre sí (una
   errata en el nombre del rival, un marcador mal copiado en un solo
   jugador...), gana el valor que más se repite. Así una errata
   aislada no crea un partido "fantasma" ni cambia el resultado.

   Las páginas generadas viven en /partidos/:
     /partidos/index.html                      → portada de resultados
     /partidos/temporada-2014-15.html          → una por temporada
     /partidos/rival-real-sporting-de-gijon.html → historial por rival
     /partidos/real-oviedo-cd-tenerife-2024-11-17.html → una por partido
   =================================== */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE_BASE_URL = 'https://taramunde.github.io/SangreCarbayona2';
const OVIEDO = 'Real Oviedo';
const CARPETA_PARTIDOS = 'partidos';

const DATA_FILES = [
  'data-club.js',
  'data-jugadores.js',
  'data-temporada-actual.js',
  'data-historico.js',
  'data-utils.js',
].map((f) => path.join(__dirname, '../js', f));
const EQUIPOS_FILE = path.join(__dirname, '../js/data-equipos.js');
const ESCUDOS_FILE = path.join(__dirname, '../js/data-escudos.js');
const GOLES_PROPIA_FILE = path.join(__dirname, '../js/data-goles-propia.js');

// Carga los archivos de datos en un "navegador simulado", igual que
// generar.js, y devuelve window.CLUB_DATA.
function cargarClubData() {
  DATA_FILES.forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      console.error(
        `❌ ERROR: No encuentro ${path.basename(filePath)} en la carpeta js/.`,
      );
      process.exit(1);
    }
  });
  const sandbox = {
    window: {},
    console: console,
    localStorage: { getItem: () => 'es' },
  };
  vm.createContext(sandbox);
  DATA_FILES.forEach((filePath) => {
    vm.runInContext(fs.readFileSync(filePath, 'utf-8'), sandbox, {
      filename: path.basename(filePath),
    });
  });
  if (!sandbox.window.CLUB_DATA) {
    console.error('❌ ERROR: no se encontró window.CLUB_DATA.');
    process.exit(1);
  }
  // Archivos opcionales: nombres históricos de clubes y escudos. Si no
  // existen, cada nombre es un club distinto y no se muestran escudos.
  [EQUIPOS_FILE, ESCUDOS_FILE, GOLES_PROPIA_FILE].forEach((f) => {
    if (!fs.existsSync(f)) return;
    try {
      vm.runInContext(fs.readFileSync(f, 'utf-8'), sandbox, {
        filename: path.basename(f),
      });
    } catch (e) {
      console.error(`❌ ERROR ejecutando ${path.basename(f)}:`, e.message);
      process.exit(1);
    }
  });
  return sandbox.window.CLUB_DATA;
}

// ── TEXTO ─────────────────────────────────────────────────────

function quitarAcentos(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// Clave para comparar nombres de equipo ignorando mayúsculas, acentos,
// puntos, comas y espacios ("C.D.Tenerife" == "C.D. Tenerife").
function claveEquipo(nombre) {
  return quitarAcentos(nombre)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function slugTexto(texto) {
  return quitarAcentos(texto)
    .toLowerCase()
    .replace(/[.,'´`’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escaparHtml(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function esOviedo(nombre) {
  return /oviedo/i.test(String(nombre || ''));
}

// Valor más repetido de una lista (empate → el primero que apareció).
function moda(valores) {
  const cuenta = new Map();
  valores.forEach((v) => {
    const k = JSON.stringify(v ?? null);
    cuenta.set(k, (cuenta.get(k) || 0) + 1);
  });
  let mejor = null;
  let max = -1;
  for (const [k, n] of cuenta) {
    if (n > max) {
      max = n;
      mejor = k;
    }
  }
  return mejor === null ? null : JSON.parse(mejor);
}

// ── FECHAS Y ETIQUETAS ────────────────────────────────────────

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];
const MESES_CORTOS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

function fechaLarga(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

function fechaCorta(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} ${MESES_CORTOS[m - 1]} ${a}`;
}

function etiquetaJornada(jornada) {
  if (jornada === null || jornada === undefined || jornada === '') return '';
  if (/^\d+$/.test(String(jornada).trim())) return `Jornada ${jornada}`;
  return String(jornada);
}

// "Copa del Rey (Felipe VI)" → "Copa del Rey" para títulos cortos.
function competicionCorta(comp) {
  return /^Copa del Rey/i.test(comp || '') ? 'Copa del Rey' : comp || '';
}

function nombreTemporada(tid) {
  return tid.replace('-', '/');
}

// ── URLs ──────────────────────────────────────────────────────

function slugPartido(p) {
  return `${slugTexto(p.local)}-${slugTexto(p.visitante)}-${p.fecha}`;
}
function slugRival(nombreRival) {
  return `rival-${slugTexto(nombreRival)}`;
}
function slugTemporada(tid) {
  return `temporada-${tid}`;
}
function urlAbsoluta(slug) {
  return `${SITE_BASE_URL}/${CARPETA_PARTIDOS}/${slug}.html`;
}

// ── FICHAS DE JUGADOR / ENTRENADOR ────────────────────────────

// Misma regla que generar.js: un jugador solo tiene ficha estática si
// su ficha maestra tiene nombreCompleto o imagen.
function datosJugador(CLUB_DATA, codigo) {
  const m = (CLUB_DATA.jugadoresMaestro || {})[codigo] || {};
  return {
    tieneFicha: Boolean(m.nombreCompleto || m.imagen),
    nombre: m.apodo || m.nombreCompleto || m.nombre || codigo,
    nombreCompleto: m.nombreCompleto || m.apodo || m.nombre || codigo,
    posicion: m.posicion || '',
  };
}

function codigoEntrenador(miembro) {
  let entId = miembro.codigo || miembro.id;
  if (!entId || typeof entId === 'number') {
    entId = slugTexto(miembro.nombre || '');
  }
  return String(entId);
}

function datosEntrenador(CLUB_DATA, miembro) {
  const codigo = codigoEntrenador(miembro);
  const m = (CLUB_DATA.entrenadorMaestro || {})[codigo] || {};
  return {
    codigo,
    slugFicha: `entrenador-${codigo}`,
    nombre: m.apodo || m.nombreCompleto || miembro.nombre || codigo,
    nombreCompleto: m.nombreCompleto || miembro.nombre || codigo,
  };
}

// ── CLUBES CON VARIOS NOMBRES (js/data-equipos.js) ───────────

// Normaliza CLUB_DATA.equiposHistoricos. Cada "otro nombre" puede ser
// un texto ('Real Gijón') o un objeto con periodo, para cuando el MISMO
// nombre ha correspondido a clubes distintos según la época:
//   { nombre: 'Real Avilés C.F.', desde: '2010-11', hasta: '2022-23' }
// desde/hasta son ids de temporada (como '1982-83') y son opcionales.
function clubesHistoricos(CLUB_DATA) {
  return (CLUB_DATA.equiposHistoricos || [])
    .filter((c) => c && c.nombre)
    .map((c) => ({
      nombre: c.nombre,
      desaparecido: Boolean(c.desaparecido),
      nota: c.nota || '',
      notaEn: c.notaEn || '',
      alias: (c.otrosNombres || [])
        .map((o) =>
          typeof o === 'string'
            ? { nombre: o, desde: null, hasta: null }
            : {
                nombre: o.nombre,
                desde: o.desde || null,
                hasta: o.hasta || null,
              },
        )
        .filter((o) => o.nombre),
    }));
}

// Devuelve una función (nombreEnElPartido, temporadaId) → nombre del
// club. Un alias con periodo gana a uno sin periodo; si ninguno
// encaja, el nombre se queda tal cual (club independiente).
function crearBuscadorDeClub(CLUB_DATA) {
  const reglas = [];
  clubesHistoricos(CLUB_DATA).forEach((club) => {
    reglas.push({
      clave: claveEquipo(club.nombre),
      club: club.nombre,
      desde: null,
      hasta: null,
    });
    club.alias.forEach((a) =>
      reglas.push({
        clave: claveEquipo(a.nombre),
        club: club.nombre,
        desde: a.desde,
        hasta: a.hasta,
      }),
    );
  });
  return (nombre, tid) => {
    const clave = claveEquipo(nombre);
    const candidatas = reglas.filter(
      (r) =>
        r.clave === clave &&
        (!r.desde || !tid || tid >= r.desde) &&
        (!r.hasta || !tid || tid <= r.hasta),
    );
    if (!candidatas.length) return nombre;
    candidatas.sort(
      (a, b) =>
        Number(Boolean(b.desde || b.hasta)) -
        Number(Boolean(a.desde || a.hasta)),
    );
    return candidatas[0].club;
  };
}

// ── CONSTRUCCIÓN DE LA LISTA ÚNICA DE PARTIDOS ────────────────

const ORDEN_POSICION = {
  Portero: 0,
  Defensa: 1,
  Centrocampista: 2,
  Delantero: 3,
};

function construirPartidos(CLUB_DATA) {
  const grupos = new Map(); // `${tid}|${fecha}` → { tid, copias: [], jugadores: [], entrenadores: [] }
  const contadorNombres = new Map(); // claveEquipo → Map(nombreOriginal → n)

  const anotarNombre = (nombre) => {
    const limpio = String(nombre || '').trim();
    if (!limpio || esOviedo(limpio)) return;
    const clave = claveEquipo(limpio);
    if (!contadorNombres.has(clave)) contadorNombres.set(clave, new Map());
    const m = contadorNombres.get(clave);
    m.set(limpio, (m.get(limpio) || 0) + 1);
  };

  const grupo = (tid, fecha) => {
    const k = `${tid}|${fecha}`;
    if (!grupos.has(k)) {
      grupos.set(k, {
        tid,
        fecha,
        fechasOrigen: [fecha],
        copias: [],
        copiasEnt: [],
        jugadores: [],
        entrenadores: [],
      });
    }
    return grupos.get(k);
  };

  Object.entries(CLUB_DATA.temporadas).forEach(([tid, temp]) => {
    (temp.jugadores || []).forEach((jug) => {
      (jug.partidos || []).forEach((p) => {
        if (!p.fecha) return;
        const g = grupo(tid, p.fecha);
        g.copias.push(p);
        g.jugadores.push({ codigo: jug.codigo, dorsal: jug.dorsal, p });
        anotarNombre(p.local);
        anotarNombre(p.visitante);
      });
    });
    (temp.cuerpoTecnico || []).forEach((miembro) => {
      (miembro.partidos || []).forEach((p) => {
        if (!p.fecha) return;
        // Los partidos del entrenador solo sirven para saber quién
        // dirigió cada partido; no "votan" en el resultado.
        const g = grupo(tid, p.fecha);
        g.entrenadores.push(miembro);
        g.copiasEnt.push(p);
      });
    });
  });

  const avisos = [];

  // Fechas mal copiadas: si un grupo pequeño (p. ej. un solo jugador
  // con la fecha equivocada) coincide en temporada + competición +
  // jornada + rival + marcador con otro grupo, es el mismo partido →
  // se fusiona con el grupo que más copias tiene, en vez de crear un
  // partido "fantasma" con un solo jugador.
  const huella = (g) => {
    const copias = g.copias.length ? g.copias : g.copiasEnt;
    if (!copias.length) return null;
    const jornada = moda(copias.map((p) => p.jornada));
    if (jornada === null || jornada === undefined || jornada === '')
      return null;
    const local = moda(copias.map((p) => esOviedo(p.local)));
    const rival = moda(
      copias.map((p) => claveEquipo(local ? p.visitante : p.local)),
    );
    return [
      g.tid,
      moda(copias.map((p) => p.competicion)),
      jornada,
      local,
      rival,
      moda(copias.map((p) => p.golesLocal)),
      moda(copias.map((p) => p.golesVisitante)),
    ].join('|');
  };
  const porHuella = new Map();
  for (const [k, g] of grupos) {
    const h = huella(g);
    if (!h) continue;
    if (!porHuella.has(h)) porHuella.set(h, []);
    porHuella.get(h).push(k);
  }
  for (const claves of porHuella.values()) {
    if (claves.length < 2) continue;
    claves.sort(
      (a, b) => grupos.get(b).copias.length - grupos.get(a).copias.length,
    );
    const destino = grupos.get(claves[0]);
    claves.slice(1).forEach((k) => {
      const g = grupos.get(k);
      g.jugadores.forEach(({ codigo }) =>
        avisos.push(
          `Fecha distinta en ${codigo} (${g.tid}): pone ${g.fecha}, el resto del partido dice ${destino.fecha}`,
        ),
      );
      g.copiasEnt.forEach(() =>
        avisos.push(
          `Fecha distinta en el entrenador (${g.tid}): pone ${g.fecha}, el resto del partido dice ${destino.fecha}`,
        ),
      );
      // La fecha de las copias fusionadas se corrige a la del grupo
      // mayoritario para que no "vote" otra fecha.
      g.copias.forEach((p) =>
        destino.copias.push({ ...p, fecha: destino.fecha }),
      );
      destino.jugadores.push(...g.jugadores);
      destino.entrenadores.push(...g.entrenadores);
      destino.copiasEnt.push(...g.copiasEnt);
      destino.fechasOrigen.push(...g.fechasOrigen);
      grupos.delete(k);
    });
  }

  // Nombre canónico por equipo: la grafía más repetida en todo el
  // histórico ("Elche C.F. " con espacio de más → "Elche C.F.").
  const nombreCanonico = (nombre) => {
    const limpio = String(nombre || '').trim();
    if (esOviedo(limpio)) return OVIEDO;
    const m = contadorNombres.get(claveEquipo(limpio));
    if (!m) return limpio;
    return [...m.entries()].sort((a, b) => b[1] - a[1])[0][0];
  };

  // Clubes con varios nombres (js/data-equipos.js): nombre usado en
  // un partido (+ temporada) → club al que pertenece.
  const clubDe = crearBuscadorDeClub(CLUB_DATA);

  const partidos = [];

  for (const [, g] of grupos) {
    if (!g.copias.length) continue; // solo entrenador, sin jugadores

    const oviedoLocal = moda(g.copias.map((p) => esOviedo(p.local)));
    const rivalBruto = moda(
      g.copias.map((p) => String(oviedoLocal ? p.visitante : p.local).trim()),
    );
    const rival = nombreCanonico(rivalBruto);
    const golesLocal = moda(g.copias.map((p) => p.golesLocal));
    const golesVisitante = moda(g.copias.map((p) => p.golesVisitante));
    const p0 = g.copias[0];

    const partido = {
      tid: g.tid,
      fecha: p0.fecha,
      competicion: moda(g.copias.map((p) => p.competicion)) || '',
      jornada: moda(g.copias.map((p) => p.jornada)),
      local: oviedoLocal ? OVIEDO : rival,
      visitante: oviedoLocal ? rival : OVIEDO,
      oviedoLocal,
      rival, // nombre del rival en ESE partido (puede ser un nombre antiguo)
      club: clubDe(rival, g.tid), // nombre actual del club, para agrupar el historial
      golesLocal,
      golesVisitante,
      penaltisLocal: moda(g.copias.map((p) => p.penaltisLocal ?? null)),
      penaltisVisitante: moda(g.copias.map((p) => p.penaltisVisitante ?? null)),
      resultado: moda(g.copias.map((p) => p.resultado)),
      fechasOrigen: g.fechasOrigen,
      jugadores: [],
      entrenadores: [],
    };
    partido.slug = slugPartido(partido);

    // Copias discrepantes → aviso (no cambian el partido, pero conviene
    // corregirlas en los datos).
    g.jugadores.forEach(({ codigo, p }) => {
      if (p.golesLocal !== golesLocal || p.golesVisitante !== golesVisitante) {
        avisos.push(
          `Marcador distinto en ${codigo} (${g.tid}, ${p.fecha}): ${p.golesLocal}-${p.golesVisitante}, el resto dice ${golesLocal}-${golesVisitante}`,
        );
      }
      const rivalCopia = String(oviedoLocal ? p.visitante : p.local).trim();
      if (claveEquipo(rivalCopia) !== claveEquipo(rival)) {
        avisos.push(
          `Nombre de rival distinto en ${codigo} (${g.tid}, ${p.fecha}): "${rivalCopia}", el resto dice "${rival}"`,
        );
      }
    });

    // Jugadores del Oviedo que participaron (sin repetir).
    const vistos = new Set();
    g.jugadores.forEach(({ codigo, dorsal, p }) => {
      if (vistos.has(codigo)) return;
      vistos.add(codigo);
      const info = datosJugador(CLUB_DATA, codigo);
      partido.jugadores.push({
        codigo,
        dorsal,
        ...info,
        esPortero: info.posicion === 'Portero',
        minutos: p.minutos ?? null,
        goles: p.goles || 0,
        asistencias: p.asistencias || 0,
        amarilla: Boolean(p.amarilla),
        roja: Boolean(p.roja || p.rojaDirecta),
      });
    });
    partido.jugadores.sort(
      (a, b) =>
        (ORDEN_POSICION[a.posicion] ?? 9) - (ORDEN_POSICION[b.posicion] ?? 9) ||
        (b.minutos || 0) - (a.minutos || 0) ||
        a.nombre.localeCompare(b.nombre, 'es'),
    );

    const vistosEnt = new Set();
    g.entrenadores.forEach((miembro) => {
      const info = datosEntrenador(CLUB_DATA, miembro);
      if (vistosEnt.has(info.codigo)) return;
      vistosEnt.add(info.codigo);
      partido.entrenadores.push(info);
    });

    partidos.push(partido);
  }

  partidos.sort((a, b) => a.fecha.localeCompare(b.fecha));

  // Goles en propia puerta de rivales (js/data-goles-propia.js), por
  // fecha: no son de ningún jugador del Oviedo, así que no están en
  // ningún partidos[] — se añaden aparte a cada partido.
  const porFecha = new Map(partidos.map((p) => [p.fecha, p]));
  partidos.forEach((p) => {
    p.golesEnPropia = [];
  });
  (CLUB_DATA.golesEnPropia || []).forEach((og) => {
    const p = og && porFecha.get(og.fecha);
    if (!p) {
      avisos.push(
        `Gol en propia puerta con fecha sin partido (js/data-goles-propia.js): ${og && og.fecha} ${og && og.jugador}`,
      );
      return;
    }
    p.golesEnPropia.push({
      jugador: og.jugador,
      equipo: og.equipo || p.rival,
      minuto: og.minuto || null,
      goles: og.goles || 1,
    });
  });

  // Por si dos partidos distintos acabasen con el mismo slug (no
  // debería pasar: el Oviedo no juega dos veces el mismo día).
  const usados = new Set();
  partidos.forEach((p) => {
    let s = p.slug;
    let n = 2;
    while (usados.has(s)) s = `${p.slug}-${n++}`;
    p.slug = s;
    usados.add(s);
  });

  return { partidos, avisos };
}

// Índice tid|fecha → slug, para enlazar desde las fichas de jugador.
function indicePorFecha(partidos) {
  const idx = {};
  partidos.forEach((p) => {
    (p.fechasOrigen || [p.fecha]).forEach((f) => {
      idx[`${p.tid}|${f}`] = p;
    });
  });
  return idx;
}

function marcador(p) {
  if (p.golesLocal === null || p.golesLocal === undefined) return 'vs';
  let txt = `${p.golesLocal}-${p.golesVisitante}`;
  if (p.penaltisLocal !== null && p.penaltisLocal !== undefined) {
    txt += ` (${p.penaltisLocal}-${p.penaltisVisitante} pen.)`;
  }
  return txt;
}

// Versión de caché (?nocache=...) que usa ahora mismo index.html, para
// que las páginas generadas pidan las mismas versiones de CSS/JS que el
// resto de la web.
function nocacheActual() {
  try {
    const html = fs.readFileSync(
      path.join(__dirname, '..', 'index.html'),
      'utf-8',
    );
    const m = html.match(/nocache=(\d{8}v\d+)/);
    if (m) return m[1];
  } catch (e) {
    /* sin index.html: usamos la fecha de hoy */
  }
  const hoy = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `${hoy}v1`;
}

// ── TRADUCCIÓN AL INGLÉS ──────────────────────────────────────
// Las páginas generadas llevan el texto en español (el que indexa
// Google) y, al lado, su versión en inglés en un atributo data-en.
// js/i18n.js intercambia ambos al cambiar de idioma. Competiciones,
// rondas y posiciones se traducen con las mismas claves de i18n.js
// para que coincidan con el resto de la web.

let _en = null;
function traduccionesEn() {
  if (_en) return _en;
  try {
    const sandbox = {
      window: {},
      console,
      localStorage: { getItem: () => 'es', setItem() {} },
      document: {
        addEventListener() {},
        querySelectorAll: () => [],
        getElementById: () => null,
        documentElement: {},
      },
    };
    vm.createContext(sandbox);
    const src = fs.readFileSync(path.join(__dirname, '../js/i18n.js'), 'utf-8');
    vm.runInContext(`${src}\n;globalThis.__T = translations;`, sandbox);
    _en = (sandbox.__T && sandbox.__T.en) || {};
  } catch (e) {
    console.warn(
      '⚠ No se pudieron leer las traducciones de i18n.js:',
      e.message,
    );
    _en = {};
  }
  return _en;
}

// Misma normalización que translateCompeticion() de i18n.js
function claveI18n(texto) {
  return quitarAcentos(texto)
    .toLowerCase()
    .replace(/[().]/g, '')
    .replace(/[-\s]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

function competicionEn(comp) {
  return traduccionesEn()[`comp_${claveI18n(comp)}`] || comp || '';
}
function competicionCortaEn(comp) {
  return /^Copa del Rey/i.test(comp || '')
    ? 'Copa del Rey'
    : competicionEn(comp);
}
function jornadaEn(jornada) {
  if (jornada === null || jornada === undefined || jornada === '') return '';
  if (/^\d+$/.test(String(jornada).trim())) return `Matchday ${jornada}`;
  const t = traduccionesEn()[`copa_ronda_${claveI18n(jornada)}`];
  if (t) return t;
  return String(jornada)
    .replace(/\(Ida\)/i, '(1st Leg)')
    .replace(/\(Vuelta\)/i, '(2nd Leg)');
}
function posicionEn(pos) {
  return traduccionesEn()[`pos_${claveI18n(pos)}`] || pos || '';
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
function fechaLargaEn(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${a}`;
}
function fechaCortaEn(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1].slice(0, 3)} ${a}`;
}

// Texto bilingüe: devuelve el HTML en español con su versión inglesa
// en data-en. Ambos argumentos son HTML ya escapado. No anidar: el
// contenido se sustituye entero al cambiar de idioma.
function bi(esHtml, enHtml, etiqueta = 'span') {
  if (enHtml === undefined || enHtml === null || enHtml === esHtml)
    return esHtml;
  return `<${etiqueta} data-en="${String(enHtml).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">${esHtml}</${etiqueta}>`;
}

module.exports = {
  SITE_BASE_URL,
  OVIEDO,
  CARPETA_PARTIDOS,
  cargarClubData,
  construirPartidos,
  clubesHistoricos,
  indicePorFecha,
  claveEquipo,
  slugTexto,
  slugRival,
  slugTemporada,
  urlAbsoluta,
  escaparHtml,
  esOviedo,
  fechaLarga,
  fechaCorta,
  etiquetaJornada,
  competicionCorta,
  nombreTemporada,
  marcador,
  datosJugador,
  datosEntrenador,
  nocacheActual,
  competicionEn,
  competicionCortaEn,
  jornadaEn,
  posicionEn,
  fechaLargaEn,
  fechaCortaEn,
  bi,
};
