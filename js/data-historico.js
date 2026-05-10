/* ===================================
   DATA-HISTORICO.JS
   Temporadas pasadas, vídeos de partidos
   y clasificaciones históricas de Primera.
   Cargar SOLO en páginas de histórico.
   =================================== */

/* global CLUB_DATA */

if (!CLUB_DATA.temporadas) {
  CLUB_DATA.temporadas = {};
}

// ===================================
// TEMPORADA 2024/25
// ===================================
CLUB_DATA.temporadas['2024-25'] = {
  competicion: 'Segunda División',
  grupo: 'null',

  estadisticasEquipo: {
    posicion: 3,
    partidosJugados: 47,
    victorias: 23,
    empates: 13,
    derrotas: 11,
    golesFavor: 62,
    golesContra: 49,
  },

  jugadores: [

    // PORTEROS
    { id: "aaron-escandell-banacloche", codigo: "aaron-escandell-banacloche", dorsal: 13, posicion: "Portero", enClubDesde: "2024", contratoHasta: "2027", stats: { partidos: 45, goles: 44, asistencias: 0, minutos: 4080, amarillas: 3, rojas: 0, desglose: { "Segunda División": { partidos: 45, goles: 44, asistencias: 0, minutos: 4080, amarillas: 3, rojas: 0 }, }, }, partidos: [ { id: 1, jornada: 1, competicion: "Segunda División", fecha: "2024-08-17", local: "R.C. Deportivo de La Coruña", visitante: "Real Oviedo", golesLocal: 0, golesVisitante: 1, resultado: "V", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 2, jornada: 2, competicion: "Segunda División", fecha: "2024-08-25", local: "C.D. Castellón", visitante: "Real Oviedo", golesLocal: 0, golesVisitante: 0, resultado: "E", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 3, jornada: 3, competicion: "Segunda División", fecha: "2024-08-30", local: "Real Oviedo", visitante: "Racing de Santander", golesLocal: 1, golesVisitante: 3, resultado: "D", minutos: 90, goles: 3, asistencias: 0, amarilla: false, roja: false }, { id: 4, jornada: 4, competicion: "Segunda División", fecha: "2024-09-07", local: "Real Sporting de Gijón", visitante: "Real Oviedo", golesLocal: 3, golesVisitante: 1, resultado: "D", minutos: 90, goles: 3, asistencias: 0, amarilla: false, roja: false }, { id: 5, jornada: 5, competicion: "Segunda División", fecha: "2024-09-15", local: "Real Oviedo", visitante: "F.C. Cartagena", golesLocal: 1, golesVisitante: 0, resultado: "V", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 6, jornada: 6, competicion: "Segunda División", fecha: "2024-09-21", local: "C.D. Eldense", visitante: "Real Oviedo", golesLocal: 1, golesVisitante: 1, resultado: "E", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 7, jornada: 7, competicion: "Segunda División", fecha: "2024-09-29", local: "Real Oviedo", visitante: "S.D. Eibar", golesLocal: 1, golesVisitante: 0, resultado: "V", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 8, jornada: 8, competicion: "Segunda División", fecha: "2024-10-06", local: "Levante U.D.", visitante: "Real Oviedo", golesLocal: 0, golesVisitante: 0, resultado: "E", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 9, jornada: 9, competicion: "Segunda División", fecha: "2024-10-13", local: "Real Oviedo", visitante: "U.D. Almería", golesLocal: 3, golesVisitante: 2, resultado: "V", minutos: 90, goles: 2, asistencias: 0, amarilla: false, roja: false }, { id: 10, jornada: 10, competicion: "Segunda División", fecha: "2024-10-19", local: "Málaga C.F.", visitante: "Real Oviedo", golesLocal: 0, golesVisitante: 0, resultado: "E", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 11, jornada: 11, competicion: "Segunda División", fecha: "2024-10-22", local: "Real Oviedo", visitante: "C.D. Mirandés", golesLocal: 4, golesVisitante: 1, resultado: "V", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 12, jornada: 12, competicion: "Segunda División", fecha: "2024-10-26", local: "Cádiz C.F.", visitante: "Real Oviedo", golesLocal: 2, golesVisitante: 0, resultado: "D", minutos: 90, goles: 2, asistencias: 0, amarilla: false, roja: false }, { id: 13, jornada: 13, competicion: "Segunda División", fecha: "2024-11-03", local: "Real Oviedo", visitante: "Burgos C.F.", golesLocal: 3, golesVisitante: 1, resultado: "V", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 14, jornada: 14, competicion: "Segunda División", fecha: "2024-11-10", local: "Albacete Balompié", visitante: "Real Oviedo", golesLocal: 2, golesVisitante: 2, resultado: "E", minutos: 90, goles: 2, asistencias: 0, amarilla: false, roja: false }, { id: 15, jornada: 15, competicion: "Segunda División", fecha: "2024-11-17", local: "Real Oviedo", visitante: "C.D. Tenerife", golesLocal: 3, golesVisitante: 1, resultado: "V", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 16, jornada: 16, competicion: "Segunda División", fecha: "2024-11-24", local: "Elche C.F.", visitante: "Real Oviedo", golesLocal: 4, golesVisitante: 0, resultado: "D", minutos: 90, goles: 4, asistencias: 0, amarilla: true, roja: false }, { id: 17, jornada: 17, competicion: "Segunda División", fecha: "2024-11-29", local: "Real Oviedo", visitante: "S.D. Huesca", golesLocal: 0, golesVisitante: 3, resultado: "D", minutos: 90, goles: 3, asistencias: 0, amarilla: false, roja: false }, { id: 18, jornada: 18, competicion: "Segunda División", fecha: "2024-12-08", local: "Racing de Ferrol", visitante: "Real Oviedo", golesLocal: 1, golesVisitante: 5, resultado: "V", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 19, jornada: 19, competicion: "Segunda División", fecha: "2024-12-14", local: "Real Oviedo", visitante: "Granada C.F.", golesLocal: 2, golesVisitante: 0, resultado: "V", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 20, jornada: 21, competicion: "Segunda División", fecha: "2024-12-21", local: "Real Oviedo", visitante: "Córdoba C.F.", golesLocal: 2, golesVisitante: 3, resultado: "D", minutos: 90, goles: 3, asistencias: 0, amarilla: true, roja: false }, { id: 21, jornada: 22, competicion: "Segunda División", fecha: "2025-01-11", local: "Real Oviedo", visitante: "Real Sporting de Gijón", golesLocal: 1, golesVisitante: 1, resultado: "E", minutos: 90, goles: 1, asistencias: 0, amarilla: true, roja: false }, { id: 22, jornada: 23, competicion: "Segunda División", fecha: "2025-01-17", local: "F.C. Cartagena", visitante: "Real Oviedo", golesLocal: 0, golesVisitante: 1, resultado: "V", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 23, jornada: 24, competicion: "Segunda División", fecha: "2025-01-26", local: "Real Oviedo", visitante: "C.D. Castellón", golesLocal: 1, golesVisitante: 0, resultado: "V", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 24, jornada: 25, competicion: "Segunda División", fecha: "2025-02-01", local: "U.D. Almería", visitante: "Real Oviedo", golesLocal: 1, golesVisitante: 1, resultado: "E", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 25, jornada: 26, competicion: "Segunda División", fecha: "2025-02-10", local: "Real Oviedo", visitante: "C.D. Eldense", golesLocal: 0, golesVisitante: 0, resultado: "E", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 26, jornada: 27, competicion: "Segunda División", fecha: "2025-02-16", local: "Real Oviedo", visitante: "Albacete Balompié", golesLocal: 1, golesVisitante: 0, resultado: "V", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 27, jornada: 28, competicion: "Segunda División", fecha: "2025-02-22", local: "Burgos C.F.", visitante: "Real Oviedo", golesLocal: 1, golesVisitante: 2, resultado: "V", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 28, jornada: 29, competicion: "Segunda División", fecha: "2025-03-02", local: "Real Oviedo", visitante: "R.C. Deportivo de La Coruña", golesLocal: 1, golesVisitante: 2, resultado: "D", minutos: 90, goles: 2, asistencias: 0, amarilla: false, roja: false }, { id: 29, jornada: 30, competicion: "Segunda División", fecha: "2025-03-08", local: "C.D. Mirandés", visitante: "Real Oviedo", golesLocal: 1, golesVisitante: 0, resultado: "D", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 30, jornada: 31, competicion: "Segunda División", fecha: "2025-03-14", local: "Real Oviedo", visitante: "Elche C.F.", golesLocal: 1, golesVisitante: 1, resultado: "E", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 31, jornada: 32, competicion: "Segunda División", fecha: "2025-03-22", local: "Granada C.F.", visitante: "Real Oviedo", golesLocal: 1, golesVisitante: 0, resultado: "D", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 32, jornada: 33, competicion: "Segunda División", fecha: "2025-03-30", local: "Real Oviedo", visitante: "Málaga C.F.", golesLocal: 2, golesVisitante: 1, resultado: "V", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 33, jornada: 34, competicion: "Segunda División", fecha: "2025-04-05", local: "S.D. Eibar", visitante: "Real Oviedo", golesLocal: 1, golesVisitante: 1, resultado: "E", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 34, jornada: 35, competicion: "Segunda División", fecha: "2025-04-12", local: "Real Oviedo", visitante: "Racing de Ferrol", golesLocal: 3, golesVisitante: 0, resultado: "V", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 35, jornada: 36, competicion: "Segunda División", fecha: "2025-04-20", local: "Córdoba C.F.", visitante: "Real Oviedo", golesLocal: 0, golesVisitante: 0, resultado: "E", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 36, jornada: 37, competicion: "Segunda División", fecha: "2025-04-26", local: "Real Oviedo", visitante: "Levante U.D.", golesLocal: 1, golesVisitante: 0, resultado: "V", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 37, jornada: 38, competicion: "Segunda División", fecha: "2025-05-03", local: "S.D. Huesca", visitante: "Real Oviedo", golesLocal: 1, golesVisitante: 2, resultado: "V", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 38, jornada: 39, competicion: "Segunda División", fecha: "2025-05-11", local: "Racing de Santander", visitante: "Real Oviedo", golesLocal: 1, golesVisitante: 1, resultado: "E", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 39, jornada: 40, competicion: "Segunda División", fecha: "2025-05-18", local: "Real Oviedo", visitante: "Real Zaragoza", golesLocal: 1, golesVisitante: 0, resultado: "V", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 40, jornada: 41, competicion: "Segunda División", fecha: "2025-05-25", local: "C.D. Tenerife", visitante: "Real Oviedo", golesLocal: 0, golesVisitante: 1, resultado: "V", minutos: 90, goles: 0, asistencias: 0, amarilla: false, roja: false }, { id: 41, jornada: 42, competicion: "Segunda División", fecha: "2025-06-01", local: "Real Oviedo", visitante: "Cádiz C.F.", golesLocal: 2, golesVisitante: 1, resultado: "V", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 42, jornada: "Fase Ascenso - Semifinal Ida", competicion: "Segunda División", fecha: "2025-06-07", local: "U.D. Almería", visitante: "Real Oviedo", golesLocal: 1, golesVisitante: 2, resultado: "V", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 43, jornada: "Fase Ascenso - Semifinal Vuelta", competicion: "Segunda División", fecha: "2025-06-11", local: "Real Oviedo", visitante: "U.D. Almería", golesLocal: 1, golesVisitante: 1, resultado: "E", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 44, jornada: "Fase Ascenso - Final Ida", competicion: "Segunda División", fecha: "2025-06-15", local: "C.D. Mirandés", visitante: "Real Oviedo", golesLocal: 1, golesVisitante: 0, resultado: "D", minutos: 90, goles: 1, asistencias: 0, amarilla: false, roja: false }, { id: 45, jornada: "Fase Ascenso - Final Vuelta", competicion: "Segunda División", fecha: "2025-06-21", local: "Real Oviedo", visitante: "C.D. Mirandés", golesLocal: 3, golesVisitante: 1, resultado: "V", minutos: 120, goles: 1, asistencias: 0, amarilla: false, roja: false }, ], }, 
    { id: "quentin-jean-pierre-guy-braat", codigo: "quentin-jean-pierre-guy-braat", dorsal: 1, posicion: "Portero", enClubDesde: "2022", contratoHasta: "2025", estado: "baja", stats: { partidos: 2, goles: 5, asistencias: 0, minutos: 210, amarillas: 1, rojas: 0, desglose: { "Segunda División": { partidos: 1, goles: 2, asistencias: 0, minutos: 90, amarillas: 1, rojas: 0 }, "Copa del Rey (Felipe VI)": { partidos: 1, goles: 3, asistencias: 0, minutos: 120, amarillas: 0, rojas: 0 }, }, }, partidos: [ { id: 1, jornada: "Primera Ronda", competicion: "Copa del Rey (Felipe VI)", fecha: "2024-10-31", local: "Real Ávila", visitante: "Real Oviedo", golesLocal: 0, golesVisitante: 0, resultado: "E", minutos: 120, penaltisLocal: 3, penaltisVisitante: 0, goles: 3, asistencias: 0, amarilla: false, roja: false }, { id: 2, jornada: 20, competicion: "Segunda División", fecha: "2024-12-17", local: "Real Zaragoza", visitante: "Real Oviedo", golesLocal: 2, golesVisitante: 3, resultado: "V", minutos: 90, goles: 2, asistencias: 0, amarilla: true, roja: false }, ], }, 
    { id: 'miguel-de-jesus-narvaez-lopez', codigo: 'miguel-de-jesus-narvaez-lopez', dorsal: 26, enClubDesde: '2024', contratoHasta: '2027', stats: { partidos: 0, goles: 0, asistencias: 0, minutos: 0, amarillas: 0, rojas: 0, desglose: { 'Primera División': { partidos: 0, goles: 0, asistencias: 0, minutos: 0, amarillas: 0, rojas: 0, }, }, }, partidos: [], }, 
  ],

  cuerpoTecnico: [
    {
      id: 1,
      nombre: 'Carlos Mendoza',
      cargo: 'Entrenador Principal',
      imagen: 'https://picsum.photos/seed/coach1-23/400/450',
      descripcion: 'Temporada de consolidación.',
      esPrincipal: true,
      estadisticas: {
        partidos: 38,
        victorias: 18,
        empates: 10,
        derrotas: 10,
      },
    },
  ],

  partidosJugados: [
    {
      id: 101,
      jornada: 38,
      fecha: '2024-05-19',
      local: 'Real Oviedo',
      visitante: 'Cultural Soria',
      golesLocal: 3,
      golesVisitante: 1,
      resultado: 'V',
    },
    {
      id: 102,
      jornada: 37,
      fecha: '2024-05-12',
      local: 'Racing Ferrol',
      visitante: 'Real Oviedo',
      golesLocal: 2,
      golesVisitante: 2,
      resultado: 'E',
    },
  ],
};

// ===================================
// TEMPORADA 2022/23
// ===================================
CLUB_DATA.temporadas['2022-23'] = {
  competicion: 'Segunda RFEF',
  grupo: 'Grupo I',

  estadisticasEquipo: {
    posicion: 1,
    partidosJugados: 34,
    victorias: 22,
    empates: 6,
    derrotas: 6,
    golesFavor: 62,
    golesContra: 28,
  },

  jugadores: [
    {
      id: 'miguel-angel-torres',
      codigo: 'miguel-angel-torres',
      dorsal: 1,
      enClubDesde: '2022',
      contratoHasta: '2024',
      stats: {
        partidos: 34,
        goles: 0,
        asistencias: 0,
        minutos: 3060,
        amarillas: 2,
        rojas: 0,
      },
    },
    {
      id: 'raul-fernandez',
      codigo: 'raul-fernandez',
      dorsal: 5,
      enClubDesde: '2021',
      contratoHasta: '2023',
      stats: {
        partidos: 28,
        goles: 3,
        asistencias: 1,
        minutos: 2480,
        amarillas: 4,
        rojas: 0,
      },
    },

    {
      id: 'javi-martinez',
      codigo: 'javi-martinez',
      dorsal: 9,
      enClubDesde: '2022',
      contratoHasta: '2025',
      logros: ['Ascenso a Primera RFEF'],
      stats: {
        partidos: 32,
        goles: 18,
        asistencias: 5,
        minutos: 2750,
        amarillas: 4,
        rojas: 0,
      },
    },
  ],

  cuerpoTecnico: [
    {
      id: 1,
      nombre: 'Carlos Mendoza',
      cargo: 'Entrenador Principal',
      imagen: 'https://picsum.photos/seed/coach1-22/400/450',
      descripcion: 'Primera temporada. Ascenso.',
      esPrincipal: true,
      estadisticas: {
        partidos: 34,
        victorias: 22,
        empates: 6,
        derrotas: 6,
      },
    },
  ],

  partidosJugados: [
    {
      id: 201,
      jornada: 34,
      fecha: '2023-05-14',
      local: 'Real Oviedo',
      visitante: 'Atlético Vergara',
      golesLocal: 3,
      golesVisitante: 0,
      resultado: 'V',
    },
    {
      id: 202,
      jornada: 33,
      fecha: '2023-05-07',
      local: 'Cultural Soria',
      visitante: 'Real Oviedo',
      golesLocal: 1,
      golesVisitante: 1,
      resultado: 'E',
    },
  ],
};

// ===================================
// VÍDEOS (Resúmenes de Partidos)
// ===================================
CLUB_DATA.videos = [
  {
    id: 1,
    jornada: 12,
    titulo: 'R. Oviedo vs Elche CF',
    fecha: '2024-10-27',
    videoId: 'C5E4g_uy9PE',
  },
  {
    id: 2,
    jornada: 11,
    titulo: 'Eibar vs R. Oviedo',
    fecha: '2024-10-20',
    videoId: 'dQw4w9WgXcQ',
  },
  {
    id: 3,
    jornada: 10,
    titulo: 'R. Oviedo vs Racing',
    fecha: '2024-10-13',
    videoId: 'dQw4w9WgXcQ',
  },
];

// ===================================
// PRIMERA DIVISIÓN - HISTÓRICO
// ===================================
CLUB_DATA.primeraDivisionHistorico = {
  '2025-26': {
    nombre: '2025/26',
    competicion: 'LaLiga EA Sports',
    jornadas: [
      {
        numero: 1,
        fecha: '15-18 AGO',
        partidos: [
          {
            local: 'Real Oviedo',
            visitante: 'Sevilla FC',
            golesLocal: 2,
            golesVisitante: 1,
            estado: 'finalizado',
            escudoLocal: '',
            escudoVisitante: '',
            goleadores: [
              { jugador: 'Javi Martínez', minuto: "23'", equipo: 'local' },
              { jugador: 'En-Nesyri', minuto: "45'", equipo: 'visitante' },
              { jugador: 'Rubén Cano', minuto: "78'", equipo: 'local' },
            ],
          },
          {
            local: 'FC Barcelona',
            visitante: 'Valencia CF',
            golesLocal: 3,
            golesVisitante: 0,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Lewandowski', minuto: "12'", equipo: 'local' },
              { jugador: 'Lamine Yamal', minuto: "34'", equipo: 'local' },
            ],
          },
          {
            local: 'Real Madrid',
            visitante: 'Atlético de Madrid',
            golesLocal: 1,
            golesVisitante: 1,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Bellingham', minuto: "56'", equipo: 'local' },
              { jugador: 'Griezmann', minuto: "72'", equipo: 'visitante' },
            ],
          },
        ],
      },
      {
        numero: 2,
        fecha: '22-25 AGO',
        partidos: [
          {
            local: 'Real Madrid',
            visitante: 'Real Oviedo',
            golesLocal: 1,
            golesVisitante: 1,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Bellingham', minuto: "56'", equipo: 'local' },
              { jugador: 'Aarón', minuto: "89'", equipo: 'visitante' },
            ],
          },
          {
            local: 'Sevilla FC',
            visitante: 'FC Barcelona',
            golesLocal: 0,
            golesVisitante: 2,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Pedri', minuto: "23'", equipo: 'visitante' },
              { jugador: 'Raphinha', minuto: "67'", equipo: 'visitante' },
            ],
          },
        ],
      },
      {
        numero: 3,
        fecha: '29 AGO - 01 SEP',
        partidos: [
          {
            local: 'Real Oviedo',
            visitante: 'Girona FC',
            golesLocal: 3,
            golesVisitante: 2,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Javi Martínez', minuto: "12'", equipo: 'local' },
              { jugador: 'Javi Martínez', minuto: "45'", equipo: 'local' },
              { jugador: 'Stuani', minuto: "56'", equipo: 'visitante' },
              { jugador: 'Stuani', minuto: "78'", equipo: 'visitante' },
              { jugador: 'Luis García', minuto: "90'", equipo: 'local' },
            ],
          },
        ],
      },
    ],
  },
  '2001-02': {
    nombre: '2001/02',
    competicion: 'La Liga',
    jornadas: [
      {
        numero: 1,
        fecha: '25-27 AGO 2001',
        partidos: [
          {
            local: 'Real Oviedo',
            visitante: 'R.C. Celta de Vigo',
            golesLocal: 1,
            golesVisitante: 2,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Oli', minuto: "34'", equipo: 'local' },
              { jugador: 'Mostovoi', minuto: "12'", equipo: 'visitante' },
              { jugador: 'Karpin', minuto: "78'", equipo: 'visitante' },
            ],
          },
        ],
      },
    ],
  },
};

window.CLUB_DATA = CLUB_DATA;
