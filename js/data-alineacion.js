/* ===================================
   DATA-ALINEACION.JS
   Datos del próximo partido para la página "Alineación":
   rival, fecha/hora, estadio y el once (cuando se sepa).
   Se actualiza partido a partido, a mano.

   CÓMO RELLENARLO
   ----------------
   estado:
     'pendiente'  -> todavía no hay once, se muestra un aviso en vez de
                     un campo con huecos en blanco.
     'probable'   -> once probable/filtrado, no es oficial todavía.
     'confirmada' -> once oficial, ya la ha dado el club.

   formacion: una de estas claves -> '442', '433', '451', '4141', '4231', '343'

   titulares: un objeto por jugador, con:
     slot      -> posición en el campo (ver claves en js/alineacion.js,
                  function FORMACIONES)
     jugadorId -> el id tal cual aparece en CLUB_DATA.jugadoresMaestro
                  (js/data-jugadores.js) — de ahí se coge la foto y el
                  nombre automáticamente, no hace falta repetirlos aquí.

   suplentes: array simple de jugadorId (opcional).
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
