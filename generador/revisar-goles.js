/* ===================================
   REVISAR-GOLES.JS — `npm run revisar-goles`

   Lista los partidos en los que el Real Oviedo marcó MÁS goles de los
   que tienen apuntados sus jugadores (sin contar porteros, cuyo "goles"
   son los encajados) más los goles en propia puerta de rivales de
   js/data-goles-propia.js.

   Cada partido de la lista tiene un gol "sin autor". Casi siempre es:
     a) un gol en propia puerta de un rival → se apunta en
        js/data-goles-propia.js (ver LEEME.md, sección 20), o
     b) un gol de un jugador del Oviedo que falta en su partidos[] → se
        corrige el campo "goles" de ese jugador en ese partido.

   Para saber cuál de las dos es, en realoviedo.info (página de la
   temporada, p. ej. https://realoviedo.info/14-15.html) los goles en
   propia salen como "Fulano (en p.p.)" en la línea del partido y, al
   final de la página, en "goles p.p.: ...".

   Uso:
     npm run revisar-goles            → todas las temporadas
     npm run revisar-goles 2009-10    → solo esa temporada

   No cambia nada: solo lee los datos y muestra la lista.
   =================================== */

const PC = require('./partidos-comun');

const soloTemporada = process.argv[2] || null;
const CLUB_DATA = PC.cargarClubData();
const { partidos } = PC.construirPartidos(CLUB_DATA);

const pendientes = partidos.filter((p) => {
  if (soloTemporada && p.tid !== soloTemporada) return false;
  const golesOviedo = p.oviedoLocal ? p.golesLocal : p.golesVisitante;
  if (typeof golesOviedo !== 'number' || golesOviedo === 0) return false;
  const deJugadores = p.jugadores
    .filter((j) => !j.esPortero)
    .reduce((s, j) => s + (j.goles || 0), 0);
  const enPropia = (p.golesEnPropia || []).reduce((s, og) => s + og.goles, 0);
  p._faltan = golesOviedo - deJugadores - enPropia;
  return p._faltan > 0;
});

if (!pendientes.length) {
  console.log(
    `✅ Ningún partido con goles sin autor${soloTemporada ? ` en ${soloTemporada}` : ''}.`,
  );
  process.exit(0);
}

console.log(
  `⚠ ${pendientes.length} partido(s) con goles del Oviedo sin autor${soloTemporada ? ` en ${soloTemporada}` : ''}:\n`,
);
let temporada = null;
pendientes.forEach((p) => {
  if (p.tid !== temporada) {
    temporada = p.tid;
    console.log(
      `── ${p.tid}  (https://realoviedo.info/${p.tid.slice(2, 4)}-${p.tid.slice(5, 7)}.html)`,
    );
  }
  console.log(
    `   ${p.fecha}  ${p.local} ${p.golesLocal}-${p.golesVisitante} ${p.visitante}` +
      `  ·  falta${p._faltan > 1 ? 'n' : ''} ${p._faltan}` +
      `  ·  ${p.jugadores.length} jugador(es) con datos`,
  );
});
console.log(
  '\nSi un partido tiene muy pocos jugadores con datos, es que la temporada aún no está completa:\n' +
    'los goles que faltan serán de jugadores todavía sin meter, no goles en propia.',
);
