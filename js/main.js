function cargarComunes() {
  // Antes solo se comprobaba "/fichas/". Lo generalizamos: cualquier página
  // que viva dentro de una subcarpeta (fichas/, Juegos/, la que sea) necesita
  // anteponer "../" para encontrar header.html, footer.html y los enlaces
  // de navegación relativos a la raíz del sitio.
  const segmentos = window.location.pathname.split("/").filter(Boolean);
  const esSubcarpeta = segmentos.length > 1; // más de un tramo -> hay carpeta de por medio
  const rutaBase = esSubcarpeta ? "../" : "";

  // Se mantiene por compatibilidad, ya que algún sitio del código podría
  // seguir comprobando específicamente si estamos en /fichas/.
  const esFicha = window.location.pathname.includes("/fichas/");

  // Cargar el Header
  fetch(rutaBase + "header.html")
    .then((response) => response.text())
    .then((data) => {
      const headerPlaceholder = document.getElementById("header-placeholder");
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = data;

        // --- ACTIVAMOS TODO LO DEL HEADER AQUÍ ---
        inicializarFuncionesHeader();

        if (esSubcarpeta) {
          ajustarRutasEnlaces("#header-placeholder a");
        }

        // Aplicar el idioma guardado al header recién inyectado
        // (el fetch es asíncrono y llega después de que setLanguage ya se ejecutó)
        if (typeof setLanguage === "function") {
          setLanguage(localStorage.getItem("lang") || "es");
        }
      }
    });

  // Cargar el Footer
  fetch(rutaBase + "footer.html")
    .then((response) => response.text())
    .then((data) => {
      const footerPlaceholder = document.getElementById("footer-placeholder");
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = data;

        // Igual que con el header: si estamos en una subcarpeta, los enlaces
        // del footer ("primer-equipo.html", "calendario.html"...) también
        // necesitan el "../" delante o apuntarían dentro de la subcarpeta.
        if (esSubcarpeta) {
          ajustarRutasEnlaces("#footer-placeholder a");
        }

        // Traducir el footer recién inyectado
        if (typeof setLanguage === "function") {
          setLanguage(localStorage.getItem("lang") || "es");
        }
      }
    });
}

function inicializarFuncionesHeader() {
  // 1. ELEMENTOS DEL MENÚ MÓVIL
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mainNav = document.getElementById("mainNav");
  const closeMobileNav = document.getElementById("closeMobileNav");

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      mobileMenuBtn.classList.add("active");
      mainNav.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  if (closeMobileNav && mainNav && mobileMenuBtn) {
    closeMobileNav.addEventListener("click", (e) => {
      e.preventDefault();
      mainNav.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // 2. ELEMENTOS DEL BUSCADOR (LUPA)
  const searchBtn = document.getElementById("searchBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const closeSearch = document.getElementById("closeSearch");

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      searchOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        const input = searchOverlay.querySelector("input");
        if (input) input.focus();
      }, 300);
    });
  }

  if (closeSearch && searchOverlay) {
    closeSearch.addEventListener("click", (e) => {
      e.preventDefault();
      searchOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  // Cerrar buscador con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      searchOverlay &&
      searchOverlay.classList.contains("active")
    ) {
      searchOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // 3. SUBMENÚS Y CIERRE AUTOMÁTICO
  const navItemsWithSubmenu = document.querySelectorAll(
    ".nav-item.has-submenu",
  );
  navItemsWithSubmenu.forEach((item) => {
    const link = item.querySelector("a");
    if (link) {
      link.addEventListener("click", function (e) {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          item.classList.toggle("open");
        }
      });
    }
  });

  const simpleNavLinks = document.querySelectorAll(
    ".nav-item:not(.has-submenu) a, .submenu a",
  );
  simpleNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1024 && mainNav && mobileMenuBtn) {
        mainNav.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });
}

// Antes se llamaba ajustarRutasEnlacesFichas() y solo tocaba el header.
// Ahora recibe el selector (header o footer) para poder arreglar ambos
// desde cualquier subcarpeta, no solo /fichas/.
function ajustarRutasEnlaces(selector) {
  const enlaces = document.querySelectorAll(selector);
  enlaces.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href !== "#" && !href.startsWith("http")) {
      if (!href.startsWith("../")) {
        link.setAttribute("href", "../" + href);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", cargarComunes);