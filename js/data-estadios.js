/* ===================================
   DATA-ESTADIOS.JS
   Cómo llegar a los estadios de los 22 equipos
   de Segunda División (temporada 2026/27, LaLiga
   Hypermotion), la categoría en la que juega
   actualmente el Real Oviedo.

   Mismos 22 equipos y escudos que usa js/clasificacion.js
   (fuente: CLUB_DATA.temporadas['2026-27']).

   El enlace "Cómo llegar" usa la API de rutas de
   Google Maps buscando el estadio por nombre y ciudad
   (destination=...), en vez de coordenadas fijas: así
   siempre apunta al sitio correcto aunque cambie el
   nombre del patrocinador o la dirección exacta.

   La dirección postal y el teléfono solo se muestran
   cuando se han podido confirmar. Si no están, la
   tarjeta simplemente no los enseña: mejor no dato
   que dato inventado.
   =================================== */

CLUB_DATA.estadios = [
  {
    equipo: 'Real Oviedo',
    escudo: 'img/escudos/Oviedo.webp',
    estadio: 'Estadio Municipal Carlos Tartiere',
    ciudad: 'Oviedo',
  },
  {
    equipo: 'Albacete Balompié',
    escudo: 'img/escudos/Albacete.webp',
    estadio: 'Estadio Carlos Belmonte',
    ciudad: 'Albacete',
  },
  {
    equipo: 'U.D. Almería',
    escudo: 'img/escudos/Almeria.webp',
    estadio: 'Estadio de los Juegos Mediterráneos',
    ciudad: 'Almería',
  },
  {
    equipo: 'F.C. Andorra',
    escudo: 'img/escudos/Andorra.webp',
    estadio: 'Estadi Nacional',
    ciudad: 'Andorra la Vella',
  },
  {
    equipo: 'Burgos C.F.',
    escudo: 'img/escudos/Burgos.webp',
    estadio: 'El Plantío',
    ciudad: 'Burgos',
  },
  {
    equipo: 'Cádiz C.F.',
    escudo: 'img/escudos/Cadiz.webp',
    estadio: 'Nuevo Mirandilla',
    ciudad: 'Cádiz',
  },
  {
    equipo: 'C.D. Castellón',
    escudo: 'img/escudos/Castellon.webp',
    estadio: 'Estadi Castalia',
    ciudad: 'Castellón de la Plana',
  },
  {
    equipo: 'R.C. Celta Fortuna',
    escudo: 'img/escudos/CeltaVigo.webp',
    estadio: 'Estadio Barreiro',
    ciudad: 'Vigo',
  },
  {
    equipo: 'A.D. Ceuta F.C.',
    escudo: 'img/escudos/Ceuta.webp',
    estadio: 'Estadio Alfonso Murube',
    ciudad: 'Ceuta',
  },
  {
    equipo: 'Córdoba C.F.',
    escudo: 'img/escudos/Cordoba.webp',
    estadio: 'Nuevo Arcángel',
    ciudad: 'Córdoba',
  },
  {
    equipo: 'S.D. Eibar',
    escudo: 'img/escudos/Eibar.webp',
    estadio: 'Estadio Municipal de Ipurúa',
    ciudad: 'Eibar',
  },
  {
    equipo: 'C.D. Eldense',
    escudo: 'img/escudos/Eldense.webp',
    estadio: 'Estadio Pepico Amat',
    ciudad: 'Elda',
  },
  {
    equipo: 'Girona F.C.',
    escudo: 'img/escudos/Girona.webp',
    estadio: 'Estadio Municipal de Montilivi',
    ciudad: 'Girona',
  },
  {
    equipo: 'Granada C.F.',
    escudo: 'img/escudos/Granada.webp',
    estadio: 'Nuevo Los Cármenes',
    ciudad: 'Granada',
  },
  {
    equipo: 'U.D. Las Palmas',
    escudo: 'img/escudos/LasPalmas.webp',
    estadio: 'Estadio Gran Canaria',
    ciudad: 'Las Palmas de Gran Canaria',
  },
  {
    equipo: 'C.D. Leganés',
    escudo: 'img/escudos/Leganes.webp',
    estadio: 'Estadio Municipal de Butarque',
    ciudad: 'Leganés',
  },
  {
    equipo: 'R.C.D. Mallorca',
    escudo: 'img/escudos/Mallorca.webp',
    estadio: 'Estadi Mallorca Son Moix',
    ciudad: 'Palma',
  },
  {
    equipo: 'Real Sociedad B',
    escudo: 'img/escudos/RealSociedad.webp',
    estadio: 'Instalaciones Zubieta',
    ciudad: 'San Sebastián',
  },
  {
    equipo: 'C.E. Sabadell',
    escudo: 'img/escudos/Sabadell.webp',
    estadio: 'Estadi Nova Creu Alta',
    ciudad: 'Sabadell',
  },
  {
    equipo: 'Real Sporting de Gijón',
    escudo: 'img/escudos/Sporting.webp',
    estadio: 'Estadio El Molinón',
    ciudad: 'Gijón',
  },
  {
    equipo: 'C.D. Tenerife',
    escudo: 'img/escudos/Tenerife.webp',
    estadio: 'Estadio Heliodoro Rodríguez López',
    ciudad: 'Santa Cruz de Tenerife',
  },
  {
    equipo: 'Real Valladolid',
    escudo: 'img/escudos/Valladolid.webp',
    estadio: 'Estadio José Zorrilla',
    ciudad: 'Valladolid',
  },
];
