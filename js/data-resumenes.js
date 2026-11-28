/* ===================================
   DATA-RESUMENES.JS
   Resúmenes en vídeo (YouTube) de partidos ANTIGUOS.

   Para qué sirve: en la página de cada partido (partidos/...html) sale
   un bloque "Resumen en vídeo" con la miniatura; el reproductor de
   YouTube solo se carga al pulsar play (la página sigue siendo ligera).
   En los listados (temporada, rival...) el partido lleva un icono ▶.
   El vídeo NO se descarga ni se sube a la web: se ve desde YouTube.

   CÓMO AÑADIR UNO — un objeto por partido:
     {
       fecha: 'AAAA-MM-DD',      // la del partido, igual que en los datos
       videoId: 'XXXXXXXXXXX',   // lo que va después de "watch?v=" en la URL
                                 // (vale también pegar la URL entera)
       canal: 'Nombre del canal', // opcional: quién lo subió
     },
   El Oviedo no juega dos partidos el mismo día, así que la fecha basta.
   Si la fecha no coincide con ningún partido, el generador avisa con ⚠.
   Después: `npm run subir`.

   Si un vídeo desaparece de YouTube, bórralo de aquí (o ponle otro).

   (Los resúmenes de la temporada actual siguen en js/data-videos.js,
   que es lo que usa la página de Vídeos.)
   =================================== */

/* global CLUB_DATA */

// prettier-ignore
CLUB_DATA.resumenes = [
  // ── 2007/08 ───────────────────────────────────────────────
  { fecha: '2007-08-05', videoId: 'UMWa1tfub-E' }, // Real Oviedo 1-0 Ribadesella C.F., Copa RFEF (Fase Regional)
  { fecha: '2007-08-12', videoId: '0kU7fhbUE_s' }, // Real Sporting de Gijón B 2-1 Real Oviedo, Copa RFEF (Fase Regional)
  { fecha: '2007-08-15', videoId: 'qU-9PNRdlXI' }, // Ribadesella C.F. 1-2 Real Oviedo, Copa RFEF (Fase Regional)
  { fecha: '2007-08-22', videoId: 'KoVvIi2lkQ0' }, // Real Oviedo 2-1 Real Sporting de Gijón B, Copa RFEF (Fase Regional)
  { fecha: '2007-08-25', videoId: 'MTLAkZPiw4g' }, // S.D. Colloto 0-2 Real Oviedo, J1 Tercera
  { fecha: '2007-12-12', videoId: 'CD0wGAJCMu4' }, // Real Oviedo 10-0 Club Hispano de Castrillón, J16 Tercera
];
