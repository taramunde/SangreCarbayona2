/* ===================================
   CIFRAR-PRIVADO.JS
   Cifra el contenido de la zona privada (privado.html) con tu PIN.

   NORMALMENTE NO HACE FALTA EJECUTARLO A MANO: `npm run subir` lo llama
   solo y te pide el PIN únicamente si has cambiado el borrador.

   A mano (para cambiar el PIN, o cifrar sin subir):
     npm run privado        (o  node generador/cifrar-privado.js)

   Qué hace:
     1. Lee tu contenido de  privado-fuente/contenido.html
        (si no existe, lo crea a partir de generador/privado-plantilla.html
        y se para para que lo edites).
     2. Te pide el PIN (8 dígitos). No se ve al escribirlo y NO se guarda
        en ningún sitio. Si ya había contenido cifrado, comprueba que es
        el PIN actual; si no lo es, te pide repetirlo para confirmar que
        quieres CAMBIARLO (así un error al teclear no cambia el PIN).
     3. Escribe  js/data-privado.js  con el contenido CIFRADO
        (AES-256-GCM + PBKDF2-SHA256). Eso es lo único que se sube.

   IMPORTANTE:
     - La carpeta privado-fuente/ está en .gitignore: NUNCA se sube a
       GitHub. Haz copia de seguridad de ella tú.
     - Las imágenes que pongas en el contenido NO van cifradas si son
       archivos de img/ (esos se ven en GitHub). Si alguna es privada,
       no la subas.
   =================================== */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const RAIZ = path.join(__dirname, '..');
const CARPETA_FUENTE = path.join(RAIZ, 'privado-fuente');
const FUENTE = path.join(CARPETA_FUENTE, 'contenido.html');
// Huella del último borrador cifrado, para saber si ha cambiado.
// Está dentro de privado-fuente/, así que tampoco se sube.
const MARCA = path.join(CARPETA_FUENTE, '.ultimo-cifrado');
const PLANTILLA = path.join(__dirname, 'privado-plantilla.html');
const SALIDA = path.join(RAIZ, 'js', 'data-privado.js');

// Iteraciones de PBKDF2: hacen cada intento lento a propósito (en un
// navegador normal, ~0,5 s). privado.js lo lee del propio archivo cifrado.
const ITERACIONES = 600000;

function preguntarOculto(texto) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(texto);
    let valor = '';
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    // Se procesa letra a letra: si se pega el PIN llega todo de golpe.
    const alPulsar = (trozo) => {
      for (const c of trozo) {
        if (c === '\r' || c === '\n' || c === '\u0004') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', alPulsar);
          process.stdout.write('\n');
          resolve(valor);
          return;
        } else if (c === '\u0003') {
          stdin.setRawMode(false);
          process.stdout.write('\n');
          process.exit(1);
        } else if (c === '\u007f' || c === '\b') {
          if (valor.length) {
            valor = valor.slice(0, -1);
            process.stdout.write('\b \b');
          }
        } else {
          valor += c;
          process.stdout.write('*');
        }
      }
    };
    stdin.on('data', alPulsar);
  });
}

function huella(texto) {
  return crypto.createHash('sha256').update(texto).digest('hex');
}

// Lo que hay ahora mismo cifrado en js/data-privado.js (o null).
function datosActuales() {
  try {
    const txt = fs.readFileSync(SALIDA, 'utf8');
    const m = txt.match(/window\.SC_PRIVADO\s*=\s*(\{[\s\S]*\})\s*;/);
    return m ? JSON.parse(m[1]) : null;
  } catch (e) {
    return null;
  }
}

// ¿Este PIN abre lo que hay cifrado ahora? Si lo abre, devuelve el
// contenido descifrado; si no, null.
function abrirConPin(pin, datos) {
  try {
    const clave = crypto.pbkdf2Sync(
      pin,
      Buffer.from(datos.salt, 'base64'),
      datos.iter,
      32,
      'sha256',
    );
    const todo = Buffer.from(datos.datos, 'base64');
    const d = crypto.createDecipheriv(
      'aes-256-gcm',
      clave,
      Buffer.from(datos.iv, 'base64'),
    );
    d.setAuthTag(todo.subarray(todo.length - 16));
    return Buffer.concat([
      d.update(todo.subarray(0, todo.length - 16)),
      d.final(),
    ]).toString('utf8');
  } catch (e) {
    return null;
  }
}

async function pedirPin() {
  const actuales = datosActuales();
  const pin = await preguntarOculto('   PIN (8 dígitos): ');
  if (!/^\d{8}$/.test(pin))
    throw new Error('El PIN tiene que ser exactamente 8 dígitos.');

  if (actuales && abrirConPin(pin, actuales) !== null) return pin; // el de siempre

  if (actuales) {
    console.log('   ⚠️  Ese no es el PIN actual de la zona privada.');
    console.log(
      '      Si quieres CAMBIARLO por este, repítelo. Si te has equivocado, pulsa Enter.',
    );
  }
  const pin2 = await preguntarOculto('   Repite el PIN:    ');
  if (pin !== pin2) throw new Error('No coinciden: no he cambiado nada.');
  if (actuales) console.log('   🔑 PIN cambiado.');
  return pin;
}

function cifrar(pin, contenido) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const clave = crypto.pbkdf2Sync(pin, salt, ITERACIONES, 32, 'sha256');
  const cifrador = crypto.createCipheriv('aes-256-gcm', clave, iv);
  const cifrado = Buffer.concat([
    cifrador.update(contenido, 'utf8'),
    cifrador.final(),
    cifrador.getAuthTag(), // WebCrypto espera la etiqueta al final
  ]);
  const datos = {
    v: 1,
    iter: ITERACIONES,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    datos: cifrado.toString('base64'),
  };
  fs.writeFileSync(
    SALIDA,
    '/* Generado por generador/cifrar-privado.js — contenido CIFRADO de la\n' +
      '   zona privada (privado.html). No editar a mano. */\n' +
      'window.SC_PRIVADO = ' +
      JSON.stringify(datos) +
      ';\n',
  );
  fs.writeFileSync(MARCA, huella(contenido));
}

/**
 * Cifra la zona privada si hace falta.
 *   forzar = false (npm run subir): solo si el borrador cambió desde el
 *            último cifrado; si no, no pregunta nada.
 *   forzar = true  (a mano): siempre (sirve para cambiar el PIN).
 * Lanza un Error si algo va mal (PIN mal escrito, etc.).
 */
async function cifrarSiHaceFalta(forzar = false) {
  if (!fs.existsSync(FUENTE)) {
    if (!forzar) return; // sin zona privada en este PC: nada que hacer
    fs.mkdirSync(CARPETA_FUENTE, { recursive: true });
    fs.copyFileSync(PLANTILLA, FUENTE);
    console.log(
      '✏️  He creado ' +
        path.relative(RAIZ, FUENTE) +
        ' a partir de la plantilla.',
    );
    console.log('   Edítalo con tus proyectos y vuelve a ejecutar esto.');
    return;
  }

  const contenido = fs.readFileSync(FUENTE, 'utf8');
  let marca = null;
  try {
    marca = fs.readFileSync(MARCA, 'utf8').trim();
  } catch (e) {
    /* todavía sin marca (p. ej. cifrado con la versión anterior del script) */
  }
  if (!forzar && marca === huella(contenido)) return;

  if (!process.stdin.isTTY) {
    throw new Error(
      'Hay cambios en la zona privada pero no puedo pedirte el PIN (¿no es una terminal?).',
    );
  }

  console.log(
    '\n🔒 ' +
      (forzar
        ? 'Cifrando la zona privada…'
        : 'Puede que hayas cambiado la zona privada: hace falta tu PIN para cifrarla.'),
  );
  const pin = await pedirPin();

  // Sin marca pero con el mismo contenido ya cifrado: no hace falta
  // volver a subir nada, solo apuntar la marca.
  const actuales = datosActuales();
  if (!forzar && actuales && abrirConPin(pin, actuales) === contenido) {
    fs.writeFileSync(MARCA, huella(contenido));
    console.log('   ✔ Sin cambios en la zona privada.');
    return;
  }

  cifrar(pin, contenido);
  console.log(
    '   ✅ Zona privada cifrada en ' + path.relative(RAIZ, SALIDA) + '.',
  );
}

module.exports = { cifrarSiHaceFalta };

// Ejecutado a mano: siempre cifra.
if (require.main === module) {
  cifrarSiHaceFalta(true)
    .then(() => {
      if (fs.existsSync(MARCA)) console.log('   Súbelo con:  npm run subir');
    })
    .catch((e) => {
      console.error('❌ ' + e.message);
      process.exit(1);
    });
}
