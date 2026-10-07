/* =====================================================
   js/calendario.js
   Depende de: js/clasificacion.js (debe cargarse antes)
   Funciona en: calendario.html  →  renderiza jornadas completas
                index.html       →  renderiza widget "próximo partido"
   ===================================================== */

(function () {
  // ── Constantes ──────────────────────────────────────
  const OVIEDO = 'Real Oviedo';
  const POR_JORNADA = 11; // MODIFICADO: 22 equipos = 11 partidos por jornada

  // ── Partidos de Copa del Rey / otras eliminatorias ───
  // A diferencia de "enfrentamientos" (liga), estos SÍ llevan fecha y hora
  // reales, porque se anuncian de uno en uno cuando se sabe el día del
  // sorteo — no hay un calendario completo de toda la ronda como en liga.
  //
  // "trasJornada": estimación de qué jornada de LIGA habrá quedado jugada
  // justo antes de la fecha real de este partido (calculado a partir del
  // ritmo semanal habitual). Se usa solo para decidir cuándo este partido
  // pasa a ser el "próximo partido" en el widget de portada, en vez de la
  // siguiente jornada de liga sin jugar — no afecta a nada más. Si el
  // calendario real de liga se retrasa o adelanta mucho, puede ajustarse
  // este número a mano.
  const partidosEspeciales = [
    {
      competicion: 'Copa del Rey',
      ronda: 'Primera Ronda',
      equipo1: 'Real Oviedo',
      equipo2: 'C.D. Numancia',
      fecha: '2026-10-28',
      hora: '20:00',
      goles1: null,
      goles2: null,
      trasJornada: 11,
    },
  ];

  function getPartidosEspeciales() {
    return partidosEspeciales
      .map((p) => ({
        ...p,
        jugado: p.goles1 !== null && p.goles2 !== null,
      }))
      .filter((p) => p.equipo1 === OVIEDO || p.equipo2 === OVIEDO);
  }

  // Los botones de filtro son fijos en el HTML (no se recrean al volver a
  // renderizar el calendario, p.ej. al cambiar de idioma), así que el
  // listener solo debe engancharse una vez o se acumulan y un solo clic
  // acaba disparando el filtro varias veces.
  let filtrosListenerActivo = false;

  // ── Utilidades ──────────────────────────────────────
  function getEscudo(nombre) {
    if (typeof equipos === 'undefined') return '';
    const eq = equipos.find((e) => e.nombre === nombre);
    return eq ? eq.escudo : '';
  }

  // Si un rival no tiene escudo mapeado (p.ej. un equipo de Copa que no
  // juega en la misma categoría y no está en la lista de "equipos"), no
  // se pone ningún <img> en vez de dejar un icono roto.
  function imgEscudo(url, alt, claseCss) {
    return url
      ? `<img src="${url}" alt="${alt}" class="${claseCss}">`
      : '';
  }

  // Fecha + hora reales de un partido especial, formateadas en el idioma
  // activo (sin depender de app.js, que no se carga en calendario.html).
  function formatearFechaHora(fechaStr, horaStr) {
    if (!fechaStr) return '';
    const [y, m, d] = fechaStr.split('-');
    const fecha = new Date(y, m - 1, d);
    const lang = localStorage.getItem('lang') || 'es';
    const dia = fecha.toLocaleDateString(lang, {
      day: 'numeric',
      month: 'short',
    });
    return horaStr ? `${dia} · ${horaStr}` : dia;
  }

  // ── Datos de partidos del Oviedo ─────────────────────
  function getPartidosOviedo() {
    if (typeof enfrentamientos === 'undefined') return [];

    return enfrentamientos
      .map((p, idx) => ({
        ...p,
        jornada: Math.floor(idx / POR_JORNADA) + 1,
        jugado: p.goles1 !== null && p.goles2 !== null,
      }))
      .filter((p) => p.equipo1 === OVIEDO || p.equipo2 === OVIEDO);
  }

  // ── Estadísticas del Oviedo ──────────────────────────
  function calcularStats(partidos) {
    let jugados = 0,
      ganados = 0,
      empates = 0,
      derrotas = 0;
    let gf = 0,
      gc = 0,
      pendientes = 0;

    partidos.forEach((p) => {
      if (!p.jugado) {
        pendientes++;
        return;
      }
      jugados++;
      const esLocal = p.equipo1 === OVIEDO;
      const golesO = esLocal ? p.goles1 : p.goles2;
      const golesR = esLocal ? p.goles2 : p.goles1;
      gf += golesO;
      gc += golesR;
      if (golesO > golesR) ganados++;
      else if (golesO < golesR) derrotas++;
      else empates++;
    });

    return { jugados, ganados, empates, derrotas, gf, gc, pendientes };
  }

  // ── Estado visual del partido ────────────────────────
  function getEstado(p) {
    if (!p.jugado) return p.aplazado ? 'aplazado' : 'pendiente';
    const esLocal = p.equipo1 === OVIEDO;
    const golesO = esLocal ? p.goles1 : p.goles2;
    const golesR = esLocal ? p.goles2 : p.goles1;
    if (golesO > golesR) return 'victoria';
    else if (golesO < golesR) return 'derrota';
    else return 'empate';
  }

  // ── Próximo partido del Oviedo ───────────────────────
  // Salta los partidos marcados como aplazados: siguen pendientes de
  // jugarse, pero no son "el siguiente" hasta que se les ponga nueva
  // fecha (momento en el que, como cualquier otro, dejará de tener
  // sentido seguir marcándolo "aplazado").
  function getProximoPartido(partidos) {
    return partidos.find((p) => !p.jugado && !p.aplazado) || null;
  }

  // ── Próximo partido contando también Copa/otras eliminatorias ─
  // El de liga es siempre "el siguiente" salvo que ya se haya jugado la
  // jornada marcada en "trasJornada" del partido especial — en ese punto
  // el especial le toma el turno (ver comentario junto a "trasJornada").
  function getProximoPartidoGeneral() {
    const proximaLiga = getProximoPartido(getPartidosOviedo());
    const proximoEspecial =
      getPartidosEspeciales().find((p) => !p.jugado) || null;

    if (!proximoEspecial) return proximaLiga;
    if (!proximaLiga) return proximoEspecial;

    if (
      typeof proximoEspecial.trasJornada === 'number' &&
      proximaLiga.jornada > proximoEspecial.trasJornada
    ) {
      return proximoEspecial;
    }
    return proximaLiga;
  }

  // ── Último partido jugado ────────────────────────────
  function getUltimoPartido(partidos) {
    const jugados = partidos.filter((p) => p.jugado);
    return jugados.length ? jugados[jugados.length - 1] : null;
  }

  // ── Bloque de un partido especial (Copa, etc.) ───────
  function crearBloqueEspecial(p, esProximo) {
    const esLocal = p.equipo1 === OVIEDO;
    const rival = esLocal ? p.equipo2 : p.equipo1;
    const escudoO = getEscudo(OVIEDO);
    const escudoR = getEscudo(rival);
    const equipoIzq = esLocal ? OVIEDO : rival;
    const equipoDer = esLocal ? rival : OVIEDO;
    const escudoIzq = esLocal ? escudoO : escudoR;
    const escudoDer = esLocal ? escudoR : escudoO;

    const estado = getEstado(p);
    let centroHTML;
    if (p.jugado) {
      const badgeClass = {
        victoria: 'badge-victoria',
        empate: 'badge-empate',
        derrota: 'badge-derrota',
      }[estado];
      const badgeText = {
        victoria: t('victoria'),
        empate: t('empate'),
        derrota: t('derrota'),
      }[estado];
      centroHTML = `
                <div class="cal-resultado">${p.goles1}<span class="cal-resultado-sep">–</span>${p.goles2}</div>
                <span class="cal-resultado-badge ${badgeClass}">${badgeText}</span>
            `;
    } else {
      centroHTML = `
                <div class="cal-vs">VS</div>
                <span class="cal-localidad">${formatearFechaHora(p.fecha, p.hora)}</span>
            `;
    }

    const block = document.createElement('div');
    block.className = 'cal-jornada-block';
    block.innerHTML = `
            <div class="cal-jornada-header">
                <span class="cal-jornada-num">${p.competicion} · ${p.ronda}</span>
                <span class="cal-jornada-line"></span>
            </div>
        `;

    const card = document.createElement('div');
    card.className = `cal-match-card estado-${estado}${esProximo ? ' proximo-partido' : ''}`;
    card.dataset.estado = estado;
    card.dataset.localidad = esLocal ? 'local' : 'visitante';
    card.innerHTML = `
            ${esProximo ? `<div class="cal-proximo-badge">${t('proximo_partido')}</div>` : ''}
            <div class="cal-team local">
                ${imgEscudo(escudoIzq, equipoIzq, 'cal-team-escudo')}
                <span class="cal-team-nombre${equipoIzq === OVIEDO ? ' es-oviedo' : ''}">${equipoIzq}</span>
            </div>
            <div class="cal-match-center">
                ${centroHTML}
            </div>
            <div class="cal-team visitante">
                ${imgEscudo(escudoDer, equipoDer, 'cal-team-escudo')}
                <span class="cal-team-nombre${equipoDer === OVIEDO ? ' es-oviedo' : ''}">${equipoDer}</span>
            </div>
        `;
    block.appendChild(card);
    return block;
  }

  // =====================================================
  //   RENDERIZADO — calendario.html
  // =====================================================
  function renderCalendario() {
    const container = document.getElementById('jornadasContainer');
    if (!container) return; // no estamos en calendario.html

    const partidos = getPartidosOviedo();
    if (!partidos.length) {
      container.innerHTML =
        '<p style="text-align:center;padding:40px;color:#888">No hay datos de partidos.</p>';
      return;
    }

    // Stats
    const stats = calcularStats(partidos);
    actualizarStatBar(stats);

    const proximo = getProximoPartidoGeneral();
    const especiales = getPartidosEspeciales();

    // Agrupar por jornada
    const jornadas = {};
    partidos.forEach((p) => {
      if (!jornadas[p.jornada]) jornadas[p.jornada] = [];
      jornadas[p.jornada].push(p);
    });

    container.innerHTML = '';

    Object.keys(jornadas)
      .sort((a, b) => a - b)
      .forEach((numJornada) => {
        const ps = jornadas[numJornada];

        const block = document.createElement('div');
        block.className = 'cal-jornada-block';
        block.dataset.jornada = numJornada;

        // Cabecera jornada — usa t() para traducir "Jornada"
        block.innerHTML = `
                    <div class="cal-jornada-header">
                        <span class="cal-jornada-num">${t('jornada')} ${numJornada}</span>
                        <span class="cal-jornada-line"></span>
                    </div>
                `;

        // Tarjetas de partido
        ps.forEach((p) => {
          const esLocal = p.equipo1 === OVIEDO;
          const rival = esLocal ? p.equipo2 : p.equipo1;
          const escudoO = getEscudo(OVIEDO);
          const escudoR = getEscudo(rival);
          const estado = getEstado(p);
          const esProximo = proximo && p === proximo;

          // Datos visuales del resultado
          let centroHTML;
          if (p.jugado) {
            const golesIzq = p.goles1;
            const golesDer = p.goles2;

            const badgeClass = {
              victoria: 'badge-victoria',
              empate: 'badge-empate',
              derrota: 'badge-derrota',
            }[estado];
            // Usar t() para traducir Victoria / Empate / Derrota
            const badgeText = {
              victoria: t('victoria'),
              empate: t('empate'),
              derrota: t('derrota'),
            }[estado];
            centroHTML = `
                            <div class="cal-resultado">
                                ${golesIzq}<span class="cal-resultado-sep">–</span>${golesDer}
                            </div>
                            <span class="cal-resultado-badge ${badgeClass}">${badgeText}</span>
                        `;
          } else if (p.aplazado) {
            centroHTML = `
                            <div class="cal-vs">VS</div>
                            <span class="cal-resultado-badge badge-aplazado">${t('aplazado')}</span>
                        `;
          } else {
            // Usar t() para traducir Casa / Fuera
            centroHTML = `
                            <div class="cal-vs">VS</div>
                            <span class="cal-localidad">${esLocal ? t('en_casa') : t('fuera')}</span>
                        `;
          }

          // Equipo local y visitante en la tarjeta
          const equipoIzq = esLocal ? OVIEDO : rival;
          const equipoDer = esLocal ? rival : OVIEDO;
          const escudoIzq = esLocal ? escudoO : escudoR;
          const escudoDer = esLocal ? escudoR : escudoO;

          const card = document.createElement('div');
          card.className = `cal-match-card estado-${estado}${esProximo ? ' proximo-partido' : ''}`;

          // Datos para filtros
          card.dataset.estado = estado;
          card.dataset.localidad = esLocal ? 'local' : 'visitante';

          card.innerHTML = `
                        ${esProximo ? `<div class="cal-proximo-badge">${t('proximo_partido')}</div>` : ''}
                        <div class="cal-team local">
                            ${imgEscudo(escudoIzq, equipoIzq, 'cal-team-escudo')}
                            <span class="cal-team-nombre${equipoIzq === OVIEDO ? ' es-oviedo' : ''}">${equipoIzq}</span>
                        </div>
                        <div class="cal-match-center">
                            ${centroHTML}
                        </div>
                        <div class="cal-team visitante">
                            ${imgEscudo(escudoDer, equipoDer, 'cal-team-escudo')}
                            <span class="cal-team-nombre${equipoDer === OVIEDO ? ' es-oviedo' : ''}">${equipoDer}</span>
                        </div>
                    `;

          block.appendChild(card);
        });

        container.appendChild(block);

        // Partidos especiales (Copa, etc.) que caen justo después de esta
        // jornada — ver comentario de "trasJornada" junto a su definición.
        especiales
          .filter((p) => String(p.trasJornada) === String(numJornada))
          .forEach((p) => {
            container.appendChild(crearBloqueEspecial(p, proximo === p));
          });
      });

    // Mensaje vacío (usado por filtros)
    const emptyMsg = document.createElement('div');
    emptyMsg.id = 'calEmpty';
    emptyMsg.className = 'cal-empty';
    emptyMsg.innerHTML =
      '<i class="fas fa-search"></i>No hay partidos con ese filtro.';
    container.appendChild(emptyMsg);

    // Scroll automático al próximo partido
    if (proximo) {
      setTimeout(() => {
        const card = container.querySelector('.proximo-partido');
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }

    // Activar filtros
    iniciarFiltros();
  }

  // ── Barra de estadísticas ────────────────────────────
  function actualizarStatBar(stats) {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    set('statJugados', stats.jugados);
    set('statGanados', stats.ganados);
    set('statEmpates', stats.empates);
    set('statDerrotas', stats.derrotas);
    set('statGoles', `${stats.gf}:${stats.gc}`);
    set('statPendientes', stats.pendientes);
  }

  // ── Filtros ──────────────────────────────────────────
  function iniciarFiltros() {
    const contenedor = document.querySelector('.cal-filters');
    if (!contenedor || filtrosListenerActivo) return;
    filtrosListenerActivo = true;

    contenedor.addEventListener('click', (e) => {
      const btn = e.target.closest('.cal-filter-btn');
      if (!btn) return;

      contenedor
        .querySelectorAll('.cal-filter-btn')
        .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filtro = btn.dataset.filter;
      aplicarFiltro(filtro, document.getElementById('calEmpty'));
    });
  }

  function aplicarFiltro(filtro, emptyMsg) {
    const cards = document.querySelectorAll('.cal-match-card');
    const bloques = document.querySelectorAll('.cal-jornada-block');
    let visible = 0;

    cards.forEach((card) => {
      const estado = card.dataset.estado;
      const localidad = card.dataset.localidad;

      let mostrar = false;
      switch (filtro) {
        case 'todos':
          mostrar = true;
          break;
        case 'jugados':
          mostrar = estado !== 'pendiente';
          break;
        case 'pendientes':
          mostrar = estado === 'pendiente';
          break;
        case 'local':
          mostrar = localidad === 'local';
          break;
        case 'visitante':
          mostrar = localidad === 'visitante';
          break;
      }

      card.classList.toggle('oculto', !mostrar);
      if (mostrar) visible++;
    });

    bloques.forEach((bloque) => {
      const tieneVisibles =
        bloque.querySelectorAll('.cal-match-card:not(.oculto)').length > 0;
      bloque.classList.toggle('hidden', !tieneVisibles);
    });

    if (emptyMsg) emptyMsg.classList.toggle('visible', visible === 0);

    const todosLosPartidos = getPartidosOviedo();
    let partidosFiltrados = [];

    switch (filtro) {
      case 'todos':
        partidosFiltrados = todosLosPartidos;
        break;
      case 'jugados':
        partidosFiltrados = todosLosPartidos.filter((p) => p.jugado);
        break;
      case 'pendientes':
        partidosFiltrados = todosLosPartidos.filter((p) => !p.jugado);
        break;
      case 'local':
        partidosFiltrados = todosLosPartidos.filter(
          (p) => p.equipo1 === OVIEDO,
        );
        break;
      case 'visitante':
        partidosFiltrados = todosLosPartidos.filter(
          (p) => p.equipo2 === OVIEDO,
        );
        break;
    }

    const nuevasStats = calcularStats(partidosFiltrados);
    actualizarStatBar(nuevasStats);
  }

  // =====================================================
  //   RENDERIZADO — index.html (widget próximo partido)
  // =====================================================
  function renderWidgetHome() {
    const lista = document.getElementById('calendarioList');
    if (!lista) return; // no estamos en index.html

    const proximo = getProximoPartidoGeneral();

    lista.innerHTML = '';

    if (proximo) {
      const esEspecial = !!proximo.competicion;
      const esLocal = proximo.equipo1 === OVIEDO;
      const rival = esLocal ? proximo.equipo2 : proximo.equipo1;
      const escudoO = getEscudo(OVIEDO);
      const escudoR = getEscudo(rival);
      const equipoIzq = esLocal ? OVIEDO : rival;
      const equipoDer = esLocal ? rival : OVIEDO;
      const escudoIzq = esLocal ? escudoO : escudoR;
      const escudoDer = esLocal ? escudoR : escudoO;

      const etiquetaFooter = esEspecial
        ? `${proximo.competicion} · ${proximo.ronda} · ${formatearFechaHora(proximo.fecha, proximo.hora)}`
        : `${t('jornada')} ${proximo.jornada}`;

      const elProximo = document.createElement('div');
      elProximo.className = 'match-item home-match-next';
      elProximo.innerHTML = `
                <div class="home-match-teams">
                    <div class="home-team${equipoIzq === OVIEDO ? ' oviedo' : ''}">
                        ${imgEscudo(escudoIzq, equipoIzq, 'home-escudo-md')}
                        <span class="home-team-nombre">${equipoIzq}</span>
                    </div>
                    <div class="home-match-center">
                        <div class="home-score-vs">VS</div>
                        <span class="home-localidad-badge">${esLocal ? t('en_casa') : t('fuera')}</span>
                    </div>
                    <div class="home-team right${equipoDer === OVIEDO ? ' oviedo' : ''}">
                        ${imgEscudo(escudoDer, equipoDer, 'home-escudo-md')}
                        <span class="home-team-nombre">${equipoDer}</span>
                    </div>
                </div>
                <div class="home-match-footer">
                    <span class="home-match-label"><i class="fas fa-calendar-alt"></i> ${etiquetaFooter}</span>
                </div>
            `;
      lista.appendChild(elProximo);
    } else {
      lista.innerHTML =
        '<p style="text-align:center;color:#888;font-size:0.9em;padding:10px;">No hay próximos partidos.</p>';
    }

    const verTodo = document.querySelector('.upcoming-matches .view-all');
    if (verTodo) verTodo.href = 'calendario.html';
  }

  // =====================================================
  //   INICIALIZACIÓN
  // =====================================================
  renderCalendario();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderWidgetHome);
  } else {
    renderWidgetHome();
  }

  // ── Registrar re-render al cambiar idioma ────────────
  // setLanguage() en i18n.js re-renderiza el DOM estático,
  // pero el calendario es dinámico, así que lo enganchamos aquí.
  window.renderCalendario = renderCalendario;
  window.renderWidgetHome = renderWidgetHome;

  // ── Estilos inline para el widget home ──────────────
  const homeStyles = document.createElement('style');
  homeStyles.textContent = `
        .home-match-result,
        .home-match-next {
            background: #fff;
            border-radius: 14px;
            padding: 20px 18px 14px;
            margin-bottom: 10px;
            border: 1px solid #eef0f8;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .home-match-next {
            border-left: 4px solid #ffcc00;
            background: linear-gradient(135deg, #fffbea 0%, #fff 60%);
        }

        .home-match-teams {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        .home-team {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            flex: 1;
            min-width: 0;
        }

        .home-escudo-md {
            width: 54px;
            height: 54px;
            object-fit: contain;
            flex-shrink: 0;
        }

        .home-team-nombre {
            font-size: 0.82em;
            font-weight: 600;
            color: #333;
            text-align: center;
            line-height: 1.2;
            white-space: normal;
            overflow-wrap: break-word;
            max-width: 100%;
        }

        .home-team.oviedo .home-team-nombre {
            color: #001a6e;
            font-weight: 700;
        }

        .home-match-center {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            min-width: 60px;
        }

        .home-score-vs {
            font-family: 'Oswald', sans-serif;
            font-size: 1.2em;
            font-weight: 700;
            color: #ccd6ff;
            letter-spacing: 2px;
        }

        .home-localidad-badge {
            font-size: 0.70em;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 10px;
            background: #e8eeff;
            color: #0033cc;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }

        .home-match-footer {
            margin-top: 14px;
            padding-top: 10px;
            border-top: 1px solid #f0f2fa;
            display: flex;
            justify-content: center;
        }

        .home-match-label {
            font-size: 0.75em;
            font-weight: 600;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .home-match-label i { color: #ccd6ff; }
    `;
  document.head.appendChild(homeStyles);
})();
