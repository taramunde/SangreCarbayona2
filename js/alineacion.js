/* =====================================================
   js/alineacion.js
   Pinta la página alineacion.html: marcador del partido +
   campo de fútbol con el once (o aviso de que aún no hay).
   Depende de: js/data-club.js, js/data-jugadores.js,
   js/data-temporada-actual.js, js/data-alineacion.js,
   js/clasificacion.js + js/calendario.js (para los escudos).
   ===================================================== */

(function () {
  const container = document.getElementById('alineacionContent');
  if (!container) return; // no estamos en alineacion.html

  const datos = CLUB_DATA.alineacion;
  if (!datos) return;

  const OVIEDO = CLUB_DATA.club.nombre || 'Real Oviedo';

  // ── Posiciones de cada formación, en % sobre el campo ──
  // (top/left = esquina superior-izquierda del jugador, ya centrado
  // con transform en CSS). Mismo campo para las seis formaciones.
  const FORMACIONES = {
    442: {
      nombre: '4-4-2',
      slots: {
        gk: [92, 50],
        def1: [75.5, 7.5],
        def2: [75.5, 31.7],
        def3: [75.5, 55.8],
        def4: [75.5, 80],
        mid1: [47.8, 7.5],
        mid2: [47.8, 31.7],
        mid3: [47.8, 55.8],
        mid4: [47.8, 80],
        fwd1: [22.2, 25.8],
        fwd2: [22.2, 57.5],
      },
    },
    433: {
      nombre: '4-3-3',
      slots: {
        gk: [92, 50],
        def1: [75.5, 7.5],
        def2: [75.5, 31.7],
        def3: [75.5, 55.8],
        def4: [75.5, 80],
        mid1: [47.8, 10.8],
        mid2: [47.8, 43.3],
        mid3: [47.8, 75.8],
        fwd1: [22.2, 10.8],
        fwd2: [22.2, 43.3],
        fwd3: [22.2, 75.8],
      },
    },
    343: {
      nombre: '3-4-3',
      slots: {
        gk: [92, 50],
        def1: [75.5, 20],
        def2: [75.5, 43.3],
        def3: [75.5, 66.7],
        mid1: [47.8, 7.5],
        mid2: [47.8, 31.7],
        mid3: [47.8, 55.8],
        mid4: [47.8, 80],
        fwd1: [22.2, 10.8],
        fwd2: [22.2, 43.3],
        fwd3: [22.2, 75.8],
      },
    },
    451: {
      nombre: '4-5-1',
      slots: {
        gk: [92, 50],
        def1: [75.5, 7.5],
        def2: [75.5, 31.7],
        def3: [75.5, 55.8],
        def4: [75.5, 80],
        mid1: [47.8, 7.5],
        mid2: [47.8, 31.7],
        mid3: [47.8, 55.8],
        mid4: [47.8, 80],
        mid5: [55.6, 44.2],
        fwd1: [22.2, 44.2],
      },
    },
    4141: {
      nombre: '4-1-4-1',
      slots: {
        gk: [92, 50],
        def1: [75.5, 7.5],
        def2: [75.5, 31.7],
        def3: [75.5, 55.8],
        def4: [75.5, 80],
        mid1: [60, 31.7],
        mid2: [60, 55.8],
        mid3: [46.7, 7.5],
        mid4: [46.7, 43.3],
        mid5: [46.7, 80],
        fwd1: [22.2, 44.2],
      },
    },
    4231: {
      nombre: '4-2-3-1',
      slots: {
        gk: [92, 50],
        def1: [75.5, 7.5],
        def2: [75.5, 31.7],
        def3: [75.5, 55.8],
        def4: [75.5, 80],
        mid1: [62, 31.7],
        mid2: [62, 55.8],
        mid3: [40, 15],
        mid4: [40, 50],
        mid5: [40, 85],
        fwd1: [20, 50],
      },
    },
  };

  function getEscudo(nombre) {
    return typeof window.getEscudoEquipo === 'function'
      ? window.getEscudoEquipo(nombre)
      : '';
  }

  function imgEscudo(url, alt, claseCss) {
    return url ? `<img src="${url}" alt="${alt}" class="${claseCss}">` : '';
  }

  function datosJugador(jugadorId) {
    const maestro =
      (CLUB_DATA.jugadoresMaestro && CLUB_DATA.jugadoresMaestro[jugadorId]) ||
      null;
    let dorsal = null;
    const temp =
      CLUB_DATA.temporadas &&
      CLUB_DATA.temporadas[CLUB_DATA.temporadaActualId];
    if (temp && temp.jugadores) {
      const enPlantilla = temp.jugadores.find(
        (j) => j.id === jugadorId || j.codigo === jugadorId,
      );
      if (enPlantilla) dorsal = enPlantilla.dorsal;
    }
    return {
      nombre: maestro ? maestro.apodo || maestro.nombre : jugadorId,
      imagen: maestro ? maestro.imagen : '',
      dorsal: dorsal && dorsal !== '-' ? dorsal : null,
    };
  }

  // ── 1. MARCADOR ───────────────────────────────────────
  function renderMarcador() {
    const esLocal = datos.equipoLocal === OVIEDO;
    const rival = esLocal ? datos.equipoVisitante : datos.equipoLocal;
    const escudoOviedo = getEscudo(OVIEDO);
    const escudoRival = getEscudo(rival);

    const jugado =
      datos.golesLocal !== null && datos.golesLocal !== undefined;
    const centro = jugado
      ? `<span class="ali-sb-score">${datos.golesLocal} - ${datos.golesVisitante}</span>`
      : `<span class="ali-sb-vs">VS</span>`;

    const fecha = datos.fecha ? new Date(datos.fecha + 'T00:00:00') : null;
    const lang = localStorage.getItem('lang') || 'es';
    const fechaTexto = fecha
      ? fecha.toLocaleDateString(lang, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '';

    return `
      <div class="ali-scoreboard-teams">
        <div class="ali-sb-team${datos.equipoLocal === OVIEDO ? ' es-oviedo' : ''}">
          ${imgEscudo(esLocal ? escudoOviedo : escudoRival, datos.equipoLocal, 'ali-sb-escudo')}
          <span class="ali-sb-nombre">${datos.equipoLocal}</span>
        </div>
        <div class="ali-sb-center">
          ${centro}
          <span class="ali-sb-badge">${esLocal ? t('en_casa') || 'En casa' : t('fuera') || 'Fuera'}</span>
        </div>
        <div class="ali-sb-team${datos.equipoVisitante === OVIEDO ? ' es-oviedo' : ''}">
          ${imgEscudo(esLocal ? escudoRival : escudoOviedo, datos.equipoVisitante, 'ali-sb-escudo')}
          <span class="ali-sb-nombre">${datos.equipoVisitante}</span>
        </div>
      </div>
      <div class="ali-scoreboard-info">
        <span><i class="fas fa-trophy"></i>${datos.competicion}${datos.jornada ? ' · ' + (t('jornada') || 'Jornada') + ' ' + datos.jornada : ''}</span>
        <span class="sep">·</span>
        <span><i class="fas fa-calendar-alt"></i>${fechaTexto}${datos.hora ? ' · ' + datos.hora : ''}</span>
        ${datos.estadio ? `<span class="sep">·</span><span><i class="fas fa-map-marker-alt"></i>${datos.estadio}</span>` : ''}
      </div>
    `;
  }

  // ── 2. ESTADO DEL ONCE ────────────────────────────────
  function renderEstadoTag() {
    const textos = {
      confirmada: t('once_confirmado') || 'Once confirmado',
      probable: t('once_probable') || 'Once probable',
      pendiente: t('once_pendiente') || 'Once sin confirmar',
    };
    const estado = datos.estado || 'pendiente';
    return `
      <div class="ali-estado-row">
        <span class="ali-estado-tag ${estado}"><span class="dot"></span>${textos[estado] || textos.pendiente}</span>
      </div>
    `;
  }

  // ── 3. CAMPO ──────────────────────────────────────────
  function renderCampo() {
    const formacionInfo = FORMACIONES[datos.formacion] || FORMACIONES['442'];

    const jugadoresHtml = (datos.titulares || [])
      .map((tit) => {
        const pos = formacionInfo.slots[tit.slot];
        if (!pos) return '';
        const info = datosJugador(tit.jugadorId);
        const [top, left] = pos;
        return `
          <div class="ali-player" style="top:${top}%; left:${left}%;">
            <div class="ali-player-photo-wrap">
              <img class="ali-player-photo" src="${info.imagen || ''}" alt="${info.nombre}" onerror="this.style.visibility='hidden'">
              ${info.dorsal ? `<span class="ali-player-dorsal">${info.dorsal}</span>` : ''}
            </div>
            <span class="ali-player-nombre">${info.nombre}</span>
          </div>
        `;
      })
      .join('');

    return `
      <div class="ali-field-wrap">
        <div class="ali-field-header">
          <span class="ali-field-title">${t('alineacion_titulo') || 'Alineación'}</span>
          <span class="ali-formacion-tag">${formacionInfo.nombre}</span>
        </div>
        <div class="ali-field">
          <div class="ali-field-line"></div>
          <div class="ali-field-circle"></div>
          <div class="ali-field-area top"></div>
          <div class="ali-field-area bottom"></div>
          <div class="ali-field-area-mini top"></div>
          <div class="ali-field-area-mini bottom"></div>
          ${jugadoresHtml}
        </div>
      </div>
    `;
  }

  // ── 4. BANQUILLO ──────────────────────────────────────
  function renderBanquillo() {
    if (!datos.suplentes || !datos.suplentes.length) return '';
    const itemsHtml = datos.suplentes
      .map((id) => {
        const info = datosJugador(id);
        return `
          <div class="ali-bench-player">
            <img src="${info.imagen || ''}" alt="${info.nombre}" onerror="this.style.visibility='hidden'">
            <span>${info.dorsal ? info.dorsal + '. ' : ''}${info.nombre}</span>
          </div>
        `;
      })
      .join('');
    return `
      <div class="ali-bench">
        <div class="ali-bench-title">${t('alineacion_banquillo') || 'Banquillo'}</div>
        <div class="ali-bench-list">${itemsHtml}</div>
      </div>
    `;
  }

  // ── 5. AVISO SIN ONCE ─────────────────────────────────
  function renderSinConfirmar() {
    return `
      <div class="ali-sin-confirmar">
        <i class="fas fa-user-clock"></i>
        <h3>${t('alineacion_sin_confirmar_titulo') || 'Todavía no hay once'}</h3>
        <p>${t('alineacion_sin_confirmar_texto') || 'En cuanto se confirme o se filtre una alineación probable para este partido, aparecerá aquí.'}</p>
      </div>
    `;
  }

  // ── RENDER ────────────────────────────────────────────
  function render() {
    const scoreboardEl = document.getElementById('alineacionScoreboard');
    if (scoreboardEl) scoreboardEl.innerHTML = renderMarcador();

    const hayOnce = datos.titulares && datos.titulares.length > 0;
    container.innerHTML =
      renderEstadoTag() + (hayOnce ? renderCampo() + renderBanquillo() : renderSinConfirmar());
  }

  render();
  window.renderAlineacion = render;
})();
