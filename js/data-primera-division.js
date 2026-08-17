/* ===================================
   DATA-PRIMERA-DIVISION.JS
   Histórico de partidos de Primera División, temporada
   a temporada (jornadas, resultados y goleadores).

   Se mantiene en su propio archivo, separado de
   data-historico.js, porque va a crecer mucho a medida
   que se vayan añadiendo más temporadas y partidos.

   Solo lo necesita primera-division.html — cárgalo ahí
   después de data-historico.js y antes de primera-division.js.
   =================================== */

CLUB_DATA.primeraDivisionHistorico = {
  '2025-26': {
    nombre: '2025/26',
    competicion: 'LaLiga EA Sports',
    jornadas: [
      {
        numero: 1,
        fecha: '15-18 AGO',
        partidos: [
          {
            local: 'Real Oviedo',
            visitante: 'Sevilla FC',
            golesLocal: 2,
            golesVisitante: 1,
            estado: 'finalizado',
            escudoLocal: '',
            escudoVisitante: '',
            goleadores: [
              { jugador: 'Javi Martínez', minuto: "23'", equipo: 'local' },
              { jugador: 'En-Nesyri', minuto: "45'", equipo: 'visitante' },
              { jugador: 'Rubén Cano', minuto: "78'", equipo: 'local' },
            ],
          },
          {
            local: 'FC Barcelona',
            visitante: 'Valencia CF',
            golesLocal: 3,
            golesVisitante: 0,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Lewandowski', minuto: "12'", equipo: 'local' },
              { jugador: 'Lamine Yamal', minuto: "34'", equipo: 'local' },
            ],
          },
          {
            local: 'Real Madrid',
            visitante: 'Atlético de Madrid',
            golesLocal: 1,
            golesVisitante: 1,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Bellingham', minuto: "56'", equipo: 'local' },
              { jugador: 'Griezmann', minuto: "72'", equipo: 'visitante' },
            ],
          },
        ],
      },
      {
        numero: 2,
        fecha: '22-25 AGO',
        partidos: [
          {
            local: 'Real Madrid',
            visitante: 'Real Oviedo',
            golesLocal: 1,
            golesVisitante: 1,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Bellingham', minuto: "56'", equipo: 'local' },
              { jugador: 'Aarón', minuto: "89'", equipo: 'visitante' },
            ],
          },
          {
            local: 'Sevilla FC',
            visitante: 'FC Barcelona',
            golesLocal: 0,
            golesVisitante: 2,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Pedri', minuto: "23'", equipo: 'visitante' },
              { jugador: 'Raphinha', minuto: "67'", equipo: 'visitante' },
            ],
          },
        ],
      },
      {
        numero: 3,
        fecha: '29 AGO - 01 SEP',
        partidos: [
          {
            local: 'Real Oviedo',
            visitante: 'Girona FC',
            golesLocal: 3,
            golesVisitante: 2,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Javi Martínez', minuto: "12'", equipo: 'local' },
              { jugador: 'Javi Martínez', minuto: "45'", equipo: 'local' },
              { jugador: 'Stuani', minuto: "56'", equipo: 'visitante' },
              { jugador: 'Stuani', minuto: "78'", equipo: 'visitante' },
              { jugador: 'Luis García', minuto: "90'", equipo: 'local' },
            ],
          },
        ],
      },
    ],
  },
  '2001-02': {
    nombre: '2001/02',
    competicion: 'La Liga',
    jornadas: [
      {
        numero: 1,
        fecha: '25-27 AGO 2001',
        partidos: [
          {
            local: 'Real Oviedo',
            visitante: 'R.C. Celta de Vigo',
            golesLocal: 1,
            golesVisitante: 2,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Oli', minuto: "34'", equipo: 'local' },
              { jugador: 'Mostovoi', minuto: "12'", equipo: 'visitante' },
              { jugador: 'Karpin', minuto: "78'", equipo: 'visitante' },
            ],
          },
        ],
      },
    ],
  },
};
