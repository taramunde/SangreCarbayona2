/* ===================================
   PALMARES.JS
   Renderiza las tarjetas de títulos oficiales
   y campeonatos regionales del Real Oviedo.
   Cargar después de data-palmares.js.
   =================================== */

/* global CLUB_DATA */

(function () {
  'use strict';

  function crearChips(temporadas) {
    return temporadas
      .map((t) => `<span class="palmares-chip">${t}</span>`)
      .join('');
  }

  function crearTarjeta(titulo, conIcono) {
    const card = document.createElement('div');
    card.className = 'palmares-card';
    card.innerHTML = `
      ${
        conIcono
          ? `<div class="palmares-icono"><i class="fas ${titulo.icono}"></i></div>`
          : ''
      }
      <div class="palmares-info">
        <div class="palmares-cabecera">
          <b class="palmares-competicion">${titulo.competicion}</b>
          <span class="palmares-contador">${titulo.temporadas.length}</span>
        </div>
        <div class="palmares-chips">${crearChips(titulo.temporadas)}</div>
      </div>
    `;
    return card;
  }

  function renderPalmares() {
    const datos = CLUB_DATA.palmares;
    if (!datos) return;

    const gridNacionales = document.getElementById('palmaresNacionalesGrid');
    if (gridNacionales) {
      gridNacionales.innerHTML = '';
      datos.nacionales.forEach((t) =>
        gridNacionales.appendChild(crearTarjeta(t, true)),
      );
    }

    const totalEl = document.getElementById('palmaresTotal');
    if (totalEl) {
      const total = datos.nacionales.reduce(
        (sum, t) => sum + t.temporadas.length,
        0,
      );
      totalEl.textContent = total;
    }

    const gridRegionales = document.getElementById('palmaresRegionalesGrid');
    if (gridRegionales) {
      gridRegionales.innerHTML = '';
      datos.regionales.forEach((t) =>
        gridRegionales.appendChild(crearTarjeta(t, false)),
      );
    }

    const precedenteEl = document.getElementById('palmaresPrecedente');
    if (precedenteEl && datos.precedente) {
      const p = datos.precedente;
      precedenteEl.innerHTML = `<i class="fas fa-circle-info"></i> El título de ${p.temporada} del ${p.competicion} lo ganó el <b>${p.club}</b>, uno de los dos clubes cuya fusión en 1926 dio lugar al Real Oviedo. No se cuenta como título del Real Oviedo, se recoge aquí solo como antecedente histórico.`;
    }
  }

  document.addEventListener('DOMContentLoaded', renderPalmares);
})();
