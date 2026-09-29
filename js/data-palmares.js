/* ===================================
   DATA-PALMARES.JS
   Títulos oficiales del Real Oviedo.

   Títulos nacionales verificados en tres fuentes independientes
   que coinciden exactamente (Anexo:Palmarés del Real Oviedo en
   Wikipedia, BeSoccer y el cuadro de honores de la Wikipedia en
   inglés): 11 títulos oficiales. Se comprobó además que 1987-88
   NO fue campeonato (4º puesto + ascenso por play-off, campeón
   fue el CD Málaga) y que la "Copa de Consolación" de 1928 no
   forma parte del palmarés oficial por falta de fuentes fiables
   sobre esa competición.

   Los campeonatos regionales son anteriores a la creación de las
   competiciones nacionales de Liga (época amateur) y se muestran
   aparte, ya que no cuentan dentro del cómputo de títulos
   oficiales de la RFEF. Verificados cruzando RSSSF (archivo
   histórico de fútbol) y realoviedo.info, que coinciden entre sí
   temporada a temporada. El título de 1924-25 NO se incluye como
   título del Real Oviedo: lo ganó el Real Stadium Club Ovetense,
   uno de los dos clubes (junto al Real Club Deportivo Oviedo)
   cuya fusión en 1926 dio lugar al Real Oviedo; se menciona aparte
   como precedente histórico, sin sumarlo al recuento del club.

   Imágenes:
   - "escudo": escudo de la época del primer título de cada
     competición. Son los mismos escudos históricos que ya usa
     el proyecto en js/data-derbis.js, reutilizados aquí tal cual.
   - "foto": únicamente en los dos casos donde se ha podido
     verificar una fotografía histórica real y de dominio público
     en Wikimedia Commons (ver enlaces "fuente" de cada una). Para
     el resto de títulos no se ha añadido foto por no encontrar
     ninguna verificada; ver nota para el usuario sobre dónde
     buscar más en el propio Wikimedia Commons.
   =================================== */

CLUB_DATA.palmares = {
  nacionales: [
    {
      competicion: 'Segunda División',
      icono: 'fa-trophy',
      escudo: 'https://i.postimg.cc/15KYzZpW/Oviedo-F-C-1934-40.png',
      foto: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Real_Oviedo_team_in_the_1932-33_season.jpg',
      fotoPie: 'Plantilla del Real Oviedo en la temporada 1932-33, su primer título de Segunda División',
      fotoFuente: 'https://commons.wikimedia.org/wiki/File:Real_Oviedo_team_in_the_1932-33_season.jpg',
      temporadas: ['1932-33', '1951-52', '1957-58', '1971-72', '1974-75'],
    },
    {
      competicion: 'Tercera División',
      icono: 'fa-award',
      escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png',
      temporadas: ['2003-04', '2004-05', '2007-08', '2008-09'],
    },
    {
      competicion: 'Segunda División B',
      icono: 'fa-medal',
      escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png',
      temporadas: ['2014-15'],
    },
    {
      competicion: 'Copa de la Liga de Segunda División',
      icono: 'fa-shield-halved',
      escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png',
      temporadas: ['1984-85'],
    },
  ],

  regionales: [
    {
      competicion: 'Campeonato Regional de Asturias',
      escudo: 'https://i.postimg.cc/C57HwSWk/Real-Oviedo-FC-1926-30.png',
      temporadas: ['1927-28', '1928-29', '1932-33', '1933-34', '1934-35'],
    },
    {
      competicion: 'Campeonato Astur-Cántabro',
      escudo: 'https://i.postimg.cc/15KYzZpW/Oviedo-F-C-1934-40.png',
      temporadas: ['1931-32'],
    },
    {
      competicion: 'Campeonato Astur-Gallego',
      escudo: 'https://i.postimg.cc/15KYzZpW/Oviedo-F-C-1934-40.png',
      temporadas: ['1935-36'],
    },
  ],

  // Título de la época previa a la fusión de 1926: no se cuenta como
  // título del Real Oviedo, se muestra solo como nota histórica.
  precedente: {
    club: 'Real Stadium Club Ovetense',
    competicion: 'Campeonato Regional de Asturias',
    temporada: '1924-25',
    foto: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Real_Oviedo_1926.jpg',
    fotoPie: 'Primera plantilla del Real Oviedo, 1 de mayo de 1926, recién fusionados los dos clubes',
    fotoFuente: 'https://commons.wikimedia.org/wiki/File:Real_Oviedo_1926.jpg',
  },
};
