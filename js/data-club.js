/* ===================================
   DATA-CLUB.JS
   Información estática del club:
   nombre, estadio, temporada actual,
   lista de temporadas disponibles.
   Cargar en TODAS las páginas.
   =================================== */

const CLUB_DATA = {
  // Información del club
  club: {
    nombre: 'Real Oviedo',
    nombreCorto: 'Real Oviedo',
    logo: 'https://i.postimg.cc/yYcPrs6f/Oviedo.png',
    siglas: 'OVI',
    fundacion: 1926,
    estadio: 'Estadio Carlos Tartiere',
    capacidadEstadio: 30500,
    ciudad: 'Oviedo',
    direccion: 'Calle Carlos Tartiere s/n, 33013 Oviedo',
    telefono: '985 111 111',
    email: 'info@realoviedo.es',
  },

  // Temporada actual (por defecto)
  temporadaActual: '2026-27',

  // Lista de temporadas disponibles
  temporadasDisponibles: [
    {
      id: '2026-27',
      nombre: '2026/27',
      fotoPosition: 'center 25%',
      actual: true,
    },
    {
      id: '2025-26',
      nombre: '2025/26',
      fotoPosition: 'center 25%',
      actual: false,
    },
    {
      id: '2024-25',
      nombre: '2024/25',
      fotoPosition: 'center 25%',
      actual: false,
    },
    { id: '2023-24', nombre: '2023/24', actual: false },
    { id: '2022-23', nombre: '2022/23', actual: false },
  ],
};

window.CLUB_DATA = CLUB_DATA;
