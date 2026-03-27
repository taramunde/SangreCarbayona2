/* =====================================================
   js/calendario.js
   ===================================================== */

(function () {

    // ── Constantes ──────────────────────────────────────
    const OVIEDO       = 'Real Oviedo';
    const POR_JORNADA  = 10;

    // ── Utilidades ──────────────────────────────────────
    function getEscudo(nombre) {
        if (typeof equipos === 'undefined') return '';
        const eq = equipos.find(e => e.nombre === nombre);
        return eq ? eq.escudo : '';
    }

    function getPartidosOviedo() {
        if (typeof enfrentamientos === 'undefined') return [];
        return enfrentamientos
            .map((p, idx) => ({
                ...p,
                jornada:  Math.floor(idx / POR_JORNADA) + 1,
                jugado:   p.goles1 !== null && p.goles2 !== null
            }))
            .filter(p => p.equipo1 === OVIEDO || p.equipo2 === OVIEDO);
    }

    // ── Función de Filtrado y Estadísticas ──────────────
    function filtrarPartidos(filtro) {
        const cards = document.querySelectorAll('.cal-match-card');
        let stats = { jugados: 0, victorias: 0, empates: 0, derrotas: 0, pendientes: 0 };
        let visibles = 0;

        cards.forEach(card => {
            const esCasa = card.getAttribute('data-casa') === 'true';
            const jugado = card.getAttribute('data-jugado') === 'true';
            const resultado = card.getAttribute('data-resultado');

            let mostrar = (filtro === 'todos') || (filtro === 'casa' && esCasa) || (filtro === 'fuera' && !esCasa);

            if (mostrar) {
                card.style.display = 'flex';
                visibles++;
                if (!jugado) {
                    stats.pendientes++;
                } else {
                    stats.jugados++;
                    if (resultado === 'V') stats.victorias++;
                    else if (resultado === 'E') stats.empates++;
                    else if (resultado === 'D') stats.derrotas++;
                }
            } else {
                card.style.display = 'none';
            }
        });

        // Actualizar Hero Stats
        if(document.getElementById('calStatJugados')) {
            document.getElementById('calStatJugados').textContent = stats.jugados;
            document.getElementById('calStatVictorias').textContent = stats.victorias;
            document.getElementById('calStatEmpates').textContent = stats.empates;
            document.getElementById('calStatDerrotas').textContent = stats.derrotas;
            document.getElementById('calStatPendientes').textContent = stats.pendientes;
        }

        const emptyMsg = document.getElementById('calEmpty');
        if (emptyMsg) {
            visibles === 0 ? emptyMsg.classList.add('visible') : emptyMsg.classList.remove('visible');
        }
    }

    // ── Renderizado Principal ───────────────────────────
    function renderizarCalendario() {
        const container = document.getElementById('calendarioList');
        if (!container) return;

        const partidos = getPartidosOviedo();
        container.innerHTML = '';

        partidos.forEach(p => {
            const esCasa = p.equipo1 === OVIEDO;
            const rival  = esCasa ? p.equipo2 : p.equipo1;
            
            // Lógica de resultado para el Oviedo
            let resLetra = ''; 
            if (p.jugado) {
                if (p.goles1 === p.goles2) resLetra = 'E';
                else if (esCasa && p.goles1 > p.goles2) resLetra = 'V';
                else if (!esCasa && p.goles2 > p.goles1) resLetra = 'V';
                else resLetra = 'D';
            }

            const card = document.createElement('div');
            card.className = 'cal-match-card';
            card.setAttribute('data-casa', esCasa);
            card.setAttribute('data-jugado', p.jugado);
            card.setAttribute('data-resultado', resLetra);

            card.innerHTML = `
                <div class="cal-match-jornada">Jornada ${p.jornada}</div>
                <div class="cal-match-main">
                    <div class="cal-team ${esCasa ? 'oviedo' : ''}">
                        <img src="${getEscudo(p.equipo1)}" class="cal-team-escudo">
                        <span class="cal-team-nombre">${p.equipo1}</span>
                    </div>
                    <div class="cal-score-box ${p.jugado ? 'finalizado' : ''}">
                        ${p.jugado ? `<span class="cal-score">${p.goles1} - ${p.goles2}</span>` : '<span class="cal-vs">VS</span>'}
                    </div>
                    <div class="cal-team ${!esCasa ? 'oviedo' : ''}">
                        <img src="${getEscudo(p.equipo2)}" class="cal-team-escudo">
                        <span class="cal-team-nombre">${p.equipo2}</span>
                    </div>
                </div>
                <div class="cal-match-footer">
                    <span class="cal-venue"><i class="fas fa-map-marker-alt"></i> ${esCasa ? 'Carlos Tartiere' : 'Visitante'}</span>
                    ${p.jugado ? `<span class="cal-status status-fin">Finalizado</span>` : `<span class="cal-status status-prox">Próximamente</span>`}
                </div>
            `;
            container.appendChild(card);
        });

        // Eventos de botones de filtro
        document.querySelectorAll('.cal-filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelector('.cal-filter-btn.active').classList.remove('active');
                this.classList.add('active');
                filtrarPartidos(this.getAttribute('data-filter'));
            });
        });

        // Inicializar stats
        filtrarPartidos('todos');
    }

    // ── Widget Home (index.html) ────────────────────────
    function renderWidgetHome() {
        const container = document.getElementById('calendarioList');
        if (!container || window.location.pathname.includes('calendario.html')) return;

        const partidos = getPartidosOviedo();
        const proximo = partidos.find(p => !p.jugado);
        const ultimo  = [...partidos].reverse().find(p => p.jugado);

        if (!proximo && !ultimo) return;

        container.innerHTML = '';
        
        // Renderizamos aquí el estilo mini para la home si fuera necesario
        // (Por brevedad, se asume que calendarioList en index.html usa el mismo estilo o similar)
    }

    // ── Inicialización ──────────────────────────────────
    if (document.getElementById('calendarioList')) {
        // Si estamos en la página de calendario
        if (window.location.pathname.includes('calendario.html')) {
            renderizarCalendario();
        } else {
            // Si estamos en index.html (widget lateral)
            renderWidgetHome();
        }
    }

})();