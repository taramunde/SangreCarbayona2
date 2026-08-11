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
      contratoHasta: '2029',
      stats: {},
      partidos: [],
    },

    {
      id: 'miguel-de-jesus-narvaez-lopez',
      codigo: 'miguel-de-jesus-narvaez-lopez',
      dorsal: 1,
      enClubDesde: '2024',
      contratoHasta: '2027',
      stats: {},
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
      dorsal: 15,
      posicion: 'Lateral Izquierdo',
      enClubDesde: '2026',
      contratoHasta: '2029',
      stats: {},
      partidos: [],
    },

    {
      id: 'juan-cruz-alvaro-armada',
      codigo: 'juan-cruz-alvaro-armada',
      dorsal: 3,
      posicion: 'Lateral Izquierdo',
      enClubDesde: '2026',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'david-costas-cordal',
      codigo: 'david-costas-cordal',
      dorsal: 4,
      posicion: 'Central',
      enClubDesde: '2021',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'daniel-pedro-calvo-san-roman',
      codigo: 'daniel-pedro-calvo-san-roman',
      dorsal: 12,
      posicion: 'Central',
      enClubDesde: '2021',
      contratoHasta: '2027',
      stats: {},
      partidos: [],
    },

    {
  id: "carlos-dominguez-caceres",
  codigo: "carlos-dominguez-caceres",
  dorsal: "-",
  posicion: "Central",
  enClubDesde: "2026",
  contratoHasta: "2027",
  stats: {},
  partidos: []
},

    {
      id: 'oier-luengo-redondo',
      codigo: 'oier-luengo-redondo',
      dorsal: 15,
      posicion: 'Central',
      enClubDesde: '2022',
      contratoHasta: '2027',
      stats: {},
      partidos: [],
    },

    {
      id: 'ignacio-vidal-miralles',
      codigo: 'ignacio-vidal-miralles',
      dorsal: 22,
      posicion: 'Lateral Derecho',
      enClubDesde: '2025',
      contratoHasta: '2027',
      stats: {},
      partidos: [],
    },

    {
      id: 'aisar-ahmed-ahmed',
      codigo: 'aisar-ahmed-ahmed',
      dorsal: 2,
      posicion: 'Lateral Derecho',
      enClubDesde: '2026',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'marco-esteban-fernandez',
      codigo: 'marco-esteban-fernandez',
      dorsal: 30,
      posicion: 'Central',
      enClubDesde: '2023',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'chukwuma-eze',
      codigo: 'chukwuma-eze',
      dorsal: 25,
      posicion: 'Central',
      enClubDesde: '2024',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'diego-espinosa-garcia-de-muro',
      codigo: 'diego-espinosa-garcia-de-muro',
      dorsal: '-',
      posicion: 'Central',
      enClubDesde: '2025',
      contratoHasta: '2029',
      stats: {},
      partidos: [],
    },

    // CENTROCAMPISTAS

    {
      id: 'alberto-reina-campos',
      codigo: 'alberto-reina-campos',
      dorsal: 6,
      posicion: 'Mediocentro',
      enClubDesde: '2025',
      contratoHasta: '2027',
      stats: {},
      partidos: [],
    },

    {
      id: 'haissem-hassan',
      codigo: 'haissem-hassan',
      dorsal: 10,
      posicion: 'Mediocentro',
      enClubDesde: '2024',
      contratoHasta: '2027',
      stats: {},
      partidos: [],
    },

    {
      id: 'brandon-jose-domingues',
      codigo: 'brandon-jose-domingues',
      dorsal: '-',
      posicion: 'Mediocentro',
      enClubDesde: '2025',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'luka-ilic',
      codigo: 'luka-ilic',
      dorsal: 21,
      posicion: 'Mediocentro',
      enClubDesde: '2025',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'alejandro-suarez-cardero',
      codigo: 'alejandro-suarez-cardero',
      dorsal: 11,
      posicion: 'Mediapunta',
      enClubDesde: '2020',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'diego-menendez-secades',
      codigo: 'diego-menendez-secades',
      dorsal: 28,
      posicion: 'Mediocentro',
      enClubDesde: '2023',
      contratoHasta: '2027',
      stats: {},
      partidos: [],
    },

    {
      id: 'pablo-menendez-agudin',
      codigo: 'pablo-menendez-agudin',
      dorsal: 27,
      posicion: 'Mediapunta',
      enClubDesde: '2025',
      contratoHasta: '2026',
      estado: "cedido",
      cedidoEn: "U.E. Sant Andreu",
      stats: {},
      partidos: [],
    },

    {
      id: 'youness-lachhab',
      codigo: 'youness-lachhab',
      dorsal: 5,
      posicion: 'Mediocentro',
      enClubDesde: '2026',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'enzo-perez-miranda',
      codigo: 'enzo-perez-miranda',
      dorsal: 32,
      posicion: 'Mediocentro Ofensivo',
      enClubDesde: '2025',
      contratoHasta: '2029',
      stats: {},
      partidos: [],
    },

    {
      id: 'guillermo-berzal-rueda',
      codigo: 'guillermo-berzal-rueda',
      dorsal: 33,
      posicion: 'Mediapunta',
      enClubDesde: '2025',
      contratoHasta: '2027',
      stats: {},
      partidos: [],
    },

    {
      id: 'aritz-aldasoro-sarriegi',
      codigo: 'aritz-aldasoro-sarriegi',
      dorsal: 16,
      posicion: 'Mediocentro',
      enClubDesde: '2026',
      contratoHasta: '2027',
      stats: {},
      partidos: [],
    },

    {
      id: 'daniel-villahermosa-martinez',
      codigo: 'daniel-villahermosa-martinez',
      dorsal: 14,
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
      stats: {},
      partidos: [],
    },

    {
      id: 'daniel-george-paraschiv',
      codigo: 'daniel-george-paraschiv',
      dorsal: 14,
      posicion: 'Delantero Centro',
      enClubDesde: '2024',
      contratoHasta: '2027',
      stats: {},
      partidos: [],
    },

    {
      id: 'jacobo-gonzalez-rodriganez',
      codigo: 'jacobo-gonzalez-rodriganez',
      dorsal: 23,
      posicion: 'Extremo Izquierdo',
      enClubDesde: '2026',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'pablo-saenz-ezquerra',
      codigo: 'pablo-saenz-ezquerra',
      dorsal: 20,
      posicion: 'Extremo Derecho',
      enClubDesde: '2026',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'joaquin-delgado-romero',
      codigo: 'joaquin-delgado-romero',
      dorsal: 19,
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
      dorsal: 18,
      posicion: 'Delantero Centro',
      enClubDesde: '2026',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'alexandru-mihai-isfan',
      codigo: 'alexandru-mihai-isfan',
      dorsal: 24,
      posicion: 'Delantero Centro',
      enClubDesde: '2026',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
      id: 'christopher-ramos-de-la-flor',
      codigo: 'christopher-ramos-de-la-flor',
      dorsal: 9,
      posicion: 'Delantero Centro',
      enClubDesde: '2026',
      contratoHasta: '2027',
      stats: {},
      partidos: [],
    },

    {
      id: 'carlos-fernandez-luna',
      codigo: 'carlos-fernandez-luna',
      dorsal: 17,
      posicion: 'Delantero Centro',
      enClubDesde: '2026',
      contratoHasta: '2028',
      stats: {},
      partidos: [],
    },

    {
  id: "estanislau-pedrola-fortuny",
  codigo: "estanislau-pedrola-fortuny",
  dorsal: "-",
  posicion: "Extremo Izquierdo",
  enClubDesde: "2026",
  contratoHasta: "2029",
  stats: {},
  partidos: [
  ]
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

window.CLUB_DATA = CLUB_DATA;
