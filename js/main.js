function cargarComunes() {
  // Detectamos si estamos dentro de la carpeta /fichas/ viendo la URL
  const esFicha = window.location.pathname.includes("/fichas/");
  const rutaBase = esFicha ? "../" : "";

  // Cargar el Header
  fetch(rutaBase + "header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;
      // Después de cargar el header, ajustamos los enlaces si es una ficha
      if (esFicha) {
        const navLinks = document.querySelectorAll("#header-placeholder a");
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (href && href !== "#" && !href.startsWith("http")) {
            // Si el enlace ya tiene ../ no hacemos nada, si no, lo añadimos
            if (!href.startsWith("../")) {
              link.setAttribute("href", "../" + href);
            }
          }
        });
      }
    });

  // Cargar el Footer
  fetch(rutaBase + "footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });
}

document.addEventListener("DOMContentLoaded", cargarComunes);
