/**
 * CONFIGURACIÓN GLOBAL DE VERSIONES
 * Cambia SOLO la constante APP_VERSION y se aplicará a todos los archivos
 * Formato sugerido: AÑOMESDIA + v + número (ej: 20260413v1)
 */
const APP_VERSION = "20260413v1";

/**
 * Genera una URL con el parámetro de versión para evitar caché
 * @param {string} path - Ruta del archivo (ej: 'css/styles.css')
 * @returns {string} URL con versión (ej: 'css/styles.css?nocache=20260413v1')
 */
function getVersionedUrl(path) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}nocache=${APP_VERSION}`;
}

/**
 * Carga un archivo CSS dinámicamente con versión
 * @param {string} href - Ruta del CSS
 * @param {string} id - ID opcional para el elemento link
 */
function loadCSS(href, id) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = getVersionedUrl(href);
  if (id) link.id = id;
  document.head.appendChild(link);
}

/**
 * Carga un archivo JavaScript dinámicamente con versión
 * @param {string} src - Ruta del JS
 * @param {string} id - ID opcional para el elemento script
 * @param {boolean} async - Si debe cargarse de forma asíncrona
 * @param {boolean} defer - Si debe diferir la ejecución
 */
function loadJS(src, id, async = false, defer = false) {
  const script = document.createElement("script");
  script.src = getVersionedUrl(src);
  if (id) script.id = id;
  if (async) script.async = true;
  if (defer) script.defer = true;
  document.head.appendChild(script);
}

/**
 * Carga múltiples CSS a la vez
 * @param {Array} paths - Array de objetos {href, id}
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
 * Carga múltiples JS a la vez (en orden)
 * @param {Array} paths - Array de objetos {src, id, async, defer}
 */
function loadMultipleJS(paths) {
  paths.forEach((item) => {
    if (typeof item === "string") {
      loadJS(item);
    } else {
      loadJS(item.src, item.id, item.async, item.defer);
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
