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
// TEMPORADA 2023/24
// ===================================
CLUB_DATA.temporadas['2023-24'] = {
  competicion: 'Primera RFEF',
  grupo: 'Grupo I',

  estadisticasEquipo: {
    posicion: 4,
    partidosJugados: 38,
    victorias: 18,
    empates: 10,
    derrotas: 10,
    golesFavor: 56,
    golesContra: 35,
  },

  jugadores: [
    {
      id: 'miguel-angel-torres',
      codigo: 'miguel-angel-torres',
      dorsal: 1,
      enClubDesde: '2022',
      contratoHasta: '2025',
      stats: {
        partidos: 36,
        goles: 0,
        asistencias: 0,
        minutos: 3240,
        amarillas: 3,
        rojas: 0,
      },
    },
    {
      id: 'javi-martinez',
      codigo: 'javi-martinez',
      dorsal: 9,
      enClubDesde: '2022',
      contratoHasta: '2026',
      logros: ['Pichichi Primera RFEF 2023/24'],
      stats: {
        partidos: 35,
        goles: 22,
        asistencias: 6,
        minutos: 2980,
        amarillas: 5,
        rojas: 0,
      },
    },
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
