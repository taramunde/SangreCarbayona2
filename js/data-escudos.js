/* ===================================
   DATA-ESCUDOS.JS
   Escudo de cada equipo en las páginas de /partidos/ (partido,
   temporada, rival y portada de resultados).

   Cómo añadir un escudo:
   1. Sube la imagen a img/escudos/ en formato .webp. El nombre del
      archivo da igual, pero mejor sin espacios ni tildes.
   2. Añade (o descomenta) su línea abajo, con el nombre del equipo
      escrito como en los partidos:
        'C.D. Mirandés': 'img/escudos/Mirandes.webp',
   3. Regenera y sube (npm run subir).

   - No importan mayúsculas, tildes, puntos ni espacios en el nombre:
     'CD Mirandes' vale igual que 'C.D. Mirandés'.
   - Si un club cambió de nombre (js/data-equipos.js), basta con
     ponerlo con su nombre ACTUAL: sus partidos con nombres antiguos
     usan el mismo escudo.
   - Si un equipo no tiene escudo, sale un círculo con sus iniciales.

   FILIALES: si un filial no tiene escudo propio, usa el de su primer
   equipo automáticamente. Los que acaban en ' B' o ' C' (Getafe C.F. B,
   Real Madrid C...) se detectan solos; los que tienen otro nombre se
   indican en CLUB_DATA.filiales, más abajo. Si algún día quieres un
   escudo distinto para un filial, añádelo a la lista normal y ese
   tendrá prioridad.
   =================================== */

CLUB_DATA.escudos = {
  // ── Ya disponibles ─────────────────────────────────────────
  'A.D. Ceuta F.C.': 'img/escudos/Ceuta.webp',
  'Albacete Balompié': 'img/escudos/Albacete.webp',
  'Athletic Club': 'img/escudos/AthleticClub.webp',
  'Atlético de Madrid': 'img/escudos/AtleticodeMadrid.webp',
  'Burgos C.F.': 'img/escudos/Burgos.webp',
  'C.A. Osasuna': 'img/escudos/Osasuna.webp',
  'C.D. Castellón': 'img/escudos/Castellon.webp',
  'C.D. Eldense': 'img/escudos/Eldense.webp',
  'C.D. Leganés': 'img/escudos/Leganes.webp',
  'C.D. Numancia': 'img/escudos/Numancia.webp',
  'C.D. Tenerife': 'img/escudos/Tenerife.webp',
  'C.E. Sabadell': 'img/escudos/Sabadell.webp',
  'Cádiz C.F.': 'img/escudos/Cadiz.webp',
  'Córdoba C.F.': 'img/escudos/Cordoba.webp',
  'Deportivo Alavés': 'img/escudos/Alaves.webp',
  'Elche C.F.': 'img/escudos/Elche.webp',
  'F.C. Andorra': 'img/escudos/Andorra.webp',
  'F.C. Barcelona': 'img/escudos/Barcelona.webp',
  'Getafe C.F.': 'img/escudos/Getafe.webp',
  'Girona F.C.': 'img/escudos/Girona.webp',
  'Granada C.F.': 'img/escudos/Granada.webp',
  'Levante U.D.': 'img/escudos/Levante.webp',
  'R.C. Celta de Vigo': 'img/escudos/CeltaVigo.webp',
  'R.C. Deportivo de La Coruña': 'img/escudos/DeportivoACoruna.webp',
  'R.C.D. Espanyol': 'img/escudos/Espanyol.webp',
  'R.C.D. Mallorca': 'img/escudos/Mallorca.webp',
  'Rayo Vallecano': 'img/escudos/RayoVallecano.webp',
  'Real Betis': 'img/escudos/Betis.webp',
  'Real Madrid': 'img/escudos/Madrid.webp',
  'Real Oviedo': 'img/escudos/Oviedo.webp',
  'Real Sociedad': 'img/escudos/RealSociedad.webp',
  'Real Sporting de Gijón': 'img/escudos/Sporting.webp',
  'Real Valladolid': 'img/escudos/Valladolid.webp',
  'S.D. Eibar': 'img/escudos/Eibar.webp',
  'Sevilla F.C.': 'img/escudos/Sevilla.webp',
  'U.D. Almería': 'img/escudos/Almeria.webp',
  'U.D. Las Palmas': 'img/escudos/LasPalmas.webp',
  'Valencia C.F.': 'img/escudos/Valencia.webp',
  'Villarreal C.F.': 'img/escudos/Villarreal.webp',

  // ── PENDIENTES ──────────────────────────────────────────────
  // Rivales que aún no tienen escudo, ordenados por número de
  // partidos contra el Oviedo. Cuando subas la imagen con ese nombre
  // (o con el que quieras, cambiándolo aquí), quita las // del
  // principio de su línea.
  // 'C.D. Mirandés': 'img/escudos/Mirandes.webp', // 21 partidos
  // 'Real Zaragoza': 'img/escudos/Zaragoza.webp', // 20 partidos
  // 'C.D. Lugo': 'img/escudos/Lugo.webp', // 19 partidos
  // 'A.D. Alcorcón': 'img/escudos/Alcorcon.webp', // 16 partidos
  // 'S.D. Huesca': 'img/escudos/Huesca.webp', // 16 partidos
  // 'Málaga C.F.': 'img/escudos/Malaga.webp', // 13 partidos
  // 'F.C. Cartagena': 'img/escudos/Cartagena.webp', // 10 partidos
  // 'Gimnàstic de Tarragona': 'img/escudos/GimnasticDeTarragona.webp', // 10 partidos
  // 'Racing de Santander': 'img/escudos/RacingDeSantander.webp', // 10 partidos
  // 'S.D. Ponferradina': 'img/escudos/Ponferradina.webp', // 10 partidos
  // 'C.F. Fuenlabrada': 'img/escudos/Fuenlabrada.webp', // 9 partidos
  // 'C.D. Guijuelo': 'img/escudos/Guijuelo.webp', // 8 partidos
  // 'Club Marino de Luanco': 'img/escudos/MarinoDeLuanco.webp', // 8 partidos
  // 'Coruxo F.C.': 'img/escudos/Coruxo.webp', // 8 partidos
  // 'Cultural y Deportiva Leonesa': 'img/escudos/CulturalYDeportivaLeonesa.webp', // 8 partidos
  // 'Racing de Ferrol': 'img/escudos/RacingDeFerrol.webp', // 8 partidos
  // 'U.D. Logroñés': 'img/escudos/UDLogrones.webp', // 8 partidos
  // 'Zamora C.F.': 'img/escudos/Zamora.webp', // 8 partidos
  // 'Caudal Deportivo': 'img/escudos/CaudalDeportivo.webp', // 6 partidos
  // 'Real Avilés Industrial C.F.': 'img/escudos/AvilesIndustrial.webp', // 6 partidos
  // 'C.F. Reus Deportiu': 'img/escudos/ReusDeportiu.webp', // 5 partidos
  // 'S.D. Amorebieta': 'img/escudos/Amorebieta.webp', // 5 partidos
  // 'C.D. Ourense': 'img/escudos/CDOurense.webp', // 4 partidos
  // 'C.D. Tropezón': 'img/escudos/Tropezon.webp', // 4 partidos
  // 'Extremadura U.D.': 'img/escudos/Extremadura.webp', // 4 partidos
  // 'R.S.D. Alcalá': 'img/escudos/RsdAlcala.webp', // 4 partidos
  // 'S.D. Compostela': 'img/escudos/Compostela.webp', // 4 partidos
  // 'U.C.A.M. Murcia': 'img/escudos/UcamMurcia.webp', // 4 partidos
  // 'U.D. Ibiza': 'img/escudos/Ibiza.webp', // 4 partidos
  // 'U.D. San Sebastián de Los Reyes': 'img/escudos/SanSebastianDeLosReyes.webp', // 4 partidos
  // 'R.S. Gimnástica de Torrelavega': 'img/escudos/RsGimnasticaDeTorrelavega.webp', // 3 partidos
  // 'Real Murcia': 'img/escudos/Murcia.webp', // 3 partidos
  // 'U.D. Salamanca': 'img/escudos/Salamanca.webp', // 3 partidos
  // 'Atlético Astorga F.C.': 'img/escudos/AtleticoAstorga.webp', // 2 partidos
  // 'Atlético Coruña Montañeros C.F.': 'img/escudos/AtleticoCorunaMontaneros.webp', // 2 partidos
  // 'Barakaldo C.F.': 'img/escudos/Barakaldo.webp', // 2 partidos
  // 'C.D. La Muela': 'img/escudos/LaMuela.webp', // 2 partidos
  // 'C.D. Lealtad de Villaviciosa': 'img/escudos/LealtadDeVillaviciosa.webp', // 2 partidos
  // 'C.D. Marino': 'img/escudos/Marino.webp', // 2 partidos
  // 'C.D. Toledo': 'img/escudos/Toledo.webp', // 2 partidos
  // 'C.F. Palencia': 'img/escudos/Palencia.webp', // 2 partidos
  // 'C.F. Rayo Majadahonda': 'img/escudos/RayoMajadahonda.webp', // 2 partidos
  // 'La Roda C.F.': 'img/escudos/LaRoda.webp', // 2 partidos
  // 'Lorca F.C.': 'img/escudos/Lorca.webp', // 2 partidos
  // 'Peña Sport F.C.': 'img/escudos/PenaSport.webp', // 2 partidos
  // 'Real Unión Club': 'img/escudos/Union.webp', // 2 partidos
  // 'S.D. Lemona': 'img/escudos/Lemona.webp', // 2 partidos
  // 'S.D. Logroñés': 'img/escudos/SDLogrones.webp', // 2 partidos
  // 'S.D. Noja': 'img/escudos/Noja.webp', // 2 partidos
  // 'U.B. Conquense': 'img/escudos/UbConquense.webp', // 2 partidos
  // 'U.D. Somozas': 'img/escudos/Somozas.webp', // 2 partidos
  // 'U.D. Vecindario': 'img/escudos/Vecindario.webp', // 2 partidos
  // 'U.E. Llagostera': 'img/escudos/Llagostera.webp', // 2 partidos
  // 'U.P. de Langreo': 'img/escudos/UpDeLangreo.webp', // 2 partidos
  // 'A.E. Prat': 'img/escudos/Prat.webp', // 1 partido
  // 'C.D. Coria': 'img/escudos/Coria.webp', // 1 partido
  // 'C.E. Andratx': 'img/escudos/Andratx.webp', // 1 partido
  // 'C.F. Badalona': 'img/escudos/Badalona.webp', // 1 partido
  // 'Haro Deportivo': 'img/escudos/HaroDeportivo.webp', // 1 partido
  // 'Ourense C.F.': 'img/escudos/CFOurense.webp', // 1 partido
  // 'Real Ávila': 'img/escudos/Avila.webp', // 1 partido
  // 'U.E. Manresa': 'img/escudos/Manresa.webp', // 1 partido
};

// Filiales con un nombre que no acaba en ' B' / ' C':
// 'nombre del filial': 'nombre del primer equipo'
CLUB_DATA.filiales = {
  'Real Madrid Castilla': 'Real Madrid',
  'Sevilla Atlético': 'Sevilla F.C.',
  'Bilbao Athletic': 'Athletic Club',
};
