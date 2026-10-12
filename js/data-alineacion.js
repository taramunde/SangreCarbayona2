/* ===================================
   DATA-ALINEACION.JS
   Datos del próximo partido para la página "Alineación":
   rival, fecha/hora, estadio y el once (cuando se sepa).
   Se actualiza partido a partido, a mano. Solo hay que tocar ESTE
   archivo — no hace falta abrir alineacion.js ni ningún otro.

   ===============================================================
   GUÍA PASO A PASO
   ===============================================================

   PASO 1 — Cuando se anuncia el próximo partido (aunque no haya
   once todavía):
     - equipoLocal / equipoVisitante: nombres EXACTOS tal cual están
       en el resto del proyecto (ej. "Real Oviedo", "S.D. Eibar").
     - competicion: "Segunda División", "Copa del Rey", etc.
     - jornada: número de jornada (o quita esta línea si es Copa).
     - estadio, fecha ("AAAA-MM-DD"), hora ("HH:MM").
     - golesLocal / golesVisitante: déjalos en "null" (sin jugar).
     - estado: pon "pendiente" — con esto, en la web sale el aviso
       de "Todavía no hay once" en vez de un campo vacío.
     - titulares: déjalo así -> []
     - suplentes: déjalo así -> []

   PASO 2 — Cuando haya una alineación probable o la oficial:
     - Cambia estado a "probable" (si es un once que se rumorea/
       filtra) o a "confirmada" (si ya lo ha dado el club).
     - Pon formacion con una de estas claves (según cómo jueguen):
         '442'  -> 4-4-2
         '433'  -> 4-3-3
         '343'  -> 3-4-3
         '451'  -> 4-5-1
         '4141' -> 4-1-4-1
         '4231' -> 4-2-3-1
     - Rellena "titulares" con un objeto por jugador: { slot: '...',
       jugadorId: '...' }. Los "slot" válidos según la formación que
       hayas puesto son (de portero a delantero):
         442  -> gk, def1, def2, def3, def4, mid1, mid2, mid3, mid4, fwd1, fwd2
         433  -> gk, def1, def2, def3, def4, mid1, mid2, mid3, fwd1, fwd2, fwd3
         343  -> gk, def1, def2, def3, mid1, mid2, mid3, mid4, fwd1, fwd2, fwd3
         451  -> gk, def1, def2, def3, def4, mid1, mid2, mid3, mid4, mid5, fwd1
         4141 -> gk, def1, def2, def3, def4, mid1, mid2, mid3, mid4, mid5, fwd1
         4231 -> gk, def1, def2, def3, def4, mid1, mid2, mid3, mid4, mid5, fwd1
       No hace falta que "def1" sea el lateral izquierdo ni nada por
       el estilo — el orden exacto dentro de la línea (def/mid/fwd)
       no importa, con que pongas a los 11 en SU línea (defensa,
       centrocampo o delantera) correcta, ya sale bien en el dibujo.

   PASO 3 — El jugadorId de cada futbolista:
     - Es el mismo id que usas en todo el proyecto (el de su ficha).
       Si no lo recuerdas, búscalo por su dorsal en la plantilla
       actual, dentro de js/data-temporada-actual.js (campo "dorsal"),
       y coge el "id" de esa misma entrada.
     - De ahí (y de js/data-jugadores.js) se cogen solos la foto, el
       nombre y el dorsal — no hace falta escribirlos aquí.

   PASO 4 — El capitán (opcional):
     - Si quieres que salga el brazalete, añade ", capitan: true" al
       objeto de ese jugador en "titulares". Ejemplo:
         { slot: 'def3', jugadorId: 'daniel-pedro-calvo-san-roman', capitan: true }

   PASO 5 — El banquillo (opcional):
     - "suplentes" es solo una lista de jugadorId, sin slot ni nada
       más: ['id-1', 'id-2', ...]. Si no quieres poner banquillo,
       déjalo en [].

   PASO 6 — Cuando termine el partido:
     - Rellena golesLocal y golesVisitante con el resultado final.
       (El "estado" y el once se pueden quedar como están, ya no
       hace falta tocarlos para este partido).

   PASO 7 — Para el siguiente partido:
     - Vuelve al PASO 1 y pisa todos los datos de arriba abajo
       (rival, fecha, estado "pendiente", titulares: [], etc.) — no
       hay que guardar un historial aquí, este archivo siempre
       refleja solo el próximo/último partido.
   =================================== */

/* global CLUB_DATA */

CLUB_DATA.alineacion = {
  estado: 'confirmada',

  competicion: 'Segunda División',
  jornada: 9,
  equipoLocal: 'Real Oviedo',
  equipoVisitante: 'S.D. Eibar',
  estadio: 'Carlos Tartiere',
  fecha: '2026-10-12',
  hora: '18:30',
  golesLocal: null,
  golesVisitante: null,

  formacion: '442',
  titulares: [
    { slot: 'gk', jugadorId: 'aaron-escandell-banacloche' },
    { slot: 'def1', jugadorId: 'samuel-rodriguez-de-la-riva' },
    { slot: 'def2', jugadorId: 'carlos-dominguez-caceres' },
    { slot: 'def3', jugadorId: 'daniel-pedro-calvo-san-roman', capitan: true },
    { slot: 'def4', jugadorId: 'david-jimenez-corredor' },
    { slot: 'mid1', jugadorId: 'alberto-reina-campos' },
    { slot: 'mid2', jugadorId: 'youness-lachhab' },
    { slot: 'mid3', jugadorId: 'aritz-aldasoro-sarriegi' },
    { slot: 'mid4', jugadorId: 'mikel-goti-lopez' },
    { slot: 'fwd1', jugadorId: 'victor-garcia-mingo' },
    { slot: 'fwd2', jugadorId: 'enzo-perez-miranda' },
  ],
  suplentes: [
    'miguel-de-jesus-narvaez-lopez',
    'samuel-franganillo-moreno',
    'aisar-ahmed-ahmed',
    'david-costas-cordal',
    'daniel-villahermosa-martinez',
    'jacobo-gonzalez-rodriganez',
    'pablo-saenz-ezquerra',
    'ignacio-vidal-miralles',
    'jose-luis-morales-nogales',
    'diego-menendez-secades',
    'marco-esteban-fernandez',
  ],
};
