import { LEVELS, DIFFICULTIES } from './config.js';
import { makePiecePath, createPieceSVG } from './jigsaw.js';
import { launchConfetti } from './confetti.js';

const $ = (s) => document.querySelector(s);

const TRAY_SCALE = 0.52;

let state = {
  levelIdx: 0,
  diffKey: 'medium',
  boardW: 800,
  boardH: 528,
  pieces: [],
  won: false,
};

const boardWrap = $('#boardWrap');
const board = $('#board');
const tray = $('#tray');
const trayCount = $('#trayCount');
const timeEl = $('#time');
const progressEl = $('#progress');
const previewOverlay = $('#previewOverlay');
const previewImg = $('#previewImg');
const winModal = $('#puzzleWinModal');
const winStats = $('#winStats');
const confettiCanvas = $('#puzzleConfetti');

let timer = null;
let seconds = 0;

function formatTime(s) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

// -----------------------------------------------------------------
// EL ARREGLO: FÓRMULA DE ENTEROS PUROS PARA EVITAR GRIETAS VISUALES
// -----------------------------------------------------------------
function measureBoard() {
  const diff = DIFFICULTIES[state.diffKey] || DIFFICULTIES.medium;

  // 1. Definimos un ancho ideal: ej. máximo unos 110 píxeles de ancho por cada pieza
  const anchoIdeal = diff.cols * 110;

  // 2. El ancho máximo será el menor entre: la pantalla actual, 900px, o el anchoIdeal
  const maxW = Math.min(boardWrap.clientWidth - 24, 900, anchoIdeal);

  // 3. Calculamos las piezas forzando a que sean sin decimales para evitar grietas
  const pieceW = Math.floor(maxW / diff.cols);
  const pieceH = Math.floor((maxW * 0.66) / diff.rows);

  // 4. El tablero se reajusta para ser un múltiplo EXACTO de las piezas
  state.boardW = pieceW * diff.cols;
  state.boardH = pieceH * diff.rows;

  board.style.width = state.boardW + 'px';
  board.style.height = state.boardH + 'px';
}

function generateTabs(rows, cols) {
  const hTabs = Array.from({ length: rows + 1 }, () => Array(cols).fill(0));
  const vTabs = Array.from({ length: rows }, () => Array(cols + 1).fill(0));
  for (let r = 1; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      hTabs[r][c] = Math.random() > 0.5 ? 1 : -1;
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      vTabs[r][c] = Math.random() > 0.5 ? 1 : -1;
    }
  }
  return { hTabs, vTabs };
}

function currentGeom() {
  const diff = DIFFICULTIES[state.diffKey];
  // Como el board ya está reajustado en measureBoard, pw y ph salen ENTEROS:
  const pw = state.boardW / diff.cols;
  const ph = state.boardH / diff.rows;
  // El saliente de la pieza también lo forzamos a entero:
  const tabSize = Math.floor(Math.min(pw, ph) * 0.42);
  return { diff, pw, ph, tabSize };
}
// -----------------------------------------------------------------

function buildLevel() {
  clearInterval(timer);
  seconds = 0;
  state.won = false;
  timeEl.textContent = formatTime(0);
  const level = LEVELS[state.levelIdx];

  measureBoard(); // Llamamos al cálculo antes de construir

  const diff = DIFFICULTIES[state.diffKey];
  const rows = diff.rows,
    cols = diff.cols;
  const { hTabs, vTabs } = generateTabs(rows, cols);

  state.pieces = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tabs = {
        top: hTabs[r][c],
        bottom: hTabs[r + 1][c],
        left: vTabs[r][c],
        right: vTabs[r][c + 1],
      };
      // Bordes rectos para los límites del tablero
      if (r === 0) tabs.top = 0;
      if (r === rows - 1) tabs.bottom = 0;
      if (c === 0) tabs.left = 0;
      if (c === cols - 1) tabs.right = 0;

      state.pieces.push({
        id: `${r}-${c}`,
        r,
        c,
        tabs,
        location: 'tray',
        x: 0,
        y: 0,
      });
    }
  }

  // ¡HEMOS ELIMINADO EL BUCLE QUE INVERTÍA LAS PIEZAS Y LAS ROMPÍA!

  state.pieces.sort(() => Math.random() - 0.5);
  render();
  startTimer();
  previewImg.src = level.img;
  $('#levelTitle').textContent = level.title;
  $('#diffLabel').textContent = `${diff.label} · ${diff.count} piezas`;
}

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    timeEl.textContent = formatTime(seconds);
  }, 1000);
}

function render() {
  const level = LEVELS[state.levelIdx];
  const { diff, pw, ph, tabSize } = currentGeom();

  board.innerHTML = '';
  tray.innerHTML = '';

  for (const p of state.pieces) {
    if (p.location === 'tray') continue;
    const wrapper = document.createElement('div');
    wrapper.className =
      'piece' + (p.location === 'placed' ? ' placed' : ' loose-on-board');
    wrapper.style.position = 'absolute';

    let left, top;
    if (p.location === 'placed') {
      left = p.c * pw - tabSize;
      top = p.r * ph - tabSize;
    } else {
      left = p.x;
      top = p.y;
    }
    wrapper.style.left = left + 'px';
    wrapper.style.top = top + 'px';
    wrapper.style.width = pw + tabSize * 2 + 'px';
    wrapper.style.height = ph + tabSize * 2 + 'px';
    wrapper.style.zIndex = p.location === 'placed' ? 1 : 5;

    const { svg } = createPieceSVG({
      id: p.id,
      r: p.r,
      c: p.c,
      tabs: p.tabs,
      w: pw,
      h: ph,
      tabSize,
      boardW: state.boardW,
      boardH: state.boardH,
      imgSrc: level.img,
      scale: 1,
      isTray: false,
    });
    wrapper.appendChild(svg);

    if (p.location !== 'placed') {
      wrapper.addEventListener('pointerdown', (e) =>
        onPointerDown(e, p, { fromTray: false }),
      );
    }
    board.appendChild(wrapper);
  }

  const trayPieces = state.pieces.filter((p) => p.location === 'tray');
  trayCount.textContent = `${trayPieces.length} piezas`;

  for (const p of trayPieces) {
    const wrapper = document.createElement('div');
    wrapper.className = 'piece';
    wrapper.dataset.id = p.id;
    wrapper.style.width = pw * TRAY_SCALE + tabSize * 2 * TRAY_SCALE + 'px';
    wrapper.style.height = ph * TRAY_SCALE + tabSize * 2 * TRAY_SCALE + 'px';
    const { svg } = createPieceSVG({
      id: p.id,
      r: p.r,
      c: p.c,
      tabs: p.tabs,
      w: pw,
      h: ph,
      tabSize,
      boardW: state.boardW,
      boardH: state.boardH,
      imgSrc: level.img,
      scale: TRAY_SCALE,
      isTray: true,
    });
    wrapper.appendChild(svg);
    wrapper.addEventListener('pointerdown', (e) =>
      onPointerDown(e, p, { fromTray: true }),
    );
    tray.appendChild(wrapper);
  }

  const placed = state.pieces.filter((p) => p.location === 'placed').length;
  const total = state.pieces.length;
  const prog = total ? Math.round((placed / total) * 100) : 0;
  progressEl.textContent = `${prog}%`;
  $('#placedCount').textContent = `${placed}/${total}`;

  if (total > 0 && placed === total && !state.won) {
    state.won = true;
    onWin();
  }
}

function onPointerDown(e, p, { fromTray }) {
  e.stopPropagation();
  e.preventDefault();
  const level = LEVELS[state.levelIdx];
  const { diff, pw, ph, tabSize } = currentGeom();

  const rect = e.currentTarget.getBoundingClientRect();
  const scaleAtGrab = fromTray ? TRAY_SCALE : 1;
  const offX = (e.clientX - rect.left) / scaleAtGrab;
  const offY = (e.clientY - rect.top) / scaleAtGrab;

  const dragGhost = document.createElement('div');
  dragGhost.className = 'piece';
  dragGhost.style.position = 'fixed';
  dragGhost.style.left = e.clientX - offX + 'px';
  dragGhost.style.top = e.clientY - offY + 'px';
  dragGhost.style.width = pw + tabSize * 2 + 'px';
  dragGhost.style.height = ph + tabSize * 2 + 'px';
  dragGhost.style.zIndex = 100;
  dragGhost.style.pointerEvents = 'none';
  const { svg } = createPieceSVG({
    id: p.id + '-drag',
    r: p.r,
    c: p.c,
    tabs: p.tabs,
    w: pw,
    h: ph,
    tabSize,
    boardW: state.boardW,
    boardH: state.boardH,
    imgSrc: level.img,
    scale: 1,
    isTray: false,
  });
  svg.style.transform = 'scale(1.08) rotate(1deg)';
  dragGhost.appendChild(svg);
  document.body.appendChild(dragGhost);

  if (!fromTray) e.currentTarget.style.visibility = 'hidden';

  const move = (ev) => {
    dragGhost.style.left = ev.clientX - offX + 'px';
    dragGhost.style.top = ev.clientY - offY + 'px';
  };

  const up = (ev) => {
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', up);
    dragGhost.remove();

    const boardRect = board.getBoundingClientRect();
    const ghostLeft = ev.clientX - offX;
    const ghostTop = ev.clientY - offY;
    const relLeft = ghostLeft - boardRect.left;
    const relTop = ghostTop - boardRect.top;

    const targetLeft = pw * p.c - tabSize;
    const targetTop = ph * p.r - tabSize;
    const dist = Math.hypot(relLeft - targetLeft, relTop - targetTop);
    const snapTolerance = Math.min(pw, ph) * 0.35;

    const piece = state.pieces.find((x) => x.id === p.id);
    if (!piece) return;

    if (dist < snapTolerance) {
      piece.location = 'placed';
    } else {
      const margin = tabSize * 2;
      const overBoard =
        ghostLeft + (pw + tabSize * 2) > boardRect.left - margin &&
        ghostLeft < boardRect.right + margin &&
        ghostTop + (ph + tabSize * 2) > boardRect.top - margin &&
        ghostTop < boardRect.bottom + margin;
      if (overBoard) {
        piece.location = 'board';
        const maxLeft = state.boardW - pw * 0.15;
        const minLeft = -pw * 0.85;
        const maxTop = state.boardH - ph * 0.15;
        const minTop = -ph * 0.85;
        piece.x = Math.min(Math.max(relLeft, minLeft), maxLeft);
        piece.y = Math.min(Math.max(relTop, minTop), maxTop);
      } else {
        piece.location = 'tray';
      }
    }
    render();
  };
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', up);
}

function onWin() {
  clearInterval(timer);
  launchConfetti(confettiCanvas);
  const level = LEVELS[state.levelIdx];
  const diff = DIFFICULTIES[state.diffKey];
  winStats.innerHTML = `${level.title} • ${diff.label} (${diff.count})<br><span class="pill">TIEMPO ${formatTime(seconds)}</span>`;
  $('#winThumb').src = level.img;
  winModal.classList.remove('hidden');
}

export function init() {
  $('#diffSelect').addEventListener('change', (e) => {
    state.diffKey = e.target.value;
    localStorage.setItem('carb_diff', state.diffKey);
    buildLevel();
  });
  $('#levelSelect').addEventListener('change', (e) => {
    state.levelIdx = parseInt(e.target.value);
    localStorage.setItem('carb_level', state.levelIdx);
    buildLevel();
  });
  $('#previewBtn').addEventListener('pointerdown', () =>
    previewOverlay.classList.add('on'),
  );
  $('#previewBtn').addEventListener('pointerup', () =>
    previewOverlay.classList.remove('on'),
  );
  $('#previewBtn').addEventListener('pointerleave', () =>
    previewOverlay.classList.remove('on'),
  );
  $('#restartBtn').addEventListener('click', () => buildLevel());
  $('#nextBtn').addEventListener('click', () => {
    winModal.classList.add('hidden');
    state.levelIdx = (state.levelIdx + 1) % LEVELS.length;
    $('#levelSelect').value = state.levelIdx;
    localStorage.setItem('carb_level', state.levelIdx);
    buildLevel();
  });
  $('#closeWinBtn').addEventListener('click', () =>
    winModal.classList.add('hidden'),
  );

  const trayEl = $('#tray');
  const leftBtn = $('#trayLeft');
  const rightBtn = $('#trayRight');

  leftBtn?.addEventListener('click', () =>
    trayEl.scrollBy({ left: -320, behavior: 'smooth' }),
  );
  rightBtn?.addEventListener('click', () =>
    trayEl.scrollBy({ left: 320, behavior: 'smooth' }),
  );

  let isDown = false,
    startX,
    scrollLeft;
  trayEl.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.piece')) return;
    isDown = true;
    trayEl.classList.add('dragging');
    startX = e.pageX - trayEl.offsetLeft;
    scrollLeft = trayEl.scrollLeft;
  });
  trayEl.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - trayEl.offsetLeft;
    const walk = (x - startX) * 1.6;
    trayEl.scrollLeft = scrollLeft - walk;
  });
  trayEl.addEventListener('pointerup', () => {
    isDown = false;
    trayEl.classList.remove('dragging');
  });
  trayEl.addEventListener('pointerleave', () => {
    isDown = false;
    trayEl.classList.remove('dragging');
  });

  trayEl.addEventListener(
    'wheel',
    (e) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        trayEl.scrollLeft += e.deltaY;
      }
    },
    { passive: false },
  );

  const levelSel = $('#levelSelect');
  LEVELS.forEach((lv, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = lv.title;
    levelSel.appendChild(opt);
  });
  const savedDiff = localStorage.getItem('carb_diff');
  const savedLevel = localStorage.getItem('carb_level');
  if (savedDiff && DIFFICULTIES[savedDiff]) state.diffKey = savedDiff;
  if (savedLevel) state.levelIdx = parseInt(savedLevel) || 0;
  $('#diffSelect').value = state.diffKey;
  levelSel.value = state.levelIdx;

  window.addEventListener('resize', () => {
    measureBoard();
    render();
  });

  buildLevel();
}
