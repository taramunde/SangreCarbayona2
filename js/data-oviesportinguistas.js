/* ===================================
   DATA-OVIESPORTINGUISTAS.JS
   Jugadores y entrenadores que han vestido tanto
   la camiseta del Real Oviedo como la de su eterno
   rival, el Real Sporting de Gijón.

   Cada entrada tiene una cadena "clubes" con los
   escudos en orden cronológico (algunos jugadores
   fueron y volvieron varias veces entre los dos
   equipos). Los escudos son los mismos que ya usa
   el proyecto para épocas históricas (ver
   js/data-derbis.js), reutilizados aquí tal cual.

   Imagen del jugador/entrenador:
   - Si el jugador ya tiene ficha propia en
     CLUB_DATA.jugadoresMaestro (comprobado por apodo
     + año de nacimiento coherente con la época en la
     que jugó este intercambio), se usa esa imagen ya
     alojada en el proyecto (campo "imagen" abajo).
   - Si no, no se pone "imagen": oviesportinguistas.js
     pinta entonces el icono genérico de "sin foto"
     (el mismo que ya usa el buscador del header en
     js/busqueda.js) hasta que se añada una real.
   =================================== */

CLUB_DATA.oviesportinguistas = {
  intro:
    'Aunque hoy en día pueda parecer impensable, incluso una traición, la historia de los primeros equipos del Real Oviedo y el Real Sporting de Gijón revela una realidad muy distinta. A lo largo de más de un siglo, alrededor de 58 jugadores y 6 entrenadores han vestido las camisetas de ambos clubes en distintos momentos de su carrera. El primero en hacerlo fue el gijonés Jesús Rodríguez Álvarez, "Chus", que en la temporada 1930/31 dejó el Real Sporting de Gijón para fichar por el Real Oviedo, abriendo así un largo capítulo de idas y venidas entre los dos eternos rivales.',

  jugadores: [
    {
      nombre: 'Dotor',
      imagen: 'https://i.postimg.cc/gcwFM5v3/Carlos-Dotor-PNG.webp',
      clubes: [
        { escudo: 'https://i.postimg.cc/rwPjdyz9/Real-Oviedo-2019-actualidad.png' },
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
      ],
      texto: 'Dotor jugó 1 temporada con el Real Sporting, la (2024/25)',
    },
    {
      nombre: 'Dubasin',
      imagen: 'https://i.postimg.cc/R02PFM0R/Dubasin-PNG.webp',
      clubes: [
        { escudo: 'https://i.postimg.cc/rwPjdyz9/Real-Oviedo-2019-actualidad.png' },
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
      ],
      texto: 'Dubasin jugó 2 temporadas con el Real Sporting, las (2024/25), (2025/26)',
    },
    {
      nombre: 'Hassan',
      imagen: 'img/jugadores/Hassan.webp',
      clubes: [
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
        { escudo: 'https://i.postimg.cc/rwPjdyz9/Real-Oviedo-2019-actualidad.png' },
      ],
      texto: 'Hassan jugó 1 temporada con el Real Sporting, la (2023/24)',
    },
    {
      nombre: 'Diego Tejón',
      imagen: 'https://i.postimg.cc/mgPHhTMt/Diego-Tejon-PNG.webp',
      clubes: [
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
        { escudo: 'https://i.postimg.cc/rwPjdyz9/Real-Oviedo-2019-actualidad.png' },
      ],
      texto: 'Diego Tejón jugó 3 temporadas con el Sporting Atlético, las (2020/21), (2021/22), (2022/23)',
    },
    {
      nombre: 'Chus',
      clubes: [
        { escudo: 'https://i.postimg.cc/J475PHkq/Real-Sporting-de-Gij-n-1930-PNG.png' },
        { escudo: 'https://i.postimg.cc/C57HwSWk/Real-Oviedo-FC-1926-30.png' },
      ],
      texto: 'Chus jugó 2 temporadas con el Real Sporting, las (1928/29), (1929/30)',
    },
    {
      nombre: 'Pena',
      clubes: [
        { escudo: 'https://i.postimg.cc/4dTztYGp/Sporting-Club-de-Gij-n-1934-PNG.png' },
        { escudo: 'https://i.postimg.cc/15KYzZpW/Oviedo-F-C-1934-40.png' },
        { escudo: 'https://i.postimg.cc/mgXXQNpC/Real-Gij-n-1941-PNG.png' },
        { escudo: 'https://i.postimg.cc/fbSKY49Q/Real-Oviedo-cf-1941-42.png' },
      ],
      texto:
        'Pena jugó 9 temporadas con el Real Sporting, las (1925/26), (1926/27), (1928/29), (1929/30), (1930/31), (1931/32), (1932/33), (1933/34), (1939/40)',
    },
    {
      nombre: 'Herrerita',
      clubes: [
        { escudo: 'https://i.postimg.cc/4dTztYGp/Sporting-Club-de-Gij-n-1934-PNG.png' },
        { escudo: 'https://i.postimg.cc/15KYzZpW/Oviedo-F-C-1934-40.png' },
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
      ],
      texto: 'Herrerita jugó 3 temporadas con el Real Sporting, las (1931/32), (1932/33), (1950/51)',
    },
    {
      nombre: 'Uría',
      clubes: [
        { escudo: 'https://i.postimg.cc/XJFs6Mjk/Real-Oviedo-1984-PNG.png' },
        { escudo: 'https://i.postimg.cc/tRNz3NYJ/Real-Sporting-1977-PNG.png' },
        { escudo: 'https://i.postimg.cc/XJFs6Mjk/Real-Oviedo-1984-PNG.png' },
      ],
      texto:
        'Uría jugó 6 temporadas con el Real Sporting, las (1977/78), (1978/79), (1979/80), (1980/81), (1981/82), (1982/83)',
    },
    {
      nombre: 'Sión I',
      clubes: [
        { escudo: 'https://i.postimg.cc/4dTztYGp/Sporting-Club-de-Gij-n-1934-PNG.png' },
        { escudo: 'https://i.postimg.cc/fbSKY49Q/Real-Oviedo-cf-1941-42.png' },
      ],
      texto:
        'Sión I jugó 6 temporadas con el Real Sporting, las (1930/31), (1931/32), (1932/33), (1933/34), (1934/35), (1935/36)',
    },
    {
      nombre: 'Cholo Dindurra',
      clubes: [
        { escudo: 'https://i.postimg.cc/mgXXQNpC/Real-Gij-n-1941-PNG.png' },
        { escudo: 'https://i.postimg.cc/T2VtkXHR/Real-Oviedo-1942-44.png' },
        { escudo: 'https://i.postimg.cc/YSvX8GTV/Real-Gij-n-1946-PNG.png' },
      ],
      texto:
        'Cholo Dindurra jugó 12 temporadas con el Real Sporting, las (1939/40), (1941/42), (1942/43), (1943/44), (1944/45), (1945/46), (1946/47), (1947/48), (1948/49), (1949/50), (1950/51), (1951/52), (1952/53)',
    },
    {
      nombre: 'Emilín',
      clubes: [
        { escudo: 'https://i.postimg.cc/j5VhX8Hw/Real-Oviedo-cf-1945-52.png' },
        { escudo: 'https://i.postimg.cc/tRNz3NYJ/Real-Sporting-1977-PNG.png' },
      ],
      texto: 'Emilín jugó 2 temporadas con el Real Sporting, las (1949/50), (1950/51)',
    },
    {
      nombre: 'Biempica',
      clubes: [
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
        { escudo: 'https://i.postimg.cc/XJFs6Mjk/Real-Oviedo-1984-PNG.png' },
      ],
      texto:
        'Biempica jugó 9 temporadas con el Real Sporting, las (1955/56), (1956/57), (1957/58), (1958/59), (1959/60), (1960/61), (1961/62), (1962/63), (1963/64)',
    },
    {
      nombre: 'Montes',
      clubes: [
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
        { escudo: 'https://i.postimg.cc/XJFs6Mjk/Real-Oviedo-1984-PNG.png' },
      ],
      texto:
        'Montes jugó 9 temporadas con el Real Sporting, las (1959/60), (1960/61), (1962/63), (1963/64), (1964/65), (1965/66), (1966/67), (1967/68), (1968/69)',
    },
    {
      nombre: 'Lombardía',
      clubes: [
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
        { escudo: 'https://i.postimg.cc/XJFs6Mjk/Real-Oviedo-1984-PNG.png' },
      ],
      texto:
        'Lombardía jugó 5 temporadas con el Real Sporting, las (1961/62), (1962/63), (1963/64), (1964/65), (1965/66)',
    },
    {
      nombre: 'Inciarte',
      clubes: [
        { escudo: 'https://i.postimg.cc/15KYzZpW/Oviedo-F-C-1934-40.png' },
        { escudo: 'https://i.postimg.cc/4dTztYGp/Sporting-Club-de-Gij-n-1934-PNG.png' },
      ],
      texto: 'Inciarte jugó 1 temporada con el Real Sporting, la (1935/36)',
    },
    {
      nombre: 'Mijares',
      clubes: [
        { escudo: 'https://i.postimg.cc/fbSKY49Q/Real-Oviedo-cf-1941-42.png' },
        { escudo: 'https://i.postimg.cc/y8Ypgrj7/Real-Gij-n-1940-PNG.png' },
      ],
      texto: 'Mijares jugó 4 temporadas con el Real Sporting, las (1940/41), (1941/42), (1942/43), (1943/44)',
    },
    {
      nombre: 'Abdón',
      clubes: [
        { escudo: 'https://i.postimg.cc/C57HwSWk/Real-Oviedo-FC-1926-30.png' },
        { escudo: 'https://i.postimg.cc/J475PHkq/Real-Sporting-de-Gij-n-1930-PNG.png' },
      ],
      texto: 'Abdón jugó 1 temporada con el Real Sporting, la (1930/31)',
    },
    {
      nombre: 'Traviesu',
      clubes: [
        { escudo: 'https://i.postimg.cc/4dTztYGp/Sporting-Club-de-Gij-n-1934-PNG.png' },
        { escudo: 'https://i.postimg.cc/fbSKY49Q/Real-Oviedo-cf-1941-42.png' },
      ],
      texto: 'Traviesu jugó 1 temporada con el Real Sporting, la (1931/32)',
    },
    {
      nombre: 'Héctor',
      clubes: [
        { escudo: 'https://i.postimg.cc/15KYzZpW/Oviedo-F-C-1934-40.png' },
        { escudo: 'https://i.postimg.cc/mgXXQNpC/Real-Gij-n-1941-PNG.png' },
      ],
      texto:
        'Héctor jugó 6 temporadas con el Real Sporting, las (1939/40), (1944/45), (1945/46), (1946/47), (1947/48), (1948/49)',
    },
    {
      nombre: 'Pipi',
      clubes: [
        { escudo: 'https://i.postimg.cc/mgXXQNpC/Real-Gij-n-1941-PNG.png' },
        { escudo: 'https://i.postimg.cc/fbSKY49Q/Real-Oviedo-cf-1941-42.png' },
      ],
      texto: 'Pipi jugó 3 temporadas con el Real Sporting, las (1935/36), (1939/40), (1940/41)',
    },
    {
      nombre: 'Díaz',
      clubes: [
        { escudo: 'https://i.postimg.cc/YSvX8GTV/Real-Gij-n-1946-PNG.png' },
        { escudo: 'https://i.postimg.cc/T2VtkXHR/Real-Oviedo-1942-44.png' },
      ],
      texto: 'Díaz jugó 3 temporadas con el Real Sporting, las (1940/41), (1941/42), (1942/43)',
    },
    {
      nombre: 'Menéndez',
      clubes: [
        { escudo: 'https://i.postimg.cc/fbSKY49Q/Real-Oviedo-cf-1941-42.png' },
        { escudo: 'https://i.postimg.cc/mgXXQNpC/Real-Gij-n-1941-PNG.png' },
        { escudo: 'https://i.postimg.cc/fbSKY49Q/Real-Oviedo-cf-1941-42.png' },
      ],
      texto: 'Menéndez jugó 1 temporada con el Real Sporting, la (1940/41)',
    },
    {
      nombre: 'Tocornal',
      clubes: [
        { escudo: 'https://i.postimg.cc/wTWcPx5d/Real-Sporting-de-Gij-n-1987-PNG.png' },
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
      ],
      texto: 'Tocornal jugó 3 temporadas con el Real Sporting, las (1981/82), (1984/85), (1986/87)',
    },
    {
      nombre: 'Pernas',
      clubes: [
        { escudo: 'https://i.postimg.cc/hvBpSChW/Real-Oviedo-1993-PNG.png' },
        { escudo: 'https://i.postimg.cc/wTWcPx5d/Real-Sporting-de-Gij-n-1987-PNG.png' },
      ],
      texto: 'Pernas jugó 1 temporada con el Real Sporting, la (1989/90)',
    },
    {
      nombre: 'Iván Iglesias',
      clubes: [
        { escudo: 'https://i.postimg.cc/wTWcPx5d/Real-Sporting-de-Gij-n-1987-PNG.png' },
        { escudo: 'https://i.postimg.cc/Hs3Bg9gR/Real-Oviedo-1996-99.png' },
      ],
      texto: 'Iván Iglesias jugó 3 temporadas con el Real Sporting, las (1991/92), (1992/93), (1995/96)',
    },
    {
      nombre: 'David Cano',
      clubes: [
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
        { escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png' },
      ],
      texto:
        'David Cano jugó 8 temporadas con el Real Sporting, las (1993/94), (1994/95), (1995/96), (1996/97), (1997/98), (1998/99), (1999/00), (2000/01)',
    },
    {
      nombre: 'Christiansen',
      clubes: [
        { escudo: 'https://i.postimg.cc/wTWcPx5d/Real-Sporting-de-Gij-n-1987-PNG.png' },
        { escudo: 'https://i.postimg.cc/c4dX25Vf/Real-Oviedo-1988-1995.png' },
      ],
      texto: 'Christiansen jugó 1 temporada con el Real Sporting, la (1992/93)',
    },
    {
      nombre: 'José Manuel',
      clubes: [
        { escudo: 'https://i.postimg.cc/wTWcPx5d/Real-Sporting-de-Gij-n-1987-PNG.png' },
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
      ],
      texto: 'José Manuel jugó 1 temporada con el Real Sporting, la (1980/81)',
    },
    {
      nombre: 'Pulgar',
      clubes: [
        { escudo: 'https://i.postimg.cc/pTXNJ6F4/Sporting-Atl-tico-1983.png' },
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
      ],
      texto: 'Pulgar jugó 2 temporadas con el Sporting Atlético, las (1978/79), (1979/80)',
    },
    {
      nombre: 'Bango',
      clubes: [
        { escudo: 'https://i.postimg.cc/c4dX25Vf/Real-Oviedo-1988-1995.png' },
        { escudo: 'https://i.postimg.cc/wTWcPx5d/Real-Sporting-de-Gij-n-1987-PNG.png' },
        { escudo: 'https://i.postimg.cc/Hs3Bg9gR/Real-Oviedo-1996-99.png' },
      ],
      texto: 'Bango jugó 3 temporadas con el Real Sporting, las (1995/96), (1996/97), (1997/98)',
    },
    {
      nombre: 'Caco Morán',
      clubes: [
        { escudo: 'https://i.postimg.cc/wTWcPx5d/Real-Sporting-de-Gij-n-1987-PNG.png' },
        { escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png' },
      ],
      texto: 'Caco Morán jugó 1 temporada con el Real Sporting, la (1994/95)',
    },
    {
      nombre: 'Yago',
      clubes: [
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
        { escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png' },
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
      ],
      texto: 'Yago jugó 3 temporadas con el Real Sporting, las (1998/99), (1999/00), (2003/04)',
    },
    {
      nombre: 'Chichi',
      clubes: [
        { escudo: 'https://i.postimg.cc/15KYzZpW/Oviedo-F-C-1934-40.png' },
        { escudo: 'https://i.postimg.cc/4dTztYGp/Sporting-Club-de-Gij-n-1934-PNG.png' },
      ],
      texto: 'Chichi jugó 2 temporadas con el Real Sporting, las (1934/35), (1935/36)',
    },
    {
      nombre: 'Tamargo',
      clubes: [
        { escudo: 'https://i.postimg.cc/YSvX8GTV/Real-Gij-n-1946-PNG.png' },
        { escudo: 'https://i.postimg.cc/j5VhX8Hw/Real-Oviedo-cf-1945-52.png' },
      ],
      texto: 'Tamargo jugó 2 temporadas con el Real Sporting, las (1944/45), (1945/46)',
    },
    {
      nombre: 'Castro',
      clubes: [
        { escudo: 'https://i.postimg.cc/J475PHkq/Real-Sporting-de-Gij-n-1930-PNG.png' },
        { escudo: 'https://i.postimg.cc/15KYzZpW/Oviedo-F-C-1934-40.png' },
      ],
      texto: 'Castro jugó 3 temporadas con el Real Sporting, las (1928/29), (1929/30), (1930/31)',
    },
    {
      nombre: 'Jairo',
      clubes: [
        { escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png' },
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
      ],
      texto: 'Jairo jugó 1 temporada con el Real Sporting, la (2006/07)',
    },
    {
      nombre: 'Jony',
      imagen: 'https://i.ibb.co/KjLHsmhP/Jony-PNG.webp',
      clubes: [
        { escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png' },
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
      ],
      texto:
        'Jony jugó 6 temporadas con el Real Sporting, las (2013/14), (2014/15), (2015/16), (2017/18), (2021/22), (2022/23)',
    },
    {
      nombre: 'Ernesto',
      clubes: [
        { escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png' },
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
      ],
      texto: "Ernesto jugó 1 temporada con el Real Sporting 'B', la (2012/13)",
    },
    {
      nombre: 'Colo',
      imagen: 'https://i.ibb.co/4w1xdYkf/Colo-PNG.webp',
      clubes: [
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
        { escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png' },
      ],
      texto: "Colo jugó 2 temporadas con el Real Sporting 'B' Juvenil, las (2010/11), (2011/12)",
    },
    {
      nombre: 'Castiello',
      imagen: 'https://i.ibb.co/dwnS9WcT/Castiello-PNG.webp',
      clubes: [
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
        { escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png' },
      ],
      texto: "Castiello jugó 1 temporada con el Real Sporting 'B' Juvenil, la (2011/12)",
    },
    {
      nombre: 'Quirós',
      clubes: [
        { escudo: 'https://i.postimg.cc/4dTztYGp/Sporting-Club-de-Gij-n-1934-PNG.png' },
        { escudo: 'https://i.postimg.cc/fbSKY49Q/Real-Oviedo-cf-1941-42.png' },
      ],
      texto:
        'Quirós jugó 7 temporadas con el Real Sporting, las (1928/29), (1929/30), (1930/31), (1931/32), (1932/33), (1933/34), (1934/35)',
    },
    {
      nombre: 'Sión II',
      clubes: [
        { escudo: 'https://i.postimg.cc/15KYzZpW/Oviedo-F-C-1934-40.png' },
        { escudo: 'https://i.postimg.cc/4dTztYGp/Sporting-Club-de-Gij-n-1934-PNG.png' },
      ],
      texto: 'Sión II jugó 1 temporada con el Real Sporting, la (1935/36)',
    },
    {
      nombre: 'Domingo',
      clubes: [
        { escudo: 'https://i.postimg.cc/YSvX8GTV/Real-Gij-n-1946-PNG.png' },
        { escudo: 'https://i.postimg.cc/j5VhX8Hw/Real-Oviedo-cf-1945-52.png' },
      ],
      texto: 'Domingo jugó 3 temporadas con el Real Sporting, la (1943/44), (1944/45), (1945/46)',
    },
    {
      nombre: 'Arbaizar',
      clubes: [
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
      ],
      texto: 'Arbaizar jugó 2 temporadas con el Real Sporting, las (1959/60), (1960/61)',
    },
    {
      nombre: 'Barea',
      clubes: [
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
      ],
      texto: 'Barea jugó 2 temporadas con el Real Sporting, las (1959/60), (1960/61)',
    },
    {
      nombre: 'Madriles',
      clubes: [
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
      ],
      texto: 'Madriles jugó 4 temporadas con el Real Sporting, las (1958/59), (1959/60), (1960/61), (1961/62)',
    },
    {
      nombre: 'Robledo',
      clubes: [
        { escudo: 'https://i.postimg.cc/j5VhX8Hw/Real-Oviedo-cf-1945-52.png' },
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
      ],
      texto: 'Robledo jugó 2 temporadas con el Real Sporting, las (1952/53), (1954/55)',
    },
    {
      nombre: 'Sagrado',
      clubes: [
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
        { escudo: 'https://i.postimg.cc/rmSNYSjh/Real-Oviedo-Cf-1953-56.png' },
      ],
      texto: 'Sagrado jugó 3 temporadas con el Real Sporting, las (1953/54), (1954/55), (1955/56)',
    },
    {
      nombre: 'Sansón',
      clubes: [
        { escudo: 'https://i.postimg.cc/YSvX8GTV/Real-Gij-n-1946-PNG.png' },
        { escudo: 'https://i.postimg.cc/j5VhX8Hw/Real-Oviedo-cf-1945-52.png' },
      ],
      texto: 'Sansón jugó 2 temporadas con el Real Sporting, las (1943/44), (1944/45)',
    },
    {
      nombre: 'Tono',
      clubes: [
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
      ],
      texto: 'Tono jugó 2 temporadas con el Real Sporting, las (1960/61), (1961/62)',
    },
    {
      nombre: 'Laurín',
      clubes: [
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
      ],
      texto: 'Laurín jugó 1 temporada con el Real Sporting, la (1961/62)',
    },
    {
      nombre: 'Del Cueto',
      clubes: [
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
      ],
      texto:
        'Del Cueto jugó 6 temporadas con el Real Sporting, las (1964/65), (1965/66), (1966/67), (1967/68), (1968/69), (1969/70)',
    },
    {
      nombre: 'Iglesias',
      clubes: [
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
      ],
      texto: 'Iglesias jugó 1 temporada con el Real Sporting, la (1967/68)',
    },
    {
      nombre: 'Del Riego',
      clubes: [
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
      ],
      texto: 'Del Riego jugó 2 temporadas con el Real Sporting, las (1970/71), (1971/72)',
    },
    {
      nombre: 'Juan Valdés',
      clubes: [
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
      ],
      texto: 'Juan Valdés jugó 2 temporadas con el Real Sporting, las (1970/71), (1972/73)',
    },
    {
      nombre: 'De Diego',
      clubes: [
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
        { escudo: 'https://i.postimg.cc/tRNz3NYJ/Real-Sporting-1977-PNG.png' },
      ],
      texto: 'De Diego jugó 2 temporadas con el Real Sporting, las (1974/75), (1975/76)',
    },
    {
      nombre: 'Nacho García',
      clubes: [
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
        { escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png' },
      ],
      texto: 'Nacho García jugó 3 temporadas con el Real Sporting, las (1998/99), (1999/00), (2000/01)',
    },
    {
      nombre: 'Miguel',
      imagen: 'https://i.ibb.co/G4rBhyPh/Miguel-Cedr-n-PNG.webp',
      clubes: [
        { escudo: 'https://i.postimg.cc/RZNQzrGJ/Real-Sporting-de-Gij-n-2005-PNG.png' },
        { escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png' },
      ],
      texto: 'Miguel jugó 5 temporadas con el Real Sporting, las (1997/98), (1998/99), (1999/00), (2001/02), (2003/04)',
    },
  ],

  entrenadores: [
    {
      nombre: 'Vicente Miera',
      clubes: [
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
        { escudo: 'https://i.postimg.cc/tRNz3NYJ/Real-Sporting-1977-PNG.png' },
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
      ],
      texto:
        'Vicente Miera entrenó 5 temporadas con el Real Sporting, las (1976/77), (1977/78), (1978/79), (1980/81), (1981/82)',
    },
    {
      nombre: 'Meana',
      clubes: [
        { escudo: 'https://i.postimg.cc/mgXXQNpC/Real-Gij-n-1941-PNG.png' },
        { escudo: 'https://i.postimg.cc/fbSKY49Q/Real-Oviedo-cf-1941-42.png' },
        { escudo: 'https://i.postimg.cc/YSvX8GTV/Real-Gij-n-1946-PNG.png' },
      ],
      texto:
        'Meana entrenó 6 temporadas con el Real Sporting, las (1926/27), (1931/32), (1932/33), (1933/34), (1939/40), (1948/49)',
    },
    {
      nombre: 'Peña',
      clubes: [
        { escudo: 'https://i.postimg.cc/15KYzZpW/Oviedo-F-C-1934-40.png' },
        { escudo: 'https://i.postimg.cc/mgXXQNpC/Real-Gij-n-1941-PNG.png' },
      ],
      texto: 'Peña entrenó 3 temporadas con el Real Sporting, las (1940/41), (1941/42), (1946/47)',
    },
    {
      nombre: 'Picabea',
      clubes: [
        { escudo: 'https://i.postimg.cc/kGqvrBh7/Real-Oviedo-CF-1957-87.png' },
        { escudo: 'https://i.postimg.cc/zf4xQDrf/Real-Gij-n-1962-PNG.png' },
      ],
      texto: 'Picabea entrenó 1 temporada con el Real Sporting, la (1959/60)',
    },
    {
      nombre: 'Ramiro Solís',
      clubes: [
        { escudo: 'https://i.postimg.cc/wTWcPx5d/Real-Sporting-de-Gij-n-1987-PNG.png' },
        { escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png' },
      ],
      texto: 'Ramiro Solís entrenó 1 temporada con el Real Sporting, la (1995/96)',
    },
    {
      nombre: 'Díaz Galán',
      clubes: [
        { escudo: 'https://i.postimg.cc/wTWcPx5d/Real-Sporting-de-Gij-n-1987-PNG.png' },
        { escudo: 'https://i.postimg.cc/nhzTc9Vz/Real-Oviedo-2000-18.png' },
      ],
      texto: 'Díaz Galán entrenó 1 temporada con el Real Sporting "B", la (1996/97)',
    },
  ],
};
