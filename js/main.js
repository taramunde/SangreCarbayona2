function cargarComunes() {
  // Detecta si estamos en una subcarpeta (fichas, juegos o partidos) para ajustar las rutas
  const esSubcarpeta =
    window.location.pathname.includes('/fichas/') ||
    window.location.pathname.includes('/juegos/') ||
    window.location.pathname.includes('/partidos/');
  const rutaBase = esSubcarpeta ? '../' : '';

  // Cargar el Header
  fetch(rutaBase + 'header.html')
    .then((response) => response.text())
    .then((data) => {
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = data;

        // --- ACTIVAMOS TODO LO DEL HEADER AQUÍ ---
        inicializarFuncionesHeader();

        if (esSubcarpeta) {
          ajustarRutasEnlacesFichas();
        }

        // Aplicar el idioma guardado al header recién inyectado
        // (el fetch es asíncrono y llega después de que setLanguage ya se ejecutó)
        if (typeof setLanguage === 'function') {
          setLanguage(localStorage.getItem('lang') || 'es');
        }
      }
    });

  // Cargar el Footer
  fetch(rutaBase + 'footer.html')
    .then((response) => response.text())
    .then((data) => {
      const footerPlaceholder = document.getElementById('footer-placeholder');
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = data;

        // Igual que en el header: desde /fichas/, /juegos/ o /partidos/
        // los enlaces relativos del footer necesitan "../" delante.
        if (esSubcarpeta) {
          ajustarRutasEnlacesFichas('#footer-placeholder');
        }

        // Traducir el footer recién inyectado
        if (typeof setLanguage === 'function') {
          setLanguage(localStorage.getItem('lang') || 'es');
        }

        actualizarAnosFooter();
      }
    });

  cargarAsistente(rutaBase);
}

// Chat "Pregúntale al Carbayón" (js/asistente.js) en todas las páginas
// sin tener que añadirlo a mano en cada HTML. Reutiliza el nocache con
// el que se ha cargado main.js para no servir una versión vieja.
function cargarAsistente(rutaBase) {
  if (document.getElementById('scAsistenteJs')) return;
  const main = document.querySelector('script[src*="js/main.js"]');
  const nocache =
    main && main.getAttribute('src').includes('?')
      ? '?' + main.getAttribute('src').split('?')[1]
      : '';

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = `${rutaBase}css/asistente.css${nocache}`;
  document.head.appendChild(css);

  const js = document.createElement('script');
  js.id = 'scAsistenteJs';
  js.src = `${rutaBase}js/asistente.js${nocache}`;
  document.body.appendChild(js);
}

// Muestra "2017-2026" (o solo "2017" si algún año coincidiera) usando
// CLUB_DATA.webDesde y el año actual del navegador de quien visita la
// web, para no tener que actualizar el footer a mano cada enero.
function actualizarAnosFooter() {
  const el = document.getElementById('footerYears');
  if (!el) return;

  const inicio = (window.CLUB_DATA && CLUB_DATA.webDesde) || 2017;
  const actual = new Date().getFullYear();

  el.textContent = actual > inicio ? `${inicio}-${actual}` : `${inicio}`;
}

function inicializarFuncionesHeader() {
  // 1. ELEMENTOS DEL MENÚ MÓVIL
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  const closeMobileNav = document.getElementById('closeMobileNav');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      mobileMenuBtn.classList.add('active');
      mainNav.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeMobileNav && mainNav && mobileMenuBtn) {
    closeMobileNav.addEventListener('click', (e) => {
      e.preventDefault();
      mainNav.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // 2. ELEMENTOS DEL BUSCADOR (LUPA)
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const closeSearch = document.getElementById('closeSearch');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const input = searchOverlay.querySelector('input');
        if (input) input.focus();
      }, 300);
    });
  }

  if (closeSearch && searchOverlay) {
    closeSearch.addEventListener('click', (e) => {
      e.preventDefault();
      searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Cerrar buscador con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      searchOverlay &&
      searchOverlay.classList.contains('active')
    ) {
      searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // 3. SUBMENÚS Y CIERRE AUTOMÁTICO
  const navItemsWithSubmenu = document.querySelectorAll(
    '.nav-item.has-submenu',
  );
  navItemsWithSubmenu.forEach((item) => {
    const link = item.querySelector('a');
    if (link) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });

  const simpleNavLinks = document.querySelectorAll(
    '.nav-item:not(.has-submenu) a, .submenu a',
  );
  simpleNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024 && mainNav && mobileMenuBtn) {
        mainNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

function ajustarRutasEnlacesFichas(contenedor = '#header-placeholder') {
  const navLinks = document.querySelectorAll(`${contenedor} a`);
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('#') &&
      !/^(https?:|mailto:|tel:)/.test(href)
    ) {
      if (!href.startsWith('../')) {
        link.setAttribute('href', '../' + href);
      }
    }
  });

  // El header.html se inyecta con innerHTML, así que sus rutas relativas
  // (como el escudo) se resuelven contra la URL de la página actual, no
  // contra header.html. Sin este ajuste, imágenes como img/varios/... se
  // rompen en fichas/ y juegos/ porque el navegador busca fichas/img/...
  const imgs = document.querySelectorAll(`${contenedor} img`);
  imgs.forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http') && !src.startsWith('../')) {
      img.setAttribute('src', '../' + src);
    }
  });
}

document.addEventListener('DOMContentLoaded', cargarComunes);
