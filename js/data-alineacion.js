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
  estado: 'pendiente',

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
  titulares: [],
  suplentes: [],
};
