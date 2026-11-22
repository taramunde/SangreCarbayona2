/* ===================================
   PRIVADO.JS
   Zona privada ("En construcción") protegida con un PIN de 8 dígitos.

   El PIN NO está en ninguna parte del código. El contenido de la zona
   va CIFRADO en js/data-privado.js (AES-256-GCM, con una clave que se
   saca del PIN con PBKDF2-SHA256 y muchas iteraciones). Sin el PIN
   correcto, ese archivo es solo texto ilegible.

   La zona NO se queda abierta: en cuanto sales de la página (por un
   enlace, el botón "atrás", recargando…) se cierra y hay que volver a
   poner el PIN. Si está abierta y pulsas un enlace de la web, antes se
   pide confirmación.

   Para cambiar el contenido o el PIN: npm run subir / npm run privado
   (ver generador/cifrar-privado.js).
   =================================== */

(function () {
  const TEXTOS = {
    es: {
      incorrecto: 'PIN incorrecto.',
      formato: 'El PIN tiene 8 dígitos.',
      espera: 'Demasiados intentos. Espera',
      segundos: 's',
      comprobando: 'Comprobando…',
      sinContenido: 'Esta zona todavía no está configurada.',
      cerrar: 'Cerrar zona privada',
      salirTitulo: 'Vas a salir de la zona privada',
      salirTexto: 'Se cerrará y, para volver a entrar, tendrás que introducir el PIN de nuevo.',
      salir: 'Salir',
      quedarme: 'Quedarme',
    },
    en: {
      incorrecto: 'Wrong PIN.',
      formato: 'The PIN has 8 digits.',
      espera: 'Too many attempts. Wait',
      segundos: 's',
      comprobando: 'Checking…',
      sinContenido: 'This area is not set up yet.',
      cerrar: 'Close private area',
      salirTitulo: "You're about to leave the private area",
      salirTexto: 'It will be locked and you will need to enter the PIN again to come back.',
      salir: 'Leave',
      quedarme: 'Stay',
    },
  };

  const tx = (k) => {
    const l = window.currentLang || localStorage.getItem('lang') || 'es';
    return (TEXTOS[l] || TEXTOS.es)[k];
  };

  const $ = (id) => document.getElementById(id);
  let abierta = false;
  let fallos = 0;
  let bloqueadoHasta = 0;

  // Versiones anteriores guardaban la clave en la sesión: se borra.
  try {
    sessionStorage.removeItem('sc_privado_clave');
  } catch (e) {
    /* nada */
  }

  // ---------- Base64 -> bytes ----------
  const deB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  // ---------- Cifrado ----------
  async function claveDesdePin(pin, datos) {
    const base = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(pin),
      'PBKDF2',
      false,
      ['deriveKey'],
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', hash: 'SHA-256', salt: deB64(datos.salt), iterations: datos.iter },
      base,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    );
  }

  async function descifrar(clave, datos) {
    const plano = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: deB64(datos.iv) },
      clave,
      deB64(datos.datos),
    );
    return new TextDecoder().decode(plano);
  }

  // ---------- Abrir / cerrar ----------
  function mensaje(texto, tipo) {
    const el = $('privadoMensaje');
    el.textContent = texto || '';
    el.className = 'privado-mensaje' + (tipo ? ' privado-mensaje-' + tipo : '');
  }

  function mostrarContenido(html) {
    const cont = $('privadoContenido');
    cont.innerHTML =
      html +
      `<div class="privado-cerrar-wrap">
         <button type="button" class="privado-cerrar" id="privadoCerrar">
           <i class="fas fa-lock"></i> <span>${tx('cerrar')}</span>
         </button>
       </div>`;
    cont.hidden = false;
    $('privadoAcceso').hidden = true;
    $('privadoCerrar').addEventListener('click', () => cerrar(true));
    abierta = true;
  }

  function cerrar(enfocar) {
    abierta = false;
    cerrarAviso();
    const cont = $('privadoContenido');
    if (!cont) return;
    cont.innerHTML = '';
    cont.hidden = true;
    $('privadoAcceso').hidden = false;
    $('privadoPin').value = '';
    mensaje('');
    if (enfocar) $('privadoPin').focus();
  }

  // ---------- Aviso "vas a salir" ----------
  let destinoPendiente = null;

  function crearAviso() {
    if ($('privadoAviso')) return;
    const aviso = document.createElement('div');
    aviso.id = 'privadoAviso';
    aviso.className = 'privado-aviso';
    aviso.hidden = true;
    aviso.innerHTML = `
      <div class="privado-aviso-caja" role="alertdialog" aria-modal="true"
           aria-labelledby="privadoAvisoTitulo" aria-describedby="privadoAvisoTexto">
        <div class="privado-aviso-icono"><i class="fas fa-lock"></i></div>
        <h3 id="privadoAvisoTitulo"></h3>
        <p id="privadoAvisoTexto"></p>
        <div class="privado-aviso-botones">
          <button type="button" class="privado-aviso-quedarme" id="privadoAvisoQuedarme"></button>
          <button type="button" class="privado-aviso-salir" id="privadoAvisoSalir"></button>
        </div>
      </div>`;
    document.body.appendChild(aviso);
    $('privadoAvisoQuedarme').addEventListener('click', cerrarAviso);
    $('privadoAvisoSalir').addEventListener('click', () => {
      const destino = destinoPendiente;
      cerrar(false);
      if (destino) window.location.href = destino;
    });
    aviso.addEventListener('click', (e) => {
      if (e.target === aviso) cerrarAviso(); // clic fuera de la caja = quedarse
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !aviso.hidden) cerrarAviso();
    });
  }

  function abrirAviso(destino) {
    crearAviso();
    destinoPendiente = destino;
    $('privadoAvisoTitulo').textContent = tx('salirTitulo');
    $('privadoAvisoTexto').textContent = tx('salirTexto');
    $('privadoAvisoQuedarme').textContent = tx('quedarme');
    $('privadoAvisoSalir').textContent = tx('salir');
    $('privadoAviso').hidden = false;
    $('privadoAvisoQuedarme').focus();
  }

  function cerrarAviso() {
    const aviso = $('privadoAviso');
    if (aviso) aviso.hidden = true;
    destinoPendiente = null;
  }

  // Cualquier enlace que lleve a otra página (cabecera, menú, footer,
  // logo…) pasa por el aviso mientras la zona está abierta. Se escucha
  // en "captura" para ir antes que los demás scripts de la web.
  function vigilarEnlaces(e) {
    if (!abierta) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
    if (a.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return; // otra pestaña: no sales
    const destino = new URL(href, location.href);
    if (destino.pathname === location.pathname && destino.search === location.search) return;
    e.preventDefault();
    e.stopPropagation();
    abrirAviso(destino.href);
  }

  // ---------- PIN ----------
  async function intentar(e) {
    e.preventDefault();
    const datos = window.SC_PRIVADO;
    const input = $('privadoPin');
    const boton = $('privadoBoton');
    const pin = input.value.trim();

    const resta = Math.ceil((bloqueadoHasta - Date.now()) / 1000);
    if (resta > 0) return mensaje(`${tx('espera')} ${resta} ${tx('segundos')}.`, 'error');
    if (!/^\d{8}$/.test(pin)) return mensaje(tx('formato'), 'error');
    if (!datos) return mensaje(tx('sinContenido'), 'error');

    boton.disabled = true;
    mensaje(tx('comprobando'));
    try {
      const clave = await claveDesdePin(pin, datos);
      const html = await descifrar(clave, datos); // falla si el PIN no es el bueno
      fallos = 0;
      input.value = '';
      mensaje('');
      mostrarContenido(html);
    } catch (err) {
      fallos++;
      // A partir del 3er fallo, espera creciente: 2, 4, 8… hasta 60 s.
      if (fallos >= 3) {
        const s = Math.min(60, 2 ** (fallos - 2));
        bloqueadoHasta = Date.now() + s * 1000;
        mensaje(`${tx('incorrecto')} ${tx('espera')} ${s} ${tx('segundos')}.`, 'error');
      } else {
        mensaje(tx('incorrecto'), 'error');
      }
      input.select();
      input.classList.remove('privado-pin-error');
      void input.offsetWidth; // reinicia la animación
      input.classList.add('privado-pin-error');
    } finally {
      boton.disabled = false;
    }
  }

  function iniciar() {
    const form = $('privadoForm');
    if (!form) return;
    form.addEventListener('submit', intentar);
    $('privadoPin').addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
    });
    document.addEventListener('click', vigilarEnlaces, true);

    // Al salir de la página se borra el contenido, para que el navegador
    // no guarde una "foto" con la zona abierta (botón atrás)…
    window.addEventListener('pagehide', () => cerrar(false));
    // …y si aun así vuelve de esa caché, se cierra.
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) cerrar(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
