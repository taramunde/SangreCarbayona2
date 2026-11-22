/* ===================================
   CIFRAR-PRIVADO.JS
   Cifra el contenido de la zona privada (privado.html) con tu PIN.

   USO (desde la carpeta del proyecto):
     node generador/cifrar-privado.js

   Qué hace:
     1. Lee tu contenido de  privado-fuente/contenido.html
        (si no existe, lo crea a partir de generador/privado-plantilla.html
        y se para para que lo edites).
     2. Te pide el PIN (8 dígitos) dos veces. No se ve al escribirlo y
        NO se guarda en ningún sitio.
     3. Escribe  js/data-privado.js  con el contenido CIFRADO
        (AES-256-GCM + PBKDF2-SHA256). Eso es lo único que se sube.

   IMPORTANTE:
     - La carpeta privado-fuente/ está en .gitignore: NUNCA se sube a
       GitHub. Haz copia de seguridad de ella tú (si la pierdes, el
       contenido solo se puede recuperar con el PIN desde la web).
     - Cada vez que cambies el contenido, vuelve a ejecutar esto con el
       mismo PIN (o con otro, para cambiarlo) y sube data-privado.js.
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
const PLANTILLA = path.join(__dirname, 'privado-plantilla.html');
const SALIDA = path.join(RAIZ, 'js', 'data-privado.js');

// Iteraciones de PBKDF2: hacen cada intento lento a propósito (en un
// navegador normal, ~0,5 s). Tiene que coincidir lo que lee privado.js,
// que lo coge del propio archivo cifrado.
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

async function main() {
  if (!fs.existsSync(FUENTE)) {
    fs.mkdirSync(CARPETA_FUENTE, { recursive: true });
    fs.copyFileSync(PLANTILLA, FUENTE);
    console.log('✏️  He creado ' + path.relative(RAIZ, FUENTE) + ' a partir de la plantilla.');
    console.log('   Edítalo con tus proyectos y vuelve a ejecutar este script.');
    return;
  }

  if (!process.stdin.isTTY) {
    console.error('Ejecútalo en una terminal normal (necesito pedirte el PIN).');
    process.exit(1);
  }

  const pin = await preguntarOculto('PIN (8 dígitos): ');
  if (!/^\d{8}$/.test(pin)) {
    console.error('❌ El PIN tiene que ser exactamente 8 dígitos.');
    process.exit(1);
  }
  const pin2 = await preguntarOculto('Repite el PIN:    ');
  if (pin !== pin2) {
    console.error('❌ Los dos PIN no coinciden. No he cambiado nada.');
    process.exit(1);
  }

  const contenido = fs.readFileSync(FUENTE, 'utf8');
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

  console.log('✅ Contenido cifrado en ' + path.relative(RAIZ, SALIDA) + '.');
  console.log('   Súbelo:  git add . && git commit -m "Zona privada" && git push');
}

main();
