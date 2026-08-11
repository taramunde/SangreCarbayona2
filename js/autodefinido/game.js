/* ===================================
   AUTODEFINIDO / GAME.JS
   Motor de interacción del crucigrama autodefinido: pintar la rejilla,
   selección de casillas, captura de teclado (físico y táctil),
   navegación, comprobación de respuestas, pistas y victoria.

   Depende de:
     - js/autodefinido/runs.js  (cargado como <script> normal, expone
       window.AutodefinidoRuns.calcularRuns)
     - js/autodefinido/config.js (módulo ES, exporta PUZZLES)
     - js/puzzle/confetti.js     (módulo ES, se reutiliza tal cual)
   =================================== */

import { PUZZLES } from './config.js';
import { launchConfetti } from '../puzzle/confetti.js';

const $ = (s) => document.querySelector(s);

const boardWrap = $('#cgBoardWrap');
const board = $('#cgBoard');
const hiddenInput = $('#cgHiddenInput');
const clueBar = $('#cgClueBar');
const puzzleSelect = $('#cgPuzzleSelect');
const timeEl = $('#cgTime');
const progressEl = $('#cgProgress');
const hintsEl = $('#cgHints');
const winModal = $('#cgWinModal');
const winStats = $('#cgWinStats');
const confettiCanvas = $('#cgConfetti');

let state = {
  puzzleIdx: 0,
  grid: null,
  runs: null,
  values: [],
  selected: null, // {row, col}
  direction: 'across',
  hintsUsed: 0,
  won: false,
};

let timer = null;
let seconds = 0;

function formatTime(s) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function startTimer() {
  clearInterval(timer);
  seconds = 0;
  timeEl.textContent = formatTime(0);
  timer = setInterval(() => {
    seconds++;
    timeEl.textContent = formatTime(seconds);
  }, 1000);
}

function normalizarLetra(char) {
  const c = char.toUpperCase();
  if (c === 'Ñ') return 'Ñ';
  // Quita tildes (á->A, é->E...) pero preserva la Ñ (ya tratada arriba)
  return c.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/* ===================================
   CARGA DE PUZZLE
   =================================== */

function loadPuzzle(idx) {
  const puzzle = PUZZLES[idx];
  state.puzzleIdx = idx;
  state.grid = puzzle.grid;
  state.runs = window.AutodefinidoRuns.calcularRuns(puzzle.grid);
  state.values = Array.from({ length: puzzle.grid.rows }, () =>
    Array.from({ length: puzzle.grid.cols }, () => ''),
  );
  state.hintsUsed = 0;
  state.won = false;
  hintsEl.textContent = '0';

  // Seleccionar la primera casilla de la primera palabra horizontal (o
  // vertical si no hay ninguna horizontal)
  const primerRun = state.runs.acrossRuns[0] || state.runs.downRuns[0];
  state.direction = state.runs.acrossRuns[0] ? 'across' : 'down';
  state.selected = primerRun ? primerRun.cells[0] : null;

  $('#cgTitle').textContent = puzzle.title;
  startTimer();
  render();
}

/* ===================================
   RENDER
   =================================== */

function claseCelda(row, col) {
  const clases = ['cg-cell'];
  const cell = state.grid.cells[row][col];
  clases.push(`cg-cell--${cell.type}`);
  if (state.selected && state.selected.row === row && state.selected.col === col) {
    clases.push('cg-cell--selected');
  } else if (enPalabraActiva(row, col)) {
    clases.push('cg-cell--activa');
  }
  const val = state.values[row][col];
  if (val) {
    if (val === cell.answer) clases.push('cg-cell--correcta');
    else clases.push('cg-cell--incorrecta');
  }
  if (cell.hinted) clases.push('cg-cell--pista');
  return clases.join(' ');
}

function runActual() {
  if (!state.selected) return null;
  const { row, col } = state.selected;
  const idRun = state.runs.cellRuns[row][col][state.direction];
  if (!idRun) return null;
  const lista = state.direction === 'across' ? state.runs.acrossRuns : state.runs.downRuns;
  return lista.find((r) => r.id === idRun) || null;
}

function enPalabraActiva(row, col) {
  const run = runActual();
  if (!run) return false;
  return run.cells.some((c) => c.row === row && c.col === col);
}

function render() {
  const { cols, rows, cells } = state.grid;
  board.style.setProperty('--cg-cols', cols);
  board.style.setProperty('--cg-rows', rows);
  board.innerHTML = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = cells[r][c];
      const div = document.createElement('div');
      div.className = claseCelda(r, c);

      if (cell.type === 'letter') {
        div.textContent = state.values[r][c];
        div.addEventListener('click', () => onCeldaClick(r, c));
      } else if (cell.type === 'clue') {
        if (cell.across) {
          const spanA = document.createElement('span');
          spanA.className = 'cg-clue cg-clue--across';
          spanA.textContent = cell.across;
          div.appendChild(spanA);
        }
        if (cell.down) {
          const spanD = document.createElement('span');
          spanD.className = 'cg-clue cg-clue--down';
          spanD.textContent = cell.down;
          div.appendChild(spanD);
        }
        if (cell.across && cell.down) div.classList.add('cg-cell--doble-pista');
        // Tooltip nativo: en PC no hay zoom táctil, así que al pasar el
        // ratón por encima se puede leer la pista completa igualmente.
        div.title = [cell.across, cell.down].filter(Boolean).join(' / ');
        div.addEventListener('click', () => onClueClick(r, c, cell));
      }

      board.appendChild(div);
    }
  }

  posicionarInputOculto();
  actualizarBarraPista();
  actualizarProgreso();
}

function posicionarInputOculto() {
  if (!state.selected) return;
  const { row, col } = state.selected;
  const celdas = board.children;
  const idx = row * state.grid.cols + col;
  const celdaEl = celdas[idx];
  if (!celdaEl) return;
  hiddenInput.style.left = celdaEl.offsetLeft + 'px';
  hiddenInput.style.top = celdaEl.offsetTop + 'px';
  hiddenInput.style.width = celdaEl.offsetWidth + 'px';
  hiddenInput.style.height = celdaEl.offsetHeight + 'px';
}

function actualizarBarraPista() {
  const run = runActual();
  clueBar.textContent = run && run.clue ? run.clue : 'Toca una casilla para empezar';
}

function actualizarProgreso() {
  let total = 0;
  let correctas = 0;
  for (let r = 0; r < state.grid.rows; r++) {
    for (let c = 0; c < state.grid.cols; c++) {
      if (state.grid.cells[r][c].type === 'letter') {
        total++;
        if (state.values[r][c] === state.grid.cells[r][c].answer) correctas++;
      }
    }
  }
  const pct = total ? Math.round((correctas / total) * 100) : 0;
  progressEl.textContent = `${pct}%`;

  if (total > 0 && correctas === total && !state.won) {
    state.won = true;
    onWin();
  }
}

/* ===================================
   SELECCIÓN Y NAVEGACIÓN
   =================================== */

function onCeldaClick(row, col) {
  const cellRuns = state.runs.cellRuns[row][col];
  const yaSeleccionada = state.selected && state.selected.row === row && state.selected.col === col;

  if (yaSeleccionada && cellRuns.across && cellRuns.down) {
    // Tocar dos veces la misma casilla cambia de dirección si pertenece a ambas
    state.direction = state.direction === 'across' ? 'down' : 'across';
  } else {
    state.selected = { row, col };
    if (state.direction === 'across' && !cellRuns.across && cellRuns.down) {
      state.direction = 'down';
    } else if (state.direction === 'down' && !cellRuns.down && cellRuns.across) {
      state.direction = 'across';
    }
  }
  render();
  enfocarInputOculto();
}

function onClueClick(row, col, cellClue) {
  // Saltar a la primera casilla de la palabra que define esta pista
  // (horizontal si la tiene, si no vertical)
  let objetivo = null;
  let direccion = 'across';
  if (cellClue.across) {
    objetivo = { row, col: col + 1 };
    direccion = 'across';
  } else if (cellClue.down) {
    objetivo = { row: row + 1, col };
    direccion = 'down';
  }
  if (!objetivo) return;
  state.selected = objetivo;
  state.direction = direccion;
  render();
  enfocarInputOculto();
}

function enfocarInputOculto() {
  hiddenInput.value = '';
  hiddenInput.blur();
  hiddenInput.focus({ preventScroll: true });
}

function moverEnDireccion(deltaRow, deltaCol) {
  if (!state.selected) return;
  let { row, col } = state.selected;
  do {
    row += deltaRow;
    col += deltaCol;
  } while (
    row >= 0 &&
    row < state.grid.rows &&
    col >= 0 &&
    col < state.grid.cols &&
    state.grid.cells[row][col].type !== 'letter'
  );

  if (row < 0 || row >= state.grid.rows || col < 0 || col >= state.grid.cols) return;
  if (state.grid.cells[row][col].type !== 'letter') return;

  state.selected = { row, col };
  if (deltaCol !== 0) state.direction = 'across';
  if (deltaRow !== 0) state.direction = 'down';
  render();
  enfocarInputOculto();
}

function avanzarEnPalabra() {
  const run = runActual();
  if (!run || !state.selected) return;
  const idx = run.cells.findIndex(
    (c) => c.row === state.selected.row && c.col === state.selected.col,
  );
  if (idx === -1 || idx === run.cells.length - 1) return;
  state.selected = run.cells[idx + 1];
  render();
}

function retrocederEnPalabra() {
  const run = runActual();
  if (!run || !state.selected) return;
  const idx = run.cells.findIndex(
    (c) => c.row === state.selected.row && c.col === state.selected.col,
  );
  if (idx <= 0) return;
  state.selected = run.cells[idx - 1];
  render();
}

/* ===================================
   ESCRITURA
   =================================== */

function escribirLetra(letra) {
  if (!state.selected) return;
  const { row, col } = state.selected;
  if (state.grid.cells[row][col].type !== 'letter') return;
  state.values[row][col] = letra;
  avanzarEnPalabra();
  posicionarInputOculto();
  actualizarProgreso();
}

function borrarLetra() {
  if (!state.selected) return;
  const { row, col } = state.selected;
  if (state.values[row][col]) {
    state.values[row][col] = '';
    render();
  } else {
    retrocederEnPalabra();
    if (state.selected) {
      state.values[state.selected.row][state.selected.col] = '';
      render();
    }
  }
  posicionarInputOculto();
}

hiddenInput.addEventListener('input', () => {
  const raw = hiddenInput.value;
  hiddenInput.value = '';
  if (!raw) return;
  const letra = normalizarLetra(raw.slice(-1));
  if (/^[A-ZÑ]$/.test(letra)) escribirLetra(letra);
});

hiddenInput.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'Backspace':
      e.preventDefault();
      borrarLetra();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      moverEnDireccion(0, -1);
      break;
    case 'ArrowRight':
      e.preventDefault();
      moverEnDireccion(0, 1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      moverEnDireccion(-1, 0);
      break;
    case 'ArrowDown':
      e.preventDefault();
      moverEnDireccion(1, 0);
      break;
  }
});

/* ===================================
   COMPROBAR / PISTA
   =================================== */

function comprobar() {
  render();
  setTimeout(() => {
    board.querySelectorAll('.cg-cell--incorrecta').forEach((el) => {
      el.classList.add('cg-cell--incorrecta-flash');
      setTimeout(() => el.classList.remove('cg-cell--incorrecta-flash'), 900);
    });
  }, 10);
}

function darPista() {
  const candidatas = [];
  for (let r = 0; r < state.grid.rows; r++) {
    for (let c = 0; c < state.grid.cols; c++) {
      const cell = state.grid.cells[r][c];
      if (cell.type === 'letter' && state.values[r][c] !== cell.answer) {
        candidatas.push({ r, c });
      }
    }
  }
  if (!candidatas.length) return;
  const elegida = candidatas[Math.floor(Math.random() * candidatas.length)];
  const cell = state.grid.cells[elegida.r][elegida.c];
  state.values[elegida.r][elegida.c] = cell.answer;
  cell.hinted = true;
  state.hintsUsed++;
  hintsEl.textContent = String(state.hintsUsed);
  render();
}

/* ===================================
   VICTORIA
   =================================== */

function onWin() {
  clearInterval(timer);
  launchConfetti(confettiCanvas);
  winStats.textContent = `Tiempo: ${formatTime(seconds)} · Pistas usadas: ${state.hintsUsed}`;
  winModal.classList.remove('hidden');
}

/* ===================================
   INICIALIZACIÓN
   =================================== */

export function init() {
  PUZZLES.forEach((p, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = p.title;
    puzzleSelect.appendChild(opt);
  });

  puzzleSelect.addEventListener('change', (e) => {
    loadPuzzle(parseInt(e.target.value, 10));
  });

  $('#cgCheckBtn').addEventListener('click', comprobar);
  $('#cgHintBtn').addEventListener('click', darPista);
  $('#cgRestartBtn').addEventListener('click', () => loadPuzzle(state.puzzleIdx));
  $('#cgCloseWinBtn').addEventListener('click', () => winModal.classList.add('hidden'));

  boardWrap.addEventListener('click', (e) => {
    if (e.target === boardWrap || e.target === board) enfocarInputOculto();
  });

  loadPuzzle(0);
}
