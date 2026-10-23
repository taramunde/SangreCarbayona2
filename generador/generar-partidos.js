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
} = C;

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
// Solo se usa un escudo cuando el nombre coincide de verdad con el
// club (nunca el del primer equipo para un filial: "Getafe C.F. B" no
// lleva el escudo del Getafe). Si no hay escudo, se pinta un círculo
// con las iniciales.
const ESCUDOS = fs
  .readdirSync(path.join(__dirname, '..', 'img', 'escudos'))
  .filter((f) => f.endsWith('.webp'))
  .map((f) => f.replace('.webp', ''));
const ESCUDOS_ALIAS = {
  realoviedo: 'Oviedo',
  realsportingdegijon: 'Sporting',
  rccelta: 'CeltaVigo',
  rcceltadevigo: 'CeltaVigo',
  celtadevigo: 'CeltaVigo',
  rcdeportivodelacoruna: 'DeportivoACoruna',
  deportivodelacoruna: 'DeportivoACoruna',
  albacetebalompie: 'Albacete',
  deportivoalaves: 'Alaves',
  rcdespanyol: 'Espanyol',
  realbetis: 'Betis',
};
const PREFIJOS = new Set([
  'cd', 'cf', 'ud', 'sd', 'fc', 'rcd', 'rc', 'ad', 'ca', 'ce', 'ue', 'ae', 'club',
]);

function escudoDe(nombre) {
  const completo = claveEquipo(nombre);
  if (ESCUDOS_ALIAS[completo]) return `../img/escudos/${ESCUDOS_ALIAS[completo]}.webp`;
  const palabras = C.slugTexto(nombre).split('-').filter(Boolean);
  const sinPrefijos = palabras.filter((p) => !PREFIJOS.has(p));
  const candidatos = [
    completo,
    sinPrefijos.join(''),
    sinPrefijos.filter((p) => p !== 'real').join(''),
  ];
  for (const cand of candidatos) {
    const f = ESCUDOS.find((x) => x.toLowerCase() === cand);
    if (f) return `../img/escudos/${f}.webp`;
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

function quienPasaPenaltis(p) {
  if (p.penaltisLocal === null || p.penaltisLocal === undefined) return '';
  const ganaLocal = p.penaltisLocal > p.penaltisVisitante;
  return `${ganaLocal ? p.local : p.visitante} gana ${Math.max(p.penaltisLocal, p.penaltisVisitante)}-${Math.min(p.penaltisLocal, p.penaltisVisitante)} en los penaltis`;
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
          <div><strong>${r.pj}</strong><span>Jugados</span></div>
          <div><strong>${r.v}</strong><span>Victorias</span></div>
          <div><strong>${r.e}</strong><span>Empates</span></div>
          <div><strong>${r.d}</strong><span>Derrotas</span></div>
          <div><strong>${r.gf}</strong><span>Goles a favor</span></div>
          <div><strong>${r.gc}</strong><span>Goles en contra</span></div>
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
  return `<li><a class="fila-partido" href="${e(p.slug)}.html">
            <span class="cuando">${e(fechaCorta(p.fecha))}${mostrarTemporada ? `<br />${e(nombreTemporada(p.tid))}` : ''}</span>
            <span class="cruce">${lado(p.local)} – ${lado(p.visitante)}<small>${e(detalle)}</small></span>
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
  subtitulo,
  cuerpo,
}) {
  const canonical = urlAbsoluta(slug);
  const migasHtml = migas
    .map((m, i) =>
      i === migas.length - 1
        ? `<span class="current">${e(m.nombre)}</span>`
        : `<a href="${e(m.href)}">${e(m.nombre)}</a><span>/</span>`,
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
        <h1>${e(h1)}</h1>
        ${subtitulo ? `<p class="subtitulo">${e(subtitulo)}</p>` : ''}
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
    <script src="../js/main.js?nocache=${nc}"></script>
  </body>
</html>
`;
}

const MIGA_INICIO = {
  nombre: 'Inicio',
  href: '../index.html',
  url: `${SITE_BASE_URL}/`,
};
const MIGA_PARTIDOS = {
  nombre: 'Partidos',
  href: 'index.html',
  url: urlAbsoluta('index'),
};

// ── AGRUPACIONES ──────────────────────────────────────────────
const porTemporada = new Map();
const porRival = new Map();
partidos.forEach((p) => {
  if (!porTemporada.has(p.tid)) porTemporada.set(p.tid, []);
  porTemporada.get(p.tid).push(p);
  const k = claveEquipo(p.rival);
  if (!porRival.has(k)) porRival.set(k, { nombre: p.rival, partidos: [] });
  porRival.get(k).partidos.push(p);
});
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
  const rival = porRival.get(claveEquipo(p.rival));

  const textoGoles = goleadores.length
    ? ` Goles del Real Oviedo: ${goleadores
        .map((j) => (j.goles > 1 ? `${j.nombre} (${j.goles})` : j.nombre))
        .join(', ')}.`
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
    superEvent: { '@type': 'SportsEvent', name: `${p.competicion} ${temporadaNom}` },
  };
  if (p.oviedoLocal) {
    eventoLd.location = {
      '@type': 'Place',
      name: ESTADIO_OVIEDO,
      address: { '@type': 'PostalAddress', addressLocality: 'Oviedo', addressCountry: 'ES' },
    };
  }

  const filasJugadores = p.jugadores
    .map((j) => {
      const tarjetas =
        (j.amarilla ? '<span class="tarjeta tarjeta-amarilla" title="Amarilla"></span>' : '') +
        (j.roja ? '<span class="tarjeta tarjeta-roja" title="Roja"></span>' : '');
      return `<tr>
              <td>${enlaceFicha(j, p.tid)}</td>
              <td class="pos ocultar-movil">${e(j.posicion || '')}</td>
              <td class="num">${j.minutos ?? '–'}</td>
              <td class="num">${j.esPortero ? '–' : j.goles}</td>
              <td class="num">${j.asistencias}</td>
              <td class="num">${tarjetas || '–'}</td>
            </tr>`;
    })
    .join('\n');
  const hayPortero = p.jugadores.some((j) => j.esPortero);

  const datos = [
    `<span><i class="fas fa-trophy"></i>${e(p.competicion)}${jornadaTxt ? ` · ${e(jornadaTxt)}` : ''}</span>`,
    `<span><i class="far fa-calendar-alt"></i>${e(fechaLarga(p.fecha))}</span>`,
    p.oviedoLocal
      ? `<span><i class="fas fa-map-marker-alt"></i>${e(ESTADIO_OVIEDO)}</span>`
      : '',
    `<span><i class="fas fa-layer-group"></i>Temporada ${e(temporadaNom)}</span>`,
  ]
    .filter(Boolean)
    .join('\n            ');

  const equipoHtml = (nombre) => `<div class="marcador-equipo${nombre === OVIEDO ? ' es-oviedo' : ''}">
            ${htmlEscudo(nombre)}
            <span class="nombre">${nombre === OVIEDO ? e(nombre) : `<a href="${slugRival(nombre)}.html">${e(nombre)}</a>`}</span>
          </div>`;

  const cuerpo = `
        <section class="bloque" aria-label="Resultado">
          <div class="marcador">
            ${equipoHtml(p.local)}
            <div class="marcador-centro">
              <div class="resultado">${p.golesLocal ?? '-'} - ${p.golesVisitante ?? '-'}</div>
              ${p.penaltisLocal !== null && p.penaltisLocal !== undefined ? `<div class="penaltis">${e(quienPasaPenaltis(p))}</div>` : ''}
              <span class="chip chip-${res}">${TEXTO_RES[res] || ''} del Oviedo</span>
            </div>
            ${equipoHtml(p.visitante)}
          </div>
          <div class="datos-partido">
            ${datos}
          </div>
        </section>

        ${
          goleadores.length || p.entrenadores.length
            ? `<section class="bloque">
          ${goleadores.length ? `<h2>Goles del Real Oviedo</h2>
          <ul class="lista-simple">
            ${goleadores.map((j) => `<li>${enlaceFicha(j, p.tid)}${j.goles > 1 ? ` (${j.goles})` : ''}</li>`).join('\n            ')}
          </ul>` : ''}
          ${p.entrenadores.length ? `<h2 style="margin-top:${goleadores.length ? '20px' : '0'}">Entrenador</h2>
          <ul class="lista-simple">
            ${p.entrenadores.map((en) => `<li><a href="../fichas/${e(en.slugFicha)}.html">${e(en.nombreCompleto)}</a></li>`).join('\n            ')}
          </ul>` : ''}
        </section>`
            : ''
        }

        ${
          p.jugadores.length
            ? `<section class="bloque">
          <h2>Jugadores del Real Oviedo</h2>
          <div class="tabla-scroll">
            <table class="tabla">
              <thead>
                <tr><th>Jugador</th><th class="ocultar-movil">Posición</th><th class="num">Min.</th><th class="num">Goles</th><th class="num">Asist.</th><th class="num">Tarj.</th></tr>
              </thead>
              <tbody>
            ${filasJugadores}
              </tbody>
            </table>
          </div>
          ${hayPortero ? '<p class="nota">En los porteros no se muestran goles: en los datos de la web ese campo recoge los goles encajados.</p>' : ''}
        </section>`
            : ''
        }

        <section class="bloque">
          <h2>Más partidos</h2>
          <ul class="lista-simple">
            <li><a href="${slugTemporada(p.tid)}.html">Todos los partidos de la temporada ${e(temporadaNom)}</a></li>
            <li><a href="${slugRival(p.rival)}.html">Historial contra ${e(p.rival)} (${rival.partidos.length} ${rival.partidos.length === 1 ? 'partido' : 'partidos'})</a></li>
          </ul>
        </section>

        <nav class="nav-partidos" aria-label="Partido anterior y siguiente">
          ${anterior ? `<a class="ant" href="${e(anterior.slug)}.html"><small>← Partido anterior</small><strong>${e(anterior.local)} ${e(marcador(anterior))} ${e(anterior.visitante)}</strong></a>` : ''}
          ${siguiente ? `<a class="sig" href="${e(siguiente.slug)}.html"><small>Partido siguiente →</small><strong>${e(siguiente.local)} ${e(marcador(siguiente))} ${e(siguiente.visitante)}</strong></a>` : ''}
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
        { nombre: `Temporada ${temporadaNom}`, href: `${slugTemporada(p.tid)}.html`, url: urlAbsoluta(slugTemporada(p.tid)) },
        { nombre: `${p.local} - ${p.visitante}` },
      ],
      h1: `${p.local} ${marcador(p)} ${p.visitante}`,
      subtitulo: `${p.competicion}${jornadaTxt ? ` · ${jornadaTxt}` : ''} · ${fechaLarga(p.fecha)}`,
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
      return `<tr><td>${e(c)}</td><td class="num">${rc.pj}</td><td class="num">${rc.v}</td><td class="num">${rc.e}</td><td class="num">${rc.d}</td><td class="num">${rc.gf}</td><td class="num">${rc.gc}</td></tr>`;
    })
    .join('\n                ');

  // Entrenadores
  const entrenadores = (temp.cuerpoTecnico || []).map((m) => C.datosEntrenador(CLUB_DATA, m));

  // Plantilla (jugadores con al menos un partido esa temporada)
  const plantilla = (temp.jugadores || [])
    .filter((j) => (j.partidos || []).length)
    .map((j) => {
      const info = C.datosJugador(CLUB_DATA, j.codigo);
      const goles = info.posicion === 'Portero' ? null : (j.partidos || []).reduce((s, p) => s + (p.goles || 0), 0);
      return { codigo: j.codigo, ...info, pj: j.partidos.length, goles };
    })
    .sort(
      (a, b) =>
        ({ Portero: 0, Defensa: 1, Centrocampista: 2, Delantero: 3 }[a.posicion] ?? 9) -
          ({ Portero: 0, Defensa: 1, Centrocampista: 2, Delantero: 3 }[b.posicion] ?? 9) ||
        b.pj - a.pj,
    );
  const maxGoleador = plantilla
    .filter((j) => j.goles)
    .sort((a, b) => b.goles - a.goles)[0];

  const titulo = `Real Oviedo temporada ${nom}: resultados de todos los partidos | Sangre Carbayona`;
  const descripcion =
    `Todos los partidos del Real Oviedo en la temporada ${nom} (${temp.competicion || comps[0]}): ` +
    `${r.pj} partidos, ${r.v} victorias, ${r.e} empates y ${r.d} derrotas. ` +
    `${maxGoleador ? `Máximo goleador: ${maxGoleador.nombre} (${maxGoleador.goles}). ` : ''}Resultados, plantilla y entrenadores.`;

  const cuerpo = `
        <section class="bloque">
          <p class="texto-intro">${e(descripcion.replace(' Resultados, plantilla y entrenadores.', ''))}</p>
          ${htmlResumen(r)}
        </section>

        <section class="bloque">
          <h2>Por competición</h2>
          <div class="tabla-scroll">
            <table class="tabla">
              <thead><tr><th>Competición</th><th class="num">PJ</th><th class="num">V</th><th class="num">E</th><th class="num">D</th><th class="num">GF</th><th class="num">GC</th></tr></thead>
              <tbody>
                ${filasComp}
              </tbody>
            </table>
          </div>
        </section>

        <section class="bloque">
          <h2>Partidos (${lista.length})</h2>
          <ul class="lista-partidos">
          ${lista.map((p) => htmlFilaPartido(p)).join('\n          ')}
          </ul>
        </section>

        ${
          entrenadores.length
            ? `<section class="bloque">
          <h2>Entrenadores</h2>
          <ul class="lista-simple">
            ${entrenadores.map((en) => `<li><a href="../fichas/${e(en.slugFicha)}.html">${e(en.nombreCompleto)}</a></li>`).join('\n            ')}
          </ul>
        </section>`
            : ''
        }

        <section class="bloque">
          <h2>Plantilla ${e(nom)}</h2>
          <div class="tabla-scroll">
            <table class="tabla">
              <thead><tr><th>Jugador</th><th class="ocultar-movil">Posición</th><th class="num">PJ</th><th class="num">Goles</th></tr></thead>
              <tbody>
                ${plantilla
                  .map(
                    (j) =>
                      `<tr><td>${j.tieneFicha ? `<a href="../fichas/${e(j.codigo)}-${e(tid)}.html">${e(j.nombreCompleto)}</a>` : e(j.nombreCompleto)}</td><td class="pos ocultar-movil">${e(j.posicion)}</td><td class="num">${j.pj}</td><td class="num">${j.goles === null ? '–' : j.goles}</td></tr>`,
                  )
                  .join('\n                ')}
              </tbody>
            </table>
          </div>
        </section>

        <nav class="nav-partidos" aria-label="Temporada anterior y siguiente">
          ${anterior ? `<a class="ant" href="${slugTemporada(anterior)}.html"><small>← Temporada anterior</small><strong>${nombreTemporada(anterior)}</strong></a>` : ''}
          ${siguiente ? `<a class="sig" href="${slugTemporada(siguiente)}.html"><small>Temporada siguiente →</small><strong>${nombreTemporada(siguiente)}</strong></a>` : ''}
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
      migas: [MIGA_INICIO, MIGA_PARTIDOS, { nombre: `Temporada ${nom}` }],
      h1: `Real Oviedo · Temporada ${nom}`,
      subtitulo: `${temp.competicion || comps[0]} · ${r.pj} partidos · ${r.v}V ${r.e}E ${r.d}D`,
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
  const titulo = `Real Oviedo vs ${nombre}: historial y resultados | Sangre Carbayona`;
  const descripcion =
    `Historial del Real Oviedo contra ${nombre}: ${r.pj} ${r.pj === 1 ? 'partido' : 'partidos'} (${r.v} victorias, ${r.e} empates, ${r.d} derrotas, ${r.gf}-${r.gc} en goles). ` +
    `Último enfrentamiento: ${ultimo.local} ${marcador(ultimo)} ${ultimo.visitante} (${fechaCorta(ultimo.fecha)}).`;

  const cuerpo = `
        <section class="bloque">
          <div class="marcador">
            ${`<div class="marcador-equipo es-oviedo">${htmlEscudo(OVIEDO)}<span class="nombre">${OVIEDO}</span></div>`}
            <div class="marcador-centro"><div class="resultado">${r.v}-${r.e}-${r.d}</div><div class="penaltis">victorias · empates · derrotas</div></div>
            ${`<div class="marcador-equipo">${htmlEscudo(nombre)}<span class="nombre">${e(nombre)}</span></div>`}
          </div>
        </section>

        <section class="bloque">
          <p class="texto-intro">${e(descripcion)}</p>
          ${htmlResumen(r)}
          <p class="nota">En casa: ${enCasa.length} partidos (${resumenNumeros(enCasa).v} victorias). Fuera: ${fuera.length} partidos (${resumenNumeros(fuera).v} victorias). Datos desde la temporada ${nombreTemporada(temporadasIds[0])}.</p>
        </section>

        <section class="bloque">
          <h2>Todos los partidos</h2>
          <ul class="lista-partidos">
          ${[...lista].reverse().map((p) => htmlFilaPartido(p, { mostrarTemporada: true })).join('\n          ')}
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
        },
      ],
      migas: [MIGA_INICIO, MIGA_PARTIDOS, { nombre: `Contra ${nombre}` }],
      h1: `Real Oviedo vs ${nombre}`,
      subtitulo: `Historial: ${r.pj} ${r.pj === 1 ? 'partido' : 'partidos'} desde ${nombreTemporada(lista[0].tid)}`,
      cuerpo,
    }),
  );
});
console.log(`  ✔ ${rivalesOrdenados.length} páginas de rival`);

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

  const cuerpo = `
        <section class="bloque">
          <p class="texto-intro">${e(descripcion)} Cada partido tiene su propia página con los jugadores que participaron, sus minutos, goles y tarjetas.</p>
          ${htmlResumen(r)}
        </section>

        <section class="bloque">
          <h2>Últimos partidos</h2>
          <ul class="lista-partidos">
          ${partidos.slice(-10).reverse().map((p) => htmlFilaPartido(p, { mostrarTemporada: true })).join('\n          ')}
          </ul>
        </section>

        <section class="bloque">
          <h2>Por temporada</h2>
          <div class="rejilla-enlaces">
            ${[...temporadasIds]
              .reverse()
              .map((tid) => {
                const rt = resumenNumeros(porTemporada.get(tid));
                const comp = (CLUB_DATA.temporadas[tid] || {}).competicion || '';
                return `<a href="${slugTemporada(tid)}.html"><strong>${nombreTemporada(tid)}</strong><span>${e(comp)} · ${rt.v}V ${rt.e}E ${rt.d}D</span></a>`;
              })
              .join('\n            ')}
          </div>
        </section>

        <section class="bloque">
          <h2>Por rival (${rivalesOrdenados.length})</h2>
          <div class="rejilla-enlaces">
            ${rivalesOrdenados
              .map(
                ({ nombre, partidos: l }) =>
                  `<a href="${slugRival(nombre)}.html"><strong>${e(nombre)}</strong><span>${l.length} ${l.length === 1 ? 'partido' : 'partidos'}</span></a>`,
              )
              .join('\n            ')}
          </div>
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
      migas: [MIGA_INICIO, { nombre: 'Partidos' }],
      h1: 'Resultados del Real Oviedo',
      subtitulo: `${r.pj} partidos de ${primera} a ${ultima}`,
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

if (avisos.length) {
  console.log(
    `\n⚠ ${avisos.length} copias de partido no coinciden con el resto (se ha usado el valor mayoritario). Conviene corregirlas en los datos:`,
  );
  avisos.forEach((a) => console.log(`   - ${a}`));
}

console.log(
  `\n✅ ¡ÉXITO! ${escritos.size} páginas generadas en /${CARPETA_PARTIDOS}/ (${partidos.length} partidos, ${temporadasIds.length} temporadas, ${rivalesOrdenados.length} rivales), ${borrados} antiguas eliminadas.`,
);
