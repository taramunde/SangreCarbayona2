/* ===================================
   DATA-CLUB.JS
   Información estática del club:
   nombre, estadio, temporada actual,
   lista de temporadas disponibles.
   Cargar en TODAS las páginas.
   =================================== */

const CLUB_DATA = {
  // Año de lanzamiento de ESTA web (no confundir con club.fundacion, que es
  // el año de fundación del Real Oviedo). Se usa en el footer para mostrar
  // "2017-{año actual}" automáticamente, sin tener que tocarlo cada año.
  webDesde: 2017,

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
    {
      id: '2016-17',
      nombre: '2016/17',
      fotoPosition: 'center 10%',
      actual: false,
    },
    {
      id: '2015-16',
      nombre: '2015/16',
      fotoPosition: 'center 10%',
      actual: false,
    },
    {
      id: '2014-15',
      nombre: '2014/15',
      fotoPosition: 'center 10%',
      actual: false,
    },
    {
      id: '2013-14',
      nombre: '2013/14',
      fotoPosition: 'center 10%',
      actual: false,
    },
  ],

  // ===================================
  // JUEGOS DISPONIBLES EN LA WEB
  // ===================================
  juegos: [
    {
      titulo: 'Quiz Carbayón',
      descripcion:
        'Demuestra tus conocimientos sobre la historia del Real Oviedo.',
      imagen: 'img/varios/QuizRealOviedo.webp',
      enlace: 'juegos/quiz.html',
      esEspecial: false,
    },
    {
      titulo: 'Puzzle Carbayón',
      descripcion:
        'Completa los rompecabezas con imágenes históricas del Real Oviedo.',
      imagen: 'img/varios/PuzzleRealOviedo.webp',
      enlace: 'juegos/puzzlecarbayon.html',
      esEspecial: true,
    },
  ],
};

window.CLUB_DATA = CLUB_DATA;
