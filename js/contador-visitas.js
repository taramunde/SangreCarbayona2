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
    if (!seccion || !cont || !datos) return;

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
      ${
        datos.desde
          ? `<p class="visitas-desde">${tx('desde')} ${fechaLarga(datos.desde)}</p>`
          : ''
      }`;

    seccion.hidden = false;
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

  function iniciar() {
    if (!API_VISITAS || API_VISITAS.includes('CAMBIAR')) return; // sin configurar

    // Navegadores automatizados (tests, scrapers) no cuentan.
    const contar = !yaContada() && !navigator.webdriver;

    const peticion = contar
      ? fetch(API_VISITAS + '/hit', { method: 'POST', keepalive: true })
      : fetch(API_VISITAS + '/stats');

    peticion
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        if (contar) marcarContada();
        datos = d;
        render();
      })
      .catch(() => {
        /* si el Worker falla, el widget simplemente no aparece */
      });
  }

  iniciar();
})();
