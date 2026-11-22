/* ===================================
   PRIVADO.JS
   Zona privada ("En construcción") protegida con un PIN de 8 dígitos.

   El PIN NO está en ninguna parte del código. El contenido de la zona
   va CIFRADO en js/data-privado.js (AES-256-GCM, con una clave que se
   saca del PIN con PBKDF2-SHA256 y muchas iteraciones). Sin el PIN
   correcto, ese archivo es solo texto ilegible.

   Para cambiar el contenido o el PIN:
     node generador/cifrar-privado.js
   (ver instrucciones en ese archivo).
   =================================== */

/* global SC_PRIVADO */

(function () {
  const CLAVE_SESION = 'sc_privado_clave';
  const TEXTOS = {
    es: {
      incorrecto: 'PIN incorrecto.',
      formato: 'El PIN tiene 8 dígitos.',
      espera: 'Demasiados intentos. Espera',
      segundos: 's',
      comprobando: 'Comprobando…',
      sinContenido: 'Esta zona todavía no está configurada.',
      cerrar: 'Cerrar zona privada',
    },
    en: {
      incorrecto: 'Wrong PIN.',
      formato: 'The PIN has 8 digits.',
      espera: 'Too many attempts. Wait',
      segundos: 's',
      comprobando: 'Checking…',
      sinContenido: 'This area is not set up yet.',
      cerrar: 'Close private area',
    },
  };

  const tx = (k) => {
    const l = window.currentLang || localStorage.getItem('lang') || 'es';
    return (TEXTOS[l] || TEXTOS.es)[k];
  };

  const $ = (id) => document.getElementById(id);
  let fallos = 0;
  let bloqueadoHasta = 0;

  // ---------- Base64 <-> bytes ----------
  const deB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const aB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));

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
      true, // exportable, para recordarla durante la sesión
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

  // ---------- Interfaz ----------
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
    $('privadoCerrar').addEventListener('click', cerrar);
  }

  function cerrar() {
    try {
      sessionStorage.removeItem(CLAVE_SESION);
    } catch (e) {
      /* nada */
    }
    $('privadoContenido').innerHTML = '';
    $('privadoContenido').hidden = true;
    $('privadoAcceso').hidden = false;
    $('privadoPin').value = '';
    mensaje('');
    $('privadoPin').focus();
  }

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
      try {
        sessionStorage.setItem(CLAVE_SESION, aB64(await crypto.subtle.exportKey('raw', clave)));
      } catch (err) {
        /* sin sesión: habrá que poner el PIN otra vez */
      }
      fallos = 0;
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

  // Si ya se abrió en esta sesión (pestaña), se abre sola.
  async function abrirConSesion() {
    const datos = window.SC_PRIVADO;
    let guardada = null;
    try {
      guardada = sessionStorage.getItem(CLAVE_SESION);
    } catch (e) {
      /* nada */
    }
    if (!datos || !guardada) return;
    try {
      const clave = await crypto.subtle.importKey('raw', deB64(guardada), 'AES-GCM', false, [
        'decrypt',
      ]);
      mostrarContenido(await descifrar(clave, datos));
    } catch (e) {
      sessionStorage.removeItem(CLAVE_SESION); // el contenido o el PIN cambiaron
    }
  }

  function iniciar() {
    const form = $('privadoForm');
    if (!form) return;
    form.addEventListener('submit', intentar);
    // Solo números en el campo del PIN.
    $('privadoPin').addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
    });
    abrirConSesion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
