/* ===================================
   CONTADOR-VISITAS.JS
   Cuenta la visita (una por sesión de navegador) y pinta:
     - el widget de la portada  (#visitasSection / #contadorVisitas)
     - la línea del footer      (#footerVisitas)

   Lo carga js/main.js en TODAS las páginas, así cuentan también las
   visitas que entran directamente a una ficha, un partido, etc.

   Los datos viven en un Cloudflare Worker + D1
   (ver cloudflare/contador-visitas/LEEME.md). Sin IPs ni cookies.
   =================================== */

(function () {
  // ⬇️ PEGA AQUÍ la URL de tu Worker (sin "/" al final) cuando lo crees.
  const API_VISITAS = 'https://contador-visitas.taramunde1974.workers.dev';

  const CLAVE_SESION = 'sc_visita_contada';
  const PAISES_VISIBLES = 6;

  let datos = null;
  let datosDeHace = null; // timestamp si se muestran cifras guardadas
  let bloqueado = false; // el Worker no responde (fallo de red / timeout)

  const TEXTOS = {
    es: {
      total: 'Visitas totales',
      hoy: 'Hoy',
      paises: 'Países',
      top: 'Desde dónde nos visitan',
      otros: 'Otros países',
      desconocido: 'Desconocido',
      footer: 'visitas',
      desde: 'Contando desde el',
      cache: 'Datos de hace',
      min: 'min',
      h: 'h',
      d: 'días',
      bloqueo:
        'El contador no está disponible ahora mismo, seguramente por los bloqueos de LaLiga a Cloudflare durante los partidos. Si quieres verlo, usa una VPN.',
      bloqueoCache:
        'No se puede actualizar ahora mismo, seguramente por los bloqueos de LaLiga a Cloudflare durante los partidos. Para ver las cifras al día, usa una VPN.',
    },
    en: {
      total: 'Total visits',
      hoy: 'Today',
      paises: 'Countries',
      top: 'Where our visitors come from',
      otros: 'Other countries',
      desconocido: 'Unknown',
      footer: 'visits',
      desde: 'Counting since',
      cache: 'Data from',
      min: 'min ago',
      h: 'h ago',
      d: 'days ago',
      bloqueo:
        'The counter is unavailable right now, most likely because of LaLiga’s blocking of Cloudflare in Spain during matches. Use a VPN if you want to see it.',
      bloqueoCache:
        'Can’t update right now, most likely because of LaLiga’s blocking of Cloudflare in Spain during matches. Use a VPN to see the latest figures.',
    },
  };

  function idioma() {
    const l = window.currentLang || localStorage.getItem('lang') || 'es';
    return TEXTOS[l] ? l : 'es';
  }

  function tx(clave) {
    return TEXTOS[idioma()][clave];
  }

  function numero(n) {
    return Number(n || 0).toLocaleString(idioma() === 'en' ? 'en-GB' : 'es-ES');
  }

  function nombrePais(codigo) {
    if (codigo === 'XX') return tx('desconocido');
    try {
      const dn = new Intl.DisplayNames([idioma()], { type: 'region' });
      return dn.of(codigo) || codigo;
    } catch (e) {
      return codigo;
    }
  }

  function bandera(codigo) {
    if (codigo === 'XX') {
      return '<span class="visitas-bandera visitas-bandera-globo"><i class="fas fa-globe"></i></span>';
    }
    const c = codigo.toLowerCase();
    return `<img class="visitas-bandera" src="https://flagcdn.com/w40/${c}.png" srcset="https://flagcdn.com/w80/${c}.png 2x" alt="" width="28" height="21" loading="lazy" />`;
  }

  function fechaLarga(iso) {
    if (!iso) return '';
    const [a, m, d] = iso.split('-').map(Number);
    return new Date(a, m - 1, d).toLocaleDateString(
      idioma() === 'en' ? 'en-GB' : 'es-ES',
      { day: 'numeric', month: 'long', year: 'numeric' },
    );
  }

  // ---------- Pintado ----------

  function renderWidget() {
    const seccion = document.getElementById('visitasSection');
    const cont = document.getElementById('contadorVisitas');
    if (!seccion || !cont) return;

    if (!datos) {
      if (!bloqueado) return;
      cont.innerHTML = notaBloqueo(tx('bloqueo'));
      cont.classList.add('visitas-widget-bloqueado');
      seccion.hidden = false;
      return;
    }
    cont.classList.remove('visitas-widget-bloqueado');

    const total = datos.total || 0;
    const lista = (datos.paises || []).slice(0, PAISES_VISIBLES);
    const sumaVisibles = lista.reduce((s, p) => s + p.total, 0);
    const otros = total - sumaVisibles;
    const max = lista.length ? lista[0].total : 1;

    const filas = lista
      .map((p) => fila(bandera(p.pais), nombrePais(p.pais), p.total, total, max))
      .join('');
    const filaOtros =
      otros > 0
        ? fila(
            '<span class="visitas-bandera visitas-bandera-globo"><i class="fas fa-earth-europe"></i></span>',
            tx('otros'),
            otros,
            total,
            max,
          )
        : '';

    cont.innerHTML = `
      <div class="visitas-cifras">
        <div class="visitas-cifra visitas-cifra-principal">
          <span class="visitas-num">${numero(total)}</span>
          <span class="visitas-label">${tx('total')}</span>
        </div>
        <div class="visitas-cifra">
          <span class="visitas-num">${numero(datos.hoy)}</span>
          <span class="visitas-label">${tx('hoy')}</span>
        </div>
        <div class="visitas-cifra">
          <span class="visitas-num">${numero(datos.numPaises)}</span>
          <span class="visitas-label">${tx('paises')}</span>
        </div>
      </div>
      ${
        filas
          ? `<h3 class="visitas-subtitulo">${tx('top')}</h3>
             <ul class="visitas-paises">${filas}${filaOtros}</ul>`
          : ''
      }
      ${pie()}
      ${bloqueado ? notaBloqueo(tx('bloqueoCache')) : ''}`;

    seccion.hidden = false;
  }

  function haceCuanto(ts) {
    const min = Math.max(1, Math.round((Date.now() - ts) / 60000));
    if (min < 60) return `${min} ${tx('min')}`;
    const h = Math.round(min / 60);
    if (h < 48) return `${h} ${tx('h')}`;
    return `${Math.round(h / 24)} ${tx('d')}`;
  }

  function notaBloqueo(texto) {
    return `<p class="visitas-nota-bloqueo"><i class="fas fa-circle-info"></i> ${texto}</p>`;
  }

  function pie() {
    const partes = [];
    if (datosDeHace) {
      partes.push(`<i class="fas fa-clock-rotate-left"></i> ${tx('cache')} ${haceCuanto(datosDeHace)}`);
    }
    if (datos.desde) partes.push(`${tx('desde')} ${fechaLarga(datos.desde)}`);
    return partes.length ? `<p class="visitas-desde">${partes.join(' · ')}</p>` : '';
  }

  function fila(icono, nombre, n, total, max) {
    const pct = total ? Math.round((n / total) * 1000) / 10 : 0;
    const ancho = Math.max(2, Math.round((n / max) * 100));
    return `
      <li class="visitas-pais">
        ${icono}
        <span class="visitas-pais-nombre">${nombre}</span>
        <span class="visitas-barra"><span style="width:${ancho}%"></span></span>
        <span class="visitas-pais-num">${numero(n)}</span>
        <span class="visitas-pais-pct">${pct.toLocaleString(idioma() === 'en' ? 'en-GB' : 'es-ES')}%</span>
      </li>`;
  }

  function renderFooter() {
    const el = document.getElementById('footerVisitas');
    if (!el || !datos) return;
    el.innerHTML = `<i class="fas fa-eye"></i> ${numero(datos.total)} ${tx('footer')}`;
    el.hidden = false;
  }

  function render() {
    renderWidget();
    renderFooter();
  }

  // main.js (al inyectar el footer) e i18n.js (al cambiar de idioma)
  // llaman a esto para repintar.
  window.renderContadorVisitas = render;

  // ---------- Conteo ----------
  //
  // Los días de partido, los operadores españoles bloquean muchas IPs de
  // Cloudflare por orden de LaLiga y el Worker no responde. Para no
  // perder esas visitas:
  //   - cada visita nueva se apunta primero como "pendiente" (con su día)
  //     en localStorage, y se borra cuando el Worker confirma que la contó;
  //   - si no se pudo enviar, se reintenta en la siguiente visita;
  //   - mientras tanto se enseñan las últimas cifras que vio ese
  //     navegador, con una nota de "Datos de hace X".

  const CLAVE_PENDIENTES = 'sc_visitas_pendientes';
  const CLAVE_CACHE = 'sc_visitas_cache';
  const MAX_PENDIENTES = 20;
  const TIMEOUT_MS = 8000;
  const HOST_WEB = 'taramunde.github.io'; // solo cuenta la web publicada

  function leerJSON(clave, defecto) {
    try {
      const v = JSON.parse(localStorage.getItem(clave));
      return v == null ? defecto : v;
    } catch (e) {
      return defecto;
    }
  }

  function guardarJSON(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (e) {
      /* almacenamiento lleno o bloqueado: no pasa nada */
    }
  }

  function yaContada() {
    try {
      return sessionStorage.getItem(CLAVE_SESION) === '1';
    } catch (e) {
      return false;
    }
  }

  function marcarContada() {
    try {
      sessionStorage.setItem(CLAVE_SESION, '1');
    } catch (e) {
      /* modo privado estricto: no pasa nada */
    }
  }

  // Fecha de hoy en hora de Madrid (AAAA-MM-DD), igual que el Worker.
  function hoyMadrid() {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Madrid',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());
    } catch (e) {
      return new Date().toISOString().slice(0, 10);
    }
  }

  function pedir(ruta, opciones) {
    const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    const t = ctrl ? setTimeout(() => ctrl.abort(), TIMEOUT_MS) : null;
    return fetch(API_VISITAS + ruta, { ...opciones, signal: ctrl && ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .finally(() => t && clearTimeout(t));
  }

  // Envía las visitas pendientes una a una (la más antigua primero).
  // Si una falla, para y deja el resto para la próxima vez.
  async function enviarPendientes() {
    let ultimo = null;
    let pendientes = leerJSON(CLAVE_PENDIENTES, []);
    while (pendientes.length) {
      const dia = pendientes[0];
      ultimo = await pedir('/hit?dia=' + encodeURIComponent(dia), {
        method: 'POST',
        keepalive: true,
      });
      pendientes = leerJSON(CLAVE_PENDIENTES, []);
      const i = pendientes.indexOf(dia);
      if (i !== -1) pendientes.splice(i, 1);
      guardarJSON(CLAVE_PENDIENTES, pendientes);
    }
    return ultimo;
  }

  function mostrar(d, desdeCache) {
    datos = d;
    datosDeHace = desdeCache || null;
    render();
  }

  async function iniciar() {
    if (!API_VISITAS || API_VISITAS.includes('CAMBIAR')) return; // sin configurar

    // Una visita por sesión, solo en la web publicada y nunca de
    // navegadores automatizados. Se apunta ANTES de enviarla, así que
    // si hay bloqueo queda guardada para la próxima vez.
    if (!yaContada() && !navigator.webdriver && location.hostname === HOST_WEB) {
      const pendientes = leerJSON(CLAVE_PENDIENTES, []);
      pendientes.push(hoyMadrid());
      guardarJSON(CLAVE_PENDIENTES, pendientes.slice(-MAX_PENDIENTES));
      marcarContada();
    }

    try {
      const d = (await enviarPendientes()) || (await pedir('/stats'));
      guardarJSON(CLAVE_CACHE, { datos: d, ts: Date.now() });
      mostrar(d);
    } catch (e) {
      // Sin respuesta (fallo de red o timeout) = casi seguro un bloqueo de
      // LaLiga: se avisa. Si el Worker respondió con un error HTTP (e es
      // un número), no es un bloqueo y no se culpa a nadie.
      bloqueado = typeof e !== 'number';
      const cache = leerJSON(CLAVE_CACHE, null);
      if (cache && cache.datos) mostrar(cache.datos, cache.ts);
      else render();
    }
  }

  iniciar();
})();
