/* ===================================
   BUSQUEDA.JS
   Búsqueda de jugadores y entrenadores
   en el overlay de búsqueda del header.
   Cargar en TODAS las páginas, después
   de data-jugadores.js y data-utils.js.
   =================================== */

/* global CLUB_DATA */

(function () {
  'use strict';

  // ── HELPERS ────────────────────────────────────────────────

  /** Normaliza texto: minúsculas + sin tildes ni diéresis */
  function normalizar(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /** Devuelve la URL base del sitio, funcione desde cualquier página */
  function getBaseUrl() {
    const href = window.location.href.split('?')[0].split('#')[0];
    if (href.includes('/fichas/')) {
      return href.split('/fichas/')[0];
    }
    return href.replace(/\/[^/]*\.html$/, '').replace(/\/$/, '');
  }

  /** URL de la ficha de un jugador según temporada */
  function urlJugador(codigo, seasonId) {
    const base = getBaseUrl();
    const temporadaActual =
      (window.CLUB_DATA && CLUB_DATA.temporadaActual) || '2025-26';
    if (!seasonId || seasonId === temporadaActual) {
      return `${base}/fichas/${codigo}.html`;
    }
    return `${base}/fichas/${codigo}-${seasonId}.html`;
  }

  /** URL de la ficha de un entrenador según temporada */
  function urlEntrenador(codigo, seasonId) {
    const base = getBaseUrl();
    const temporada =
      seasonId || (window.CLUB_DATA && CLUB_DATA.temporadaActual) || '2025-26';
    return `${base}/ficha-jugador.html?tipo=entrenador&id=${codigo}&season=${temporada}`;
  }

  // ── MAPA DE TEMPORADAS ─────────────────────────────────────

  /**
   * Escanea CLUB_DATA.temporadas y devuelve un mapa:
   *   { codigo: [ { id, nombre, actual }, ... ] }
   * ordenado de más reciente a más antigua.
   */
  function construirMapaTemporadas() {
    const mapa = {}; // codigo → [{ id, nombre, actual }]

    if (!window.CLUB_DATA || !CLUB_DATA.temporadas) return mapa;

    // Construir lookup de nombre de temporada a partir de temporadasDisponibles
    const dispLookup = {};
    (CLUB_DATA.temporadasDisponibles || []).forEach((t) => {
      dispLookup[t.id] = { nombre: t.nombre, actual: !!t.actual };
    });

    // Ordenar las temporadas de más reciente a más antigua
    const seasonIds = Object.keys(CLUB_DATA.temporadas).sort().reverse();

    seasonIds.forEach((seasonId) => {
      const temporada = CLUB_DATA.temporadas[seasonId];
      if (!temporada) return;

      const meta = dispLookup[seasonId] || {
        nombre: seasonId.replace('-', '/'),
        actual: seasonId === CLUB_DATA.temporadaActual,
      };

      // Jugadores
      (temporada.jugadores || []).forEach((j) => {
        const cod = j.codigo || j.id;
        if (!cod) return;
        if (!mapa[cod]) mapa[cod] = [];
        // Evitar duplicados (p.ej. si aparece dos veces en la misma temporada)
        if (!mapa[cod].find((x) => x.id === seasonId)) {
          mapa[cod].push({
            id: seasonId,
            nombre: meta.nombre,
            actual: meta.actual,
          });
        }
      });

      // Cuerpo técnico
      (temporada.cuerpoTecnico || []).forEach((c) => {
        const cod = c.codigo || c.id;
        if (!cod) return;
        if (!mapa[cod]) mapa[cod] = [];
        if (!mapa[cod].find((x) => x.id === seasonId)) {
          mapa[cod].push({
            id: seasonId,
            nombre: meta.nombre,
            actual: meta.actual,
          });
        }
      });
    });

    return mapa;
  }

  // ── CONSTRUIR ÍNDICE ───────────────────────────────────────

  function construirIndice() {
    const indice = [];
    if (!window.CLUB_DATA) return indice;

    const mapaTemporadas = construirMapaTemporadas();

    // ── Jugadores ──
    const maestro = CLUB_DATA.jugadoresMaestro || {};
    Object.entries(maestro).forEach(([codigo, datos]) => {
      const temporadas = mapaTemporadas[codigo] || [];
      // URL por defecto: temporada más reciente en la que aparece (o actual)
      const seasonPorDefecto = temporadas.length > 0 ? temporadas[0].id : null;

      indice.push({
        tipo: 'jugador',
        codigo,
        apodo: datos.apodo || '',
        nombre: datos.nombre || '',
        apellidos: datos.apellidos || '',
        nombreCompleto: datos.nombreCompleto || '',
        posicion: datos.posicion || '',
        posicionCorta: datos.posicionCorta || '',
        imagen: datos.imagen || '',
        temporadas,
        url: urlJugador(codigo, seasonPorDefecto),
        _tokens: normalizar(
          [datos.apodo, datos.nombre, datos.apellidos, datos.nombreCompleto]
            .filter(Boolean)
            .join(' '),
        ),
      });
    });

    // ── Entrenadores ──
    const entMaestro = CLUB_DATA.entrenadorMaestro || {};
    Object.entries(entMaestro).forEach(([codigo, datos]) => {
      const temporadas = mapaTemporadas[codigo] || [];
      const seasonPorDefecto = temporadas.length > 0 ? temporadas[0].id : null;

      indice.push({
        tipo: 'entrenador',
        codigo,
        apodo: datos.apodo || '',
        nombre: datos.nombre || '',
        apellidos: datos.apellidos || '',
        nombreCompleto: datos.nombreCompleto || '',
        posicion: datos.cargo || '',
        posicionCorta: datos.cargoCorto || 'ENT',
        imagen: datos.imagen || '',
        temporadas,
        url: urlEntrenador(codigo, seasonPorDefecto),
        _tokens: normalizar(
          [datos.apodo, datos.nombre, datos.apellidos, datos.nombreCompleto]
            .filter(Boolean)
            .join(' '),
        ),
      });
    });

    return indice;
  }

  // ── LÓGICA DE BÚSQUEDA ─────────────────────────────────────

  function buscar(query, indice) {
    if (!query || query.trim().length < 2) return [];

    const q = normalizar(query.trim());
    const palabras = q.split(/\s+/);

    const puntuados = indice
      .map((item) => {
        const apodoNorm = normalizar(item.apodo);
        const tokens = item._tokens;
        let score = 0;

        if (apodoNorm === q) score += 100;
        else if (apodoNorm.startsWith(q)) score += 60;
        else if (apodoNorm.includes(q)) score += 40;

        const todasPalabras = palabras.every((p) => tokens.includes(p));
        if (todasPalabras) score += 20;
        else {
          const algunaPalabra = palabras.some((p) => tokens.includes(p));
          if (algunaPalabra) score += 5;
        }

        const algunaEmpieza = palabras.some(
          (p) => tokens.startsWith(p) || tokens.includes(' ' + p),
        );
        if (algunaEmpieza) score += 10;

        return { item, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);

    return puntuados.map((x) => x.item);
  }

  // ── ESTILOS ────────────────────────────────────────────────

  function inyectarEstilos() {
    if (document.getElementById('busqueda-styles')) return;
    const style = document.createElement('style');
    style.id = 'busqueda-styles';
    style.textContent = `
      /* ── Contenedor del dropdown ── */
      #busquedaResultados {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.25);
        overflow: hidden;
        z-index: 9999;
        max-height: 480px;
        overflow-y: auto;
        display: none;
      }

      #busquedaResultados.visible {
        display: block;
        animation: busqFadeIn 0.18s ease;
      }

      @keyframes busqFadeIn {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* ── Cabecera del dropdown ── */
      .busq-header {
        padding: 10px 16px 6px;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #8a9bb0;
        border-bottom: 1px solid #f0f2f5;
      }

      /* ── Item de resultado ── */
      .busq-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 10px 16px;
        cursor: pointer;
        text-decoration: none;
        color: inherit;
        transition: background 0.15s;
        border-bottom: 1px solid #f5f7fa;
      }

      .busq-item:last-child {
        border-bottom: none;
      }

      .busq-item:hover,
      .busq-item.focused {
        background: #f0f5ff;
      }

      /* ── Foto ── */
      .busq-foto {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        object-fit: cover;
        object-position: top center;
        flex-shrink: 0;
        background: #e8edf4;
        border: 2px solid #e0e8f0;
        margin-top: 2px;
      }

      .busq-foto-fallback {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        flex-shrink: 0;
        background: #1a365d;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #c9a227;
        font-size: 1.1rem;
        margin-top: 2px;
      }

      /* ── Textos ── */
      .busq-textos {
        flex: 1;
        min-width: 0;
      }

      .busq-apodo {
        font-weight: 700;
        font-size: 0.95rem;
        color: #1a365d;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .busq-nombre-completo {
        font-size: 0.78rem;
        color: #6b7a8d;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 6px;
      }

      /* ── Pills de temporada ── */
      .busq-temporadas {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 5px;
      }

      .busq-temporada-pill {
        display: inline-block;
        padding: 3px 9px;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: 700;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.15s ease;
        background: #eef2f8;
        color: #4a6080;
        border: 1px solid #d0daea;
        line-height: 1.4;
        white-space: nowrap;
      }

      .busq-temporada-pill:hover {
        background: #1a365d;
        color: #fff;
        border-color: #1a365d;
        transform: translateY(-1px);
      }

      .busq-temporada-pill.pill-actual {
        background: #1a365d;
        color: #c9a227;
        border-color: #1a365d;
      }

      .busq-temporada-pill.pill-actual:hover {
        background: #c9a227;
        color: #1a365d;
        border-color: #c9a227;
      }

      /* ── Badge posición / cargo ── */
      .busq-badge {
        flex-shrink: 0;
        background: #1a365d;
        color: #c9a227;
        font-size: 0.68rem;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 8px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-top: 4px;
      }

      .busq-badge.entrenador {
        background: #2d6a4f;
        color: #95d5b2;
      }

      /* ── Sin resultados ── */
      .busq-vacio {
        padding: 20px 16px;
        text-align: center;
        color: #8a9bb0;
        font-size: 0.9rem;
      }

      .busq-vacio i {
        display: block;
        font-size: 1.6rem;
        margin-bottom: 8px;
        opacity: 0.4;
      }

      /* ── Ajuste del search-container para el dropdown ── */
      .search-container {
        position: relative;
      }

      /* ── Scrollbar del dropdown ── */
      #busquedaResultados::-webkit-scrollbar {
        width: 5px;
      }
      #busquedaResultados::-webkit-scrollbar-thumb {
        background: #c9a227;
        border-radius: 4px;
      }
    `;
    document.head.appendChild(style);
  }

  // ── RENDERIZADO ────────────────────────────────────────────

  function resaltar(texto, query) {
    if (!query || !texto) return texto || '';
    const q = query.trim();
    const re = new RegExp(
      `(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi',
    );
    return texto.replace(
      re,
      '<mark style="background:#fff3cd;padding:0 1px;border-radius:2px">$1</mark>',
    );
  }

  /** Construye el HTML de un item de resultado */
  function renderItem(resultado, query) {
    const wrapper = document.createElement('div');
    wrapper.className = 'busq-item';
    wrapper.setAttribute('data-codigo', resultado.codigo);
    wrapper.setAttribute('tabindex', '-1');

    // Foto
    let fotoHtml;
    if (resultado.imagen) {
      fotoHtml = `<img class="busq-foto" src="${resultado.imagen}" alt="${resultado.apodo}"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                  <div class="busq-foto-fallback" style="display:none"><i class="fas fa-user"></i></div>`;
    } else {
      fotoHtml = `<div class="busq-foto-fallback"><i class="fas fa-user"></i></div>`;
    }

    // Badge
    const badgeClass =
      resultado.tipo === 'entrenador' ? 'busq-badge entrenador' : 'busq-badge';
    const badgeTexto =
      resultado.posicionCorta || (resultado.tipo === 'entrenador' ? 'ENT' : '');

    // Nombre completo (si difiere del apodo)
    const nombreExtra =
      resultado.nombreCompleto && resultado.nombreCompleto !== resultado.apodo
        ? `<div class="busq-nombre-completo">${resaltar(resultado.nombreCompleto, query)}</div>`
        : '';

    // Pills de temporada (solo si hay más de una)
    let temporadasHtml = '';
    if (resultado.temporadas && resultado.temporadas.length > 1) {
      const pills = resultado.temporadas
        .map((t) => {
          const pillClass = t.actual
            ? 'busq-temporada-pill pill-actual'
            : 'busq-temporada-pill';
          const url =
            resultado.tipo === 'jugador'
              ? urlJugador(resultado.codigo, t.id)
              : urlEntrenador(resultado.codigo, t.id);
          return `<a class="${pillClass}"
                     href="${url}"
                     data-url="${url}"
                     title="Ver ficha ${t.nombre}">${t.nombre}</a>`;
        })
        .join('');
      temporadasHtml = `<div class="busq-temporadas">${pills}</div>`;
    }

    wrapper.innerHTML = `
      ${fotoHtml}
      <div class="busq-textos">
        <div class="busq-apodo">${resaltar(resultado.apodo, query)}</div>
        ${nombreExtra}
        ${temporadasHtml}
      </div>
      ${badgeTexto ? `<span class="${badgeClass}">${badgeTexto}</span>` : ''}
    `;

    // Clic en el wrapper → ir a la URL por defecto (temporada más reciente)
    wrapper.addEventListener('click', function (e) {
      // Si el clic viene de un pill, dejar que el pill navegue solo
      if (e.target.closest('.busq-temporada-pill')) return;
      window.location.href = resultado.url;
    });

    // Los pills navegan solos (son <a>), pero hay que detener la propagación
    // para que no active el handler del wrapper también
    wrapper.querySelectorAll('.busq-temporada-pill').forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = pill.getAttribute('data-url');
      });
    });

    return wrapper;
  }

  /** Muestra los resultados en el dropdown */
  function mostrarResultados(resultados, query, contenedor) {
    contenedor.innerHTML = '';

    if (resultados.length === 0) {
      contenedor.innerHTML = `
        <div class="busq-vacio">
          <i class="fas fa-search"></i>
          Sin resultados para "<strong>${query}</strong>"
        </div>`;
      contenedor.classList.add('visible');
      return;
    }

    const jugadores = resultados.filter((r) => r.tipo === 'jugador');
    const entrenadores = resultados.filter((r) => r.tipo === 'entrenador');

    if (jugadores.length > 0) {
      if (entrenadores.length > 0) {
        const h = document.createElement('div');
        h.className = 'busq-header';
        h.textContent = 'Jugadores';
        contenedor.appendChild(h);
      }
      jugadores.slice(0, 8).forEach((r) => {
        contenedor.appendChild(renderItem(r, query));
      });
    }

    if (entrenadores.length > 0) {
      if (jugadores.length > 0) {
        const h = document.createElement('div');
        h.className = 'busq-header';
        h.style.marginTop = '4px';
        h.textContent = 'Cuerpo Técnico';
        contenedor.appendChild(h);
      }
      entrenadores.slice(0, 4).forEach((r) => {
        contenedor.appendChild(renderItem(r, query));
      });
    }

    contenedor.classList.add('visible');
  }

  /** Oculta el dropdown */
  function ocultarResultados(contenedor) {
    contenedor.classList.remove('visible');
    contenedor.innerHTML = '';
  }

  // ── NAVEGACIÓN POR TECLADO ─────────────────────────────────

  function moverFoco(contenedor, direccion) {
    const items = contenedor.querySelectorAll('.busq-item');
    if (!items.length) return;

    const actual = contenedor.querySelector('.busq-item.focused');
    let idx = -1;

    items.forEach((el, i) => {
      if (el === actual) idx = i;
    });

    if (actual) actual.classList.remove('focused');

    let siguiente = idx + direccion;
    if (siguiente < 0) siguiente = items.length - 1;
    if (siguiente >= items.length) siguiente = 0;

    items[siguiente].classList.add('focused');
    items[siguiente].scrollIntoView({ block: 'nearest' });
  }

  // ── INICIALIZACIÓN ─────────────────────────────────────────

  function init() {
    inyectarEstilos();

    const overlay = document.getElementById('searchOverlay');
    if (!overlay) return;

    const inputEl = overlay.querySelector('.search-form input[type="text"]');
    const formEl = overlay.querySelector('.search-form');
    if (!inputEl || !formEl) return;

    // Crear contenedor de resultados
    const resultadosEl = document.createElement('div');
    resultadosEl.id = 'busquedaResultados';
    formEl.appendChild(resultadosEl);

    let indice = [];
    let indiceListo = false;

    function asegurarIndice() {
      if (!indiceListo) {
        indice = construirIndice();
        indiceListo = true;
      }
    }

    // Reconstruir índice si se abre el overlay (por si acaso los datos
    // tardaron en cargarse la primera vez)
    const observer = new MutationObserver(() => {
      if (overlay.classList.contains('active')) {
        indiceListo = false; // forzar reconstrucción
        asegurarIndice();
        ocultarResultados(resultadosEl);
        inputEl.value = '';
      }
    });
    observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });

    // ── Escritura en el input ──
    let debounceTimer;
    inputEl.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      const query = this.value.trim();

      if (query.length < 2) {
        ocultarResultados(resultadosEl);
        return;
      }

      debounceTimer = setTimeout(() => {
        asegurarIndice();
        const resultados = buscar(query, indice);
        mostrarResultados(resultados, query, resultadosEl);
      }, 120);
    });

    // ── Teclado: flechas, Enter, Escape ──
    inputEl.addEventListener('keydown', function (e) {
      const visible = resultadosEl.classList.contains('visible');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (visible) moverFoco(resultadosEl, 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (visible) moverFoco(resultadosEl, -1);
      } else if (e.key === 'Enter') {
        const focused = resultadosEl.querySelector('.busq-item.focused');
        if (focused) {
          e.preventDefault();
          // Obtener URL del resultado enfocado
          const codigo = focused.getAttribute('data-codigo');
          const resultado = indice.find((x) => x.codigo === codigo);
          if (resultado) {
            window.location.href = resultado.url;
          }
          return;
        }

        if (visible) {
          const items = resultadosEl.querySelectorAll('.busq-item');
          if (items.length === 1) {
            e.preventDefault();
            const codigo = items[0].getAttribute('data-codigo');
            const resultado = indice.find((x) => x.codigo === codigo);
            if (resultado) window.location.href = resultado.url;
            return;
          }
          if (items.length > 1) {
            e.preventDefault();
            moverFoco(resultadosEl, 1);
            return;
          }
        }
        // Sin resultados → búsqueda web normal
      } else if (e.key === 'Escape') {
        ocultarResultados(resultadosEl);
        inputEl.blur();
      }
    });

    // ── Cerrar al hacer clic fuera ──
    document.addEventListener('click', function (e) {
      if (!overlay.contains(e.target)) {
        ocultarResultados(resultadosEl);
      }
    });

    // ── Cerrar overlay ──
    const closeBtn = document.getElementById('closeSearch');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        ocultarResultados(resultadosEl);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
