/* ===================================
   DATA-ALINEACION.JS
   El once (cuando se sepa) para la página "Alineación".

   Los datos del PARTIDO (rival, competición, jornada/ronda, fecha,
   hora, estadio, resultado) ya NO se ponen aquí: se cogen solos, en
   vivo, del "próximo partido" real que calculan js/clasificacion.js +
   js/calendario.js (el mismo que usa el widget de la portada). En
   cuanto se mete el resultado de un partido ahí y el "próximo
   partido" pasa a ser otro rival, esta página lo nota sola.

   Aquí solo se escribe el ONCE, y a qué partido corresponde (para que
   la página sepa si lo que hay aquí abajo es de ESTE partido o se ha
   quedado desactualizado de uno anterior).

   ===============================================================
   GUÍA PASO A PASO
   ===============================================================

   PASO 1 — En cuanto cambie el "próximo partido" (nuevo rival), esta
   página pasa SOLA a mostrar "Todavía no hay once": no hay que tocar
   nada aquí todavía. Solo cuando se sepa o se filtre el once de ESE
   partido nuevo, sigue con el paso 2.

   PASO 2 — Para meter el once de ese partido:
     - paraFecha: la fecha ("AAAA-MM-DD") de ese partido, EXACTAMENTE
       como aparece en el widget de "Próximo partido" de la portada o
       en el Calendario. Es la clave que usa la página para saber que
       este once es de ese partido y no de uno ya jugado — si no
       coincide con el próximo partido real, se ignora todo lo demás
       de este archivo y se muestra "sin confirmar" igualmente.
     - estado: "probable" (si es un once que se rumorea/filtra) o
       "confirmada" (si ya lo ha dado el club).
     - formacion, con una de estas claves (según cómo jueguen):
         '442'  -> 4-4-2
         '433'  -> 4-3-3
         '343'  -> 3-4-3
         '451'  -> 4-5-1
         '4141' -> 4-1-4-1
         '4231' -> 4-2-3-1
     - "titulares": un objeto por jugador, { slot: '...', jugadorId:
       '...' }. Los "slot" válidos según la formación elegida (de
       portero a delantero):
         442  -> gk, def1, def2, def3, def4, mid1, mid2, mid3, mid4, fwd1, fwd2
         433  -> gk, def1, def2, def3, def4, mid1, mid2, mid3, fwd1, fwd2, fwd3
         343  -> gk, def1, def2, def3, mid1, mid2, mid3, mid4, fwd1, fwd2, fwd3
         451  -> gk, def1, def2, def3, def4, mid1, mid2, mid3, mid4, mid5, fwd1
         4141 -> gk, def1, def2, def3, def4, mid1, mid2, mid3, mid4, mid5, fwd1
         4231 -> gk, def1, def2, def3, def4, mid1, mid2, mid3, mid4, mid5, fwd1
       No hace falta que "def1" sea el lateral izquierdo ni nada por
       el estilo — con que cada jugador esté en SU línea (defensa,
       centrocampo o delantera) correcta, ya sale bien en el dibujo.

   PASO 3 — El jugadorId de cada futbolista:
     - Es el mismo id que usas en todo el proyecto (el de su ficha).
       Si no lo recuerdas, búscalo por su dorsal en la plantilla
       actual, dentro de js/data-temporada-actual.js (campo "dorsal"),
       y coge el "id" de esa misma entrada.
     - De ahí (y de js/data-jugadores.js) se cogen solos la foto, el
       nombre y el dorsal — no hace falta escribirlos aquí.

   PASO 4 — El capitán (opcional):
     - Añade ", capitan: true" al objeto de ese jugador en
       "titulares". Ejemplo:
         { slot: 'def3', jugadorId: 'daniel-pedro-calvo-san-roman', capitan: true }

   PASO 5 — El banquillo (opcional):
     - "suplentes" es solo una lista de jugadorId, sin slot ni nada
       más: ['id-1', 'id-2', ...]. Si no quieres ponerlo, déjalo en [].

   PASO 6 — Para el siguiente partido:
     - No hace falta hacer nada especial: en cuanto se juegue este
       partido y se entre el resultado en clasificacion.js, el
       "próximo partido" cambia de rival solo, "paraFecha" deja de
       coincidir, y la página vuelve a "sin confirmar" automáticamente
       — tú solo tienes que escribir el once nuevo (paso 2) cuando lo
       sepas, con la fecha nueva en "paraFecha".
   =================================== */

/* global CLUB_DATA */

CLUB_DATA.alineacion = {
  paraFecha: '2026-10-18',

  estado: 'confirmada',
  formacion: '442',
  titulares: [
    { slot: 'gk', jugadorId: 'aaron-escandell-banacloche' },
    { slot: 'def1', jugadorId: 'samuel-rodriguez-de-la-riva' },
    { slot: 'def2', jugadorId: 'carlos-dominguez-caceres' },
    { slot: 'def3', jugadorId: 'daniel-pedro-calvo-san-roman' },
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
    'david-costas-cordal',
    'daniel-villahermosa-martinez',
    'jacobo-gonzalez-rodriganez',
    'brandon-jose-domingues',
    'pablo-saenz-ezquerra',
    'ignacio-vidal-miralles',
    'jose-luis-morales-nogales',
    'diego-menendez-secades',
    'marco-esteban-fernandez',
  ],
};
