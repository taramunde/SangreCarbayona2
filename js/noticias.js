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
    url: 'https://www.lavozdeasturias.es/noticia/azulcarbayon/2026/05/17/tartiere-clama-continuidad-cazorla-alaves-salva/00031779040744849363977.htm',
    titulo:
      'El Tartiere clama por la continuidad de Cazorla y el Alavés se salva.',
    descripcion:
      'El Real Oviedo cayó por la mínima ante el Deportivo Alavés (0-1) en un partido marcado por los cánticos de todo el Tartiere pidiendo la continuidad de Santi Cazorla.',
    imagen: 'https://i.postimg.cc/s2qdz9L7/J-37-LVA.jpg',
    fecha: '17 mayo 2026',
  },
  {
    medio: 'lanuevaespana',
    url: 'https://www.lne.es/real-oviedo/2026/05/17/triste-colofon-temporada-olvido-derrota-130333595.html',
    titulo:
      'Triste colofón a una temporada para el olvido: derrota del Oviedo ante el Alavés (0-1).',
    descripcion:
      'Con Cazorla como titular, como objeto de los cánticos de un entregado Tartiere, los de Almada sucumben ante la efectividad del Alavés.',
    imagen: 'https://i.postimg.cc/tgwQbtc3/J-37-LNE.jpg',
    fecha: '17 mayo 2026',
  },
  {
    medio: 'elcomercio',
    url: 'https://www.elcomercio.es/real-oviedo/tartiere-clama-cazorla-quede-real-oviedo-20260517215639-nt.html',
    titulo: 'El Tartiere clama a Cazorla que se quede en el Real Oviedo.',
    descripcion:
      'El Oviedo pierde en el último encuentro de la temporada en casa con el centrocampista los 90 minutos en el campo y la afición pidiendo su continuidad y la marcha de Almada.',
    imagen: 'https://i.postimg.cc/tgwQbtcF/J-37-EC.jpg',
    fecha: '17 mayo 2026',
  },
  {
    medio: 'killerasturias',
    url: 'https://killerasturias.com/cronicas/la-cronica-el-oviedo-no-encuentra-ni-consuelo-en-el-tartiere',
    titulo: 'La Crónica: El Oviedo no encuentra ni consuelo en el Tartiere.',
    descripcion:
      'Los azules volvieron a quedarse sin premio pese a empujar durante toda la segunda mitad y cerraron su último partido en casa con una nueva derrota ante un Alavés que consiguió la salvación.',
    imagen: 'https://i.postimg.cc/rp3XTCHS/J-37-KA.jpg',
    fecha: '17 mayo 2026',
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
