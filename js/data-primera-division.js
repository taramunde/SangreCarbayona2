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
        fecha: '15-19 AGO',
        partidos: [
          {
            local: 'Girona F.C.',
            visitante: 'Rayo Vallecano',
            golesLocal: 1,
            golesVisitante: 3,
            estado: 'finalizado',
            escudoLocal: '',
            escudoVisitante: '',
            goleadores: [
              { jugador: 'De Frutos', minuto: "18'", equipo: 'visitante' },
              { jugador: 'Álvaro García', minuto: "20'", equipo: 'visitante' },
              { jugador: 'Isi', minuto: "45'", equipo: 'visitante', tipo: 'penalti' },
              { jugador: 'Joel Roca', minuto: "57'", equipo: 'local' },
            ],
          },
          {
            local: 'Villarreal C.F.',
            visitante: 'Real Oviedo',
            golesLocal: 2,
            golesVisitante: 0,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Etta Eyong', minuto: "29'", equipo: 'local' },
              { jugador: 'Gueye', minuto: "36'", equipo: 'local' },
            ],
          },
          {
            local: 'R.C.D. Mallorca',
            visitante: 'F.C. Barcelona',
            golesLocal: 0,
            golesVisitante: 3,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Rapinha', minuto: "7'", equipo: 'visitante' },
              { jugador: 'Ferran Torres', minuto: "23'", equipo: 'visitante' },
              { jugador: 'Lamine Yamal', minuto: "90'", equipo: 'visitante' },
            ],
          },
          {
            local: 'Deportivo Alavés',
            visitante: 'Levante U.D.',
            golesLocal: 2,
            golesVisitante: 1,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Toni Martínez', minuto: "36'", equipo: 'local' },
              { jugador: 'Toljan', minuto: "68'", equipo: 'visitante' },
              { jugador: 'Tenaglia', minuto: "90'", equipo: 'local' },
            ],
          },
          {
            local: 'Valencia C.F.',
            visitante: 'Real Sociedad',
            golesLocal: 1,
            golesVisitante: 1,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Diego López', minuto: "57'", equipo: 'local' },
              { jugador: 'Take Kubo', minuto: "60'", equipo: 'visitante' },
            ],
          },
          {
            local: 'R.C. Celta de Vigo',
            visitante: 'Getafe C.F.',
            golesLocal: 0,
            golesVisitante: 2,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Adrián Liso', minuto: "47'", equipo: 'visitante' },
              { jugador: 'Uche', minuto: "72'", equipo: 'visitante' },
            ],
          },
          {
            local: 'Athletic Club',
            visitante: 'Sevilla F.C.',
            golesLocal: 3,
            golesVisitante: 2,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Nico Williams', minuto: "36'", equipo: 'local' },
              { jugador: 'Maroan', minuto: "43'", equipo: 'local' },
              { jugador: 'Lukebakio', minuto: "60'", equipo: 'visitante' },
              { jugador: 'Agoumé', minuto: "72'", equipo: 'visitante' },
              { jugador: 'Robert Navarro', minuto: "81'", equipo: 'local' },
            ],
          },
          {
            local: 'R.C.D. Espanyol',
            visitante: 'Atlético de Madrid',
            golesLocal: 2,
            golesVisitante: 1,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Julián Álvarez', minuto: "37'", equipo: 'visitante' },
              { jugador: 'Miguel Rubio', minuto: "73'", equipo: 'local' },
              { jugador: 'Pere Milla', minuto: "84'", equipo: 'local' },
            ],
          },
          {
            local: 'Elche C.F.',
            visitante: 'Real Betis',
            golesLocal: 1,
            golesVisitante: 1,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Aitor Ruibal', minuto: "21'", equipo: 'visitante' },
              { jugador: 'Germán Valera', minuto: "81'", equipo: 'local' },
            ],
          },
          {
            local: 'Real Madrid',
            visitante: 'C.A. Osasuna',
            golesLocal: 1,
            golesVisitante: 0,
            estado: 'finalizado',
            goleadores: [{ jugador: 'Mbappé', minuto: "51'", equipo: 'local' }],
          },
        ],
      },
      {
        numero: 2,
        fecha: '22-25 AGO',
        partidos: [
          {
            local: 'Real Betis',
            visitante: 'Deportivo Alavés',
            golesLocal: 1,
            golesVisitante: 0,
            estado: 'finalizado',
            goleadores: [{ jugador: 'Lo Celso', minuto: "16'", equipo: 'local' }],
          },
          {
            local: 'R.C.D. Mallorca',
            visitante: 'R.C. Celta de Vigo',
            golesLocal: 1,
            golesVisitante: 1,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Javi Rueda', minuto: "38'", equipo: 'visitante' },
              { jugador: 'Mateu Morey', minuto: "87'", equipo: 'local' },
            ],
          },
          {
            local: 'Atlético de Madrid',
            visitante: 'Elche C.F.',
            golesLocal: 1,
            golesVisitante: 1,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Sorloth', minuto: "8'", equipo: 'local' },
              { jugador: 'Rafa Mir', minuto: "15'", equipo: 'visitante' },
            ],
          },
          {
            local: 'Levante U.D.',
            visitante: 'F.C. Barcelona',
            golesLocal: 2,
            golesVisitante: 3,
            estado: 'finalizado',
            goleadores: [
              { jugador: 'Iván Romero', minuto: "15'", equipo: 'local' },
              { jugador: 'Morales', minuto: "45'", equipo: 'local', tipo: 'penalti' },
              { jugador: 'Pedri', minuto: "49'", equipo: 'visitante' },
              { jugador: 'Ferran Torres', minuto: "52'", equipo: 'visitante' },
              { jugador: 'Elguezábal', minuto: "90'", equipo: 'visitante', tipo: 'propia' },
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
