/* ===================================
   DATA-HISTORIA.JS
   Historia del Real Oviedo, capítulo a capítulo.

   Fuentes contrastadas: realoviedo.es (los capítulos oficiales
   del club "LOS ORÍGENES 1900-1926", "THE BIRTH 1926-1933" y
   "THE STRUGGLE FOR SURVIVAL 2001-2012", más varias noticias de
   su propia hemeroteca), realoviedo.info (liga1.htm, asturias.htm),
   Wikipedia (ES/EN, incl. Anexo:Palmarés ya usado en data-palmares.js
   y el artículo sobre el Sitio de Oviedo de 1936), laliga.com
   (historia del Carlos Tartiere) y hemeroteca reciente (COPE, El
   Español, RPC, La Opinión) para los sucesos de 2025-26.

   Las fotos son todas de Wikimedia Commons (dominio público o
   CC-BY, con enlace a la fuente de cada una) salvo la del antiguo
   Buenavista, que ya estaba en el proyecto. Donde no se ha
   encontrado una foto histórica verificada se usa solo el escudo
   de época correspondiente (los mismos ya usados en
   data-derbis.js/data-oviesportinguistas.js).
   =================================== */

CLUB_DATA.historia = [
  {
    id: 'origenes',
    periodo: '1900-1926',
    titulo: 'Los orígenes y la fundación',
    texto: [
      'A principios del siglo XX, en Oviedo competían por el favor de la afición dos clubes: el Real Stadium Club Ovetense, nacido hacia 1914, y el Real Club Deportivo de Oviedo, fundado el 4 de abril de 1919 a raíz de una escisión del propio Stadium.',
      'La pobre campaña de ambos en el Campeonato Regional de 1925-26, y la necesidad de plantar cara de una vez al Real Sporting de Gijón, empujó a sus directivas a negociar una fusión. El 14 de marzo de 1926 se reunieron para fijar las condiciones, y el 26 de marzo firmaron el acta fundacional del nuevo club: nacía el Real Oviedo. Se adoptaron los colores y el escudo de la propia ciudad —el azul y la Cruz de los Ángeles— y Carlos Tartiere fue su primer presidente.',
      'El 1 de mayo de 1926 el Real Oviedo disputó su primer partido oficial, ante el Arenas de Guecho; Justo marcó el primer gol de la historia del club.',
    ],
    escudo: 'https://i.postimg.cc/C57HwSWk/Real-Oviedo-FC-1926-30.png',
    imagenes: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Bases_fusi%C3%B3n_Real_Oviedo_1926.jpg',
        pie: 'Acta fundacional del Real Oviedo, 26 de marzo de 1926',
        fuente: 'https://commons.wikimedia.org/wiki/File:Bases_fusión_Real_Oviedo_1926.jpg',
      },
    ],
  },
  {
    id: 'preguerra',
    periodo: '1926-1936',
    titulo: 'Los años dorados de preguerra',
    texto: [
      'En apenas siete años, el club recién fundado se convirtió en el primer equipo asturiano en llegar a Primera División, en marzo de 1933. Antes ya había dominado el fútbol regional, con seis campeonatos de Asturias entre 1927 y 1935 y sendos títulos astur-cántabro (1931-32) y astur-gallego (1935-36).',
      'En 1932 se inauguró el estadio de Buenavista, que sería la casa del Real Oviedo durante más de setenta años: el partido inaugural, el 24 de abril de ese año, enfrentó a las selecciones de España y Yugoslavia.',
      'Fue también la época del guipuzcoano Isidro Lángara, que llegó al club el 1 de diciembre de 1930 y, hasta 1936, firmó 142 goles en 115 partidos —incluidos tres trofeos Pichichi consecutivos entre 1933-34 y 1935-36—, una de las mejores rachas goleadoras de la historia del fútbol español.',
    ],
    escudo: 'https://i.postimg.cc/15KYzZpW/Oviedo-F-C-1934-40.png',
    imagenes: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Real_Oviedo_team_in_the_1932-33_season.jpg',
        pie: 'Plantilla del Real Oviedo en la 1932-33, temporada del ascenso a Primera',
        fuente: 'https://commons.wikimedia.org/wiki/File:Real_Oviedo_team_in_the_1932-33_season.jpg',
      },
      {
        src: 'img/varios/EstadioBuenavista.webp',
        pie: 'El estadio de Buenavista, inaugurado el 24 de abril de 1932',
      },
    ],
  },
  {
    id: 'guerra-civil',
    periodo: '1936-1950',
    titulo: 'La Guerra Civil y la reconstrucción',
    texto: [
      'La Guerra Civil truncó por completo aquellos años dorados. El estadio de Teatinos, el primer campo del club, quedó inservible: se excavó una trinchera para refugio de los soldados y los bombardeos destrozaron sus instalaciones.',
      'Los daños fueron tan graves que el Real Oviedo ni siquiera pudo competir en la temporada 1939-40 por falta de campo donde jugar; la Federación española le reservó su plaza en Primera División para cuando pudiera volver. El club no retomó los entrenamientos hasta el 27 de agosto de 1940, tras cuatro años de parón forzoso.',
    ],
    escudo: 'https://i.postimg.cc/fbSKY49Q/Real-Oviedo-cf-1941-42.png',
    imagenes: [],
  },
  {
    id: 'entre-primera-segunda',
    periodo: '1950-1990',
    titulo: 'Entre Primera y Segunda',
    texto: [
      'Durante las cuatro décadas siguientes, el Real Oviedo alternó etapas en Primera con paso por Segunda División, categoría de la que fue campeón en cuatro ocasiones —1951-52, 1957-58, 1971-72 y 1974-75— además de conquistar la Copa de la Liga de Segunda División en 1984-85.',
      'En 1958, el estadio de Buenavista pasó a llamarse oficialmente Carlos Tartiere, en honor al primer presidente del club, fallecido años antes. Con ese nombre sería el escenario habitual del Real Oviedo hasta el cambio de siglo.',
    ],
    escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png',
    imagenes: [],
  },
  {
    id: 'sueno-europeo',
    periodo: '1990-1992',
    titulo: 'El sueño europeo',
    texto: [
      'El curso 1990-91 es uno de los más recordados por la afición carbayona: el Real Oviedo terminó sexto en Primera División y, al ganar la Copa del Rey de ese año el Atlético de Madrid (subcampeón liguero), se ganó el derecho a debutar en competición europea.',
      'El 19 de septiembre de 1991, dirigido por Jabo Irureta, el Real Oviedo ganó 1-0 al Genoa en el viejo Carlos Tartiere gracias a un gol de Bango, en su primer partido europeo de la historia. En la vuelta, disputada el 3 de octubre en el Luigi Ferraris de Génova, el partido acabó 3-3 y el equipo asturiano cayó eliminado en la tanda de penaltis.',
    ],
    escudo: 'https://i.postimg.cc/c4dX25Vf/Real-Oviedo-1988-1995.png',
    imagenes: [],
  },
  {
    id: 'nuevo-estadio',
    periodo: '1998-2003',
    titulo: 'Un nuevo estadio para un nuevo siglo',
    texto: [
      'A finales de los años 90, con el viejo Carlos Tartiere ya envejecido, el Real Oviedo levantó un estadio completamente nuevo en el Parque del Oeste, en la calle que hoy lleva el nombre de Isidro Lángara. El nuevo Carlos Tartiere abrió sus puertas el 20 de septiembre de 2000 con un amistoso ante el Partizán de Belgrado (0-2).',
      'El viejo estadio de Buenavista, testigo de casi setenta años de historia carbayona, cerró sus puertas y fue derribado en 2003.',
    ],
    escudo: 'https://i.postimg.cc/Hs3Bg9gR/Real-Oviedo-1996-99.png',
    imagenes: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Viejo_Carlos_Tartiere%2C_2002_%289509311383%29.jpg',
        pie: 'El viejo Carlos Tartiere en septiembre de 2002, un año antes de su derribo',
        fuente: 'https://commons.wikimedia.org/wiki/File:Viejo_Carlos_Tartiere,_2002_(9509311383).jpg',
      },
    ],
  },
  {
    id: 'lucha-supervivencia',
    periodo: '2001-2012',
    titulo: 'La lucha por la supervivencia',
    texto: [
      'Tras trece temporadas consecutivas en Primera División, el Real Oviedo descendió en 2001. Lo que parecía un simple bache deportivo derivó en una pesadilla institucional: en la calamitosa temporada 2002-03 el equipo acabó penúltimo, lo que provocó un doble descenso —deportivo a Segunda B y, además, administrativo a Tercera División, al no poder hacer frente a las deudas con los jugadores—.',
      'El 1 de agosto de 2003 el Real Oviedo estaba oficialmente en Tercera, sin plantilla y con una deuda asfixiante que obligó al club a entrar en concurso de acreedores para evitar la disolución. La afición, sin embargo, no lo permitió: llegó a superar los 25.000 abonados jugando en Segunda B, más que muchos equipos de Primera.',
      'Tras dos años de reconstrucción, el club regresó a Segunda B, pero una nueva crisis extradeportiva —descrita por el propio Real Oviedo como "la mayor mancha de su historia"— provocó otro descenso a Tercera en 2006-07, del que volvió a tardar dos temporadas en recuperarse.',
    ],
    escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png',
    imagenes: [],
  },
  {
    id: 'salvacion-accionistas',
    periodo: '2012',
    titulo: 'La salvación: la campaña de accionistas',
    texto: [
      'En noviembre de 2012, el Real Oviedo se enfrentaba a su hora más crítica: necesitaba reunir 1,9 millones de euros antes del día 17 o entraría en liquidación. Nació entonces la campaña #SOSRealOviedo, que se hizo viral en todo el mundo a través de las redes sociales.',
      'Miles de aficionados —y no aficionados— de fuera de Asturias compraron acciones de 10,75 euros para salvar al club: más de 30.000 pequeños accionistas repartidos por 125 países se convirtieron en el grupo mayoritario del accionariado. En aquella operación entró también como inversor el mexicano Carlos Slim, a través de Grupo Carso, que se mantendría como principal accionista durante la década siguiente.',
    ],
    escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png',
    imagenes: [],
  },
  {
    id: 'grupo-pachuca',
    periodo: '2012-2025',
    titulo: 'Grupo Pachuca y la reconstrucción',
    texto: [
      'En 2022, Grupo Pachuca —la empresa del mexicano Jesús Martínez, propietaria también del C.F. Pachuca— adquirió el 51% de las acciones del club y desplazó a Grupo Carso como máximo accionista, que conservó un 20% del capital; el resto sigue repartido entre miles de pequeños accionistas, herencia directa de la campaña de 2012.',
      'Bajo esta nueva propiedad, el Real Oviedo consolidó varias temporadas estables en Segunda División, sentando las bases del proyecto que llevaría de nuevo al equipo a Primera.',
    ],
    escudo: 'https://i.postimg.cc/rwPjdyz9/Real-Oviedo-2019-actualidad.png',
    imagenes: [],
  },
  {
    id: 'regreso-primera',
    periodo: '2025-2026',
    titulo: 'El regreso a Primera y la actualidad',
    texto: [
      'El 21 de junio de 2025, tras eliminar al UD Almería en semifinales, el Real Oviedo remontó al Mirandés (3-1 en la vuelta, tras el 1-0 del partido de ida) en la final del playoff de ascenso, con gol decisivo de Portillo en la prórroga. El conjunto dirigido por Veljko Paunovic devolvía al club a Primera División 24 años después de su último descenso.',
      'La alegría duró poco: el proyecto sufrió un serio contratiempo cuando la directiva destituyó a Paunovic en octubre, apenas ocho jornadas después de empezar la temporada, y el equipo terminó último clasificado con 29 puntos. El descenso se confirmó matemáticamente en mayo de 2026, y el Real Oviedo regresó a Segunda División —esa temporada rebautizada LaLiga Hypermotion— para la campaña 2026-27, la que está disputando actualmente.',
    ],
    escudo: 'https://i.postimg.cc/rwPjdyz9/Real-Oviedo-2019-actualidad.png',
    imagenes: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Estadio_Municipal_Carlos_Tartiere_%28Real_Oviedo_S.A.D.%29.jpg',
        pie: 'El Carlos Tartiere actual, inaugurado en 2000',
        fuente: 'https://commons.wikimedia.org/wiki/File:Estadio_Municipal_Carlos_Tartiere_(Real_Oviedo_S.A.D.).jpg',
        credito: 'Jsmq / Wikimedia Commons (CC BY 3.0)',
      },
    ],
  },
];
