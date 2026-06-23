/* ===================================
   DATA-DERBIS.JS
   Base de datos de todos los derbis
   =================================== */

window.DERBIS_DATA = [
  {
    id: '1944-j12', // El identificador único
    temporada: '1944/45',
    jornada: 12,
    competicion: '1ª División',
    fecha: '10 de Diciembre de 1944',
    estadio: 'Estadio de Buenavista',
    resultado: '2 - 1',
    ganador: 'oviedo', // 'oviedo', 'sporting' o 'empate'
    local: {
      nombre: 'Real Oviedo',
      escudo: 'https://i.postimg.cc/T2VtkXHR/Real-Oviedo-1942-44.png',
      cssClass: 'oviedo',
      entrenador: {
        nombre: 'Meana',
        foto: 'https://i.postimg.cc/Vs0DyL7P/Meana-entrenador-PNG.png',
        bandera: 'https://i.postimg.cc/tCyYJstn/Asturespa.png',
      },
      alineacion: [
        {
          nombre: 'Argila',
          foto: 'https://i.postimg.cc/Hs4WXqtp/Argila-PNG-Alineaci-n.png',
          bandera: 'https://i.postimg.cc/jjfxjjwP/Espa-a.jpg',
          eventos: [],
        },
        {
          nombre: 'Herrerita',
          foto: 'https://i.postimg.cc/Pqw371bV/Herrerita-PNG.png',
          bandera: 'https://i.postimg.cc/tCyYJstn/Asturespa.png',
          eventos: [
            {
              minuto: "23'",
              tipo: 'gol',
              icono: 'https://i.postimg.cc/vZDhB5tt/Gol.png',
            },
          ],
        },
        {
          nombre: 'Echevarría',
          foto: 'https://i.postimg.cc/VLvkqP82/Echevarr-a-PNG.png',
          bandera: 'https://i.postimg.cc/jjfxjjwP/Espa-a.jpg',
          eventos: [
            {
              minuto: "38'",
              tipo: 'gol',
              icono: 'https://i.postimg.cc/vZDhB5tt/Gol.png',
            },
          ],
        },
        // Añadir el resto de jugadores aquí...
      ],
    },
    visitante: {
      nombre: 'Real Gijón',
      escudo: 'https://i.postimg.cc/YSvX8GTV/Real-Gij-n-1946-PNG.png',
      cssClass: 'sporting',
      entrenador: {
        nombre: 'Amadeo Sánchez',
        foto: 'https://i.postimg.cc/hGBMDr2s/Amadeo-S-nchez-entrenador-Sporting-PNG.png',
        bandera: 'https://i.postimg.cc/tCyYJstn/Asturespa.png',
      },
      alineacion: [
        {
          nombre: 'Héctor',
          foto: 'https://i.postimg.cc/xdnszLPL/H-ctor-portero-Sporting-PNG.png',
          bandera: 'https://i.postimg.cc/tCyYJstn/Asturespa.png',
          eventos: [],
        },
        {
          nombre: 'Liz',
          foto: 'https://i.postimg.cc/qqHWMwLn/Liz-Sporting-PNG.png',
          bandera: 'https://i.postimg.cc/jjfxjjwP/Espa-a.jpg',
          eventos: [
            {
              minuto: "89'",
              tipo: 'gol',
              icono: 'https://i.postimg.cc/vZDhB5tt/Gol.png',
            },
          ],
        },
        // Añadir el resto de jugadores aquí...
      ],
    },
  },
];
