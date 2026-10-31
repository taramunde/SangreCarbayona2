/* ===================================
   GENERAR-PARTIDOS.JS
   Genera páginas HTML ESTÁTICAS (con todo el contenido ya escrito en
   el HTML, sin depender de JavaScript) para que Google pueda leerlas
   e indexarlas:

     /partidos/index.html                 → portada de resultados
     /partidos/temporada-{id}.html        → una por temporada
     /partidos/rival-{equipo}.html        → historial contra cada rival
     /partidos/{local}-{visitante}-{fecha}.html → una por partido

   Todo sale de los mismos archivos de datos que usa el resto de la
   web (data-jugadores.js, data-temporada-actual.js, data-historico.js).
   No hay que mantener nada a mano: basta con volver a ejecutarlo
   (lo hace `npm run generar` / `npm run subir`).

   Uso:  node generador/generar-partidos.js
   =================================== */

const fs = require('fs');
const path = require('path');
const C = require('./partidos-comun');

const {
  SITE_BASE_URL,
  OVIEDO,
  CARPETA_PARTIDOS,
  escaparHtml: e,
  fechaLarga,
  fechaCorta,
  etiquetaJornada,
  competicionCorta,
  nombreTemporada,
  marcador,
  slugRival,
  slugTemporada,
  urlAbsoluta,
  claveEquipo,
  bi,
  competicionEn,
  competicionCortaEn,
  jornadaEn,
  posicionEn,
  fechaLargaEn,
  fechaCortaEn,
} = C;

// Plural sencillo: n partido/partidos · match/matches
const nPartidos = (n) =>
  bi(
    `${n} ${n === 1 ? 'partido' : 'partidos'}`,
    `${n} ${n === 1 ? 'match' : 'matches'}`,
  );
const nPartidosTxt = (n) => `${n} ${n === 1 ? 'partido' : 'partidos'}`;
const temporadaBi = (tid) =>
  bi(`Temporada ${nombreTemporada(tid)}`, `Season ${nombreTemporada(tid)}`);
const vedEs = (r) => `${r.v}V ${r.e}E ${r.d}D`;
const vedEn = (r) => `${r.v}W ${r.e}D ${r.d}L`;

console.log('🚀 Iniciando generador de páginas de partidos...');

const CLUB_DATA = C.cargarClubData();
const { partidos, avisos } = C.construirPartidos(CLUB_DATA);
const NOCACHE = C.nocacheActual();
const outputDir = path.join(__dirname, '..', CARPETA_PARTIDOS);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const OG_IMAGE = `${SITE_BASE_URL}/img/varios/LogoSangreCarbayona.webp`;
const ESTADIO_OVIEDO =
  (CLUB_DATA.club && CLUB_DATA.club.estadio) || 'Estadio Carlos Tartiere';

// ── ESCUDOS ───────────────────────────────────────────────────
// Salen de la lista de js/data-escudos.js (nombre del club → imagen).
// Un filial sin escudo propio usa el de su primer equipo: los que
// acaban en " B"/" C" se detectan solos y el resto (Castilla, Sevilla
// Atlético, Bilbao Athletic...) se indican en CLUB_DATA.filiales.
// Sin escudo, se pinta un círculo con las iniciales.
const PREFIJOS = new Set([
  'cd',
  'cf',
  'ud',
  'sd',
  'fc',
  'rcd',
  'rc',
  'ad',
  'ca',
  'ce',
  'ue',
  'ae',
  'club',
]);
const escudoPorClave = new Map();
const escudosAusentes = new Set();
Object.entries(CLUB_DATA.escudos || {}).forEach(([nombre, ruta]) => {
  if (!ruta) return;
  const limpia = String(ruta).replace(/^\/+/, '');
  if (
    !/^https?:/.test(limpia) &&
    !fs.existsSync(path.join(__dirname, '..', limpia))
  ) {
    escudosAusentes.add(`${nombre} → ${limpia}`);
    return; // mejor iniciales que una imagen rota
  }
  escudoPorClave.set(
    claveEquipo(nombre),
    /^https?:/.test(limpia) ? limpia : `../${limpia}`,
  );
});
const filialDe = new Map();
Object.entries(CLUB_DATA.filiales || {}).forEach(([filial, primero]) => {
  filialDe.set(claveEquipo(filial), primero);
});

// ── Tamaño de letra según lo largo que sea el texto ──────────────
// Los nombres largos ("Universidad Las Palmas de Gran Canaria C.F.",
// "A.D. Cerro de Reyes Badajoz Atlético") reciben una clase que les
// baja el tamaño (css/partidos.css), para que quepan sin cortarse.
// Cuenta tanto el largo total como la palabra más larga (una palabra
// no se puede partir en dos líneas).
function palabraMasLarga(texto) {
  return Math.max(
    0,
    ...String(texto || '')
      .split(/\s+/)
      .map((w) => w.length),
  );
}
function claseTitulo(texto) {
  const n = String(texto || '').length;
  if (n > 44 || palabraMasLarga(texto) > 14) return 'titulo-muy-largo';
  if (n > 28 || palabraMasLarga(texto) > 11) return 'titulo-largo';
  return '';
}
function claseNombreEquipo(texto) {
  const n = String(texto || '').length;
  const w = palabraMasLarga(texto);
  if (n > 32 || w >= 11) return 'nombre-muy-largo';
  if (n > 20 || w >= 9) return 'nombre-largo';
  return '';
}

function escudoDe(nombre) {
  const clave = claveEquipo(nombre);
  if (escudoPorClave.has(clave)) return escudoPorClave.get(clave);
  const primero =
    filialDe.get(clave) ||
    (/\s(B|C)$/i.test(String(nombre).trim())
      ? String(nombre)
          .trim()
          .replace(/\s(B|C)$/i, '')
      : null);
  if (primero && escudoPorClave.has(claveEquipo(primero))) {
    return escudoPorClave.get(claveEquipo(primero));
  }
  return null;
}

function htmlEscudo(nombre, clase = 'escudo') {
  const src = escudoDe(nombre);
  if (src) {
    return `<img class="${clase}" src="${src}" alt="Escudo ${e(nombre)}" width="76" height="76" loading="lazy" />`;
  }
  const iniciales = C.slugTexto(nombre)
    .split('-')
    .filter((p) => p && !PREFIJOS.has(p) && p.length > 2)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
  return `<span class="escudo-generico" aria-hidden="true">${e(iniciales || '?')}</span>`;
}

// ── AYUDAS DE PARTIDO ─────────────────────────────────────────
function golesOviedo(p) {
  return p.oviedoLocal ? p.golesLocal : p.golesVisitante;
}
function golesRival(p) {
  return p.oviedoLocal ? p.golesVisitante : p.golesLocal;
}
// Resultado del Oviedo según el marcador (V/E/D). Un empate decidido
// por penaltis cuenta como empate en las estadísticas, como es habitual.
function resultadoOviedo(p) {
  const a = golesOviedo(p);
  const b = golesRival(p);
  if (a === null || a === undefined || b === null || b === undefined) {
    return p.resultado || '';
  }
  return a > b ? 'V' : a < b ? 'D' : 'E';
}
const TEXTO_RES = { V: 'Victoria', E: 'Empate', D: 'Derrota' };
const NOTA_PORTEROS = bi(
  'En los porteros, la columna Goles muestra los goles encajados (<span class="goles-encajados">en rojo</span>).',
  'For goalkeepers, the Goals column shows goals conceded (<span class="goles-encajados">in red</span>).',
);
const CHIP_RES = {
  V: ['Victoria del Oviedo', 'Oviedo win'],
  E: ['Empate', 'Draw'],
  D: ['Derrota del Oviedo', 'Oviedo defeat'],
};

function quienPasaPenaltis(p) {
  if (p.penaltisLocal === null || p.penaltisLocal === undefined) return '';
  const ganaLocal = p.penaltisLocal > p.penaltisVisitante;
  const quien = e(ganaLocal ? p.local : p.visitante);
  const tanda = `${Math.max(p.penaltisLocal, p.penaltisVisitante)}-${Math.min(p.penaltisLocal, p.penaltisVisitante)}`;
  return bi(
    `${quien} gana ${tanda} en los penaltis`,
    `${quien} win ${tanda} on penalties`,
  );
}

function enlaceFicha(jugador, tid) {
  if (!jugador.tieneFicha) return e(jugador.nombre);
  return `<a href="../fichas/${e(jugador.codigo)}-${e(tid)}.html">${e(jugador.nombre)}</a>`;
}

function resumenNumeros(lista) {
  const r = { pj: 0, v: 0, e: 0, d: 0, gf: 0, gc: 0 };
  lista.forEach((p) => {
    const res = resultadoOviedo(p);
    r.pj++;
    if (res === 'V') r.v++;
    else if (res === 'E') r.e++;
    else if (res === 'D') r.d++;
    r.gf += golesOviedo(p) || 0;
    r.gc += golesRival(p) || 0;
  });
  return r;
}

function htmlResumen(r) {
  return `<div class="resumen">
          <div><strong>${r.pj}</strong>${bi('Jugados', 'Played')}</div>
          <div><strong>${r.v}</strong>${bi('Victorias', 'Wins')}</div>
          <div><strong>${r.e}</strong>${bi('Empates', 'Draws')}</div>
          <div><strong>${r.d}</strong>${bi('Derrotas', 'Losses')}</div>
          <div><strong>${r.gf}</strong>${bi('Goles a favor', 'Goals for')}</div>
          <div><strong>${r.gc}</strong>${bi('Goles en contra', 'Goals against')}</div>
        </div>`;
}

// Una fila enlazada de partido para los listados.
function htmlFilaPartido(p, { mostrarTemporada = false } = {}) {
  const res = resultadoOviedo(p);
  const lado = (nombre) =>
    nombre === OVIEDO ? `<span class="oviedo">${e(nombre)}</span>` : e(nombre);
  const detalle = [competicionCorta(p.competicion), etiquetaJornada(p.jornada)]
    .filter(Boolean)
    .join(' · ');
  const detalleEn = [competicionCortaEn(p.competicion), jornadaEn(p.jornada)]
    .filter(Boolean)
    .join(' · ');
  return `<li><a class="fila-partido" href="${e(p.slug)}.html">
            <span class="cuando">${bi(e(fechaCorta(p.fecha)), e(fechaCortaEn(p.fecha)))}${mostrarTemporada ? `<br />${e(nombreTemporada(p.tid))}` : ''}</span>
            <span class="cruce">${lado(p.local)} – ${lado(p.visitante)}${bi(e(detalle), e(detalleEn), 'small')}</span>
            <span class="res res-${res}" title="${TEXTO_RES[res] || ''}">${e(marcador(p).replace(' pen.', ''))}</span>
          </a></li>`;
}

// ── PLANTILLA COMÚN ───────────────────────────────────────────
function pagina({
  titulo,
  descripcion,
  slug,
  ogType = 'website',
  jsonLd = [],
  migas,
  h1,
  h1En,
  subtitulo,
  subtituloEn,
  cuerpo,
}) {
  const canonical = urlAbsoluta(slug);
  const migasHtml = migas
    .map((m, i) =>
      i === migas.length - 1
        ? `<span class="current">${bi(e(m.nombre), m.en ? e(m.en) : undefined)}</span>`
        : `<a href="${e(m.href)}">${bi(e(m.nombre), m.en ? e(m.en) : undefined)}</a><span>/</span>`,
    )
    .join('');
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: migas.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.nombre,
      item: m.url || canonical,
    })),
  };
  const ld = [...jsonLd, breadcrumbLd]
    .map(
      (obj, i) =>
        `<script type="application/ld+json"${obj['@type'] === 'BreadcrumbList' ? ' id="ld-json-breadcrumb"' : ''}>${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`,
    )
    .join('\n    ');
  const nc = NOCACHE;

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${e(titulo)}</title>
    <meta name="description" content="${e(descripcion)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${e(titulo)}" />
    <meta property="og:description" content="${e(descripcion)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:site_name" content="Sangre Carbayona" />
    <meta property="og:locale" content="es_ES" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${e(titulo)}" />
    <meta name="twitter:description" content="${e(descripcion)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
    <link rel="icon" type="image/webp" href="../img/varios/LogoSangreCarbayona.webp" />
    <link rel="stylesheet" href="../css/styles.css?nocache=${nc}" />
    <link rel="stylesheet" href="../css/partidos.css?nocache=${nc}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    ${ld}
  </head>
  <body>
    <header class="main-header" id="header-placeholder"></header>
    <div class="search-overlay" id="searchOverlay">
      <div class="search-container">
        <form class="search-form">
          <input type="text" data-i18n="buscar" placeholder="Buscar en la web..." aria-label="Buscar en la web" />
          <button type="submit"><i class="fas fa-search"></i></button>
        </form>
        <button class="close-search" id="closeSearch"><i class="fas fa-times"></i></button>
      </div>
    </div>

    <section class="partidos-header">
      <div class="container">
        <nav class="breadcrumb" aria-label="Migas de pan">${migasHtml}</nav>
        ${(h1En && h1En !== h1 ? bi(e(h1), e(h1En), 'h1') : `<h1>${e(h1)}</h1>`).replace('<h1', claseTitulo(h1) ? `<h1 class="${claseTitulo(h1)}"` : '<h1')}
        ${subtitulo ? `<p class="subtitulo">${bi(e(subtitulo), subtituloEn ? e(subtituloEn) : undefined)}</p>` : ''}
      </div>
    </section>

    <main class="partidos-main">
      <div class="container">
${cuerpo}
      </div>
    </main>

    <footer class="main-footer" id="footer-placeholder"></footer>

    <!-- Generado por generador/generar-partidos.js: no editar a mano -->
    <script src="../js/data-club.js?nocache=${nc}"></script>
    <script src="../js/data-jugadores.js?nocache=${nc}"></script>
    <script src="../js/busqueda.js?nocache=${nc}"></script>
    <script src="../js/i18n.js?nocache=${nc}"></script>
    <script src="../js/seo.js?nocache=${nc}"></script>
    <script src="../js/script.js?nocache=${nc}"></script>
    <script src="../js/main.js?nocache=${nc}"></script>
  </body>
</html>
`;
}

const MIGA_INICIO = {
  nombre: 'Inicio',
  en: 'Home',
  href: '../index.html',
  url: `${SITE_BASE_URL}/`,
};
const MIGA_PARTIDOS = {
  nombre: 'Partidos',
  en: 'Matches',
  href: 'index.html',
  url: urlAbsoluta('index'),
};

// ── AGRUPACIONES ──────────────────────────────────────────────
const porTemporada = new Map();
const porRival = new Map();
partidos.forEach((p) => {
  if (!porTemporada.has(p.tid)) porTemporada.set(p.tid, []);
  porTemporada.get(p.tid).push(p);
  // Se agrupa por el nombre ACTUAL del club (js/data-equipos.js), así
  // "Real Gijón" y "Real Sporting de Gijón" comparten historial.
  const k = claveEquipo(p.club);
  if (!porRival.has(k)) porRival.set(k, { nombre: p.club, partidos: [] });
  porRival.get(k).partidos.push(p);
});

// Otros nombres de cada club según js/data-equipos.js
const otrosNombresDe = new Map(); // clave del club → [nombres de texto]
const clubInfo = new Map(); // clave del club → { desaparecido, nota }
C.clubesHistoricos(CLUB_DATA).forEach((club) => {
  const k = claveEquipo(club.nombre);
  otrosNombresDe.set(k, [...new Set(club.alias.map((a) => a.nombre))]);
  clubInfo.set(k, club);
});

// Nombres con los que se jugó contra un club, con sus temporadas:
// [{ nombre, desde: '1941-42', hasta: '1969-70', n: 30 }, ...]
function nombresUsados(lista) {
  const m = new Map();
  lista.forEach((p) => {
    const k = claveEquipo(p.rival);
    if (!m.has(k))
      m.set(k, { nombre: p.rival, desde: p.tid, hasta: p.tid, n: 0 });
    const x = m.get(k);
    x.n++;
    if (p.tid < x.desde) x.desde = p.tid;
    if (p.tid > x.hasta) x.hasta = p.tid;
  });
  return [...m.values()].sort((a, b) => a.desde.localeCompare(b.desde));
}
function rangoTemporadas(x, en = false) {
  return x.desde === x.hasta
    ? nombreTemporada(x.desde)
    : `${nombreTemporada(x.desde)} ${en ? 'to' : 'a'} ${nombreTemporada(x.hasta)}`;
}
const temporadasIds = [...porTemporada.keys()].sort(); // antigua → reciente

const escritos = new Set();
function escribir(slug, html) {
  fs.writeFileSync(path.join(outputDir, `${slug}.html`), html);
  escritos.add(`${slug}.html`);
}

// ═════════════════════════════════════════════════════════════
// 1. UNA PÁGINA POR PARTIDO
// ═════════════════════════════════════════════════════════════
partidos.forEach((p, i) => {
  const anterior = partidos[i - 1];
  const siguiente = partidos[i + 1];
  const res = resultadoOviedo(p);
  const temporadaNom = nombreTemporada(p.tid);
  const jornadaTxt = etiquetaJornada(p.jornada);
  const compCorta = competicionCorta(p.competicion);
  const goleadores = p.jugadores.filter((j) => !j.esPortero && j.goles > 0);
  const rival = porRival.get(claveEquipo(p.club));
  const nombreAntiguo = p.rival !== p.club; // jugó con un nombre que ya no usa

  // Goles en propia puerta de jugadores rivales (js/data-goles-propia.js)
  const enPropia = p.golesEnPropia || [];
  const textoGoles =
    goleadores.length || enPropia.length
      ? ` Goles del Real Oviedo: ${[
          ...goleadores.map((j) =>
            j.goles > 1 ? `${j.nombre} (${j.goles})` : j.nombre,
          ),
          ...enPropia.map(
            (og) =>
              `${og.jugador}${og.goles > 1 ? ` (${og.goles})` : ''} en propia puerta`,
          ),
        ].join(', ')}.`
      : '';
  const titulo = `${p.local} ${marcador(p)} ${p.visitante} · ${compCorta} ${temporadaNom} | Sangre Carbayona`;
  const descripcion =
    `${p.local} ${marcador(p)} ${p.visitante}, ${[compCorta, jornadaTxt].filter(Boolean).join(', ')} (${fechaLarga(p.fecha)}).${textoGoles} ` +
    `Jugadores del Real Oviedo, minutos, goles y tarjetas.`;

  const eventoLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${p.local} - ${p.visitante}`,
    description: `${compCorta}${jornadaTxt ? `, ${jornadaTxt}` : ''}. Temporada ${temporadaNom}.`,
    url: urlAbsoluta(p.slug),
    startDate: p.fecha,
    sport: 'Fútbol',
    homeTeam: { '@type': 'SportsTeam', name: p.local },
    awayTeam: { '@type': 'SportsTeam', name: p.visitante },
    superEvent: {
      '@type': 'SportsEvent',
      name: `${p.competicion} ${temporadaNom}`,
    },
  };
  if (p.oviedoLocal) {
    eventoLd.location = {
      '@type': 'Place',
      name: ESTADIO_OVIEDO,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Oviedo',
        addressCountry: 'ES',
      },
    };
  }

  const filasJugadores = p.jugadores
    .map((j) => {
      const tarjetas =
        (j.amarilla
          ? '<span class="tarjeta tarjeta-amarilla" title="Amarilla"></span>'
          : '') +
        (j.roja
          ? '<span class="tarjeta tarjeta-roja" title="Roja"></span>'
          : '');
      return `<tr>
              <td>${enlaceFicha(j, p.tid)}</td>
              <td class="pos ocultar-movil">${bi(e(j.posicion || ''), e(posicionEn(j.posicion)))}</td>
              <td class="num">${j.minutos ?? '–'}</td>
              <td class="num">${
                j.esPortero
                  ? j.goles > 0
                    ? `<span class="goles-encajados" title="Goles encajados">${j.goles}</span>`
                    : '0'
                  : j.goles
              }</td>
              <td class="num">${j.asistencias}</td>
              <td class="num">${tarjetas || '–'}</td>
            </tr>`;
    })
    .join('\n');
  const hayPortero = p.jugadores.some((j) => j.esPortero);

  const jornadaEnTxt = jornadaEn(p.jornada);
  const compYJornadaEs = `${p.competicion}${jornadaTxt ? ` · ${jornadaTxt}` : ''}`;
  const compYJornadaEn = `${competicionEn(p.competicion)}${jornadaEnTxt ? ` · ${jornadaEnTxt}` : ''}`;
  const datos = [
    `<span><i class="fas fa-trophy"></i>${bi(e(compYJornadaEs), e(compYJornadaEn))}</span>`,
    `<span><i class="far fa-calendar-alt"></i>${bi(e(fechaLarga(p.fecha)), e(fechaLargaEn(p.fecha)))}</span>`,
    p.oviedoLocal
      ? `<span><i class="fas fa-map-marker-alt"></i>${e(ESTADIO_OVIEDO)}</span>`
      : '',
    `<span><i class="fas fa-layer-group"></i>${temporadaBi(p.tid)}</span>`,
  ]
    .filter(Boolean)
    .join('\n            ');

  const equipoHtml = (
    nombre,
  ) => `<div class="marcador-equipo${nombre === OVIEDO ? ' es-oviedo' : ''}">
            ${htmlEscudo(nombre === OVIEDO ? nombre : p.club)}
            <span class="${['nombre', claseNombreEquipo(nombre)].filter(Boolean).join(' ')}">${nombre === OVIEDO ? e(nombre) : `<a href="${slugRival(p.club)}.html">${e(nombre)}</a>`}</span>
            ${nombre !== OVIEDO && nombreAntiguo ? `<span class="nombre-actual">${(clubInfo.get(claveEquipo(p.club)) || {}).desaparecido ? e(p.club) : bi(`hoy ${e(p.club)}`, `now ${e(p.club)}`)}</span>` : ''}
          </div>`;

  const cuerpo = `
        <section class="bloque" aria-label="Resultado">
          <div class="marcador">
            ${equipoHtml(p.local)}
            <div class="marcador-centro">
              <div class="resultado">${p.golesLocal ?? '-'} - ${p.golesVisitante ?? '-'}</div>
              ${p.penaltisLocal !== null && p.penaltisLocal !== undefined ? `<div class="penaltis">${quienPasaPenaltis(p)}</div>` : ''}
              ${CHIP_RES[res] ? `<span class="chip chip-${res}">${bi(CHIP_RES[res][0], CHIP_RES[res][1])}</span>` : ''}
            </div>
            ${equipoHtml(p.visitante)}
          </div>
          <div class="datos-partido">
            ${datos}
          </div>
        </section>

        ${
          goleadores.length || enPropia.length || p.entrenadores.length
            ? `<section class="bloque">
          ${
            goleadores.length || enPropia.length
              ? `<h2>${bi('Goles del Real Oviedo', 'Real Oviedo goals')}</h2>
          <ul class="lista-simple">
            ${[
              ...goleadores.map(
                (j) =>
                  `<li>${enlaceFicha(j, p.tid)}${j.goles > 1 ? ` (${j.goles})` : ''}</li>`,
              ),
              ...enPropia.map(
                (og) =>
                  `<li>${e(og.jugador)}${og.goles > 1 ? ` (${og.goles})` : ''} <span class="propia-puerta">${bi(`(${e(og.equipo)}), en propia puerta${og.minuto ? `, min. ${og.minuto}` : ''}`, `(${e(og.equipo)}), own goal${og.minuto ? `, ${og.minuto}'` : ''}`)}</span></li>`,
              ),
            ].join('\n            ')}
          </ul>`
              : ''
          }
          ${
            p.entrenadores.length
              ? `<h2 style="margin-top:${goleadores.length || enPropia.length ? '20px' : '0'}">${bi('Entrenador', 'Coach')}</h2>
          <ul class="lista-simple">
            ${p.entrenadores.map((en) => `<li><a href="../fichas/${e(en.slugFicha)}.html">${e(en.nombreCompleto)}</a></li>`).join('\n            ')}
          </ul>`
              : ''
          }
        </section>`
            : ''
        }

        ${
          p.jugadores.length
            ? `<section class="bloque">
          <h2>${bi('Jugadores del Real Oviedo', 'Real Oviedo players')}</h2>
          <div class="tabla-scroll">
            <table class="tabla">
              <thead>
                <tr><th>${bi('Jugador', 'Player')}</th><th class="ocultar-movil">${bi('Posición', 'Position')}</th><th class="num">Min.</th><th class="num">${bi('Goles', 'Goals')}</th><th class="num">${bi('Asist.', 'Ast.')}</th><th class="num">${bi('Tarj.', 'Cards')}</th></tr>
              </thead>
              <tbody>
            ${filasJugadores}
              </tbody>
            </table>
          </div>
          ${hayPortero ? `<p class="nota">${NOTA_PORTEROS}</p>` : ''}
        </section>`
            : ''
        }

        <section class="bloque">
          <h2>${bi('Más partidos', 'More matches')}</h2>
          <ul class="lista-simple">
            <li><a href="${slugTemporada(p.tid)}.html">${bi(`Todos los partidos de la temporada ${e(temporadaNom)}`, `All matches of the ${e(temporadaNom)} season`)}</a></li>
            <li><a href="${slugRival(p.club)}.html">${bi(`Historial contra ${e(p.club)} (${nPartidosTxt(rival.partidos.length)})`, `Head-to-head vs ${e(p.club)} (${rival.partidos.length} ${rival.partidos.length === 1 ? 'match' : 'matches'})`)}</a></li>
          </ul>
        </section>

        <nav class="nav-partidos" aria-label="Partido anterior y siguiente">
          ${anterior ? `<a class="ant" href="${e(anterior.slug)}.html"><small>${bi('← Partido anterior', '← Previous match')}</small><strong>${e(anterior.local)} ${e(marcador(anterior))} ${e(anterior.visitante)}</strong></a>` : ''}
          ${siguiente ? `<a class="sig" href="${e(siguiente.slug)}.html"><small>${bi('Partido siguiente →', 'Next match →')}</small><strong>${e(siguiente.local)} ${e(marcador(siguiente))} ${e(siguiente.visitante)}</strong></a>` : ''}
        </nav>`;

  escribir(
    p.slug,
    pagina({
      titulo,
      descripcion,
      slug: p.slug,
      ogType: 'article',
      jsonLd: [eventoLd],
      migas: [
        MIGA_INICIO,
        MIGA_PARTIDOS,
        {
          nombre: `Temporada ${temporadaNom}`,
          en: `Season ${temporadaNom}`,
          href: `${slugTemporada(p.tid)}.html`,
          url: urlAbsoluta(slugTemporada(p.tid)),
        },
        { nombre: `${p.local} - ${p.visitante}` },
      ],
      h1: `${p.local} ${marcador(p)} ${p.visitante}`,
      h1En: `${p.local} ${marcador(p).replace(' pen.', ' pens')} ${p.visitante}`,
      subtitulo: `${compYJornadaEs} · ${fechaLarga(p.fecha)}`,
      subtituloEn: `${compYJornadaEn} · ${fechaLargaEn(p.fecha)}`,
      cuerpo,
    }),
  );
});
console.log(`  ✔ ${partidos.length} páginas de partido`);

// ═════════════════════════════════════════════════════════════
// 2. UNA PÁGINA POR TEMPORADA
// ═════════════════════════════════════════════════════════════
temporadasIds.forEach((tid, i) => {
  const lista = porTemporada.get(tid);
  const temp = CLUB_DATA.temporadas[tid] || {};
  const nom = nombreTemporada(tid);
  const r = resumenNumeros(lista);
  const anterior = temporadasIds[i - 1];
  const siguiente = temporadasIds[i + 1];

  // Resumen por competición
  const comps = [...new Set(lista.map((p) => p.competicion))];
  const filasComp = comps
    .map((c) => {
      const rc = resumenNumeros(lista.filter((p) => p.competicion === c));
      return `<tr><td>${bi(e(c), e(competicionEn(c)))}</td><td class="num">${rc.pj}</td><td class="num">${rc.v}</td><td class="num">${rc.e}</td><td class="num">${rc.d}</td><td class="num">${rc.gf}</td><td class="num">${rc.gc}</td></tr>`;
    })
    .join('\n                ');

  // Entrenadores
  const entrenadores = (temp.cuerpoTecnico || []).map((m) =>
    C.datosEntrenador(CLUB_DATA, m),
  );

  // Plantilla (jugadores con al menos un partido esa temporada)
  const plantilla = (temp.jugadores || [])
    .filter((j) => (j.partidos || []).length)
    .map((j) => {
      const info = C.datosJugador(CLUB_DATA, j.codigo);
      const goles = (j.partidos || []).reduce((s, p) => s + (p.goles || 0), 0);
      const esPortero = info.posicion === 'Portero';
      return {
        codigo: j.codigo,
        ...info,
        pj: j.partidos.length,
        goles,
        esPortero,
      };
    })
    .sort(
      (a, b) =>
        (({ Portero: 0, Defensa: 1, Centrocampista: 2, Delantero: 3 })[
          a.posicion
        ] ?? 9) -
          ({ Portero: 0, Defensa: 1, Centrocampista: 2, Delantero: 3 }[
            b.posicion
          ] ?? 9) || b.pj - a.pj,
    );
  const maxGoleador = plantilla
    .filter((j) => j.goles && !j.esPortero)
    .sort((a, b) => b.goles - a.goles)[0];

  const titulo = `Real Oviedo temporada ${nom}: resultados de todos los partidos | Sangre Carbayona`;
  const descripcion =
    `Todos los partidos del Real Oviedo en la temporada ${nom} (${temp.competicion || comps[0]}): ` +
    `${r.pj} partidos, ${r.v} victorias, ${r.e} empates y ${r.d} derrotas. ` +
    `${maxGoleador ? `Máximo goleador: ${maxGoleador.nombre} (${maxGoleador.goles}). ` : ''}Resultados, plantilla y entrenadores.`;

  const compTemp = temp.competicion || comps[0];
  const introEn =
    `All Real Oviedo matches in the ${nom} season (${competicionEn(compTemp)}): ` +
    `${r.pj} matches, ${r.v} wins, ${r.e} draws and ${r.d} losses.` +
    `${maxGoleador ? ` Top scorer: ${maxGoleador.nombre} (${maxGoleador.goles}).` : ''}`;
  const cuerpo = `
        <section class="bloque">
          <p class="texto-intro">${bi(e(descripcion.replace(' Resultados, plantilla y entrenadores.', '')), e(introEn))}</p>
          ${htmlResumen(r)}
        </section>

        <section class="bloque">
          <h2>${bi('Por competición', 'By competition')}</h2>
          <div class="tabla-scroll">
            <table class="tabla">
              <thead><tr><th>${bi('Competición', 'Competition')}</th><th class="num">${bi('PJ', 'P')}</th><th class="num">${bi('V', 'W')}</th><th class="num">${bi('E', 'D')}</th><th class="num">${bi('D', 'L')}</th><th class="num">GF</th><th class="num">${bi('GC', 'GA')}</th></tr></thead>
              <tbody>
                ${filasComp}
              </tbody>
            </table>
          </div>
        </section>

        <section class="bloque">
          <h2>${bi(`Partidos (${lista.length})`, `Matches (${lista.length})`)}</h2>
          <ul class="lista-partidos">
          ${lista.map((p) => htmlFilaPartido(p)).join('\n          ')}
          </ul>
        </section>

        ${
          entrenadores.length
            ? `<section class="bloque">
          <h2>${bi('Entrenadores', 'Coaches')}</h2>
          <ul class="lista-simple">
            ${entrenadores.map((en) => `<li><a href="../fichas/${e(en.slugFicha)}.html">${e(en.nombreCompleto)}</a></li>`).join('\n            ')}
          </ul>
        </section>`
            : ''
        }

        <section class="bloque">
          <h2>${bi(`Plantilla ${e(nom)}`, `Squad ${e(nom)}`)}</h2>
          <div class="tabla-scroll">
            <table class="tabla">
              <thead><tr><th>${bi('Jugador', 'Player')}</th><th class="ocultar-movil">${bi('Posición', 'Position')}</th><th class="num">${bi('PJ', 'Apps')}</th><th class="num">${bi('Goles', 'Goals')}</th></tr></thead>
              <tbody>
                ${plantilla
                  .map(
                    (j) =>
                      `<tr><td>${j.tieneFicha ? `<a href="../fichas/${e(j.codigo)}-${e(tid)}.html">${e(j.nombreCompleto)}</a>` : e(j.nombreCompleto)}</td><td class="pos ocultar-movil">${bi(e(j.posicion), e(posicionEn(j.posicion)))}</td><td class="num">${j.pj}</td><td class="num">${j.esPortero && j.goles > 0 ? `<span class="goles-encajados" title="Goles encajados">${j.goles}</span>` : j.goles}</td></tr>`,
                  )
                  .join('\n                ')}
              </tbody>
            </table>
          </div>
          ${plantilla.some((j) => j.esPortero) ? `<p class="nota">${NOTA_PORTEROS}</p>` : ''}
        </section>

        <nav class="nav-partidos" aria-label="Temporada anterior y siguiente">
          ${anterior ? `<a class="ant" href="${slugTemporada(anterior)}.html"><small>${bi('← Temporada anterior', '← Previous season')}</small><strong>${nombreTemporada(anterior)}</strong></a>` : ''}
          ${siguiente ? `<a class="sig" href="${slugTemporada(siguiente)}.html"><small>${bi('Temporada siguiente →', 'Next season →')}</small><strong>${nombreTemporada(siguiente)}</strong></a>` : ''}
        </nav>`;

  escribir(
    slugTemporada(tid),
    pagina({
      titulo,
      descripcion,
      slug: slugTemporada(tid),
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `Real Oviedo, temporada ${nom}`,
          url: urlAbsoluta(slugTemporada(tid)),
          about: { '@type': 'SportsTeam', name: OVIEDO, sport: 'Fútbol' },
        },
      ],
      migas: [
        MIGA_INICIO,
        MIGA_PARTIDOS,
        { nombre: `Temporada ${nom}`, en: `Season ${nom}` },
      ],
      h1: `Real Oviedo · Temporada ${nom}`,
      h1En: `Real Oviedo · Season ${nom}`,
      subtitulo: `${compTemp} · ${r.pj} partidos · ${vedEs(r)}`,
      subtituloEn: `${competicionEn(compTemp)} · ${r.pj} matches · ${vedEn(r)}`,
      cuerpo,
    }),
  );
});
console.log(`  ✔ ${temporadasIds.length} páginas de temporada`);

// ═════════════════════════════════════════════════════════════
// 3. UNA PÁGINA POR RIVAL
// ═════════════════════════════════════════════════════════════
const rivalesOrdenados = [...porRival.values()].sort((a, b) =>
  a.nombre.localeCompare(b.nombre, 'es'),
);
rivalesOrdenados.forEach(({ nombre, partidos: lista }) => {
  const r = resumenNumeros(lista);
  const slug = slugRival(nombre);
  const enCasa = lista.filter((p) => p.oviedoLocal);
  const fuera = lista.filter((p) => !p.oviedoLocal);
  const ultimo = lista[lista.length - 1];
  const usados = nombresUsados(lista);
  const usadosAntiguos = usados.filter(
    (x) => claveEquipo(x.nombre) !== claveEquipo(nombre),
  );
  // Otros nombres del club que todavía no aparecen en ningún partido
  // de los datos (se muestran como "también conocido como").
  const otros = (otrosNombresDe.get(claveEquipo(nombre)) || []).filter(
    (n) => !usados.some((x) => claveEquipo(x.nombre) === claveEquipo(n)),
  );
  const entreParentesis = usadosAntiguos.length
    ? ` (${usadosAntiguos.map((x) => x.nombre).join(', ')})`
    : '';
  const titulo = `Real Oviedo vs ${nombre}${entreParentesis}: historial y resultados | Sangre Carbayona`;
  const descripcion =
    `Historial del Real Oviedo contra ${nombre}${usadosAntiguos.length ? `, también como ${usadosAntiguos.map((x) => x.nombre).join(' y ')}` : ''}: ${r.pj} ${r.pj === 1 ? 'partido' : 'partidos'} (${r.v} victorias, ${r.e} empates, ${r.d} derrotas, ${r.gf}-${r.gc} en goles). ` +
    `Último enfrentamiento: ${ultimo.local} ${marcador(ultimo)} ${ultimo.visitante} (${fechaCorta(ultimo.fecha)}).`;

  const antiguosTxt = usadosAntiguos.map((x) => x.nombre);
  const descripcionEn =
    `Real Oviedo head-to-head against ${nombre}${antiguosTxt.length ? `, also as ${antiguosTxt.join(' and ')}` : ''}: ${r.pj} ${r.pj === 1 ? 'match' : 'matches'} (${r.v} wins, ${r.e} draws, ${r.d} losses, ${r.gf}-${r.gc} on goals). ` +
    `Last meeting: ${ultimo.local} ${marcador(ultimo).replace(' pen.', ' pens')} ${ultimo.visitante} (${fechaCortaEn(ultimo.fecha)}).`;
  const vCasa = resumenNumeros(enCasa).v;
  const vFuera = resumenNumeros(fuera).v;
  const desde = nombreTemporada(temporadasIds[0]);
  const notaCasaFuera = bi(
    `En casa: ${nPartidosTxt(enCasa.length)} (${vCasa} victorias). Fuera: ${nPartidosTxt(fuera.length)} (${vFuera} victorias). Datos desde la temporada ${desde}.`,
    `At home: ${enCasa.length} ${enCasa.length === 1 ? 'match' : 'matches'} (${vCasa} wins). Away: ${fuera.length} ${fuera.length === 1 ? 'match' : 'matches'} (${vFuera} wins). Data since the ${desde} season.`,
  );

  const bloqueNombres =
    usados.length > 1 || usadosAntiguos.length || otros.length
      ? `
        <section class="bloque">
          <h2>${bi('Nombres del club', 'Club names')}</h2>
          ${
            usados.length > 1 || usadosAntiguos.length
              ? `<p>${usados.length > 1 ? bi(`Contra el Real Oviedo ha jugado con ${usados.length} nombres distintos:`, `Has played Real Oviedo under ${usados.length} different names:`) : bi('Contra el Real Oviedo ha jugado con este nombre:', 'Has played Real Oviedo under this name:')}</p>
          <ul class="lista-simple">
            ${usados.map((x) => `<li><strong>${e(x.nombre)}</strong> · ${bi(`${e(rangoTemporadas(x))} (${nPartidosTxt(x.n)})`, `${e(rangoTemporadas(x, true))} (${x.n} ${x.n === 1 ? 'match' : 'matches'})`)}</li>`).join('\n            ')}
          </ul>`
              : ''
          }
          ${otros.length ? `<p class="nota">${bi(`También conocido como: ${otros.map((n) => e(n)).join(', ')}.`, `Also known as: ${otros.map((n) => e(n)).join(', ')}.`)}</p>` : ''}
        </section>`
      : '';
  const notaClub = (clubInfo.get(claveEquipo(nombre)) || {}).nota;
  const notaClubEn = (clubInfo.get(claveEquipo(nombre)) || {}).notaEn;

  const cuerpo = `
        <section class="bloque">
          <div class="marcador">
            ${`<div class="marcador-equipo es-oviedo">${htmlEscudo(OVIEDO)}<span class="nombre">${OVIEDO}</span></div>`}
            <div class="marcador-centro"><div class="resultado">${r.v}-${r.e}-${r.d}</div><div class="penaltis">${bi('victorias · empates · derrotas', 'wins · draws · losses')}</div></div>
            ${`<div class="marcador-equipo">${htmlEscudo(nombre)}<span class="nombre">${e(nombre)}</span></div>`}
          </div>
        </section>

        <section class="bloque">
          <p class="texto-intro">${bi(e(descripcion), e(descripcionEn))}</p>
          ${htmlResumen(r)}
          <p class="nota">${notaCasaFuera}</p>
        </section>
${bloqueNombres}
${notaClub ? `        <section class="bloque"><h2>${bi('Sobre el club', 'About the club')}</h2><p>${bi(e(notaClub), notaClubEn ? e(notaClubEn) : undefined)}</p></section>` : ''}

        <section class="bloque">
          <h2>${bi('Todos los partidos', 'All matches')}</h2>
          <ul class="lista-partidos">
          ${[...lista]
            .reverse()
            .map((p) => htmlFilaPartido(p, { mostrarTemporada: true }))
            .join('\n          ')}
          </ul>
        </section>`;

  escribir(
    slug,
    pagina({
      titulo,
      descripcion,
      slug,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `Real Oviedo contra ${nombre}`,
          url: urlAbsoluta(slug),
          about: {
            '@type': 'SportsTeam',
            name: nombre,
            ...(usadosAntiguos.length || otros.length
              ? {
                  alternateName: [
                    ...usadosAntiguos.map((x) => x.nombre),
                    ...otros,
                  ],
                }
              : {}),
          },
        },
      ],
      migas: [
        MIGA_INICIO,
        MIGA_PARTIDOS,
        {
          nombre: 'Rivales',
          en: 'Opponents',
          href: 'rivales.html',
          url: urlAbsoluta('rivales'),
        },
        { nombre: `Contra ${nombre}`, en: `vs ${nombre}` },
      ],
      h1: `Real Oviedo vs ${nombre}`,
      subtitulo: `Historial: ${nPartidosTxt(r.pj)} desde ${nombreTemporada(lista[0].tid)}${antiguosTxt.length ? ` · También como ${antiguosTxt.join(', ')}` : ''}`,
      subtituloEn: `Head-to-head: ${r.pj} ${r.pj === 1 ? 'match' : 'matches'} since ${nombreTemporada(lista[0].tid)}${antiguosTxt.length ? ` · Also as ${antiguosTxt.join(', ')}` : ''}`,
      cuerpo,
    }),
  );
});
console.log(`  ✔ ${rivalesOrdenados.length} páginas de rival`);

// ═════════════════════════════════════════════════════════════
// 3b. ÍNDICE DE RIVALES DE LA A A LA Z (/partidos/rivales.html)
// ═════════════════════════════════════════════════════════════
// Se ordena ignorando prefijos como "C.D.", "U.D.", "Real"... para que
// "C.D. Tenerife" salga en la T y no todos amontonados en la C.
const RIVALES_EN_PORTADA = 12;
const PREFIJOS_ORDEN = new Set([...PREFIJOS, 'real', 'sad', 'ud', 'club']);
function nombreParaOrdenar(nombre) {
  const palabras = C.slugTexto(nombre).split('-').filter(Boolean);
  const i = palabras.findIndex((p) => !PREFIJOS_ORDEN.has(p));
  return (i === -1 ? palabras : palabras.slice(i)).join(' ');
}
{
  const conOrden = rivalesOrdenados.map((rv) => {
    const orden = nombreParaOrdenar(rv.nombre);
    const letra = /^[a-z]/.test(orden) ? orden[0].toUpperCase() : '#';
    const antiguos = nombresUsados(rv.partidos)
      .map((x) => x.nombre)
      .filter((n) => claveEquipo(n) !== claveEquipo(rv.nombre));
    return { ...rv, orden, letra, antiguos };
  });
  conOrden.sort((a, b) => a.orden.localeCompare(b.orden, 'es'));
  const letras = [...new Set(conOrden.map((x) => x.letra))];
  const titulo = `Rivales del Real Oviedo de la A a la Z: historial contra cada equipo | Sangre Carbayona`;
  const descripcion = `Los ${conOrden.length} equipos contra los que ha jugado el Real Oviedo desde ${nombreTemporada(temporadasIds[0])}, ordenados alfabéticamente, con el historial de partidos contra cada uno.`;

  const descripcionEn = `The ${conOrden.length} teams Real Oviedo has played since ${nombreTemporada(temporadasIds[0])}, in alphabetical order, with the head-to-head record against each one.`;
  const cuerpo = `
        <section class="bloque">
          <p class="texto-intro">${bi(e(descripcion), e(descripcionEn))}</p>
          <label class="filtro-rivales">
            <i class="fas fa-search" aria-hidden="true"></i>
            <input type="search" id="filtroRivales" placeholder="Buscar rival..." data-en-placeholder="Search opponent..." aria-label="Buscar rival" autocomplete="off" />
          </label>
          <nav class="indice-letras" id="indice" aria-label="Índice alfabético">
            ${letras.map((l) => `<a href="#letra-${l === '#' ? 'otros' : l}">${l}</a>`).join('')}
          </nav>
          <p class="sin-resultados" id="sinResultados" hidden>${bi('Ningún rival coincide con la búsqueda.', 'No opponent matches your search.')}</p>
        </section>

        ${letras
          .map(
            (
              l,
            ) => `<section class="bloque grupo-letra" id="letra-${l === '#' ? 'otros' : l}">
          <h2>${l}<a class="volver-indice" href="#indice">${bi('↑ Índice', '↑ Index')}</a></h2>
          <ul class="lista-rivales">
            ${conOrden
              .filter((x) => x.letra === l)
              .map(
                (x) =>
                  `<li data-buscar="${e([x.nombre, ...x.antiguos, ...(otrosNombresDe.get(claveEquipo(x.nombre)) || [])].map((n) => C.slugTexto(n).replace(/-/g, ' ')).join(' | '))}"><a href="${slugRival(x.nombre)}.html"><span class="nombre-rival">${e(x.nombre)}${x.antiguos.length ? bi(`antes ${e(x.antiguos.join(', '))}`, `formerly ${e(x.antiguos.join(', '))}`, 'small') : ''}</span><span class="cuenta">${x.partidos.length}</span></a></li>`,
              )
              .join('\n            ')}
          </ul>
        </section>`,
          )
          .join('\n\n        ')}

        <script>
          // Filtro instantáneo (opcional: sin JavaScript se ve la lista completa)
          (function () {
            var input = document.getElementById('filtroRivales');
            if (!input) return;
            var norm = function (t) {
              return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
            };
            input.addEventListener('input', function () {
              var q = norm(input.value);
              var hay = false;
              document.querySelectorAll('.grupo-letra').forEach(function (g) {
                var visibles = 0;
                g.querySelectorAll('li').forEach(function (li) {
                  var ok = !q || li.getAttribute('data-buscar').indexOf(q) !== -1;
                  li.hidden = !ok;
                  if (ok) visibles++;
                });
                g.hidden = visibles === 0;
                if (visibles) hay = true;
              });
              document.getElementById('sinResultados').hidden = hay;
              document.getElementById('indice').hidden = !!q;
            });
          })();
        </script>`;

  escribir(
    'rivales',
    pagina({
      titulo,
      descripcion,
      slug: 'rivales',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Rivales del Real Oviedo',
          url: urlAbsoluta('rivales'),
        },
      ],
      migas: [
        MIGA_INICIO,
        MIGA_PARTIDOS,
        { nombre: 'Rivales', en: 'Opponents' },
      ],
      h1: 'Rivales del Real Oviedo',
      h1En: 'Real Oviedo opponents',
      subtitulo: `${conOrden.length} equipos de la A a la Z`,
      subtituloEn: `${conOrden.length} teams from A to Z`,
      cuerpo,
    }),
  );
  console.log('  ✔ índice de rivales (A-Z)');
}

// ═════════════════════════════════════════════════════════════
// 4. PORTADA DE RESULTADOS (/partidos/index.html)
// ═════════════════════════════════════════════════════════════
{
  const r = resumenNumeros(partidos);
  const primera = nombreTemporada(temporadasIds[0]);
  const ultima = nombreTemporada(temporadasIds[temporadasIds.length - 1]);
  const titulo = `Resultados del Real Oviedo: todos los partidos desde ${primera} | Sangre Carbayona`;
  const descripcion =
    `Archivo de resultados del Real Oviedo de ${primera} a ${ultima}: ${r.pj} partidos con marcador, goleadores y alineaciones, ` +
    `organizados por temporada y por rival.`;

  const introEn =
    `Real Oviedo results archive from ${primera} to ${ultima}: ${r.pj} matches with score, scorers and line-ups, ` +
    `organised by season and by opponent. Every match has its own page with the players who took part, their minutes, goals and cards.`;
  const cuerpo = `
        <section class="bloque">
          <p class="texto-intro">${bi(`${e(descripcion)} Cada partido tiene su propia página con los jugadores que participaron, sus minutos, goles y tarjetas.`, e(introEn))}</p>
          ${htmlResumen(r)}
        </section>

        <section class="bloque">
          <h2>${bi('Últimos partidos', 'Latest matches')}</h2>
          <ul class="lista-partidos">
          ${partidos
            .slice(-10)
            .reverse()
            .map((p) => htmlFilaPartido(p, { mostrarTemporada: true }))
            .join('\n          ')}
          </ul>
        </section>

        <section class="bloque">
          <h2>${bi('Por temporada', 'By season')}</h2>
          <div class="rejilla-enlaces">
            ${[...temporadasIds]
              .reverse()
              .map((tid) => {
                const rt = resumenNumeros(porTemporada.get(tid));
                const comp =
                  (CLUB_DATA.temporadas[tid] || {}).competicion || '';
                return `<a href="${slugTemporada(tid)}.html"><strong>${nombreTemporada(tid)}</strong>${bi(`${e(comp)} · ${vedEs(rt)}`, `${e(competicionEn(comp))} · ${vedEn(rt)}`)}</a>`;
              })
              .join('\n            ')}
          </div>
        </section>

        <section class="bloque">
          <h2>${bi('Rivales más habituales', 'Most frequent opponents')}</h2>
          <div class="rejilla-enlaces">
            ${[...rivalesOrdenados]
              .sort(
                (a, b) =>
                  b.partidos.length - a.partidos.length ||
                  a.nombre.localeCompare(b.nombre, 'es'),
              )
              .slice(0, RIVALES_EN_PORTADA)
              .map(
                ({ nombre, partidos: l }) =>
                  `<a href="${slugRival(nombre)}.html"><strong>${e(nombre)}</strong>${nPartidos(l.length)}</a>`,
              )
              .join('\n            ')}
          </div>
          <a class="boton-ver-todos" href="rivales.html">${bi(`Ver los ${rivalesOrdenados.length} rivales de la A a la Z →`, `See all ${rivalesOrdenados.length} opponents from A to Z →`)}</a>
        </section>`;

  escribir(
    'index',
    pagina({
      titulo,
      descripcion,
      slug: 'index',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Resultados del Real Oviedo',
          url: urlAbsoluta('index'),
          about: { '@type': 'SportsTeam', name: OVIEDO, sport: 'Fútbol' },
        },
      ],
      migas: [MIGA_INICIO, { nombre: 'Partidos', en: 'Matches' }],
      h1: 'Resultados del Real Oviedo',
      h1En: 'Real Oviedo results',
      subtitulo: `${r.pj} partidos de ${primera} a ${ultima}`,
      subtituloEn: `${r.pj} matches from ${primera} to ${ultima}`,
      cuerpo,
    }),
  );
}

// ── LIMPIEZA: borrar páginas que ya no corresponden a ningún dato ──
let borrados = 0;
fs.readdirSync(outputDir).forEach((f) => {
  if (f.endsWith('.html') && !escritos.has(f)) {
    fs.unlinkSync(path.join(outputDir, f));
    borrados++;
    console.log(`  🗑 Eliminada página antigua: ${f}`);
  }
});

if (escudosAusentes.size) {
  console.log(
    `\n⚠ ${escudosAusentes.size} escudos de js/data-escudos.js apuntan a un archivo que no existe (se muestran las iniciales):`,
  );
  escudosAusentes.forEach((x) => console.log(`   - ${x}`));
}

if (avisos.length) {
  console.log(
    `\n⚠ ${avisos.length} copias de partido no coinciden con el resto (se ha usado el valor mayoritario). Conviene corregirlas en los datos:`,
  );
  avisos.forEach((a) => console.log(`   - ${a}`));
}

console.log(
  `\n✅ ¡ÉXITO! ${escritos.size} páginas generadas en /${CARPETA_PARTIDOS}/ (${partidos.length} partidos, ${temporadasIds.length} temporadas, ${rivalesOrdenados.length} rivales), ${borrados} antiguas eliminadas.`,
);
