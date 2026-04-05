/* ===================================
   CONFIGURACIÓN POR TEMPORADA
   Solo datos que cambian cada año
   =================================== */

const TEMPORADAS_CONFIG = {
  "2025-26": {
    competicion: "Primera División",
    grupo: null,
    estadisticasEquipo: {
      posicion: 20,
      partidosJugados: 29,
      victorias: 4,
      empates: 9,
      derrotas: 16,
      golesFavor: 20,
      golesContra: 48
    },
    
    // Plantilla: referencia al jugador base + datos específicos
    plantilla: [
      {
        idRef: "aaron-escandell",
        dorsal: 13,
        posicion: "Portero",
        posicionCorta: "POR",
        enClubDesde: "2024",
        contratoHasta: "2027",
        imagenOverride: null, // Si es null, usa la imagenBase
        
        // ESTADÍSTICAS DE LA TEMPORADA
        stats: {
          partidos: 29,
          goles: 0,
          asistencias: 0,
          minutos: 2610,
          amarillas: 2,
          rojas: 0,
          desglose: {
            "Primera División": { partidos: 29, goles: 0, asistencias: 0, minutos: 2610, amarillas: 2, rojas: 0 },
            "Copa del Rey": { partidos: 0, goles: 0, asistencias: 0, minutos: 0, amarillas: 0, rojas: 0 }
          }
        },
        
        // Partidos individuales (opcional, como array de IDs o datos completos)
        partidosIndividuales: [
          { id: 1, jornada: 1, minutos: 90, goles: 0, resultado: "V", ... }
        ]
      },
      {
        idRef: "javi-martinez",
        dorsal: 9,
        posicion: "Delantero Centro",
        posicionCorta: "DC",
        enClubDesde: "2022",
        contratoHasta: "2026",
        esCapitan: true, // Override temporal si aplica
        stats: { partidos: 23, goles: 14, asistencias: 4, ... }
      }
    ],
    
    cuerpoTecnico: [...],
    partidosEquipo: [...]
  },
  
  "2023-24": {
    competicion: "Primera RFEF",
    grupo: "Grupo I",
    plantilla: [
      {
        idRef: "javi-martinez",
        dorsal: 9,
        posicion: "Delantero Centro",
        stats: { partidos: 35, goles: 22, ... } // ¡Datos diferentes!
      }
    ]
  }
};