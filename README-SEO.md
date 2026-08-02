# SEO de Sangre Carbayona — qué se ha añadido y qué falta por hacer

## Tercera tanda: fichas estáticas de derbis

Con `derbis.js` (el que rellena tanto el listado como la ficha dinámica)
ya se pudo montar el mismo mecanismo que ya tenías para jugadores, pero
para los derbis:

- **`plantilla-derbi.html`** — plantilla con marcadores `{{LOCAL}}`,
  `{{VISITANTE}}`, `{{RESULTADO}}`, `{{ESTADIO}}`, etc. Ya trae el
  resultado real pre-renderizado en el hero (visible sin JS), Open Graph
  con el marcador real del partido (antes cualquier derbi compartido
  mostraba el genérico "Detalle del Derbi"), canonical, y JSON-LD
  `SportsEvent` (con `startDate` en ISO cuando la fecha del partido se
  puede interpretar; si no, simplemente se omite ese campo en vez de
  inventar una fecha).
- **`generar-derbis.js`** — genera un archivo por derbi en
  `/fichas/derbi-{id}.html` a partir de `data-derbis.js`. Ejecutar:
  ```
  node generar-derbis.js
  ```
  desde la misma carpeta que `generar.js`/`generar-sitemap.js`. Probado
  contra tu `data-derbis.js` real: genera correctamente
  `fichas/derbi-1944-j12.html` con el resultado, fecha (`startDate:
  "1944-12-10"`) y escudos correctos.
- **`derbis.js`** — cambio mínimo: `cargarPartidoDinamico()` ahora usa
  `urlParams.get('id') || window.DERBI_ID_STATIC` en vez de solo el
  parámetro de la URL, para que la ficha estática (que no tiene query
  string) sepa qué partido rellenar. También cambié el enlace "Ver
  ficha" del listado (`cargarListaDerbis()`) para que apunte directamente
  a `fichas/derbi-{id}.html` en vez de a `derbi.html?id=...` — así los
  usuarios (y Google) llegan directamente a la página indexable y
  compartible, no a la dinámica con `noindex`.
- **`derbi.html`** — sigue con `noindex, nofollow` (igual que
  `ficha-jugador.html`); solo actualicé el comentario para reflejar que
  ahora sí existe el equivalente estático. Sigue siendo útil como
  vista previa/depuración o por si queda algún enlace viejo con
  `?id=`.
- **`generar-sitemap.js`** — ahora también carga `data-derbis.js` (de
  forma opcional: si el archivo no existe todavía no rompe el script,
  solo avisa) y añade cada `fichas/derbi-{id}.html` al sitemap.

**Tienes que ejecutar, en este orden, cada vez que cambien los datos:**
```
node generar.js
node generar-derbis.js
node generar-sitemap.js
```

## Resumen de la segunda tanda (páginas públicas + canonical)

1. `js/seo.js` (canonical + `og:url` + JSON-LD) añadido a todas las
   páginas públicas.
2. Arreglado un contenido duplicado real: las fichas de jugador por
   temporada (`codigo-2024-25.html`...) no llevaban canonical hacia la
   ficha principal (`codigo.html`). Ya lo llevan, vía `plantilla.html` +
   `generar.js`.
3. JSON-LD `Person` en las fichas de jugador.
4. `derbi.html` protegido con `noindex` (mismo problema que tenía
   `ficha-jugador.html` antes de existir las fichas estáticas).
5. Open Graph añadido a `puzzlecarbayon.html`, que no tenía ninguno.

## Archivos nuevos (todas las tandas)

- `robots.txt` (raíz) — permite rastreo completo, apunta a `sitemap.xml`.
- `sitemap.xml` (raíz) — páginas fijas; se regenera con
  `generar-sitemap.js` para incluir fichas de jugador/entrenador/derbi.
- `generar-sitemap.js`, `generar-derbis.js` — colócalos en la **misma
  carpeta donde tienes `generar.js`**.
- `plantilla-derbi.html` — colócala junto a `plantilla.html`.
- `js/seo.js` — ya incluido en todas las páginas públicas.

## Cambios en archivos existentes (todas las tandas)

- `plantilla.html` / `generar.js` — canonical + JSON-LD `Person` en
  fichas de jugador (recuerda volver a ejecutar `node generar.js` para
  que las fichas ya publicadas se actualicen).
- `derbi.html` — `noindex, nofollow`.
- `derbis.js` — fallback `DERBI_ID_STATIC` + enlace del listado apunta a
  la ficha estática.
- `puzzlecarbayon.html` — Open Graph añadido.
- Resto de páginas públicas — carga de `js/seo.js` añadida.

## Qué queda fuera del código (imprescindible para "verse en Google")

1. **Google Search Console**: dar de alta
   `https://taramunde.github.io/SangreCarbayona2/`, verificar con el
   meta tag que da la propia consola (no lo puedo generar yo), enviar
   `sitemap.xml`, pedir indexación manual de la home.
2. **Bing Webmaster Tools** — mismo proceso.
3. **Rich Results Test** — comprobar que el JSON-LD (`seo.js`, fichas de
   jugador, fichas de derbi) no tiene errores.
4. **Enlaces externos** (X/Twitter, Reddit, foros, Instagram) —
   probablemente lo de más impacto a corto plazo.
5. **Core Web Vitals** — PageSpeed Insights sobre la home.
6. Los enlaces sociales del footer siguen siendo `href="#"` — enlázalos
   cuando tengas los perfiles reales.