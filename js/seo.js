/* ===================================
   SEO.JS
   Metadatos dinámicos centralizados para todas las páginas:
   - <link rel="canonical">
   - <meta property="og:url">
   - JSON-LD (WebSite + SportsTeam)

   Inclúyelo en el <head> de cada página, justo después de
   data-club.js, así:
     <script src="js/data-club.js?nocache=20260802v3"></script>
     <script src="js/seo.js?nocache=20260802v3"></script>

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
        logo: `${SITE_BASE_URL}/img/escudos/Oviedo.webp`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_BASE_URL}/buscador.html?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'ld-json-website';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // BreadcrumbList a partir del marcado visual .breadcrumb que ya
  // lleva cada página, para no tener que mantener las migas de pan
  // por duplicado (HTML visible + JSON-LD). Los enlaces href="#" son
  // etiquetas de categoría no navegables (p. ej. "Equipo"), así que
  // se omiten en vez de darles una URL falsa.
  function insertarBreadcrumbJsonLd() {
    if (document.getElementById('ld-json-breadcrumb')) return;
    const contenedor = document.querySelector('.breadcrumb');
    if (!contenedor) return;

    const pasos = [];
    contenedor.querySelectorAll('a, .current').forEach((el) => {
      const nombre = el.textContent.trim();
      if (!nombre) return;
      if (el.tagName === 'A') {
        const href = el.getAttribute('href');
        if (!href || href === '#') return;
        pasos.push({ nombre, url: new URL(href, window.location.href).href });
      } else {
        pasos.push({ nombre, url: urlCanonica() });
      }
    });
    if (pasos.length < 2) return;

    const data = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: pasos.map((paso, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: paso.nombre,
        item: paso.url,
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'ld-json-breadcrumb';
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
    insertarBreadcrumbJsonLd();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
