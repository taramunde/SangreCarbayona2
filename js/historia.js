/* ===================================
   HISTORIA.JS
   Renderiza la línea de tiempo con los capítulos
   de la historia del Real Oviedo.
   Cargar después de data-historia.js.
   =================================== */

/* global CLUB_DATA */

(function () {
  'use strict';

  function crearImagenes(imagenes) {
    if (!imagenes || !imagenes.length) return '';
    return `
      <div class="historia-imagenes">
        ${imagenes
          .map(
            (img) => `
          <figure class="historia-imagen">
            <img src="${img.src}" alt="${img.pie || ''}" loading="lazy" />
            <figcaption>
              ${img.pie || ''}
              ${
                img.fuente
                  ? `<br /><a href="${img.fuente}" target="_blank" rel="noopener">Fuente: Wikimedia Commons${img.credito ? ` · ${img.credito}` : ''}</a>`
                  : ''
              }
            </figcaption>
          </figure>
        `,
          )
          .join('')}
      </div>
    `;
  }

  function crearCapitulo(capitulo, index) {
    const item = document.createElement('article');
    item.className = 'historia-item';
    item.id = capitulo.id;

    item.innerHTML = `
      <div class="historia-marcador">
        ${
          capitulo.escudo
            ? `<img class="historia-escudo" src="${capitulo.escudo}" alt="Escudo de época" loading="lazy" />`
            : `<span class="historia-numero">${index + 1}</span>`
        }
      </div>
      <div class="historia-contenido">
        <span class="historia-periodo">${capitulo.periodo}</span>
        <h2 class="historia-titulo">${capitulo.titulo}</h2>
        ${capitulo.texto.map((p) => `<p>${p}</p>`).join('')}
        ${crearImagenes(capitulo.imagenes)}
      </div>
    `;
    return item;
  }

  function renderHistoria() {
    const lista = CLUB_DATA.historia;
    const contenedor = document.getElementById('historiaTimeline');
    if (!lista || !contenedor) return;

    contenedor.innerHTML = '';
    lista.forEach((capitulo, index) => {
      contenedor.appendChild(crearCapitulo(capitulo, index));
    });
  }

  document.addEventListener('DOMContentLoaded', renderHistoria);
})();
