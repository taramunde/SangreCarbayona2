/* ===================================
   APLICACIÓN - RENDERIZADO DINÁMICO
   =================================== */

const App = {
    
    // ===================================
    // INICIALIZACIÓN
    // ===================================
    init: function() {
        this.renderClasificacion();
        this.renderCalendario();
        this.renderPlantillaHome();
        this.renderNoticias();
        this.renderPatrocinadores();
        this.renderProximoPartido();
        this.renderEstadisticasEquipo();
        this.renderPlantillaCompleta();
        this.renderCuerpoTecnico();
        this.renderFichaJugador();
    },

    // ===================================
    // CLASIFICACIÓN
    // ===================================
    renderClasificacion: function() {
        const container = document.getElementById('clasificacionBody');
        if (!container) return;

        const filasVisibles = 5;
        let html = '';

        CLUB_DATA.clasificacion.forEach((equipo, index) => {
            const highlightClass = equipo.destacado ? 'highlight' : '';
            const hiddenClass = index >= filasVisibles ? 'hidden-row' : '';
            
            html += `
                <tr class="${highlightClass} ${hiddenClass}">
                    <td>${equipo.posicion}</td>
                    <td><span class="team-badge">${equipo.siglas}</span> ${equipo.nombre}</td>
                    <td>${equipo.puntos}</td>
                    <td>${equipo.jugados}</td>
                    <td>${equipo.gfavor}</td>
                    <td>${equipo.gcontra}</td>
                    <td>${equipo.dg}</td>
                </tr>
            `;
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
            
            html += `
                <div class="match-item ${nextClass}">
                    <div class="match-date-box">
                        <span class="day">${fecha.dia}</span>
                        <span class="month">${fecha.mesCorto}</span>
                    </div>
                    <div class="match-detail">
                        <div class="teams">
                            <span class="home-team">${partido.local}</span>
                            <span class="vs">-</span>
                            <span class="away-team">${partido.visitante}</span>
                        </div>
                        <div class="match-meta">
                            <span><i class="far fa-clock"></i> ${partido.hora}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${partido.estadio}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // ===================================
    // PLANTILLA HOME
    // ===================================
    renderPlantillaHome: function() {
        const container = document.getElementById('plantillaHomeGrid');
        if (!container) return;

        const posicionesMap = {
            'Portero': 'goalkeeper',
            'Lateral Derecho': 'defender',
            'Lateral Izquierdo': 'defender',
            'Central': 'defender',
            'Mediocentro Defensivo': 'midfielder',
            'Centrocampista': 'midfielder',
            'Mediocentro': 'midfielder',
            'Mediapunta': 'midfielder',
            'Delantero Centro': 'forward',
            'Extremo Derecho': 'forward',
            'Extremo Izquierdo': 'forward',
            'Delantero': 'forward'
        };

        let html = '';

        CLUB_DATA.jugadores.slice(0, 8).forEach(jugador => {
            html += `
                <div class="player-card" data-position="${posicionesMap[jugador.posicion] || 'all'}">
                    <a href="ficha-jugador.html?id=${jugador.id}">
                        <div class="player-image">
                            <img src="${jugador.imagen}" alt="${jugador.nombreCompleto}">
                            <span class="player-number">${jugador.dorsal}</span>
                        </div>
                        <div class="player-info">
                            <span class="player-position">${jugador.posicion}</span>
                            <h4 class="player-name">${jugador.nombreCompleto}</h4>
                        </div>
                    </a>
                </div>
            `;
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

        CLUB_DATA.noticias.forEach((noticia, index) => {
            const mainClass = noticia.esPrincipal ? 'main-news' : '';
            const fecha = formatearFecha(noticia.fecha);
            
            html += `
                <article class="news-card ${mainClass}">
                    <a href="#" class="news-link">
                        <div class="news-image">
                            <img src="${noticia.imagen}" alt="${noticia.titulo}">
                            <span class="news-category">${noticia.categoria}</span>
                        </div>
                        <div class="news-content">
                            <h3>${noticia.titulo}</h3>
                            ${noticia.esPrincipal ? `<p>${noticia.resumen}</p>` : ''}
                            <span class="news-date">${fecha.dia} ${fecha.mes} ${fecha.año}</span>
                        </div>
                    </a>
                </article>
            `;
        });

        container.innerHTML = html;
    },

    // ===================================
    // PATROCINADORES
    // ===================================
    renderPatrocinadores: function() {
        const container = document.getElementById('patrocinadoresGrid');
        if (!container) return;

        let html = '';

        CLUB_DATA.patrocinadores.forEach(pat => {
            html += `
                <div class="sponsor-item">
                    <div class="sponsor-logo"><span>${pat.nombre}</span></div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // ===================================
    // PRÓXIMO PARTIDO (HERO)
    // ===================================
    renderProximoPartido: function() {
        const container = document.getElementById('heroMatch');
        if (!container) return;

        const partido = CLUB_DATA.proximoPartido;
        const fecha = formatearFecha(partido.fecha);

        container.innerHTML = `
            <div class="match-competition">
                <span class="competition-badge">${partido.competicion} - Jornada ${partido.jornada}</span>
                <span class="match-date">
                    <i class="far fa-calendar"></i> Domingo ${fecha.dia} ${fecha.mes} ${fecha.año}
                    <i class="far fa-clock"></i> ${partido.hora}h
                </span>
            </div>
            
            <div class="match-teams">
                <div class="team home">
                    <div class="team-logo-large"><span>${partido.localSiglas}</span></div>
                    <span class="team-name-large">${partido.local}</span>
                </div>
                <div class="match-vs"><span>VS</span></div>
                <div class="team away">
                    <div class="team-logo-large away-logo"><span>${partido.visitanteSiglas}</span></div>
                    <span class="team-name-large">${partido.visitante}</span>
                </div>
            </div>

            <div class="match-info">
                <p><i class="fas fa-map-marker-alt"></i> ${partido.estadio}</p>
            </div>

            <div class="match-actions">
                <a href="#" class="btn-primary">
                    <i class="fas fa-ticket-alt"></i> Comprar Entradas
                </a>
                <a href="#" class="btn-secondary">
                    <i class="fas fa-tv"></i> Ver Directo
                </a>
            </div>
        `;
    },

    // ===================================
    // ESTADÍSTICAS EQUIPO
    // ===================================
    renderEstadisticasEquipo: function() {
        const container = document.getElementById('teamStatsGrid');
        if (!container) return;

        const stats = CLUB_DATA.estadisticasEquipo;

        container.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-trophy"></i></div>
                <div class="stat-number">${stats.posicion}º</div>
                <div class="stat-label">Posición en Liga</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-futbol"></i></div>
                <div class="stat-number">${stats.golesFavor}</div>
                <div class="stat-label">Goles a Favor</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-shield-alt"></i></div>
                <div class="stat-number">${stats.golesContra}</div>
                <div class="stat-label">Goles en Contra</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                <div class="stat-number">${stats.victorias}</div>
                <div class="stat-label">Victorias</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-handshake"></i></div>
                <div class="stat-number">${stats.empates}</div>
                <div class="stat-label">Empates</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-times-circle"></i></div>
                <div class="stat-number">${stats.derrotas}</div>
                <div class="stat-label">Derrotas</div>
            </div>
        `;
    },

    // ===================================
    // PLANTILLA COMPLETA
    // ===================================
    renderPlantillaCompleta: function() {
        const container = document.getElementById('plantillaCompleta');
        if (!container) return;

        const posiciones = {
            'Porteros': ['Portero'],
            'Defensas': ['Lateral Derecho', 'Lateral Izquierdo', 'Central'],
            'Centrocampistas': ['Mediocentro Defensivo', 'Centrocampista', 'Mediocentro', 'Mediapunta'],
            'Delanteros': ['Delantero Centro', 'Extremo Derecho', 'Extremo Izquierdo', 'Delantero']
        };

        const iconos = {
            'Porteros': 'fa-hand-paper',
            'Defensas': 'fa-shield-alt',
            'Centrocampistas': 'fa-sync-alt',
            'Delanteros': 'fa-bullseye'
        };

        let html = '';

        for (const [nombrePosicion, posicionesLista] of Object.entries(posiciones)) {
            const jugadoresPosicion = CLUB_DATA.jugadores.filter(j => posicionesLista.includes(j.posicion));
            
            if (jugadoresPosicion.length === 0) continue;

            html += `
                <div class="position-group">
                    <h3 class="position-title">
                        <span class="position-icon"><i class="fas ${iconos[nombrePosicion]}"></i></span>
                        ${nombrePosicion}
                    </h3>
                    <div class="squad-grid">
            `;

            jugadoresPosicion.forEach(jugador => {
                html += this.renderJugadorCard(jugador);
            });

            html += `
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    },

    // ===================================
    // CARD JUGADOR
    // ===================================
    renderJugadorCard: function(jugador) {
        return `
            <article class="squad-card">
                <a href="ficha-jugador.html?id=${jugador.id}" class="squad-link">
                    <div class="squad-image">
                        <img src="${jugador.imagen}" alt="${jugador.nombreCompleto}">
                        <span class="squad-number">${jugador.dorsal}</span>
                        <div class="squad-overlay">
                            <span class="view-profile">Ver ficha</span>
                        </div>
                    </div>
                    <div class="squad-info">
                        <h4 class="squad-name">${jugador.nombreCompleto}</h4>
                        <span class="squad-position">${jugador.posicion}</span>
                        <div class="squad-meta">
                            <span><i class="far fa-calendar"></i> ${jugador.edad} años</span>
                            <span><i class="fas fa-ruler-vertical"></i> ${jugador.altura}m</span>
                        </div>
                        <div class="squad-stats">
                            <div class="mini-stat">
                                <span class="mini-stat-value">${jugador.stats.partidos}</span>
                                <span class="mini-stat-label">Partidos</span>
                            </div>
                            <div class="mini-stat">
                                <span class="mini-stat-value">${jugador.stats.goles}</span>
                                <span class="mini-stat-label">Goles</span>
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        `;
    },

    // ===================================
    // CUERPO TÉCNICO
    // ===================================
    renderCuerpoTecnico: function() {
        const container = document.getElementById('cuerpoTecnicoGrid');
        if (!container) return;

        let html = '';

        CLUB_DATA.cuerpoTecnico.forEach(miembro => {
            const mainClass = miembro.esPrincipal ? 'main-coach' : '';
            
            html += `
                <article class="coach-card ${mainClass}">
                    <div class="coach-image">
                        <img src="${miembro.imagen}" alt="${miembro.nombre}">
                    </div>
                    <div class="coach-info">
                        <span class="coach-role">${miembro.cargo}</span>
                        <h3 class="coach-name">${miembro.nombre}</h3>
                        <p class="coach-bio">${miembro.descripcion}</p>
                        ${miembro.estadisticas ? `
                        <div class="coach-stats">
                            <div class="coach-stat">
                                <span class="coach-stat-value">${miembro.estadisticas.partidos}</span>
                                <span class="coach-stat-label">Partidos</span>
                            </div>
                            <div class="coach-stat">
                                <span class="coach-stat-value">${Math.round(miembro.estadisticas.victorias / miembro.estadisticas.partidos * 100)}%</span>
                                <span class="coach-stat-label">Victorias</span>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </article>
            `;
        });

        container.innerHTML = html;
    },

    // ===================================
    // FICHA JUGADOR
    // ===================================
    renderFichaJugador: function() {
        const container = document.getElementById('fichaJugadorContent');
        if (!container) return;

        // Obtener ID de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const jugadorId = urlParams.get('id') || 13; // Por defecto Javi Martínez
        
        const jugador = getJugadorById(jugadorId);
        if (!jugador) {
            container.innerHTML = '<p>Jugador no encontrado</p>';
            return;
        }

        const fechaNac = formatearFecha(jugador.fechaNacimiento);

        // Actualizar título de la página
        document.title = `${jugador.nombreCompleto} | CD Villaferreira`;

        // Actualizar breadcrumb
        const breadcrumb = document.querySelector('.breadcrumb .current');
        if (breadcrumb) breadcrumb.textContent = jugador.nombreCompleto;

        container.innerHTML = `
            <div class="player-photo-container">
                <div class="player-photo-wrapper">
                    <img src="${jugador.imagen}" alt="${jugador.nombreCompleto}" class="player-main-photo">
                    <div class="player-number-large">${jugador.dorsal}</div>
                    <div class="player-role-badge">
                        <span>${jugador.posicion}</span>
                    </div>
                </div>
            </div>

            <div class="player-info-container">
                <div class="player-name-section">
                    <span class="player-position-label">${jugador.posicion}</span>
                    <h1 class="player-full-name">${jugador.nombreCompleto}</h1>
                    ${jugador.redes ? `
                    <div class="player-social-links">
                        ${jugador.redes.instagram ? `<a href="${jugador.redes.instagram}" class="player-social" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                        ${jugador.redes.twitter ? `<a href="${jugador.redes.twitter}" class="player-social" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                    </div>
                    ` : ''}
                </div>

                <div class="player-quick-stats">
                    <div class="quick-stat">
                        <span class="quick-stat-value">${jugador.edad}</span>
                        <span class="quick-stat-label">Edad</span>
                    </div>
                    <div class="quick-stat">
                        <span class="quick-stat-value">${jugador.altura}m</span>
                        <span class="quick-stat-label">Altura</span>
                    </div>
                    <div class="quick-stat">
                        <span class="quick-stat-value">${jugador.peso}kg</span>
                        <span class="quick-stat-label">Peso</span>
                    </div>
                    <div class="quick-stat">
                        <span class="quick-stat-value">${jugador.pie.charAt(0)}</span>
                        <span class="quick-stat-label">Pie</span>
                    </div>
                </div>

                <div class="player-season-stats">
                    <h3 class="stats-title">Temporada ${CLUB_DATA.temporada.año}</h3>
                    <div class="season-stats-grid">
                        <div class="season-stat">
                            <div class="season-stat-icon"><i class="fas fa-futbol"></i></div>
                            <div class="season-stat-content">
                                <span class="season-stat-value">${jugador.stats.goles}</span>
                                <span class="season-stat-label">Goles</span>
                            </div>
                        </div>
                        <div class="season-stat">
                            <div class="season-stat-icon"><i class="fas fa-hands-helping"></i></div>
                            <div class="season-stat-content">
                                <span class="season-stat-value">${jugador.stats.asistencias}</span>
                                <span class="season-stat-label">Asistencias</span>
                            </div>
                        </div>
                        <div class="season-stat">
                            <div class="season-stat-icon"><i class="fas fa-running"></i></div>
                            <div class="season-stat-content">
                                <span class="season-stat-value">${jugador.stats.partidos}</span>
                                <span class="season-stat-label">Partidos</span>
                            </div>
                        </div>
                        <div class="season-stat">
                            <div class="season-stat-icon"><i class="fas fa-clock"></i></div>
                            <div class="season-stat-content">
                                <span class="season-stat-value">${jugador.stats.minutos.toLocaleString()}</span>
                                <span class="season-stat-label">Minutos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Renderizar pestañas
        this.renderFichaOverview(jugador);
        this.renderFichaPartidos(jugador);
        this.renderFichaTrayectoria(jugador);
    },

    // ===================================
    // FICHA - OVERVIEW TAB
    // ===================================
    renderFichaOverview: function(jugador) {
        const container = document.getElementById('tabOverview');
        if (!container) return;

        const fechaNac = formatearFecha(jugador.fechaNacimiento);

        container.innerHTML = `
            <div class="overview-grid">
                <div class="performance-card">
                    <h3 class="card-title">Rendimiento por Partido</h3>
                    <div class="performance-stats">
                        <div class="performance-item">
                            <div class="performance-header">
                                <span>Goles por partido</span>
                                <span class="performance-value">${(jugador.stats.goles / jugador.stats.partidos).toFixed(2)}</span>
                            </div>
                            <div class="performance-bar">
                                <div class="performance-fill" style="width: ${(jugador.stats.goles / jugador.stats.partidos) * 100}%"></div>
                            </div>
                        </div>
                        <div class="performance-item">
                            <div class="performance-header">
                                <span>Minutos por partido</span>
                                <span class="performance-value">${Math.round(jugador.stats.minutos / jugador.stats.partidos)}'</span>
                            </div>
                            <div class="performance-bar">
                                <div class="performance-fill" style="width: ${(jugador.stats.minutos / jugador.stats.partidos / 90) * 100}%"></div>
                            </div>
                        </div>
                        <div class="performance-item">
                            <div class="performance-header">
                                <span>Asistencias</span>
                                <span class="performance-value">${jugador.stats.asistencias}</span>
                            </div>
                            <div class="performance-bar">
                                <div class="performance-fill" style="width: ${jugador.stats.asistencias * 10}%"></div>
                            </div>
                        </div>
                        <div class="performance-item">
                            <div class="performance-header">
                                <span>Tarjetas amarillas</span>
                                <span class="performance-value">${jugador.stats.amarillas}</span>
                            </div>
                            <div class="performance-bar">
                                <div class="performance-fill" style="width: ${jugador.stats.amarillas * 10}%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="personal-info-card">
                    <h3 class="card-title">Información Personal</h3>
                    <div class="personal-info-list">
                        <div class="info-row">
                            <span class="info-label"><i class="far fa-calendar"></i> Fecha de nacimiento</span>
                            <span class="info-value">${fechaNac.completa}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-map-marker-alt"></i> Lugar de nacimiento</span>
                            <span class="info-value">${jugador.lugarNacimiento}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="fas fa-flag"></i> Nacionalidad</span>
                            <span class="info-value">${jugador.nacionalidad}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="far fa-calendar-check"></i> En el club desde</span>
                            <span class="info-value">${jugador.enClubDesde}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label"><i class="far fa-file-contract"></i> Contrato hasta</span>
                            <span class="info-value">30 Junio ${jugador.contratoHasta}</span>
                        </div>
                    </div>
                </div>

                ${jugador.golesPorZona ? `
                <div class="goals-distribution-card">
                    <h3 class="card-title">Distribución de Goles</h3>
                    <div class="goals-grid">
                        <div class="goal-type">
                            <div class="goal-icon right-foot"><i class="fas fa-shoe-prints"></i></div>
                            <div class="goal-info">
                                <span class="goal-count">${jugador.golesPorZona.pieDerecho}</span>
                                <span class="goal-label">Pie derecho</span>
                            </div>
                        </div>
                        <div class="goal-type">
                            <div class="goal-icon left-foot"><i class="fas fa-shoe-prints fa-flip-horizontal"></i></div>
                            <div class="goal-info">
                                <span class="goal-count">${jugador.golesPorZona.pieIzquierdo}</span>
                                <span class="goal-label">Pie izquierdo</span>
                            </div>
                        </div>
                        <div class="goal-type">
                            <div class="goal-icon header"><i class="fas fa-volleyball-ball"></i></div>
                            <div class="goal-info">
                                <span class="goal-count">${jugador.golesPorZona.cabeza}</span>
                                <span class="goal-label">Cabeza</span>
                            </div>
                        </div>
                        <div class="goal-type">
                            <div class="goal-icon penalty"><i class="fas fa-bullseye"></i></div>
                            <div class="goal-info">
                                <span class="goal-count">${jugador.golesPorZona.penaltis}</span>
                                <span class="goal-label">Penaltis</span>
                            </div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <div class="disciplinary-card">
                    <h3 class="card-title">Disciplina</h3>
                    <div class="cards-display">
                        <div class="card-item yellow">
                            <div class="card-icon"><i class="fas fa-square"></i></div>
                            <div class="card-info">
                                <span class="card-count">${jugador.stats.amarillas}</span>
                                <span class="card-label">Amarillas</span>
                            </div>
                        </div>
                        <div class="card-item red">
                            <div class="card-icon"><i class="fas fa-square"></i></div>
                            <div class="card-info">
                                <span class="card-count">${jugador.stats.rojas}</span>
                                <span class="card-label">Rojas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // ===================================
    // FICHA - PARTIDOS TAB
    // ===================================
    renderFichaPartidos: function(jugador) {
        const container = document.getElementById('tabMatches');
        if (!container) return;

        let html = '';

        CLUB_DATA.partidosJugados.forEach(partido => {
            const fecha = formatearFecha(partido.fecha);
            let resultClass = '';
            if (partido.resultado === 'V') resultClass = 'win';
            else if (partido.resultado === 'E') resultClass = 'draw';
            else resultClass = 'loss';

            html += `
                <article class="match-detail-card">
                    <div class="match-detail-header">
                        <div class="match-date-badge ${resultClass}">
                            <span class="match-day">${fecha.dia}</span>
                            <span class="match-month">${fecha.mesCorto}</span>
                        </div>
                        <div class="match-competition-info">
                            <span class="competition-name">Primera RFEF - Jornada ${partido.jornada}</span>
                            <div class="match-teams-result">
                                <span class="team-home">${partido.local}</span>
                                <span class="match-score">${partido.golesLocal} - ${partido.golesVisitante}</span>
                                <span class="team-away">${partido.visitante}</span>
                            </div>
                        </div>
                    </div>
                </article>
            `;
        });

        container.innerHTML = `<div class="matches-list">${html}</div>`;
    },

    // ===================================
    // FICHA - TRAYECTORIA TAB
    // ===================================
    renderFichaTrayectoria: function(jugador) {
        const container = document.getElementById('tabCareer');
        if (!container) return;

        // Si no tiene trayectoria, calcular totales de la temporada
        const totalPartidos = jugador.stats.partidos;
        const totalGoles = jugador.stats.goles;
        const totalAsistencias = jugador.stats.asistencias;

        let trayectoriaHtml = '';
        
        if (jugador.trayectoria) {
            jugador.trayectoria.forEach(club => {
                const currentClass = club.actual ? 'current' : '';
                trayectoriaHtml += `
                    <div class="timeline-item ${currentClass}">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <span class="timeline-club">
                                    <span class="club-badge-small">${club.siglas}</span>
                                    ${club.club}
                                </span>
                                <span class="timeline-years">${club.años}</span>
                            </div>
                            <div class="timeline-stats">
                                <span><strong>${club.partidos}</strong> Partidos</span>
                                <span><strong>${club.goles}</strong> Goles</span>
                                ${club.asistencias ? `<span><strong>${club.asistencias}</strong> Asistencias</span>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        let logrosHtml = '';
        if (jugador.logros) {
            jugador.logros.forEach(logro => {
                logrosHtml += `
                    <div class="achievement">
                        <i class="fas fa-trophy"></i>
                        <span>${logro}</span>
                    </div>
                `;
            });
        }

        container.innerHTML = `
            <div class="career-grid">
                <div class="career-timeline-card">
                    <h3 class="card-title">Trayectoria Profesional</h3>
                    <div class="timeline">
                        ${trayectoriaHtml}
                    </div>
                </div>

                <div class="career-totals-card">
                    <h3 class="card-title">Estadísticas Temporada</h3>
                    <div class="totals-grid">
                        <div class="total-item">
                            <span class="total-value">${totalPartidos}</span>
                            <span class="total-label">Partidos</span>
                        </div>
                        <div class="total-item highlight">
                            <span class="total-value">${totalGoles}</span>
                            <span class="total-label">Goles</span>
                        </div>
                        <div class="total-item">
                            <span class="total-value">${totalAsistencias}</span>
                            <span class="total-label">Asistencias</span>
                        </div>
                        <div class="total-item">
                            <span class="total-value">${(totalGoles / totalPartidos).toFixed(2)}</span>
                            <span class="total-label">Goles/Partido</span>
                        </div>
                    </div>
                    ${logrosHtml ? `
                    <div class="career-achievements">
                        <h4>Logros</h4>
                        <div class="achievements-list">
                            ${logrosHtml}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});

// Exportar
window.App = App;
