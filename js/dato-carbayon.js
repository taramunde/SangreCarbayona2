/* ===================================
   EL CARBAYÓN CUENTA
   Pequeña franja de historia y cultura carbayona en la home, en el
   hueco donde antes iba el bloque de patrocinadores (de momento solo
   había uno, de relleno). Un dato o frase distinto cada día, elegido
   de forma determinista por el día del año, para que no haga falta
   ningún temporizador ni recargar la página para verlo cambiar.

   De momento solo en castellano (ver LEEME.md si se traduce en el
   futuro, siguiendo el mismo patrón data-i18n que el resto de la web).
   =================================== */

(function () {
  const DATOS_CARBAYON = [
    {
      icono: 'fa-tree',
      texto:
        'El apodo "carbayón" viene del Carbayón, el roble centenario que durante siglos presidió la plaza de la Catedral de Oviedo y que dio nombre a toda una forma de ser ovetense.',
    },
    {
      icono: 'fa-shield-halved',
      texto:
        'El Real Oviedo se fundó en 1926, fruto de la fusión de varios clubes ovetenses, y es el decano del fútbol asturiano.',
    },
    {
      icono: 'fa-landmark',
      texto:
        'El estadio Carlos Tartiere lleva el nombre del presidente que impulsó el primer campo propio del club, a comienzos del siglo pasado.',
    },
    {
      icono: 'fa-shirt',
      texto:
        'Azul y blanco visten la camiseta carbayona desde los orígenes del club, bajo un escudo rematado por la corona y la cruz de la Victoria.',
    },
    {
      icono: 'fa-star',
      texto:
        'En los años 90 el Oviedo vivió una de sus etapas doradas en Primera División, codeándose con los grandes del fútbol español.',
    },
    {
      icono: 'fa-heart',
      texto:
        'Cuando el club rozó la desaparición, miles de aficionados se convirtieron en accionistas para salvarlo: el Oviedo, literalmente, es de su gente.',
    },
    {
      icono: 'fa-shield-halved',
      texto:
        'El derbi asturiano frente al Sporting de Gijón es uno de los enfrentamientos regionales con más historia de todo el fútbol español.',
    },
    {
      icono: 'fa-futbol',
      texto:
        'Ser carbayón no es solo seguir a un equipo: es una manera de entender el fútbol, la ciudad y la gente que la habita.',
    },
  ];

  function diaDelAnio(fecha) {
    const inicio = new Date(fecha.getFullYear(), 0, 1);
    const diff = fecha - inicio;
    return Math.floor(diff / 86400000);
  }

  function render() {
    const contenedor = document.getElementById('carbayonDato');
    if (!contenedor) return;

    const indice = diaDelAnio(new Date()) % DATOS_CARBAYON.length;
    const dato = DATOS_CARBAYON[indice];

    contenedor.innerHTML = `
      <div class="carbayon-icon"><i class="fas ${dato.icono}"></i></div>
      <div class="carbayon-text">
        <span class="carbayon-kicker">El Carbayón cuenta</span>
        <p class="carbayon-frase">${dato.texto}</p>
      </div>
    `;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
