/* ===================================
   DATA-GOLES-PROPIA.JS
   Goles en propia puerta de jugadores RIVALES que subieron al marcador
   del Real Oviedo.

   Para qué sirve: esos goles no son de ningún jugador del Oviedo, así
   que no aparecen en el "partidos[]" de nadie y el partido se quedaba
   sin autor del gol (p. ej. el 0-1 en El Molinón de 2022). Con esta
   lista, el nombre sale en todos los sitios donde se ven goleadores:
     - páginas de cada partido (partidos/...html) — hay que regenerar
       con `npm run subir` (o `npm run generar`),
     - buscador (buscador.html),
     - chat "Pregúntale al Carbayón".
   NO cuentan para los rankings de goleadores del Oviedo ni para las
   estadísticas de ningún jugador.

   CÓMO AÑADIR UNO — un objeto por gol (o por jugador, con "goles: 2"
   si marcó dos en propia en el mismo partido):
     {
       fecha: 'AAAA-MM-DD',          // la del partido, igual que en los datos
       jugador: 'Berrocal',          // como se le conoce (apodo)
       equipo: 'Real Sporting de Gijón', // su equipo (opcional, informativo)
       minuto: 30,                   // opcional
       goles: 1,                     // opcional, por defecto 1
       fuente: 'https://...',        // opcional: dónde se comprobó
     },
   El Oviedo no juega dos partidos el mismo día, así que la fecha basta
   para saber de qué partido es. Si la fecha no coincide con ningún
   partido, el generador lo avisa con un ⚠ al regenerar.
   =================================== */

/* global CLUB_DATA */

CLUB_DATA.golesEnPropia = [
  // ── 2010/11 ───────────────────────────────────────────────
  {
    fecha: '2010-10-10',
    jugador: 'Txitxo',
    equipo: 'Peña Sport F.C.',
    fuente: 'https://realoviedo.info/10-11.html',
  },
  {
    fecha: '2011-05-15',
    jugador: 'M. Landeira',
    equipo: 'Real Unión Club',
    fuente: 'https://realoviedo.info/10-11.html',
  },

  // ── 2011/12 ───────────────────────────────────────────────
  {
    fecha: '2011-08-21',
    jugador: 'Azcárate',
    equipo: 'C.D. Leganés',
    fuente: 'https://realoviedo.info/11-12.html',
  },
  {
    fecha: '2012-01-29',
    jugador: 'Héctor',
    equipo: 'R.C. Celta de Vigo B',
    fuente: 'https://realoviedo.info/11-12.html',
  },

  // ── 2013/14 ───────────────────────────────────────────────
  {
    fecha: '2013-10-06',
    jugador: 'Espolita',
    equipo: 'Club Marino de Luanco',
    fuente: 'https://realoviedo.info/13-14.html',
  },

  // ── 2014/15 ───────────────────────────────────────────────
  {
    fecha: '2014-10-19',
    jugador: 'Soto',
    equipo: 'R.C. Celta de Vigo B',
    fuente: 'https://realoviedo.info/14-15.html',
  },
  {
    fecha: '2015-04-26',
    jugador: 'Conde',
    equipo: 'C.D. Tropezón',
    fuente: 'https://realoviedo.info/14-15.html',
  },

  // ── 2015/16 ───────────────────────────────────────────────
  {
    fecha: '2015-12-13',
    jugador: 'Gaffoor',
    equipo: 'C.D. Mirandés',
    fuente: 'https://realoviedo.info/15-16.html',
  },
  {
    fecha: '2016-01-03',
    jugador: 'Insúa',
    equipo: 'C.D. Leganés',
    fuente: 'https://realoviedo.info/15-16.html',
  },
  {
    fecha: '2016-02-28',
    jugador: 'José Ángel',
    equipo: 'Elche C.F.',
    minuto: 86,
    fuente: 'https://www.laliga.com/en-GB/match/temporada-2015-2016-laliga-1-2-3-real-oviedo-elche-c-f-27',
  },

  // ── 2016/17 ───────────────────────────────────────────────
  {
    fecha: '2016-10-02',
    jugador: 'Callens',
    equipo: 'C.D. Numancia',
    fuente: 'https://fbref.com/en/matches/5a55f3ff/Oviedo-Numancia-October-2-2016-Segunda-Division',
  },

  // ── 2017/18 ───────────────────────────────────────────────
  {
    fecha: '2017-10-22',
    jugador: 'Sergi Guardiola',
    equipo: 'Córdoba C.F.',
    minuto: 59,
    fuente: 'https://www.laliga.com/en-GB/match/temporada-2017-2018-laliga-1-2-3-real-oviedo-cordoba-cf-11',
  },
  {
    // Sí: el mismo Dani Calvo que luego fue capitán del Oviedo.
    fecha: '2017-11-25',
    jugador: 'Dani Calvo',
    equipo: 'C.D. Numancia',
    minuto: 57,
    fuente: 'https://www.laliga.com/partido/temporada-2017-2018-laliga-1-2-3-real-oviedo-cd-numancia-16',
  },

  // ── 2018/19 ───────────────────────────────────────────────
  {
    fecha: '2018-10-20',
    jugador: 'Unai García',
    equipo: 'C.A. Osasuna',
    minuto: 62,
    fuente: 'https://www.laliga.com/partido/temporada-2018-2019-laliga-1-2-3-real-oviedo-c-a-osasuna-10',
  },

  // ── 2019/20 ───────────────────────────────────────────────
  {
    fecha: '2019-08-18',
    jugador: 'Somma',
    equipo: 'R.C. Deportivo de La Coruña',
    minuto: 69,
    fuente:
      'https://www.worldfootball.net/report/segunda-division-2019-2020-deportivo-la-coruna-real-oviedo/liveticker/',
  },

  // ── 2020/21 ───────────────────────────────────────────────
  {
    fecha: '2020-10-28',
    jugador: 'Bobadilla',
    equipo: 'U.D. Logroñés',
    fuente: 'https://aws.fbref.com/en/matches/09f4d761/Oviedo-UD-Logrones-October-28-2020-Segunda-Division',
  },
  {
    fecha: '2021-02-22',
    jugador: 'Rubén Pulido',
    equipo: 'C.F. Fuenlabrada',
    fuente: 'https://www.fbref.com/en/matches/32f7b5c6/Fuenlabrada-Oviedo-February-22-2021-Segunda-Division',
  },

  // ── 2021/22 ───────────────────────────────────────────────
  {
    fecha: '2021-09-12',
    jugador: 'David Andújar',
    equipo: 'F.C. Cartagena',
    minuto: 57,
    fuente: 'https://www.laliga.com/en-GB/match/temporada-2021-2022-laliga-smartbank-real-oviedo-fc-cartagena-5',
  },
  {
    fecha: '2022-01-29',
    jugador: 'Babić',
    equipo: 'U.D. Almería',
    fuente: 'https://www.udalmeriasad.com/en/news/2-0-roll-on-the-month-of-february',
  },
  {
    fecha: '2022-04-16',
    jugador: 'Berrocal',
    equipo: 'Real Sporting de Gijón',
  },

  // ── 2022/23 ───────────────────────────────────────────────
  {
    fecha: '2023-05-27',
    jugador: 'Sergio Postigo',
    equipo: 'Levante U.D.',
    minuto: 59,
    fuente: 'https://www.worldfootball.net/report/segunda-division-2022-2023-levante-ud-real-oviedo/liveticker/',
  },

  // ── 2024/25 ───────────────────────────────────────────────
  {
    fecha: '2025-03-30',
    jugador: 'Manu Molina',
    equipo: 'Málaga C.F.',
    minuto: 93,
    fuente: 'https://www.malagacf.com/en/matches/season-2024-2025-laliga-hypermotion-33-real-oviedo-vs-malaga-cf',
  },
  {
    fecha: '2025-04-26',
    jugador: 'Ignasi Miquel',
    equipo: 'Levante U.D.',
    minuto: 27,
    fuente: 'https://www.laliga.com/partido/temporada-2024-2025-laliga-hypermotion-real-oviedo-levante-ud-37',
  },
];
