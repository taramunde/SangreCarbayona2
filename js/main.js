// Función para cargar el Header y el Footer automáticamente
function cargarComunes() {
  // Cargar el Header
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;
    });

  // Cargar el Footer
  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });
}

// Ejecutar la función cuando la página esté lista
document.addEventListener("DOMContentLoaded", cargarComunes);
