export function launchConfetti(canvas) {
  if (!canvas) return;

  // Ajustamos el tamaño interno del canvas al tamaño real de la pantalla
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const pieces = [];
  // Colores corporativos del Real Oviedo
  const colors = ['#001a6e', '#ffcc00', '#ffffff', '#0055A4', '#FDB913'];

  // Creamos 150 partículas de confeti
  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: canvas.width / 2, // Nacen en el centro de la pantalla
      y: canvas.height / 2 + 100,
      vx: (Math.random() - 0.5) * 30, // Velocidad horizontal aleatoria
      vy: (Math.random() - 1) * 25 - 5, // Salto hacia arriba aleatorio
      size: Math.random() * 12 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
    });
  }

  let animationId;

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.6; // Gravedad (hace que caigan)
      p.rotation += p.rotationSpeed;

      // Si alguna pieza sigue dentro de la pantalla, seguimos animando
      if (p.y < canvas.height) active = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      // Dibujamos el confeti cuadrado
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (active) {
      animationId = requestAnimationFrame(update);
    } else {
      // Cuando caen todos, limpiamos la pantalla
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Si redimensionan la pantalla mientras cae el confeti, reajustamos
  window.addEventListener(
    'resize',
    () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    },
    { once: true },
  );

  update();
}
