#!/usr/bin/env node
/**
 * actualizar-nocache.js
 * ---------------------
 * Recorre todas las páginas HTML "fijas" del proyecto (index.html,
 * clasificacion.html, etc.) y actualiza de golpe todas las referencias
 * de tipo ?nocache=20260601v13 (fecha + versión) en <script src="..."> y
 * <link href="..."> apuntando a .js o .css. La versión sube sola cada
 * vez que ejecutas el script el mismo día, y la fecha se pone al día
 * automáticamente.
 *
 * Uso:
 *   node actualizar-nocache.js
 *
 * Tras ejecutarlo, revisa los cambios con `git diff`, haz commit y push
 * como siempre (GitHub Pages sirve lo que esté en el repo).
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// CONFIGURACIÓN — ajusta esto a tu estructura real
// ---------------------------------------------------------------------------

// Carpeta raíz del proyecto (donde está este script)
const DIR_RAIZ = __dirname;

// Carpetas que NO se deben tocar (por ejemplo, las fichas generadas por generar.js,
// que ya se regeneran solas y no usan este sistema de nocache manual)
const EXCLUIR_CARPETAS = ['fichas', 'node_modules', '.git'];

// Patrón que detecta el nocache actual.
// Formato real del proyecto: ?nocache=20260601v13  (fecha AAAAMMDD + "v" + versión)
const PATRON_NOCACHE = /(\.(?:js|css)\?nocache=)(\d{8})v(\d+)/g;

// Fecha de hoy en formato AAAAMMDD
function fechaHoy() {
  const hoy = new Date();
  const aaaa = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  return `${aaaa}${mm}${dd}`;
}

const FECHA_ACTUAL = fechaHoy();

// El nuevo valor se calcula más abajo, en main(), porque depende de la versión
// más alta ya existente en el proyecto para el día de hoy (para no repetirla
// si el script ya se ha ejecutado antes hoy mismo).

// ---------------------------------------------------------------------------
// LÓGICA — normalmente no hace falta tocar nada de aquí abajo
// ---------------------------------------------------------------------------

function buscarArchivosHtml(dir) {
  let resultados = [];
  for (const nombre of fs.readdirSync(dir)) {
    const rutaCompleta = path.join(dir, nombre);
    const info = fs.statSync(rutaCompleta);

    if (info.isDirectory()) {
      if (!EXCLUIR_CARPETAS.includes(nombre)) {
        resultados = resultados.concat(buscarArchivosHtml(rutaCompleta));
      }
    } else if (nombre.toLowerCase().endsWith('.html')) {
      resultados.push(rutaCompleta);
    }
  }
  return resultados;
}

// Recorre todos los archivos para averiguar la versión más alta ya usada
// HOY (así, si ejecutas el script varias veces en el mismo día, la versión
// sigue subiendo: v13, v14, v15... en vez de repetirse)
function calcularSiguienteVersion(archivos) {
  let maxVersionHoy = 0;

  for (const archivo of archivos) {
    const contenido = fs.readFileSync(archivo, 'utf8');
    const regexLectura = /\.(?:js|css)\?nocache=(\d{8})v(\d+)/g;
    let coincidencia;
    while ((coincidencia = regexLectura.exec(contenido)) !== null) {
      const [, fecha, version] = coincidencia;
      if (fecha === FECHA_ACTUAL) {
        maxVersionHoy = Math.max(maxVersionHoy, parseInt(version, 10));
      }
    }
  }

  return maxVersionHoy + 1;
}

function actualizarArchivo(rutaCompleta, nuevoValor) {
  const contenidoOriginal = fs.readFileSync(rutaCompleta, 'utf8');
  let cambios = 0;

  const contenidoActualizado = contenidoOriginal.replace(
    PATRON_NOCACHE,
    (coincidenciaCompleta, prefijo) => {
      cambios++;
      return `${prefijo}${nuevoValor}`;
    }
  );

  if (cambios > 0) {
    fs.writeFileSync(rutaCompleta, contenidoActualizado, 'utf8');
  }

  return cambios;
}

function main() {
  const archivos = buscarArchivosHtml(DIR_RAIZ);

  console.log(`Buscando referencias de nocache en ${archivos.length} archivo(s) HTML...\n`);

  const siguienteVersion = calcularSiguienteVersion(archivos);
  const nuevoValor = `${FECHA_ACTUAL}v${siguienteVersion}`;

  let totalCambios = 0;
  let archivosModificados = 0;

  for (const archivo of archivos) {
    const cambios = actualizarArchivo(archivo, nuevoValor);
    const nombreRelativo = path.relative(DIR_RAIZ, archivo);

    if (cambios > 0) {
      console.log(`✅ ${nombreRelativo}: ${cambios} referencia(s) actualizada(s)`);
      totalCambios += cambios;
      archivosModificados++;
    }
  }

  console.log(`\nHecho. ${totalCambios} referencia(s) en ${archivosModificados} archivo(s) actualizadas a ?nocache=${nuevoValor}`);

  if (totalCambios === 0) {
    console.log('\n⚠️  No se encontró ninguna coincidencia. Revisa que el formato en tus archivos sea');
    console.log('   exactamente ?nocache=AAAAMMDDvN (por ejemplo ?nocache=20260601v13).');
  } else {
    console.log('\nSiguiente paso: revisa los cambios con "git diff", haz commit y push.');
  }
}

main();