/* ===================================
   SANGRE CARBAYONA - DERBIS DINÁMICOS
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Cargar header y footer comunes
  if (typeof cargarComunes === 'function') {
    cargarComunes();
  }

  // 2. Página de listado (derbis.html)
  if (document.getElementById('derbisTbody')) {
    cargarListaDerbis();
  }

  // 3. Página de detalle (derbi.html)
  if (document.getElementById('match-container')) {
    cargarPartidoDinamico();
  }
});

/* ----------------------------------
   LISTADO DE TODOS LOS DERBIS
   ---------------------------------- */
function cargarListaDerbis() {
  if (!window.DERBIS_DATA) return;

  // --- Estadísticas resumen ---
  let victorias = 0,
    empates = 0,
    derrotas = 0;
  window.DERBIS_DATA.forEach(function (p) {
    if (p.ganador === 'oviedo') victorias++;
    else if (p.ganador === 'empate') empates++;
    else derrotas++;
  });

  const statsBar = document.getElementById('derbisStatsBar');
  if (statsBar) {
    statsBar.innerHTML = `
      <div class="derbis-stat-card">
        <div class="derbis-stat-number stat-total">${window.DERBIS_DATA.length}</div>
        <div class="derbis-stat-label">Partidos</div>
      </div>
      <div class="derbis-stat-card">
        <div class="derbis-stat-number stat-wins">${victorias}</div>
        <div class="derbis-stat-label">Victorias Oviedo</div>
      </div>
      <div class="derbis-stat-card">
        <div class="derbis-stat-number stat-draws">${empates}</div>
        <div class="derbis-stat-label">Empates</div>
      </div>
      <div class="derbis-stat-card">
        <div class="derbis-stat-number stat-losses">${derrotas}</div>
        <div class="derbis-stat-label">Victorias rival</div>
      </div>
    `;
  }

  // --- Filas de la tabla ---
  const tbody = document.getElementById('derbisTbody');

  window.DERBIS_DATA.forEach(function (partido) {
    const rowClass =
      partido.ganador === 'oviedo'
        ? 'win-oviedo'
        : partido.ganador === 'empate'
          ? 'draw'
          : 'win-sporting';

    const badgeClass =
      partido.ganador === 'oviedo'
        ? 'badge-v'
        : partido.ganador === 'empate'
          ? 'badge-e'
          : 'badge-d';

    const badgeText =
      partido.ganador === 'oviedo'
        ? 'V'
        : partido.ganador === 'empate'
          ? 'E'
          : 'D';

    const fila = document.createElement('tr');
    fila.className = rowClass;
    fila.innerHTML = `
      <td>${partido.temporada}</td>
      <td>${partido.competicion}</td>
      <td>J${partido.jornada}</td>
      <td>${partido.fecha}</td>
      <td>
        <div class="derbi-team-cell">
          <img src="${partido.local.escudo}" alt="${partido.local.nombre}" class="derbi-escudo-mini">
          <span>${partido.local.nombre}</span>
        </div>
      </td>
      <td>
        <div class="derbi-resultado-cell">
          <span class="score">${partido.resultado}</span>
          <span class="resultado-badge ${badgeClass}">${badgeText}</span>
        </div>
      </td>
      <td>
        <div class="derbi-team-cell">
          <img src="${partido.visitante.escudo}" alt="${partido.visitante.nombre}" class="derbi-escudo-mini">
          <span>${partido.visitante.nombre}</span>
        </div>
      </td>
      <td class="hide-mobile">${partido.estadio}</td>
      <td><a href="fichas/derbi-${partido.id}.html" class="match-link">Ver ficha <i class="fas fa-arrow-right"></i></a></td>
    `;
    tbody.appendChild(fila);
  });
}

/* ----------------------------------
   FICHA DE UN PARTIDO INDIVIDUAL
   ---------------------------------- */
function cargarPartidoDinamico() {
  const urlParams = new URLSearchParams(window.location.search);
  // En derbi.html (dinámico) el id viene por la URL. En las fichas
  // estáticas generadas por generar-derbis.js no hay query string,
  // así que se usa window.DERBI_ID_STATIC como respaldo (mismo patrón
  // que window.PLAYER_DATA_STATIC en las fichas de jugador).
  const partidoId = urlParams.get('id') || window.DERBI_ID_STATIC;

  if (!partidoId || !window.DERBIS_DATA) return;

  const partido = window.DERBIS_DATA.find((p) => p.id === partidoId);

  // Helpers defensivos: en la ficha estática no todos los elementos
  // existen (algunos ya vienen rellenos por generar-derbis.js en el
  // propio HTML), así que comprobamos antes de tocarlos en vez de
  // asumir que siempre están presentes.
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  };
  const setHtml = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value;
  };
  const setSrc = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.src = value;
  };

  if (!partido) {
    setText('titulo-partido', 'Partido no encontrado');
    return;
  }

  setText(
    'bc-jornada',
    `Jornada ${partido.jornada} (${partido.temporada.split('/')[0]})`,
  );
  setText(
    'titulo-partido',
    `${partido.local.nombre} vs ${partido.visitante.nombre}`,
  );
  setText(
    'subtitulo-partido',
    `${partido.competicion} · Jornada ${partido.jornada} · ${partido.temporada}`,
  );

  setSrc('escudo-local', partido.local.escudo);
  setText('nombre-local', partido.local.nombre);
  setSrc('escudo-visitante', partido.visitante.escudo);
  setText('nombre-visitante', partido.visitante.nombre);

  setHtml(
    'fecha-partido',
    `<i class="far fa-calendar-alt"></i> ${partido.fecha}`,
  );
  setText('resultado-partido', partido.resultado);
  setHtml(
    'estadio-partido',
    `<i class="fas fa-map-marker-alt"></i> ${partido.estadio}`,
  );

  renderizarAlineacion('alineacion-local', partido.local, 'Alineación Local');
  renderizarAlineacion(
    'alineacion-visitante',
    partido.visitante,
    'Alineación Visitante',
  );

  const matchContainer = document.getElementById('match-container');
  if (matchContainer) matchContainer.style.display = 'block';
}

function renderizarAlineacion(contenedorId, equipo, titulo) {
  const contenedor = document.getElementById(contenedorId);
  let html = `<div class="lineup-header header-${equipo.cssClass}">${titulo}</div>`;

  equipo.alineacion.forEach((jugador) => {
    let eventosHtml = '';
    if (jugador.eventos && jugador.eventos.length > 0) {
      jugador.eventos.forEach((ev) => {
        eventosHtml += `<span>${ev.minuto}</span> <img src="${ev.icono}" class="event-icon" alt="${ev.tipo}">`;
      });
    }
    html += `
      <div class="player-row">
        <img src="${jugador.foto}" alt="${jugador.nombre}" class="player-photo">
        <img src="${jugador.bandera}" alt="Bandera" class="player-flag">
        <span class="player-name">${jugador.nombre}</span>
        <div class="player-events">${eventosHtml}</div>
      </div>
    `;
  });

  html += `
    <div class="player-row coaches-row">
      <img src="${equipo.entrenador.foto}" alt="${equipo.entrenador.nombre}" class="player-photo" style="border-radius: 50%;">
      <img src="${equipo.entrenador.bandera}" alt="Bandera" class="player-flag">
      <div class="player-name">
        <span class="coach-label">Entrenador</span>
        ${equipo.entrenador.nombre}
      </div>
    </div>
  `;

  contenedor.innerHTML = html;
}