/* ===================================
   DATA-UTILS.JS
   Constantes y funciones de acceso:
   POSITION_GROUPS, getTemporada,
   getJugadorById, calcularPosicionHistorica.
   Cargar SIEMPRE, después de los data-*.js.
   =================================== */

/* global CLUB_DATA */

const POSITION_GROUPS = {
  goalkeeper: {
    key: 'porteros',
    positions: ['Portero'],
    icon: 'fa-hand-paper',
  },
  defender: {
    key: 'defensas',
    positions: ['Defensa', 'Central', 'Lateral Derecho', 'Lateral Izquierdo'],
    icon: 'fa-shield-alt',
  },
  midfielder: {
    key: 'centrocampistas',
    positions: [
      'Centrocampista',
      'Mediocentro',
      'Mediocentro Defensivo',
      'Mediocentro Ofensivo',
      'Mediapunta',
      'Pivote',
    ],
    icon: 'fa-sync-alt',
  },
  forward: {
    key: 'delanteros',
    positions: [
      'Delantero',
      'Delantero Centro',
      'Extremo Derecho',
      'Extremo Izquierdo',
    ],
    icon: 'fa-bullseye',
  },
};

// Devuelve a qué grupo (Porteros/Defensas/Centrocampistas/Delanteros)
// pertenece una posición concreta, para poder traducirla o clasificarla.
function getPositionGroup(posicion) {
  for (const group of Object.values(POSITION_GROUPS)) {
    if (group.positions.includes(posicion)) {
      return group;
    }
  }
  return null;
}

// ===================================
// FUNCIONES DE AYUDA
// ===================================

function getTemporada(seasonId) {
  return (
    CLUB_DATA.temporadas[seasonId] ||
    CLUB_DATA.temporadas[CLUB_DATA.temporadaActual]
  );
}

function getJugadorById(id, seasonId) {
  const temporada = getTemporada(seasonId);

  // Buscar el registro variable en la temporada (por codigo o id)
  const datoTemp =
    temporada.jugadores.find((j) => j.codigo === id) ||
    temporada.jugadores.find((j) => j.id === id) ||
    temporada.jugadores.find((j) => j.id === parseInt(id));

  if (!datoTemp) return null;

  // Recuperar datos fijos del maestro
  const datoMaestro = CLUB_DATA.jugadoresMaestro[datoTemp.codigo] || {};

  // Calcular la posición histórica según la temporada
  const datosConPosicionHistorica = calcularPosicionHistorica(
    datoMaestro,
    seasonId,
  );

  // Fusionar: el maestro (con posición histórica) pone la base, la temporada sobreescribe lo variable
  return { ...datosConPosicionHistorica, ...datoTemp };
}

/**
 * Calcula la posición correcta de un jugador según la temporada solicitada
 * basándose en el historial de posiciones definido en jugadoresMaestro
 */
function calcularPosicionHistorica(datoMaestro, seasonId) {
  // Si no hay datos de maestro o no tiene historial de posiciones, devolver como está
  if (
    !datoMaestro ||
    !datoMaestro.posiciones ||
    datoMaestro.posiciones.length === 0
  ) {
    return datoMaestro || {};
  }

  // Extraer el año de inicio de la temporada (ej: "2025-26" → 2025)
  const añoTemporada = parseInt(seasonId.split('-')[0]);

  // Buscar si hay una posición histórica que corresponda a esta temporada
  const posicionHistorica = datoMaestro.posiciones.find((ph) => {
    const desde = ph.desde;
    const hasta = ph.hasta;
    return añoTemporada >= desde && añoTemporada <= hasta;
  });

  // Si encontramos una posición histórica para esta temporada, usarla
  if (posicionHistorica) {
    return {
      ...datoMaestro,
      posicion: posicionHistorica.posicion,
      posicionCorta: posicionHistorica.posicionCorta,
      // Guardamos la posición actual original por si se necesita
      posicionActual: datoMaestro.posicion,
      posicionCortaActual: datoMaestro.posicionCorta,
    };
  }

  // Si no hay posición histórica para esta temporada, usar la actual
  return datoMaestro;
}

// Exportar también la nueva función si es necesario
window.calcularPosicionHistorica = calcularPosicionHistorica;

window.CLUB_DATA = CLUB_DATA;
window.getTemporada = getTemporada;
window.getJugadorById = getJugadorById;
