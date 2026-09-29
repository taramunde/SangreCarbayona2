/* ===================================
   ESTADIOS.JS
   Renderiza las tarjetas de "Cómo llegar" y filtra
   por nombre de equipo o ciudad con el buscador.
   Cargar después de data-estadios.js.
   =================================== */

/* global CLUB_DATA */

(function () {
  'use strict';

  function normalizar(str) {
    if (!str) return '';
    return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function mapsUrl(estadio, ciudad) {
    const destino = `${estadio}, ${ciudad}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`;
  }

  function crearTarjeta(club) {
    const card = document.createElement('div');
    card.className = 'estadio-card';
    card.dataset.busqueda = normalizar(`${club.equipo} ${club.ciudad}`);

    const detalles = [];
    if (club.direccion) {
      detalles.push(
        `<p class="estadio-direccion"><i class="fas fa-location-dot"></i> ${club.direccion}</p>`,
      );
    } else {
      detalles.push(
        `<p class="estadio-direccion"><i class="fas fa-location-dot"></i> ${club.ciudad}</p>`,
      );
    }
    if (club.telefono) {
      detalles.push(
        `<p class="estadio-telefono"><i class="fas fa-phone"></i> ${club.telefono}</p>`,
      );
    }

    card.innerHTML = `
      <div class="estadio-escudo">
        <img src="${club.escudo}" alt="Escudo ${club.equipo}" loading="lazy" />
      </div>
      <div class="estadio-info">
        <b>${club.estadio}</b>
        <span class="estadio-equipo">${club.equipo}</span>
        ${detalles.join('')}
        <a
          class="btn-como-llegar"
          href="${mapsUrl(club.estadio, club.ciudad)}"
          target="_blank"
          rel="noopener"
        >
          <i class="fas fa-diamond-turn-right"></i> Cómo llegar
        </a>
      </div>
    `;
    return card;
  }

  function renderEstadios() {
    const grid = document.getElementById('estadiosGrid');
    if (!grid || !CLUB_DATA.estadios) return;

    grid.innerHTML = '';
    CLUB_DATA.estadios.forEach((club) => {
      grid.appendChild(crearTarjeta(club));
    });
  }

  function filtrarEstadios() {
    const input = document.getElementById('estadiosBuscador');
    const grid = document.getElementById('estadiosGrid');
    const vacio = document.getElementById('estadiosSinResultados');
    if (!input || !grid) return;

    const filtro = normalizar(input.value.trim());
    let visibles = 0;

    grid.querySelectorAll('.estadio-card').forEach((card) => {
      const coincide = !filtro || card.dataset.busqueda.includes(filtro);
      card.style.display = coincide ? '' : 'none';
      if (coincide) visibles++;
    });

    if (vacio) {
      vacio.style.display = visibles === 0 ? 'block' : 'none';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderEstadios();
    const input = document.getElementById('estadiosBuscador');
    if (input) {
      input.addEventListener('input', filtrarEstadios);
    }
  });
})();
