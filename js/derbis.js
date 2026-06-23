/* ===================================
   SANGRE CARBAYONA - DERBIS DINÁMICOS
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Cargar header y footer comunes
  if (typeof cargarComunes === 'function') {
    cargarComunes();
  }

  // 2. Si estamos en la página de un partido individual (derbi.html)
  if (document.getElementById('match-container')) {
    cargarPartidoDinamico();
  }
});

function cargarPartidoDinamico() {
  // Obtener el ID de la URL (?id=1944-j12)
  const urlParams = new URLSearchParams(window.location.search);
  const partidoId = urlParams.get('id');

  if (!partidoId || !window.DERBIS_DATA) return;

  // Buscar el partido en nuestra "base de datos"
  const partido = window.DERBIS_DATA.find((p) => p.id === partidoId);

  if (!partido) {
    document.getElementById('titulo-partido').innerText =
      'Partido no encontrado';
    return;
  }

  // 3. Rellenar las cabeceras
  document.getElementById('bc-jornada').innerText =
    `Jornada ${partido.jornada} (${partido.temporada.split('/')[0]})`;
  document.getElementById('titulo-partido').innerText =
    `${partido.local.nombre} vs ${partido.visitante.nombre}`;
  document.getElementById('subtitulo-partido').innerText =
    `${partido.competicion} · Jornada ${partido.jornada} · ${partido.temporada}`;

  // 4. Rellenar el marcador
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

  // 5. Rellenar alineaciones (Llamamos a una función auxiliar)
  renderizarAlineacion('alineacion-local', partido.local, 'Alineación Local');
  renderizarAlineacion(
    'alineacion-visitante',
    partido.visitante,
    'Alineación Visitante',
  );

  // Mostrar el contenedor (estaba oculto mientras cargaba)
  document.getElementById('match-container').style.display = 'block';
}

function renderizarAlineacion(contenedorId, equipo, titulo) {
  const contenedor = document.getElementById(contenedorId);
  let html = `<div class="lineup-header header-${equipo.cssClass}">${titulo}</div>`;

  // Jugadores
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

  // Entrenador
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
