/* ===================================
   AUTODEFINIDO / RUNS.JS
   Deriva las palabras horizontales/verticales ("runs") de una rejilla
   de autodefinido, a partir únicamente de las celdas. No se guardan
   las palabras a mano en los datos: se calculan aquí, una sola vez,
   tanto desde el motor en el navegador (game.js) como desde el script
   de validación en Node (generador/validar-autodefinido.js) — así los
   dos usan exactamente la misma lógica y no se pueden desincronizar.

   Se escribe sin `import`/`export` de módulos ES a propósito, para que
   funcione igual cargado como <script> normal en el navegador que con
   require() en Node.
   =================================== */

(function (raiz) {
  /**
   * @param {{cols:number, rows:number, cells: Array<Array<Object>>}} grid
   * @returns {{
   *   acrossRuns: Array<{id:string, clue:string|null, cells:Array<{row:number,col:number}>}>,
   *   downRuns: Array<{id:string, clue:string|null, cells:Array<{row:number,col:number}>}>,
   *   cellRuns: Array<Array<{across:string|null, down:string|null}>>
   * }}
   */
  function calcularRuns(grid) {
    const { cols, rows, cells } = grid;
    const esLetra = (r, c) =>
      r >= 0 && r < rows && c >= 0 && c < cols && cells[r][c].type === 'letter';

    const acrossRuns = [];
    const downRuns = [];
    const cellRuns = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ across: null, down: null })),
    );

    // --- Horizontales ---
    for (let r = 0; r < rows; r++) {
      let c = 0;
      while (c < cols) {
        const esInicio = esLetra(r, c) && !esLetra(r, c - 1);
        if (!esInicio) {
          c++;
          continue;
        }
        const runCells = [];
        let cc = c;
        while (esLetra(r, cc)) {
          runCells.push({ row: r, col: cc });
          cc++;
        }
        if (runCells.length >= 2) {
          const celdaPista = c - 1 >= 0 ? cells[r][c - 1] : null;
          const clue =
            celdaPista && celdaPista.type === 'clue' ? celdaPista.across || null : null;
          const id = `A-${r}-${c}`;
          acrossRuns.push({ id, clue, cells: runCells });
          runCells.forEach(({ row, col }) => {
            cellRuns[row][col].across = id;
          });
        }
        c = cc;
      }
    }

    // --- Verticales ---
    for (let c = 0; c < cols; c++) {
      let r = 0;
      while (r < rows) {
        const esInicio = esLetra(r, c) && !esLetra(r - 1, c);
        if (!esInicio) {
          r++;
          continue;
        }
        const runCells = [];
        let rr = r;
        while (esLetra(rr, c)) {
          runCells.push({ row: rr, col: c });
          rr++;
        }
        if (runCells.length >= 2) {
          const celdaPista = r - 1 >= 0 ? cells[r - 1][c] : null;
          const clue =
            celdaPista && celdaPista.type === 'clue' ? celdaPista.down || null : null;
          const id = `D-${r}-${c}`;
          downRuns.push({ id, clue, cells: runCells });
          runCells.forEach(({ row, col }) => {
            cellRuns[row][col].down = id;
          });
        }
        r = rr;
      }
    }

    return { acrossRuns, downRuns, cellRuns };
  }

  const api = { calcularRuns };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    raiz.AutodefinidoRuns = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
