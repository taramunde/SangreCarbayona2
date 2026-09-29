/* ===================================
   OVIESPORTINGUISTAS.JS
   Renderiza las tarjetas de jugadores y entrenadores
   que han vestido las dos camisetas, y filtra por
   nombre con el buscador.
   Cargar después de data-oviesportinguistas.js.
   =================================== */

/* global CLUB_DATA */

(function () {
  'use strict';

  function normalizar(str) {
    if (!str) return '';
    return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function crearFoto(persona) {
    if (persona.imagen) {
      return `<img class="ovies-foto" src="${persona.imagen}" alt="${persona.nombre}" loading="lazy" />`;
    }
    return `<div class="ovies-foto ovies-foto-fallback"><i class="fas fa-user"></i></div>`;
  }

  function crearCadenaClubes(clubes) {
    return clubes
      .map((c, i) => {
        const escudo = `<img class="ovies-escudo" src="${c.escudo}" alt="Escudo" loading="lazy" />`;
        if (i === clubes.length - 1) return escudo;
        return `${escudo}<i class="fas fa-arrow-right-long ovies-flecha"></i>`;
      })
      .join('');
  }

  function crearTarjeta(persona) {
    const card = document.createElement('div');
    card.className = 'ovies-card';
    card.dataset.busqueda = normalizar(persona.nombre);

    card.innerHTML = `
      ${crearFoto(persona)}
      <div class="ovies-info">
        <div class="ovies-clubes">${crearCadenaClubes(persona.clubes)}</div>
        <b class="ovies-nombre">${persona.nombre}</b>
        <p class="ovies-texto">${persona.texto}</p>
      </div>
    `;
    return card;
  }

  function renderGrupo(lista, contenedorId) {
    const grid = document.getElementById(contenedorId);
    if (!grid || !lista) return;
    grid.innerHTML = '';
    lista.forEach((persona) => grid.appendChild(crearTarjeta(persona)));
  }

  function renderOviesportinguistas() {
    const datos = CLUB_DATA.oviesportinguistas;
    if (!datos) return;

    const introEl = document.getElementById('oviesIntro');
    if (introEl) introEl.textContent = datos.intro;

    renderGrupo(datos.jugadores, 'oviesJugadoresGrid');
    renderGrupo(datos.entrenadores, 'oviesEntrenadoresGrid');
  }

  function filtrarOvies() {
    const input = document.getElementById('oviesBuscador');
    if (!input) return;
    const filtro = normalizar(input.value.trim());

    ['oviesJugadoresGrid', 'oviesEntrenadoresGrid'].forEach((id) => {
      const grid = document.getElementById(id);
      if (!grid) return;
      let visibles = 0;
      grid.querySelectorAll('.ovies-card').forEach((card) => {
        const coincide = !filtro || card.dataset.busqueda.includes(filtro);
        card.style.display = coincide ? '' : 'none';
        if (coincide) visibles++;
      });
      const seccion = grid.closest('.ovies-seccion');
      if (seccion)
        seccion.style.display = visibles === 0 && filtro ? 'none' : '';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderOviesportinguistas();
    const input = document.getElementById('oviesBuscador');
    if (input) {
      input.addEventListener('input', filtrarOvies);
    }
  });
})();
