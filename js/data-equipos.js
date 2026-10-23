/* ===================================
   DATA-EQUIPOS.JS
   Clubes que han jugado con MÁS DE UN NOMBRE a lo largo de su
   historia (cambios de denominación, prohibiciones de nombres
   extranjeros, fusiones con el mismo club detrás, etc.).

   Para qué sirve:
   - En cada partido se sigue mostrando el nombre que tenía el club
     EN ESA ÉPOCA (tal y como está escrito en los datos del partido).
   - Pero la página de historial contra ese rival
     (/partidos/rival-...html) junta todos sus partidos bajo el nombre
     ACTUAL, e indica con qué nombres se jugó y en qué temporadas.

   Cómo añadir un club:
     {
       nombre: 'Nombre actual, escrito igual que en los partidos',
       otrosNombres: ['Nombre antiguo 1', 'Nombre antiguo 2'],
     },

   - No importan mayúsculas, tildes, puntos ni espacios:
     "R.C.D. Español" y "RCD Espanol" se consideran el mismo nombre.
   - Los filiales son equipos distintos: "Real Sporting de Gijón B"
     NO se junta con el primer equipo.
   - Lo usa generador/generar-partidos.js al generar las páginas
     (`npm run generar` / `npm run subir`). No hace falta cargarlo en
     ninguna página HTML.

   Los nombres de abajo son un punto de partida: revisa que sean
   correctos y añade los que vayas necesitando según metas temporadas
   antiguas.
   =================================== */

CLUB_DATA.equiposHistoricos = [
  {
    nombre: 'Real Sporting de Gijón',
    otrosNombres: ['Real Gijón', 'Sporting de Gijón', 'Sporting Gijonés'],
  },
  {
    nombre: 'R.C.D. Espanyol',
    otrosNombres: ['R.C.D. Español', 'Real Club Deportivo Español'],
  },
  {
    nombre: 'Athletic Club',
    otrosNombres: ['Atlético de Bilbao', 'Athletic de Bilbao'],
  },
  {
    nombre: 'Atlético de Madrid',
    otrosNombres: ['Atlético Aviación', 'Athletic de Madrid'],
  },
  {
    nombre: 'Real Madrid',
    otrosNombres: ['Madrid F.C.', 'Real Madrid C.F.'],
  },
];
