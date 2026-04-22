/* ===================================
   SISTEMA DE TRADUCCIÓN (i18n)
   =================================== */

const translations = {
  es: {
    // ============================================
    // NAVEGACIÓN
    // ============================================
    nav_inicio: 'Inicio',
    nav_club: 'Club',
    nav_equipo: 'Equipo',
    nav_competiciones: 'Competiciones',
    nav_noticias: 'Noticias',
    nav_multimedia: 'Multimedia',
    nav_historia: 'Historia',
    nav_palmares: 'Palmarés',
    nav_estadio: 'Estadio Municipal',
    nav_directiva: 'Directiva',
    nav_primer_equipo: '1ª Equip.',
    nav_cuerpo_tecnico: 'Cuerpo Técnico',
    nav_cantera: 'Cantera',
    nav_fem: 'Fútbol Femenino',
    nav_primera_div: 'Primera Div.',
    nav_copa_rey: 'Copa del Rey',
    nav_calendario: 'Calendario',
    nav_clasificacion: 'Clasificación',
    nav_fundacion: 'Fundación',
    nav_juegos: 'Juegos',
    nav_videos: 'Vídeos',

    // ============================================
    // GENERAL / COMUNES
    // ============================================
    buscar: 'Buscar en la web...',
    ver_todas: 'Ver todas',
    ver_clasificacion: 'Ver clasificación completa',
    calendario_completo: 'Calendario completo',
    ver_plantilla: 'Ver plantilla completa',
    grupo: 'Grupo I',
    current_badge: 'Actual',
    todos: 'Todos',
    cargando: 'Cargando...',
    limpiar_filtros: 'Limpiar filtros',
    intentar_de_nuevo: 'Intentar de nuevo',

    // ============================================
    // INDEX / HOME
    // ============================================
    ultimas_noticias: 'Últimas Noticias',
    clasificacion: 'Clasificación',
    calendario: 'Calendario',
    plantilla: 'Plantilla',
    patrocinadores: 'Patrocinadores',
    proximo_partido: 'Próximo Partido',
    laliga_temporada: 'LaLiga 2025/26',
    champions: 'Champions',
    europa: 'Europa',
    conference: 'Conference',
    descenso: 'Descenso',
    temporada_actual: 'Temporada 2025/26 - Primera Div.',

    // ============================================
    // HERO MATCH (NUEVOS)
    // ============================================
    local: 'Local',
    visitante: 'Visitante',
    victoria: 'Victoria',
    derrota: 'Derrota',
    empate: 'Empate',
    finalizado: 'Finalizado',
    por_disputar: 'Por disputar',
    proximo_partido_label: 'Próximo partido',
    en_casa: 'En casa',
    fuera: 'Fuera',
    jornada_abrev: 'J',

    // ============================================
    // EQUIPO / PLANTILLA
    // ============================================
    equipo_titulo: 'Primer Equipo',
    equipo_subtitulo: 'Temporada',
    posicion: 'Posición',
    victorias: 'Victorias',
    empates: 'Empates',
    derrotas: 'Derrotas',
    goles_favor: 'Goles Favor',
    goles_contra: 'Goles Contra',
    goles_encajados: 'Goles Encajados',
    goles_encajados_corto: 'Encajados',
    goles_encajados_abrev: 'Enc.',
    goles_encajados_partido: 'Goles Encajados/Partido',
    porteros: 'Porteros',
    defensas: 'Defensas',
    centrocampistas: 'Centrocampistas',
    delanteros: 'Delanteros',
    partidos: 'Partidos',
    goles: 'Goles',
    edad: 'años',
    ver_ficha: 'Ver ficha',
    plantilla_completa: 'Plantilla Completa',
    cuerpo_tecnico_titulo: 'Cuerpo Técnico',
    filtrar: 'Filtrar',
    club: 'Club',
    seleccion_nacional: 'Selección Nacional',
    total_club: 'Total Club',
    total_seleccion: 'Total Selección',
    no_datos: 'No hay datos',
    no_datos_partidos: 'No hay datos de partidos para este jugador',
    no_partidos_competicion: 'No hay partidos en esta competición',
    todas_competiciones: 'Todas las competiciones',
    competicion_label: 'Competición',
    copa_ronda_primera_ronda: 'Primera Ronda',
    copa_ronda_segunda_ronda: 'Segunda Ronda',
    copa_ronda_cuartos_de_final: 'Cuartos de Final',
    copa_ronda_semifinal: 'Semifinal',
    copa_ronda_final: 'Final',

    // ============================================
    // FICHA JUGADOR
    // ============================================
    temporada: 'Temporada',
    asistencias: 'Asistencias',
    minutos: 'Minutos',
    altura: 'Altura',
    peso: 'Peso',
    pie: 'Pie',
    rendimiento: 'Resumen',
    informacion: 'Información Personal',
    nacimiento: 'Nacimiento',
    lugar: 'Lugar',
    nacionalidad: 'Nacionalidad',
    en_club_desde: 'En el club desde',
    disciplina: 'Disciplina Temporada',
    amarillas: 'Amarillas',
    rojas: 'Rojas',
    historial: 'Trayectoria',
    totales: 'Totales en el Club',
    logros: 'Logros',
    fallecimiento: 'Fallecimiento',
    seleccion: 'Selección Nacional',
    desconocida: 'Desconocida',
    fecha_desconocida: 'Fecha desconocida',
    goles_partido: 'Goles por partido',
    minutos_partido: 'Minutos por partido',
    jornada: 'Jornada',
    encajados: 'Encajados',
    portero_stat: 'Rendimiento Defensivo',
    goles_encajados_partido: 'Goles Encajados/Partido',
    provincia: 'Provincia',
    nacionalidad_adicional: 'Nacionalidad',
    pj: 'PJ',
    competicion_internacional: 'Competición Internacional',
    sel_absoluta: 'Absoluta',
    sel_u16: 'Sub-16',
    sel_u17: 'Sub-17',
    sel_u18: 'Sub-18',
    sel_u19: 'Sub-19',
    sel_u20: 'Sub-20',
    sel_u21: 'Sub-21',
    sel_u23: 'Sub-23',
    gol: 'gol',
    asistencia: 'asistencia',
    comp_competicion_internacional: 'Competición Internacional',
    comp_copa_del_rey: 'Copa del Rey',
    comp_primera_division: 'Primera División',
    ex_jugador: 'Ex jugador',
    jugador_baja_notice:
      'Este jugador finalizó su etapa en el club en la temporada indicada.',
    estado: 'Estado',
    contrato_hasta: 'Contrato hasta',

    // ============================================
    // CALENDARIO
    // ============================================
    calendario_titulo: 'Calendario',
    calendario_subtitulo:
      'Todos los partidos del Real Oviedo · Primera División',
    calendario_jugados: 'Jugados',
    calendario_victorias: 'Victorias',
    calendario_empates: 'Empates',
    calendario_derrotas: 'Derrotas',
    calendario_goles: 'Goles',
    calendario_pendientes: 'Pendientes',
    calendario_todos: 'Todos',
    calendario_jugados_filtro: 'Jugados',
    calendario_pendientes_filtro: 'Pendientes',
    calendario_en_casa: 'En casa',
    calendario_fuera: 'Fuera',
    laliga_ea_sports: 'LaLiga EA Sports',

    // ============================================
    // CLASIFICACIÓN
    // ============================================
    clasificacion_titulo: 'Clasificación',
    clasificacion_subtitulo:
      'Seguimiento jornada a jornada · Real Oviedo en Primera División',
    tabla_clasificacion: 'Tabla de Clasificación',
    champions_league: 'Champions League',
    europa_league: 'Europa League',
    conference_league: 'Conference League',
    descenso_liga: 'Descenso',
    evolucion_oviedo: 'Evolución Real Oviedo',
    mejor_posicion: 'Mejor',
    peor_posicion: 'Peor',
    actual_posicion: 'Actual',
    col_pos: 'Pos',
    col_club: 'Club',
    col_pts: 'Pts',
    col_pj: 'PJ',
    col_pg: 'PG',
    col_pe: 'PE',
    col_pp: 'PP',
    col_gf: 'GF',
    col_gc: 'GC',
    col_dg: 'DG',

    // ============================================
    // NOTICIAS
    // ============================================
    noticias_titulo: 'Últimas Noticias',
    noticias_subtitulo:
      'Toda la actualidad del Real Oviedo en los principales medios',
    noticias_medios: 'Medios',
    noticias_todos: 'Todos',
    noticias_lavoz: 'La Voz de Asturias',
    noticias_elcomercio: 'El Comercio',
    leer_noticia: 'Leer noticia completa',
    noticias_killer: 'Killer Asturias',
    noticias_cargando: 'Cargando noticias...',
    noticias_error: 'No se pudieron cargar las noticias en este momento.',

    // ============================================
    // PRIMERA DIVISIÓN
    // ============================================
    primera_div_titulo: 'Primera División',
    primera_div_subtitulo: 'Histórico de partidos temporada por temporada',
    solo_oviedo: 'Solo partidos del Real Oviedo',
    filtro_rival: 'Rival:',
    todos_equipos: 'Todos los equipos',
    filtro_resultado: 'Resultado:',
    filtro_todos: 'Todos',
    victorias_oviedo: 'Victorias Oviedo',
    empates_resultado: 'Empates',
    derrotas_oviedo: 'Derrotas Oviedo',
    colapsar_todas: 'Colapsar todas',
    expandir_todas: 'Expandir todas',
    mostrando_partidos: 'Mostrando:',
    partidos_contador: 'partidos',
    no_resultados_filtros:
      'No se encontraron partidos con los filtros seleccionados',

    // ============================================
    // JUEGOS
    // ============================================
    juegos_titulo: 'Juegos',
    juegos_subtitulo: 'Zona de Juegos y Entretenimiento',
    juegos_disponibles: 'Juegos Disponibles',

    // ============================================
    // VÍDEOS
    // ============================================
    videos_titulo: 'Vídeos',
    videos_subtitulo: 'Resúmenes y mejores momentos de la temporada',
    videos_resumenes: 'Resúmenes de Partidos',
    compartir_pagina: 'Comparte esta página',
    compartir_whatsapp: 'Compartir en WhatsApp',
    compartir_twitter: 'Compartir en Twitter',
    compartir_telegram: 'Compartir en Telegram',
    compartir_facebook: 'Compartir en Facebook',

    // ============================================
    // FOOTER
    // ============================================
    footer_club: 'El Club',
    footer_equipos: 'Equipos',
    footer_competiciones: 'Competiciones',
    footer_contacto: 'Contacto',
    footer_privacidad: 'Política de privacidad',
    footer_cookies: 'Política de cookies',
    footer_legal: 'Aviso legal',
    derechos: 'Todos los derechos reservados.',

    // ============================================
    // POSICIONES
    // ============================================
    pos_portero: 'Portero',
    pos_lateral_derecho: 'Lateral Derecho',
    pos_lateral_izquierdo: 'Lateral Izquierdo',
    pos_central: 'Central',
    pos_defensa: 'Defensa',
    pos_mediocentro_defensivo: 'Mediocentro Defensivo',
    pos_centrocampista: 'Centrocampista',
    pos_mediocentro: 'Mediocentro',
    pos_mediapunta: 'Mediapunta',
    pos_delantero_centro: 'Delantero Centro',
    pos_extremo_derecho: 'Extremo Derecho',
    pos_extremo_izquierdo: 'Extremo Izquierdo',
    pos_delantero: 'Delantero',
  },

  en: {
    // ============================================
    // NAVIGATION
    // ============================================
    nav_inicio: 'Home',
    nav_club: 'Club',
    nav_equipo: 'Team',
    nav_competiciones: 'Competitions',
    nav_noticias: 'News',
    nav_multimedia: 'Multimedia',
    nav_historia: 'History',
    nav_palmares: 'Honours',
    nav_estadio: 'Municipal Stadium',
    nav_directiva: 'Board',
    nav_primer_equipo: '1st Team',
    nav_cuerpo_tecnico: 'Technical Staff',
    nav_cantera: 'Academy',
    nav_fem: "Women's Football",
    nav_primera_div: 'First Division',
    nav_copa_rey: 'Copa del Rey',
    nav_calendario: 'Calendar',
    nav_clasificacion: 'Standings',
    nav_fundacion: 'Foundation',
    nav_juegos: 'Games',
    nav_videos: 'Videos',

    // ============================================
    // GENERAL / COMMON
    // ============================================
    buscar: 'Search...',
    ver_todas: 'View all',
    ver_clasificacion: 'View full standings',
    calendario_completo: 'Full calendar',
    ver_plantilla: 'View full squad',
    grupo: 'Group I',
    current_badge: 'Current',
    todos: 'All',
    cargando: 'Loading...',
    limpiar_filtros: 'Clear filters',
    intentar_de_nuevo: 'Try again',

    // ============================================
    // INDEX / HOME
    // ============================================
    ultimas_noticias: 'Latest News',
    clasificacion: 'Standings',
    calendario: 'Calendar',
    plantilla: 'Squad',
    patrocinadores: 'Sponsors',
    proximo_partido: 'Next Match',
    proximo_partido: 'Next Match',
    laliga_temporada: 'LaLiga 2025/26',
    champions: 'Champions',
    europa: 'Europe',
    conference: 'Conference',
    descenso: 'Relegation',
    temporada_actual: '2025/26 Season - First Division',

    // ============================================
    // HERO MATCH (NEW)
    // ============================================
    local: 'Home',
    visitante: 'Away',
    victoria: 'Win',
    derrota: 'Loss',
    empate: 'Draw',
    finalizado: 'Finished',
    por_disputar: 'Upcoming',
    proximo_partido_label: 'Next match',
    en_casa: 'Home',
    fuera: 'Away',
    jornada_abrev: 'M', // Matchday

    // ============================================
    // TEAM / SQUAD
    // ============================================
    equipo_titulo: 'First Team',
    equipo_subtitulo: 'Season',
    posicion: 'Position',
    victorias: 'Wins',
    empates: 'Draws',
    derrotas: 'Losses',
    goles_favor: 'Goals For',
    goles_contra: 'Goals Against',
    goles_encajados: 'Goals Conceded',
    goles_encajados_corto: 'Conceded',
    goles_encajados_abrev: 'Conc.',
    goles_encajados_partido: 'Goals Conceded/Match',
    porteros: 'Goalkeepers',
    defensas: 'Defenders',
    centrocampistas: 'Midfielders',
    delanteros: 'Forwards',
    partidos: 'Matches',
    goles: 'Goals',
    edad: 'years old',
    ver_ficha: 'View profile',
    plantilla_completa: 'Full Squad',
    cuerpo_tecnico_titulo: 'Technical Staff',
    filtrar: 'Filter',
    club: 'Club',
    seleccion_nacional: 'National Team',
    total_club: 'Club Total',
    total_seleccion: 'National Team Total',
    no_datos: 'No data available',
    no_datos_partidos: 'No match data available for this player',
    no_partidos_competicion: 'No matches in this competition',
    todas_competiciones: 'All competitions',
    competicion_label: 'Competition',
    copa_ronda_primera_ronda: 'Round of 32',
    copa_ronda_segunda_ronda: 'Round of 16',
    copa_ronda_cuartos_de_final: 'Quarter-final',
    copa_ronda_semifinal: 'Semi-final',
    copa_ronda_final: 'Final',

    // ============================================
    // PLAYER PROFILE
    // ============================================
    temporada: 'Season',
    asistencias: 'Assists',
    minutos: 'Minutes',
    altura: 'Height',
    peso: 'Weight',
    pie: 'Foot',
    rendimiento: 'Overview',
    informacion: 'Personal Info',
    nacimiento: 'Birthdate',
    lugar: 'Birthplace',
    nacionalidad: 'Nationality',
    en_club_desde: 'At club since',
    disciplina: 'Discipline',
    amarillas: 'Yellow Cards',
    rojas: 'Red Cards',
    historial: 'Career',
    totales: 'Club Totals',
    logros: 'Achievements',
    fallecimiento: 'Passed away',
    seleccion: 'National Team',
    desconocida: 'Unknown',
    fecha_desconocida: 'Date unknown',
    goles_partido: 'Goals per game',
    minutos_partido: 'Minutes per game',
    jornada: 'Matchday',
    encajados: 'Conceded',
    portero_stat: 'Defensive Performance',
    goles_encajados_partido: 'Goals Conceded/Match',
    provincia: 'Province',
    nacionalidad_adicional: 'Nationality',
    pj: 'MP',
    competicion_internacional: 'International Competition',
    sel_absoluta: 'Senior',
    sel_u16: 'U16',
    sel_u17: 'U17',
    sel_u18: 'U18',
    sel_u19: 'U19',
    sel_u20: 'U20',
    sel_u21: 'U21',
    sel_u23: 'U23',
    gol: 'goal',
    asistencia: 'assist',
    comp_competicion_internacional: 'International Competition',
    comp_copa_del_rey: 'Copa del Rey',
    comp_primera_division: 'First Division',
    ex_jugador: 'Former player',
    jugador_baja_notice:
      'This player ended his time at the club in the indicated season.',
    estado: 'Status',
    contrato_hasta: 'Contract until',

    // ============================================
    // CALENDAR
    // ============================================
    calendario_titulo: 'Calendar',
    calendario_subtitulo: 'All Real Oviedo matches · First Division',
    calendario_jugados: 'Played',
    calendario_victorias: 'Wins',
    calendario_empates: 'Draws',
    calendario_derrotas: 'Losses',
    calendario_goles: 'Goals',
    calendario_pendientes: 'Pending',
    calendario_todos: 'All',
    calendario_jugados_filtro: 'Played',
    calendario_pendientes_filtro: 'Pending',
    calendario_en_casa: 'Home',
    calendario_fuera: 'Away',
    laliga_ea_sports: 'LaLiga EA Sports',

    // ============================================
    // STANDINGS
    // ============================================
    clasificacion_titulo: 'Standings',
    clasificacion_subtitulo:
      'Matchday by matchday tracking · Real Oviedo in First Division',
    tabla_clasificacion: 'League Table',
    champions_league: 'Champions League',
    europa_league: 'Europa League',
    conference_league: 'Conference League',
    descenso_liga: 'Relegation',
    evolucion_oviedo: 'Real Oviedo Evolution',
    mejor_posicion: 'Best',
    peor_posicion: 'Worst',
    actual_posicion: 'Current',
    col_pos: 'Pos',
    col_club: 'Club',
    col_pts: 'Pts',
    col_pj: 'MP',
    col_pg: 'W',
    col_pe: 'D',
    col_pp: 'L',
    col_gf: 'GF',
    col_gc: 'GA',
    col_dg: 'GD',

    // ============================================
    // NEWS
    // ============================================
    noticias_titulo: 'Latest News',
    noticias_subtitulo: 'All Real Oviedo news from the main media outlets',
    noticias_medios: 'Media',
    noticias_todos: 'All',
    noticias_lavoz: 'La Voz de Asturias',
    noticias_elcomercio: 'El Comercio',
    leer_noticia: 'Read full article',
    noticias_killer: 'Killer Asturias',
    noticias_cargando: 'Loading news...',
    noticias_error: 'News could not be loaded at this time.',

    // ============================================
    // FIRST DIVISION
    // ============================================
    primera_div_titulo: 'First Division',
    primera_div_subtitulo: 'Match history season by season',
    solo_oviedo: 'Only Real Oviedo matches',
    filtro_rival: 'Opponent:',
    todos_equipos: 'All teams',
    filtro_resultado: 'Result:',
    filtro_todos: 'All',
    victorias_oviedo: 'Oviedo Wins',
    empates_resultado: 'Draws',
    derrotas_oviedo: 'Oviedo Losses',
    colapsar_todas: 'Collapse all',
    expandir_todas: 'Expand all',
    mostrando_partidos: 'Showing:',
    partidos_contador: 'matches',
    no_resultados_filtros: 'No matches found with selected filters',

    // ============================================
    // GAMES
    // ============================================
    juegos_titulo: 'Games',
    juegos_subtitulo: 'Games and Entertainment Zone',
    juegos_disponibles: 'Available Games',

    // ============================================
    // VIDEOS
    // ============================================
    videos_titulo: 'Videos',
    videos_subtitulo: 'Match highlights and best moments of the season',
    videos_resumenes: 'Match Highlights',
    compartir_pagina: 'Share this page',
    compartir_whatsapp: 'Share on WhatsApp',
    compartir_twitter: 'Share on Twitter',
    compartir_telegram: 'Share on Telegram',
    compartir_facebook: 'Share on Facebook',

    // ============================================
    // FOOTER
    // ============================================
    footer_club: 'The Club',
    footer_equipos: 'Teams',
    footer_competiciones: 'Competitions',
    footer_contacto: 'Contact',
    footer_privacidad: 'Privacy Policy',
    footer_cookies: 'Cookie Policy',
    footer_legal: 'Legal Notice',
    derechos: 'All rights reserved.',

    // ============================================
    // POSITIONS
    // ============================================
    pos_portero: 'Goalkeeper',
    pos_lateral_derecho: 'Right Back',
    pos_lateral_izquierdo: 'Left Back',
    pos_central: 'Centre Back',
    pos_defensa: 'Defender',
    pos_mediocentro_defensivo: 'Defensive Midfielder',
    pos_centrocampista: 'Midfielder',
    pos_mediocentro: 'Central Midfielder',
    pos_mediapunta: 'Attacking Midfielder',
    pos_delantero_centro: 'Centre Forward',
    pos_extremo_derecho: 'Right Winger',
    pos_extremo_izquierdo: 'Left Winger',
    pos_delantero: 'Forward',
  },
};

// IMPORTANTE: El '|| 'es'' fuerza a que sea español si no hay nada guardado
let currentLang = localStorage.getItem('lang') || 'es';
window.currentLang = currentLang;

function t(key) {
  return translations[currentLang][key] || translations['es'][key] || key;
}

function translatePosition(positionName) {
  const key =
    'pos_' +
    positionName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ /g, '_');
  return t(key);
}

function setLanguage(lang) {
  currentLang = lang;
  window.currentLang = lang;
  localStorage.setItem('lang', lang);

  // Actualiza el botón activo
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Traduce los textos estáticos
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(key);
    } else {
      el.textContent = t(key);
    }
  });

  // Re-renderiza las partes dinámicas
  if (window.App) {
    App.renderSeasonSelector();
    App.renderEstadisticasEquipo();
    App.renderPlantillaCompleta();
    App.renderCuerpoTecnico();
    App.renderProximoPartido();
    App.renderNoticias();
    App.renderPlantillaHome(App.filtroHomeActivo || 'goalkeeper');
    if (typeof App.renderJuegos === 'function') {
      App.renderJuegos();
    }
    if (document.getElementById('fichaJugadorContent'))
      App.renderFichaJugador();
  }

  // Re-renderiza el calendario dinámico (calendario.html y widget home)
  if (typeof window.renderCalendario === 'function') {
    window.renderCalendario();
  }

  if (typeof window.actualizarJornadaBadge === 'function') {
    window.actualizarJornadaBadge();
  }

  if (typeof window.renderWidgetHome === 'function') {
    window.renderWidgetHome();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
});

window.t = t;
window.translatePosition = translatePosition;
window.setLanguage = setLanguage;

// ============================================
// TRADUCCIONES GEOGRÁFICAS (Diccionarios)
// ============================================

const geoTranslations = {
  countries: {
    es: {
      alemania: 'Alemania',
      angola: 'Angola',
      argentina: 'Argentina',
      costademarfil: 'Costa de Marfil',
      estadosunidos: 'Estados Unidos',
      francia: 'Francia',
      niger: 'Níger',
      portugal: 'Portugal',
      reinounido: 'Reino Unido',
      rumania: 'Rumanía',
      senegal: 'Senegal',
    },
    en: {
      alemania: 'Germany',
      angola: 'Angola',
      argentina: 'Argentina',
      costademarfil: 'Ivory Coast',
      estadosunidos: 'United States',
      francia: 'France',
      niger: 'Niger',
      portugal: 'Portugal',
      reinounido: 'United Kingdom',
      rumania: 'Romania',
      senegal: 'Senegal',
    },
  },

  cities: {
    es: {
      londres: 'Londres',
      nuevayork: 'Nueva York',
    },
    en: {
      londres: 'London',
      nuevayork: 'New York',
    },
  },

  provinces: {
    es: {
      asturias: 'Asturias',
      regiondelaltooeste: 'Región del Alto Oeste',
    },
    en: {
      asturias: 'Asturias',
      regiondelaltooeste: 'Upper West Region',
    },
  },

  nationalities: {
    es: {
      aleman: 'Alemán',
      alemana: 'Alemana',
      angoleno: 'Angoleño',
      angolena: 'Angoleña',
      argentino: 'Argentino',
      argentina: 'Argentina',
      britanico: 'Británico',
      britanica: 'Británica',
      costamarfileno: 'Costamarfileño',
      costamarfilena: 'Costamarfileña',
      espanol: 'Español',
      espanola: 'Española',
      estadounidense: 'Estadounidense',
      francesa: 'Francesa',
      frances: 'Francés',
      ghanes: 'Ghanés',
      ghanesa: 'Ghanesa',
      nigerino: 'Nigerino',
      nigerina: 'Nigerina',
      nigeriano: 'Nigeriano',
      nigeriana: 'Nigeriana',
      portuguesa: 'Portuguesa',
      portugués: 'Portugués',
      rumano: 'Rumano',
      rumana: 'Rumana',
      senegales: 'Senegalés',
      senegalesa: 'Senegalesa',
    },
    en: {
      aleman: 'German',
      alemana: 'German',
      angoleno: 'Angolan',
      angolena: 'Angolan',
      argentino: 'Argentine',
      argentina: 'Argentine',
      britanico: 'British',
      britanica: 'British',
      costamarfileno: 'Ivorian',
      costamarfilena: 'Ivorian',
      espanol: 'Spanish',
      espanola: 'Spanish',
      estadounidense: 'American',
      francesa: 'French',
      frances: 'French',
      ghanes: 'Ghanaian',
      ghanesa: 'Ghanaian',
      nigerino: 'Nigerien',
      nigerina: 'Nigerien',
      nigeriano: 'Nigerian',
      nigeriana: 'Nigerian',
      portuguesa: 'Portuguese',
      portugués: 'Portuguese',
      rumano: 'Romanian',
      rumana: 'Romanian',
      senegales: 'Senegalese',
      senegalesa: 'Senegalese',
    },
  },
};

// Exportar para usar en app.js
window.geoTranslations = geoTranslations;

// Exponer currentLang globalmente
window.currentLang = currentLang;
