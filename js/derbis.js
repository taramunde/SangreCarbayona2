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
      <td><a href="derbi.html?id=${partido.id}" class="match-link">Ver ficha <i class="fas fa-arrow-right"></i></a></td>
    `;
    tbody.appendChild(fila);
  });
}

/* ----------------------------------
   FICHA DE UN PARTIDO INDIVIDUAL
   ---------------------------------- */
function cargarPartidoDinamico() {
  const urlParams = new URLSearchParams(window.location.search);
  const partidoId = urlParams.get('id');

  if (!partidoId || !window.DERBIS_DATA) return;

  const partido = window.DERBIS_DATA.find((p) => p.id === partidoId);

  if (!partido) {
    document.getElementById('titulo-partido').innerText =
      'Partido no encontrado';
    return;
  }

  document.getElementById('bc-jornada').innerText =
    `Jornada ${partido.jornada} (${partido.temporada.split('/')[0]})`;
  document.getElementById('titulo-partido').innerText =
    `${partido.local.nombre} vs ${partido.visitante.nombre}`;
  document.getElementById('subtitulo-partido').innerText =
    `${partido.competicion} · Jornada ${partido.jornada} · ${partido.temporada}`;

  document.getElementById('escudo-local').src = partido.local.escudo;
  document.getElementById('nombre-local').innerText = partido.local.nombre;
  document.getElementById('escudo-visitante').src = partido.visitante.escudo;
  document.getElementById('nombre-visitante').innerText =
    partido.visitante.nombre;

  document.getElementById('fecha-partido').innerHTML =
    `<i class="far fa-calendar-alt"></i> ${partido.fecha}`;
  document.getElementById('resultado-partido').innerText = partido.resultado;
  document.getElementById('estadio-partido').innerHTML =
    `<i class="fas fa-map-marker-alt"></i> ${partido.estadio}`;

  renderizarAlineacion('alineacion-local', partido.local, 'Alineación Local');
  renderizarAlineacion(
    'alineacion-visitante',
    partido.visitante,
    'Alineación Visitante',
  );

  document.getElementById('match-container').style.display = 'block';
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
