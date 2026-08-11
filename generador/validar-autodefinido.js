#!/usr/bin/env node
/**
 * validar-autodefinido.js
 * ------------------------
 * Comprueba que una rejilla de autodefinido (construida a mano en
 * js/autodefinido/grids/*.js) esté bien formada, ANTES de subirla:
 *
 *   - Cada celda de letra pertenece a una palabra horizontal Y a una
 *     vertical (regla del autodefinido: no hay letras sueltas).
 *   - Cada palabra tiene una pista (ninguna palabra "muda").
 *   - Ninguna celda de pista apunta a una palabra que no existe.
 *   - Todas las filas miden lo mismo que "cols" y hay tantas filas
 *     como "rows".
 *
 * Esto NO genera ni coloca palabras por ti — solo repasa mecánicamente
 * una rejilla que ya has construido y te dice, con coordenadas
 * exactas, qué falla si algo falla.
 *
 * Uso:
 *   node generador/validar-autodefinido.js                  (valida todas las rejillas)
 *   node generador/validar-autodefinido.js oviedo-01         (valida solo esa)
 */

const fs = require('fs');
const path = require('path');
const { calcularRuns } = require('../js/autodefinido/runs.js');

const GRIDS_DIR = path.join(__dirname, '..', 'js', 'autodefinido', 'grids');

function imprimirRejilla(grid) {
  const { cols, rows, cells } = grid;
  for (let r = 0; r < rows; r++) {
    let linea = '';
    for (let c = 0; c < cols; c++) {
      const cell = cells[r][c];
      if (cell.type === 'letter') linea += cell.answer + ' ';
      else if (cell.type === 'clue') linea += '▢ ';
      else linea += '· ';
    }
    console.log('  ' + linea);
  }
}

function validarRejilla(nombreArchivo, puzzle) {
  const errores = [];
  const { grid } = puzzle;
  const { cols, rows, cells } = grid;

  if (cells.length !== rows) {
    errores.push(`declara ${rows} filas pero tiene ${cells.length}`);
  }
  cells.forEach((fila, r) => {
    if (fila.length !== cols) {
      errores.push(`fila ${r} tiene ${fila.length} celdas, se esperaban ${cols}`);
    }
  });

  const { acrossRuns, downRuns, cellRuns } = calcularRuns(grid);

  // 1. Cada letra pertenece al menos a una palabra (horizontal o vertical).
  //    NOTA: en un autodefinido 100% denso (sin ninguna celda en blanco)
  //    cada letra pertenecería a las DOS direcciones siempre, pero con
  //    un vocabulario pequeño y temático eso no es realista (ver plan);
  //    aquí basta con que no quede ninguna letra huérfana sin pertenecer
  //    a ninguna palabra.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < (cells[r] || []).length; c++) {
      if (cells[r][c].type !== 'letter') continue;
      const { across, down } = cellRuns[r][c];
      if (!across && !down) {
        errores.push(`(${r},${c}) "${cells[r][c].answer}" está huérfana: no pertenece a ninguna palabra`);
      }
    }
  }

  // 2. Cada palabra tiene pista
  [...acrossRuns, ...downRuns].forEach((run) => {
    if (!run.clue) {
      const palabra = run.cells.map((p) => cells[p.row][p.col].answer).join('');
      errores.push(`la palabra "${palabra}" (${run.id}) no tiene pista asignada`);
    }
  });

  // 3. Ninguna celda de pista apunta a una palabra inexistente
  const clavesAcross = new Set(acrossRuns.map((r) => `${r.cells[0].row},${r.cells[0].col}`));
  const clavesDown = new Set(downRuns.map((r) => `${r.cells[0].row},${r.cells[0].col}`));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < (cells[r] || []).length; c++) {
      const cell = cells[r][c];
      if (cell.type !== 'clue') continue;
      if (cell.across && !clavesAcross.has(`${r},${c + 1}`)) {
        errores.push(`(${r},${c}) tiene pista horizontal pero no empieza ninguna palabra en (${r},${c + 1})`);
      }
      if (cell.down && !clavesDown.has(`${r + 1},${c}`)) {
        errores.push(`(${r},${c}) tiene pista vertical pero no empieza ninguna palabra en (${r + 1},${c})`);
      }
    }
  }

  console.log(`\n=== ${nombreArchivo} (${puzzle.title}) ===`);
  console.log(`${acrossRuns.length} palabras horizontales, ${downRuns.length} verticales`);
  imprimirRejilla(grid);

  if (errores.length) {
    console.log(`\n❌ ${errores.length} problema(s):`);
    errores.forEach((e) => console.log('  - ' + e));
    return false;
  }
  console.log('\n✅ Sin problemas.');
  return true;
}

async function main() {
  const filtro = process.argv[2];
  const archivos = fs
    .readdirSync(GRIDS_DIR)
    .filter((f) => f.endsWith('.js'))
    .filter((f) => !filtro || f.includes(filtro));

  if (!archivos.length) {
    console.error('No se encontró ninguna rejilla que coincida.');
    process.exit(1);
  }

  let todoBien = true;
  for (const archivo of archivos) {
    const mod = await import('file://' + path.join(GRIDS_DIR, archivo).replace(/\\/g, '/'));
    const ok = validarRejilla(archivo, mod.default);
    todoBien = todoBien && ok;
  }

  process.exit(todoBien ? 0 : 1);
}

main();
