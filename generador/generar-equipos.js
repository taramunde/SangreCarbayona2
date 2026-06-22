const fs = require('fs');
const path = require('path');

// ==========================================
// 1. TÚ CONTROLAS QUÉ SE GENERA
// ==========================================
const dominioWeb = 'https://tusitio.com'; // Tu dominio real
const temporadaActual = '2026-27'; // La actual siempre va a la raíz

// 👉 ESCRIBE AQUÍ LAS TEMPORADAS QUE QUIERAS GENERAR HOY:
const temporadasAGenerar = ['2026-27', '2025-26', '2024-25', '2023-24'];
// ==========================================

const rootDir = path.join(__dirname, '..');
const rutaCarpeta = path.join(rootDir, 'equipos');
if (!fs.existsSync(rutaCarpeta)) fs.mkdirSync(rutaCarpeta);

const rutaPlantilla = path.join(__dirname, 'plantilla-equipo.html');
const plantillaHTML = fs.readFileSync(rutaPlantilla, 'utf8');

temporadasAGenerar.forEach((temporada) => {
  let htmlFinal = plantillaHTML
    .replace(/{{TEMPORADA}}/g, temporada)
    .replace(
      /{{OG_TITLE}}/g,
      `Plantilla Real Oviedo ${temporada} | Sangre Carbayona`,
    );

  const rutaFoto = path.join(
    rootDir,
    'img',
    'alineaciones',
    `${temporada}.jpg`,
  );
  const urlImagenOg = fs.existsSync(rutaFoto)
    ? `${dominioWeb}/img/alineaciones/${temporada}.jpg`
    : `${dominioWeb}/img/estadio-header.jpg`;

  htmlFinal = htmlFinal.replace(/{{OG_IMAGE}}/g, urlImagenOg);

  // Si es la temporada actual, la guarda en la carpeta principal
  if (temporada === temporadaActual) {
    htmlFinal = htmlFinal.replace(
      /{{OG_URL}}/g,
      `${dominioWeb}/primer-equipo.html`,
    );
    fs.writeFileSync(path.join(rootDir, 'primer-equipo.html'), htmlFinal);
    console.log(`⭐ Actualizado: primer-equipo.html (Raíz)`);
  } else {
    // Las históricas van a la carpeta equipos/
    htmlFinal = htmlFinal.replace(
      /{{OG_URL}}/g,
      `${dominioWeb}/equipos/primer-equipo-${temporada}.html`,
    );
    htmlFinal = htmlFinal.replace(
      '<meta charset="UTF-8" />',
      '<meta charset="UTF-8" />\n    <base href="../">',
    );
    fs.writeFileSync(
      path.join(rutaCarpeta, `primer-equipo-${temporada}.html`),
      htmlFinal,
    );
    console.log(`📄 Creado: equipos/primer-equipo-${temporada}.html`);
  }
});

console.log('🎉 ¡Listo!');
