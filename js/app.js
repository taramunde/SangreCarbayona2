/* ===================================
   FUNCIONES DE UTILIDAD (FECHAS)
   =================================== */

function formatearFecha(fechaStr) {
  let fecha;
  if (fechaStr.includes('T')) {
    fecha = new Date(fechaStr);
  } else {
    const parts = fechaStr.split('-');
    fecha = new Date(parts[0], parts[1] - 1, parts[2]);
  }

  const lang = localStorage.getItem('lang') || 'es';

  const mesNombre = fecha.toLocaleDateString(lang, { month: 'long' });
  const mesCorto = fecha.toLocaleDateString(lang, { month: 'short' });
  let completa = fecha.toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return {
    dia: fecha.getDate(),
    mes: capitalizar(mesNombre),
    mesCorto: capitalizar(mesCorto).replace('.', ''),
    año: fecha.getFullYear(),
    completa: completa,
  };
}

/* ===================================
   FUNCIÓN HELPER: RESOLVER RUTAS DE IMAGEN
   Convierte rutas relativas (img/jugadores/Aaron.webp) en absolutas
   para que funcionen correctamente tanto desde la raíz como desde
   subcarpetas como /fichas/.
   =================================== */

function resolverRutaImagen(imagen) {
  if (!imagen) return '';
  let encoded = encodeURI(imagen)
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/'/g, '%27');
  if (encoded.startsWith('http')) return encoded;

  const baseUrl = window.location.href
    .split('/fichas/')[0]
    .split('/ficha-jugador')[0]
    .replace(/\/$/, '');

  encoded = encoded.replace(/^\/+/, '');
  return `${baseUrl}/${encoded}`;
}

/* ===================================
   HELPER: NORMALIZAR ESTADOS DEL JUGADOR
   Compatibilidad entre formato antiguo (estado + cedidoEn)
   y nuevo formato (estados: [{tipo, club}])
   =================================== */
function normalizarEstados(jugador) {
  if (jugador.estados && Array.isArray(jugador.estados)) {
    return jugador.estados;
  }
  if (jugador.estado) {
    return [{ tipo: jugador.estado, club: jugador.cedidoEn || null }];
  }
  return [];
}

/* ===================================
   FUNCIONES AUXILIARES PARA PORTEROS
   =================================== */

function esPortero(jugador) {
  return jugador.posicion === 'Portero' || jugador.posicionCorta === 'POR';
}

function getCategoriaJugador(jugador) {
  const pos = jugador.posicion;
  const group = getPositionGroup(pos);
  if (group) return t(group.key);
  return translatePosition(pos);
}

/* ===================================
   FUNCIONES DE TRADUCCIÓN GEOGRÁFICA
   =================================== */

function translateCountry(country) {
  if (!country) return country;
  const normalized = country
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s/g, '');
  return (
    window.geoTranslations?.countries?.[window.currentLang || 'es']?.[
      normalized
    ] || country
  );
}

function translateCity(city) {
  if (!city) return city;
  const normalized = city
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return (
    window.geoTranslations?.cities?.[window.currentLang || 'es']?.[
      normalized
    ] || city
  );
}

function translateProvince(province) {
  if (!province) return province;
  const normalized = province
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
  return (
    window.geoTranslations?.provinces?.[window.currentLang || 'es']?.[
      normalized
    ] || province
  );
}

function translateNationality(nationality) {
  if (!nationality) return nationality;

  // Si es array, traducir cada elemento
  if (Array.isArray(nationality)) {
    return nationality.map((n) => translateNationalitySingle(n)).join(', ');
  }

  // Si es string, traducir directamente
  return translateNationalitySingle(nationality);
}

// Función auxiliar para traducir una sola nacionalidad
function translateNationalitySingle(nationality) {
  const normalized = nationality
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return (
    window.geoTranslations?.nationalities?.[window.currentLang || 'es']?.[
      normalized
    ] || nationality
  );
}

/* ===================================
   HELPER: AUTOCÁLCULO DE ESTADÍSTICAS
   =================================== */
function autoCalcularStatsJugador(jugador) {
  // 1. SIEMPRE reseteamos a cero para evitar que se sumen varias veces
  jugador.stats = {
    partidos: 0,
    goles: 0,
    asistencias: 0,
    minutos: 0,
    amarillas: 0,
    rojas: 0,
    desglose: {},
  };

  // 2. Solo si tiene partidos en la lista, hacemos la suma real
  if (jugador.partidos && jugador.partidos.length > 0) {
    let totalPJ = 0,
      totalGoles = 0,
      totalAsistencias = 0,
      totalMinutos = 0,
      totalAmarillas = 0,
      totalRojas = 0;

    jugador.partidos.forEach((partido) => {
      const comp = partido.competicion || 'Otros';
      if (!jugador.stats.desglose[comp]) {
        jugador.stats.desglose[comp] = {
          partidos: 0,
          goles: 0,
          asistencias: 0,
          minutos: 0,
          amarillas: 0,
          rojas: 0,
        };
      }

      // Sumamos al desglose
      jugador.stats.desglose[comp].partidos++;

      // Aquí está la corrección: leemos directamente partido.goles para todos
      if (partido.goles !== undefined && partido.goles !== null) {
        jugador.stats.desglose[comp].goles += parseInt(partido.goles) || 0;
        totalGoles += parseInt(partido.goles) || 0;
      }

      if (partido.asistencias !== undefined && partido.asistencias !== null) {
        jugador.stats.desglose[comp].asistencias +=
          parseInt(partido.asistencias) || 0;
        totalAsistencias += parseInt(partido.asistencias) || 0;
      }
      if (partido.minutos !== undefined && partido.minutos !== null) {
        jugador.stats.desglose[comp].minutos += parseInt(partido.minutos) || 0;
        totalMinutos += parseInt(partido.minutos) || 0;
      }
      if (partido.amarilla === true) {
        jugador.stats.desglose[comp].amarillas += 1;
        totalAmarillas += 1;
      }
      if (partido.roja === true) {
        jugador.stats.desglose[comp].rojas += 1;
        totalRojas += 1;
      }
      totalPJ++;
    });

    // Sobrescribir totales en la ficha
    jugador.stats.partidos = totalPJ;
    jugador.stats.goles = totalGoles;
    jugador.stats.asistencias = totalAsistencias;
    jugador.stats.minutos = totalMinutos;
    jugador.stats.amarillas = totalAmarillas;
    jugador.stats.rojas = totalRojas;
  }
}

const App = {
  temporadaActiva: null,

  _getHeaderImgPosition: function (seasonId) {
    const temp = CLUB_DATA.temporadasDisponibles.find((t) => t.id === seasonId);
    return temp && temp.fotoPosition ? temp.fotoPosition : 'center 20%';
  },

  init: function () {
    // Leer temporada de la URL si existe (para URLs compartidas como ?season=2024-25)
    const _urlParams = new URLSearchParams(window.location.search);
    const _seasonFromUrl = _urlParams.get('season');
    const _seasonValida =
      _seasonFromUrl &&
      CLUB_DATA.temporadasDisponibles.some((t) => t.id === _seasonFromUrl);
    this.temporadaActiva = _seasonValida
      ? _seasonFromUrl
      : CLUB_DATA.temporadaActual;

    // Imagen de cabecera: apuntar a la temporada que toca desde el primer momento
    const _headerImg = document.getElementById('pageHeaderImg');
    if (_headerImg) {
      _headerImg.src = `img/temporadas/${this.temporadaActiva}.webp`;
      _headerImg.alt = `Temporada ${this.temporadaActiva}`;
      _headerImg.style.objectPosition = this._getHeaderImgPosition(
        this.temporadaActiva,
      );
    }

    // Detectar qué filtro está activo en el HTML al cargar   ← esta línea ya existía
    const activeTab = document.querySelector('.position-tabs .tab-btn.active');
    const initialFilter = activeTab ? activeTab.dataset.position : 'all';

    // Funciones de renderizado
    this.renderCalendario();
    this.renderPlantillaHome(initialFilter); // ← Usar el filtro del botón activo
    this.renderNoticias();
    this.renderPatrocinadores();
    this.renderProximoPartido();
    this.renderSeasonSelector();
    this.renderSubtituloTemporada();
    this.renderEstadisticasEquipo();
    this.renderPlantillaCompleta();
    this.renderCuerpoTecnico();
    this.renderFichaJugador();
    this.renderJuegos();
    this.renderVideos();

    // Listeners de eventos
    this.setupHomeFilters();
  },

  setupHomeFilters: function () {
    const tabs = document.querySelectorAll('.position-tabs .tab-btn');
    if (!tabs.length) return;

    tabs.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        tabs.forEach((b) => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const position = e.currentTarget.dataset.position;
        this.filtroHomeActivo = position;
        this.renderPlantillaHome(position);
      });
    });
  },

  renderSeasonSelector: function () {
    const container = document.getElementById('seasonSelector');
    if (!container) return;
    let html = '<div class="season-tabs">';
    CLUB_DATA.temporadasDisponibles.forEach((temp) => {
      const activeClass = temp.id === this.temporadaActiva ? 'active' : '';
      const currentBadge = temp.actual
        ? '<span class="current-badge">' + t('current_badge') + '</span>'
        : '';
      html += `<button class="season-tab ${activeClass}" data-season="${temp.id}">${temp.nombre} ${currentBadge}</button>`;
    });
    html += '</div>';
    container.innerHTML = html;
    container.querySelectorAll('.season-tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        this.changeSeason(e.currentTarget.dataset.season);
      });
    });
  },

  changeSeason: function (seasonId) {
    this.temporadaActiva = seasonId;

    // Actualizar URL para que se pueda compartir
    if (document.getElementById('seasonSelector')) {
      const url = new URL(window.location);
      if (seasonId === CLUB_DATA.temporadaActual) {
        url.searchParams.delete('season'); // temporada actual → URL limpia
      } else {
        url.searchParams.set('season', seasonId);
      }
      history.pushState({ season: seasonId }, '', url);
    }

    // Actualizar imagen de cabecera al cambiar de temporada
    const headerImg = document.getElementById('pageHeaderImg');
    if (headerImg) {
      headerImg.style.display = '';
      headerImg.src = `img/temporadas/${seasonId}.webp`;
      headerImg.alt = `Temporada ${seasonId}`;
      headerImg.style.objectPosition = this._getHeaderImgPosition(seasonId);
    }

    document.querySelectorAll('.season-tab').forEach((tab) => {
      // ← esta línea ya existía
      tab.classList.toggle('active', tab.dataset.season === seasonId);
    });
    this.renderSubtituloTemporada();
    this.renderEstadisticasEquipo();
    this.renderPlantillaCompleta();
    this.renderCuerpoTecnico();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderSubtituloTemporada: function () {
    const subtitle = document.querySelector('.page-subtitle');
    if (!subtitle) return;
    const temporada = getTemporada(this.temporadaActiva);
    if (!temporada) return;
    const tempData = CLUB_DATA.temporadasDisponibles.find(
      (t) => t.id === this.temporadaActiva,
    );
    const nombreTemp = tempData
      ? tempData.nombre
      : this.temporadaActiva.replace('-', '/');
    const competicion = temporada.competicion || '';
    const grupo =
      temporada.grupo && temporada.grupo !== 'null'
        ? ' · ' + temporada.grupo
        : '';
    subtitle.innerHTML =
      '<span data-i18n="equipo_subtitulo">' +
      (t('equipo_subtitulo') || 'Temporada') +
      '</span> ' +
      nombreTemp +
      ' — ' +
      competicion +
      grupo;
  },

  renderCalendario: function () {
    const container = document.getElementById('calendarioList');
    if (!container) return;
    let html = '';
    CLUB_DATA.calendario.forEach((partido) => {
      const fecha = formatearFecha(partido.fecha);
      html += `<div class="match-item ${partido.esProximo ? 'next' : ''}"><div class="match-date-box"><span class="day">${fecha.dia}</span><span class="month">${fecha.mesCorto}</span></div><div class="match-detail"><div class="teams"><span class="home-team">${partido.local}</span><span class="vs">-</span><span class="away-team">${partido.visitante}</span></div><div class="match-meta"><span><i class="far fa-clock"></i> ${partido.hora}</span><span><i class="fas fa-map-marker-alt"></i> ${partido.estadio}</span></div></div></div>`;
    });
    container.innerHTML = html;
  },

  renderPlantillaHome: function (filter = 'all') {
    const container = document.getElementById('plantillaHomeGrid');
    if (!container) return;
    const temporada = getTemporada(CLUB_DATA.temporadaActual);

    // FUSIONAR con datos del maestro
    const jugadoresCompletos = temporada.jugadores
      .map((j) => getJugadorById(j.codigo || j.id, CLUB_DATA.temporadaActual))
      .filter((j) => j !== null);

    // Usa POSITION_GROUPS definido en data.js (centralizado)
    let playersToRender = jugadoresCompletos;
    if (filter !== 'all') {
      const group = POSITION_GROUPS[filter];
      const validPositions = group ? group.positions : [];
      playersToRender = jugadoresCompletos.filter((j) =>
        validPositions.includes(j.posicion),
      );
    }

    let html = '';
    playersToRender.slice(0, 50).forEach((jugador) => {
      html += this.renderJugadorCard(jugador);
    });

    if (playersToRender.length === 0) {
      html =
        '<p style="grid-column: 1/-1; text-align:center; opacity: 0.7;">No hay jugadores en esta categoría.</p>';
    }
    container.innerHTML = html;
  },

  renderNoticias: function () {
    const container = document.getElementById('noticiasGrid');
    if (!container) return;

    // Usar NOTICIAS_DATA de noticias.js (primera noticia = destacada)
    if (typeof NOTICIAS_DATA === 'undefined' || NOTICIAS_DATA.length === 0) {
      container.innerHTML =
        '<p style="text-align:center; padding:20px;">No hay noticias disponibles.</p>';
      return;
    }

    const noticia = NOTICIAS_DATA[0]; // La Voz de Asturias (primera)
    const medio = MEDIOS_CONFIG[noticia.medio] || {
      nombre: noticia.medio,
      logo: '',
      color: '#333',
    };

    container.innerHTML = `
        <div class="home-news-featured-wrap">
            <article class="home-news-featured-card">
                <div class="home-news-featured-img">
                    ${
                      noticia.imagen
                        ? `<img src="${noticia.imagen}" alt="${noticia.titulo}" loading="eager" onerror="this.src='https://i.postimg.cc/8PjPkJHc/Real-Oviedo-Joya.png'">`
                        : `<img src="https://i.postimg.cc/8PjPkJHc/Real-Oviedo-Joya.png" alt="Real Oviedo">`
                    }
                    <div class="home-news-source">
                        ${medio.logo ? `<img src="${medio.logo}" alt="${medio.nombre}" onerror="this.style.display='none'">` : ''}
                        <span>${medio.nombre}</span>
                    </div>
                </div>
                <div class="home-news-featured-body">
                    <p class="home-news-date"><i class="far fa-calendar-alt"></i> ${noticia.fecha}</p>
                    <h3 class="home-news-featured-title">${noticia.titulo}</h3>
                    ${noticia.descripcion ? `<p class="home-news-featured-desc">${noticia.descripcion}</p>` : ''}
                    <a class="home-news-link" href="${noticia.url}" target="_blank" rel="noopener noreferrer">
                        ${t('leer_noticia')} <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </article>
        </div>
    `;
  },

  renderPatrocinadores: function () {
    const container = document.getElementById('patrocinadoresGrid');
    if (!container) return;
    container.innerHTML = CLUB_DATA.patrocinadores
      .map(
        (pat) =>
          `<div class="sponsor-item"><div class="sponsor-logo"><span>${pat.nombre}</span></div></div>`,
      )
      .join('');
  },

  renderProximoPartido: function () {
    const container = document.getElementById('heroMatch');
    if (!container) return;

    // Usar datos de clasificacion.js
    const partidos = window.enfrentamientos || [];
    const equipos = window.equipos || [];

    const OVIEDO = 'Real Oviedo';
    const partidosOviedo = partidos
      .map((p, idx) => ({
        ...p,
        jornada: p.jornada ?? Math.floor(idx / 11) + 1,
        jugado: p.goles1 !== null && p.goles2 !== null,
      }))
      .filter((p) => p.equipo1 === OVIEDO || p.equipo2 === OVIEDO);

    const jugados = partidosOviedo.filter((p) => p.jugado);
    const ultimo = jugados.length > 0 ? jugados[jugados.length - 1] : null;
    const proximo = partidosOviedo.find((p) => !p.jugado) || null;

    const getEscudo = (nombre) => {
      const eq = equipos.find((e) => e.nombre === nombre);
      return eq ? eq.escudo : '';
    };

    const getResultadoData = (p) => {
      const esLocal = p.equipo1 === OVIEDO;
      const golesO = esLocal ? p.goles1 : p.goles2;
      const golesR = esLocal ? p.goles2 : p.goles1;
      if (golesO > golesR)
        return {
          tipo: 'victoria',
          texto: t('victoria'),
          icono: 'fa-check-circle',
          color: 'win',
        };
      if (golesO < golesR)
        return {
          tipo: 'derrota',
          texto: t('derrota'),
          icono: 'fa-times-circle',
          color: 'lose',
        };
      return {
        tipo: 'empate',
        texto: t('empate'),
        icono: 'fa-minus-circle',
        color: '',
      };
    };

    let html = '';

    // === ÚLTIMO PARTIDO ===
    if (ultimo) {
      const esLocal = ultimo.equipo1 === OVIEDO;
      const rival = esLocal ? ultimo.equipo2 : ultimo.equipo1;
      const resultado = getResultadoData(ultimo);
      const escudoO = getEscudo(OVIEDO);
      const escudoR = getEscudo(rival);
      const fechaStr = `${t('jornada_abrev')}${ultimo.jornada}`;

      // Para el último partido: equipo1 (local) a la izquierda, equipo2 (visitante) a la derecha
      const escudoIzq = ultimo.goles1 !== null ? getEscudo(ultimo.equipo1) : '';
      const escudoDer = ultimo.goles2 !== null ? getEscudo(ultimo.equipo2) : '';
      const equipoIzq = ultimo.equipo1;
      const equipoDer = ultimo.equipo2;

      html += `
        <div class="hero-block">
            <div class="hero-label-row">
                <span class="hero-comp-badge"><i class="fas fa-futbol"></i> LaLiga EA Sports</span>
                <span class="hero-jornada-badge">${fechaStr}</span>
            </div>
            <div class="hero-scoreboard">
                <div class="hero-team">
                    <img src="${escudoIzq}" alt="${equipoIzq}" class="hero-escudo ${equipoIzq === OVIEDO ? 'hero-escudo--oviedo' : ''}">
                    <span class="hero-team-name ${equipoIzq === OVIEDO ? 'hero-team-name--oviedo' : ''}">${equipoIzq}</span>
                    <span class="hero-team-tag">${t('local')}</span>
                </div>
                <div class="hero-score-center">
                    <div class="hero-score-box">
                        <span class="hero-score hero-score--${resultado.color}">${ultimo.goles1}</span>
                        <span class="hero-score-sep">–</span>
                        <span class="hero-score hero-score--${resultado.color}">${ultimo.goles2}</span>
                    </div>
                    <span class="hero-status hero-status--final">${t('finalizado')}</span>
                </div>
                <div class="hero-team">
                    <img src="${escudoDer}" alt="${equipoDer}" class="hero-escudo ${equipoDer === OVIEDO ? 'hero-escudo--oviedo' : ''}">
                    <span class="hero-team-name ${equipoDer === OVIEDO ? 'hero-team-name--oviedo' : ''}">${equipoDer}</span>
                    <span class="hero-team-tag">${t('visitante')}</span>
                </div>
            </div>
            <div class="hero-badge-result hero-badge--${resultado.tipo}">
                <i class="fas ${resultado.icono}"></i> ${resultado.texto}
            </div>
        </div>`;
    }

    if (ultimo && proximo) {
      html += '<div class="hero-divider"></div>';
    }

    // === PRÓXIMO PARTIDO ===
    if (proximo) {
      const esLocal = proximo.equipo1 === OVIEDO;
      const rival = esLocal ? proximo.equipo2 : proximo.equipo1;
      const escudoO = getEscudo(OVIEDO);
      const escudoR = getEscudo(rival);

      // CORRECCIÓN: equipo1 siempre es local (izquierda), equipo2 siempre es visitante (derecha)
      const escudoIzq = getEscudo(proximo.equipo1);
      const escudoDer = getEscudo(proximo.equipo2);
      const equipoIzq = proximo.equipo1;
      const equipoDer = proximo.equipo2;

      const fechaStr = `${t('jornada_abrev')}${proximo.jornada}`;

      html += `
        <div class="hero-block">
            <div class="hero-label-row">
                <span class="hero-comp-badge"><i class="fas fa-futbol"></i> LaLiga EA Sports</span>
                <span class="hero-jornada-badge">${fechaStr}</span>
            </div>
            <div class="hero-scoreboard">
                <div class="hero-team">
                    <img src="${escudoIzq}" alt="${equipoIzq}" class="hero-escudo ${equipoIzq === OVIEDO ? 'hero-escudo--oviedo' : ''}">
                    <span class="hero-team-name ${equipoIzq === OVIEDO ? 'hero-team-name--oviedo' : ''}">${equipoIzq}</span>
                    <span class="hero-team-tag">${t('local')}</span>
                </div>
                <div class="hero-score-center">
                    <div class="hero-score-box hero-score-box--upcoming">
                        <span class="hero-vs">VS</span>
                    </div>
                    <span class="hero-status hero-status--upcoming">
                        <i class="fas fa-clock"></i> ${t('por_disputar')}
                    </span>
                </div>
                <div class="hero-team">
                    <img src="${escudoDer}" alt="${equipoDer}" class="hero-escudo ${equipoDer === OVIEDO ? 'hero-escudo--oviedo' : ''}">
                    <span class="hero-team-name ${equipoDer === OVIEDO ? 'hero-team-name--oviedo' : ''}">${equipoDer}</span>
                    <span class="hero-team-tag">${t('visitante')}</span>
                </div>
            </div>
            <div class="hero-badge-result hero-badge--proximo">
                <i class="fas fa-calendar-alt"></i> ${t('proximo_partido_label')} · ${esLocal ? t('en_casa') : t('fuera')}
            </div>
        </div>`;
    }

    container.innerHTML = html;

    // === INYECTAR ESTILOS CSS (crítico para el tamaño correcto) ===
    if (!document.getElementById('heroMatchStyles')) {
      const s = document.createElement('style');
      s.id = 'heroMatchStyles';
      s.textContent = `
            #heroMatch { display: flex; align-items: stretch; justify-content: center; flex-wrap: wrap; gap: 0; }
            .hero-block { flex: 1; min-width: 260px; max-width: 460px; display: flex; flex-direction: column; gap: 14px; padding: 28px 20px 20px; }
            .hero-divider { width: 1px; background: rgba(255,255,255,0.12); margin: 24px 0; flex-shrink: 0; }
            .hero-label-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
            .hero-comp-badge { font-size: .7em; font-weight: 700; color: #ffcc00; text-transform: uppercase; letter-spacing: .5px; display: flex; align-items: center; gap: 5px; }
            .hero-jornada-badge { font-size: .68em; font-weight: 600; color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: .4px; }
            .hero-scoreboard { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
            .hero-team { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; min-width: 0; }
            .hero-escudo { width: 54px; height: 54px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,.5)); }
            .hero-escudo--oviedo { filter: drop-shadow(0 0 10px rgba(255,204,0,.4)); }
            .hero-team-name { font-family: 'Oswald',sans-serif; font-size: .8em; font-weight: 600; color: rgba(255,255,255,.8); text-align: center; text-transform: uppercase; letter-spacing: .3px; line-height: 1.2; }
            .hero-team-name--oviedo { color: #ffcc00; }
            .hero-team-tag { font-size: .6em; color: rgba(255,255,255,.35); text-transform: uppercase; letter-spacing: .5px; font-weight: 600; }
            .hero-score-center { display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; }
            .hero-score-box { display: flex; align-items: center; gap: 2px; background: rgba(0,0,0,.35); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: 10px 18px; }
            .hero-score-box--upcoming { background: rgba(255,204,0,.08); border-color: rgba(255,204,0,.2); padding: 12px 22px; }
            .hero-score { font-family: 'Oswald',sans-serif; font-size: 2em; font-weight: 700; color: white; line-height: 1; min-width: 26px; text-align: center; }
            .hero-score--win { color: #69f0ae; }
            .hero-score--lose { color: #ff6e6e; }
            .hero-score-sep { font-family: 'Oswald',sans-serif; font-size: 1.4em; color: rgba(255,255,255,.25); margin: 0 5px; }
            .hero-vs { font-family: 'Oswald',sans-serif; font-size: 1.6em; font-weight: 700; color: rgba(255,204,0,.65); letter-spacing: 3px; }
            .hero-status { font-size: .68em; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
            .hero-status--final { color: rgba(255,255,255,.4); }
            .hero-status--upcoming { color: rgba(255,204,0,.75); display: flex; align-items: center; gap: 5px; text-align: center; }
            .hero-badge-result { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: .7em; font-weight: 700; padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: .4px; align-self: center; }
            .hero-badge--victoria { background: rgba(105,240,174,.15); color: #69f0ae; border: 1px solid rgba(105,240,174,.3); }
            .hero-badge--derrota { background: rgba(255,110,110,.15); color: #ff6e6e; border: 1px solid rgba(255,110,110,.3); }
            .hero-badge--empate { background: rgba(255,255,255,.1); color: rgba(255,255,255,.6); border: 1px solid rgba(255,255,255,.2); }
            .hero-badge--proximo { background: rgba(255,204,0,.15); color: #ffcc00; border: 1px solid rgba(255,204,0,.3); }
            
            @media(max-width:640px) {
                .hero-block { padding: 18px 12px 14px; min-width: 100%; }
                .hero-divider { width: 100%; height: 1px; margin: 0; }
                .hero-escudo { width: 42px; height: 42px; }
                .hero-score { font-size: 1.6em; }
                .hero-team-name { font-size: .72em; }
            }
        `;
      document.head.appendChild(s);
    }
  },

  renderEstadisticasEquipo: function () {
    const container = document.getElementById('teamStatsGrid');
    if (!container) return;

    const temporada = getTemporada(this.temporadaActiva);
    const statsData = temporada.estadisticasEquipo;

    // Detectar si hay desglose por competición
    const tieneDesglose =
      statsData &&
      statsData.desglose &&
      Object.keys(statsData.desglose).length > 0;

    if (!tieneDesglose) {
      // Compatibilidad con formato antiguo (objeto plano)
      const s = statsData || {};
      container.innerHTML = `
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-trophy"></i></div><div class="stat-number">${s.posicion != null ? s.posicion + 'º' : '—'}</div><div class="stat-label">${t('posicion')}</div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-futbol"></i></div><div class="stat-number">${s.golesFavor ?? '—'}</div><div class="stat-label">${t('goles_favor')}</div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-shield-alt"></i></div><div class="stat-number">${s.golesContra ?? '—'}</div><div class="stat-label">${t('goles_contra')}</div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-check-circle"></i></div><div class="stat-number">${s.victorias ?? '—'}</div><div class="stat-label">${t('victorias')}</div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-handshake"></i></div><div class="stat-number">${s.empates ?? '—'}</div><div class="stat-label">${t('empates')}</div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-times-circle"></i></div><div class="stat-number">${s.derrotas ?? '—'}</div><div class="stat-label">${t('derrotas')}</div></div>`;
      return;
    }

    // ── Formato nuevo: desglose por competición ───────────────
    const competiciones = Object.keys(statsData.desglose);

    function getCompMeta(nombre) {
      const n = (nombre || '').toLowerCase();
      if (n.includes('copa')) return { icon: 'fa-crown', color: '#c9a227' };
      if (n.includes('champions')) return { icon: 'fa-star', color: '#4FC3F7' };
      if (n.includes('europa'))
        return { icon: 'fa-globe-europe', color: '#66BB6A' };
      if (n.includes('conference'))
        return { icon: 'fa-globe', color: '#26C6DA' };

      // NUEVOS ICONOS PARA FASES ESPECIALES
      if (
        n.includes('ascenso') ||
        n.includes('play-off') ||
        n.includes('promoción')
      ) {
        return { icon: 'fa-level-up-alt', color: '#e67e22' }; // Naranja con flecha arriba
      }
      if (n.includes('descenso')) {
        return { icon: 'fa-level-down-alt', color: '#e74c3c' }; // Rojo con flecha abajo
      }

      return { icon: 'fa-shield-alt', color: '#5C9BF5' };
    }

    function calcularTotales(desglose, compsActivas) {
      const tot = {
        partidos: 0,
        victorias: 0,
        empates: 0,
        derrotas: 0,
        golesFavor: 0,
        golesContra: 0,
      };
      compsActivas.forEach((nombre) => {
        const s = desglose[nombre];
        if (!s) return;
        tot.partidos += s.partidos || 0;
        tot.victorias += s.victorias || 0;
        tot.empates += s.empates || 0;
        tot.derrotas += s.derrotas || 0;
        tot.golesFavor += s.golesFavor || 0;
        tot.golesContra += s.golesContra || 0;
      });
      return tot;
    }

    function renderCards(s, posicion) {
      const posCard =
        posicion != null
          ? `<div class="stat-card"><div class="stat-icon"><i class="fas fa-trophy"></i></div><div class="stat-number">${posicion}º</div><div class="stat-label">${t('posicion')}</div></div>`
          : '';
      return `
        ${posCard}
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-futbol"></i></div><div class="stat-number">${s.golesFavor}</div><div class="stat-label">${t('goles_favor')}</div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-shield-alt"></i></div><div class="stat-number">${s.golesContra}</div><div class="stat-label">${t('goles_contra')}</div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-check-circle"></i></div><div class="stat-number">${s.victorias}</div><div class="stat-label">${t('victorias')}</div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-handshake"></i></div><div class="stat-number">${s.empates}</div><div class="stat-label">${t('empates')}</div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-times-circle"></i></div><div class="stat-number">${s.derrotas}</div><div class="stat-label">${t('derrotas')}</div></div>
        <div class="stat-card"><div class="stat-icon"><i class="fas fa-calendar-check"></i></div><div class="stat-number">${s.partidos}</div><div class="stat-label">${t('partidos') || 'Partidos'}</div></div>`;
    }

    const tabsHtml = competiciones
      .map((nombre, i) => {
        const meta = getCompMeta(nombre);
        return `<button class="comp-tab ${i === 0 ? 'active' : ''}" data-comp="${nombre}" style="--tab-accent:${meta.color}">
        <i class="fas ${meta.icon}"></i><span>${nombre}</span>
      </button>`;
      })
      .join('');

    const panelsHtml = competiciones
      .map((nombre, i) => {
        const s = statsData.desglose[nombre];
        const posicion = i === 0 ? (statsData.posicion ?? null) : null;
        return `<div class="comp-panel ${i === 0 ? 'active' : ''}" data-comp="${nombre}">
        <div class="team-stats-grid">${renderCards(s, posicion)}</div>
      </div>`;
      })
      .join('');

    const checksHtml = competiciones
      .map((nombre) => {
        const meta = getCompMeta(nombre);
        return `<label class="total-check-label">
        <input type="checkbox" class="total-check" data-comp="${nombre}" checked>
        <span class="total-check-dot" style="background:${meta.color}"></span>
        <span>${nombre}</span>
      </label>`;
      })
      .join('');

    const allTots = calcularTotales(statsData.desglose, competiciones);
    const totPanelHtml = `<div class="comp-panel" data-comp="__totales__">
      <div class="total-checks-row">${checksHtml}</div>
      <div class="team-stats-grid" id="totalesGrid">${renderCards(allTots, null)}</div>
    </div>`;

    container.innerHTML = `
      <div class="comp-tabs-wrapper">
        <div class="comp-tabs">
          ${tabsHtml}
          <button class="comp-tab comp-tab--total" data-comp="__totales__" style="--tab-accent:#ffcc00">
            <i class="fas fa-plus-circle"></i><span>${t('total') || 'Total'}</span>
          </button>
        </div>
        <div class="comp-panels">
          ${panelsHtml}
          ${totPanelHtml}
        </div>
      </div>`;

    // Lógica de tabs
    const wrapper = container.querySelector('.comp-tabs-wrapper');
    wrapper.querySelectorAll('.comp-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        wrapper
          .querySelectorAll('.comp-tab')
          .forEach((b) => b.classList.remove('active'));
        wrapper
          .querySelectorAll('.comp-panel')
          .forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        wrapper
          .querySelector(`.comp-panel[data-comp="${btn.dataset.comp}"]`)
          .classList.add('active');
      });
    });

    // Lógica de checkboxes en totales
    wrapper.querySelectorAll('.total-check').forEach((chk) => {
      chk.addEventListener('change', () => {
        const activos = [
          ...wrapper.querySelectorAll('.total-check:checked'),
        ].map((c) => c.dataset.comp);
        const tots = calcularTotales(statsData.desglose, activos);
        wrapper.querySelector('#totalesGrid').innerHTML = renderCards(
          tots,
          null,
        );
      });
    });
  },

  renderPlantillaCompleta: function () {
    const container = document.getElementById('plantillaCompleta');
    if (!container) return;
    const temporada = getTemporada(this.temporadaActiva);

    // FUSIONAR con datos del maestro
    const jugadoresCompletos = temporada.jugadores
      .map((j) => getJugadorById(j.codigo || j.id, this.temporadaActiva))
      .filter((j) => j !== null);

    // Usa POSITION_GROUPS definido en data.js (centralizado)
    let html = '';
    for (const group of Object.values(POSITION_GROUPS)) {
      const nombrePosicion = t(group.key);
      const jugadoresPos = jugadoresCompletos.filter((j) =>
        group.positions.includes(j.posicion),
      );
      if (jugadoresPos.length === 0) continue;
      html +=
        '<div class="position-group"><h3 class="position-title"><span class="position-icon"><i class="fas ' +
        group.icon +
        '"></i></span>' +
        nombrePosicion +
        '</h3><div class="squad-grid">';
      jugadoresPos.forEach((jugador) => {
        html += this.renderJugadorCard(jugador);
      });
      html += '</div></div>';
    }
    container.innerHTML = html;
  },

  renderJugadorCard: function (jugador) {
    // LLAMADA AL AUTOCÁLCULO:
    autoCalcularStatsJugador(jugador);
    // Calcular edad si no existe pero hay fecha de nacimiento
    let edadMostrar = jugador.edad;
    if (!edadMostrar && jugador.fechaNacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(jugador.fechaNacimiento);
      edadMostrar = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edadMostrar--;
      }
    }
    // Si sigue sin haber edad, mostrar mensaje
    if (!edadMostrar) {
      edadMostrar = t('desconocida') || 'Desconocida';
    }

    const ribbonHtml = jugador.fallecido
      ? '<div class="deceased-ribbon"></div>'
      : '';
    const _estados = normalizarEstados(jugador);
    const _tieneCedidoCard = _estados.some((e) => e.tipo === 'cedido');
    const _tieneBajaCard = _estados.some((e) => e.tipo === 'baja');
    const _clubCedidoCard =
      (_estados.find((e) => e.tipo === 'cedido') || {}).club || null;
    const cedidoBadgeHtml =
      _tieneCedidoCard || _tieneBajaCard
        ? `<div class="estado-badges-stack">
          ${_tieneCedidoCard ? `<div class="cedido-card-badge"><i class="fas fa-exchange-alt"></i> ${_clubCedidoCard ? _clubCedidoCard : t('cedido') || 'Cedido'}</div>` : ''}
          ${_tieneBajaCard ? `<div class="baja-temp-card-badge"><i class="fas fa-door-open"></i> ${t('baja_temporada') || 'Baja durante temporada'}</div>` : ''}
        </div>`
        : '';
    const esTemporadaActual =
      this.temporadaActiva === CLUB_DATA.temporadaActual;
    const playerUrl = jugador.codigo
      ? esTemporadaActual
        ? `fichas/${jugador.codigo}.html`
        : `ficha-jugador.html?id=${jugador.codigo}&season=${this.temporadaActiva}`
      : `ficha-jugador.html?id=${jugador.id}&season=${this.temporadaActiva}`;

    // DIFERENCIAR GOLES/ENCAJADOS PARA PORTEROS
    const esPorteroPos = esPortero(jugador);
    const golesStats = esPorteroPos
      ? `<div class="mini-stat conceded"><span class="mini-stat-value" style="color:#e74c3c">${jugador.stats.goles || 0}</span><span class="mini-stat-label">${t('encajados') || 'Encajados'}</span></div>`
      : `<div class="mini-stat"><span class="mini-stat-value">${jugador.stats.goles || 0}</span><span class="mini-stat-label">${t('goles')}</span></div>`;

    return `
    <article class="squad-card">
      <a href="${playerUrl}" class="squad-link">
        <div class="squad-image">
          <img src="${jugador.imagen}" alt="${jugador.nombreCompleto}">
          <span class="squad-number">${jugador.dorsal}</span>
          ${ribbonHtml}
          <div class="squad-overlay"><span class="view-profile">${t('ver_ficha')}</span></div>
          ${cedidoBadgeHtml}
        </div>
        <div class="squad-info">
          <h4 class="squad-name">${jugador.apodo || jugador.nombre}</h4>
          <span class="squad-position">${translatePosition(jugador.posicion)}</span>
          <div class="squad-meta">
            <span><i class="far fa-calendar"></i> ${edadMostrar}${typeof edadMostrar === 'number' ? ' ' + (t('edad') || 'años') : ''}</span>
            <span><i class="fas fa-ruler-vertical"></i> ${jugador.altura ? jugador.altura + 'm' : t('desconocida')}</span>
          </div>
          <div class="squad-stats">
            <div class="mini-stat"><span class="mini-stat-value">${jugador.stats.partidos}</span><span class="mini-stat-label">${t('partidos')}</span></div>
            ${golesStats}
          </div>
        </div>
      </a>
    </article>`;
  },

  renderCuerpoTecnico: function () {
    const container = document.getElementById('cuerpoTecnicoGrid');
    if (!container) return;
    const temporada = getTemporada(this.temporadaActiva);
    let html = '';
    temporada.cuerpoTecnico.forEach((miembro) => {
      const entId = miembro.codigo || miembro.id;
      const stats = miembro.estadisticas;
      const esTemporadaActual =
        this.temporadaActiva === CLUB_DATA.temporadaActual;
      const fichaUrl = esTemporadaActual
        ? `fichas/entrenador-${entId}.html`
        : `ficha-jugador.html?tipo=entrenador&id=${entId}&season=${this.temporadaActiva}`;

      // Usamos el diseño idéntico al de renderJugadorCard (.squad-card)
      const bajaBadgeHtml =
        miembro.estado === 'baja'
          ? `<div class="baja-temp-card-badge"><i class="fas fa-door-open"></i> ${t('baja_temporada') || 'Baja durante temporada'}</div>`
          : '';
      html += `
      <article class="squad-card">
        <a href="${fichaUrl}" class="squad-link">
          <div class="squad-image">
            <img src="${miembro.imagen}" alt="${miembro.nombre}">
            <span class="squad-number" style="font-size: 1.2rem;">DT</span>
            <div class="squad-overlay"><span class="view-profile">${t('ver_ficha') || 'Ver ficha'}</span></div>
            ${bajaBadgeHtml}
          </div>
          <div class="squad-info">
            <h4 class="squad-name">${miembro.nombre}</h4>
            <span class="squad-position">${translateCargo(miembro.cargo)}</span>
            <div class="squad-meta">
              <span><i class="fas fa-clipboard"></i> ${t('cuerpo_tecnico') || 'Cuerpo Técnico'}</span>
            </div>
            <div class="squad-stats">
              ${
                stats
                  ? `
              <div class="mini-stat"><span class="mini-stat-value">${stats.partidos}</span><span class="mini-stat-label">${t('partidos') || 'PJ'}</span></div>
              <div class="mini-stat"><span class="mini-stat-value">${stats.victorias}</span><span class="mini-stat-label">${t('victorias') || 'V'}</span></div>
              `
                  : '<div class="mini-stat"></div>'
              }
            </div>
          </div>
        </a>
      </article>`;
    });
    container.innerHTML = html;
  },

  renderFichaJugador: function () {
    const container = document.getElementById('fichaJugadorContent');
    if (!container) return;

    // Detectar si es ficha de entrenador
    let tipoFicha = 'jugador';
    if (window.PLAYER_DATA_STATIC) {
      tipoFicha = window.PLAYER_DATA_STATIC.tipo || 'jugador';
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      tipoFicha = urlParams.get('tipo') || 'jugador';
    }
    if (tipoFicha === 'entrenador') {
      this.renderFichaEntrenador();
      return;
    }

    let jugadorId, seasonId;
    if (window.PLAYER_DATA_STATIC) {
      jugadorId =
        window.PLAYER_DATA_STATIC.id || window.PLAYER_DATA_STATIC.codigo;
      seasonId = window.PLAYER_DATA_STATIC.season;
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      jugadorId =
        urlParams.get('id') ||
        urlParams.get('codigo') ||
        urlParams.get('player');
      seasonId = urlParams.get('season') || CLUB_DATA.temporadaActual;
    }
    const jugador = getJugadorById(jugadorId, seasonId);
    if (!jugador) {
      container.innerHTML =
        '<p style="text-align:center; padding:40px;">Jugador no encontrado</p>';
      return;
    }

    // LLAMADA AL AUTOCÁLCULO:
    autoCalcularStatsJugador(jugador);

    document.title = `${jugador.nombreCompleto} | ${CLUB_DATA.club.nombreCorto}`;
    this.updateMetaTags(jugador);
    const breadcrumb = document.querySelector('.breadcrumb .current');
    if (breadcrumb) breadcrumb.textContent = jugador.nombreCompleto;
    const esTemporadaActual = seasonId === CLUB_DATA.temporadaActual;
    const haFallecido = jugador.fallecido === true;
    const fechaFallecimiento = jugador.fechaFallecimiento || null;

    // CALCULAR EDAD
    let edadMostrar = jugador.edad;
    if (!edadMostrar && jugador.fechaNacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(jugador.fechaNacimiento);
      edadMostrar = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edadMostrar--;
      }
    }
    // Si está fallecido, calcular edad al fallecer
    if (haFallecido && fechaFallecimiento && jugador.fechaNacimiento) {
      const nacimiento = new Date(jugador.fechaNacimiento);
      const muerte = new Date(fechaFallecimiento);
      let edadMuerte = muerte.getFullYear() - nacimiento.getFullYear();
      const m = muerte.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && muerte.getDate() < nacimiento.getDate()))
        edadMuerte--;
      edadMostrar = edadMuerte;
    }
    // Fallback final
    if (!edadMostrar) {
      edadMostrar = t('desconocida') || 'Desconocida';
    }

    // Siempre compartir la URL de la ficha estática (tiene meta tags OG correctos para WhatsApp/Telegram).
    // Temporada actual → fichas/aaron-escandell-banacloche.html
    // Temporada histórica → fichas/aaron-escandell-banacloche-2024-25.html
    const baseUrl = window.location.href
      .split('/fichas/')[0]
      .split('/ficha-jugador')[0];
    const fichaSlug = esTemporadaActual
      ? jugador.codigo
      : `${jugador.codigo}-${seasonId}`;
    const pageUrl = jugador.codigo
      ? `${baseUrl}/fichas/${fichaSlug}.html`
      : window.location.href;
    const shareText = `Ficha de ${jugador.nombreCompleto} - ${CLUB_DATA.club.nombreCorto}`;
    const whatsappText = encodeURIComponent(shareText + '\n\n' + pageUrl);
    const shareLinks = `
            <a href="https://api.whatsapp.com/send?text=${whatsappText}" target="_blank" class="player-social whatsapp" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
            <a href="https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="player-social telegram" title="Telegram"><i class="fab fa-telegram-plane"></i></a>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="player-social twitter" title="Twitter"><i class="fab fa-twitter"></i></a>`;

    // DIFERENCIAR ESTADÍSTICAS PARA PORTEROS EN LA FICHA
    const esPorteroPos = esPortero(jugador);
    const golesLabel = esPorteroPos ? t('goles_encajados') : t('goles');
    const golesValue = esPorteroPos
      ? `<span style="color:#e74c3c;font-weight:700">${jugador.stats.goles || 0}</span>`
      : jugador.stats.goles || 0;
    const iconoGoles = esPorteroPos ? 'fa-shield-alt' : 'fa-futbol';

    container.innerHTML = `
            <div class="player-photo-container">
                <div class="player-photo-wrapper">
                    <img src="${resolverRutaImagen(jugador.imagen)}" alt="${jugador.nombreCompleto}" class="player-main-photo">
                    <div class="player-number-large">${jugador.dorsal}</div>
                    <div class="player-role-badge"><span>${getCategoriaJugador(jugador)}</span></div>
                    ${haFallecido ? '<div class="deceased-ribbon"></div>' : ''}
                </div>
                ${(() => {
                  const _est = normalizarEstados(jugador);
                  const _cedido = _est.find((e) => e.tipo === 'cedido');
                  const _baja = _est.find((e) => e.tipo === 'baja');
                  let _html = '';
                  if (_cedido) {
                    const _clubs = _cedido.club
                      ? _cedido.club
                          .split(',')
                          .map(
                            (c) =>
                              `<span class="cedido-club">${c.trim()}</span>`,
                          )
                          .join('')
                      : t('cedido') || 'Cedido';
                    _html += `<div class="cedido-badge"><i class="fas fa-exchange-alt"></i><span class="cedido-clubs">${_clubs}</span></div>`;
                  }
                  if (_baja) {
                    _html += `<div class="baja-temp-badge"><i class="fas fa-door-open"></i> ${t('baja_temporada') || 'Baja durante temporada'}</div>`;
                  }
                  return _html;
                })()}
            </div>
            <div class="player-info-container">
                <div class="player-name-section">
                    <span class="player-position-label">${translatePosition(jugador.posicion)}</span>
                    <h1 class="player-full-name">${jugador.nombreCompleto}</h1>
                    <div class="player-social-links">${shareLinks}</div>
                </div>
                <div class="player-quick-stats">${this.renderQuickStats(jugador, haFallecido, fechaFallecimiento, edadMostrar, esTemporadaActual)}</div>
                <div class="player-season-stats">
                    <h3 class="stats-title">${t('temporada')} ${seasonId.replace('-', '/')}</h3>
                    <div class="season-stats-grid">
                        <div class="season-stat ${esPorteroPos ? 'portero-stat' : ''}"><div class="season-stat-icon"><i class="fas ${iconoGoles}"></i></div><div class="season-stat-content"><span class="season-stat-value">${golesValue}</span><span class="season-stat-label">${golesLabel}</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-hands-helping"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.asistencias || 0}</span><span class="season-stat-label">${t('asistencias')}</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-running"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.partidos}</span><span class="season-stat-label">${t('partidos')}</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-clock"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.minutos.toLocaleString()}</span><span class="season-stat-label">${t('minutos')}</span></div></div>
                    </div>
                </div>
            </div>`;
    this.renderFichaOverview(jugador);
    this.renderFichaMatches(jugador, seasonId, 'all', 'all', 'all');
    this.renderFichaCareerHistory(jugador, seasonId);
  },

  // ============================================================
  // FICHA DE ENTRENADOR
  // ============================================================
  renderFichaEntrenador: function () {
    const container = document.getElementById('fichaJugadorContent');
    if (!container) return;

    let entrenadorId, seasonId;
    if (window.PLAYER_DATA_STATIC) {
      entrenadorId =
        window.PLAYER_DATA_STATIC.id || window.PLAYER_DATA_STATIC.codigo;
      seasonId = window.PLAYER_DATA_STATIC.season || CLUB_DATA.temporadaActual;
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      entrenadorId = urlParams.get('id') || urlParams.get('codigo');
      seasonId = urlParams.get('season') || CLUB_DATA.temporadaActual;
    }

    // Buscar en cuerpoTecnico de la temporada
    const temporada = getTemporada(seasonId);
    const miembro = temporada.cuerpoTecnico
      ? temporada.cuerpoTecnico.find(
          (m) =>
            m.codigo === entrenadorId ||
            m.id === entrenadorId ||
            String(m.id) === String(entrenadorId),
        )
      : null;

    // Combinar con datos maestros si existen
    const maestro =
      (CLUB_DATA.entrenadorMaestro &&
        CLUB_DATA.entrenadorMaestro[entrenadorId]) ||
      {};
    const ent = miembro ? { ...maestro, ...miembro } : maestro;

    if (!ent || (!ent.nombre && !ent.nombreCompleto)) {
      container.innerHTML =
        '<p style="text-align:center; padding:40px;">Entrenador no encontrado</p>';
      return;
    }

    const nombre = ent.nombreCompleto || ent.nombre || '';
    document.title = `${nombre} | ${CLUB_DATA.club.nombreCorto}`;
    this.updateMetaTags(ent);
    const breadcrumb = document.querySelector('.breadcrumb .current');
    if (breadcrumb) breadcrumb.textContent = nombre;

    // Calcular edad
    let edadMostrar = '—';
    if (ent.fechaNacimiento) {
      const hoy = new Date();
      const nac = new Date(ent.fechaNacimiento);
      let edad = hoy.getFullYear() - nac.getFullYear();
      if (
        hoy.getMonth() < nac.getMonth() ||
        (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())
      )
        edad--;
      edadMostrar = edad;
    }

    const stats = ent.estadisticas || {};
    const pj = stats.partidos || 0;
    const v = stats.victorias || 0;
    const e2 = stats.empates || 0;
    const d = stats.derrotas || 0;
    const pctV = pj > 0 ? Math.round((v / pj) * 100) : 0;

    const esTemporadaActual = seasonId === CLUB_DATA.temporadaActual;
    const baseUrl = window.location.href
      .split('/fichas/')[0]
      .split('/ficha-jugador')[0]
      .replace(/\/$/, '');
    const pageUrl = esTemporadaActual
      ? `${baseUrl}/fichas/entrenador-${entrenadorId}.html`
      : window.location.href;

    const shareText = `Ficha de ${nombre} - ${CLUB_DATA.club.nombreCorto}`;
    const whatsappText = encodeURIComponent(shareText + '\n\n' + pageUrl);
    const shareLinks = `
      <a href="https://api.whatsapp.com/send?text=${whatsappText}" target="_blank" class="player-social whatsapp" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
      <a href="https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="player-social telegram" title="Telegram"><i class="fab fa-telegram-plane"></i></a>
      <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="player-social twitter" title="Twitter"><i class="fab fa-twitter"></i></a>`;

    container.innerHTML = `
      <div class="player-photo-container">
        <div class="player-photo-wrapper">
          <img src="${resolverRutaImagen(ent.imagen)}" alt="${nombre}" class="player-main-photo">
          <div class="player-role-badge"><span>${translateCargo(ent.cargo) || t('entrenador')}</span></div>
        </div>
        ${ent.estado === 'baja' ? `<div class="baja-temp-badge"><i class="fas fa-door-open"></i> ${t('baja_temporada') || 'Baja durante temporada'}</div>` : ''}
      </div>
      <div class="player-info-container">
        <div class="player-name-section">
          <span class="player-position-label">${translateCargo(ent.cargo) || ''}</span>
          <h1 class="player-full-name">${nombre}</h1>
          <div class="player-social-links">${shareLinks}</div>
        </div>
        <div class="player-quick-stats">
          <div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">${t('edad') || 'Edad'}</span></div>
          <div class="quick-stat"><span class="quick-stat-value">${ent.enClubDesde || '—'}</span><span class="quick-stat-label">${t('en_club_desde') || 'En el club'}</span></div>
        </div>
        <div class="player-season-stats">
          <h3 class="stats-title">${t('temporada') || 'Temporada'} ${seasonId.replace('-', '/')}</h3>
          <div class="season-stats-grid">
            <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-clipboard-list"></i></div><div class="season-stat-content"><span class="season-stat-value">${pj}</span><span class="season-stat-label">${t('partidos') || 'Partidos'}</span></div></div>
            <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-trophy"></i></div><div class="season-stat-content"><span class="season-stat-value">${v}</span><span class="season-stat-label">${t('victorias') || 'Victorias'}</span></div></div>
            <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-equals"></i></div><div class="season-stat-content"><span class="season-stat-value">${e2}</span><span class="season-stat-label">${t('empates') || 'Empates'}</span></div></div>
            <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-times-circle"></i></div><div class="season-stat-content"><span class="season-stat-value">${d}</span><span class="season-stat-label">${t('derrotas') || 'Derrotas'}</span></div></div>
          </div>
        </div>
      </div>`;

    this.renderFichaEntrenadorOverview(ent, pj, v, e2, d, pctV, seasonId);
    this.renderFichaEntrenadorMatches(ent, seasonId);
    this.renderFichaEntrenadorCareer(ent);
  },

  renderFichaEntrenadorOverview: function (ent, pj, v, e2, d, pctV, seasonId) {
    const container = document.getElementById('tabOverview');
    if (!container) return;

    const fechaNac = ent.fechaNacimiento
      ? formatearFecha(ent.fechaNacimiento)
      : null;
    const stats = ent.estadisticas || {};
    const gf = stats.golesFavor || 0;
    const gc = stats.golesContra || 0;
    const pctE = pj > 0 ? Math.round((e2 / pj) * 100) : 0;
    const pctD = pj > 0 ? Math.round((d / pj) * 100) : 0;
    const gfPP = pj > 0 ? (gf / pj).toFixed(2) : '0.00';
    const gcPP = pj > 0 ? (gc / pj).toFixed(2) : '0.00';

    // Colores dinámicos según % victorias (igual que goles/partido en jugadores)
    const pctVColor =
      pctV >= 50 ? '#2ecc71' : pctV >= 33 ? '#f39c12' : '#e74c3c';

    // ── COLUMNA IZQUIERDA: Rendimiento (barras, como jugadores) ──
    const leftHtml = `
      <div class="performance-card">
        <h3 class="card-title">${t('rendimiento')}</h3>
        <div class="performance-stats">

          <div class="performance-item">
            <div class="performance-header">
              <span>${t('victorias')}</span>
              <span class="performance-value" style="color:${pctVColor}">${pctV}%</span>
            </div>
            <div class="performance-bar">
              <div class="performance-fill" style="width:${pctV}%; background:${pctVColor}"></div>
            </div>
          </div>

          <div class="performance-item">
            <div class="performance-header">
              <span>${t('empates')}</span>
              <span class="performance-value" style="color:#f39c12">${pctE}%</span>
            </div>
            <div class="performance-bar">
              <div class="performance-fill" style="width:${pctE}%; background:#f39c12"></div>
            </div>
          </div>

          <div class="performance-item">
            <div class="performance-header">
              <span>${t('derrotas')}</span>
              <span class="performance-value" style="color:#e74c3c">${pctD}%</span>
            </div>
            <div class="performance-bar">
              <div class="performance-fill" style="width:${pctD}%; background:#e74c3c"></div>
            </div>
          </div>

          <div class="performance-item">
            <div class="performance-header">
              <span>${t('goles_favor_partido')}</span>
              <span class="performance-value" style="color:#2ecc71">${gfPP}</span>
            </div>
            <div class="performance-bar">
              <div class="performance-fill" style="width:${Math.min(parseFloat(gfPP) * 33, 100)}%; background:#2ecc71"></div>
            </div>
          </div>

          <div class="performance-item">
            <div class="performance-header">
              <span>${t('goles_contra_partido')}</span>
              <span class="performance-value" style="color:#e74c3c">${gcPP}</span>
            </div>
            <div class="performance-bar">
              <div class="performance-fill" style="width:${Math.min(parseFloat(gcPP) * 33, 100)}%; background:#e74c3c"></div>
            </div>
          </div>

        </div>
      </div>`;

    // ── COLUMNA DERECHA: Información Personal ──────────────────
    let infoRows = '';

    if (fechaNac) {
      infoRows += `<div class="info-row">
        <span class="info-label"><i class="far fa-calendar"></i> ${t('nacimiento')}</span>
        <span class="info-value">${fechaNac.completa}</span>
      </div>`;
    }
    if (ent.lugarNacimiento) {
      infoRows += `<div class="info-row">
        <span class="info-label"><i class="fas fa-map-marker-alt"></i> ${t('lugar')}</span>
        <span class="info-value">${translateCity ? translateCity(ent.lugarNacimiento) : ent.lugarNacimiento}</span>
      </div>`;
    }
    if (ent.provinciaNacimiento) {
      infoRows += `<div class="info-row">
        <span class="info-label"><i class="fas fa-map"></i> ${t('provincia')}</span>
        <span class="info-value">${translateProvince ? translateProvince(ent.provinciaNacimiento) : ent.provinciaNacimiento}</span>
      </div>`;
    }
    if (ent.nacionalidad) {
      const nacs = Array.isArray(ent.nacionalidad)
        ? ent.nacionalidad
        : [ent.nacionalidad];
      nacs.forEach((n) => {
        const nac = translateNationality ? translateNationality(n) : n;
        infoRows += `<div class="info-row">
          <span class="info-label"><i class="fas fa-flag"></i> ${t('nacionalidad')}</span>
          <span class="info-value">${nac}</span>
        </div>`;
      });
    }
    if (ent.estado === 'baja') {
      infoRows += `<div class="info-row" style="background:#fff5f5; border-radius:6px; border-left:3px solid #e74c3c; padding-left:10px;">
        <span class="info-label" style="color:#e74c3c"><i class="fas fa-sign-out-alt"></i> ${t('estado')}</span>
        <span class="info-value" style="color:#e74c3c; font-weight:700">${t('ex_entrenador')}</span>
      </div>`;
    }
    if (ent.enClubDesde) {
      infoRows += `<div class="info-row">
        <span class="info-label"><i class="far fa-calendar-check"></i> ${t('en_club_desde')}</span>
        <span class="info-value">${ent.enClubDesde}</span>
      </div>`;
    }
    if (ent.contratoHasta) {
      infoRows += `<div class="info-row">
        <span class="info-label"><i class="far fa-calendar-alt"></i> ${t('contrato_hasta')}</span>
        <span class="info-value">${ent.contratoHasta}</span>
      </div>`;
    }

    const rightHtml = `
      <div class="personal-info-card">
        <h3 class="card-title">${t('informacion')}</h3>
        <div class="personal-info-list">
          ${infoRows}
        </div>
      </div>`;

    // ── FILA DE TOTALES (bajo el grid, igual que disciplina en jugadores) ──
    const disciplinaHtml = `
      <div class="disciplinary-card">
        <h3 class="card-title">${t('estadisticas_temporada') || 'Estadísticas de temporada'}</h3>
        <div class="cards-display" style="grid-template-columns: repeat(4, 1fr);">
          <div class="card-item" style="background:#f0f4ff; border-color:#001a6e">
            <div class="card-icon" style="color:#001a6e"><i class="fas fa-trophy"></i></div>
            <div class="card-info">
              <span class="card-count" style="color:#001a6e">${v}</span>
              <span class="card-label">V</span>
            </div>
          </div>
          <div class="card-item" style="background:#f0f4ff; border-color:#001a6e">
            <div class="card-icon" style="color:#001a6e"><i class="fas fa-equals"></i></div>
            <div class="card-info">
              <span class="card-count" style="color:#001a6e">${e2}</span>
              <span class="card-label">E</span>
            </div>
          </div>
          <div class="card-item" style="background:#f0f4ff; border-color:#001a6e">
            <div class="card-icon" style="color:#001a6e"><i class="fas fa-times-circle"></i></div>
            <div class="card-info">
              <span class="card-count" style="color:#001a6e">${d}</span>
              <span class="card-label">D</span>
            </div>
          </div>
          <div class="card-item" style="background:#f0f4ff; border-color:#001a6e">
            <div class="card-icon" style="color:#001a6e"><i class="fas fa-clipboard-list"></i></div>
            <div class="card-info">
              <span class="card-count" style="color:#001a6e">${pj}</span>
              <span class="card-label">PJ</span>
            </div>
          </div>
        </div>
      </div>`;

    container.innerHTML = `
      <div class="overview-grid">
        ${leftHtml}
        ${rightHtml}
      </div>`;
  },

  renderFichaEntrenadorMatches: function (
    ent,
    seasonId,
    filtroTemporada = 'all',
    filtroCompeticion = 'all',
    filtroTipo = 'all',
  ) {
    const container = document.getElementById('tabMatches');
    if (!container) return;

    const nombreClub =
      CLUB_DATA.club.nombre || CLUB_DATA.club.nombreCorto || '';

    // ── 1. AGREGAR PARTIDOS DE TODAS LAS TEMPORADAS ──────────────
    const todosLosPartidos = [];
    const temporadasConPartidos = [];

    CLUB_DATA.temporadasDisponibles.forEach((temp) => {
      const datosTemp = CLUB_DATA.temporadas[temp.id];
      if (!datosTemp) return;

      // Buscar al entrenador en esta temporada
      const miembro = datosTemp.cuerpoTecnico
        ? datosTemp.cuerpoTecnico.find(
            (m) =>
              m.codigo === (ent.codigo || ent.id) ||
              String(m.id) === String(ent.id),
          )
        : null;

      // Partidos propios del miembro, o los del equipo si no tiene individuales
      const listaBase =
        miembro && miembro.partidos && miembro.partidos.length
          ? miembro.partidos
          : datosTemp.partidosJugados || [];

      if (!listaBase.length) return;

      const partidos = listaBase.map((p) => ({
        ...p,
        _temporadaId: temp.id,
        _temporadaNombre: temp.nombre,
        // Asegurar campo competicion
        competicion: p.competicion || datosTemp.competicion || '',
      }));

      temporadasConPartidos.push({ id: temp.id, nombre: temp.nombre });
      todosLosPartidos.push(...partidos);
    });

    // Ordenar de más reciente a más antiguo
    todosLosPartidos.sort((a, b) => {
      if (!a.fecha || !b.fecha) return 0;
      return new Date(b.fecha) - new Date(a.fecha);
    });

    if (!todosLosPartidos.length) {
      container.innerHTML = `<p style="text-align:center; color:#666; padding:20px;">${t('no_datos_partidos') || 'No hay datos de partidos.'}</p>`;
      return;
    }

    // ── 2. CONSTRUIR LISTAS DE OPCIONES ──────────────────────────
    const partidosPorTemp =
      filtroTemporada === 'all'
        ? todosLosPartidos
        : todosLosPartidos.filter((p) => p._temporadaId === filtroTemporada);

    const competicionesSet = new Set(
      partidosPorTemp.map((p) => p.competicion).filter(Boolean),
    );
    const competicionesOpts = Array.from(competicionesSet).sort();

    const compValida =
      filtroCompeticion === 'all' || competicionesSet.has(filtroCompeticion);
    const compEfectiva = compValida ? filtroCompeticion : 'all';

    // ── 3. APLICAR FILTROS ────────────────────────────────────────
    const porCompeticion =
      compEfectiva === 'all'
        ? partidosPorTemp
        : partidosPorTemp.filter((p) => p.competicion === compEfectiva);

    const aplicarTipo = (lista, tipo) => {
      if (tipo === 'all') return lista;
      return lista.filter((p) => {
        switch (tipo) {
          case 'victoria':
            return p.resultado === 'V';
          case 'empate':
            return p.resultado === 'E';
          case 'derrota':
            return p.resultado === 'D';
          case 'local':
            return p.local === nombreClub || p.condicion === 'local';
          case 'visitante':
            return p.visitante === nombreClub || p.condicion === 'visitante';
          default:
            return true;
        }
      });
    };

    const partidosFiltrados = aplicarTipo(porCompeticion, filtroTipo);

    // ── 4. PILLS DE TIPO ──────────────────────────────────────────
    const hayCondicion = partidosPorTemp.some(
      (p) =>
        p.local === nombreClub || p.visitante === nombreClub || p.condicion,
    );

    const tipoPills = [
      {
        key: 'all',
        label: t('todos') || 'Todos',
        icon: 'fa-list',
        color: '#001a6e',
      },
      {
        key: 'victoria',
        label: t('victorias') || 'Victorias',
        icon: 'fa-check-circle',
        color: '#27ae60',
      },
      {
        key: 'empate',
        label: t('empates') || 'Empates',
        icon: 'fa-minus-circle',
        color: '#f39c12',
      },
      {
        key: 'derrota',
        label: t('derrotas') || 'Derrotas',
        icon: 'fa-times-circle',
        color: '#e74c3c',
      },
      ...(hayCondicion
        ? [
            {
              key: 'local',
              label: t('local') || 'Local',
              icon: 'fa-home',
              color: '#2980b9',
            },
            {
              key: 'visitante',
              label: t('visitante') || 'Visitante',
              icon: 'fa-plane',
              color: '#8e44ad',
            },
          ]
        : []),
    ];

    const pillsHtml = tipoPills
      .map(({ key, label, icon, color }) => {
        const count =
          key === 'all'
            ? porCompeticion.length
            : aplicarTipo(porCompeticion, key).length;
        const isActive = key === filtroTipo;
        return `<button class="match-tipo-pill ${isActive ? 'active' : ''}" data-tipo="${key}" style="--pill-color:${color}">
          <i class="fas ${icon}"></i> ${label}${key !== 'all' ? ` <span class="pill-count">${count}</span>` : ''}
        </button>`;
      })
      .join('');

    // ── 5. SELECTORES HTML ────────────────────────────────────────
    const selectStyle = `padding:8px 12px; border-radius:6px; border:1px solid #ccd6ff; background:#f0f4ff; color:#001a6e; font-family:'Source Sans 3',sans-serif; font-weight:600; cursor:pointer; outline:none;`;

    const tempOptsHtml = [
      `<option value="all" ${filtroTemporada === 'all' ? 'selected' : ''}>${t('todas_temporadas') || 'Todas las temporadas'}</option>`,
      ...temporadasConPartidos.map(
        (t2) =>
          `<option value="${t2.id}" ${filtroTemporada === t2.id ? 'selected' : ''}>${t2.nombre}</option>`,
      ),
    ].join('');

    const compOptsHtml = [
      `<option value="all" ${compEfectiva === 'all' ? 'selected' : ''}>${t('todas_competiciones') || 'Todas las competiciones'}</option>`,
      ...competicionesOpts.map(
        (c) =>
          `<option value="${c}" ${compEfectiva === c ? 'selected' : ''}>${translateCompeticion(c)}</option>`,
      ),
    ].join('');

    // ── 6. RENDERIZAR CARDS ───────────────────────────────────────
    const renderCard = (partido) => {
      const fecha = formatearFecha(partido.fecha);
      const resultClass =
        partido.resultado === 'V'
          ? 'win'
          : partido.resultado === 'E'
            ? 'draw'
            : 'loss';
      const compNombre = partido.competicion || '';
      const cleanJornada = String(partido.jornada)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[().]/g, '')
        .replace(/[-\s]+/g, '_')
        .replace(/_+/g, '_');
      const jorTexto =
        typeof partido.jornada === 'number'
          ? `${t('jornada_abrev')}${partido.jornada}`
          : t(`copa_ronda_${cleanJornada}`) ||
            t(cleanJornada) ||
            partido.jornada;
      const tienePenaltis =
        partido.penaltisLocal !== undefined &&
        partido.penaltisVisitante !== undefined;
      const tieneProrroga = partido.minutos && partido.minutos > 90;
      const aetBadge = tieneProrroga
        ? ` <span class="match-score-aet">${t('prorroga') || 'p.p.'}</span>`
        : '';
      const pensBadge = tienePenaltis
        ? ` <span class="match-score-pens">(${partido.penaltisLocal}-${partido.penaltisVisitante} pen.)</span>`
        : '';
      const tempBadge =
        filtroTemporada === 'all'
          ? `<span class="match-season-tag">${partido._temporadaNombre}</span>`
          : '';

      return `<article class="match-detail-card">
        <div class="match-detail-header">
          <div class="match-date-badge ${resultClass}">
            <span class="match-day">${fecha.dia}</span>
            <span class="match-month">${fecha.mesCorto}</span>
          </div>
          <div class="match-competition-info">
            <span class="competition-name">
              ${translateCompeticion(compNombre)} · ${jorTexto}
              ${tempBadge}
            </span>
            <div class="match-teams-result">
              <span class="team-home">${partido.local}</span>
              <span class="match-score">${partido.golesLocal} - ${partido.golesVisitante}${aetBadge}${pensBadge}</span>
              <span class="team-away">${partido.visitante}</span>
            </div>
          </div>
        </div>
      </article>`;
    };

    // ── 7. MONTAR HTML ────────────────────────────────────────────
    let html = `
      <div class="matches-filter-bar">
        <div class="matches-comp-row">
          ${
            temporadasConPartidos.length > 1
              ? `<label style="font-weight:600;color:#333;">${t('temporada') || 'Temporada'}:</label>
               <select id="filterMatchesCoachSeason" style="${selectStyle}">${tempOptsHtml}</select>`
              : ''
          }
          <label style="font-weight:600;color:#333;">${t('competicion_label') || 'Competición'}:</label>
          <select id="filterMatchesCoach" style="${selectStyle}">${compOptsHtml}</select>
        </div>
        <div class="matches-tipo-pills">${pillsHtml}</div>
      </div>
      <div class="matches-list">`;

    if (partidosFiltrados.length === 0) {
      html += `<p style="text-align:center;color:#666;padding:20px;width:100%;">${t('no_partidos_competicion') || 'No hay partidos en esta combinación de filtros.'}</p>`;
    } else {
      partidosFiltrados.forEach((p) => {
        html += renderCard(p);
      });
    }
    html += '</div>';
    container.innerHTML = html;

    // ── 8. LISTENERS ──────────────────────────────────────────────
    const seasonSel = document.getElementById('filterMatchesCoachSeason');
    if (seasonSel) {
      seasonSel.addEventListener('change', (e) => {
        const compActiva =
          document.getElementById('filterMatchesCoach')?.value || 'all';
        const tipoActivo =
          container.querySelector('.match-tipo-pill.active')?.dataset.tipo ||
          'all';
        this.renderFichaEntrenadorMatches(
          ent,
          seasonId,
          e.target.value,
          compActiva,
          tipoActivo,
        );
      });
    }

    const compSel = document.getElementById('filterMatchesCoach');
    if (compSel) {
      compSel.addEventListener('change', (e) => {
        const tempActiva =
          document.getElementById('filterMatchesCoachSeason')?.value || 'all';
        const tipoActivo =
          container.querySelector('.match-tipo-pill.active')?.dataset.tipo ||
          'all';
        this.renderFichaEntrenadorMatches(
          ent,
          seasonId,
          tempActiva,
          e.target.value,
          tipoActivo,
        );
      });
    }

    container.querySelectorAll('.match-tipo-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tempActiva =
          document.getElementById('filterMatchesCoachSeason')?.value || 'all';
        const compActiva =
          document.getElementById('filterMatchesCoach')?.value || 'all';
        this.renderFichaEntrenadorMatches(
          ent,
          seasonId,
          tempActiva,
          compActiva,
          btn.dataset.tipo,
        );
      });
    });
  },

  renderFichaEntrenadorCareer: function (ent, filtroCompeticion) {
    const container = document.getElementById('tabCareer');
    if (!container) return;

    filtroCompeticion = filtroCompeticion || 'all';

    const historial = [];
    const competicionesSet = new Set();
    let totalesClub = { pj: 0, v: 0, e: 0, d: 0, gf: 0, gc: 0 };
    let totalesSeleccion = {};

    // ── Historial club por temporada ───────────────────────────
    CLUB_DATA.temporadasDisponibles.forEach((temp) => {
      const datosTemp = CLUB_DATA.temporadas[temp.id];
      if (!datosTemp || !datosTemp.cuerpoTecnico) return;
      const miembro = datosTemp.cuerpoTecnico.find(
        (m) =>
          m.codigo === (ent.codigo || ent.id) ||
          String(m.id) === String(ent.id),
      );
      if (!miembro) return;

      const stats = miembro.estadisticas || {};
      const compNombre = datosTemp.competicion || '—';

      if (stats.desglose) {
        Object.keys(stats.desglose).forEach((c) => competicionesSet.add(c));
      }
      competicionesSet.add(compNombre);

      let statsAMostrar = { ...stats };
      let mostrar = true;

      if (
        filtroCompeticion !== 'all' &&
        !filtroCompeticion.startsWith('seleccion_')
      ) {
        if (stats.desglose && stats.desglose[filtroCompeticion]) {
          statsAMostrar = stats.desglose[filtroCompeticion];
        } else if (compNombre !== filtroCompeticion) {
          mostrar = false;
        }
      } else if (filtroCompeticion.startsWith('seleccion_')) {
        mostrar = false;
      }

      if (mostrar) {
        historial.push({
          temporada: temp.nombre,
          equipo: CLUB_DATA.club.nombreCorto,
          logo: CLUB_DATA.club.logo || '',
          esSeleccion: false,
          competicionFiltro: compNombre,
          cargo: translateCargo
            ? translateCargo(miembro.cargo || ent.cargo) ||
              miembro.cargo ||
              ent.cargo
            : miembro.cargo || ent.cargo || '',
          stats: statsAMostrar,
          statsGlobales: stats,
          actual: temp.id === CLUB_DATA.temporadaActual,
        });
        totalesClub.pj += statsAMostrar.partidos || 0;
        totalesClub.v += statsAMostrar.victorias || 0;
        totalesClub.e += statsAMostrar.empates || 0;
        totalesClub.d += statsAMostrar.derrotas || 0;
        totalesClub.gf += statsAMostrar.golesFavor || 0;
        totalesClub.gc += statsAMostrar.golesContra || 0;
      }
    });

    // ── Historial selección ────────────────────────────────────
    const tieneSeleccion =
      ent.seleccionComoEntrenador &&
      ent.seleccionComoEntrenador.datos &&
      ent.seleccionComoEntrenador.datos.length > 0;

    if (tieneSeleccion) {
      const sel = ent.seleccionComoEntrenador;
      const banderaRaw = sel.bandera || '';
      const bandera = banderaRaw.startsWith('http')
        ? banderaRaw
        : banderaRaw.length === 2
          ? `https://flagcdn.com/16x12/${banderaRaw}.webp`
          : '';
      const pais = translateCountry ? translateCountry(sel.pais) : sel.pais;

      if (!totalesSeleccion[pais]) {
        totalesSeleccion[pais] = {
          pj: 0,
          v: 0,
          e: 0,
          d: 0,
          categorias: {},
          bandera,
        };
      }

      sel.datos.forEach((cat) => {
        const compKey = `seleccion_${cat.categoria}`;
        competicionesSet.add(compKey);

        totalesSeleccion[pais].pj += cat.partidos || 0;
        totalesSeleccion[pais].v += cat.victorias || 0;
        totalesSeleccion[pais].e += cat.empates || 0;
        totalesSeleccion[pais].d += cat.derrotas || 0;
        totalesSeleccion[pais].categorias[cat.categoria] = {
          pj: cat.partidos || 0,
          v: cat.victorias || 0,
          e: cat.empates || 0,
          d: cat.derrotas || 0,
          gf: cat.golesFavor || 0,
          gc: cat.golesContra || 0,
        };

        const mostrarEsta =
          filtroCompeticion === 'all' || filtroCompeticion === compKey;
        if (mostrarEsta) {
          historial.push({
            temporada: cat.categoria,
            equipo: pais,
            logo: bandera,
            esSeleccion: true,
            categoriaSeleccion: cat.categoria,
            competicionFiltro: compKey,
            cargo: translateCargo
              ? translateCargo(ent.cargo) || ent.cargo
              : ent.cargo,
            stats: {
              pj: cat.partidos || 0,
              v: cat.victorias || 0,
              e: cat.empates || 0,
              d: cat.derrotas || 0,
              gf: cat.golesFavor || 0,
              gc: cat.golesContra || 0,
            },
            actual: false,
          });
        }
      });
    }

    // ── Dropdown ───────────────────────────────────────────────
    const tieneClub =
      historial.some((h) => !h.esSeleccion) || totalesClub.pj > 0;
    let dropdownHtml = `<div class="filter-container" style="display:flex; justify-content:flex-end; margin-bottom:20px; align-items:center; gap:10px;">
      <label style="font-weight:bold;">${t('filtrar') || 'Filtrar'}:</label>
      <select id="filterCareerEnt" style="padding:8px 12px; border-radius:6px; border:1px solid #001a6e; background:#fff; color:#001a6e; font-family:inherit;">
        <option value="all" ${filtroCompeticion === 'all' ? 'selected' : ''}>${t('todas_competiciones') || 'Todas las competiciones'}</option>`;

    if (tieneClub) {
      dropdownHtml += `<optgroup label="${t('club') || 'Club'}">`;
      Array.from(competicionesSet)
        .filter((c) => !c.startsWith('seleccion_'))
        .sort()
        .forEach((c) => {
          dropdownHtml += `<option value="${c}" ${c === filtroCompeticion ? 'selected' : ''}>${translateCompeticion ? translateCompeticion(c) : c}</option>`;
        });
      dropdownHtml += `</optgroup>`;
    }

    if (tieneSeleccion) {
      const sel = ent.seleccionComoEntrenador;
      const pais = translateCountry ? translateCountry(sel.pais) : sel.pais;
      dropdownHtml += `<optgroup label="${t('seleccion_nacional') || 'Selección Nacional'} (${pais})">`;
      sel.datos.forEach((cat) => {
        const val = `seleccion_${cat.categoria}`;
        dropdownHtml += `<option value="${val}" ${filtroCompeticion === val ? 'selected' : ''}>${cat.categoria} (${pais})</option>`;
      });
      dropdownHtml += `</optgroup>`;
    }

    dropdownHtml += `</select></div>`;

    // ── Timeline HTML ──────────────────────────────────────────
    let timelineHtml = '';
    historial.forEach((h) => {
      const badgeHtml = h.logo
        ? `<img src="${h.logo}" alt="${h.equipo}" class="team-badge-img">`
        : `<span class="team-badge-text">${(h.equipo || 'ENT').substring(0, 3).toUpperCase()}</span>`;

      const pctV =
        h.stats.pj > 0 ? Math.round(((h.stats.v || 0) / h.stats.pj) * 100) : 0;
      const pctVColor =
        pctV >= 50 ? '#2ecc71' : pctV >= 33 ? '#f39c12' : '#e74c3c';

      let statsHtml = `<div class="timeline-stats">
        <span><strong>${h.stats.pj || h.stats.partidos || 0}</strong> ${t('partidos') || 'PJ'}</span>
        <span><strong style="color:#001a6e">${h.stats.v || h.stats.victorias || 0}</strong> V</span>
        <span><strong style="color:#001a6e">${h.stats.e || h.stats.empates || 0}</strong> E</span>
        <span><strong style="color:#001a6e">${h.stats.d || h.stats.derrotas || 0}</strong> D</span>
      </div>`;

      // Desglose por competición si hay (solo club, vista "all")
      if (
        !h.esSeleccion &&
        filtroCompeticion === 'all' &&
        h.statsGlobales &&
        h.statsGlobales.desglose
      ) {
        statsHtml += `<div class="timeline-breakdown-box">`;
        for (const [comp, data] of Object.entries(h.statsGlobales.desglose)) {
          statsHtml += `
          <div class="breakdown-row">
            <span class="breakdown-comp-name">${translateCompeticion ? translateCompeticion(comp) : comp}</span>
            <div class="breakdown-data-chips">
              <span class="chip"><b>${data.partidos || 0}</b> ${t('pj') || 'PJ'}</span>
              <span class="chip" style="color:#001a6e"><b>${data.victorias || 0}</b> V</span>
              <span class="chip" style="color:#001a6e"><b>${data.empates || 0}</b> E</span>
              <span class="chip" style="color:#001a6e"><b>${data.derrotas || 0}</b> D</span>
            </div>
          </div>`;
        }
        statsHtml += `</div>`;
      }

      const clases = [
        h.actual ? 'current' : '',
        h.esSeleccion ? 'seleccion-nacional' : '',
      ]
        .filter(Boolean)
        .join(' ');

      timelineHtml += `
      <div class="timeline-item ${clases}">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-club">
              <span class="team-badge">${badgeHtml}</span>
              ${h.esSeleccion ? `<i class="fas fa-flag" style="margin-right:8px; color:var(--secondary-color);"></i>` : ''}
              ${h.equipo}
            </span>
            <span class="timeline-years">${h.temporada}</span>
          </div>
          <div class="timeline-position">
            <span class="pos-label"><i class="fas fa-clipboard-list"></i></span>
            <span class="pos-name">${h.cargo}</span>
          </div>
          ${statsHtml}
        </div>
      </div>`;
    });

    // ── Sidebar totales ────────────────────────────────────────
    let totalesHtml = '';

    const mostrarTotalesClub =
      (filtroCompeticion === 'all' ||
        !filtroCompeticion.startsWith('seleccion_')) &&
      totalesClub.pj > 0;

    if (mostrarTotalesClub) {
      const pctV =
        totalesClub.pj > 0
          ? Math.round((totalesClub.v / totalesClub.pj) * 100)
          : 0;
      totalesHtml += `
      <div class="career-totals-card club-totals">
        <h3 class="card-title"><i class="fas fa-shield-alt" style="margin-right:8px;"></i>${t('total_club') || 'Total Club'}</h3>
        <div class="totals-grid">
          <div class="total-item"><span class="total-value">${totalesClub.pj}</span><span class="total-label">${t('partidos') || 'PJ'}</span></div>
          <div class="total-item highlight"><span class="total-value" style="color:#2ecc71">${totalesClub.v}</span><span class="total-label">V</span></div>
          <div class="total-item"><span class="total-value" style="color:#f39c12">${totalesClub.e}</span><span class="total-label">E</span></div>
          <div class="total-item red-card"><span class="total-value" style="color:#e74c3c">${totalesClub.d}</span><span class="total-label">D</span></div>
          <div class="total-item"><span class="total-value" style="color:${pctV >= 50 ? '#2ecc71' : pctV >= 33 ? '#f39c12' : '#e74c3c'}">${pctV}%</span><span class="total-label">${t('victorias') || 'victorias'}</span></div>
        </div>
      </div>`;
    }

    const mostrarTotalesSel =
      filtroCompeticion === 'all' || filtroCompeticion.startsWith('seleccion_');

    if (mostrarTotalesSel) {
      Object.entries(totalesSeleccion).forEach(([pais, datos]) => {
        if (datos.pj === 0) return;

        // Si hay filtro de categoría específica, mostrar solo esa
        let statsGrid = '';
        if (filtroCompeticion.startsWith('seleccion_')) {
          const catFiltro = filtroCompeticion.replace('seleccion_', '');
          const cat = datos.categorias[catFiltro];
          if (cat) {
            const pct = cat.pj > 0 ? Math.round((cat.v / cat.pj) * 100) : 0;
            statsGrid = `
              <div class="total-item" style="grid-column:1/-1; text-align:center; padding:8px; background:rgba(255,215,0,0.1); border-radius:8px; margin-bottom:5px;">
                <span style="font-weight:600; color:#001a6e;">${catFiltro} (${pais})</span>
              </div>
              <div class="total-item"><span class="total-value">${cat.pj}</span><span class="total-label">${t('partidos') || 'PJ'}</span></div>
              <div class="total-item"><span class="total-value" style="color:#2ecc71">${cat.v}</span><span class="total-label">V</span></div>
              <div class="total-item"><span class="total-value" style="color:#f39c12">${cat.e}</span><span class="total-label">E</span></div>
              <div class="total-item"><span class="total-value" style="color:#e74c3c">${cat.d}</span><span class="total-label">D</span></div>
              <div class="total-item"><span class="total-value" style="color:#2ecc71">${pct}%</span><span class="total-label">${t('victorias') || 'victorias'}</span></div>`;
          }
        } else {
          const pct = datos.pj > 0 ? Math.round((datos.v / datos.pj) * 100) : 0;
          statsGrid = `
            <div class="total-item" style="grid-column:1/-1; text-align:center; padding:8px; background:rgba(255,215,0,0.1); border-radius:8px; margin-bottom:5px;">
              <span style="font-weight:600; color:#001a6e;">${pais}</span>
            </div>
            <div class="total-item"><span class="total-value">${datos.pj}</span><span class="total-label">${t('partidos') || 'PJ'}</span></div>
            <div class="total-item"><span class="total-value" style="color:#2ecc71">${datos.v}</span><span class="total-label">V</span></div>
            <div class="total-item"><span class="total-value" style="color:#f39c12">${datos.e}</span><span class="total-label">E</span></div>
            <div class="total-item"><span class="total-value" style="color:#e74c3c">${datos.d}</span><span class="total-label">D</span></div>
            <div class="total-item"><span class="total-value" style="color:${pct >= 50 ? '#2ecc71' : '#f39c12'}">${pct}%</span><span class="total-label">${t('victorias') || 'victorias'}</span></div>`;
        }

        if (statsGrid) {
          totalesHtml += `
          <div class="career-totals-card selection-totals" style="border-top:4px solid #FFD700; margin-bottom:15px;">
            <h3 class="card-title">${datos.bandera ? `<img src="${datos.bandera}" style="height:14px;margin-right:8px;vertical-align:middle">` : `<i class="fas fa-flag" style="margin-right:8px; color:#FFD700;"></i>`}${t('total_seleccion') || 'Total Selección'}</h3>
            <div class="totals-grid">${statsGrid}</div>
          </div>`;
        }
      });
    }

    // ── Aviso baja ─────────────────────────────────────────────
    let mensajeBajaHtml = '';
    if (ent.estado === 'baja') {
      mensajeBajaHtml = `
      <div class="baja-notice" style="background:rgba(231,76,60,0.1); border-left:4px solid #e74c3c; padding:15px 20px; margin-bottom:20px; border-radius:8px;">
        <p style="margin:0; color:#c0392b; font-weight:600;">
          <i class="fas fa-info-circle" style="margin-right:8px;"></i>
          ${t('entrenador_baja_notice') || 'Este entrenador finalizó su etapa en el club en la temporada indicada.'}
        </p>
      </div>`;
    }

    container.innerHTML = `${dropdownHtml}
    ${mensajeBajaHtml}
    <div class="career-grid">
      <div class="career-timeline-card">
        <h3 class="card-title">${t('historial') || 'Trayectoria'}</h3>
        <div class="timeline">${timelineHtml || '<p>' + (t('no_datos') || 'No hay datos.') + '</p>'}</div>
      </div>
      <div class="career-sidebar">
        ${totalesHtml}
      </div>
    </div>`;

    const sel2 = document.getElementById('filterCareerEnt');
    if (sel2) {
      sel2.addEventListener('change', (e) => {
        this.renderFichaEntrenadorCareer(ent, e.target.value);
      });
    }
  },

  updateMetaTags: function (jugador) {
    let metaImage = document.querySelector('meta[property="og:image"]');
    if (!metaImage) {
      metaImage = document.createElement('meta');
      metaImage.setAttribute('property', 'og:image');
      document.head.appendChild(metaImage);
    }
    metaImage.setAttribute('content', resolverRutaImagen(jugador.imagen));
  },

  renderQuickStats: function (
    jugador,
    haFallecido,
    fechaFallecimiento,
    edadMostrar,
    esTemporadaActual,
  ) {
    const altura = jugador.altura ? `${jugador.altura}m` : t('desconocida');
    let html = '';
    if (esTemporadaActual) {
      // Solo mostrar edad y altura, los goles/encajados aparecen abajo en el grid
      html = `<div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">${t('edad')}</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">${t('altura')}</span></div>`;
    } else {
      if (haFallecido) {
        const fechaFormateada = fechaFallecimiento
          ? formatearFecha(fechaFallecimiento).completa
          : t('fecha_desconocida');
        html = `<div class="quick-stat"><span class="quick-stat-value deceased-text">${fechaFormateada}</span><span class="quick-stat-label">${t('fallecimiento')}</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">${t('altura')}</span></div><div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">${t('edad')}</span></div>`;
      } else {
        // Solo edad y altura, sin goles/encajados (ya aparecen abajo)
        html = `<div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">${t('edad')}</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">${t('altura')}</span></div>`;
      }
    }
    return html;
  },

  renderFichaOverview: function (jugador) {
    const container = document.getElementById('tabOverview');
    if (!container) return;
    const fechaNac = formatearFecha(jugador.fechaNacimiento);

    // DIFERENCIAR CÁLCULOS PARA PORTEROS
    const esPorteroPos = esPortero(jugador);
    const golesPorPartido = esPorteroPos
      ? jugador.stats.partidos > 0
        ? (jugador.stats.goles / jugador.stats.partidos).toFixed(2)
        : '0.00'
      : jugador.stats.partidos > 0
        ? (jugador.stats.goles / jugador.stats.partidos).toFixed(2)
        : '0.00';

    const minutosPorPartido =
      jugador.stats.partidos > 0
        ? Math.round(jugador.stats.minutos / jugador.stats.partidos)
        : 0;

    const golesPorcentaje =
      jugador.stats.partidos > 0
        ? Math.min((jugador.stats.goles / jugador.stats.partidos) * 100, 100)
        : 0;

    const minutosPorcentaje =
      jugador.stats.partidos > 0
        ? Math.min(
            (jugador.stats.minutos / jugador.stats.partidos / 90) * 100,
            100,
          )
        : 0;

    const rendimientoTitle = esPorteroPos
      ? t('portero_stat')
      : t('rendimiento') || 'Rendimiento';
    const golesPartidoLabel = esPorteroPos
      ? t('goles_encajados_partido') || 'Goles Encajados/Partido'
      : t('goles_partido') || 'Goles por partido';
    const golesColor = esPorteroPos ? '#e74c3c' : 'var(--secondary-color)';

    // ============================================
    // NUEVO: GENERAR FILAS SEPARADAS PARA LUGAR Y PROVINCIA
    // ============================================
    let lugarRowsHtml = '';

    // Si tiene el nuevo formato separado (ciudad y provincia diferentes)
    if (jugador.lugarNacimiento && jugador.provinciaNacimiento) {
      const ciudad = translateCity(jugador.lugarNacimiento);
      const provincia = translateProvince(jugador.provinciaNacimiento);

      // Siempre mostrar ambas filas separadas
      lugarRowsHtml += `
        <div class="info-row">
          <span class="info-label"><i class="fas fa-map-marker-alt"></i> ${t('lugar') || 'Lugar'}</span>
          <span class="info-value">${ciudad}</span>
        </div>
        <div class="info-row">
          <span class="info-label"><i class="fas fa-map-marked-alt"></i> ${t('provincia') || 'Provincia'}</span>
          <span class="info-value">${provincia}</span>
        </div>
      `;
    }
    // Fallback: formato antiguo "Ciudad, Provincia" en un solo campo
    else if (jugador.lugarNacimiento && jugador.lugarNacimiento.includes(',')) {
      const partes = jugador.lugarNacimiento.split(',').map((p) => p.trim());
      const ciudad = translateCity(partes[0]);
      const provincia = translateProvince(partes[partes.length - 1]);

      lugarRowsHtml += `
        <div class="info-row">
          <span class="info-label"><i class="fas fa-map-marker-alt"></i> ${t('lugar') || 'Lugar'}</span>
          <span class="info-value">${ciudad}</span>
        </div>
        <div class="info-row">
          <span class="info-label"><i class="fas fa-map-marked-alt"></i> ${t('provincia') || 'Provincia'}</span>
          <span class="info-value">${provincia}</span>
        </div>
      `;
    }
    // Solo ciudad, sin provincia
    else {
      const ciudad = jugador.lugarNacimiento
        ? translateCity(jugador.lugarNacimiento)
        : t('desconocida') || 'Desconocido';
      lugarRowsHtml += `
        <div class="info-row">
          <span class="info-label"><i class="fas fa-map-marker-alt"></i> ${t('lugar') || 'Lugar'}</span>
          <span class="info-value">${ciudad}</span>
        </div>
      `;
    }

    // ============================================
    // NUEVO: GENERAR FILAS SEPARADAS PARA NACIONALIDADES
    // ============================================
    let nacionalidadRowsHtml = '';
    let nacionalidadesArray = [];

    // Normalizar a array
    if (Array.isArray(jugador.nacionalidad)) {
      nacionalidadesArray = jugador.nacionalidad.map((n) =>
        translateNationalitySingle(n),
      );
    } else if (typeof jugador.nacionalidad === 'string') {
      // Si es string con comas, separar
      if (jugador.nacionalidad.includes(',')) {
        nacionalidadesArray = jugador.nacionalidad
          .split(',')
          .map((n) => translateNationality(n.trim()));
      } else {
        nacionalidadesArray = [
          translateNationalitySingle(jugador.nacionalidad),
        ];
      }
    }

    // Generar fila para cada nacionalidad
    if (nacionalidadesArray.length === 1) {
      // Una sola nacionalidad - mostrar normal
      nacionalidadRowsHtml += `
        <div class="info-row">
          <span class="info-label"><i class="fas fa-flag"></i> ${t('nacionalidad') || 'Nacionalidad'}</span>
          <span class="info-value">${nacionalidadesArray[0]}</span>
        </div>
      `;
    } else if (nacionalidadesArray.length > 1) {
      // Múltiples nacionalidades - mostrar cada una en su fila
      nacionalidadesArray.forEach((nacionalidad, index) => {
        const label =
          index === 0
            ? t('nacionalidad') || 'Nacionalidad'
            : t('nacionalidad_adicional') || 'Nacionalidad';
        nacionalidadRowsHtml += `
          <div class="info-row">
            <span class="info-label"><i class="fas fa-flag"></i> ${label}</span>
            <span class="info-value">${nacionalidad}</span>
          </div>
        `;
      });
    } else {
      // Sin nacionalidad
      nacionalidadRowsHtml += `
        <div class="info-row">
          <span class="info-label"><i class="fas fa-flag"></i> ${t('nacionalidad') || 'Nacionalidad'}</span>
          <span class="info-value">${t('desconocida') || 'Desconocida'}</span>
        </div>
      `;
    }

    // ============================================
    // NUEVO: GENERAR FILAS DE ESTADO EN EL CLUB
    // ============================================
    let estadoClubHtml = '';
    {
      const urlParams = new URLSearchParams(window.location.search);
      const currentSeasonId =
        (window.PLAYER_DATA_STATIC && window.PLAYER_DATA_STATIC.season) ||
        urlParams.get('season') ||
        CLUB_DATA.temporadaActual;
      const esBajaEnTemporadaActual =
        currentSeasonId === CLUB_DATA.temporadaActual;

      const _estados = normalizarEstados(jugador);
      const _cedido = _estados.find((e) => e.tipo === 'cedido');
      const _baja = _estados.find((e) => e.tipo === 'baja');

      if (_cedido) {
        estadoClubHtml += `
          <div class="info-row cedido-row">
            <span class="info-label"><i class="fas fa-exchange-alt"></i> ${t('estado') || 'Estado'}</span>
            <span class="info-value cedido-value">${t('cedido') || 'Cedido'}</span>
          </div>
          ${
            _cedido.club
              ? _cedido.club
                  .split(',')
                  .map(
                    (club, i) => `
          <div class="info-row">
            <span class="info-label">${i === 0 ? `<i class="fas fa-shield-alt"></i> ${t('cedido_en') || 'Cedido en'}` : ''}</span>
            <span class="info-value">${club.trim()}</span>
          </div>`,
                  )
                  .join('')
              : ''
          }
        `;
      }

      if (_baja) {
        estadoClubHtml += `
          <div class="info-row baja-row baja-temp-row">
            <span class="info-label"><i class="fas fa-door-open"></i> ${t('estado') || 'Estado'}</span>
            <span class="info-value baja-temp-value">${esBajaEnTemporadaActual ? t('baja_temporada') || 'Baja durante temporada' : t('ex_jugador') || 'Ex jugador'}</span>
          </div>
        `;
      }

      // Siempre mostrar fechas de contrato
      estadoClubHtml += `
        <div class="info-row">
          <span class="info-label"><i class="far fa-calendar-check"></i> ${t('en_club_desde') || 'En club desde'}</span>
          <span class="info-value">${jugador.enClubDesde}</span>
        </div>
        ${
          jugador.contratoHasta
            ? `
        <div class="info-row">
          <span class="info-label"><i class="far fa-calendar-alt"></i> ${t('contrato_hasta') || 'Contrato hasta'}</span>
          <span class="info-value">${jugador.contratoHasta}</span>
        </div>`
            : ''
        }
      `;
    }

    container.innerHTML = `
            <div class="overview-grid">
                <div class="performance-card">
                    <h3 class="card-title">${rendimientoTitle}</h3>
                    <div class="performance-stats">
                        <div class="performance-item"><div class="performance-header"><span>${golesPartidoLabel}</span><span class="performance-value" style="color:${golesColor}">${golesPorPartido}</span></div><div class="performance-bar"><div class="performance-fill" style="width: ${golesPorcentaje}%; background:${golesColor}"></div></div></div>
                        <div class="performance-item"><div class="performance-header"><span>${t('minutos_partido') || 'Minutos por partido'}</span><span class="performance-value">${minutosPorPartido}'</span></div><div class="performance-bar"><div class="performance-fill" style="width: ${minutosPorcentaje}%"></div></div></div>
                    </div>
                </div>
                <div class="personal-info-card">
                    <h3 class="card-title">${t('informacion') || 'Información Personal'}</h3>
                    <div class="personal-info-list">
                        <div class="info-row"><span class="info-label"><i class="far fa-calendar"></i> ${t('nacimiento') || 'Nacimiento'}</span><span class="info-value">${fechaNac.completa}</span></div>
                        ${lugarRowsHtml}
                        ${nacionalidadRowsHtml}
                        ${estadoClubHtml}
                    </div>
                </div>
                <div class="disciplinary-card">
                    <h3 class="card-title">${t('disciplina') || 'Disciplina'}</h3>
                    <div class="cards-display">
                        <div class="card-item yellow"><div class="card-icon"><i class="fas fa-square"></i></div><div class="card-info"><span class="card-count">${jugador.stats.amarillas ?? 0}</span><span class="card-label">${t('amarillas') || 'Amarillas'}</span></div></div>
                        <div class="card-item red"><div class="card-icon"><i class="fas fa-square"></i></div><div class="card-info"><span class="card-count">${jugador.stats.rojas ?? 0}</span><span class="card-label">${t('rojas') || 'Rojas'}</span></div></div>
                    </div>
                </div>
            </div>`;
  },

  renderFichaMatches: function (
    jugador,
    currentSeasonId,
    filtroTemporada = 'all',
    filtroCompeticion = 'all',
    filtroTipoPartido = 'all',
  ) {
    const container = document.getElementById('tabMatches');
    if (!container) return;

    const buscaId = String(jugador.id || '');
    const buscaCodigo = String(jugador.codigo || jugador.id || '');
    const nombreClub =
      CLUB_DATA.club.nombre || CLUB_DATA.club.nombreCorto || '';
    const esPorteroPos = esPortero(jugador);

    // ── 1. AGREGAR PARTIDOS DE TODAS LAS TEMPORADAS ──────────────
    // Cada partido lleva _temporadaId y _temporadaNombre para poder filtrar.
    const todosLosPartidos = [];
    const temporadasConPartidos = []; // [{id, nombre}] para el selector

    CLUB_DATA.temporadasDisponibles.forEach((temp) => {
      const datosTemp = CLUB_DATA.temporadas[temp.id];
      if (!datosTemp) return;

      // Buscar al jugador en esta temporada
      const jugadorEnTemp = datosTemp.jugadores
        ? datosTemp.jugadores.find(
            (j) =>
              String(j.id) === buscaId ||
              String(j.codigo) === buscaCodigo ||
              String(j.id) === buscaCodigo ||
              String(j.codigo) === buscaId,
          )
        : null;

      if (!jugadorEnTemp) return;

      // Solo incluir si tiene partidos individuales definidos (array, aunque vacío)
      const tienePartidos =
        jugadorEnTemp.partidos !== null && jugadorEnTemp.partidos !== undefined;
      if (!tienePartidos) return;

      // Marcar cada partido con metadatos de temporada
      const partidos = jugadorEnTemp.partidos.map((p) => ({
        ...p,
        _temporadaId: temp.id,
        _temporadaNombre: temp.nombre,
        _tieneIndividual: true,
      }));

      if (partidos.length > 0) {
        temporadasConPartidos.push({ id: temp.id, nombre: temp.nombre });
        todosLosPartidos.push(...partidos);
      }
    });

    // Ordenar de más reciente a más antiguo por fecha
    todosLosPartidos.sort((a, b) => {
      if (!a.fecha || !b.fecha) return 0;
      return new Date(b.fecha) - new Date(a.fecha);
    });

    if (todosLosPartidos.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:#666; padding: 20px;">${t('no_datos_partidos') || 'No hay datos de partidos para este jugador.'}</p>`;
      return;
    }

    // ── 2. CONSTRUIR LISTAS DE OPCIONES ──────────────────────────
    // Temporadas disponibles (las que tienen partidos)
    const temporadasOpts = temporadasConPartidos;

    // Competiciones disponibles (dentro de la temporada filtrada)
    const partidosPorTemp =
      filtroTemporada === 'all'
        ? todosLosPartidos
        : todosLosPartidos.filter((p) => p._temporadaId === filtroTemporada);

    const competicionesSet = new Set(
      partidosPorTemp.map((p) => p.competicion).filter(Boolean),
    );
    const competicionesOpts = Array.from(competicionesSet).sort();

    // Resetear filtro de competición si ya no existe en la nueva temporada
    const compValida =
      filtroCompeticion === 'all' || competicionesSet.has(filtroCompeticion);
    const compEfectiva = compValida ? filtroCompeticion : 'all';

    // ── 3. APLICAR FILTROS ────────────────────────────────────────
    const porTemporada = partidosPorTemp;

    const porCompeticion =
      compEfectiva === 'all'
        ? porTemporada
        : porTemporada.filter((p) => p.competicion === compEfectiva);

    const aplicarTipo = (lista, tipo) => {
      if (tipo === 'all') return lista;
      return lista.filter((p) => {
        switch (tipo) {
          case 'victoria':
            return p.resultado === 'V';
          case 'empate':
            return p.resultado === 'E';
          case 'derrota':
            return p.resultado === 'D';
          case 'local':
            return p.local === nombreClub || p.condicion === 'local';
          case 'visitante':
            return p.visitante === nombreClub || p.condicion === 'visitante';
          default:
            return true;
        }
      });
    };

    const partidosFiltrados = aplicarTipo(porCompeticion, filtroTipoPartido);

    // ── 4. PILLS DE TIPO ──────────────────────────────────────────
    const hayCondicion = porTemporada.some(
      (p) =>
        p.local === nombreClub || p.visitante === nombreClub || p.condicion,
    );

    const tipoPills = [
      {
        key: 'all',
        label: t('todos') || 'Todos',
        icon: 'fa-list',
        color: '#001a6e',
      },
      {
        key: 'victoria',
        label: t('victorias') || 'Victorias',
        icon: 'fa-check-circle',
        color: '#27ae60',
      },
      {
        key: 'empate',
        label: t('empates') || 'Empates',
        icon: 'fa-minus-circle',
        color: '#f39c12',
      },
      {
        key: 'derrota',
        label: t('derrotas') || 'Derrotas',
        icon: 'fa-times-circle',
        color: '#e74c3c',
      },
      ...(hayCondicion
        ? [
            {
              key: 'local',
              label: t('local') || 'Local',
              icon: 'fa-home',
              color: '#2980b9',
            },
            {
              key: 'visitante',
              label: t('visitante') || 'Visitante',
              icon: 'fa-plane',
              color: '#8e44ad',
            },
          ]
        : []),
    ];

    const pillsHtml = tipoPills
      .map(({ key, label, icon, color }) => {
        const count =
          key === 'all'
            ? porCompeticion.length
            : aplicarTipo(porCompeticion, key).length;
        const isActive = key === filtroTipoPartido;
        return `<button class="match-tipo-pill ${isActive ? 'active' : ''}" data-tipo="${key}" style="--pill-color:${color}">
        <i class="fas ${icon}"></i> ${label}${key !== 'all' ? ` <span class="pill-count">${count}</span>` : ''}
      </button>`;
      })
      .join('');

    // ── 5. SELECTORES HTML ────────────────────────────────────────
    const selectStyle = `padding:8px 12px; border-radius:6px; border:1px solid #ccd6ff; background:#f0f4ff; color:#001a6e; font-family:'Source Sans 3',sans-serif; font-weight:600; cursor:pointer; outline:none;`;

    const tempOptsHtml = [
      `<option value="all" ${filtroTemporada === 'all' ? 'selected' : ''}>${t('todas_temporadas') || 'Todas las temporadas'}</option>`,
      ...temporadasOpts.map(
        (t2) =>
          `<option value="${t2.id}" ${filtroTemporada === t2.id ? 'selected' : ''}>${t2.nombre}</option>`,
      ),
    ].join('');

    const compOptsHtml = [
      `<option value="all" ${compEfectiva === 'all' ? 'selected' : ''}>${t('todas_competiciones') || 'Todas las competiciones'}</option>`,
      ...competicionesOpts.map(
        (c) =>
          `<option value="${c}" ${compEfectiva === c ? 'selected' : ''}>${translateCompeticion(c)}</option>`,
      ),
    ].join('');

    // ── 6. RENDERIZAR CARDS ───────────────────────────────────────
    const renderCard = (partido) => {
      const fecha = formatearFecha(partido.fecha);
      const resultClass =
        partido.resultado === 'V'
          ? 'win'
          : partido.resultado === 'E'
            ? 'draw'
            : 'loss';
      const compNombre = partido.competicion || '';
      const jorTexto =
        typeof partido.jornada === 'number'
          ? `${t('jornada_abrev')}${partido.jornada}`
          : t(
              `copa_ronda_${String(partido.jornada)
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[().]/g, '')
                .replace(/[-\s]+/g, '_')
                .replace(/_+/g, '_')}`,
            ) || partido.jornada;

      // Chips de stats individuales
      const chips = [];
      if (partido.minutos !== undefined)
        chips.push(
          `<span class="match-chip"><i class="fas fa-clock"></i> ${partido.minutos}'</span>`,
        );
      if (partido.goles > 0) {
        const goalChipClass = esPorteroPos ? 'chip-conceded' : 'chip-goal';
        const goalIcon = esPorteroPos ? 'fa-shield-alt' : 'fa-futbol';
        const goalText = esPorteroPos
          ? t('goles_encajados_abrev')
          : partido.goles > 1
            ? partido.goles + ' ' + t('goles')
            : t('gol');
        chips.push(
          `<span class="match-chip ${goalChipClass}"><i class="fas ${goalIcon}"></i> ${partido.goles} ${goalText}</span>`,
        );
      }
      if (partido.asistencias > 0)
        chips.push(
          `<span class="match-chip chip-assist"><i class="fas fa-hands-helping"></i> ${partido.asistencias > 1 ? partido.asistencias + ' ' + t('asistencias') : t('asistencia')}</span>`,
        );
      if (partido.amarilla)
        chips.push(
          `<span class="match-chip chip-yellow"><i class="fas fa-square"></i></span>`,
        );
      if (partido.roja)
        chips.push(
          `<span class="match-chip chip-red"><i class="fas fa-square"></i></span>`,
        );
      const playerStatsHtml =
        chips.length > 0
          ? `<div class="match-player-chips">${chips.join('')}</div>`
          : '';

      const tienePenaltis =
        partido.penaltisLocal !== undefined &&
        partido.penaltisVisitante !== undefined;
      const tieneProrroga = partido.minutos && partido.minutos > 90;
      const aetBadge = tieneProrroga
        ? ` <span class="match-score-aet">${t('prorroga') || 'p.p.'}</span>`
        : '';
      const pensBadge = tienePenaltis
        ? ` <span class="match-score-pens">(${partido.penaltisLocal}-${partido.penaltisVisitante} pen.)</span>`
        : '';

      // Badge de temporada (solo visible si se muestran varias)
      const tempBadge =
        filtroTemporada === 'all'
          ? `<span class="match-season-tag">${partido._temporadaNombre}</span>`
          : '';

      return `
        <article class="match-detail-card">
          <div class="match-detail-header">
            <div class="match-date-badge ${resultClass}">
              <span class="match-day">${fecha.dia}</span>
              <span class="match-month">${fecha.mesCorto}</span>
            </div>
            <div class="match-competition-info">
              <span class="competition-name">
                ${translateCompeticion(compNombre)} · ${jorTexto}
                ${tempBadge}
              </span>
              <div class="match-teams-result">
                <span class="team-home">${partido.local}</span>
                <span class="match-score">${partido.golesLocal} - ${partido.golesVisitante}${aetBadge}${pensBadge}</span>
                <span class="team-away">${partido.visitante}</span>
              </div>
              ${playerStatsHtml}
            </div>
          </div>
        </article>`;
    };

    // ── 7. MONTAR HTML ────────────────────────────────────────────
    let html = `
      <div class="matches-filter-bar">
        <div class="matches-comp-row">
          ${
            temporadasOpts.length > 1
              ? `<label style="font-weight:600;color:#333;">${t('temporada') || 'Temporada'}:</label>
               <select id="filterMatchesSeason" style="${selectStyle}">${tempOptsHtml}</select>`
              : ''
          }
          <label style="font-weight:600;color:#333;">${t('competicion_label') || 'Competición'}:</label>
          <select id="filterMatches" style="${selectStyle}">${compOptsHtml}</select>
        </div>
        <div class="matches-tipo-pills">${pillsHtml}</div>
      </div>
      <div class="matches-list">`;

    if (partidosFiltrados.length === 0) {
      html += `<p style="text-align:center;color:#666;padding:20px;width:100%;">${t('no_partidos_competicion') || 'No hay partidos en esta combinación de filtros.'}</p>`;
    } else {
      partidosFiltrados.forEach((p) => {
        html += renderCard(p);
      });
    }

    html += '</div>';
    container.innerHTML = html;

    // ── 9. LISTENERS ──────────────────────────────────────────────
    const seasonSel = document.getElementById('filterMatchesSeason');
    if (seasonSel) {
      seasonSel.addEventListener('change', (e) => {
        const compActiva =
          document.getElementById('filterMatches')?.value || 'all';
        const tipoActivo =
          container.querySelector('.match-tipo-pill.active')?.dataset.tipo ||
          'all';
        this.renderFichaMatches(
          jugador,
          currentSeasonId,
          e.target.value,
          compActiva,
          tipoActivo,
        );
      });
    }

    const compSel = document.getElementById('filterMatches');
    if (compSel) {
      compSel.addEventListener('change', (e) => {
        const tempActiva =
          document.getElementById('filterMatchesSeason')?.value || 'all';
        const tipoActivo =
          container.querySelector('.match-tipo-pill.active')?.dataset.tipo ||
          'all';
        this.renderFichaMatches(
          jugador,
          currentSeasonId,
          tempActiva,
          e.target.value,
          tipoActivo,
        );
      });
    }

    container.querySelectorAll('.match-tipo-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tempActiva =
          document.getElementById('filterMatchesSeason')?.value || 'all';
        const compActiva =
          document.getElementById('filterMatches')?.value || 'all';
        this.renderFichaMatches(
          jugador,
          currentSeasonId,
          tempActiva,
          compActiva,
          btn.dataset.tipo,
        );
      });
    });
  },

  renderFichaCareerHistory: function (
    jugadorActual,
    currentSeasonId,
    filtroCompeticion = 'all',
    filtroTipo = 'all',
  ) {
    const container = document.getElementById('tabCareer');
    if (!container) return;

    const buscaId = String(jugadorActual.id || '');
    const buscaCodigo = String(jugadorActual.codigo || jugadorActual.id || '');
    const esPorteroActual = esPortero(jugadorActual);

    const historial = [];

    // TOTALES SEPARADOS: Club vs Selección (ahora por país)
    let totalesClub = {
      partidos: 0,
      goles: 0,
      asistencias: 0,
      amarillas: 0,
      rojas: 0,
      minutos: 0,
    };

    // Totales de selección separados por país
    let totalesSeleccionPorPais = {};

    const competicionesSet = new Set();

    // ============================================
    // DETECTAR SI HAY MÚLTIPLES SELECCIONES
    // ============================================
    const tieneOtrasSelecciones =
      jugadorActual.otrasSelecciones &&
      jugadorActual.otrasSelecciones.length > 0 &&
      jugadorActual.otrasSelecciones.some((s) => s.datos && s.datos.length > 0);

    const esMultiplesSelecciones = tieneOtrasSelecciones;

    // ============================================
    // PROCESAR SELECCIÓN NACIONAL PRINCIPAL
    // ============================================
    if (
      filtroTipo !== 'club' &&
      jugadorActual.seleccion &&
      jugadorActual.seleccion.datos
    ) {
      const sel = jugadorActual.seleccion;
      const paisPrincipal = translateCountry(sel.pais);

      // Inicializar totales para este país
      if (!totalesSeleccionPorPais[paisPrincipal]) {
        totalesSeleccionPorPais[paisPrincipal] = {
          partidos: 0,
          goles: 0,
          asistencias: 0,
          amarillas: 0,
          rojas: 0,
          minutos: 0,
          categorias: {},
          bandera: sel.bandera,
        };
      }

      sel.datos.forEach((cat) => {
        // Si hay múltiples selecciones, añadir país al nombre
        const nombreCompeticion = `Selección ${cat.categoria} (${paisPrincipal})`;
        competicionesSet.add(nombreCompeticion);

        // Guardar en totales por categoría
        if (!totalesSeleccionPorPais[paisPrincipal].categorias[cat.categoria]) {
          totalesSeleccionPorPais[paisPrincipal].categorias[cat.categoria] = {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            amarillas: 0,
            rojas: 0,
            minutos: 0,
          };
        }
        totalesSeleccionPorPais[paisPrincipal].categorias[
          cat.categoria
        ].partidos += cat.partidos || 0;
        totalesSeleccionPorPais[paisPrincipal].categorias[
          cat.categoria
        ].goles += cat.goles || 0;
        totalesSeleccionPorPais[paisPrincipal].categorias[
          cat.categoria
        ].asistencias += cat.asistencias || 0;
        totalesSeleccionPorPais[paisPrincipal].categorias[
          cat.categoria
        ].amarillas += cat.amarillas || 0;
        totalesSeleccionPorPais[paisPrincipal].categorias[
          cat.categoria
        ].rojas += cat.rojas || 0;
        totalesSeleccionPorPais[paisPrincipal].categorias[
          cat.categoria
        ].minutos += cat.minutos || 0;

        // Totales por país
        totalesSeleccionPorPais[paisPrincipal].partidos += cat.partidos || 0;
        totalesSeleccionPorPais[paisPrincipal].goles += cat.goles || 0;
        totalesSeleccionPorPais[paisPrincipal].asistencias +=
          cat.asistencias || 0;
        totalesSeleccionPorPais[paisPrincipal].amarillas += cat.amarillas || 0;
        totalesSeleccionPorPais[paisPrincipal].rojas += cat.rojas || 0;
        totalesSeleccionPorPais[paisPrincipal].minutos += cat.minutos || 0;

        historial.push({
          temporada:
            t('sel_' + cat.categoria.toLowerCase().replace('-', '')) ||
            cat.categoria,
          equipo: paisPrincipal,
          logo: sel.bandera,
          esSeleccion: true,
          esSeleccionPrincipal: true,
          categoriaSeleccion: cat.categoria,
          paisSeleccion: paisPrincipal,
          competicionFiltro: nombreCompeticion,
          stats: {
            partidos: cat.partidos || 0,
            goles: cat.goles || 0,
            asistencias: cat.asistencias || 0,
            amarillas: cat.amarillas || 0,
            rojas: cat.rojas || 0,
            minutos: cat.minutos || 0,
          },
          dorsal: '-',
          posicion: jugadorActual.posicion || 'Jugador',
          actual: false,
          statsGlobales: null,
          esPortero: esPorteroActual,
        });
      });
    }

    // ============================================
    // PROCESAR OTRAS SELECCIONES
    // ============================================
    if (
      filtroTipo !== 'club' &&
      jugadorActual.otrasSelecciones &&
      Array.isArray(jugadorActual.otrasSelecciones)
    ) {
      jugadorActual.otrasSelecciones.forEach((otraSel) => {
        if (!otraSel.datos || !Array.isArray(otraSel.datos)) return;

        const paisOtra = translateCountry(otraSel.pais);
        const banderaOtra = otraSel.bandera;

        // Inicializar totales para este país
        if (!totalesSeleccionPorPais[paisOtra]) {
          totalesSeleccionPorPais[paisOtra] = {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            amarillas: 0,
            rojas: 0,
            minutos: 0,
            categorias: {},
            bandera: banderaOtra,
          };
        }

        otraSel.datos.forEach((cat) => {
          const nombreCompeticion = `Selección ${cat.categoria} (${paisOtra})`;
          competicionesSet.add(nombreCompeticion);

          // Guardar en totales por categoría
          if (!totalesSeleccionPorPais[paisOtra].categorias[cat.categoria]) {
            totalesSeleccionPorPais[paisOtra].categorias[cat.categoria] = {
              partidos: 0,
              goles: 0,
              asistencias: 0,
              amarillas: 0,
              rojas: 0,
              minutos: 0,
            };
          }
          totalesSeleccionPorPais[paisOtra].categorias[
            cat.categoria
          ].partidos += cat.partidos || 0;
          totalesSeleccionPorPais[paisOtra].categorias[cat.categoria].goles +=
            cat.goles || 0;
          totalesSeleccionPorPais[paisOtra].categorias[
            cat.categoria
          ].asistencias += cat.asistencias || 0;
          totalesSeleccionPorPais[paisOtra].categorias[
            cat.categoria
          ].amarillas += cat.amarillas || 0;
          totalesSeleccionPorPais[paisOtra].categorias[cat.categoria].rojas +=
            cat.rojas || 0;
          totalesSeleccionPorPais[paisOtra].categorias[cat.categoria].minutos +=
            cat.minutos || 0;

          // Totales por país
          totalesSeleccionPorPais[paisOtra].partidos += cat.partidos || 0;
          totalesSeleccionPorPais[paisOtra].goles += cat.goles || 0;
          totalesSeleccionPorPais[paisOtra].asistencias += cat.asistencias || 0;
          totalesSeleccionPorPais[paisOtra].amarillas += cat.amarillas || 0;
          totalesSeleccionPorPais[paisOtra].rojas += cat.rojas || 0;
          totalesSeleccionPorPais[paisOtra].minutos += cat.minutos || 0;

          historial.push({
            temporada:
              t('sel_' + cat.categoria.toLowerCase().replace('-', '')) ||
              cat.categoria,
            equipo: paisOtra,
            logo: banderaOtra,
            esSeleccion: true,
            categoriaSeleccion: cat.categoria,
            paisSeleccion: paisOtra,
            competicionFiltro: nombreCompeticion,
            stats: {
              partidos: cat.partidos || 0,
              goles: cat.goles || 0,
              asistencias: cat.asistencias || 0,
              amarillas: cat.amarillas || 0,
              rojas: cat.rojas || 0,
              minutos: cat.minutos || 0,
            },
            dorsal: '-',
            posicion: jugadorActual.posicion || 'Jugador',
            actual: false,
            statsGlobales: null,
            esPortero: esPorteroActual,
          });
        });
      });
    }

    // RECORRER TEMPORADAS DEL CLUB
    if (filtroTipo !== 'seleccion') {
      CLUB_DATA.temporadasDisponibles.forEach((temp) => {
        const datosTemporada = CLUB_DATA.temporadas[temp.id];
        if (!datosTemporada) return;

        const jugadorEnTemporada = datosTemporada.jugadores.find(
          (j) =>
            String(j.id) === buscaId ||
            String(j.codigo) === buscaCodigo ||
            String(j.id) === buscaCodigo ||
            String(j.codigo) === buscaId,
        );

        if (!jugadorEnTemporada) return;
        autoCalcularStatsJugador(jugadorEnTemporada);
        const datosMaestro =
          CLUB_DATA.jugadoresMaestro[jugadorEnTemporada.codigo] || {};
        const compNombre =
          datosTemporada.competicion || t('competicion_label') || 'Competición';
        const esPorteroTemp = esPortero({
          ...datosMaestro,
          ...jugadorEnTemporada,
        });

        if (jugadorEnTemporada.stats.desglose) {
          Object.keys(jugadorEnTemporada.stats.desglose).forEach((c) =>
            competicionesSet.add(c),
          );
        }

        competicionesSet.add(compNombre);

        let statsAMostrar = { ...jugadorEnTemporada.stats };
        let mostrarEstaTemporada = true;

        if (filtroCompeticion !== 'all') {
          const esFiltroSeleccion = filtroCompeticion.startsWith('Selección');

          if (esFiltroSeleccion) {
            mostrarEstaTemporada = false;
          } else {
            if (
              jugadorEnTemporada.stats.desglose &&
              jugadorEnTemporada.stats.desglose[filtroCompeticion]
            ) {
              statsAMostrar =
                jugadorEnTemporada.stats.desglose[filtroCompeticion];
            } else if (compNombre !== filtroCompeticion) {
              mostrarEstaTemporada = false;
            }
          }
        }

        if (mostrarEstaTemporada) {
          historial.push({
            temporada: temp.nombre,
            equipo: CLUB_DATA.club.nombreCorto,
            logo: CLUB_DATA.club.logo || '',
            esSeleccion: false,
            competicionFiltro: compNombre,
            stats: statsAMostrar,
            statsGlobales: jugadorEnTemporada.stats,
            dorsal: jugadorEnTemporada.dorsal,
            posicion:
              datosMaestro.posicion ||
              jugadorEnTemporada.posicion ||
              'Desconocida',
            actual: temp.id === currentSeasonId,
            esPortero: esPorteroTemp,
          });

          totalesClub.partidos += statsAMostrar.partidos || 0;
          totalesClub.goles += statsAMostrar.goles || 0;
          totalesClub.asistencias += statsAMostrar.asistencias || 0;
          totalesClub.amarillas += statsAMostrar.amarillas || 0;
          totalesClub.rojas += statsAMostrar.rojas || 0;
          totalesClub.minutos += statsAMostrar.minutos || 0;
        }
      });
    } // fin if filtroTipo !== 'seleccion'

    // FILTRAR HISTORIAL
    let historialFiltrado = historial;
    if (
      filtroCompeticion !== 'all' &&
      filtroCompeticion.startsWith('Selección')
    ) {
      historialFiltrado = historial.filter(
        (h) => h.esSeleccion && h.competicionFiltro === filtroCompeticion,
      );
    } else if (filtroCompeticion !== 'all') {
      historialFiltrado = historial.filter((h) => !h.esSeleccion);
    }

    // DETECTAR SI EL JUGADOR YA NO ESTÁ EN EL CLUB
    const yaNoEstaEnClub = jugadorActual.estado === 'baja';

    // GENERAR HTML DEL TIMELINE
    let timelineHtml = '';
    historialFiltrado.forEach((h) => {
      const badgeHtml = h.logo
        ? `<img src="${h.logo}" alt="Logo" class="team-badge-img">`
        : `<span class="team-badge-text">OVI</span>`;

      const golesLabelTimeline = h.esPortero
        ? t('goles_encajados_abrev')
        : t('goles');
      const golesStyleTimeline = h.esPortero
        ? 'style="color:#e74c3c;font-weight:700"'
        : '';

      let statsHtml = `<div class="timeline-stats">
      <span><strong>${h.stats.partidos}</strong> ${t('partidos')}</span>
      <span><strong ${golesStyleTimeline}>${h.stats.goles}</strong> ${golesLabelTimeline}</span>
      <span><strong>${h.stats.asistencias}</strong> ${t('asistencias')}</span>
    </div>`;

      if (
        !h.esSeleccion &&
        filtroCompeticion === 'all' &&
        h.statsGlobales &&
        h.statsGlobales.desglose
      ) {
        statsHtml += `<div class="timeline-breakdown-box">`;
        for (const [comp, data] of Object.entries(h.statsGlobales.desglose)) {
          const concedeStyle = h.esPortero ? 'style="color:#e74c3c"' : '';
          const goalLabel = h.esPortero ? t('goles_encajados_abrev') : 'G';
          const compTraducida = translateCompeticion(comp);
          statsHtml += `
          <div class="breakdown-row">
            <span class="breakdown-comp-name">${compTraducida}</span>
            <div class="breakdown-data-chips">
              <span class="chip"><b>${data.partidos}</b> ${t('pj')}</span>
              <span class="chip" ${concedeStyle}><b>${data.goles}</b> ${goalLabel}</span>
              <span class="chip chip-yellow"><b>${data.amarillas || 0}</b> <i class="fas fa-square"></i></span>
              ${data.rojas > 0 ? `<span class="chip chip-red"><b>${data.rojas}</b> <i class="fas fa-square"></i></span>` : ''}
            </div>
          </div>`;
        }
        statsHtml += `</div>`;
      }

      let clasesTimeline = '';
      if (h.actual) {
        clasesTimeline += 'current ';
        if (yaNoEstaEnClub) {
          clasesTimeline += 'finalizado ';
        }
      }
      if (h.esSeleccion) {
        clasesTimeline += 'seleccion-nacional ';
      }

      timelineHtml += `
      <div class="timeline-item ${clasesTimeline.trim()}">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-club">
              <span class="team-badge">${badgeHtml}</span>
              ${h.esSeleccion ? `<i class="fas fa-flag" style="margin-right: 8px; color: var(--secondary-color);"></i>` : ''}
              ${h.equipo}
            </span>
            <span class="timeline-years">${h.temporada}</span>
          </div>
          <div class="timeline-position">
            <span class="pos-label"><i class="fas fa-tshirt"></i> #${h.dorsal}</span>
            <span class="pos-name">${translatePosition(h.posicion)}</span>
          </div>
          ${statsHtml}
        </div>
      </div>`;
    });

    // MENSAJE SI EL JUGADOR YA NO ESTÁ EN EL CLUB
    let mensajeBajaHtml = '';
    if (yaNoEstaEnClub) {
      mensajeBajaHtml = `
      <div class="baja-notice" style="background: rgba(231, 76, 60, 0.1); border-left: 4px solid #e74c3c; padding: 15px 20px; margin-bottom: 20px; border-radius: 8px;">
        <p style="margin: 0; color: #c0392b; font-weight: 600;">
          <i class="fas fa-info-circle" style="margin-right: 8px;"></i>
          ${t('jugador_baja_notice') || 'Este jugador finalizó su etapa en el club en la temporada indicada.'}
        </p>
      </div>
    `;
    }

    // CONSTRUIR DROPDOWN
    const listaComps = Array.from(competicionesSet).sort();
    const paisesSeleccion = Object.keys(totalesSeleccionPorPais);
    const tieneSeleccion = paisesSeleccion.length > 0;
    const tieneClub = historial.some((h) => !h.esSeleccion);

    const selectStyle = `padding:8px 12px; border-radius:6px; border:1px solid #ccd6ff; background:#f0f4ff; color:#001a6e; font-family:'Source Sans 3',sans-serif; font-weight:600; cursor:pointer; outline:none;`;

    // Select tipo (Todo / Club / Selección)
    let tipoOpts = `<option value="all" ${filtroTipo === 'all' ? 'selected' : ''}>${t('todo') || 'Todo'}</option>`;
    if (tieneClub)
      tipoOpts += `<option value="club" ${filtroTipo === 'club' ? 'selected' : ''}>${t('club') || 'Club'}</option>`;
    if (tieneSeleccion)
      tipoOpts += `<option value="seleccion" ${filtroTipo === 'seleccion' ? 'selected' : ''}>${t('seleccion_nacional') || 'Selección'}</option>`;

    // Select competición (respetando filtroTipo activo)
    let compOpts = `<option value="all" ${filtroCompeticion === 'all' ? 'selected' : ''}>${t('todas_competiciones') || 'Todas las competiciones'}</option>`;

    if (filtroTipo !== 'seleccion' && tieneClub) {
      compOpts += `<optgroup label="${t('club') || 'Club'}">`;
      listaComps
        .filter((c) => !c.startsWith('Selección'))
        .forEach((c) => {
          compOpts += `<option value="${c}" ${c === filtroCompeticion ? 'selected' : ''}>${translateCompeticion(c)}</option>`;
        });
      compOpts += `</optgroup>`;
    }

    if (filtroTipo !== 'club' && tieneSeleccion) {
      compOpts += `<optgroup label="${t('seleccion_nacional') || 'Selección Nacional'}">`;
      listaComps
        .filter((c) => c.startsWith('Selección'))
        .forEach((c) => {
          const match = c.match(/Selección (.+) \((.+)\)/);
          if (match) {
            const cat = match[1];
            const pais = match[2];
            const catTraducida =
              t('sel_' + cat.toLowerCase().replace('-', '')) || cat;
            compOpts += `<option value="${c}" ${c === filtroCompeticion ? 'selected' : ''}>${catTraducida} (${pais})</option>`;
          }
        });
      compOpts += `</optgroup>`;
    }

    let dropdownHtml = `<div class="filter-container" style="display:flex; justify-content:flex-end; margin-bottom:20px; align-items:center; gap:12px; flex-wrap:wrap;">
      <label style="font-weight:600; color:#333;">${t('tipo') || 'Tipo'}:</label>
      <select id="filterCareerTipo" style="${selectStyle}">${tipoOpts}</select>
      <label style="font-weight:600; color:#333;">${t('competicion_label') || 'Competición'}:</label>
      <select id="filterCareer" style="${selectStyle}">${compOpts}</select>
    </div>`;

    // GENERAR TARJETAS DE TOTALES
    let totalesHtml = '';

    // Totales de Club
    const mostrarTotalesClub =
      (filtroCompeticion === 'all' ||
        !filtroCompeticion.startsWith('Selección')) &&
      totalesClub.partidos > 0;

    if (mostrarTotalesClub) {
      const golesLabelTotal = esPorteroActual
        ? t('goles_encajados_corto')
        : t('goles');
      const golesStyleTotal = esPorteroActual ? 'style="color:#e74c3c"' : '';

      totalesHtml += `
      <div class="career-totals-card club-totals">
        <h3 class="card-title"><i class="fas fa-shield-alt" style="margin-right: 8px;"></i>${t('total_club') || 'Total Club'}</h3>
        <div class="totals-grid">
          <div class="total-item"><span class="total-value">${totalesClub.partidos}</span><span class="total-label">${t('partidos')}</span></div>
          <div class="total-item highlight" ${golesStyleTotal}><span class="total-value" ${golesStyleTotal}>${totalesClub.goles}</span><span class="total-label">${golesLabelTotal}</span></div>
          <div class="total-item"><span class="total-value">${totalesClub.asistencias}</span><span class="total-label">${t('asistencias')}</span></div>
          <div class="total-item yellow-card"><span class="total-value">${totalesClub.amarillas}</span><span class="total-label">${t('amarillas')}</span></div>
          <div class="total-item red-card"><span class="total-value">${totalesClub.rojas}</span><span class="total-label">${t('rojas')}</span></div>
          <div class="total-item minutes"><span class="total-value">${totalesClub.minutos.toLocaleString()}</span><span class="total-label">${t('minutos')}</span></div>
        </div>
      </div>`;
    }

    // Totales de Selección - SEPARADOS POR PAÍS
    const mostrarTotalesSeleccion =
      filtroCompeticion === 'all' || filtroCompeticion.startsWith('Selección');

    if (mostrarTotalesSeleccion && paisesSeleccion.length > 0) {
      paisesSeleccion.forEach((pais) => {
        const totalesPais = totalesSeleccionPorPais[pais];
        if (totalesPais.partidos === 0) return;

        const golesLabelSel = esPorteroActual
          ? t('goles_encajados_corto')
          : t('goles');
        const golesStyleSel = esPorteroActual ? 'style="color:#e74c3c"' : '';

        // Si hay filtro específico de selección, solo mostrar ese país
        if (filtroCompeticion.startsWith('Selección')) {
          const matchFiltro = filtroCompeticion.match(/\((.+)\)/);
          const paisFiltro = matchFiltro ? matchFiltro[1] : null;
          if (paisFiltro && paisFiltro !== pais) return;
        }

        // Buscar categoría específica si hay filtro
        let statsHtml = '';
        const esFiltroCategoriaEspecifica =
          filtroCompeticion.startsWith('Selección');

        if (esFiltroCategoriaEspecifica) {
          const matchCat = filtroCompeticion.match(/Selección (.+) \(/);
          const catBuscada = matchCat ? matchCat[1] : null;
          const cat =
            catBuscada && totalesPais.categorias[catBuscada]
              ? totalesPais.categorias[catBuscada]
              : null;

          if (cat) {
            statsHtml = `
            <div class="total-item" style="grid-column: 1 / -1; text-align: center; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 8px; margin-bottom: 5px;">
              <span style="font-weight: 600; color: #001a6e;">${t('sel_' + catBuscada.toLowerCase().replace('-', '')) || catBuscada}</span>
            </div>
            <div class="total-item"><span class="total-value">${cat.partidos}</span><span class="total-label">${t('partidos')}</span></div>
            <div class="total-item highlight" ${golesStyleSel}><span class="total-value" ${golesStyleSel}>${cat.goles}</span><span class="total-label">${golesLabelSel}</span></div>
            <div class="total-item"><span class="total-value">${cat.asistencias}</span><span class="total-label">${t('asistencias')}</span></div>
            <div class="total-item yellow-card"><span class="total-value">${cat.amarillas}</span><span class="total-label">${t('amarillas')}</span></div>
            <div class="total-item red-card"><span class="total-value">${cat.rojas}</span><span class="total-label">${t('rojas')}</span></div>
            <div class="total-item minutes"><span class="total-value">${cat.minutos.toLocaleString()}</span><span class="total-label">${t('minutos')}</span></div>
          `;
          }
        }

        // Si no hay stats específicos (filtro "all" o categoría no encontrada), mostrar totales del país
        if (!statsHtml) {
          statsHtml = `
          <div class="total-item" style="grid-column: 1 / -1; text-align: center; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 8px; margin-bottom: 5px;">
            <span style="font-weight: 600; color: #001a6e;">${pais}</span>
          </div>
          <div class="total-item"><span class="total-value">${totalesPais.partidos}</span><span class="total-label">${t('partidos')}</span></div>
          <div class="total-item highlight" ${golesStyleSel}><span class="total-value" ${golesStyleSel}>${totalesPais.goles}</span><span class="total-label">${golesLabelSel}</span></div>
          <div class="total-item"><span class="total-value">${totalesPais.asistencias}</span><span class="total-label">${t('asistencias')}</span></div>
          <div class="total-item yellow-card"><span class="total-value">${totalesPais.amarillas}</span><span class="total-label">${t('amarillas')}</span></div>
          <div class="total-item red-card"><span class="total-value">${totalesPais.rojas}</span><span class="total-label">${t('rojas')}</span></div>
          <div class="total-item minutes"><span class="total-value">${totalesPais.minutos.toLocaleString()}</span><span class="total-label">${t('minutos')}</span></div>
        `;
        }

        totalesHtml += `
        <div class="career-totals-card selection-totals" style="border-top: 4px solid #FFD700; margin-bottom: 15px;">
          <h3 class="card-title">${totalesPais.bandera ? `<img src="${totalesPais.bandera}" style="height:14px;margin-right:8px;vertical-align:middle">` : `<i class="fas fa-flag" style="margin-right:8px; color:#FFD700;"></i>`}${t('total_seleccion') || 'Total Selección'}</h3>
          <div class="totals-grid">
            ${statsHtml}
          </div>
        </div>`;
      });
    }

    container.innerHTML = `${dropdownHtml}
    ${mensajeBajaHtml}
    <div class="career-grid">
      <div class="career-timeline-card">
        <h3 class="card-title">${t('historial')}</h3>
        <div class="timeline">${timelineHtml || '<p>' + (t('no_datos') || 'No hay datos.') + '</p>'}</div>
      </div>
      <div class="career-sidebar">
        ${totalesHtml}
      </div>
    </div>`;

    const filterTipo = document.getElementById('filterCareerTipo');
    if (filterTipo) {
      filterTipo.addEventListener('change', (e) => {
        this.renderFichaCareerHistory(
          jugadorActual,
          currentSeasonId,
          'all',
          e.target.value,
        );
      });
    }

    const filterSelect = document.getElementById('filterCareer');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        const tipoActivo =
          document.getElementById('filterCareerTipo')?.value || 'all';
        this.renderFichaCareerHistory(
          jugadorActual,
          currentSeasonId,
          e.target.value,
          tipoActivo,
        );
      });
    }
  },

  renderJuegos: function () {
    const container = document.getElementById('juegosGrid');
    if (!container || !CLUB_DATA.juegos) return;
    let html = '';
    CLUB_DATA.juegos.forEach((juego) => {
      const specialClass = juego.esEspecial ? 'especial' : '';
      html += `<a href="${juego.enlace}" class="juego-card ${specialClass}"><img src="${juego.imagen}" alt="${juego.titulo}"><h3>${juego.titulo}</h3><p>${juego.descripcion}</p></a>`;
    });
    container.innerHTML = html;
  },

  renderVideos: function () {
    const container = document.getElementById('videosGrid');
    if (!container || !CLUB_DATA.videos) return;
    let html = '';
    CLUB_DATA.videos.forEach((video) => {
      const fecha = video.fecha ? formatearFecha(video.fecha).completa : '';
      const thumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
      const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
      const shareText = `${video.titulo} - Real Oviedo | Sangre Carbayona`;
      html += `<div class="video-card"><a href="${videoUrl}" target="_blank" rel="noopener noreferrer" class="video-main-link" style="text-decoration: none; color: inherit; display: block;"><div class="video-thumbnail"><img src="${thumbnailUrl}" alt="${video.titulo}"><div class="play-overlay"><i class="fas fa-play-circle"></i></div></div><div class="video-info"><h3>${video.titulo}</h3><div class="video-meta"><span><i class="far fa-calendar"></i> ${fecha}</span>${video.jornada ? `<span style="margin-left: 10px;"><i class="fas fa-futbol"></i> ${t('jornada_abrev')}${video.jornada}</span>` : ''}</div></div></a><div class="video-card-actions"><a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n\n' + videoUrl)}" target="_blank" class="video-action-btn whatsapp" title="WhatsApp"><i class="fab fa-whatsapp"></i></a><a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="video-action-btn twitter" title="Twitter"><i class="fab fa-twitter"></i></a><a href="https://t.me/share/url?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="video-action-btn telegram" title="Telegram"><i class="fab fa-telegram-plane"></i></a></div></div>`;
    });
    container.innerHTML = html;
  },
};

/* ===================================
   ESTILOS DINÁMICOS RESPONSIVE
   =================================== */
if (!document.getElementById('responsiveAppStyles')) {
  const s = document.createElement('style');
  s.id = 'responsiveAppStyles';
  s.textContent = `
        /* Caja de desglose */
        .timeline-breakdown-box { margin-top:12px; background:rgba(0,0,0,0.03); padding:10px; border-radius:8px; border:1px solid rgba(0,0,0,0.05); }
        .breakdown-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding-bottom:8px; border-bottom:1px solid rgba(0,0,0,0.05); }
        .breakdown-row:last-child { margin-bottom:0; padding-bottom:0; border-bottom:none; }
        .breakdown-comp-name { font-weight:700; font-size:0.8em; color:#001a6e; text-transform: uppercase; }
        .breakdown-data-chips { display:flex; gap:4px; }
        
        /* Estilo de los chips de datos */
        .chip { background:#fff; padding:2px 8px; border-radius:4px; font-size:0.75em; border:1px solid #ddd; white-space:nowrap; display:flex; align-items:center; gap:4px; font-weight:600; color: #333; }
        
        /* Tarjetas con colores vibrantes y sombras para que se distingan */
        .chip-yellow i { color: #FFD700 !important; filter: drop-shadow(1px 1px 0px rgba(0,0,0,0.3)); font-size: 1.1em; }
        .chip-red i { color: #FF4136 !important; filter: drop-shadow(1px 1px 0px rgba(0,0,0,0.3)); font-size: 1.1em; }
        
        .chip-yellow { border-color: #FFD700; background: #FFFFF0; }
        .chip-red { border-color: #FF4136; background: #FFF5F5; }

        /* Adaptación móvil y tablet */
        @media (max-width: 768px) {
            .breakdown-row { flex-direction: column; align-items: flex-start; gap: 8px; }
            .breakdown-data-chips { width: 100%; display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; }
            .chip { justify-content: center; padding: 6px; font-size: 0.8em; }
            .breakdown-comp-name { font-size: 0.85em; margin-bottom: 2px; }
        }
    `;
  document.head.appendChild(s);
}

/* ===================================
   ESTILOS PARA PORTEROS (GOLES ENCAJADOS)
   =================================== */
if (!document.getElementById('porteroStyles')) {
  const s = document.createElement('style');
  s.id = 'porteroStyles';
  s.textContent = `
    .mini-stat.conceded .mini-stat-value {
      color: #e74c3c !important;
      font-weight: 700;
    }
    .mini-stat.conceded .mini-stat-label {
      color: #c0392b;
      font-size: 0.7em;
      font-weight: 600;
    }
    .quick-stat.conceded .quick-stat-value {
      color: #e74c3c !imp
      ortant;
      font-weight: 700;
    }
    .quick-stat.conceded .quick-stat-label {
      color: #c0392b;
      font-weight: 600;
    }
    .season-stat.portero-stat .season-stat-value {
      color: #e74c3c;
      font-weight: 700;
    }
    .season-stat.portero-stat .season-stat-label {
      color: #c0392b;
    }
    .chip-conceded {
      background: #ffe6e6 !important;
      border-color: #e74c3c !important;
      color: #c0392b !important;
    }
    .chip-conceded i {
      color: #e74c3c !important;
    }
  `;
  document.head.appendChild(s);
}

/* ===================================
   ESTILOS PARA JUGADORES CEDIDOS
   =================================== */
if (!document.getElementById('cedidoCardStyles')) {
  const sc = document.createElement('style');
  sc.id = 'cedidoCardStyles';
  sc.textContent = `
    .cedido-card-badge {
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: rgba(0, 26, 110, 0.88);
      color: #FFD700;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 4px;
      letter-spacing: 0.03em;
      backdrop-filter: blur(2px);
      z-index: 3;
      text-transform: uppercase;
    }
    .cedido-card-badge i { font-size: 0.65rem; }
  `;
  document.head.appendChild(sc);
}

if (!document.getElementById('cedidoStyles')) {
  const s = document.createElement('style');
  s.id = 'cedidoStyles';
  s.textContent = `
    .cedido-row .info-value,
    .cedido-value {
      color: #e67e22;
      font-weight: 700;
    }
    .cedido-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: rgba(230, 126, 34, 0.92);
      color: #fff;
      font-size: 0.72em;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      margin-top: 10px;
      text-align: center;
      max-width: 100%;
    }
    .cedido-clubs {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0 6px;
      justify-content: center;
    }
    .cedido-club {
      white-space: nowrap;
    }
    .cedido-club:not(:last-child)::after {
      content: ',';
      margin-right: 2px;
    }
    @media (max-width: 600px) {
      .cedido-badge {
        font-size: 0.68em;
        padding: 5px 10px;
      }
      .cedido-clubs {
        flex-direction: column;
        gap: 2px;
      }
      .cedido-club:not(:last-child)::after {
        content: '';
      }
    }
  `;
  document.head.appendChild(s);
}

/* ===================================
   ESTILOS PARA BAJAS DURANTE TEMPORADA
   =================================== */
if (!document.getElementById('bajaTempStyles')) {
  const bt = document.createElement('style');
  bt.id = 'bajaTempStyles';
  bt.textContent = `
    /* Badge en tarjeta de plantilla */
    .baja-temp-card-badge {
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: rgba(180, 0, 0, 0.88);
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 4px;
      letter-spacing: 0.03em;
      backdrop-filter: blur(2px);
      z-index: 3;
      text-transform: uppercase;
    }
    .baja-temp-card-badge i { font-size: 0.65rem; }

    /* Badge en hero de ficha */
    .baja-temp-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: rgba(192, 0, 0, 0.92);
      color: #fff;
      font-size: 0.72em;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      margin-top: 10px;
      text-align: center;
      max-width: 100%;
    }

    /* Stack de badges cuando hay cedido + baja a la vez */
    .estado-badges-stack {
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      z-index: 3;
    }
    .estado-badges-stack .cedido-card-badge,
    .estado-badges-stack .baja-temp-card-badge {
      position: static;
      width: auto;
      margin: 0;
    }

    /* Fila de estado en info panel */
    .baja-temp-row .info-value,
    .baja-temp-value {
      color: #c0392b;
      font-weight: 700;
    }

    @media (max-width: 600px) {
      .baja-temp-badge {
        font-size: 0.68em;
        padding: 5px 10px;
      }
    }
  `;
  document.head.appendChild(bt);
}

/* ===================================
   AJUSTE UNIFORME DE FOTOS DE JUGADORES
   =================================== */
function ajustarFotosJugadores() {
  const selectores = [
    '.player-main-photo',
    '.squad-image img',
    '.player-card img',
    '.squad-card .squad-image img',
  ];

  const fotos = document.querySelectorAll(selectores.join(', '));

  fotos.forEach((img) => {
    if (img.complete) {
      aplicarAjuste(img);
    } else {
      img.onload = function () {
        aplicarAjuste(this);
      };
      img.onerror = function () {
        this.src =
          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"%3E%3Crect width="400" height="500" fill="%231a365d"/%3E%3Ccircle cx="200" cy="180" r="70" fill="%23ffffff22"/%3E%3Crect x="100" y="280" width="200" height="160" rx="20" fill="%23ffffff22"/%3E%3C/svg%3E';
      };
    }
  });
}

function aplicarAjuste(img) {
  // Filtro compensador del oscurecimiento visual por scale + sombras del contenedor
  img.style.filter = 'brightness(1.08) contrast(0.95)';

  // Si es la foto principal de la ficha individual, el CSS ya gestiona
  // el encuadre con height fija + object-fit:cover + object-position.
  // Solo ajustamos el object-position aquí; nunca añadimos scale
  // (que sacaría la imagen del contenedor con overflow:hidden).
  if (img.classList.contains('player-main-photo')) {
    const ratio = img.naturalWidth / img.naturalHeight;
    if (ratio > 1.3) {
      img.style.objectPosition = 'center 25%';
    } else {
      img.style.objectPosition = 'center 15%';
    }
    return;
  }

  const ratio = img.naturalWidth / img.naturalHeight;

  if (ratio < 0.6) {
    img.style.objectPosition = 'center 20%';
    img.style.transform = 'scale(1.1)';
  } else if (ratio < 0.8) {
    img.style.objectPosition = 'center 15%';
    img.style.transform = 'scale(1.05)';
  } else if (ratio > 1.3) {
    img.style.objectPosition = 'center 25%';
    img.style.transform = 'scale(1.15)';
  } else {
    img.style.objectPosition = 'center 20%';
    img.style.transform = 'scale(1.08)';
  }
}

const originalRenderFichaJugador = App.renderFichaJugador;
App.renderFichaJugador = function () {
  originalRenderFichaJugador.call(this);
  setTimeout(ajustarFotosJugadores, 100);
};

const originalRenderPlantillaCompleta = App.renderPlantillaCompleta;
App.renderPlantillaCompleta = function () {
  originalRenderPlantillaCompleta.call(this);
  setTimeout(ajustarFotosJugadores, 100);
};

const originalRenderPlantillaHome = App.renderPlantillaHome;
App.renderPlantillaHome = function (filter) {
  originalRenderPlantillaHome.call(this, filter);
  setTimeout(ajustarFotosJugadores, 100);
};

/* ===================================
   ESTILOS PARA ESTADÍSTICAS POR COMPETICIÓN
   (pestañas Liga / Copa / Total en primer-equipo)
   =================================== */
if (!document.getElementById('compTabsStyles')) {
  const cs = document.createElement('style');
  cs.id = 'compTabsStyles';
  cs.textContent = `
    /* Contenedor general de las pestañas */
    .comp-tabs-wrapper {
      width: 100%;
    }

    /* Fila de botones de pestaña */
    .comp-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin-bottom: 20px;
    }

    /* Botón individual de pestaña */
    .comp-tab {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 9px 20px;
      border: 2px solid transparent;
      border-radius: 30px;
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.65);
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      cursor: pointer;
      transition: all 0.22s ease;
      text-transform: uppercase;
    }
    .comp-tab i {
      font-size: 0.9em;
      color: var(--tab-accent, #fff);
      transition: color 0.22s;
    }
    .comp-tab:hover {
      background: rgba(255,255,255,0.15);
      color: #fff;
      border-color: var(--tab-accent, rgba(255,255,255,0.3));
    }
    .comp-tab.active {
      background: rgba(255,255,255,0.18);
      color: #fff;
      border-color: var(--tab-accent, #fff);
      box-shadow: 0 0 14px rgba(255,255,255,0.08);
    }
    .comp-tab--total {
      background: rgba(255, 204, 0, 0.1);
    }
    .comp-tab--total.active {
      background: rgba(255, 204, 0, 0.18);
      border-color: #ffcc00;
      color: #ffcc00;
    }
    .comp-tab--total i {
      color: #ffcc00;
    }

    /* Paneles de contenido: oculto por defecto, visible si .active */
    .comp-panels {
      width: 100%;
    }
    .comp-panel {
      display: none;
    }
    .comp-panel.active {
      display: block;
    }

    /* Grid de tarjetas de estadística (reutiliza .stat-card existente)
       Aquí forzamos el grid para que funcione también dentro de comp-panel */
    .comp-panel .team-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 16px;
      margin-top: 4px;
    }

    /* Fila de checkboxes en el panel "Total" */
    .total-checks-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 20px;
      justify-content: center;
      margin-bottom: 18px;
      padding: 12px 16px;
      background: rgba(255,255,255,0.06);
      border-radius: 12px;
    }
    .total-check-label {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      cursor: pointer;
      color: rgba(255,255,255,0.8);
      font-size: 0.83rem;
      font-weight: 600;
      user-select: none;
      transition: color 0.2s;
    }
    .total-check-label:hover {
      color: #fff;
    }
    .total-check {
      display: none; /* ocultamos el checkbox nativo */
    }
    .total-check-dot {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
      border: 2px solid rgba(255,255,255,0.3);
      transition: opacity 0.2s, border-color 0.2s;
    }
    .total-check:not(:checked) + .total-check-dot {
      opacity: 0.35;
    }
    .total-check:checked + .total-check-dot {
      opacity: 1;
      border-color: transparent;
    }

    /* Separador visual entre la badge de competición y las cards */
    .comp-panel .comp-badge-header {
      text-align: center;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.55;
      margin-bottom: 12px;
    }

    /* Responsive: en móvil las pestañas se adaptan */
    @media (max-width: 600px) {
      .comp-tab {
        padding: 7px 14px;
        font-size: 0.78rem;
      }
      .comp-panel .team-stats-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }
    }
  `;
  document.head.appendChild(cs);
}

document.addEventListener('DOMContentLoaded', function () {
  App.init();
});

window.App = App;
