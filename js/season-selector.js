/* ===================================
   SEASON SELECTOR - Sangre Carbayona
   -----------------------------------
   Selector compacto de temporada pensado para funcionar bien
   aunque haya muchas temporadas disponibles (cerca de 100):
   - Muestra siempre un botón fijo con la temporada actual.
   - Un botón "Más temporadas" abre un desplegable con el resto.
   - En móvil el desplegable se convierte en un panel centrado
     con fondo oscurecido, igual que el resto de overlays del sitio.

   Uso (desde app.js):
     SeasonSelector.init(
       'seasonSelector',              // id del contenedor
       CLUB_DATA.temporadasDisponibles,
       CLUB_DATA.temporadaActual,
       this.temporadaActiva,
       (seasonId) => this.changeSeason(seasonId),
     );

   Cuando cambia la temporada activa desde fuera (changeSeason),
   basta con llamar a SeasonSelector.setActive(seasonId) para que
   el propio widget se re-pinte y actualice el estado "activo".
   =================================== */

const SeasonSelector = {
  _container: null,
  _seasons: [],
  _currentId: null,
  _activeId: null,
  _onSelect: null,
  _isOpen: false,
  _globalListenersBound: false,

  init: function (containerId, seasons, currentId, activeId, onSelect) {
    this._container = document.getElementById(containerId);
    if (!this._container) return;

    this._seasons = seasons || [];
    this._currentId = currentId;
    this._activeId = activeId;
    this._onSelect = onSelect;

    if (!this._globalListenersBound) {
      document.addEventListener('click', (e) =>
        this._handleOutsideClick(e),
      );
      document.addEventListener('keydown', (e) => this._handleEscape(e));
      this._globalListenersBound = true;
    }

    this._render();
  },

  // Se llama desde fuera (app.js) cuando cambia la temporada activa
  setActive: function (seasonId) {
    this._activeId = seasonId;
    this._isOpen = false;
    this._render();
  },

  _findSeason: function (id) {
    return this._seasons.find((s) => s.id === id);
  },

  _render: function () {
    if (!this._container) return;

    const current = this._findSeason(this._currentId);
    const active = this._findSeason(this._activeId);
    const isViewingCurrent = this._activeId === this._currentId;

    const otherSeasons = this._seasons
      .filter((s) => s.id !== this._currentId)
      .slice()
      .sort((a, b) => (a.id < b.id ? 1 : -1));

    const currentLabel = current ? current.nombre : this._currentId;
    const badgeText = (typeof t === 'function' && t('current_badge')) || 'Actual';
    const moreText =
      (typeof t === 'function' && t('mas_temporadas')) || 'Más temporadas';
    const pickerTitle =
      (typeof t === 'function' && t('elegir_temporada')) ||
      'Elige una temporada';
    const closeLabel = (typeof t === 'function' && t('cerrar')) || 'Cerrar';
    const backToCurrentLabel =
      (typeof t === 'function' && t('volver_temporada_actual')) ||
      'Volver a la temporada actual';

    let html = '<div class="season-selector">';

    // Botón de la temporada actual: siempre presente
    html += `
      <button type="button" class="season-current-btn ${isViewingCurrent ? 'active' : ''}" data-season="${this._currentId}">
        <span>${currentLabel}</span>
        <span class="season-actual-badge">${badgeText}</span>
      </button>`;

    // Si se está viendo otra temporada distinta a la actual, mostrar un
    // chip con esa temporada para dar contexto y permitir volver rápido
    if (!isViewingCurrent && active) {
      html += `
        <button type="button" class="season-picked-chip" data-season="${active.id}" title="${backToCurrentLabel}">
          <span>${active.nombre}</span>
          <i class="fas fa-times"></i>
        </button>`;
    }

    // Botón "Más temporadas" + desplegable
    html += `
      <div class="season-more-wrap">
        <button type="button" class="season-more-btn" id="seasonMoreToggle" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-layer-group"></i>
          <span>${moreText}</span>
          <i class="fas fa-chevron-down season-more-caret"></i>
        </button>
        <div class="season-dropdown" id="seasonDropdown" hidden>
          <div class="season-dropdown-header">
            <span>${pickerTitle}</span>
            <button type="button" class="season-dropdown-close" id="seasonDropdownClose" aria-label="${closeLabel}">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="season-dropdown-list">
            ${otherSeasons
              .map(
                (s) =>
                  `<button type="button" class="season-dropdown-item ${s.id === this._activeId ? 'active' : ''}" data-season="${s.id}">${s.nombre}</button>`,
              )
              .join('')}
          </div>
        </div>
      </div>`;

    html += '</div>';
    html +=
      '<div class="season-dropdown-backdrop" id="seasonDropdownBackdrop" hidden></div>';

    this._container.innerHTML = html;
    this._bindLocalEvents();
  },

  _bindLocalEvents: function () {
    const currentBtn = this._container.querySelector('.season-current-btn');
    if (currentBtn) {
      currentBtn.addEventListener('click', () =>
        this._select(this._currentId),
      );
    }

    const pickedChip = this._container.querySelector('.season-picked-chip');
    if (pickedChip) {
      pickedChip.addEventListener('click', () =>
        this._select(this._currentId),
      );
    }

    const toggleBtn = this._container.querySelector('#seasonMoreToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._toggle();
      });
    }

    const closeBtn = this._container.querySelector('#seasonDropdownClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._close();
      });
    }

    const backdrop = this._container.querySelector(
      '#seasonDropdownBackdrop',
    );
    if (backdrop) {
      backdrop.addEventListener('click', () => this._close());
    }

    this._container
      .querySelectorAll('.season-dropdown-item')
      .forEach((item) => {
        item.addEventListener('click', () => this._select(item.dataset.season));
      });
  },

  _handleOutsideClick: function (e) {
    if (!this._isOpen || !this._container) return;
    if (!this._container.contains(e.target)) {
      this._close();
    }
  },

  _handleEscape: function (e) {
    if (e.key === 'Escape' && this._isOpen) {
      this._close();
    }
  },

  _toggle: function () {
    if (this._isOpen) {
      this._close();
    } else {
      this._open();
    }
  },

  _open: function () {
    const dropdown = this._container.querySelector('#seasonDropdown');
    const backdrop = this._container.querySelector(
      '#seasonDropdownBackdrop',
    );
    const toggleBtn = this._container.querySelector('#seasonMoreToggle');
    if (!dropdown) return;

    dropdown.hidden = false;
    if (backdrop) backdrop.hidden = false;
    if (toggleBtn) {
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
    this._isOpen = true;

    const activeItem = dropdown.querySelector('.season-dropdown-item.active');
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'center' });
    }
  },

  _close: function () {
    if (!this._container) return;
    const dropdown = this._container.querySelector('#seasonDropdown');
    const backdrop = this._container.querySelector(
      '#seasonDropdownBackdrop',
    );
    const toggleBtn = this._container.querySelector('#seasonMoreToggle');

    if (dropdown) dropdown.hidden = true;
    if (backdrop) backdrop.hidden = true;
    if (toggleBtn) {
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
    this._isOpen = false;
  },

  _select: function (seasonId) {
    this._close();
    if (this._onSelect) this._onSelect(seasonId);
  },
};