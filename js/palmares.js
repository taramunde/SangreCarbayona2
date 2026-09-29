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

  function crearFotoDestacada(titulo) {
    if (!titulo.foto) return '';
    return `
      <figure class="palmares-foto">
        <img src="${titulo.foto}" alt="${titulo.fotoPie || titulo.competicion}" loading="lazy" />
        <figcaption>
          ${titulo.fotoPie || ''}
          ${
            titulo.fotoFuente
              ? `<br /><a href="${titulo.fotoFuente}" target="_blank" rel="noopener">Fuente: Wikimedia Commons</a>`
              : ''
          }
        </figcaption>
      </figure>
    `;
  }

  function crearTarjeta(titulo) {
    const card = document.createElement('div');
    card.className = 'palmares-card';
    card.innerHTML = `
      ${
        titulo.escudo
          ? `<div class="palmares-icono"><img src="${titulo.escudo}" alt="Escudo de época" loading="lazy" /></div>`
          : titulo.icono
            ? `<div class="palmares-icono"><i class="fas ${titulo.icono}"></i></div>`
            : ''
      }
      <div class="palmares-info">
        <div class="palmares-cabecera">
          <b class="palmares-competicion">${titulo.competicion}</b>
          <span class="palmares-contador">${titulo.temporadas.length}</span>
        </div>
        <div class="palmares-chips">${crearChips(titulo.temporadas)}</div>
        ${crearFotoDestacada(titulo)}
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
        gridNacionales.appendChild(crearTarjeta(t)),
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
        gridRegionales.appendChild(crearTarjeta(t)),
      );
    }

    const precedenteEl = document.getElementById('palmaresPrecedente');
    if (precedenteEl && datos.precedente) {
      const p = datos.precedente;
      precedenteEl.innerHTML = `
        ${
          p.foto
            ? `<img class="palmares-precedente-foto" src="${p.foto}" alt="${p.fotoPie || p.club}" loading="lazy" />`
            : ''
        }
        <span>
          <i class="fas fa-circle-info"></i> El título de ${p.temporada} del ${p.competicion} lo ganó el <b>${p.club}</b>, uno de los dos clubes cuya fusión en 1926 dio lugar al Real Oviedo. No se cuenta como título del Real Oviedo, se recoge aquí solo como antecedente histórico.
          ${
            p.fotoFuente
              ? ` <a href="${p.fotoFuente}" target="_blank" rel="noopener">(Fuente: Wikimedia Commons)</a>`
              : ''
          }
        </span>
      `;
    }
  }

  document.addEventListener('DOMContentLoaded', renderPalmares);
})();
