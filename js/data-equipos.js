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

   Cuando un MISMO nombre ha sido de clubes distintos según la época
   (caso Real Avilés), el otro nombre se escribe con su periodo, usando
   ids de temporada como los de los datos ('1982-83'):
       { nombre: 'Real Avilés C.F.', desde: '2012-13', hasta: '2019-20' }
   "desde" y "hasta" son opcionales (sin "desde" = desde siempre; sin
   "hasta" = hasta hoy).

   Campos opcionales del club:
   - desaparecido: true → el club ya no existe; en sus partidos no se
     pone "hoy ..." debajo del nombre.
   - nota: 'texto' → se muestra en la página de historial del rival
     (apartado "Sobre el club").
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
  // ── Real Avilés ─────────────────────────────────────────────
  // Son DOS clubes a efectos de historial, y el nombre "Real Avilés
  // C.F." corresponde a uno u otro según la temporada:
  //  - Hasta 1982-83: el Real Avilés C.F. original (de 1903).
  //  - Desde 1983-84: el Real Avilés Industrial C.F. (constituido el
  //    10 de mayo de 1983 tras la unión con el C.D. Ensidesa), que
  //    entre 2012 y 2020 se llamó Real Avilés C.F., S.A.D.
  // Fuente: La Futbolteca.
  // Si algún día prefieres tratarlos como un único club, borra el
  // segundo bloque y quita "desde"/"hasta" del primero.
  {
    nombre: 'Real Avilés Industrial C.F.',
    nota: 'Constituido el 10 de mayo de 1983 tras la unión del Real Avilés C.F. con el C.D. Ensidesa. Entre 2012 y 2020 se llamó Real Avilés C.F., S.A.D. El club reivindica 1903 como año de fundación, el del Avilés original.',
    otrosNombres: [
      { nombre: 'Real Avilés C.F.', desde: '2012-13', hasta: '2019-20' },
    ],
  },
  {
    nombre: 'Real Avilés C.F. (1903-1983)',
    desaparecido: true,
    nota: 'El Real Avilés original, fundado en 1903 (Sport Club Avilesino) y llamado Real Avilés C.F. desde 1940. En 1983 se unió al C.D. Ensidesa para formar el actual Real Avilés Industrial C.F.',
    otrosNombres: [
      { nombre: 'Real Avilés C.F.', hasta: '1982-83' },
      'Stadium Club Avilesino',
      'Real Stadium Club Avilesino',
    ],
  },
  {
    nombre: 'Real Madrid',
    otrosNombres: ['Madrid F.C.', 'Real Madrid C.F.'],
  },
];
