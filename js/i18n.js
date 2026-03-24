/* ===================================
   SISTEMA DE TRADUCCIÓN (i18n)
   =================================== */

const translations = {
    es: {
        // Navegación
        nav_inicio: "Inicio", nav_club: "Club", nav_equipo: "Equipo", nav_competiciones: "Competiciones", nav_noticias: "Noticias", nav_multimedia: "Multimedia",
        nav_historia: "Historia", nav_palmares: "Palmarés", nav_estadio: "Estadio Municipal", nav_directiva: "Directiva",
        nav_primer_equipo: "1ª Equip.", nav_cuerpo_tecnico: "Cuerpo Técnico", nav_cantera: "Cantera", nav_fem: "Fútbol Femenino",
        nav_primera_rfef: "Primera RFEF", nav_calendario: "Calendario", nav_clasificacion: "Clasificacion", nav_fundacion: "Fundación",
        nav_juegos: "Juegos", 
        nav_videos: "Vídeos",
        // General
        buscar: "Buscar en la web...", ver_todas: "Ver todas", ver_clasificacion: "Ver clasificación completa", calendario_completo: "Calendario completo", ver_plantilla: "Ver plantilla completa", grupo: "Grupo I", current_badge: "Actual",
        // Index
        ultimas_noticias: "Últimas Noticias", clasificacion: "Clasificación", calendario: "Calendario", plantilla: "Plantilla", patrocinadores: "Patrocinadores",
        // Equipo
        equipo_titulo: "Primer Equipo", equipo_subtitulo: "Temporada", posicion: "Posición", victorias: "Victorias", empates: "Empates", derrotas: "Derrotas", goles_favor: "Goles Favor", goles_contra: "Goles Contra",
        // Plantilla
        porteros: "Porteros", defensas: "Defensas", centrocampistas: "Centrocampistas", delanteros: "Delanteros",
        partidos: "Partidos", goles: "Goles", edad: "años", ver_ficha: "Ver ficha", todos: "Todos",
        // Ficha
        temporada: "Temporada", asistencias: "Asistencias", minutos: "Minutos", altura: "Altura", peso: "Peso", pie: "Pie",
        rendimiento: "Resumen", informacion: "Información Personal", nacimiento: "Nacimiento", lugar: "Lugar", nacionalidad: "Nacionalidad",
        en_club_desde: "En el club desde", disciplina: "Disciplina Temporada", amarillas: "Amarillas", rojas: "Rojas",
        historial: "Trayectoria", totales: "Totales en el Club", logros: "Logros", fallecimiento: "Fallecimiento",
        // Selección
        seleccion: "Selección Nacional",
        // Extras
        desconocida: "Desconocida", fecha_desconocida: "Fecha desconocida", goles_partido: "Goles por partido", minutos_partido: "Minutos por partido", jornada: "Jornada",
        // Footer
        footer_club: "El Club", footer_equipos: "Equipos", footer_competiciones: "Competiciones", footer_contacto: "Contacto", footer_privacidad: "Política de privacidad", footer_cookies: "Política de cookies", footer_legal: "Aviso legal", derechos: "Todos los derechos reservados.",
        // Posiciones
        pos_portero: "Portero", pos_lateral_derecho: "Lateral Derecho", pos_lateral_izquierdo: "Lateral Izquierdo", pos_central: "Central", pos_mediocentro_defensivo: "Mediocentro Defensivo", pos_centrocampista: "Centrocampista", pos_mediacentro: "Mediocentro", pos_mediapunta: "Mediapunta", pos_delantero_centro: "Delantero Centro", pos_extremo_derecho: "Extremo Derecho", pos_extremo_izquierdo: "Extremo Izquierdo", pos_delantero: "Delantero"
    },
    en: {
        // Navigation
        nav_inicio: "Home", nav_club: "Club", nav_equipo: "Team", nav_competiciones: "Competitions", nav_noticias: "News", nav_multimedia: "Multimedia",
        nav_historia: "History", nav_palmares: "Honours", nav_estadio: "Municipal Stadium", nav_directiva: "Board",
        nav_primer_equipo: "1st Team", nav_cuerpo_tecnico: "Technical Staff", nav_cantera: "Academy", nav_fem: "Women's Football",
        nav_primera_rfef: "Primera RFEF", nav_calendario: "Calendar", nav_clasificacion: "Standings", nav_fundacion: "Foundation",
        nav_juegos: "Games",
        nav_videos: "Videos",
        // General
        buscar: "Search...", ver_todas: "View all", ver_clasificacion: "View full standings", calendario_completo: "Full calendar", ver_plantilla: "View full squad", grupo: "Group I", current_badge: "Current",
        // Index
        ultimas_noticias: "Latest News", clasificacion: "Standings", calendario: "Calendar", plantilla: "Squad", patrocinadores: "Sponsors",
        // Team
        equipo_titulo: "First Team", equipo_subtitulo: "Season", posicion: "Position", victorias: "Wins", empates: "Draws", derrotas: "Losses", goles_favor: "Goals For", goles_contra: "Goals Against",
        // Squad
        porteros: "Goalkeepers", defensas: "Defenders", centrocampistas: "Midfielders", delanteros: "Forwards",
        partidos: "Matches", goles: "Goals", edad: "years old", ver_ficha: "View profile", todos: "All",
        // Profile
        temporada: "Season", asistencias: "Assists", minutos: "Minutes", altura: "Height", peso: "Weight", pie: "Foot",
        rendimiento: "Overview", informacion: "Personal Info", nacimiento: "Birthdate", lugar: "Birthplace", nacionalidad: "Nationality",
        en_club_desde: "At club since", disciplina: "Discipline", amarillas: "Yellow Cards", rojas: "Red Cards",
        historial: "Career", totales: "Club Totals", logros: "Achievements", fallecimiento: "Passed away",
        // National Team
        seleccion: "National Team",
        // Extras
        desconocida: "Unknown", fecha_desconocida: "Date unknown", goles_partido: "Goals per game", minutos_partido: "Minutes per game", jornada: "Matchday",
        // Footer
        footer_club: "The Club", footer_equipos: "Teams", footer_competiciones: "Competitions", footer_contacto: "Contact", footer_privacidad: "Privacy Policy", footer_cookies: "Cookie Policy", footer_legal: "Legal Notice", derechos: "All rights reserved.",
        // Positions
        pos_portero: "Goalkeeper", pos_lateral_derecho: "Right Back", pos_lateral_izquierdo: "Left Back", pos_central: "Centre Back", pos_mediocentro_defensivo: "Defensive Midfielder", pos_centrocampista: "Midfielder", pos_mediacentro: "Central Midfielder", pos_mediapunta: "Attacking Midfielder", pos_delantero_centro: "Centre Forward", pos_extremo_derecho: "Right Winger", pos_extremo_izquierdo: "Left Winger", pos_delantero: "Forward"
    }
};

// IMPORTANTE: El '|| 'es'' fuerza a que sea español si no hay nada guardado
let currentLang = localStorage.getItem('lang') || 'es';

function t(key) { return translations[currentLang][key] || translations['es'][key] || key; }

function translatePosition(positionName) {
    const key = 'pos_' + positionName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "_");
    return t(key);
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    // Actualiza el botón activo
    document.querySelectorAll('.lang-btn').forEach(btn => { 
        btn.classList.toggle('active', btn.dataset.lang === lang); 
    });
    
    // Traduce los textos estáticos
    document.querySelectorAll('[data-i18n]').forEach(el => {
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
        App.renderPlantillaHome(); 
        // Añadimos renderJuegos si existe
        if (typeof App.renderJuegos === 'function') {
            App.renderJuegos();
        }
        
        if (document.getElementById('fichaJugadorContent')) App.renderFichaJugador();
    }
}

document.addEventListener('DOMContentLoaded', () => { setLanguage(currentLang); });

window.t = t;
window.translatePosition = translatePosition;
window.setLanguage = setLanguage;
