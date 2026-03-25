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
    let completa = fecha.toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });

    const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return {
        dia: fecha.getDate(),
        mes: capitalizar(mesNombre),
        mesCorto: capitalizar(mesCorto).replace('.', ''),
        año: fecha.getFullYear(),
        completa: completa
    };
}

/* ===================================
   APLICACIÓN - RENDERIZADO DINÁMICO
   =================================== */

const App = {
    temporadaActiva: null,
    
    init: function() {
        this.temporadaActiva = CLUB_DATA.temporadaActual;
        this.renderClasificacion();
        this.renderCalendario();
        this.renderPlantillaHome();
        this.renderNoticias();
        this.renderPatrocinadores();
        this.renderProximoPartido();
        this.renderSeasonSelector();
        this.renderEstadisticasEquipo();
        this.renderPlantillaCompleta();
        this.renderCuerpoTecnico();
        this.renderFichaJugador();
        this.renderJuegos();
        this.renderVideos();
    },

    // ===================================
    // SELECTOR DE TEMPORADA
    // ===================================
    renderSeasonSelector: function() {
        const container = document.getElementById('seasonSelector');
        if (!container) return;
        let html = '<div class="season-tabs">';
        CLUB_DATA.temporadasDisponibles.forEach(temp => {
            const activeClass = temp.id === this.temporadaActiva ? 'active' : '';
            const currentBadge = temp.actual ? '<span class="current-badge">' + t('current_badge') + '</span>' : '';
            html += `<button class="season-tab ${activeClass}" data-season="${temp.id}">${temp.nombre} ${currentBadge}</button>`;
        });
        html += '</div>';
        container.innerHTML = html;
        container.querySelectorAll('.season-tab').forEach(tab => {
            tab.addEventListener('click', (e) => { this.changeSeason(e.currentTarget.dataset.season); });
        });
    },

    changeSeason: function(seasonId) {
        this.temporadaActiva = seasonId;
        document.querySelectorAll('.season-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.season === seasonId);
        });
        this.renderEstadisticasEquipo();
        this.renderPlantillaCompleta();
        this.renderCuerpoTecnico();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // ===================================
    // CLASIFICACIÓN
    // ===================================
    renderClasificacion: function() {
        const container = document.getElementById('clasificacionBody');
        if (!container) return;
        const temporada = getTemporada(this.temporadaActiva || CLUB_DATA.temporadaActual);
        let html = '';
        temporada.clasificacion.forEach((equipo, index) => {
            const hiddenClass = index >= 5 ? 'hidden-row' : '';
            const badgeHtml = equipo.logo ? `<img src="${equipo.logo}" alt="${equipo.siglas}" class="team-badge-img">` : `<span class="team-badge-text">${equipo.siglas}</span>`;
            html += `<tr class="${equipo.destacado ? 'highlight' : ''} ${hiddenClass}"><td>${equipo.posicion}</td><td><div class="team-cell"><span class="team-badge">${badgeHtml}</span>${equipo.nombre}</div></td><td>${equipo.puntos}</td><td>${equipo.jugados}</td><td>${equipo.gfavor}</td><td>${equipo.gcontra}</td><td>${equipo.dg}</td></tr>`;
        });
        container.innerHTML = html;
    },

    // ===================================
    // CALENDARIO
    // ===================================
    renderCalendario: function() {
        const container = document.getElementById('calendarioList');
        if (!container) return;
        let html = '';
        CLUB_DATA.calendario.forEach(partido => {
            const fecha = formatearFecha(partido.fecha);
            html += `<div class="match-item ${partido.esProximo ? 'next' : ''}"><div class="match-date-box"><span class="day">${fecha.dia}</span><span class="month">${fecha.mesCorto}</span></div><div class="match-detail"><div class="teams"><span class="home-team">${partido.local}</span><span class="vs">-</span><span class="away-team">${partido.visitante}</span></div><div class="match-meta"><span><i class="far fa-clock"></i> ${partido.hora}</span><span><i class="fas fa-map-marker-alt"></i> ${partido.estadio}</span></div></div></div>`;
        });
        container.innerHTML = html;
    },

    // ===================================
    // PLANTILLA HOME
    // ===================================
    renderPlantillaHome: function() {
        const container = document.getElementById('plantillaHomeGrid');
        if (!container) return;
        const temporada = getTemporada(CLUB_DATA.temporadaActual);
        let html = '';
        temporada.jugadores.slice(0, 8).forEach(jugador => {
            html += `<div class="player-card"><a href="ficha-jugador.html?id=${jugador.id}&season=${CLUB_DATA.temporadaActual}"><div class="player-image"><img src="${jugador.imagen}" alt="${jugador.nombreCompleto}"><span class="player-number">${jugador.dorsal}</span></div><div class="player-info"><span class="player-position">${translatePosition(jugador.posicion)}</span><h4 class="player-name">${jugador.nombreCompleto}</h4></div></a></div>`;
        });
        container.innerHTML = html;
    },

    // ===================================
    // NOTICIAS
    // ===================================
    renderNoticias: function() {
        const container = document.getElementById('noticiasGrid');
        if (!container) return;
        let html = '';
        CLUB_DATA.noticias.forEach(noticia => {
            const fecha = formatearFecha(noticia.fecha);
            html += `<article class="news-card ${noticia.esPrincipal ? 'main-news' : ''}"><a href="#" class="news-link"><div class="news-image"><img src="${noticia.imagen}" alt="${noticia.titulo}"><span class="news-category">${noticia.categoria}</span></div><div class="news-content"><h3>${noticia.titulo}</h3>${noticia.esPrincipal ? `<p>${noticia.resumen}</p>` : ''}<span class="news-date">${fecha.completa}</span></div></a></article>`;
        });
        container.innerHTML = html;
    },
    
    renderPatrocinadores: function() {
        const container = document.getElementById('patrocinadoresGrid');
        if (!container) return;
        container.innerHTML = CLUB_DATA.patrocinadores.map(pat => `<div class="sponsor-item"><div class="sponsor-logo"><span>${pat.nombre}</span></div></div>`).join('');
    },

    renderProximoPartido: function() {
        const container = document.getElementById('heroMatch');
        if (!container) return;
        const partido = CLUB_DATA.proximoPartido;
        const fecha = formatearFecha(partido.fecha);
        container.innerHTML = `
            <div class="match-competition">
                <span class="competition-badge">${partido.competicion} - ${t('jornada')} ${partido.jornada}</span>
                <span class="match-date"><i class="far fa-calendar"></i> ${fecha.completa}<i class="far fa-clock"></i> ${partido.hora}h</span>
            </div>
            <div class="match-teams">
                <div class="team home"><div class="team-logo-large"><span>${partido.localSiglas}</span></div><span class="team-name-large">${partido.local}</span></div>
                <div class="match-vs"><span>VS</span></div>
                <div class="team away"><div class="team-logo-large away-logo"><span>${partido.visitanteSiglas}</span></div><span class="team-name-large">${partido.visitante}</span></div>
            </div>
            <div class="match-info"><p><i class="fas fa-map-marker-alt"></i> ${partido.estadio}</p></div>`;
    },

    renderEstadisticasEquipo: function() {
        const container = document.getElementById('teamStatsGrid');
        if (!container) return;
        const stats = getTemporada(this.temporadaActiva).estadisticasEquipo;
        container.innerHTML = `
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-trophy"></i></div><div class="stat-number">${stats.posicion}º</div><div class="stat-label">${t('posicion')}</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-futbol"></i></div><div class="stat-number">${stats.golesFavor}</div><div class="stat-label">${t('goles_favor')}</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-shield-alt"></i></div><div class="stat-number">${stats.golesContra}</div><div class="stat-label">${t('goles_contra')}</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-check-circle"></i></div><div class="stat-number">${stats.victorias}</div><div class="stat-label">${t('victorias')}</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-handshake"></i></div><div class="stat-number">${stats.empates}</div><div class="stat-label">${t('empates')}</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-times-circle"></i></div><div class="stat-number">${stats.derrotas}</div><div class="stat-label">${t('derrotas')}</div></div>`;
    },

    renderPlantillaCompleta: function() {
        const container = document.getElementById('plantillaCompleta');
        if (!container) return;
        const temporada = getTemporada(this.temporadaActiva);
        
        const posiciones = {
            [t('porteros')]: ['Portero'],
            [t('defensas')]: ['Lateral Derecho', 'Lateral Izquierdo', 'Central'],
            [t('centrocampistas')]: ['Mediocentro Defensivo', 'Centrocampista', 'Mediocentro', 'Mediapunta'],
            [t('delanteros')]: ['Delantero Centro', 'Extremo Derecho', 'Extremo Izquierdo', 'Delantero']
        };
        
        let html = '';
        for (const [nombrePosicion, posicionesLista] of Object.entries(posiciones)) {
            const jugadoresPosicion = temporada.jugadores.filter(j => posicionesLista.includes(j.posicion));
            if (jugadoresPosicion.length === 0) continue;
            
            let icon = 'fa-user';
            if (nombrePosicion.includes('Port') || nombrePosicion.includes('Goal')) icon = 'fa-hand-paper';
            else if (nombrePosicion.includes('Def') || nombrePosicion.includes('Back')) icon = 'fa-shield-alt';
            else if (nombrePosicion.includes('Centro') || nombrePosicion.includes('Mid')) icon = 'fa-sync-alt';
            else if (nombrePosicion.includes('Delan') || nombrePosicion.includes('Forward')) icon = 'fa-bullseye';

            html += `<div class="position-group"><h3 class="position-title"><span class="position-icon"><i class="fas ${icon}"></i></span>${nombrePosicion}</h3><div class="squad-grid">`;
            
            // CORRECCIÓN AQUÍ: jugadoresPosicion (antes estaba mal escrito)
            jugadoresPosicion.forEach(jugador => { html += this.renderJugadorCard(jugador); });
            
            html += `</div></div>`;
        }
        container.innerHTML = html;
    },

    renderJugadorCard: function(jugador) {
        const ribbonHtml = jugador.fallecido ? '<div class="deceased-ribbon"></div>' : '';
        return `
            <article class="squad-card">
                <a href="ficha-jugador.html?id=${jugador.id}&season=${this.temporadaActiva}" class="squad-link">
                    <div class="squad-image">
                        <img src="${jugador.imagen}" alt="${jugador.nombreCompleto}">
                        <span class="squad-number">${jugador.dorsal}</span>
                        ${ribbonHtml}
                        <div class="squad-overlay">
                            <span class="view-profile">${t('ver_ficha')}</span>
                        </div>
                    </div>
                    <div class="squad-info">
                        <h4 class="squad-name">${jugador.nombreCompleto}</h4>
                        <span class="squad-position">${translatePosition(jugador.posicion)}</span>
                        <div class="squad-meta">
                            <span><i class="far fa-calendar"></i> ${jugador.edad} ${t('edad')}</span>
                            <span><i class="fas fa-ruler-vertical"></i> ${jugador.altura ? jugador.altura + 'm' : t('desconocida')}</span>
                        </div>
                        <div class="squad-stats">
                            <div class="mini-stat"><span class="mini-stat-value">${jugador.stats.partidos}</span><span class="mini-stat-label">${t('partidos')}</span></div>
                            <div class="mini-stat"><span class="mini-stat-value">${jugador.stats.goles}</span><span class="mini-stat-label">${t('goles')}</span></div>
                        </div>
                    </div>
                </a>
            </article>
        `;
    },

    renderCuerpoTecnico: function() {
        const container = document.getElementById('cuerpoTecnicoGrid');
        if (!container) return;
        const temporada = getTemporada(this.temporadaActiva);
        let html = '';
        temporada.cuerpoTecnico.forEach(miembro => {
            html += `<article class="coach-card ${miembro.esPrincipal ? 'main-coach' : ''}"><div class="coach-image"><img src="${miembro.imagen}" alt="${miembro.nombre}"></div><div class="coach-info"><span class="coach-role">${miembro.cargo}</span><h3 class="coach-name">${miembro.nombre}</h3><p class="coach-bio">${miembro.descripcion}</p>${miembro.estadisticas ? `<div class="coach-stats"><div class="coach-stat"><span class="coach-stat-value">${miembro.estadisticas.partidos}</span><span class="coach-stat-label">${t('partidos')}</span></div><div class="coach-stat"><span class="coach-stat-value">${Math.round(miembro.estadisticas.victorias / miembro.estadisticas.partidos * 100)}%</span><span class="coach-stat-label">${t('victorias')}</span></div></div>` : ''}</div></article>`;
        });
        container.innerHTML = html;
    },

    // ===================================
    // FICHA JUGADOR (ACTUALIZADO PARA ESTÁTICO)
    // ===================================
    renderFichaJugador: function() {
        const container = document.getElementById('fichaJugadorContent');
        if (!container) return;

        let jugadorId, seasonId;

        if (window.PLAYER_DATA_STATIC) {
            jugadorId = window.PLAYER_DATA_STATIC.codigo; // codigo es el identificador único
            seasonId = window.PLAYER_DATA_STATIC.season;
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            jugadorId = urlParams.get('codigo') || urlParams.get('id');
            seasonId = urlParams.get('season') || CLUB_DATA.temporadaActual;
        }

        const jugador = getJugadorById(jugadorId, seasonId);
        if (!jugador) { container.innerHTML = '<p>Jugador no encontrado</p>'; return; }

        document.title = `${jugador.nombreCompleto} | ${CLUB_DATA.club.nombreCorto}`;
        this.updateMetaTags(jugador);

        const breadcrumb = document.querySelector('.breadcrumb .current');
        if (breadcrumb) breadcrumb.textContent = jugador.nombreCompleto;

        const esTemporadaActual = seasonId === CLUB_DATA.temporadaActual;
        const haFallecido = jugador.fallecido === true;
        const fechaFallecimiento = jugador.fechaFallecimiento || null;

        let edadMostrar = jugador.edad;
        if (haFallecido && fechaFallecimiento && jugador.fechaNacimiento) {
            const nacimiento = new Date(jugador.fechaNacimiento);
            const muerte = new Date(fechaFallecimiento);
            let edadMuerte = muerte.getFullYear() - nacimiento.getFullYear();
            const m = muerte.getMonth() - nacimiento.getMonth();
            if (m < 0 || (m === 0 && muerte.getDate() < nacimiento.getDate())) edadMuerte--;
            edadMostrar = edadMuerte;
        }

        const pageUrl = window.location.href;
        const shareText = `Ficha de ${jugador.nombreCompleto} - ${CLUB_DATA.club.nombreCorto}`;
        const shareLinks = `
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + pageUrl)}" target="_blank" class="player-social whatsapp" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
            <a href="https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="player-social telegram" title="Telegram"><i class="fab fa-telegram-plane"></i></a>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="player-social twitter" title="Twitter"><i class="fab fa-twitter"></i></a>
        `;

        container.innerHTML = `
            <div class="player-photo-container">
                <div class="player-photo-wrapper">
                    <img src="${jugador.imagen}" alt="${jugador.nombreCompleto}" class="player-main-photo">
                    <div class="player-number-large">${jugador.dorsal}</div>
                    <div class="player-role-badge"><span>${translatePosition(jugador.posicion)}</span></div>
                    ${haFallecido ? '<div class="deceased-ribbon"></div>' : ''}
                </div>
            </div>
            <div class="player-info-container">
                <div class="player-name-section">
                    <span class="player-position-label">${translatePosition(jugador.posicion)}</span>
                    <h1 class="player-full-name">${jugador.nombreCompleto}</h1>
                    <div class="player-social-links">${shareLinks}</div>
                </div>
                <div class="player-quick-stats">
                    ${this.renderQuickStats(jugador, haFallecido, fechaFallecimiento, edadMostrar, esTemporadaActual)}
                </div>
                <div class="player-season-stats">
                    <h3 class="stats-title">${t('temporada')} ${seasonId.replace('-', '/')}</h3>
                    <div class="season-stats-grid">
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-futbol"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.goles}</span><span class="season-stat-label">${t('goles')}</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-hands-helping"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.asistencias}</span><span class="season-stat-label">${t('asistencias')}</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-running"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.partidos}</span><span class="season-stat-label">${t('partidos')}</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-clock"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.minutos.toLocaleString()}</span><span class="season-stat-label">${t('minutos')}</span></div></div>
                    </div>
                </div>
            </div>
        `;

        this.renderFichaOverview(jugador);
        this.renderFichaMatches(jugador, seasonId);
        this.renderFichaCareerHistory(jugador, seasonId);
    },

    updateMetaTags: function(jugador) {
        let metaImage = document.querySelector('meta[property="og:image"]');
        if (!metaImage) { metaImage = document.createElement('meta'); metaImage.setAttribute('property', 'og:image'); document.head.appendChild(metaImage); }
        metaImage.setAttribute('content', jugador.imagen);
    },

    renderQuickStats: function(jugador, haFallecido, fechaFallecimiento, edadMostrar, esTemporadaActual) {
        const altura = jugador.altura ? `${jugador.altura}m` : t('desconocida');
        let html = '';
        if (esTemporadaActual) {
            html = `<div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">${t('edad')}</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">${t('altura')}</span></div>`;
        } else {
            if (haFallecido) {
                const fechaFormateada = fechaFallecimiento ? formatearFecha(fechaFallecimiento).completa : t('fecha_desconocida');
                html = `<div class="quick-stat"><span class="quick-stat-value deceased-text">${fechaFormateada}</span><span class="quick-stat-label">${t('fallecimiento')}</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">${t('altura')}</span></div><div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">${t('edad')}</span></div>`;
            } else {
                html = `<div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">${t('edad')}</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">${t('altura')}</span></div>`;
            }
        }
        return html;
    },

    renderFichaOverview: function(jugador) {
        const container = document.getElementById('tabOverview');
        if (!container) return;
        const fechaNac = formatearFecha(jugador.fechaNacimiento);
        container.innerHTML = `
            <div class="overview-grid">
                <div class="performance-card">
                    <h3 class="card-title">${t('rendimiento')}</h3>
                    <div class="performance-stats">
                        <div class="performance-item"><div class="performance-header"><span>${t('goles_partido')}</span><span class="performance-value">${(jugador.stats.goles / jugador.stats.partidos).toFixed(2)}</span></div><div class="performance-bar"><div class="performance-fill" style="width: ${(jugador.stats.goles / jugador.stats.partidos) * 100}%"></div></div></div>
                        <div class="performance-item"><div class="performance-header"><span>${t('minutos_partido')}</span><span class="performance-value">${Math.round(jugador.stats.minutos / jugador.stats.partidos)}'</span></div><div class="performance-bar"><div class="performance-fill" style="width: ${(jugador.stats.minutos / jugador.stats.partidos / 90) * 100}%"></div></div></div>
                    </div>
                </div>
                <div class="personal-info-card">
                    <h3 class="card-title">${t('informacion')}</h3>
                    <div class="personal-info-list">
                        <div class="info-row"><span class="info-label"><i class="far fa-calendar"></i> ${t('nacimiento')}</span><span class="info-value">${fechaNac.completa}</span></div>
                        <div class="info-row"><span class="info-label"><i class="fas fa-map-marker-alt"></i> ${t('lugar')}</span><span class="info-value">${jugador.lugarNacimiento}</span></div>
                        <div class="info-row"><span class="info-label"><i class="fas fa-flag"></i> ${t('nacionalidad')}</span><span class="info-value">${jugador.nacionalidad}</span></div>
                        <div class="info-row"><span class="info-label"><i class="far fa-calendar-check"></i> ${t('en_club_desde')}</span><span class="info-value">${jugador.enClubDesde}</span></div>
                    </div>
                </div>
                <div class="disciplinary-card">
                    <h3 class="card-title">${t('disciplina')}</h3>
                    <div class="cards-display">
                        <div class="card-item yellow"><div class="card-icon"><i class="fas fa-square"></i></div><div class="card-info"><span class="card-count">${jugador.stats.amarillas}</span><span class="card-label">${t('amarillas')}</span></div></div>
                        <div class="card-item red"><div class="card-icon"><i class="fas fa-square"></i></div><div class="card-info"><span class="card-count">${jugador.stats.rojas}</span><span class="card-label">${t('rojas')}</span></div></div>
                    </div>
                </div>
            </div>`;
    },

    renderFichaMatches: function(jugador, seasonId) {
        const container = document.getElementById('tabMatches');
        if (!container) return;
        const temporada = getTemporada(seasonId);
        if (!temporada.partidosJugados || temporada.partidosJugados.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#666; padding: 20px;">No hay datos.</p>`;
            return;
        }
        let html = '<div class="matches-list">';
        temporada.partidosJugados.forEach(partido => {
            const fecha = formatearFecha(partido.fecha);
            let resultClass = partido.resultado === 'V' ? 'win' : (partido.resultado === 'E' ? 'draw' : 'loss');
            html += `<article class="match-detail-card"><div class="match-detail-header"><div class="match-date-badge ${resultClass}"><span class="match-day">${fecha.dia}</span><span class="match-month">${fecha.mesCorto}</span></div><div class="match-competition-info"><span class="competition-name">${temporada.competicion} - ${t('jornada')} ${partido.jornada}</span><div class="match-teams-result"><span class="team-home">${partido.local}</span><span class="match-score">${partido.golesLocal} - ${partido.golesVisitante}</span><span class="team-away">${partido.visitante}</span></div></div></div></article>`;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    renderFichaCareerHistory: function(jugadorActual, currentSeasonId) {
        const container = document.getElementById('tabCareer');
        if (!container) return;
        
        const historial = [];
        let totales = { partidos: 0, goles: 0, asistencias: 0, amarillas: 0, rojas: 0, minutos: 0 };

        CLUB_DATA.temporadasDisponibles.forEach(temp => {
            const datosTemporada = CLUB_DATA.temporadas[temp.id];
            if (!datosTemporada) return;
            const jugadorEnTemporada = datosTemporada.jugadores.find(j => j.codigo === jugadorActual.codigo);
            if (jugadorEnTemporada) {
                historial.push({
                    temporada: temp.nombre,
                    equipo: CLUB_DATA.club.nombreCorto,
                    logo: datosTemporada.clasificacion.find(e => e.siglas === "OVI")?.logo || "https://picsum.photos/seed/real-oviedo-logo/60/60",
                    stats: jugadorEnTemporada.stats,
                    dorsal: jugadorEnTemporada.dorsal,
                    posicion: jugadorEnTemporada.posicion,
                    actual: temp.id === currentSeasonId
                });
                totales.partidos += jugadorEnTemporada.stats.partidos;
                totales.goles += jugadorEnTemporada.stats.goles;
                totales.asistencias += jugadorEnTemporada.stats.asistencias;
                totales.amarillas += jugadorEnTemporada.stats.amarillas;
                totales.rojas += jugadorEnTemporada.stats.rojas;
                totales.minutos += jugadorEnTemporada.stats.minutos;
            }
        });

        let timelineHtml = '';
        historial.forEach(h => {
            const badgeHtml = h.logo ? `<img src="${h.logo}" alt="Logo" class="team-badge-img">` : `<span class="team-badge-text">OVI</span>`;
            timelineHtml += `
                <div class="timeline-item ${h.actual ? 'current' : ''}">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="timeline-club"><span class="team-badge">${badgeHtml}</span>${h.equipo}</span>
                            <span class="timeline-years">${h.temporada}</span>
                        </div>
                        <div class="timeline-position">
                            <span class="pos-label"><i class="fas fa-tshirt"></i> #${h.dorsal}</span>
                            <span class="pos-name">${translatePosition(h.posicion)}</span>
                        </div>
                        <div class="timeline-stats">
                            <span><strong>${h.stats.partidos}</strong> ${t('partidos')}</span>
                            <span><strong>${h.stats.goles}</strong> ${t('goles')}</span>
                            <span><strong>${h.stats.asistencias}</strong> ${t('asistencias')}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        let seleccionHtml = '';
        if (jugadorActual.seleccion) {
            const sel = jugadorActual.seleccion;
            let rowsHtml = '';
            sel.datos.forEach(d => {
                rowsHtml += `
                    <div class="national-stat-row">
                        <span class="national-cat">${d.categoria}</span>
                        <span><strong>${d.partidos}</strong> ${t('partidos')}</span>
                        <span><strong>${d.goles}</strong> ${t('goles')}</span>
                    </div>
                `;
            });
            seleccionHtml = `
                <div class="national-team-card">
                    <div class="national-header">
                        <img src="${sel.bandera}" alt="${sel.pais}" class="national-flag">
                        <h3 class="card-title">${sel.pais} <span>${t('seleccion')}</span></h3>
                    </div>
                    <div class="national-stats-body">${rowsHtml}</div>
                </div>
            `;
        }

        let logrosHtml = '';
        if (jugadorActual.logros) jugadorActual.logros.forEach(l => { logrosHtml += `<div class="achievement"><i class="fas fa-trophy"></i><span>${l}</span></div>`; });

        container.innerHTML = `
            <div class="career-grid">
                <div class="career-timeline-card">
                    <h3 class="card-title">${t('historial')}</h3>
                    <div class="timeline">${timelineHtml}</div>
                </div>

                <div class="career-sidebar">
                    ${seleccionHtml}
                    <div class="career-totals-card">
                        <h3 class="card-title">${t('totales')}</h3>
                        <div class="totals-grid">
                            <div class="total-item"><span class="total-value">${totales.partidos}</span><span class="total-label">${t('partidos')}</span></div>
                            <div class="total-item highlight"><span class="total-value">${totales.goles}</span><span class="total-label">${t('goles')}</span></div>
                            <div class="total-item"><span class="total-value">${totales.asistencias}</span><span class="total-label">${t('asistencias')}</span></div>
                            <div class="total-item yellow-card"><span class="total-value">${totales.amarillas}</span><span class="total-label">${t('amarillas')}</span></div>
                            <div class="total-item red-card"><span class="total-value">${totales.rojas}</span><span class="total-label">${t('rojas')}</span></div>
                            <div class="total-item minutes"><span class="total-value">${Math.round(totales.minutos/60)}h</span><span class="total-label">${t('minutos')}</span></div>
                        </div>
                        ${logrosHtml ? `<div class="career-achievements"><h4>${t('logros')}</h4><div class="achievements-list">${logrosHtml}</div></div>` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    // ===================================
    // JUEGOS
    // ===================================
    renderJuegos: function() {
        const container = document.getElementById('juegosGrid');
        if (!container) return; 

        if (!CLUB_DATA.juegos) return;

        let html = '';
        CLUB_DATA.juegos.forEach(juego => {
            const specialClass = juego.esEspecial ? 'especial' : '';
            
            html += `
                <a href="${juego.enlace}" class="juego-card ${specialClass}">
                    <img src="${juego.imagen}" alt="${juego.titulo}">
                    <h3>${juego.titulo}</h3>
                    <p>${juego.descripcion}</p>
                </a>
            `;
        });
        container.innerHTML = html;
    },

    // ===================================
    // VIDEOS
    // ===================================
    renderVideos: function() {
        const container = document.getElementById('videosGrid');
        if (!container) return;
        if (!CLUB_DATA.videos) return;

        let html = '';
        CLUB_DATA.videos.forEach(video => {
            const fecha = video.fecha ? formatearFecha(video.fecha).completa : '';
            const thumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
            
            const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
            const shareText = `${video.titulo} - Real Oviedo | Por Sangre Carbayona`;

            html += `
                <div class="video-card">
                    <a href="${videoUrl}" target="_blank" rel="noopener noreferrer" class="video-main-link" style="text-decoration: none; color: inherit; display: block;">
                        <div class="video-thumbnail">
                            <img src="${thumbnailUrl}" alt="${video.titulo}">
                            <div class="play-overlay">
                                <i class="fas fa-play-circle"></i>
                            </div>
                        </div>
                        <div class="video-info">
                            <h3>${video.titulo}</h3>
                            <div class="video-meta">
                                <span><i class="far fa-calendar"></i> ${fecha}</span>
                                ${video.jornada ? `<span style="margin-left: 10px;"><i class="fas fa-futbol"></i> Jornada ${video.jornada}</span>` : ''}
                            </div>
                        </div>
                    </a>
                    
                    <div class="video-card-actions">
                        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + videoUrl)}" target="_blank" class="video-action-btn whatsapp" title="Compartir en WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="video-action-btn twitter" title="Compartir en Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="https://t.me/share/url?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="video-action-btn telegram" title="Compartir en Telegram">
                            <i class="fab fa-telegram-plane"></i>
                        </a>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });
window.App = App;