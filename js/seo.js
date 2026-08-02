/* ===================================
   SEO.JS
   Metadatos dinámicos centralizados para todas las páginas:
   - <link rel="canonical">
   - <meta property="og:url">
   - JSON-LD (WebSite + SportsTeam)

   Inclúyelo en el <head> de cada página, justo después de
   data-club.js, así:
     <script src="js/data-club.js?nocache=20260802v2"></script>
     <script src="js/seo.js?nocache=20260802v2"></script>

   Mantener esto en un único archivo evita tener que repetir/editar
   estas etiquetas a mano en cada HTML del proyecto.
   =================================== */

(function () {
  const SITE_BASE_URL = 'https://taramunde.github.io/SangreCarbayona2';

  function rutaRelativa() {
    // Quita todo lo anterior a "SangreCarbayona2/" para quedarnos
    // con la ruta relativa real de la página (funciona igual en
    // local, en GitHub Pages y dentro de /fichas/).
    const partes = window.location.pathname.split('SangreCarbayona2/');
    return partes.length > 1 ? partes[1] : '';
  }

  function urlCanonica() {
    const relativa = rutaRelativa();
    return relativa ? `${SITE_BASE_URL}/${relativa}` : `${SITE_BASE_URL}/`;
  }

  function insertarCanonical() {
    if (document.querySelector('link[rel="canonical"]')) return;
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = urlCanonica();
    document.head.appendChild(link);
  }

  function insertarOgUrl() {
    if (document.querySelector('meta[property="og:url"]')) return;
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:url');
    meta.setAttribute('content', urlCanonica());
    document.head.appendChild(meta);
  }

  function insertarJsonLd() {
    if (document.getElementById('ld-json-website')) return;

    const data = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Sangre Carbayona',
      url: `${SITE_BASE_URL}/`,
      inLanguage: 'es',
      description:
        'Web de aficionados del Real Oviedo: noticias, plantilla, estadísticas, calendario y clasificación.',
      about: {
        '@type': 'SportsTeam',
        name: 'Real Oviedo',
        sport: 'Fútbol',
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'ld-json-website';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function init() {
    // Las fichas dinámicas (ficha-jugador.html) llevan noindex,nofollow
    // a propósito: los crawlers deben indexar las fichas estáticas de
    // /fichas/ en su lugar. Aun así el canonical/og:url no hacen daño
    // y mantienen los metadatos consistentes si se comparte el enlace.
    insertarCanonical();
    insertarOgUrl();
    insertarJsonLd();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();