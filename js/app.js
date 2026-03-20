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
            const currentBadge = temp.actual ? '<span class="current-badge">Actual</span>' : '';
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
        const filasVisibles = 5;
        let html = '';
        temporada.clasificacion.forEach((equipo, index) => {
            const highlightClass = equipo.destacado ? 'highlight' : '';
            const hiddenClass = index >= filasVisibles ? 'hidden-row' : '';
            const badgeHtml = equipo.logo ? `<img src="${equipo.logo}" alt="${equipo.siglas}" class="team-badge-img">` : `<span class="team-badge-text">${equipo.siglas}</span>`;
            html += `<tr class="${highlightClass} ${hiddenClass}"><td>${equipo.posicion}</td><td><div class="team-cell"><span class="team-badge">${badgeHtml}</span>${equipo.nombre}</div></td><td>${equipo.puntos}</td><td>${equipo.jugados}</td><td>${equipo.gfavor}</td><td>${equipo.gcontra}</td><td>${equipo.dg}</td></tr>`;
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
            const nextClass = partido.esProximo ? 'next' : '';
            html += `<div class="match-item ${nextClass}"><div class="match-date-box"><span class="day">${fecha.dia}</span><span class="month">${fecha.mesCorto}</span></div><div class="match-detail"><div class="teams"><span class="home-team">${partido.local}</span><span class="vs">-</span><span class="away-team">${partido.visitante}</span></div><div class="match-meta"><span><i class="far fa-clock"></i> ${partido.hora}</span><span><i class="fas fa-map-marker-alt"></i> ${partido.estadio}</span></div></div></div>`;
        });
        container.innerHTML = html;
    },

    renderPlantillaHome: function() { /* ... Igual que antes ... */ },
    renderNoticias: function() { /* ... Igual que antes ... */ },
    renderPatrocinadores: function() { /* ... Igual que antes ... */ },
    renderProximoPartido: function() { /* ... Igual que antes ... */ },
    renderEstadisticasEquipo: function() { /* ... Igual que antes ... */ },
    renderPlantillaCompleta: function() { /* ... Igual que antes ... */ },
    renderJugadorCard: function(jugador) { return `<article class="squad-card"><a href="ficha-jugador.html?id=${jugador.id}&season=${this.temporadaActiva}" class="squad-link"><div class="squad-image"><img src="${jugador.imagen}" alt="${jugador.nombreCompleto}"><span class="squad-number">${jugador.dorsal}</span></div><div class="squad-info"><h4 class="squad-name">${jugador.nombreCompleto}</h4><span class="squad-position">${jugador.posicion}</span></div></a></article>`; },
    renderCuerpoTecnico: function() { /* ... Igual que antes ... */ },

    // ===================================
    // FICHA JUGADOR (CON LÓGICA FALLECIDO/ALTURA)
    // ===================================
    renderFichaJugador: function() {
        const container = document.getElementById('fichaJugadorContent');
        if (!container) return;

        const urlParams = new URLSearchParams(window.location.search);
        const jugadorId = urlParams.get('id') || 13;
        const seasonId = urlParams.get('season') || CLUB_DATA.temporadaActual;
        
        const jugador = getJugadorById(jugadorId, seasonId);
        if (!jugador) { container.innerHTML = '<p>Jugador no encontrado</p>'; return; }

        document.title = `${jugador.nombreCompleto} | ${CLUB_DATA.club.nombreCorto}`;
        const breadcrumb = document.querySelector('.breadcrumb .current');
        if (breadcrumb) breadcrumb.textContent = jugador.nombreCompleto;

        // Lógica
        const esTemporadaActual = seasonId === CLUB_DATA.temporadaActual;
        const haFallecido = jugador.fallecido === true;
        const fechaFallecimiento = jugador.fechaFallecimiento || null;

        // Edad
        let edadMostrar = jugador.edad;
        if (haFallecido && fechaFallecimiento && jugador.fechaNacimiento) {
            const nacimiento = new Date(jugador.fechaNacimiento);
            const muerte = new Date(fechaFallecimiento);
            let edadMuerte = muerte.getFullYear() - nacimiento.getFullYear();
            const m = muerte.getMonth() - nacimiento.getMonth();
            if (m < 0 || (m === 0 && muerte.getDate() < nacimiento.getDate())) edadMuerte--;
            edadMostrar = edadMuerte;
        }

        container.innerHTML = `
            <div class="player-photo-container">
                <div class="player-photo-wrapper">
                    <img src="${jugador.imagen}" alt="${jugador.nombreCompleto}" class="player-main-photo">
                    <div class="player-number-large">${jugador.dorsal}</div>
                    <div class="player-role-badge"><span>${jugador.posicion}</span></div>
                    ${haFallecido ? '<div class="deceased-ribbon"></div>' : ''}
                </div>
            </div>
            <div class="player-info-container">
                <div class="player-name-section">
                    <span class="player-position-label">${jugador.posicion}</span>
                    <h1 class="player-full-name">${jugador.nombreCompleto}</h1>
                    ${jugador.redes && !haFallecido ? `<div class="player-social-links">${jugador.redes.instagram ? `<a href="${jugador.redes.instagram}" class="player-social" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}${jugador.redes.twitter ? `<a href="${jugador.redes.twitter}" class="player-social" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}</div>` : ''}
                </div>
                <div class="player-quick-stats">
                    ${this.renderQuickStats(jugador, haFallecido, fechaFallecimiento, edadMostrar, esTemporadaActual)}
                </div>
                <div class="player-season-stats">
                    <h3 class="stats-title">Temporada ${seasonId.replace('-', '/')}</h3>
                    <div class="season-stats-grid">
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-futbol"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.goles}</span><span class="season-stat-label">Goles</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-hands-helping"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.asistencias}</span><span class="season-stat-label">Asistencias</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-running"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.partidos}</span><span class="season-stat-label">Partidos</span></div></div>
                        <div class="season-stat"><div class class="season-stat-icon"><i class="fas fa-clock"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.minutos.toLocaleString()}</span><span class="season-stat-label">Minutos</span></div></div>
                    </div>
                </div>
            </div>
        `;
        this.renderFichaOverview(jugador);
        this.renderFichaMatches(jugador, seasonId);
        this.renderFichaCareerHistory(jugador, seasonId);
    },

    renderQuickStats: function(jugador, haFallecido, fechaFallecimiento, edadMostrar, esTemporadaActual) {
        const altura = jugador.altura ? `${jugador.altura}m` : 'Desconocida';
        let html = '';
        if (esTemporadaActual) {
            html = `<div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">Edad</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">Altura</span></div>`;
        } else {
            if (haFallecido) {
                const fechaFormateada = fechaFallecimiento ? formatearFecha(fechaFallecimiento).completa : 'Fecha desconocida';
                html = `<div class="quick-stat"><span class="quick-stat-value deceased-text">${fechaFormateada}</span><span class="quick-stat-label">Fallecimiento</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">Altura</span></div><div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">Edad</span></div>`;
            } else {
                html = `<div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">Edad</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">Altura</span></div>`;
            }
        }
        return html;
    },

    renderFichaOverview: function(jugador) { /* ... Igual que antes ... */ },

    renderFichaMatches: function(jugador, seasonId) {
        const container = document.getElementById('tabMatches');
        if (!container) return;
        const temporada = getTemporada(seasonId);
        if (!temporada.partidosJugados || temporada.partidosJugados.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#666; padding: 20px;">No hay datos de partidos para esta temporada.</p>';
            return;
        }
        let html = '<div class="matches-list">';
        temporada.partidosJugados.forEach(partido => {
            const fecha = formatearFecha(partido.fecha);
            let resultClass = partido.resultado === 'V' ? 'win' : (partido.resultado === 'E' ? 'draw' : 'loss');
            html += `<article class="match-detail-card"><div class="match-detail-header"><div class="match-date-badge ${resultClass}"><span class="match-day">${fecha.dia}</span><span class="match-month">${fecha.mesCorto}</span></div><div class="match-competition-info"><span class="competition-name">${temporada.competicion} - Jornada ${partido.jornada}</span><div class="match-teams-result"><span class="team-home">${partido.local}</span><span class="match-score">${partido.golesLocal} - ${partido.golesVisitante}</span><span class="team-away">${partido.visitante}</span></div></div></div></article>`;
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
                    temporadaId: temp.id,
                    equipo: CLUB_DATA.club.nombreCorto,
                    logo: datosTemporada.clasificacion.find(e => e.siglas === "SOC")?.logo || "https://picsum.photos/seed/real-oviedo-logo/60/60",
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
            const currentClass = h.actual ? 'current' : '';
            const badgeHtml = h.logo ? `<img src="${h.logo}" alt="Logo" class="team-badge-img">` : `<span class="team-badge-text">SOC</span>`;
            timelineHtml += `<div class="timeline-item ${currentClass}"><div class="timeline-marker"></div><div class="timeline-content"><div class="timeline-header"><span class="timeline-club"><span class="team-badge">${badgeHtml}</span>${h.equipo}</span><span class="timeline-years">${h.temporada}</span></div><div class="timeline-position"><span class="pos-label"><i class="fas fa-tshirt"></i> #${h.dorsal}</span><span class="pos-name">${h.posicion}</span></div><div class="timeline-stats"><span><strong>${h.stats.partidos}</strong> Partidos</span><span><strong>${h.stats.goles}</strong> Goles</span><span><strong>${h.stats.asistencias}</strong> Asistencias</span></div></div></div>`;
        });

        let logrosHtml = '';
        if (jugadorActual.logros) jugadorActual.logros.forEach(l => { logrosHtml += `<div class="achievement"><i class="fas fa-trophy"></i><span>${l}</span></div>`; });

        container.innerHTML = `<div class="career-grid"><div class="career-timeline-card"><h3 class="card-title">Historial en el Club</h3><div class="timeline">${timelineHtml}</div></div><div class="career-totals-card"><h3 class="card-title">Totales en el Club</h3><div class="totals-grid"><div class="total-item"><span class="total-value">${totales.partidos}</span><span class="total-label">Partidos</span></div><div class="total-item highlight"><span class="total-value">${totales.goles}</span><span class="total-label">Goles</span></div><div class="total-item"><span class="total-value">${totales.asistencias}</span><span class="total-label">Asistencias</span></div></div>${logrosHtml ? `<div class="career-achievements"><h4>Logros</h4><div class="achievements-list">${logrosHtml}</div></div>` : ''}</div></div>`;
    }
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });
window.App = App;
