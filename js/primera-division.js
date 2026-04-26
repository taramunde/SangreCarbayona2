/* ===================================
   PRIMERA DIVISIÓN - JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
  // Referencias a elementos del DOM
  const soloOviedo = document.getElementById('soloOviedo');
  const filtroRival = document.getElementById('filtroRival');
  const filtroResultado = document.getElementById('filtroResultado');
  const btnExpandir = document.getElementById('expandirTodas');
  const btnColapsar = document.getElementById('colapsarTodas');
  const btnLimpiar = document.getElementById('limpiarFiltros');
  const resumenFiltros = document.getElementById('resumenFiltros');
  const contadorPartidos = document.getElementById('contadorPartidos');
  const noResultados = document.getElementById('noResultados');

  // Verificar que todos existen
  const elementosFaltantes = {
    soloOviedo,
    filtroRival,
    filtroResultado,
    btnExpandir,
    btnColapsar,
    btnLimpiar,
    resumenFiltros,
    contadorPartidos,
    noResultados,
  };
  Object.entries(elementosFaltantes).forEach(([nombre, el]) => {
    if (!el) console.error('FALTA ELEMENTO:', nombre);
  });

  // Estado actual
  let temporadaActiva = null;
  let datosTemporada = null;
  let todosLosRivales = new Set();

  // DEBUG temporal
  console.log('soloOviedo:', document.getElementById('soloOviedo'));
  console.log('filtroRival:', document.getElementById('filtroRival'));
  console.log('filtroResultado:', document.getElementById('filtroResultado'));
  console.log('btnExpandir:', document.getElementById('expandirTodas'));
  console.log('btnColapsar:', document.getElementById('colapsarTodas'));

  // Inicializar
  init();

  function init() {
    // Verificar que existan los datos
    if (!window.CLUB_DATA || !CLUB_DATA.primeraDivisionHistorico) {
      console.error('No se encontraron datos de Primera División');
      jornadasContainer.innerHTML =
        '<p style="text-align:center; padding:40px; color:#666;">Error: No hay datos disponibles. Asegúrate de añadir la estructura de datos en data.js</p>';
      return;
    }

    // Cargar temporadas disponibles
    // Ordenar por año de inicio de forma numérica (descendente = más reciente primero)
    const temporadas = Object.keys(CLUB_DATA.primeraDivisionHistorico).sort(
      (a, b) => {
        return parseInt(b.split('-')[0]) - parseInt(a.split('-')[0]);
      },
    );
    if (temporadas.length === 0) {
      jornadasContainer.innerHTML =
        '<p style="text-align:center; padding:40px; color:#666;">No hay temporadas registradas todavía.</p>';
      return;
    }

    // Renderizar tabs de temporadas
    renderTemporadaTabs(temporadas);

    // Cargar primera temporada por defecto
    cambiarTemporada(temporadas[0]);

    // Event listeners
    setupEventListeners();
  }

  function renderTemporadaTabs(temporadas) {
    let html = '';
    temporadas.forEach((tempId, index) => {
      const temp = CLUB_DATA.primeraDivisionHistorico[tempId];
      html += `
                <button class="temporada-tab ${index === 0 ? 'active' : ''}" 
                        data-temporada="${tempId}">
                    ${temp.nombre || tempId}
                </button>
            `;
    });
    temporadaSelector.innerHTML = html;
  }

  function cambiarTemporada(temporadaId) {
    temporadaActiva = temporadaId;
    datosTemporada = CLUB_DATA.primeraDivisionHistorico[temporadaId];

    // Actualizar tabs visuales
    document.querySelectorAll('.temporada-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.temporada === temporadaId);
    });

    // Extraer rivales únicos para el filtro
    extraerRivales();

    // Aplicar filtros y renderizar
    aplicarFiltros();
  }

  function extraerRivales() {
    todosLosRivales.clear();

    if (!datosTemporada || !datosTemporada.jornadas) return;

    datosTemporada.jornadas.forEach((jornada) => {
      jornada.partidos.forEach((partido) => {
        if (partido.local !== 'Real Oviedo') todosLosRivales.add(partido.local);
        if (partido.visitante !== 'Real Oviedo')
          todosLosRivales.add(partido.visitante);
      });
    });

    // Actualizar select de rivales
    const rivalActual = filtroRival.value;
    let html = '<option value="todos">Todos los equipos</option>';
    Array.from(todosLosRivales)
      .sort()
      .forEach((rival) => {
        html += `<option value="${rival}">${rival}</option>`;
      });
    filtroRival.innerHTML = html;

    // Restaurar selección previa si existe
    if (rivalActual !== 'todos' && todosLosRivales.has(rivalActual)) {
      filtroRival.value = rivalActual;
    }
  }

  function aplicarFiltros() {
    if (!datosTemporada || !datosTemporada.jornadas) return;
    if (!soloOviedo || !filtroRival || !filtroResultado) return; // ← añade esto
    const soloOviedoChecked = soloOviedo.checked;
    const rivalSeleccionado = filtroRival.value;
    const resultadoSeleccionado = filtroResultado.value;

    let totalPartidosMostrados = 0;
    let html = '';

    datosTemporada.jornadas.forEach((jornada) => {
      // Filtrar partidos de esta jornada
      const partidosFiltrados = jornada.partidos.filter((partido) => {
        // Filtro: Solo Oviedo
        if (soloOviedoChecked) {
          const esOviedo =
            partido.local === 'Real Oviedo' ||
            partido.visitante === 'Real Oviedo';
          if (!esOviedo) return false;
        }

        // Filtro: Por rival
        if (rivalSeleccionado !== 'todos') {
          const esContraRival =
            partido.local === rivalSeleccionado ||
            partido.visitante === rivalSeleccionado;
          if (!esContraRival) return false;
        }

        // Filtro: Por resultado (solo aplica si es partido del Oviedo)
        if (
          resultadoSeleccionado !== 'todos' &&
          (partido.local === 'Real Oviedo' ||
            partido.visitante === 'Real Oviedo')
        ) {
          const esLocal = partido.local === 'Real Oviedo';
          const golesOviedo = esLocal
            ? partido.golesLocal
            : partido.golesVisitante;
          const golesRival = esLocal
            ? partido.golesVisitante
            : partido.golesLocal;

          if (resultadoSeleccionado === 'victoria' && golesOviedo <= golesRival)
            return false;
          if (resultadoSeleccionado === 'empate' && golesOviedo !== golesRival)
            return false;
          if (resultadoSeleccionado === 'derrota' && golesOviedo >= golesRival)
            return false;
        }

        return true;
      });

      if (partidosFiltrados.length > 0) {
        totalPartidosMostrados += partidosFiltrados.length;
        html += renderJornada(jornada, partidosFiltrados);
      }
    });

    // Actualizar UI
    jornadasContainer.innerHTML = html || '';
    noResultados.style.display =
      totalPartidosMostrados === 0 ? 'block' : 'none';

    // Actualizar contador
    if (
      totalPartidosMostrados > 0 ||
      soloOviedoChecked ||
      rivalSeleccionado !== 'todos' ||
      resultadoSeleccionado !== 'todos'
    ) {
      resumenFiltros.style.display = 'flex';
      contadorPartidos.textContent = totalPartidosMostrados;
    } else {
      resumenFiltros.style.display = 'none';
    }

    // Re-aplicar estado de colapsado/expandido
    updateToggleButtons();
  }

  function renderJornada(jornada, partidos) {
    return `
            <div class="jornada-section" data-jornada="${jornada.numero}">
                <div class="jornada-header" onclick="toggleJornada(this)">
                    <div class="jornada-title">
                        <i class="fas fa-futbol"></i>
                        Jornada ${jornada.numero}
                        <span class="jornada-fecha">${jornada.fecha || ''}</span>
                    </div>
                    <i class="fas fa-chevron-down jornada-toggle"></i>
                </div>
                <div class="partidos-list">
                    ${partidos.map((partido) => renderPartido(partido)).join('')}
                </div>
            </div>
        `;
  }

  function renderPartido(partido) {
    const esOviedo =
      partido.local === 'Real Oviedo' || partido.visitante === 'Real Oviedo';
    const highlightClass = esOviedo ? 'oviedo-highlight' : '';

    const escudoFallback =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='28' fill='%23e8e8e8' stroke='%23ccc' stroke-width='2'/%3E%3Ctext x='50%25' y='55%25' text-anchor='middle' font-size='22' fill='%23999'%3E%E2%9A%BD%3C/text%3E%3C/svg%3E";
    const escudoLocal = partido.escudoLocal || escudoFallback;
    const escudoVisitante = partido.escudoVisitante || escudoFallback;

    // Renderizar goleadores
    let goleadoresHtml = '';
    if (partido.goleadores && partido.goleadores.length > 0) {
      const golesL = partido.goleadores.filter((g) => g.equipo === 'local');
      const golesV = partido.goleadores.filter((g) => g.equipo === 'visitante');

      goleadoresHtml = '<div class="goleadores">';

      if (golesL.length > 0) {
        goleadoresHtml += `
                    <div class="goles-local">
                        ${golesL
                          .map(
                            (g) => `
                            <span class="gol-info">
                                <i class="fas fa-futbol"></i> ${g.jugador} ${g.minuto}
                            </span>
                        `,
                          )
                          .join('')}
                    </div>
                `;
      }

      if (golesV.length > 0) {
        goleadoresHtml += `
                    <div class="goles-visitante">
                        ${golesV
                          .map(
                            (g) => `
                            <span class="gol-info">
                                <i class="fas fa-futbol"></i> ${g.jugador} ${g.minuto}
                            </span>
                        `,
                          )
                          .join('')}
                    </div>
                `;
      }

      goleadoresHtml += '</div>';
    }

    return `
            <div class="partido-item ${highlightClass}">
                <div class="equipo-local">
                    <span class="nombre-equipo">${partido.local}</span>
                    <img src="${escudoLocal}" alt="${partido.local}" class="escudo-equipo" 
                         onerror="this.onerror=null;this.src='${escudoFallback}'">
                </div>
                <div class="resultado-box">
                    <div class="marcador">
                        ${partido.golesLocal} <span class="marcador-separador">-</span> ${partido.golesVisitante}
                    </div>
                    <span class="estado-partido">
                        ${
                          partido.estado === 'finalizado'
                            ? 'Finalizado'
                            : partido.estado === 'pendiente'
                              ? 'Pendiente'
                              : 'En juego'
                        }
                    </span>
                </div>
                <div class="equipo-visitante">
                    <img src="${escudoVisitante}" alt="${partido.visitante}" class="escudo-equipo"
                         onerror="this.onerror=null;this.src='${escudoFallback}'">
                    <span class="nombre-equipo">${partido.visitante}</span>
                </div>
                ${goleadoresHtml}
            </div>
        `;
  }

  function setupEventListeners() {
    // Cambio de temporada
    // Usamos closest() para que funcione aunque el clic sea en el texto interior del botón
    temporadaSelector.addEventListener('click', function (e) {
      const tab = e.target.closest('.temporada-tab');
      if (tab) {
        cambiarTemporada(tab.dataset.temporada);
      }
    });

    // Filtros
    soloOviedo.addEventListener('change', aplicarFiltros);
    filtroRival.addEventListener('change', aplicarFiltros);
    filtroResultado.addEventListener('change', aplicarFiltros);

    // Botones expandir/colapsar
    btnColapsar.addEventListener('click', function () {
      document
        .querySelectorAll('.jornada-section')
        .forEach((j) => j.classList.add('collapsed'));
      this.style.display = 'none';
      btnExpandir.style.display = 'inline-flex';
    });

    btnExpandir.addEventListener('click', function () {
      document
        .querySelectorAll('.jornada-section')
        .forEach((j) => j.classList.remove('collapsed'));
      this.style.display = 'none';
      btnColapsar.style.display = 'inline-flex';
    });

    // Limpiar filtros
    btnLimpiar.addEventListener('click', function () {
      soloOviedo.checked = true;
      filtroRival.value = 'todos';
      filtroResultado.value = 'todos';
      aplicarFiltros();
    });
  }

  function updateToggleButtons() {
    const todasColapsadas =
      document.querySelectorAll('.jornada-section:not(.collapsed)').length ===
      0;
    if (todasColapsadas) {
      btnColapsar.style.display = 'none';
      btnExpandir.style.display = 'inline-flex';
    } else {
      btnColapsar.style.display = 'inline-flex';
      btnExpandir.style.display = 'none';
    }
  }

  // Función global para togglear jornadas (onclick en HTML)
  window.toggleJornada = function (header) {
    const section = header.closest('.jornada-section');
    section.classList.toggle('collapsed');

    // Actualizar botones si es necesario
    const todasColapsadas =
      document.querySelectorAll('.jornada-section:not(.collapsed)').length ===
      0;
    const todasExpandidas =
      document.querySelectorAll('.jornada-section.collapsed').length === 0;

    if (todasColapsadas) {
      btnColapsar.style.display = 'none';
      btnExpandir.style.display = 'inline-flex';
    } else if (todasExpandidas) {
      btnColapsar.style.display = 'inline-flex';
      btnExpandir.style.display = 'none';
    }
  };
});
