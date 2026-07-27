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

function measureBoard() {
  const diff = DIFFICULTIES[state.diffKey] || DIFFICULTIES.medium;
  const anchoIdeal = diff.cols * 110;
  const maxW = Math.min(boardWrap.clientWidth - 24, 900, anchoIdeal);

  const pieceW = Math.floor(maxW / diff.cols);
  const pieceH = Math.floor((maxW * 0.66) / diff.rows);

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
  const pw = state.boardW / diff.cols;
  const ph = state.boardH / diff.rows;
  const tabSize = Math.floor(Math.min(pw, ph) * 0.42);
  return { diff, pw, ph, tabSize };
}

function buildLevel() {
  clearInterval(timer);
  seconds = 0;
  state.won = false;
  timeEl.textContent = formatTime(0);
  const level = LEVELS[state.levelIdx];

  measureBoard();

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
      if (r === 0) tabs.top = 0;
      if (r === rows - 1) tabs.bottom = 0;
      if (c === 0) tabs.left = 0;
      if (c === cols - 1) tabs.right = 0;

      // NUEVO: Asignamos a cada pieza su propio grupo inicial
      state.pieces.push({
        id: `${r}-${c}`,
        r,
        c,
        tabs,
        location: 'tray',
        x: 0,
        y: 0,
        group: `${r}-${c}`,
      });
    }
  }

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
    wrapper.dataset.id = p.id; // Clave para ocultar grupos enteros

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

    // Si está colocada, NO se le asigna pointerdown, por lo que queda bloqueada
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

  // NUEVO: Cogemos todas las piezas que pertenecen al mismo grupo que la que has tocado
  const groupPieces = state.pieces.filter((x) => x.group === p.group);

  const rect = e.currentTarget.getBoundingClientRect();
  const scaleAtGrab = fromTray ? TRAY_SCALE : 1;
  const offX = (e.clientX - rect.left) / scaleAtGrab;
  const offY = (e.clientY - rect.top) / scaleAtGrab;

  const dragGhost = document.createElement('div');
  dragGhost.style.position = 'fixed';
  dragGhost.style.zIndex = 100;
  dragGhost.style.pointerEvents = 'none';
  dragGhost.style.transform = 'scale(1.05) rotate(1deg)'; // Efecto al levantar

  // Construimos el fantasma sumando TODAS las piezas del grupo
  groupPieces.forEach((gp) => {
    // Ocultamos las originales
    const el = $(`[data-id="${gp.id}"]`);
    if (el) el.style.visibility = 'hidden';

    const svgWrap = document.createElement('div');
    svgWrap.style.position = 'absolute';
    // Las separamos basándonos en su posición lógica respecto a la pieza base que tocaste
    svgWrap.style.left = (gp.c - p.c) * pw + 'px';
    svgWrap.style.top = (gp.r - p.r) * ph + 'px';
    svgWrap.style.width = pw + tabSize * 2 + 'px';
    svgWrap.style.height = ph + tabSize * 2 + 'px';

    const { svg } = createPieceSVG({
      id: gp.id + '-drag',
      r: gp.r,
      c: gp.c,
      tabs: gp.tabs,
      w: pw,
      h: ph,
      tabSize,
      boardW: state.boardW,
      boardH: state.boardH,
      imgSrc: level.img,
      scale: 1,
      isTray: false,
    });
    svgWrap.appendChild(svg);
    dragGhost.appendChild(svgWrap);
  });

  document.body.appendChild(dragGhost);

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
    const distToBoard = Math.hypot(relLeft - targetLeft, relTop - targetTop);
    const snapTolerance = Math.min(pw, ph) * 0.35;

    // 1. ¿El grupo encaja en su posición final del tablero?
    if (distToBoard < snapTolerance) {
      groupPieces.forEach((gp) => (gp.location = 'placed'));
    } else {
      const margin = tabSize * 2;
      const overBoard =
        ghostLeft + (pw + tabSize * 2) > boardRect.left - margin &&
        ghostLeft < boardRect.right + margin &&
        ghostTop + (ph + tabSize * 2) > boardRect.top - margin &&
        ghostTop < boardRect.bottom + margin;

      if (overBoard) {
        // Actualizamos las coordenadas de todo el grupo
        groupPieces.forEach((gp) => {
          gp.location = 'board';
          gp.x = relLeft + (gp.c - p.c) * pw;
          gp.y = relTop + (gp.r - p.r) * ph;
        });

        // 2. NUEVO: ¿El grupo choca con otras piezas sueltas para unirse a ellas?
        let merged = false;
        for (let gp of groupPieces) {
          const others = state.pieces.filter(
            (x) => x.group !== gp.group && x.location === 'board',
          );
          for (let other of others) {
            // Comprobamos si lógicamente son piezas vecinas (arriba, abajo, izq, der)
            const isAdjacent =
              Math.abs(other.r - gp.r) + Math.abs(other.c - gp.c) === 1;
            if (isAdjacent) {
              const expectedX = gp.x + (other.c - gp.c) * pw;
              const expectedY = gp.y + (other.r - gp.r) * ph;
              const distToOther = Math.hypot(
                other.x - expectedX,
                other.y - expectedY,
              );

              if (distToOther < snapTolerance) {
                // FUSIONAMOS LOS GRUPOS
                const oldGroup = other.group;
                const newGroup = gp.group;
                state.pieces
                  .filter((x) => x.group === oldGroup)
                  .forEach((x) => {
                    x.group = newGroup;
                    // Las alineamos perfectamente para que enganchen sin dejar fisuras
                    x.x = gp.x + (x.c - gp.c) * pw;
                    x.y = gp.y + (x.r - gp.r) * ph;
                  });
                merged = true;
              }
            }
          }
          if (merged) break; // Si se ha fusionado, salimos para no hacer dobles uniones caóticas
        }
      } else {
        // Si lo sacas del tablero, todo el grupo vuelve a la bandeja
        groupPieces.forEach((gp) => (gp.location = 'tray'));
      }
    }
    render();
  };

  dragGhost.style.left = e.clientX - offX + 'px';
  dragGhost.style.top = e.clientY - offY + 'px';
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
