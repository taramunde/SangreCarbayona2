#!/usr/bin/env node
/**
 * generar-previa-partido.js — se ejecuta solo con `npm run subir`.
 *
 * WhatsApp, Telegram, X... no ejecutan el JavaScript de la web: para la
 * tarjeta de vista previa leen las etiquetas og:/twitter: del HTML tal
 * cual está guardado. Este script las escribe en alineacion.html y
 * calendario.html con el PRÓXIMO PARTIDO (el mismo que calcula la web,
 * js/calendario.js → getProximoPartidoGeneral) y crea su imagen:
 * escudo del Oviedo y del rival a cada lado, con jornada, fecha y hora.
 *
 * La imagen va en img/compartir/partido-<fecha>-<rival>.jpg (nombre
 * distinto por partido para que WhatsApp no tire de una vieja) y se
 * borran las de partidos anteriores.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const sharp = require('sharp');

const RAIZ = path.join(__dirname, '..');
const BASE_URL = 'https://taramunde.github.io/SangreCarbayona2';
const CARPETA = path.join(RAIZ, 'img', 'compartir');
const PAGINAS = ['alineacion.html', 'calendario.html'];
const INICIO = '<!-- previa-partido:inicio (lo escribe generador/generar-previa-partido.js) -->';
const FIN = '<!-- previa-partido:fin -->';

// ── Cargar los datos con los mismos scripts que la web ────────────
const doc = {
  readyState: 'complete',
  addEventListener() {},
  getElementById() { return null; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  createElement() { return { style: {}, setAttribute() {}, appendChild() {} }; },
  head: { appendChild() {} },
  body: { appendChild() {} },
};
const g = {
  console,
  document: doc,
  localStorage: { getItem() { return null; }, setItem() {} },
  location: { href: BASE_URL + '/', search: '', pathname: '/' },
  setTimeout() {},
  navigator: {},
};
g.window = g;
vm.createContext(g);
[
  'data-club.js',
  'data-jugadores.js',
  'data-temporada-actual.js',
  'i18n.js',
  'clasificacion.js',
  'calendario.js',
  'data-alineacion.js',
  'data-estadios.js',
].forEach((f) =>
  vm.runInContext(
    fs.readFileSync(path.join(RAIZ, 'js', f), 'utf8').replace(/^const CLUB_DATA/m, 'var CLUB_DATA'),
    g,
    { filename: f },
  ),
);
const CD = g.CLUB_DATA;

// ── Utilidades ───────────────────────────────────────────────────
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
const slug = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
function fechaLarga(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  const f = new Date(a, m - 1, d);
  const dia = DIAS[f.getDay()];
  return `${dia[0].toUpperCase()}${dia.slice(1)} ${d} de ${MESES[m - 1]}`;
}

function datosPartido(p) {
  const especial = !!p.competicion;
  const temp = CD.temporadas[CD.temporadaActualId || CD.temporadaActual] || {};
  const competicion = especial ? p.competicion : temp.competicion || '';
  const ronda = especial ? p.ronda || '' : `Jornada ${p.jornada}`;
  const est = (CD.estadios || []).find((e) => e.equipo === p.equipo1);
  let cuando = p.fecha ? fechaLarga(p.fecha) : '';
  if (cuando && p.hora) cuando += `, ${p.hora}`;
  if (cuando && p.aproximada) cuando += ' (fecha aproximada)';
  return {
    local: p.equipo1,
    visitante: p.equipo2,
    competicion,
    ronda,
    cuando,
    estadio: est ? est.estadio : '',
    escudoLocal: g.getEscudoEquipo(p.equipo1),
    escudoVisitante: g.getEscudoEquipo(p.equipo2),
  };
}

// ── Imagen 1200×630 ──────────────────────────────────────────────
async function escudoPng(rutaRel, lado) {
  const ruta = rutaRel && !/^https?:/.test(rutaRel) ? path.join(RAIZ, rutaRel) : null;
  if (!ruta || !fs.existsSync(ruta)) return null;
  return sharp(ruta)
    .resize(lado, lado, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

function tamNombre(nombre) {
  const n = nombre.length;
  return n <= 14 ? 40 : n <= 20 ? 34 : n <= 26 ? 28 : 24;
}

async function crearImagen(d, salida) {
  const pie = [d.cuando, d.estadio].filter(Boolean).join('  ·  ');
  const W = 1200;
  const H = 630;
  const fondo = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0b1f3d"/>
        <stop offset="1" stop-color="#1a4a8a"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect x="0" y="${H - 92}" width="${W}" height="92" fill="#081730" opacity="0.85"/>
    <rect x="0" y="0" width="${W}" height="8" fill="#c9a227"/>
    <text x="${W / 2}" y="70" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" letter-spacing="6" fill="#c9a227">PRÓXIMO PARTIDO</text>
    <text x="${W / 2}" y="112" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#dbe4f3">${esc([d.competicion, d.ronda].filter(Boolean).join(' · '))}</text>
    <text x="${W / 2}" y="330" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="84" font-weight="700" fill="#ffffff" opacity="0.9">VS</text>
    <text x="300" y="470" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${tamNombre(d.local)}" font-weight="700" fill="#ffffff">${esc(d.local)}</text>
    <text x="900" y="470" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${tamNombre(d.visitante)}" font-weight="700" fill="#ffffff">${esc(d.visitante)}</text>
    <text x="40" y="${H - 38}" font-family="Arial, Helvetica, sans-serif" font-size="${pie.length > 62 ? 22 : pie.length > 52 ? 25 : 28}" fill="#ffffff">${esc(pie)}</text>
    <text x="${W - 40}" y="${H - 38}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#c9a227">Sangre Carbayona</text>
  </svg>`;
  const lado = 250;
  const capas = [];
  const el = await escudoPng(d.escudoLocal, lado);
  const ev = await escudoPng(d.escudoVisitante, lado);
  if (el) capas.push({ input: el, left: 300 - lado / 2, top: 160 });
  if (ev) capas.push({ input: ev, left: 900 - lado / 2, top: 160 });
  const buf = await sharp(Buffer.from(fondo)).composite(capas).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  // Solo se reescribe si cambia, para no subir la misma imagen en cada subida.
  if (!fs.existsSync(salida) || !fs.readFileSync(salida).equals(buf)) fs.writeFileSync(salida, buf);
}

// ── Etiquetas en el HTML ─────────────────────────────────────────
function bloqueMeta({ titulo, descripcion, imagenUrl, alt }) {
  return [
    INICIO,
    `    <meta property="og:title" content="${esc(titulo)}" />`,
    `    <meta property="og:description" content="${esc(descripcion)}" />`,
    `    <meta property="og:image" content="${esc(imagenUrl)}" />`,
    `    <meta property="og:image:width" content="1200" />`,
    `    <meta property="og:image:height" content="630" />`,
    `    <meta property="og:image:alt" content="${esc(alt)}" />`,
    `    <meta property="og:site_name" content="Sangre Carbayona" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${esc(titulo)}" />`,
    `    <meta name="twitter:description" content="${esc(descripcion)}" />`,
    `    <meta name="twitter:image" content="${esc(imagenUrl)}" />`,
    `    ${FIN}`,
  ].join('\n');
}

function escribirEnPagina(archivo, bloque) {
  const ruta = path.join(RAIZ, archivo);
  let html = fs.readFileSync(ruta, 'utf8');
  const NL = html.includes('\r\n') ? '\r\n' : '\n';
  const b = bloque.replace(/\n/g, NL);
  const i = html.indexOf(INICIO);
  if (i >= 0) {
    const ini = html.lastIndexOf('\n', i) + 1; // desde el principio de la línea
    const j = html.indexOf(FIN, i) + FIN.length;
    html = html.slice(0, ini) + '    ' + b.trimStart() + html.slice(j);
  } else {
    // Primera vez: quitar las og:title/description/image y twitter:* sueltas
    // (las sustituye el bloque) y meter el bloque antes de </head>.
    html = html.replace(
      /[ \t]*<meta\s+(?:property="og:(?:title|description|image|image:alt|site_name)"|name="twitter:(?:card|title|description|image)")\s[^>]*?\/?>\s*\r?\n/gs,
      '',
    );
    html = html.replace(/[ \t]*<\/head>/, `    ${b.trimStart()}${NL}  </head>`);
  }
  fs.writeFileSync(ruta, html);
}

async function main() {
  const p = g.getProximoPartidoGeneral();
  if (!p) {
    console.log('  (previa) No hay próximo partido: no se cambian las tarjetas de compartir.');
    return;
  }
  const d = datosPartido(p);
  fs.mkdirSync(CARPETA, { recursive: true });
  const nombre = `partido-${p.fecha}-${slug(p.equipo1 === 'Real Oviedo' ? p.equipo2 : p.equipo1)}.jpg`;
  await crearImagen(d, path.join(CARPETA, nombre));
  fs.readdirSync(CARPETA)
    .filter((f) => f.startsWith('partido-') && f !== nombre)
    .forEach((f) => fs.unlinkSync(path.join(CARPETA, f)));

  const imagenUrl = `${BASE_URL}/img/compartir/${nombre}`;
  const enfrentamiento = `${d.local} – ${d.visitante}`;
  const linea = [d.competicion, d.ronda, d.cuando, d.estadio].filter(Boolean).join(' · ');
  const al = CD.alineacion || {};
  const estado =
    al.paraFecha === p.fecha
      ? { confirmada: 'Once confirmado', probable: 'Once probable' }[al.estado] || 'Once sin confirmar'
      : 'Once sin confirmar';
  const alt = `Escudos de ${d.local} y ${d.visitante}`;

  escribirEnPagina(
    'alineacion.html',
    bloqueMeta({
      titulo: `Alineación: ${enfrentamiento}`,
      descripcion: `${estado} del Real Oviedo. ${linea}.`,
      imagenUrl,
      alt,
    }),
  );
  escribirEnPagina(
    'calendario.html',
    bloqueMeta({
      titulo: `Calendario del Real Oviedo · Próximo: ${enfrentamiento}`,
      descripcion: `${linea}. Todos los partidos del Real Oviedo esta temporada.`,
      imagenUrl,
      alt,
    }),
  );
  console.log(`✔ Tarjetas de compartir: ${enfrentamiento} (${PAGINAS.join(', ')}) → img/compartir/${nombre}`);
}

main().catch((e) => {
  // Si falla (p. ej. falta sharp en este ordenador) no se para la subida.
  console.warn(`⚠ No se pudo generar la tarjeta de compartir del partido: ${e.message}`);
});
