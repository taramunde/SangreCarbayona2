/* ===================================
   UNIFICADOR DE DATOS
   Genera CLUB_DATA a partir de los módulos separados
   =================================== */

function generarDatosClub() {
  const temporadas = {};

  for (const [tempId, config] of Object.entries(TEMPORADAS_CONFIG)) {
    const jugadoresTemporada = config.plantilla
      .map((plantilla) => {
        const base = JUGADORES_BASE[plantilla.idRef];
        if (!base) {
          console.warn(`Jugador base no encontrado: ${plantilla.idRef}`);
          return null;
        }

        // Calcular edad automáticamente según la temporada
        const edad = calcularEdadEnTemporada(
          base.fechaNacimiento,
          tempId,
          base.fechaFallecimiento,
        );

        // Fusionar objetos: Base + Específicos de temporada
        return {
          ...base,
          id: base.id, // Asegurar que el ID viene del base
          edad: edad,
          dorsal: plantilla.dorsal,
          posicion: plantilla.posicion,
          posicionCorta: plantilla.posicionCorta,
          enClubDesde: plantilla.enClubDesde,
          contratoHasta: plantilla.contratoHasta,
          imagen: plantilla.imagenOverride || base.imagenBase,
          stats: plantilla.stats,
          partidos: plantilla.partidosIndividuales || [],
          // Flags específicos de temporada
          esCapitan: plantilla.esCapitan || base.esCapitan || false,
          fallecido:
            base.fallecido &&
            new Date(base.fechaFallecimiento) <
              new Date(TEMPORADAS_CONFIG[tempId].fechaFin || "2024-07-01"),
        };
      })
      .filter((j) => j !== null);

    temporadas[tempId] = {
      competicion: config.competicion,
      grupo: config.grupo,
      estadisticasEquipo: config.estadisticasEquipo,
      jugadores: jugadoresTemporada,
      cuerpoTecnico: config.cuerpoTecnico,
      partidosJugados: config.partidosEquipo,
    };
  }

  return {
    club: CLUB_INFO, // Constante con datos del club
    temporadaActual: "2025-26",
    temporadasDisponibles: Object.keys(TEMPORADAS_CONFIG).map((id) => ({
      id,
      nombre: id.replace("-", "/"),
      actual: id === "2025-26",
    })),
    temporadas: temporadas,
    // ... resto de datos (calendario, noticias, etc.)
  };
}

function calcularEdadEnTemporada(fechaNac, temporadaId, fechaFallecimiento) {
  const añoTemp = parseInt(temporadaId.split("-")[0]);
  const fechaRef = new Date(`${añoTemp}-08-01`); // 1 de agosto de inicio de temporada

  const nac = new Date(fechaNac);
  let edad = fechaRef.getFullYear() - nac.getFullYear();

  // Ajustar si no ha cumplido años en esa temporada
  if (
    fechaRef.getMonth() < nac.getMonth() ||
    (fechaRef.getMonth() === nac.getMonth() &&
      fechaRef.getDate() < nac.getDate())
  ) {
    edad--;
  }

  // Si falleció durante esa temporada, calcular edad al fallecer
  if (fechaFallecimiento) {
    const muerte = new Date(fechaFallecimiento);
    const finTemp = new Date(`${añoTemp + 1}-07-01`);
    if (muerte < finTemp && muerte > new Date(`${añoTemp}-08-01`)) {
      // Calcular edad exacta al morir
      let edadMuerte = muerte.getFullYear() - nac.getFullYear();
      const m = muerte.getMonth() - nac.getMonth();
      if (m < 0 || (m === 0 && muerte.getDate() < nac.getDate())) edadMuerte--;
      return edadMuerte;
    }
  }

  return edad;
}

// Generar el objeto global compatible con tu app actual
window.CLUB_DATA = generarDatosClub();
