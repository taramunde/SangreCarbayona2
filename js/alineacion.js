/* =====================================================
   js/alineacion.js
   Pinta la página alineacion.html: marcador del partido +
   campo de fútbol con el once (o aviso de que aún no hay).
   Depende de: js/data-club.js, js/data-jugadores.js,
   js/data-temporada-actual.js, js/data-alineacion.js,
   js/data-estadios.js (para el nombre del estadio si no se pone a
   mano), js/clasificacion.js + js/calendario.js (para los escudos).
   ===================================================== */

(function () {
  const container = document.getElementById('alineacionContent');
  if (!container) return; // no estamos en alineacion.html

  const datosGuardados = CLUB_DATA.alineacion || {};
  const OVIEDO = CLUB_DATA.club.nombre || 'Real Oviedo';

  // ── Partido real (liga o Copa) ─────────────────────────
  // Siempre se coge en vivo del calendario (js/calendario.js), nunca
  // de data-alineacion.js: así, en cuanto se mete el resultado de un
  // partido y el "próximo partido" pasa a ser otro rival, esta página
  // lo refleja sola, sin tener que tocar nada aquí.
  function partidoRealActual() {
    const p =
      typeof window.getProximoPartidoGeneral === 'function'
        ? window.getProximoPartidoGeneral()
        : null;
    if (!p) return null;

    const esEspecial = !!p.competicion;
    const temp =
      CLUB_DATA.temporadas && CLUB_DATA.temporadas[CLUB_DATA.temporadaActualId];
    return {
      equipoLocal: p.equipo1,
      equipoVisitante: p.equipo2,
      competicion: esEspecial
        ? p.competicion
        : (temp && temp.competicion) || '',
      rondaOJornada: esEspecial
        ? (window.translateRonda ? translateRonda(p.ronda) : p.ronda)
        : p.jornada != null
          ? `${t('jornada') || 'Jornada'} ${p.jornada}`
          : '',
      fecha: p.fecha || '',
      hora: p.hora || '',
      golesLocal: p.goles1 ?? null,
      golesVisitante: p.goles2 ?? null,
    };
  }

  const partido = partidoRealActual();

  // ── Datos del once a usar ──────────────────────────────
  // Lo guardado en data-alineacion.js solo vale si es justo para ESTE
  // partido (mismo "paraFecha"). Si no coincide —porque ya se jugó el
  // anterior y el próximo partido ha cambiado de rival—, se ignora
  // todo lo del once y se muestra "pendiente" automáticamente.
  const esDeEstePartido =
    !!partido &&
    !!datosGuardados.paraFecha &&
    datosGuardados.paraFecha === partido.fecha;

  const datos = esDeEstePartido
    ? datosGuardados
    : {
        estado: 'pendiente',
        formacion: datosGuardados.formacion || '442',
        titulares: [],
        suplentes: [],
      };

  // ── Posiciones de cada formación, en % sobre el campo ──
  // [top, left] = CENTRO del jugador (foto + nombre), centrado con
  // transform en CSS. Las filas están repartidas de forma simétrica:
  //   2 jugadores → 35 / 65        3 → 20 / 50 / 80
  //   4 jugadores → 12.5 / 37.5 / 62.5 / 87.5    5 → 10 / 30 / 50 / 70 / 90
  // y las líneas a alturas fijas (de arriba abajo): delantera, media
  // punta, medio, pivote, defensa y portero.
  const FILA = { fwd: 15, am: 34, mid: 43, dm: 54, def: 71, gk: 88 };
  const X2 = [35, 65];
  const X3 = [20, 50, 80];
  const X4 = [12.5, 37.5, 62.5, 87.5];
  const X5 = [10, 30, 50, 70, 90];
  const DEF4 = {
    def1: [FILA.def, X4[0]],
    def2: [FILA.def, X4[1]],
    def3: [FILA.def, X4[2]],
    def4: [FILA.def, X4[3]],
  };
  const FORMACIONES = {
    442: {
      nombre: '4-4-2',
      slots: {
        gk: [FILA.gk, 50],
        ...DEF4,
        mid1: [FILA.mid, X4[0]],
        mid2: [FILA.mid, X4[1]],
        mid3: [FILA.mid, X4[2]],
        mid4: [FILA.mid, X4[3]],
        fwd1: [FILA.fwd, X2[0]],
        fwd2: [FILA.fwd, X2[1]],
      },
    },
    433: {
      nombre: '4-3-3',
      slots: {
        gk: [FILA.gk, 50],
        ...DEF4,
        mid1: [FILA.mid, X3[0]],
        mid2: [FILA.mid, X3[1]],
        mid3: [FILA.mid, X3[2]],
        fwd1: [FILA.fwd, X3[0]],
        fwd2: [FILA.fwd, X3[1]],
        fwd3: [FILA.fwd, X3[2]],
      },
    },
    343: {
      nombre: '3-4-3',
      slots: {
        gk: [FILA.gk, 50],
        def1: [FILA.def, X3[0]],
        def2: [FILA.def, X3[1]],
        def3: [FILA.def, X3[2]],
        mid1: [FILA.mid, X4[0]],
        mid2: [FILA.mid, X4[1]],
        mid3: [FILA.mid, X4[2]],
        mid4: [FILA.mid, X4[3]],
        fwd1: [FILA.fwd, X3[0]],
        fwd2: [FILA.fwd, X3[1]],
        fwd3: [FILA.fwd, X3[2]],
      },
    },
    451: {
      nombre: '4-5-1',
      slots: {
        gk: [FILA.gk, 50],
        ...DEF4,
        mid1: [FILA.mid, X5[0]],
        mid2: [FILA.mid, X5[1]],
        mid3: [FILA.mid, X5[2]],
        mid4: [FILA.mid, X5[3]],
        mid5: [FILA.mid, X5[4]],
        fwd1: [FILA.fwd, 50],
      },
    },
    4141: {
      nombre: '4-1-4-1',
      slots: {
        gk: [FILA.gk, 50],
        ...DEF4,
        mid1: [FILA.dm, 50],
        mid2: [FILA.am, X4[0]],
        mid3: [FILA.am, X4[1]],
        mid4: [FILA.am, X4[2]],
        mid5: [FILA.am, X4[3]],
        fwd1: [FILA.fwd, 50],
      },
    },
    4231: {
      nombre: '4-2-3-1',
      slots: {
        gk: [FILA.gk, 50],
        ...DEF4,
        mid1: [FILA.dm, X2[0]],
        mid2: [FILA.dm, X2[1]],
        mid3: [FILA.am, X3[0]],
        mid4: [FILA.am, X3[1]],
        mid5: [FILA.am, X3[2]],
        fwd1: [FILA.fwd, 50],
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

  // Siempre se busca el del equipo que juega como local en
  // CLUB_DATA.estadios (js/data-estadios.js, la misma lista que usa
  // la sección "Cómo llegar") — no hay que escribirlo a mano.
  function getEstadio(nombreEquipoLocal) {
    if (!Array.isArray(CLUB_DATA.estadios)) return '';
    const club = CLUB_DATA.estadios.find((e) => e.equipo === nombreEquipoLocal);
    return club ? club.estadio : '';
  }

  function datosJugador(jugadorId) {
    const maestro =
      (CLUB_DATA.jugadoresMaestro && CLUB_DATA.jugadoresMaestro[jugadorId]) ||
      null;
    let dorsal = null;
    const temp =
      CLUB_DATA.temporadas && CLUB_DATA.temporadas[CLUB_DATA.temporadaActualId];
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
    if (!partido) {
      return `<p class="ali-sb-sin-partido">${t('no_proximo_partido') || 'No hay próximos partidos.'}</p>`;
    }

    const esLocal = partido.equipoLocal === OVIEDO;
    const rival = esLocal ? partido.equipoVisitante : partido.equipoLocal;
    const escudoOviedo = getEscudo(OVIEDO);
    const escudoRival = getEscudo(rival);
    const estadio = getEstadio(partido.equipoLocal);

    const jugado =
      partido.golesLocal !== null && partido.golesLocal !== undefined;
    const centro = jugado
      ? `<span class="ali-sb-score">${partido.golesLocal} - ${partido.golesVisitante}</span>`
      : `<span class="ali-sb-vs">VS</span>`;

    const fecha = partido.fecha ? new Date(partido.fecha + 'T00:00:00') : null;
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
        <div class="ali-sb-team${partido.equipoLocal === OVIEDO ? ' es-oviedo' : ''}">
          ${imgEscudo(esLocal ? escudoOviedo : escudoRival, partido.equipoLocal, 'ali-sb-escudo')}
          <span class="ali-sb-nombre">${partido.equipoLocal}</span>
        </div>
        <div class="ali-sb-center">
          ${centro}
          <span class="ali-sb-badge">${esLocal ? t('en_casa') || 'En casa' : t('fuera') || 'Fuera'}</span>
        </div>
        <div class="ali-sb-team${partido.equipoVisitante === OVIEDO ? ' es-oviedo' : ''}">
          ${imgEscudo(esLocal ? escudoRival : escudoOviedo, partido.equipoVisitante, 'ali-sb-escudo')}
          <span class="ali-sb-nombre">${partido.equipoVisitante}</span>
        </div>
      </div>
      <div class="ali-scoreboard-info">
        <span><i class="fas fa-trophy"></i>${partido.competicion}${partido.rondaOJornada ? ' · ' + partido.rondaOJornada : ''}</span>
        <span class="sep">·</span>
        <span><i class="fas fa-calendar-alt"></i>${fechaTexto}${partido.hora ? ' · ' + partido.hora : ''}</span>
        ${estadio ? `<span class="sep">·</span><span><i class="fas fa-map-marker-alt"></i>${estadio}</span>` : ''}
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

    // Ancho de cada jugador según cuántos haya en su fila: así el nombre
    // tiene todo el sitio posible sin pisar al de al lado.
    const porFila = {};
    (datos.titulares || []).forEach((tit) => {
      const pos = formacionInfo.slots[tit.slot];
      if (pos) porFila[pos[0]] = (porFila[pos[0]] || 0) + 1;
    });
    const anchoFila = (n) => (n >= 5 ? 19 : n === 4 ? 24 : 28);

    const jugadoresHtml = (datos.titulares || [])
      .map((tit) => {
        const pos = formacionInfo.slots[tit.slot];
        if (!pos) return '';
        const info = datosJugador(tit.jugadorId);
        const [top, left] = pos;
        return `
          <div class="ali-player" style="top:${top}%; left:${left}%; width:${anchoFila(porFila[top])}%;">
            <div class="ali-player-photo-wrap">
              <img class="ali-player-photo" src="${info.imagen || ''}" alt="${info.nombre}" onerror="this.style.visibility='hidden'">
              ${info.dorsal ? `<span class="ali-player-dorsal">${info.dorsal}</span>` : ''}
              ${tit.capitan ? `<span class="ali-player-capitan" title="Capitán">C</span>` : ''}
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

    if (!partido) {
      container.innerHTML = '';
      return;
    }

    const hayOnce = datos.titulares && datos.titulares.length > 0;
    container.innerHTML =
      renderEstadoTag() +
      (hayOnce ? renderCampo() + renderBanquillo() : renderSinConfirmar());
  }

  render();
  window.renderAlineacion = render;
})();
