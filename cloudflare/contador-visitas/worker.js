/* ===================================
   CONTADOR DE VISITAS — Cloudflare Worker
   Sangre Carbayona

   Endpoints:
     POST /hit    -> suma una visita (país + día) y devuelve las estadísticas
     GET  /stats  -> solo devuelve las estadísticas (cacheadas 30 s)

   Necesita una base de datos D1 enlazada con el nombre de variable "DB"
   (ver LEEME.md). No guarda IPs ni nada personal: solo totales por país
   y por día.
   =================================== */

// Solo cuentan las visitas que vengan de la web publicada.
const ORIGEN_WEB = 'https://taramunde.github.io';

// Orígenes a los que se les deja LEER las estadísticas (la web y pruebas
// en local con Live Server, etc.). Desde local se ven, pero no cuentan.
const ORIGENES_LECTURA = [
  ORIGEN_WEB,
  'http://localhost',
  'http://127.0.0.1',
];

// Bots, crawlers y previsualizadores de enlaces: no cuentan como visita.
const BOTS =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|discord|preview|headless|lighthouse|pagespeed|curl|wget|python|axios|node-fetch|go-http/i;

const MAX_PAISES = 10;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = cabecerasCors(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === '/hit' && request.method === 'POST') {
        const ua = request.headers.get('User-Agent') || '';
        if (origin === ORIGEN_WEB && !BOTS.test(ua)) {
          const pais = normalizarPais(request.cf && request.cf.country);
          const dia = hoyMadrid();
          await env.DB.batch([
            env.DB.prepare(
              'INSERT INTO visitas_pais (pais, total) VALUES (?1, 1) ' +
                'ON CONFLICT(pais) DO UPDATE SET total = total + 1',
            ).bind(pais),
            env.DB.prepare(
              'INSERT INTO visitas_dia (dia, total) VALUES (?1, 1) ' +
                'ON CONFLICT(dia) DO UPDATE SET total = total + 1',
            ).bind(dia),
          ]);
        }
        return responderJson(await estadisticas(env), cors, 'no-store');
      }

      if (url.pathname === '/stats' && request.method === 'GET') {
        return responderJson(
          await estadisticas(env),
          cors,
          'public, max-age=30',
        );
      }

      return new Response('No encontrado', { status: 404, headers: cors });
    } catch (err) {
      console.error(err);
      return responderJson({ error: 'error' }, cors, 'no-store', 500);
    }
  },
};

async function estadisticas(env) {
  const dia = hoyMadrid();
  const [paises, resumen, hoy, desde] = await env.DB.batch([
    env.DB.prepare(
      'SELECT pais, total FROM visitas_pais ORDER BY total DESC LIMIT ?1',
    ).bind(MAX_PAISES),
    env.DB.prepare(
      'SELECT COALESCE(SUM(total), 0) AS total, COUNT(*) AS num FROM visitas_pais',
    ),
    env.DB.prepare('SELECT total FROM visitas_dia WHERE dia = ?1').bind(dia),
    env.DB.prepare('SELECT MIN(dia) AS desde FROM visitas_dia'),
  ]);

  const r = resumen.results[0] || {};
  return {
    total: r.total || 0,
    numPaises: r.num || 0,
    hoy: (hoy.results[0] && hoy.results[0].total) || 0,
    desde: (desde.results[0] && desde.results[0].desde) || null,
    paises: paises.results,
  };
}

// Cloudflare da 'XX' si no sabe el país y 'T1' para la red Tor.
function normalizarPais(codigo) {
  return /^[A-Z]{2}$/.test(codigo || '') && codigo !== 'T1' ? codigo : 'XX';
}

// Fecha de hoy en hora de Madrid, formato AAAA-MM-DD.
function hoyMadrid() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function cabecerasCors(origin) {
  const permitido = ORIGENES_LECTURA.some(
    (o) => origin === o || origin.startsWith(o + ':'),
  );
  return {
    'Access-Control-Allow-Origin': permitido ? origin : ORIGEN_WEB,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function responderJson(datos, cors, cache, status = 200) {
  return new Response(JSON.stringify(datos), {
    status,
    headers: {
      ...cors,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cache,
    },
  });
}
