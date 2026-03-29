/* =====================================================
   js/calendario.js
   Depende de: js/clasificacion.js (debe cargarse antes)
   Funciona en: calendario.html  →  renderiza jornadas completas
                index.html       →  renderiza widget "próximo partido"
   ===================================================== */

(function () {

    // ── Constantes ──────────────────────────────────────
    const OVIEDO       = 'Real Oviedo';
    const POR_JORNADA  = 10;

    // ── Utilidades ──────────────────────────────────────
    /**
     * Devuelve el escudo de un equipo buscándolo en el array
     * global `equipos` que expone clasificacion.js.
     */
    function getEscudo(nombre) {
        if (typeof equipos === 'undefined') return '';
        const eq = equipos.find(e => e.nombre === nombre);
        return eq ? eq.escudo : '';
    }

    // ── Datos de partidos del Oviedo ─────────────────────
    /**
     * Filtra únicamente los partidos en los que juega el Oviedo
     * e incluye el número de jornada.
     */
    function getPartidosOviedo() {
        if (typeof enfrentamientos === 'undefined') return [];

        return enfrentamientos
            .map((p, idx) => ({
                ...p,
                jornada:  Math.floor(idx / POR_JORNADA) + 1,
                jugado:   p.goles1 !== null && p.goles2 !== null
            }))
            .filter(p =>
                p.equipo1 === OVIEDO || p.equipo2 === OVIEDO
            );
    }

    // ── Estadísticas del Oviedo ──────────────────────────
    function calcularStats(partidos) {
        let jugados = 0, ganados = 0, empates = 0, derrotas = 0;
        let gf = 0, gc = 0, pendientes = 0;

        partidos.forEach(p => {
            if (!p.jugado) { pendientes++; return; }
            jugados++;
            const esLocal = p.equipo1 === OVIEDO;
            const golesO  = esLocal ? p.goles1 : p.goles2;
            const golesR  = esLocal ? p.goles2 : p.goles1;
            gf += golesO;
            gc += golesR;
            if      (golesO > golesR) ganados++;
            else if (golesO < golesR) derrotas++;
            else                      empates++;
        });

        return { jugados, ganados, empates, derrotas, gf, gc, pendientes };
    }

    // ── Estado visual del partido ────────────────────────
    function getEstado(p) {
        if (!p.jugado) return 'pendiente';
        const esLocal = p.equipo1 === OVIEDO;
        const golesO  = esLocal ? p.goles1 : p.goles2;
        const golesR  = esLocal ? p.goles2 : p.goles1;
        if      (golesO > golesR) return 'victoria';
        else if (golesO < golesR) return 'derrota';
        else                      return 'empate';
    }

    // ── Próximo partido del Oviedo ───────────────────────
    function getProximoPartido(partidos) {
        return partidos.find(p => !p.jugado) || null;
    }

    // ── Último partido jugado ────────────────────────────
    function getUltimoPartido(partidos) {
        const jugados = partidos.filter(p => p.jugado);
        return jugados.length ? jugados[jugados.length - 1] : null;
    }

    // =====================================================
    //   RENDERIZADO — calendario.html
    // =====================================================
    function renderCalendario() {
        const container = document.getElementById('jornadasContainer');
        if (!container) return;   // no estamos en calendario.html

        const partidos = getPartidosOviedo();
        if (!partidos.length) {
            container.innerHTML = '<p style="text-align:center;padding:40px;color:#888">No hay datos de partidos.</p>';
            return;
        }

        // Stats
        const stats = calcularStats(partidos);
        actualizarStatBar(stats);

        const proximo = getProximoPartido(partidos);

        // Agrupar por jornada
        const jornadas = {};
        partidos.forEach(p => {
            if (!jornadas[p.jornada]) jornadas[p.jornada] = [];
            jornadas[p.jornada].push(p);
        });

        container.innerHTML = '';

        Object.keys(jornadas)
            .sort((a, b) => a - b)
            .forEach(numJornada => {
                const ps = jornadas[numJornada];

                const block = document.createElement('div');
                block.className = 'cal-jornada-block';
                block.dataset.jornada = numJornada;

                // Cabecera jornada
                block.innerHTML = `
                    <div class="cal-jornada-header">
                        <span class="cal-jornada-num">Jornada ${numJornada}</span>
                        <span class="cal-jornada-line"></span>
                    </div>
                `;

                // Tarjetas de partido
                ps.forEach(p => {
                    const esLocal   = p.equipo1 === OVIEDO;
                    const rival     = esLocal ? p.equipo2 : p.equipo1;
                    const escudoO   = getEscudo(OVIEDO);
                    const escudoR   = getEscudo(rival);
                    const estado    = getEstado(p);
                    const esProximo = proximo && p === proximo;

                    // Datos visuales del resultado
                    let centroHTML;
                    if (p.jugado) {
                        const golesO = esLocal ? p.goles1 : p.goles2;
                        const golesR = esLocal ? p.goles2 : p.goles1;
                        const badgeClass = { victoria: 'badge-victoria', empate: 'badge-empate', derrota: 'badge-derrota' }[estado];
                        const badgeText  = { victoria: 'Victoria', empate: 'Empate', derrota: 'Derrota' }[estado];
                        centroHTML = `
                            <div class="cal-resultado">
                                ${golesO}<span class="cal-resultado-sep">–</span>${golesR}
                            </div>
                            <span class="cal-resultado-badge ${badgeClass}">${badgeText}</span>
                        `;
                    } else {
                        centroHTML = `
                            <div class="cal-vs">VS</div>
                            <span class="cal-localidad">${esLocal ? 'Casa' : 'Fuera'}</span>
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
                    card.dataset.estado   = estado; // victoria | empate | derrota | pendiente
                    card.dataset.localidad = esLocal ? 'local' : 'visitante';

                    card.innerHTML = `
                        <div class="cal-team local">
                            <img src="${escudoIzq}" alt="${equipoIzq}" class="cal-team-escudo">
                            <span class="cal-team-nombre${equipoIzq === OVIEDO ? ' es-oviedo' : ''}">${equipoIzq}</span>
                        </div>
                        <div class="cal-match-center">
                            ${centroHTML}
                        </div>
                        <div class="cal-team visitante">
                            <img src="${escudoDer}" alt="${equipoDer}" class="cal-team-escudo">
                            <span class="cal-team-nombre${equipoDer === OVIEDO ? ' es-oviedo' : ''}">${equipoDer}</span>
                        </div>
                    `;

                    block.appendChild(card);
                });

                container.appendChild(block);
            });

        // Mensaje vacío (usado por filtros)
        const emptyMsg = document.createElement('div');
        emptyMsg.id = 'calEmpty';
        emptyMsg.className = 'cal-empty';
        emptyMsg.innerHTML = '<i class="fas fa-search"></i>No hay partidos con ese filtro.';
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
        set('statJugados',   stats.jugados);
        set('statGanados',   stats.ganados);
        set('statEmpates',   stats.empates);
        set('statDerrotas',  stats.derrotas);
        set('statGoles',     `${stats.gf}:${stats.gc}`);
        set('statPendientes', stats.pendientes);
    }

    // ── Filtros ──────────────────────────────────────────
    function iniciarFiltros() {
        const btns  = document.querySelectorAll('.cal-filter-btn');
        const empty = document.getElementById('calEmpty');

        btns.forEach(btn => {
            btn.addEventListener('click', function () {
                btns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filtro = this.dataset.filter;
                aplicarFiltro(filtro, empty);
            });
        });
    }

    function aplicarFiltro(filtro, emptyMsg) {
        const cards    = document.querySelectorAll('.cal-match-card');
        const bloques  = document.querySelectorAll('.cal-jornada-block');
        let   visible  = 0;

        // 1. Filtrar las tarjetas visualmente (lo que ya tenías)
        cards.forEach(card => {
            const estado    = card.dataset.estado;
            const localidad = card.dataset.localidad;

            let mostrar = false;
            switch (filtro) {
                case 'todos':      mostrar = true; break;
                case 'jugados':    mostrar = estado !== 'pendiente'; break;
                case 'pendientes': mostrar = estado === 'pendiente'; break;
                case 'local':      mostrar = localidad === 'local'; break;
                case 'visitante':  mostrar = localidad === 'visitante'; break;
            }

            card.classList.toggle('oculto', !mostrar);
            if (mostrar) visible++;
        });

        // Ocultar bloques de jornada que queden completamente vacíos
        bloques.forEach(bloque => {
            const tieneVisibles = bloque.querySelectorAll('.cal-match-card:not(.oculto)').length > 0;
            bloque.classList.toggle('hidden', !tieneVisibles);
        });

        if (emptyMsg) emptyMsg.classList.toggle('visible', visible === 0);

        // 2. NUEVO: Recalcular las estadísticas de arriba según el filtro
        const todosLosPartidos = getPartidosOviedo();
        let partidosFiltrados = [];

        switch (filtro) {
            case 'todos':
                partidosFiltrados = todosLosPartidos;
                break;
            case 'jugados':
                partidosFiltrados = todosLosPartidos.filter(p => p.jugado);
                break;
            case 'pendientes':
                partidosFiltrados = todosLosPartidos.filter(p => !p.jugado);
                break;
            case 'local':
                partidosFiltrados = todosLosPartidos.filter(p => p.equipo1 === OVIEDO);
                break;
            case 'visitante':
                partidosFiltrados = todosLosPartidos.filter(p => p.equipo2 === OVIEDO);
                break;
        }

        // Usamos tus funciones existentes para calcular y pintar los números
        const nuevasStats = calcularStats(partidosFiltrados);
        actualizarStatBar(nuevasStats);
    }

    // =====================================================
    //   RENDERIZADO — index.html (widget próximo partido)
    // =====================================================
    function renderWidgetHome() {
        // Cambiamos 'calendarioList' por 'proximoPartidoWidget'
        const lista = document.getElementById('proximoPartidoWidget');
        if (!lista) return;   // no estamos en index.html

        const partidos = getPartidosOviedo();
        const proximo  = getProximoPartido(partidos);

        lista.innerHTML = '';

        // ── Próximo partido (Único elemento a mostrar) ────────
        if (proximo) {
            const esLocal = proximo.equipo1 === OVIEDO;
            
            // Asignamos siempre el equipo 1 a la izquierda (Local) y el 2 a la derecha (Visitante)
            const equipoLocal = proximo.equipo1;
            const equipoVisitante = proximo.equipo2;
            
            const escudoLocal = getEscudo(equipoLocal);
            const escudoVisitante = getEscudo(equipoVisitante);

            const elProximo = document.createElement('div');
            elProximo.className = 'match-item home-match-next';
            elProximo.innerHTML = `
                <div class="home-match-meta">
                    <span class="home-match-label">Jornada ${proximo.jornada}</span>
                    <span class="home-localidad-badge">${esLocal ? 'Casa' : 'Fuera'}</span>
                </div>
                <div class="home-match-teams">
                    <div class="home-team ${equipoLocal === OVIEDO ? 'oviedo' : ''}">
                        <img src="${escudoLocal}" alt="${equipoLocal}" class="home-escudo-sm">
                        <span>${equipoLocal}</span>
                    </div>
                    <div class="home-score home-score-vs">VS</div>
                    <div class="home-team right ${equipoVisitante === OVIEDO ? 'oviedo' : ''}">
                        <img src="${escudoVisitante}" alt="${equipoVisitante}" class="home-escudo-sm">
                        <span>${equipoVisitante}</span>
                    </div>
                </div>
            `;
            lista.appendChild(elProximo);
        } else {
            lista.innerHTML = '<p style="text-align:center;color:#888;font-size:0.9em;padding:10px;">No hay próximos partidos.</p>';
        }

        // Actualizar enlace "Calendario completo"
        const verTodo = document.querySelector('.upcoming-matches .view-all');
        if (verTodo) verTodo.href = 'calendario.html';
    }

    // =====================================================
    //   INICIALIZACIÓN
    // =====================================================
    // clasificacion.js ya se ejecutó antes (mismo orden de scripts)
    // por lo que `equipos` y `enfrentamientos` están disponibles.

    renderCalendario();
    renderWidgetHome();

    // ── Estilos inline para el widget home ──────────────
    // (se inyectan aquí para no requerir un CSS extra solo para home)
    const homeStyles = document.createElement('style');
    homeStyles.textContent = `
        .home-match-result,
        .home-match-next {
            background: #fff;
            border-radius: 12px;
            padding: 14px 16px;
            margin-bottom: 10px;
            border: 1px solid #eef0f8;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .home-match-next {
            border-left: 4px solid #ffcc00;
            background: linear-gradient(135deg, #fffbea 0%, #fff 60%);
        }

        .home-match-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .home-match-label {
            font-size: 0.75em;
            font-weight: 600;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }

        .home-match-badge {
            font-size: 0.72em;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 10px;
        }

        .home-badge-v { background: #d4f5e2; color: #1a8f3c; }
        .home-badge-e { background: #fff3cc; color: #a07800; }
        .home-badge-d { background: #ffe0dd; color: #cc2200; }

        .home-localidad-badge {
            font-size: 0.72em;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 10px;
            background: #e8eeff;
            color: #0033cc;
        }

        .home-match-teams {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        .home-team {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
            font-size: 0.88em;
            font-weight: 600;
            color: #333;
            min-width: 0;
        }

        .home-team.right {
            flex-direction: row-reverse;
            text-align: right;
        }

        .home-team.oviedo span { color: #001a6e; font-weight: 700; }

        .home-team span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .home-escudo-sm {
            width: 26px;
            height: 26px;
            object-fit: contain;
            flex-shrink: 0;
        }

        .home-score {
            font-family: 'Oswald', sans-serif;
            font-size: 1.3em;
            font-weight: 700;
            color: #001a6e;
            white-space: nowrap;
            text-align: center;
            min-width: 52px;
        }

        .home-score-vs {
            color: #ccd6ff;
            font-size: 1em;
        }
    `;
    document.head.appendChild(homeStyles);
    

})();