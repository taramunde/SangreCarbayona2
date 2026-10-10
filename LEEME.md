# Guía de mantenimiento — Sangre Carbayona 2

Este documento explica, archivo a archivo, cómo meter o cambiar datos en la
web: jugadores, partidos, estadios, historia, palmarés, derbis, noticias,
vídeos, y qué hay que tocar si el club asciende o desciende de categoría.

Está pensado para consultarlo cuando necesites hacer un cambio y no
recuerdes en qué archivo va o qué formato exacto lleva. **No hace falta
que sepas programar** para la mayoría de estos cambios: son objetos de
datos con una forma fija, solo hay que copiar un bloque existente y
cambiar los valores.

> Cada vez que termines de editar algo, guarda y ejecuta `npm run subir`
> desde la terminal (en la carpeta del proyecto) para que se regeneren
> las páginas y se suba todo a GitHub. Si solo quieres previsualizar sin
> subir, usa `npm run generar`.

---

## Índice

1. [Dos cosas que hay que recordar siempre](#1-dos-cosas-que-hay-que-recordar-siempre)
2. [Jugadores y entrenadores (temporada actual e histórico)](#2-jugadores-y-entrenadores-temporada-actual-e-histórico)
3. [Datos de cada partido (el campo más importante)](#3-datos-de-cada-partido-el-campo-más-importante)
4. [Clasificación y calendario de la categoría](#4-clasificación-y-calendario-de-la-categoría)
5. [Cambiar de categoría (ascenso o descenso)](#5-cambiar-de-categoría-ascenso-o-descenso) ⚠️
6. [Cómo Llegar (estadios rivales)](#6-cómo-llegar-estadios-rivales)
7. [Palmarés](#7-palmarés)
8. [Historia del club](#8-historia-del-club)
9. [Derbis Asturianos](#9-derbis-asturianos)
10. [Oviesportinguistas](#10-oviesportinguistas)
11. [Noticias](#11-noticias)
12. [Vídeos (resúmenes)](#12-vídeos-resúmenes)
13. [Buscador avanzado](#13-buscador-avanzado)
14. [Imágenes de cabecera de cada sección](#14-imágenes-de-cabecera-de-cada-sección)
15. [Añadir una página nueva al menú](#15-añadir-una-página-nueva-al-menú)
16. [Traducciones (español/inglés)](#16-traducciones-españolinglés)
17. [Generar, formatear y subir los cambios](#17-generar-formatear-y-subir-los-cambios)
18. [Si aparece un conflicto al hacer git pull](#18-si-aparece-un-conflicto-al-hacer-git-pull)

---

## 1. Dos cosas que hay que recordar siempre

### ⚠️ En los porteros, "goles" significa goles ENCAJADOS, no marcados

En el objeto de cada partido (ver sección 3), el campo `goles` normalmente
es "goles marcados por el jugador". Pero si el jugador es un **portero**
(`posicion: "Portero"` en su ficha maestra), ese mismo campo pasa a
significar **goles encajados por el equipo** en ese partido. Es una
diferencia de significado según la posición, no un error. Ya nos
confundimos con esto dos veces en el proyecto — si algún día un portero
"marca muchos goles" según los datos, revisa si en realidad son los
encajados.

### Después de editar datos, hay que regenerar

Editar `js/data-historico.js`, `js/data-temporada-actual.js`, etc. **no
actualiza las páginas de fichas por sí solo**. Hay que ejecutar:

```
npm run generar
```

Esto reescribe todos los HTML de `/fichas/` y el `sitemap.xml` a partir de
los datos. `npm run subir` hace esto automáticamente y además sube los
cambios a GitHub (ver sección 17).

---

## 2. Jugadores y entrenadores (temporada actual e histórico)

Cada jugador tiene **dos partes** separadas que hay que mantener
coherentes entre sí (mismo `codigo`):

### a) Ficha maestra — `js/data-jugadores.js`

Datos que no cambian partido a partido: nombre, foto, posición,
nacionalidad... Se guardan en `CLUB_DATA.jugadoresMaestro`, con el
`codigo` del jugador como clave:

```js
'haissem-hassan': {
  nombre: 'Haissem',
  apellidos: 'Hassan',
  nombreCompleto: 'Haissem Hassan',
  apodo: 'Hassan',
  posicion: 'Centrocampista',
  posicionCorta: 'MC',
  altura: 1.78,
  nacionalidad: ['Española'],
  lugarNacimiento: 'Oviedo',
  provinciaNacimiento: 'Asturias',
  fechaNacimiento: '1998-03-12',
  imagen: 'img/jugadores/Hassan.webp',
},
```

Para entrenadores es igual pero en `CLUB_DATA.entrenadorMaestro`, con
`cargo` en vez de `posicion` (y a veces `seleccionComoEntrenador` si ha
dirigido a una selección nacional).

- **Imagen**: si la tienes subida al proyecto, usa una ruta local
  (`img/jugadores/Nombre.webp`). Si no, puedes usar una URL externa
  (`https://i.postimg.cc/...` o `https://i.ibb.co/...`) como se hace con
  varios jugadores ya en el archivo — son servicios gratuitos de
  alojamiento de imágenes.

### b) Partidos de la temporada — `js/data-temporada-actual.js` (actual) o `js/data-historico.js` (temporadas pasadas)

Aquí es donde se mete, temporada a temporada, quién estuvo en la
plantilla y **qué partidos jugó cada uno** (ver sección 3 para el detalle
de cada partido):

```js
CLUB_DATA.temporadas['2026-27'] = {
  competicion: 'Segunda División',
  grupo: 'null',
  estadisticasEquipo: {}, // Se calcula solo, no tocar a mano
  jugadores: [
    {
      id: 'haissem-hassan',
      codigo: 'haissem-hassan', // debe coincidir con jugadoresMaestro
      dorsal: 8,
      enClubDesde: '2023',
      contratoHasta: '2027',
      stats: {},
      partidos: [ /* ver sección 3 */ ],
    },
  ],
  cuerpoTecnico: [
    {
      codigo: 'julian-calero-fernandez',
      dorsal: '-',
      cargo: 'Entrenador',
      enClubDesde: '2026',
      contratoHasta: '2028',
    },
  ],
};
```

**`js/data-historico.js`** tiene el mismo formato, un bloque
`CLUB_DATA.temporadas['YYYY-YY'] = {...}` por cada temporada pasada. Para
añadir una temporada vieja nueva, copia el bloque de otra temporada y
cambia el año y los datos.

> Un jugador puede "no existir" en `jugadoresMaestro` todavía si es muy
> antiguo y no tienes su ficha completa — en ese caso solo saldrá con el
> código como nombre hasta que rellenes su ficha maestra.

---

## 3. Datos de cada partido (el campo más importante)

Cada partido dentro del array `partidos` de un jugador tiene esta forma:

```js
{
  id: 1,
  jornada: 7,
  competicion: 'Segunda División',
  fecha: '2026-10-06',
  local: 'Real Oviedo',
  visitante: 'Real Sporting de Gijón',
  golesLocal: 2,
  golesVisitante: 0,
  resultado: 'V',          // 'V' victoria, 'E' empate, 'D' derrota (desde el punto de vista del Oviedo)
  minutos: 90,
  goles: 0,                // Goles MARCADOS por el jugador — EXCEPTO en porteros, ver sección 1
  asistencias: 0,
  amarilla: false,
  roja: false,
}
```

Para partidos de Copa que se deciden por penaltis, añade además:

```js
  penaltisLocal: 4,
  penaltisVisitante: 2,
```

**Jornada en rondas de Copa**: en vez de un número, puede ser un texto
("Primera Ronda", "Dieciseisavos", "Final"...).

**Nombres de competición ya usados** (para no inventar variantes nuevas
por error): "Primera División", "Segunda División", "Segunda División B",
"Primera RFEF", "Copa de la Liga", "Supercopa", "Copa Federación",
"Promoción a 1ª", y para la Copa del Rey, el nombre cambia según el rey
de la época: "Copa del Rey (Alfonso XIII)" hasta 1930, "Copa de la
República" 1931-36, "Copa del Generalísimo" 1939-75, "Copa del Rey (Juan
Carlos I)" 1976 hasta el 19 de junio de 2014, "Copa del Rey (Felipe VI)"
desde entonces.

**Un mismo partido se repite en el `partidos[]` de cada jugador que lo
jugó** — no hay una lista única de partidos del equipo, cada jugador
lleva la suya. El buscador avanzado (sección 13) ya se encarga de juntar
todo eso solo; tú no tienes que deduplicar nada a mano.

---

## 4. Clasificación y calendario de la categoría

Archivo: **`js/clasificacion.js`**. Aquí viven los equipos rivales de la
categoría actual y el calendario completo de liga (no solo los partidos
del Oviedo).

### Lista de equipos (`equipos`)

```js
const equipos = [
  { nombre: 'Real Oviedo', escudo: 'img/escudos/Oviedo.webp' },
  { nombre: 'Real Sporting de Gijón', escudo: 'img/escudos/Sporting.webp' },
  // ...todos los equipos de la categoría
];
```

### Calendario de la liga (`enfrentamientos`)

```js
const enfrentamientos = [
  // Jornada 1 (16/08/2026)   ← comentario solo informativo, no se lee por código
  { equipo1: 'U.D. Almería', equipo2: 'C.D. Eldense', goles1: 3, goles2: 0 },
  // ...once partidos (o los que correspondan) por jornada
];
```

⚠️ **Muy importante**: la jornada de cada partido **no es un campo, se
calcula según la posición dentro del array** (bloques fijos de N
partidos, ver `POR_JORNADA` en `js/calendario.js`). Eso significa:

- Nunca muevas un partido de sitio en el array. Si un partido se
  **aplaza**, dale el campo `aplazado: true` y déjalo donde está:

  ```js
  { equipo1: 'Real Oviedo', equipo2: 'C.D. Eldense', goles1: null, goles2: null, aplazado: true },
  ```

  El sitio (home y calendario) lo señala como "Aplazado" y salta al
  siguiente partido real de forma automática. Cuando se juegue de
  verdad, solo rellena `goles1`/`goles2` con el resultado — no hace falta
  quitar `aplazado: true`, deja de tener efecto solo.

- Un partido que aún no se ha jugado lleva `goles1: null, goles2: null`.

---

## 5. Cambiar de categoría (ascenso o descenso) ⚠️

Esto es lo que más sitios toca a la vez. Lista de comprobación completa,
en orden:

1. **`js/data-club.js`** → `competicionActual` (ej. `'LaLiga Hypermotion'`
   o `'LaLiga EA Sports'`).
2. **`js/data-temporada-actual.js`** → el `competicion` del bloque de la
   temporada en curso (`CLUB_DATA.temporadas['XXXX-YY'].competicion`).
3. **`js/clasificacion.js`**:
   - Reemplaza el array `equipos` por los rivales de la nueva categoría
     (nombre + escudo; añade los escudos que falten en `img/escudos/`).
   - Reescribe `enfrentamientos` con el calendario nuevo.
   - Revisa `calcularZonaYDG()`: los cortes de posición para "ascenso
     directo" / "playoff" / "descenso" (Segunda) son distintos a los de
     Primera (zonas de Champions/Europa/Conference + descenso). Si vas a
     Primera, esta función y la leyenda (punto 5 de esta lista) hay que
     adaptarlas a puestos europeos en vez de ascenso.
4. **`js/calendario.js`** → constante `POR_JORNADA`: tiene que ser
   `(número de equipos de la categoría) / 2`. Con 22 equipos son 11
   partidos por jornada; con 20 equipos (Primera) serían 10. Si no
   cambias este número al cambiar de categoría, **la jornada de cada
   partido saldrá mal calculada**.
5. **Leyenda de la clasificación** — hay que cambiarla **en los dos
   sitios a la vez** (es fácil olvidarse de uno, ya nos pasó):
   - `clasificacion.html` (la tabla completa)
   - `index.html` (el widget pequeño de la portada)

   Los colores de los puntos (`.dot`) están repartidos en **dos**
   archivos — hay que tocar los dos para que no se desincronicen otra
   vez: `css/clasificacion.css` (la tabla completa de
   `clasificacion.html`) y `css/styles.css` (el widget pequeño de
   `index.html`, que no carga `clasificacion.css`). Si cambias a zonas
   europeas, habría que añadir ahí clases tipo `.dot.champions`,
   `.dot.europa`, etc. en ambos sitios.
6. **`js/data-estadios.js`** (sección "Cómo Llegar") → sustituir la lista
   de clubes por los de la nueva categoría (ver sección 6).
7. Los partidos que se vayan jugando a partir de ahora, con el
   `competicion` correcto de la nueva categoría (ver sección 3).

---

## 6. Cómo Llegar (estadios rivales)

Archivo: **`js/data-estadios.js`**. Un objeto por equipo:

```js
{
  equipo: 'Real Sporting de Gijón',
  escudo: 'img/escudos/Sporting.webp',
  estadio: 'Estadio El Molinón',
  ciudad: 'Gijón',
},
```

No hace falta dirección exacta ni coordenadas: el botón "Cómo llegar" usa
el nombre del estadio + la ciudad para abrir Google Maps directamente, así
que siempre acierta aunque no sepas la dirección postal exacta. Si en
algún momento consigues la dirección y el teléfono reales de un club (como
ya se hizo con el Bernabéu), puedes añadir `direccion` y `telefono` y se
mostrarán en la tarjeta — pero son opcionales.

---

## 7. Palmarés

Archivo: **`js/data-palmares.js`**. Dos listas —`nacionales` (títulos de
la RFEF) y `regionales` (época amateur, antes de la Liga)— más un objeto
`precedente` para menciones históricas que no cuentan como título del
club:

```js
{
  competicion: 'Segunda División',
  icono: 'fa-trophy',            // nombre de un icono de Font Awesome
  escudo: 'https://...',          // escudo de la época del primer título
  foto: '...', fotoPie: '...', fotoFuente: '...',  // opcional, solo si tienes una foto real verificada
  temporadas: ['1932-33', '1951-52', '1957-58', '1971-72', '1974-75'],
},
```

Para añadir un título nuevo, busca el bloque de su competición y añade la
temporada al array `temporadas`. Si es una competición que todavía no
está en la lista, copia un bloque entero y cámbialo.

⚠️ No pongas fotos ni fechas que no hayas podido confirmar en una fuente
fiable (Wikipedia, la web oficial del club, Wikimedia Commons con
licencia libre...) — es mejor dejar el campo `foto` vacío que poner algo
incorrecto.

---

## 8. Historia del club

Archivo: **`js/data-historia.js`**. Es un array de capítulos,
`CLUB_DATA.historia`, cada uno con esta forma:

```js
{
  id: 'nombre-unico-sin-espacios',   // se usa para enlazar directo a este capítulo (historia.html#id)
  periodo: '1926-1936',
  titulo: 'Los años dorados de preguerra',
  texto: [
    'Primer párrafo...',
    'Segundo párrafo...',
  ],
  escudo: 'https://...',             // escudo de época (opcional)
  imagenes: [
    { src: '...', pie: 'Pie de foto', fuente: 'https://...' }, // opcional, solo fotos verificadas
  ],
},
```

Para añadir un capítulo nuevo, cópialo donde corresponda cronológicamente
dentro del array (el orden del array es el orden en que aparecen en la
página).

---

## 9. Derbis Asturianos

Archivo: **`js/data-derbis.js`** (`window.DERBIS_DATA`). Es el esquema
más detallado del proyecto: incluye alineaciones completas con eventos
(goles, tarjetas) por jugador. Lo más seguro es **copiar un derbi
entero existente** y cambiar los datos, en vez de escribirlo desde cero.

⚠️ A diferencia del resto de secciones, esto **no se regenera solo** con
`npm run generar`/`npm run subir` — hay que ejecutar este comando aparte
cada vez que edites un derbi, antes de subir:

```
node generador/generar-derbis.js
```

---

## 10. Oviesportinguistas

Archivo: **`js/data-oviesportinguistas.js`**. Dos listas, `jugadores` y
`entrenadores`, con esta forma:

```js
{
  nombre: 'Hassan',
  imagen: 'img/jugadores/Hassan.webp',  // opcional — si no la tienes, sale un icono genérico
  clubes: [
    { escudo: 'https://...escudo-sporting...' },
    { escudo: 'https://...escudo-oviedo...' },
  ],
  texto: 'Hassan jugó 1 temporada con el Real Sporting, la (2023/24)',
},
```

`clubes` es la cadena cronológica de equipos (algunos jugadores fueron y
volvieron varias veces, en ese caso se repiten escudos en el orden
correcto). Si tienes la foto del jugador ya en el proyecto (en
`data-jugadores.js`), reutilízala; si no, déjalo sin `imagen`.

---

## 11. Noticias

Archivo: **`js/noticias.js`**, array `NOTICIAS_DATA` (máximo 4 noticias
visibles). El índice 0 es siempre la noticia destacada:

```js
{
  medio: 'lavozdeasturias',   // clave de MEDIOS_CONFIG, en el mismo archivo
  url: 'https://...',
  titulo: 'Título de la noticia',
  // imagen y descripcion son opcionales: si se dejan vacíos,
  // el script intenta sacarlos solo de la propia noticia
},
```

Si la noticia es de un medio que no está en `MEDIOS_CONFIG` (arriba del
todo del archivo), añade ahí su logo y color antes de usarlo.

---

## 12. Vídeos (resúmenes)

Archivo: **`js/data-videos.js`**, `CLUB_DATA.videos`:

```js
{
  id: 6,
  jornada: 6,
  titulo: 'Real Oviedo Vs Real Sporting de Gijón',
  fecha: '2026-09-20',
  videoId: 'XXXXXXXXXXX',   // el código del vídeo de YouTube (lo que va después de "watch?v=")
},
```

---

## 13. Buscador avanzado

Archivo **`buscador.html`** + **`js/buscador.js`**. Este apartado **no
necesita mantenimiento**: lee en vivo todos los archivos de datos
anteriores (jugadores, partidos, títulos, estadios, historia, derbis,
oviesportinguistas) y construye el índice de búsqueda solo, cada vez que
se carga la página. Cualquier cosa que añadas siguiendo esta guía
aparece allí automáticamente, sin tocar nada del buscador.

---

## 14. Imágenes de cabecera de cada sección

Cada página interior (Historia, Palmarés, Cómo Llegar,
Oviesportinguistas, Derbis, Noticias, Buscador...) tiene una imagen de
fondo en la cabecera. Para cambiarla:

1. Sube la imagen nueva a `img/varios/` (formato `.webp` recomendado).
2. En el HTML de esa página, busca el bloque:
   ```html
   <div class="page-header-bg">
     <img src="img/varios/NombreActual.webp" alt="..." />
   </div>
   ```
3. Cambia la ruta por la de tu imagen nueva.

(`noticias.html` es la excepción: su cabecera se pone por CSS en
`css/noticias.css`, dentro de la regla `.page-hero-bg`, no con una
etiqueta `<img>`.)

---

## 15. Añadir una página nueva al menú

Edita **`header.html`**, dentro de `<ul class="nav-list">`. Para un enlace
suelto (no desplegable):

```html
<li class="nav-item">
  <a href="mi-pagina.html" data-i18n="nav_mi_pagina">Mi Página</a>
</li>
```

Para añadirlo dentro de un desplegable existente (Club, Equipo,
Competiciones, Multimedia), busca su `<ul class="submenu">` y añade el
`<li>` ahí dentro.

No olvides:
- Añadir la clave `nav_mi_pagina` en `js/i18n.js` (sección 16).
- Añadir la página a `PAGINAS_ESTATICAS` en
  `generador/generar-sitemap.js` para que Google la indexe.

---

## 16. Traducciones (español/inglés)

Archivo: **`js/i18n.js`**. Hay dos bloques grandes, uno para `es` y otro
para `en`, cada uno con una lista plana de `clave: 'Texto'`. Para que un
texto cambie de idioma automáticamente:

1. Añade la misma clave en **ambos** bloques (es y en), con su
   traducción correspondiente.
2. En el HTML, pon `data-i18n="esa_clave"` en la etiqueta que tenga el
   texto.

---

## 17. Generar, formatear y subir los cambios

En la carpeta del proyecto, por terminal:

| Comando | Qué hace |
|---|---|
| `npm run generar` | Regenera las fichas y el sitemap a partir de los datos, sin subir nada a GitHub. Úsalo para previsualizar en local. |
| `npm run subir` | Genera + añade todos los cambios a git + hace commit + `git pull --rebase` + sube a GitHub. El comando normal del día a día. |
| `npm run forzar` | Como `subir`, pero con `git push --force`. Solo si sabes lo que haces — sobrescribe lo que haya en GitHub. |
| `node generador/generar-derbis.js` | Regenera las fichas de derbis. **No** está incluido en `generar`/`subir`: hay que ejecutarlo aparte si has tocado `data-derbis.js`, antes de subir. |

Si quieres previsualizar en el navegador antes de subir, puedes servir la
carpeta en local (por ejemplo con `npx http-server`) y abrir
`http://localhost:8080` (o el puerto que indique).

El proyecto usa Prettier para mantener el formato del código consistente.
No hace falta que lo ejecutes a mano normalmente, pero si quieres
comprobar que un archivo quedó bien formateado:

```
npx prettier --check js/el-archivo-que-edites.js
npx prettier --write js/el-archivo-que-edites.js   # lo corrige automáticamente
```

---

## 18. Si aparece un conflicto al hacer git pull

Lo más habitual es que el conflicto salga en **`sitemap.xml`** o
**`generador/.sitemap-cache.json`** (por trabajar desde dos ordenadores
sin sincronizar antes). Son archivos que se generan solos, así que
**no hay que fusionarlos a mano**: basta con quedarte con cualquiera de
las dos versiones y regenerarlo de nuevo:

```
git checkout --theirs sitemap.xml generador/.sitemap-cache.json
node generador/generar-sitemap.js
git add sitemap.xml generador/.sitemap-cache.json
git rebase --continue
```

Si el conflicto está en un archivo de datos real (`data-historico.js`,
etc.), hay que mirar las marcas `<<<<<<<` / `=======` / `>>>>>>>` a mano y
decidir qué parte de cada lado conservar — en ese caso, mejor pide ayuda
en vez de resolverlo a ciegas, para no perder datos de ningún lado.
