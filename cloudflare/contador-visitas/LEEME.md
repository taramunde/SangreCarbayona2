# Contador de visitas — puesta en marcha en Cloudflare

La web (GitHub Pages) no puede guardar datos, así que el contador vive en un
**Cloudflare Worker** con una base de datos **D1**. Todo gratis con el plan
Free (100.000 visitas contadas al día de margen).

Solo se guardan totales por país y por día. **Ni IPs, ni cookies**: el país lo
da Cloudflare y en la web solo se usa `sessionStorage` para no contar dos
veces la misma sesión.

Archivos:

- `worker.js`: el código del Worker
- `schema.sql`: las dos tablas de la base de datos
- en la web: `js/contador-visitas.js` (lo carga `main.js` en todas las
  páginas) y `css/contador-visitas.css`

Mientras `js/contador-visitas.js` tenga la URL con `CAMBIAR`, el contador
está apagado: no hace peticiones y el widget no aparece.

---

## 1. Crear la cuenta

Entra en <https://dash.cloudflare.com/sign-up> y regístrate (gratis, no pide
tarjeta). No hace falta tener ningún dominio.

## 2. Crear la base de datos D1

1. En el menú de la izquierda: **Storage & Databases → D1 SQL Database**.
2. **Create** → nombre: `sangre-carbayona-visitas` → Create.
3. Dentro de la base de datos, abre la pestaña **Console**.
4. Pega TODO el contenido de `schema.sql` y pulsa **Execute**.

## 3. Crear el Worker

1. Menú izquierdo: **Compute (Workers) → Workers & Pages → Create**.
2. Elige **Start with Hello World!** → nombre: `contador-visitas` → **Deploy**.
3. Pulsa **Edit code**, borra todo lo que trae, pega el contenido de
   `worker.js` y pulsa **Deploy**.

## 4. Enlazar el Worker con la base de datos

1. En el Worker: **Settings → Bindings → Add → D1 database**.
2. **Variable name**: `DB` (exactamente así, en mayúsculas).
3. **D1 database**: `sangre-carbayona-visitas` → Save / Deploy.

## 5. Probarlo

Abre en el navegador `https://contador-visitas.TU-SUBDOMINIO.workers.dev/stats`
(la URL exacta sale en la página del Worker). Debe responder algo así:

```json
{"total":0,"numPaises":0,"hoy":0,"desde":null,"paises":[]}
```

## 6. Conectar la web

En `js/contador-visitas.js`, cambia la URL de arriba por la tuya (sin `/` al
final):

```js
const API_VISITAS = 'https://contador-visitas.TU-SUBDOMINIO.workers.dev';
```

`git add .` / `git commit` / `git push` y listo. La primera visita a la web
publicada ya cuenta, y aparecen el widget de la portada y la línea del footer.

---

## Notas

- **Qué cuenta como visita**: una por sesión de navegador (abrir la web en
  una pestaña nueva tras cerrarla cuenta otra vez; recargar o navegar entre
  páginas, no). Las de bots y previsualizadores de enlaces (WhatsApp,
  Telegram, Google…) no cuentan.
- **En local** (Live Server, `localhost`) se ven las cifras pero **no
  cuentan**: solo cuenta lo que venga de `https://taramunde.github.io`.
- **Poner el contador a cero**: en la consola de D1,
  `DELETE FROM visitas_pais; DELETE FROM visitas_dia;`
- **Ver todos los datos**: en la consola de D1,
  `SELECT * FROM visitas_pais ORDER BY total DESC;` o
  `SELECT * FROM visitas_dia ORDER BY dia DESC;`
- **Si algún día cambias de dominio**, cambia `ORIGEN_WEB` en `worker.js`.
