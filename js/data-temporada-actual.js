/* ===================================
   DATA-TEMPORADA-ACTUAL.JS
   Datos de la temporada en curso:
   plantilla, stats, partidos jugados,
   calendario, próximo partido, juegos.
   Cargar en páginas de temporada actual.
   =================================== */

/* global CLUB_DATA */

if (!CLUB_DATA.temporadas) {
  CLUB_DATA.temporadas = {}; // ← solo crea el objeto si no existe ya
}

// ← Fuente única de verdad: cambia SOLO este valor cada temporada nueva.
// El resto del sitio (badges, títulos, etc.) lo lee de aquí automáticamente.
CLUB_DATA.temporadaActualId = '2026-27';

CLUB_DATA.temporadas['2026-27'] = {
  competicion: 'Segunda División',
  grupo: 'null',

  estadisticasEquipo: {
    posicion: 0,
    desglose: {
      'Segunda División': {
        partidos: 0,
        victorias: 0,
        empates: 0,
        derrotas: 0,
        golesFavor: 0,
        golesContra: 0,
      },
      'Copa del Rey (Felipe VI)': {
        partidos: 0,
        victorias: 0,
        empates: 0,
        derrotas: 0,
        golesFavor: 0,
        golesContra: 0,
      },
    },
  },

  jugadores: [
    // PORTEROS

    {
      id: 'aaron-escandell-banacloche',
      codigo: 'aaron-escandell-banacloche',
      dorsal: 13,
      enClubDesde: '2024',
      contratoHasta: '2027',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
        desglose: {
          'Segunda División': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
        },
      },
      partidos: [],
    },

    {
      id: 'miguel-de-jesus-narvaez-lopez',
      codigo: 'miguel-de-jesus-narvaez-lopez',
      dorsal: 26,
      enClubDesde: '2024',
      contratoHasta: '2027',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
        desglose: {
          'Segunda División': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
        },
      },
      partidos: [],
    },

    {
      id: 'mate-sauri',
      codigo: 'mate-sauri',
      dorsal: '-',
      posicion: 'Portero',
      enClubDesde: '2025',
      contratoHasta: '2026',
      stats: {},
      partidos: [],
    },

    // DEFENSAS

    {
      id: 'samuel-rodriguez-de-la-riva',
      codigo: 'samuel-rodriguez-de-la-riva',
      dorsal: '-',
      posicion: 'Lateral Izquierdo',
      enClubDesde: '2026',
      contratoHasta: '2029',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
      },
      partidos: [],
    },

    {
      id: 'abdel-rahim-alhassane-bonkano',
      codigo: 'abdel-rahim-alhassane-bonkano',
      dorsal: 3,
      posicion: 'Lateral Izquierdo',
      enClubDesde: '2024',
      contratoHasta: '2028',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
        desglose: {
          'Segunda División': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
          'Copa del Rey (Felipe VI)': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
        },
      },
      partidos: [],
    },

    {
      id: 'david-costas-cordal',
      codigo: 'david-costas-cordal',
      dorsal: 4,
      posicion: 'Central',
      enClubDesde: '2021',
      contratoHasta: '2028',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
        desglose: {
          'Segunda División': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
        },
      },
      partidos: [],
    },

    {
      id: 'daniel-pedro-calvo-san-roman',
      codigo: 'daniel-pedro-calvo-san-roman',
      dorsal: 12,
      posicion: 'Central',
      enClubDesde: '2021',
      contratoHasta: '2027',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
        desglose: {
          'Segunda División': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
          'Copa del Rey (Felipe VI)': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
        },
      },
      partidos: [],
    },

    {
      id: 'oier-luengo-redondo',
      codigo: 'oier-luengo-redondo',
      dorsal: 15,
      posicion: 'Central',
      enClubDesde: '2022',
      contratoHasta: '2027',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
        desglose: {
          'Segunda División': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
        },
      },
      partidos: [],
    },

    {
      id: 'ignacio-vidal-miralles',
      codigo: 'ignacio-vidal-miralles',
      dorsal: 5,
      posicion: 'Lateral Derecho',
      enClubDesde: '2025',
      contratoHasta: '2027',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
        desglose: {
          'Segunda División': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
        },
      },
      partidos: [],
    },

    {
      id: 'mouhamed-lamine-gueye',
      codigo: 'mouhamed-lamine-gueye',
      dorsal: 28,
      posicion: 'Lateral Derecho',
      enClubDesde: '2023',
      contratoHasta: '2027',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
      },
      partidos: [],
    },

    {
      id: 'aisar-ahmed-ahmed',
      codigo: 'aisar-ahmed-ahmed',
      dorsal: '-',
      posicion: 'Lateral Derecho',
      enClubDesde: '2026',
      contratoHasta: '2028',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
      },
      partidos: [],
    },

    // CENTROCAMPISTAS

    {
      id: 'haissem-hassan',
      codigo: 'haissem-hassan',
      dorsal: 10,
      posicion: 'Mediocentro',
      enClubDesde: '2024',
      contratoHasta: '2027',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
        desglose: {
          'Segunda División': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
          'Copa del Rey (Felipe VI)': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
        },
      },
      partidos: [],
    },

    {
      id: 'brandon-jose-domingues',
      codigo: 'brandon-jose-domingues',
      dorsal: 17,
      posicion: 'Mediocentro',
      enClubDesde: '2025',
      contratoHasta: '2028',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
        desglose: {
          'Copa del Rey (Felipe VI)': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
        },
      },
      partidos: [],
    },

    {
      id: 'luka-ilic',
      codigo: 'luka-ilic',
      dorsal: 21,
      posicion: 'Mediocentro',
      enClubDesde: '2025',
      contratoHasta: '2028',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
        desglose: {
          'Segunda División': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
          'Copa del Rey (Felipe VI)': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
        },
      },
      partidos: [],
    },

    {
      id: 'alejandro-suarez-cardero',
      codigo: 'alejandro-suarez-cardero',
      dorsal: 27,
      posicion: 'Mediapunta',
      enClubDesde: '2020',
      contratoHasta: '2028',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
      },
      partidos: [],
    },

    {
      id: 'diego-menendez-secades',
      codigo: 'diego-menendez-secades',
      dorsal: 32,
      posicion: 'Mediocentro',
      enClubDesde: '2023',
      contratoHasta: '2027',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
      },
      partidos: [],
    },

    {
      id: 'pablo-menendez-agudin',
      codigo: 'pablo-menendez-agudin',
      dorsal: 27,
      posicion: 'Mediapunta',
      enClubDesde: '2025',
      contratoHasta: '2029',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
        desglose: {
          'Segunda División': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
          'Copa del Rey (Felipe VI)': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
        },
      },
      partidos: [],
    },

    {
      id: 'youness-lachhab',
      codigo: 'youness-lachhab',
      dorsal: '-',
      posicion: 'Mediocentro',
      enClubDesde: '2026',
      contratoHasta: '2028',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
      },
      partidos: [],
    },

    {
      id: 'enzo-perez-miranda',
      codigo: 'enzo-perez-miranda',
      dorsal: '-',
      posicion: 'Mediocentro Ofensivo',
      enClubDesde: '2025',
      contratoHasta: '2027',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
      },
      partidos: [],
    },

    {
      id: 'guillermo-berzal-rueda',
      codigo: 'guillermo-berzal-rueda',
      dorsal: '-',
      posicion: 'Mediapunta',
      enClubDesde: '2025',
      contratoHasta: '2027',
      stats: {},
      partidos: [],
    },

    {
      id: 'aritz-aldasoro-sarriegi',
      codigo: 'aritz-aldasoro-sarriegi',
      dorsal: 0,
      posicion: 'Mediocentro',
      enClubDesde: '2026',
      contratoHasta: '2027',
      stats: {},
      partidos: [],
    },

    // DELANTEROS

    {
      id: 'ilyas-chaira-oihi',
      codigo: 'ilyas-chaira-oihi',
      dorsal: 7,
      posicion: 'Extremo Izquierdo',
      enClubDesde: '2025',
      contratoHasta: '2028',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
        desglose: {
          'Segunda División': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
          'Copa del Rey (Felipe VI)': {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            minutos: 0,
            amarillas: 0,
            rojas: 0,
          },
        },
      },
      partidos: [],
    },

    {
      id: 'daniel-george-paraschiv',
      codigo: 'daniel-george-paraschiv',
      dorsal: '-',
      posicion: 'Delantero Centro',
      enClubDesde: '2024',
      contratoHasta: '2027',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
      },
      partidos: [],
    },

    {
      id: 'jacobo-gonzalez-rodriganez',
      codigo: 'jacobo-gonzalez-rodriganez',
      dorsal: '-',
      posicion: 'Extremo Izquierdo',
      enClubDesde: '2026',
      contratoHasta: '2028',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
      },
      partidos: [],
    },

    {
      id: 'pablo-saenz-ezquerra',
      codigo: 'pablo-saenz-ezquerra',
      dorsal: '-',
      posicion: 'Extremo Derecho',
      enClubDesde: '2026',
      contratoHasta: '2028',
      stats: {
        partidos: 0,
        goles: 0,
        asistencias: 0,
        minutos: 0,
        amarillas: 0,
        rojas: 0,
      },
      partidos: [],
    },

    {
      id: 'joaquin-delgado-romero',
      codigo: 'joaquin-delgado-romero',
      dorsal: '-',
      posicion: 'Delantero Centro',
      enClubDesde: '2024',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'jaime-coballes-fernandez',
      codigo: 'jaime-coballes-fernandez',
      dorsal: '-',
      posicion: 'Delantero Centro',
      enClubDesde: '2016',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'victor-garcia-mingo',
      codigo: 'victor-garcia-mingo',
      dorsal: '-',
      posicion: 'Delantero Centro',
      enClubDesde: '2026',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },
  ],

  // ENTRENADORES

  cuerpoTecnico: [
    {
      id: 'julian-calero-fernandez',
      codigo: 'julian-calero-fernandez',
      nombre: 'Julián Calero Fernández',
      cargo: 'Entrenador Principal',
      imagen: 'https://i.postimg.cc/nrdNyDFW/Julian-Calero.webp',
      esPrincipal: true,
      enClubDesde: '2026',
      contratoHasta: '2027',
      estadisticas: {
        partidos: 0,
        victorias: 0,
        empates: 0,
        derrotas: 0,
        golesFavor: 0,
        golesContra: 0,
        desglose: {
          'Segunda División': {
            partidos: 0,
            victorias: 0,
            empates: 0,
            derrotas: 0,
            golesFavor: 0,
            golesContra: 0,
          },
        },
      },
      partidos: [],
    },
  ],
};

CLUB_DATA.calendario = [
  {
    id: 1,
    jornada: 24,
    fecha: '2025-01-26',
    hora: '18:00',
    local: 'Real Oviedo',
    visitante: 'UD Rosaleda',
    estadio: 'Carlos Tartiere',
    esProximo: true,
  },
];

CLUB_DATA.patrocinadores = [{ id: 1, nombre: 'Grupo Norte' }];

CLUB_DATA.proximoPartido = {
  jornada: 24,
  competicion: 'Primera RFEF',
  fecha: '2025-01-26',
  hora: '18:00',
  local: 'Real Oviedo',
  localSiglas: 'OVI',
  visitante: 'UD Rosaleda',
  visitanteSiglas: 'UDR',
  estadio: 'Carlos Tartiere',
};

CLUB_DATA.juegos = [
  {
    id: 'quiz',
    titulo: 'Quiz Carbayón',
    descripcion: '¿Cuánto sabes de la historia del club?',
    imagen: 'https://i.postimg.cc/3J1wMxw4/Quiz.webp',
    enlace: 'juegos/quiz.html',
    esEspecial: true,
  },
  {
    id: 'memoria',
    titulo: 'Juego de Memoria',
    descripcion: 'Encuentra las parejas de escudos y jugadores.',
    imagen: 'https://picsum.photos/seed/memory-game/400/300',
    enlace: '#',
    esEspecial: false,
  },
  {
    id: 'penaltis',
    titulo: 'Lanzamiento de Penaltis',
    descripcion: 'Elige la esquina y marca el gol decisivo.',
    imagen: 'https://picsum.photos/seed/penalty-game/400/300',
    enlace: '#',
    esEspecial: false,
  },
];

window.CLUB_DATA = CLUB_DATA;
