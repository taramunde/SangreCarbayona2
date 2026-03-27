(function () {
    const OVIEDO = 'Real Oviedo';
    const POR_JORNADA = 10;

    // --- ESTILOS INYECTADOS (Los que tenías originalmente para el Widget) ---
    const homeStyles = document.createElement('style');
    homeStyles.textContent = `
        /* Aquí van tus ~500 líneas de CSS que tenías originalmente en el JS */
        .home-match-widget { background: #fff; border-radius: 8px; padding: 15px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .home-match-label { font-size: 11px; text-transform: uppercase; color: #666; font-weight: 700; margin-bottom: 10px; display: block; }
        .home-match-teams { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        /* ... el resto de tus estilos del archivo original ... */
    `;
    document.head.appendChild(homeStyles);

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
                jornada: Math.floor(idx / POR_JORNADA) + 1,
                jugado: p.goles1 !== null && p.goles2 !== null
            }))
            .filter(p => p.equipo1 === OVIEDO || p.equipo2 === OVIEDO);
    }

    // --- NUEVA LÓGICA DE FILTRADO Y STATS ---
    function filtrarPartidos(filtro) {
        const cards = document.querySelectorAll('.cal-match-card');
        let stats = { jugados: 0, victorias: 0, empates: 0, derrotas: 0, pendientes: 0 };

        cards.forEach(card => {
            const esCasa = card.getAttribute('data-casa') === 'true';
            const jugado = card.getAttribute('data-jugado') === 'true';
            const res = card.getAttribute('data-resultado');

            let mostrar = (filtro === 'todos') || (filtro === 'casa' && esCasa) || (filtro === 'fuera' && !esCasa);

            if (mostrar) {
                card.style.display = 'flex';
                if (!jugado) stats.pendientes++;
                else {
                    stats.jugados++;
                    if (res === 'V') stats.victorias++;
                    else if (res === 'E') stats.empates++;
                    else if (res === 'D') stats.derrotas++;
                }
            } else {
                card.style.display = 'none';
            }
        });

        // Actualizar números en el Hero
        const ids = ['Jugados', 'Victorias', 'Empates', 'Derrotas', 'Pendientes'];
        ids.forEach(id => {
            const el = document.getElementById('calStat' + id);
            if (el) el.textContent = stats[id.toLowerCase()];
        });
    }

    // --- RENDER CALENDARIO (Página completa) ---
    function renderizarCalendario() {
        const container = document.getElementById('calendarioList');
        if (!container || !window.location.pathname.includes('calendario.html')) return;

        const partidos = getPartidosOviedo();
        container.innerHTML = '';

        partidos.forEach(p => {
            const esCasa = p.equipo1 === OVIEDO;
            let resLetra = ''; 
            if (p.jugado) {
                if (p.goles1 === p.goles2) resLetra = 'E';
                else if ((esCasa && p.goles1 > p.goles2) || (!esCasa && p.goles2 > p.goles1)) resLetra = 'V';
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
                    <div class="cal-team">
                        <img src="${getEscudo(p.equipo1)}" class="cal-team-escudo">
                        <span>${p.equipo1}</span>
                    </div>
                    <div class="cal-score-box">
                        ${p.jugado ? `<strong>${p.goles1} - ${p.goles2}</strong>` : 'VS'}
                    </div>
                    <div class="cal-team">
                        <img src="${getEscudo(p.equipo2)}" class="cal-team-escudo">
                        <span>${p.equipo2}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        document.querySelectorAll('.cal-filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelector('.cal-filter-btn.active').classList.remove('active');
                this.classList.add('active');
                filtrarPartidos(this.getAttribute('data-filter'));
            });
        });
        filtrarPartidos('todos');
    }

    // --- RENDER WIDGET (Esta es la parte que NO debí borrar) ---
    function renderWidgetHome() {
        const container = document.getElementById('calendarioList');
        if (!container || window.location.pathname.includes('calendario.html')) return;

        const partidos = getPartidosOviedo();
        const proximo = partidos.find(p => !p.jugado);
        const ultimo = [...partidos].reverse().find(p => p.jugado);

        container.innerHTML = '<h3 class="home-match-label">Próximo Partido</h3>';
        
        // Aquí es donde iba toda tu lógica de generación de HTML para el widget lateral...
        // La he simplificado aquí para el ejemplo, pero en tu archivo original 
        // puedes mantener el bloque de código que ya tenías funcionando.
        if (proximo) {
            const div = document.createElement('div');
            div.className = 'home-match-widget';
            div.innerHTML = `<div>${proximo.equipo1} vs ${proximo.equipo2}</div>`;
            container.appendChild(div);
        }
    }

    // --- INIT ---
    if (window.location.pathname.includes('calendario.html')) {
        renderizarCalendario();
    } else {
        renderWidgetHome();
    }

})();