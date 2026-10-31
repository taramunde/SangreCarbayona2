#!/usr/bin/env node
/**
 * subir.js — lo que ejecuta `npm run subir`.
 *
 * 1. Descarga primero lo nuevo de GitHub (commits de la Action de
 *    nocache u otras subidas), apartando un momento tus cambios sin subir.
 * 2. Genera fichas, páginas de partidos y sitemap YA sobre esa versión
 *    al día, para que no choquen con las que hay en GitHub.
 * 3. Hace commit y sube.
 *
 * Si mientras tanto alguien subió algo y vuelve a haber choque SOLO en
 * archivos generados (fichas/, partidos/, sitemap), se resuelven solos
 * regenerándolos. Si el choque está en tus datos, se para y avisa.
 */

const { execSync } = require('child_process');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const MENSAJE = 'Actualización automática';
const GENERADOS = /^(fichas\/|partidos\/|sitemap\.xml$|generador\/\.sitemap-cache\.json$)/;

function run(cmd, opciones = {}) {
  return execSync(cmd, {
    cwd: RAIZ,
    stdio: opciones.silencio ? 'pipe' : 'inherit',
    env: { ...process.env, GIT_EDITOR: 'true' },
    encoding: 'utf8',
  });
}

function intentar(cmd) {
  try {
    run(cmd, { silencio: true });
    return true;
  } catch (e) {
    return false;
  }
}

function generar() {
  console.log('\n▶ Generando fichas, partidos y sitemap…');
  run('node generador/generar-partidos.js', { silencio: true });
  run('node generador/generar.js', { silencio: true });
  run('node generador/generar-sitemap.js', { silencio: true });
}

function archivosEnConflicto() {
  return run('git diff --name-only --diff-filter=U', { silencio: true })
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parar(mensaje) {
  console.error(`\n✖ ${mensaje}`);
  process.exit(1);
}

// Durante un rebase con choques solo en archivos generados: se
// regeneran a partir de los datos ya juntados y se continúa.
function resolverRebase() {
  for (let vuelta = 0; vuelta < 5; vuelta++) {
    const conflictos = archivosEnConflicto();
    if (!conflictos.length) return;
    const ajenos = conflictos.filter((f) => !GENERADOS.test(f));
    if (ajenos.length) {
      parar(
        'Hay un choque en archivos que no son generados y hay que mirarlo a mano:\n  ' +
          ajenos.join('\n  ') +
          '\n(El rebase se ha quedado a medias: pide ayuda antes de tocar nada.)',
      );
    }
    console.log(`\n▶ Resolviendo ${conflictos.length} choques en páginas generadas…`);
    // Las páginas se reescriben enteras al generar, así que basta con
    // regenerarlas; solo el caché del sitemap se lee antes de escribirse
    // y necesita una versión sin marcas de conflicto.
    ['sitemap.xml', 'generador/.sitemap-cache.json'].forEach((f) => {
      if (conflictos.includes(f)) run(`git checkout --theirs -- "${f}"`, { silencio: true });
    });
    generar();
    run('git add -A', { silencio: true });
    if (intentar('git rebase --continue')) return;
  }
  parar('No se ha podido terminar el rebase automáticamente.');
}

// 1. Ponerse al día con GitHub antes de generar nada.
console.log('▶ Descargando lo nuevo de GitHub…');
if (!intentar('git pull --rebase --autostash origin main')) {
  if (archivosEnConflicto().length) resolverRebase();
  else
    parar(
      'No se pudo descargar lo nuevo de GitHub (¿sin conexión, o tus cambios ' +
        'sin subir chocan con los de GitHub?). Pide ayuda antes de seguir.',
    );
}

// 2. Generar sobre la versión al día.
generar();

// 3. Commit (si hay algo) y subida, con reintento si GitHub cambió entretanto.
run('git add -A', { silencio: true });
if (intentar('git diff --cached --quiet')) {
  console.log('\n✔ No hay cambios que subir.');
  process.exit(0);
}
run(`git commit -q -m "${MENSAJE}"`);

for (let intento = 1; intento <= 3; intento++) {
  console.log('\n▶ Subiendo a GitHub…');
  if (intentar('git push origin main')) {
    console.log('\n✔ Subido correctamente.');
    process.exit(0);
  }
  console.log('  GitHub tiene cambios nuevos; juntándolos y reintentando…');
  if (!intentar('git pull --rebase origin main')) resolverRebase();
}
parar('No se ha podido subir tras varios intentos.');
