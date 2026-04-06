/* ===================================
   1. DICCIONARIO DE JUGADORES (DATOS FIJOS)
   =================================== */
const BASE_JUGADORES = {
  "santi-cazorla": {
    id: "santi-cazorla",
    codigo: "santi-cazorla",
    nombre: "Santiago",
    apellidos: "Cazorla González",
    nombreCompleto: "Santi Cazorla",
    apodo: "El Mago",
    lugarNacimiento: "Lugo de Llanera, Asturias",
    fechaNacimiento: "1984-12-13",
    fallecido: false,
    nacionalidad: "Española",
  },
  "michu-oviedo": {
    id: "michu-oviedo",
    codigo: "michu-oviedo",
    nombre: "Miguel",
    apellidos: "Pérez Cuesta",
    nombreCompleto: "Michu",
    lugarNacimiento: "Oviedo, Asturias",
    fechaNacimiento: "1986-03-21",
    fallecido: false,
    nacionalidad: "Española",
  },
  "toni-cuervo": {
    id: "toni-cuervo",
    codigo: "toni-cuervo",
    nombre: "Antonio",
    apellidos: "Cuervo Fernández",
    nombreCompleto: "Toni Cuervo",
    lugarNacimiento: "Oviedo",
    fechaNacimiento: "1932-04-10",
    fallecido: true,
    nacionalidad: "Española",
  },
};

/* ===================================
   2. DATOS DEL CLUB Y TEMPORADAS
   =================================== */
const CLUB_DATA = {
  club: {
    nombre: "Real Oviedo",
    nombreCorto: "Real Oviedo",
    logo: "https://i.postimg.cc/yYcPrs6f/Oviedo.png",
    siglas: "OVI",
    fundacion: 1926,
    estadio: "Estadio Carlos Tartiere",
    capacidadEstadio: 30500,
    ciudad: "Oviedo",
  },

  temporadaActual: "2025-26",

  temporadasDisponibles: [
    { id: "2025-26", nombre: "2025/26", actual: true },
    { id: "2024-25", nombre: "2024/25", actual: false },
    { id: "2023-24", nombre: "2023/24", actual: false },
  ],

  temporadas: {
    "2025-26": {
      competicion: "Primera División",
      jugadores: [
        {
          baseId: "santi-cazorla",
          dorsal: 8,
          posicion: "Centrocampista",
          imagen: "https://i.postimg.cc/mD8p6m2y/cazorla.png",
          enClubDesde: "2023",
          contratoHasta: "2026",
          stats: {
            partidos: 35,
            goles: 8,
            golesEncajados: 0,
            amarillas: 4,
            rojas: 0,
            asistencias: 12,
            minutos: 2450,
            desglose: {
              Liga: {
                partidos: 28,
                goles: 5,
                golesEncajados: 0,
                amarillas: 3,
                rojas: 0,
                asistencias: 10,
                minutos: 2100,
              },
              Copa: {
                partidos: 4,
                goles: 2,
                golesEncajados: 0,
                amarillas: 1,
                rojas: 0,
                asistencias: 2,
                minutos: 260,
              },
              Internacional: {
                partidos: 0,
                goles: 0,
                golesEncajados: 0,
                amarillas: 0,
                rojas: 0,
                asistencias: 0,
                minutos: 0,
              },
              Selección: {
                partidos: 3,
                goles: 1,
                golesEncajados: 0,
                amarillas: 0,
                rojas: 0,
                asistencias: 0,
                minutos: 90,
              },
            },
          },
          partidos: [
            {
              jornada: 1,
              rival: "Sevilla FC",
              fecha: "2025-08-17",
              local: "Real Oviedo",
              golesLocal: 2,
              golesVisitante: 1,
              resultado: "V",
              minutos: 90,
              goles: 0,
            },
          ],
        },
      ],
    },
    "2024-25": {
      competicion: "Segunda División",
      jugadores: [
        {
          baseId: "michu-oviedo",
          dorsal: 9,
          posicion: "Delantero",
          imagen: "https://i.postimg.cc/fy9p6V3M/michu.png",
          enClubDesde: "2024",
          contratoHasta: "2025",
          stats: {
            partidos: 42,
            goles: 25,
            golesEncajados: 0,
            amarillas: 6,
            rojas: 1,
            asistencias: 5,
            minutos: 3600,
            desglose: {
              Liga: {
                partidos: 38,
                goles: 22,
                golesEncajados: 0,
                amarillas: 5,
                rojas: 1,
                asistencias: 4,
                minutos: 3300,
              },
              Copa: {
                partidos: 4,
                goles: 3,
                golesEncajados: 0,
                amarillas: 1,
                rojas: 0,
                asistencias: 1,
                minutos: 300,
              },
              Internacional: {
                partidos: 0,
                goles: 0,
                golesEncajados: 0,
                amarillas: 0,
                rojas: 0,
                asistencias: 0,
                minutos: 0,
              },
              Selección: {
                partidos: 0,
                goles: 0,
                golesEncajados: 0,
                amarillas: 0,
                rojas: 0,
                asistencias: 0,
                minutos: 0,
              },
            },
          },
          partidos: [],
        },
      ],
    },
    "2023-24": {
      competicion: "Segunda División",
      jugadores: [
        {
          baseId: "toni-cuervo",
          dorsal: 2,
          posicion: "Defensa",
          imagen: "https://i.postimg.cc/gjG0WjZf/toni-cuervo.png",
          enClubDesde: "1950",
          contratoHasta: "1967",
          stats: {
            partidos: 30,
            goles: 0,
            golesEncajados: 0,
            amarillas: 2,
            rojas: 0,
            asistencias: 0,
            minutos: 2700,
            desglose: {
              Liga: {
                partidos: 26,
                goles: 0,
                golesEncajados: 0,
                amarillas: 2,
                rojas: 0,
                asistencias: 0,
                minutos: 2340,
              },
              Copa: {
                partidos: 4,
                goles: 0,
                golesEncajados: 0,
                amarillas: 0,
                rojas: 0,
                asistencias: 0,
                minutos: 360,
              },
              Internacional: {
                partidos: 0,
                goles: 0,
                golesEncajados: 0,
                amarillas: 0,
                rojas: 0,
                asistencias: 0,
                minutos: 0,
              },
              Selección: {
                partidos: 0,
                goles: 0,
                golesEncajados: 0,
                amarillas: 0,
                rojas: 0,
                asistencias: 0,
                minutos: 0,
              },
            },
          },
          partidos: [],
        },
      ],
    },
  },

  /* ===================================
       OTROS DATOS GLOBALES
       =================================== */
  calendario: [
    {
      mes: "Agosto 2025",
      partidos: [
        {
          id: 1,
          fecha: "17 Ago",
          rival: "Sevilla FC",
          lugar: "Local",
          resultado: "2-1",
          tipo: "victoria",
          competicion: "LaLiga",
        },
      ],
    },
  ],

  noticias: [
    {
      id: 1,
      titulo: "Regreso a Primera",
      resumen: "El Real Oviedo prepara su debut en la máxima categoría.",
      imagen: "https://via.placeholder.com/600x400",
      fecha: "2025-08-01",
      categoria: "Club",
    },
  ],

  patrocinadores: [
    { nombre: "Adidas", logo: "https://logo.png", tipo: "Principal" },
  ],

  proximoPartido: {
    rival: "Valencia CF",
    fecha: "2026-04-12",
    hora: "18:30",
    estadio: "Carlos Tartiere",
    competicion: "LaLiga",
  },

  juegos: [],
  videos: [],
};

/* ===================================
   3. FUNCIONES DE AYUDA (EL MOTOR)
   =================================== */
function getTemporada(seasonId) {
  const id = seasonId || CLUB_DATA.temporadaActual;
  const tempRaw = CLUB_DATA.temporadas[id];
  if (!tempRaw) return null;

  // Clonamos para no modificar el original
  const temporada = JSON.parse(JSON.stringify(tempRaw));

  // Unimos los datos de la temporada con la biografía fija
  temporada.jugadores = temporada.jugadores.map((pj) => {
    const bio = BASE_JUGADORES[pj.baseId];
    return { ...bio, ...pj };
  });

  return temporada;
}

function getJugadorById(id, seasonId) {
  const temp = getTemporada(seasonId);
  if (!temp) return null;
  return temp.jugadores.find((j) => j.codigo === id || j.id === id);
}

// Exportar para que app.js y generar.js lo vean
if (typeof window !== "undefined") {
  window.CLUB_DATA = CLUB_DATA;
  window.BASE_JUGADORES = BASE_JUGADORES;
  window.getTemporada = getTemporada;
  window.getJugadorById = getJugadorById;
} else {
  // Para el entorno de Node.js (generar.js)
  module.exports = { CLUB_DATA, BASE_JUGADORES, getTemporada, getJugadorById };
}
