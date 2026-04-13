/**
 * CONFIGURACIÓN GLOBAL DE VERSIONES
 * Cambia SOLO la constante APP_VERSION y se aplicará a todos los archivos
 */
const APP_VERSION = "20260413v2";

/**
 * Genera una URL con el parámetro de versión para evitar caché
 */
function getVersionedUrl(path) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}nocache=${APP_VERSION}`;
}

/**
 * Carga CSS de forma síncrona (bloqueante)
 */
function loadCSS(href, id) {
  document.write(
    `<link rel="stylesheet" href="${getVersionedUrl(href)}"${id ? ` id="${id}"` : ""}>`,
  );
}

/**
 * Carga JS de forma síncrona (bloqueante) - IMPORTANTE para el orden
 */
function loadJS(src, id) {
  document.write(
    `<script src="${getVersionedUrl(src)}"${id ? ` id="${id}"` : ""}><\/script>`,
  );
}

/**
 * Carga múltiples CSS
 */
function loadMultipleCSS(paths) {
  paths.forEach((item) => {
    if (typeof item === "string") {
      loadCSS(item);
    } else {
      loadCSS(item.href, item.id);
    }
  });
}

/**
 * Carga múltiples JS en orden (síncrono)
 */
function loadMultipleJS(paths) {
  paths.forEach((item) => {
    if (typeof item === "string") {
      loadJS(item);
    } else {
      loadJS(item.src, item.id);
    }
  });
}

// Exponer funciones globalmente
window.getVersionedUrl = getVersionedUrl;
window.loadCSS = loadCSS;
window.loadJS = loadJS;
window.loadMultipleCSS = loadMultipleCSS;
window.loadMultipleJS = loadMultipleJS;
window.APP_VERSION = APP_VERSION;
