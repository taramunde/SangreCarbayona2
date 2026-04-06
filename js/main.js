// Función para cargar el Header y el Footer automáticamente
function cargarComunes() {
  // Detectamos si estamos dentro de la carpeta /fichas/ viendo la URL
  const esFicha = window.location.pathname.includes("/fichas/");
  const rutaBase = esFicha ? "../" : "";

  // Cargar el Header
  fetch(rutaBase + "header.html")
    .then((response) => response.text())
    .then((data) => {
      const headerPlaceholder = document.getElementById("header-placeholder");
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = data;

        // Activar eventos del menú UNA VEZ que el HTML ya existe
        activarMenuMovil();

        // Ajustar rutas relativas si estamos en la carpeta fichas
        if (esFicha) {
          ajustarRutasEnlacesFichas();
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
      }
    });
}

function activarMenuMovil() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mainNav = document.getElementById("mainNav");
  const closeMobileNav = document.getElementById("closeMobileNav");

  // Abrir menú
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener("click", function (e) {
      e.preventDefault(); // Prevenir comportamientos por defecto
      this.classList.add("active");
      mainNav.classList.add("active");
      document.body.style.overflow = "hidden"; // Evitar scroll de fondo
    });
  }

  // Cerrar menú con el botón X
  if (closeMobileNav && mainNav && mobileMenuBtn) {
    closeMobileNav.addEventListener("click", function (e) {
      e.preventDefault();
      mainNav.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      document.body.style.overflow = ""; // Restaurar scroll
    });
  }

  // Comportamiento de submenús en versión móvil
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

  // Cerrar menú al hacer clic en un enlace normal (no submenú)
  const simpleNavLinks = document.querySelectorAll(
    ".nav-item:not(.has-submenu) a, .submenu a",
  );
  simpleNavLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 1024 && mainNav && mobileMenuBtn) {
        mainNav.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });
}

function ajustarRutasEnlacesFichas() {
  const navLinks = document.querySelectorAll("#header-placeholder a");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href !== "#" && !href.startsWith("http")) {
      if (!href.startsWith("../")) {
        link.setAttribute("href", "../" + href);
      }
    }
  });
}

// Ejecutar la función cuando el DOM principal esté listo
document.addEventListener("DOMContentLoaded", cargarComunes);
