/* ================================================================
   NOTICIAS.JS — Sangre Carbayona 2
   Gestiona la carga de noticias en la página noticias.html
   y el widget de Últimas Noticias del index.html
   ================================================================

   INSTRUCCIONES:
   - Edita el array NOTICIAS_DATA con los 4 artículos que quieras mostrar.
   - Cada entrada puede tener imagen y descripción propias, o dejarlas en
     blanco para que el script intente obtenerlas vía jsonlink.io (OG tags).
   - Los logos de periódicos se cargan desde MEDIOS_CONFIG.
   - El índice 0 es la noticia DESTACADA (aparece en el home y grande en la página).
   ================================================================ */

/* ----------------------------------------------------------------
   1. CONFIGURACIÓN DE MEDIOS
   ---------------------------------------------------------------- */
const MEDIOS_CONFIG = {
  lavozdeasturias: {
    nombre: 'La Voz de Asturias',
    logo: 'https://i.postimg.cc/15Qs5NRP/logo_-_La_Voz_de_Asturias.webp',
    color: '#c0392b',
  },
  lanuevaespana: {
    nombre: 'La Nueva España',
    logo: 'https://i.postimg.cc/nV7nJ1J0/logo_-_La_Nueva_España.webp',
    color: '#004a99',
  },
  elcomercio: {
    nombre: 'El Comercio',
    logo: 'https://i.postimg.cc/FRkN1yJF/logo_-_El_Comercio.webp',
    color: '#2980b9',
  },
  killerasturias: {
    nombre: 'Killer Asturias',
    logo: 'https://i.postimg.cc/7hvDz5g3/logo_-_Killer_Asturias.webp',
    color: '#e74c3c',
  },
};

/* ----------------------------------------------------------------
   2. DATOS DE LAS NOTICIAS
   Edita estos 4 artículos con URLs reales.
   Si dejas imagen/descripcion vacíos, se intentará obtener del OG.
   ---------------------------------------------------------------- */
const NOTICIAS_DATA = [
  {
    medio: 'lavozdeasturias',
    url: 'https://www.lavozdeasturias.es/noticia/azulcarbayon/2026/05/10/digno-oviedo-evita-ante-getafe-descenso-matematico/00031778434275452249405.htm',
    titulo: 'Un digno Oviedo evita ante el Getafe el descenso matemático.',
    descripcion:
      'El Real Oviedo, muy condicionado por dos rojas en las que intervino el VAR, sacó un punto (0-0) que permite a los carbayones seguir siendo equipo de Primera. El Tartiere empezó a homenajear a Santi Cazorla.',
    imagen: 'https://i.postimg.cc/CMsp1rGy/J-35-LVA.jpg',
    fecha: '10 mayo 2026',
  },
  {
    medio: 'lanuevaespana',
    url: 'https://www.lne.es/real-oviedo/2026/05/10/orgulloso-oviedo-evita-descenso-tartiere-130070510.html',
    titulo:
      'Un orgulloso Oviedo evita el descenso en el Tartiere: empate con dos menos ante el Getafe (0-0).',
    descripcion:
      'Los azules rascan un punto en una tarde en la que el VAR mandó expulsar a Javi y Sibo.',
    imagen: 'https://i.postimg.cc/xj3VCpKs/J-35-LNE.webp',
    fecha: '10 mayo 2026',
  },
  {
    medio: 'elcomercio',
    url: 'https://www.elcomercio.es/real-oviedo/punto-coraje-prolongar-agonia-real-oviedo-20260510211128-nt.html',
    titulo: 'Punto de coraje para prolongar la agonía del Real Oviedo.',
    descripcion:
      'El Oviedo suma un punto en un partido en el que jugó mucho tiempo con dos menos y aplaza el descenso matemático, al menos, hasta el lunes.',
    imagen: 'https://i.postimg.cc/ZKYtyPcw/J-35-EC.jpg',
    fecha: '10 mayo 2026',
  },
  {
    medio: 'killerasturias',
    url: 'https://killerasturias.com/index.php/cronicas/la-cronica-el-oviedo-resiste-al-var-y-al-getafe',
    titulo: 'La Crónica: El Oviedo resiste al VAR y al Getafe.',
    descripcion:
      'Las expulsiones de Javi López y Sibo condicionaron a un conjunto azul que sostuvo el empate gracias al esfuerzo colectivo y a un gran Aarón Escandell.',
    imagen: 'https://i.postimg.cc/RVC5n1dV/J-35-KA.jpg',
    fecha: '10 mayo 2026',
  },
];

/* ----------------------------------------------------------------
   3. UTILIDADES
   ---------------------------------------------------------------- */
/**
 * Intenta obtener imagen y descripción de una URL vía jsonlink.io
 * si el artículo no tiene datos propios.
 */
async function fetchOGData(url) {
  try {
    const res = await fetch(
      `https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}`,
    );
    if (!res.ok) throw new Error('jsonlink error');
    const data = await res.json();
    return {
      titulo: data.title || '',
      descripcion: data.description || '',
      imagen: data.images && data.images[0] ? data.images[0] : '',
    };
  } catch {
    return null;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return dateStr;
}

/* ----------------------------------------------------------------
   4. RENDER — Página noticias.html
   ---------------------------------------------------------------- */
async function renderNoticiasPage() {
  const grid = document.getElementById('noticiasPageGrid');
  const loading = document.getElementById('noticiasLoading');
  const emptyState = document.getElementById('noticiasEmpty');
  const retryBtn = document.getElementById('btnRetry');

  if (!grid) return; // No estamos en noticias.html

  // Filtro de medios
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const medio = btn.dataset.medio;
      const cards = grid.querySelectorAll('.news-card');
      cards.forEach((card) => {
        if (medio === 'all' || card.dataset.medio === medio) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
        // Reajustar destacada si se filtra
        if (medio !== 'all') {
          card.classList.remove('featured');
        } else {
          cards[0] && cards[0].classList.add('featured');
        }
      });
    });
  });

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      emptyState.style.display = 'none';
      loading.style.display = 'flex';
      grid.style.display = 'none';
      buildCards();
    });
  }

  buildCards();

  async function buildCards() {
    try {
      const items = await Promise.all(
        NOTICIAS_DATA.map(async (n, i) => {
          let noticia = { ...n };
          // Si falta imagen o descripción, intentamos OG
          if (!noticia.imagen || !noticia.descripcion) {
            const og = await fetchOGData(noticia.url);
            if (og) {
              noticia.titulo = noticia.titulo || og.titulo;
              noticia.descripcion = noticia.descripcion || og.descripcion;
              noticia.imagen = noticia.imagen || og.imagen;
            }
          }
          return { ...noticia, index: i };
        }),
      );

      grid.innerHTML = '';
      items.forEach((n, i) => {
        const medio = MEDIOS_CONFIG[n.medio] || {
          nombre: n.medio,
          logo: '',
          color: '#333',
        };
        const card = document.createElement('article');
        card.className = 'news-card' + (i === 0 ? ' featured' : '');
        card.dataset.medio = n.medio;
        card.style.animationDelay = i * 0.07 + 's';

        card.innerHTML = `
                    <div class="news-card-img-wrap">
                        ${n.imagen ? `<img src="${n.imagen}" alt="${escHTML(n.titulo)}" loading="lazy" onerror="this.src='https://i.postimg.cc/8PjPkJHc/Real-Oviedo-Joya.png'">` : `<img src="https://i.postimg.cc/8PjPkJHc/Real-Oviedo-Joya.png" alt="Real Oviedo">`}
                        <div class="news-card-source-badge">
                            ${medio.logo ? `<img src="${medio.logo}" alt="${escHTML(medio.nombre)}" onerror="this.style.display='none'">` : ''}
                            <span>${escHTML(medio.nombre)}</span>
                        </div>
                    </div>
                    <div class="news-card-body">
                        <div class="news-card-meta">
                            <span class="news-card-date"><i class="far fa-calendar-alt"></i> ${escHTML(n.fecha)}</span>
                        </div>
                        <h2 class="news-card-title">${escHTML(n.titulo)}</h2>
                        ${n.descripcion ? `<p class="news-card-desc">${escHTML(n.descripcion)}</p>` : ''}
                        <a class="news-card-link" href="${n.url}" target="_blank" rel="noopener noreferrer">
                            Leer noticia <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                `;
        grid.appendChild(card);
      });

      loading.style.display = 'none';
      grid.style.display = 'grid';
    } catch (err) {
      console.error('Error cargando noticias:', err);
      loading.style.display = 'none';
      emptyState.style.display = 'flex';
    }
  }
}

/* ----------------------------------------------------------------
   5. RENDER — Widget homepage (index.html → #noticiasGrid)
   Solo muestra 1 noticia destacada (índice 0) en formato horizontal.
   ---------------------------------------------------------------- */
async function renderNoticiasWidget() {
  const grid = document.getElementById('noticiasGrid');
  if (!grid) return; // No estamos en index.html

  // Esqueleto mientras carga
  grid.innerHTML = `
        <div class="home-news-featured-wrap">
            <div class="home-news-featured-card" style="pointer-events:none; opacity:.45;">
                <div class="home-news-featured-img" style="background:#e8eeff;"></div>
                <div class="home-news-featured-body">
                    <div style="background:#e8eeff;height:18px;border-radius:4px;width:40%;margin-bottom:14px;"></div>
                    <div style="background:#e8eeff;height:32px;border-radius:4px;margin-bottom:10px;"></div>
                    <div style="background:#e8eeff;height:20px;border-radius:4px;width:70%;"></div>
                </div>
            </div>
        </div>
    `;

  // Solo la noticia en el índice 0
  const n = { ...NOTICIAS_DATA[0] };

  try {
    if (!n.imagen || !n.descripcion) {
      const og = await fetchOGData(n.url);
      if (og) {
        n.imagen = n.imagen || og.imagen;
        n.descripcion = n.descripcion || og.descripcion;
        n.titulo = n.titulo || og.titulo;
      }
    }

    const medio = MEDIOS_CONFIG[n.medio] || {
      nombre: n.medio,
      logo: '',
      color: '#333',
    };

    grid.innerHTML = `
            <div class="home-news-featured-wrap">
                <article class="home-news-featured-card">
                    <div class="home-news-featured-img">
                        ${
                          n.imagen
                            ? `<img src="${escHTML(n.imagen)}" alt="${escHTML(n.titulo)}" loading="lazy" onerror="this.src='https://i.postimg.cc/8PjPkJHc/Real-Oviedo-Joya.png'">`
                            : `<img src="https://i.postimg.cc/8PjPkJHc/Real-Oviedo-Joya.png" alt="Real Oviedo">`
                        }
                        <div class="home-news-source">
                            ${medio.logo ? `<img src="${escHTML(medio.logo)}" alt="${escHTML(medio.nombre)}" onerror="this.style.display='none'">` : ''}
                            <span>${escHTML(medio.nombre)}</span>
                        </div>
                    </div>
                    <div class="home-news-featured-body">
                        <p class="home-news-date"><i class="far fa-calendar-alt"></i> ${escHTML(n.fecha)}</p>
                        <h3 class="home-news-featured-title">${escHTML(n.titulo)}</h3>
                        ${n.descripcion ? `<p class="home-news-featured-desc">${escHTML(n.descripcion)}</p>` : ''}
                        <a class="home-news-link" href="${escHTML(n.url)}" target="_blank" rel="noopener noreferrer">
                            Leer noticia completa <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </article>
            </div>
        `;
  } catch (err) {
    console.error('Error cargando widget de noticias:', err);
    grid.innerHTML =
      '<p style="color:#888;padding:16px;font-family:Source Sans 3,sans-serif;">No se pudieron cargar las noticias.</p>';
  }
}

/* ----------------------------------------------------------------
   6. UTILIDAD: escape HTML básico
   ---------------------------------------------------------------- */
function escHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ----------------------------------------------------------------
   7. INIT — Detecta en qué página estamos y lanza el render
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('noticiasPageGrid')) {
    renderNoticiasPage();
  }
  if (document.getElementById('noticiasGrid')) {
    renderNoticiasWidget();
  }
});
