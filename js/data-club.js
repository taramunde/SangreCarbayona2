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

  // Nombre de la competición actual (cambiar aquí si el equipo asciende/desciende)
  competicionActual: 'LaLiga Hypermotion',

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
    {
      id: '2023-24',
      nombre: '2023/24',
      fotoPosition: 'center 25%',
      actual: false,
    },
    {
      id: '2022-23',
      nombre: '2022/23',
      fotoPosition: 'center 25%',
      actual: false,
    },
    {
      id: '2021-22',
      nombre: '2021/22',
      fotoPosition: 'center 25%',
      actual: false,
    },
    {
      id: '2020-21',
      nombre: '2020/21',
      fotoPosition: 'center 25%',
      actual: false,
    },
    {
      id: '2019-20',
      nombre: '2019/20',
      fotoPosition: 'center 25%',
      actual: false,
    },
    {
      id: '2018-19',
      nombre: '2018/19',
      fotoPosition: 'center 10%',
      actual: false,
    },
    {
      id: '2017-18',
      nombre: '2017/18',
      fotoPosition: 'center 10%',
      actual: false,
    },
  ],

  // Juegos disponibles en la sección "Multimedia > Juegos".
  // renderJuegos() (en app.js) los pinta en #juegosGrid con la clase .juego-card.
  juegos: [
    {
      titulo: 'Puzzle Carbayón',
      descripcion:
        'Recompón el escudo, el Tartiere y a los héroes carbayones pieza a pieza. Cuatro niveles de dificultad.',
      imagen: 'https://picsum.photos/seed/oviedo-puzzle-card/600/400',
      enlace: 'Juegos/puzzle-carbayon.html',
      esEspecial: true,
    },
    {
      titulo: 'Quiz Carbayón',
      descripcion:
        '¿Cuánto sabes del Real Oviedo? Pon a prueba tus conocimientos sobre la historia del club.',
      imagen: 'https://i.postimg.cc/3J1wMxw4/Quiz.webp',
      enlace: 'Juegos/quiz.html',
      esEspecial: false,
    },
  ],
};

window.CLUB_DATA = CLUB_DATA;