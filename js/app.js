/* ===================================
   FUNCIONES DE UTILIDAD (FECHAS)
   =================================== */

function formatearFecha(fechaStr) {
  let fecha;
  if (fechaStr.includes("T")) {
    fecha = new Date(fechaStr);
  } else {
    const parts = fechaStr.split("-");
    fecha = new Date(parts[0], parts[1] - 1, parts[2]);
  }

  const lang = localStorage.getItem("lang") || "es";

  const mesNombre = fecha.toLocaleDateString(lang, { month: "long" });
  const mesCorto = fecha.toLocaleDateString(lang, { month: "short" });
  let completa = fecha.toLocaleDateString(lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return {
    dia: fecha.getDate(),
    mes: capitalizar(mesNombre),
    mesCorto: capitalizar(mesCorto).replace(".", ""),
    año: fecha.getFullYear(),
    completa: completa,
  };
}

/* ===================================
   FUNCIONES AUXILIARES PARA PORTEROS
   =================================== */

function esPortero(jugador) {
  return jugador.posicion === "Portero" || jugador.posicionCorta === "POR";
}

/* ===================================
   APLICACIÓN - RENDERIZADO DINÁMICO
   =================================== */

const App = {
  temporadaActiva: null,

  init: function () {
    this.temporadaActiva = CLUB_DATA.temporadaActual;

    // Funciones de renderizado
    this.renderCalendario();
    this.renderPlantillaHome();
    this.renderNoticias();
    this.renderPatrocinadores();
    this.renderProximoPartido();
    this.renderSeasonSelector();
    this.renderEstadisticasEquipo();
    this.renderPlantillaCompleta();
    this.renderCuerpoTecnico();
    this.renderFichaJugador();
    this.renderJuegos();
    this.renderVideos();

    // Listeners de eventos
    this.setupHomeFilters();
  },

  setupHomeFilters: function () {
    const tabs = document.querySelectorAll(".position-tabs .tab-btn");
    if (!tabs.length) return;

    tabs.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        tabs.forEach((b) => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        const position = e.currentTarget.dataset.position;
        this.renderPlantillaHome(position);
      });
    });
  },

  renderSeasonSelector: function () {
    const container = document.getElementById("seasonSelector");
    if (!container) return;
    let html = '<div class="season-tabs">';
    CLUB_DATA.temporadasDisponibles.forEach((temp) => {
      const activeClass = temp.id === this.temporadaActiva ? "active" : "";
      const currentBadge = temp.actual
        ? '<span class="current-badge">' + t("current_badge") + "</span>"
        : "";
      html += `<button class="season-tab ${activeClass}" data-season="${temp.id}">${temp.nombre} ${currentBadge}</button>`;
    });
    html += "</div>";
    container.innerHTML = html;
    container.querySelectorAll(".season-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        this.changeSeason(e.currentTarget.dataset.season);
      });
    });
  },

  changeSeason: function (seasonId) {
    this.temporadaActiva = seasonId;
    document.querySelectorAll(".season-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.season === seasonId);
    });
    this.renderEstadisticasEquipo();
    this.renderPlantillaCompleta();
    this.renderCuerpoTecnico();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  renderCalendario: function () {
    const container = document.getElementById("calendarioList");
    if (!container) return;
    let html = "";
    CLUB_DATA.calendario.forEach((partido) => {
      const fecha = formatearFecha(partido.fecha);
      html += `<div class="match-item ${partido.esProximo ? "next" : ""}"><div class="match-date-box"><span class="day">${fecha.dia}</span><span class="month">${fecha.mesCorto}</span></div><div class="match-detail"><div class="teams"><span class="home-team">${partido.local}</span><span class="vs">-</span><span class="away-team">${partido.visitante}</span></div><div class="match-meta"><span><i class="far fa-clock"></i> ${partido.hora}</span><span><i class="fas fa-map-marker-alt"></i> ${partido.estadio}</span></div></div></div>`;
    });
    container.innerHTML = html;
  },

  renderPlantillaHome: function (filter = "all") {
    const container = document.getElementById("plantillaHomeGrid");
    if (!container) return;
    const temporada = getTemporada(CLUB_DATA.temporadaActual);

    // FUSIONAR con datos del maestro
    const jugadoresCompletos = temporada.jugadores
      .map((j) => getJugadorById(j.codigo || j.id, CLUB_DATA.temporadaActual))
      .filter((j) => j !== null);

    const positionGroups = {
      goalkeeper: ["Portero"],
      defender: ["Defensa", "Central", "Lateral Derecho", "Lateral Izquierdo"],
      midfielder: [
        "Centrocampista",
        "Mediocentro",
        "Mediocentro Defensivo",
        "Mediapunta",
      ],
      forward: [
        "Delantero",
        "Delantero Centro",
        "Extremo Derecho",
        "Extremo Izquierdo",
      ],
    };

    let playersToRender = jugadoresCompletos;
    if (filter !== "all") {
      const validPositions = positionGroups[filter] || [];
      playersToRender = jugadoresCompletos.filter((j) =>
        validPositions.includes(j.posicion),
      );
    }

    let html = "";
    playersToRender.slice(0, 8).forEach((jugador) => {
      html += this.renderJugadorCard(jugador);
    });

    if (playersToRender.length === 0) {
      html =
        '<p style="grid-column: 1/-1; text-align:center; opacity: 0.7;">No hay jugadores en esta categoría.</p>';
    }
    container.innerHTML = html;
  },

  renderNoticias: function () {
    const container = document.getElementById("noticiasGrid");
    if (!container) return;

    // DESTRUIR IMÁGENES CACHEADAS: eliminar el contenedor del DOM completamente
    // y crear uno nuevo para evitar que el navegador reutilice imágenes en memoria
    const parent = container.parentNode;
    const newContainer = document.createElement("div");
    newContainer.id = "noticiasGrid";
    newContainer.className = "news-grid";

    // Limpiar cualquier referencia cacheada
    const oldImages = container.querySelectorAll("img");
    oldImages.forEach((img) => {
      img.src = ""; // Liberar la referencia a la imagen
      img.removeAttribute("src");
    });

    parent.replaceChild(newContainer, container);

    let html = "";
    // Timestamp único por sesión para forzar recarga HTTP
    const sessionId = Date.now();

    CLUB_DATA.noticias.forEach((noticia, index) => {
      const fecha = formatearFecha(noticia.fecha);

      // CRÍTICO: Invalidar caché de la URL
      // Picsum ignora parámetros, pero el navegador hace nueva petición
      let imageUrl = noticia.imagen;
      if (imageUrl && imageUrl.includes("picsum.photos")) {
        // Reconstruir URL limpia y añadir parámetros anti-caché
        const baseUrl = imageUrl.split("?")[0];
        imageUrl = `${baseUrl}?random=${sessionId}-${index}`;
      } else if (imageUrl) {
        const separator = imageUrl.includes("?") ? "&" : "?";
        imageUrl = `${imageUrl}${separator}cb=${sessionId}-${index}`;
      }

      html += `<article class="news-card ${noticia.esPrincipal ? "main-news" : ""}">
        <a href="#" class="news-link">
          <div class="news-image">
            <img src="${imageUrl}" alt="${noticia.titulo}" crossorigin="anonymous" decoding="async" loading="eager">
            <span class="news-category">${noticia.categoria}</span>
          </div>
          <div class="news-content">
            <h3>${noticia.titulo}</h3>
            ${noticia.esPrincipal ? `<p>${noticia.resumen}</p>` : ""}
            <span class="news-date">${fecha.completa}</span>
          </div>
        </a>
      </article>`;
    });

    newContainer.innerHTML = html;
  },

  renderPatrocinadores: function () {
    const container = document.getElementById("patrocinadoresGrid");
    if (!container) return;
    container.innerHTML = CLUB_DATA.patrocinadores
      .map(
        (pat) =>
          `<div class="sponsor-item"><div class="sponsor-logo"><span>${pat.nombre}</span></div></div>`,
      )
      .join("");
  },

  renderProximoPartido: function () {
    const container = document.getElementById("heroMatch");
    if (!container) return;

    // Usar datos de clasificacion.js
    const partidos = window.enfrentamientos || [];
    const equipos = window.equipos || [];

    const OVIEDO = "Real Oviedo";
    const partidosOviedo = partidos
      .map((p, idx) => ({
        ...p,
        jornada: Math.floor(idx / 10) + 1,
        jugado: p.goles1 !== null && p.goles2 !== null,
      }))
      .filter((p) => p.equipo1 === OVIEDO || p.equipo2 === OVIEDO);

    const jugados = partidosOviedo.filter((p) => p.jugado);
    const ultimo = jugados.length > 0 ? jugados[jugados.length - 1] : null;
    const proximo = partidosOviedo.find((p) => !p.jugado) || null;

    const getEscudo = (nombre) => {
      const eq = equipos.find((e) => e.nombre === nombre);
      return eq ? eq.escudo : "";
    };

    const getResultadoData = (p) => {
      const esLocal = p.equipo1 === OVIEDO;
      const golesO = esLocal ? p.goles1 : p.goles2;
      const golesR = esLocal ? p.goles2 : p.goles1;
      if (golesO > golesR)
        return {
          tipo: "victoria",
          texto: t("victoria"),
          icono: "fa-check-circle",
          color: "win",
        };
      if (golesO < golesR)
        return {
          tipo: "derrota",
          texto: t("derrota"),
          icono: "fa-times-circle",
          color: "lose",
        };
      return {
        tipo: "empate",
        texto: t("empate"),
        icono: "fa-minus-circle",
        color: "",
      };
    };

    let html = "";

    // === ÚLTIMO PARTIDO ===
    if (ultimo) {
      const esLocal = ultimo.equipo1 === OVIEDO;
      const rival = esLocal ? ultimo.equipo2 : ultimo.equipo1;
      const resultado = getResultadoData(ultimo);
      const escudoO = getEscudo(OVIEDO);
      const escudoR = getEscudo(rival);
      const fechaStr = `${t("jornada_abrev")}${ultimo.jornada}`;

      // Para el último partido: equipo1 (local) a la izquierda, equipo2 (visitante) a la derecha
      const escudoIzq = ultimo.goles1 !== null ? getEscudo(ultimo.equipo1) : "";
      const escudoDer = ultimo.goles2 !== null ? getEscudo(ultimo.equipo2) : "";
      const equipoIzq = ultimo.equipo1;
      const equipoDer = ultimo.equipo2;

      html += `
        <div class="hero-block">
            <div class="hero-label-row">
                <span class="hero-comp-badge"><i class="fas fa-futbol"></i> LaLiga EA Sports</span>
                <span class="hero-jornada-badge">${fechaStr}</span>
            </div>
            <div class="hero-scoreboard">
                <div class="hero-team">
                    <img src="${escudoIzq}" alt="${equipoIzq}" class="hero-escudo ${equipoIzq === OVIEDO ? "hero-escudo--oviedo" : ""}">
                    <span class="hero-team-name ${equipoIzq === OVIEDO ? "hero-team-name--oviedo" : ""}">${equipoIzq}</span>
                    <span class="hero-team-tag">${t("local")}</span>
                </div>
                <div class="hero-score-center">
                    <div class="hero-score-box">
                        <span class="hero-score hero-score--${resultado.color}">${ultimo.goles1}</span>
                        <span class="hero-score-sep">–</span>
                        <span class="hero-score hero-score--${resultado.color}">${ultimo.goles2}</span>
                    </div>
                    <span class="hero-status hero-status--final">${t("finalizado")}</span>
                </div>
                <div class="hero-team">
                    <img src="${escudoDer}" alt="${equipoDer}" class="hero-escudo ${equipoDer === OVIEDO ? "hero-escudo--oviedo" : ""}">
                    <span class="hero-team-name ${equipoDer === OVIEDO ? "hero-team-name--oviedo" : ""}">${equipoDer}</span>
                    <span class="hero-team-tag">${t("visitante")}</span>
                </div>
            </div>
            <div class="hero-badge-result hero-badge--${resultado.tipo}">
                <i class="fas ${resultado.icono}"></i> ${resultado.texto}
            </div>
        </div>`;
    }

    if (ultimo && proximo) {
      html += '<div class="hero-divider"></div>';
    }

    // === PRÓXIMO PARTIDO ===
    if (proximo) {
      const esLocal = proximo.equipo1 === OVIEDO;
      const rival = esLocal ? proximo.equipo2 : proximo.equipo1;
      const escudoO = getEscudo(OVIEDO);
      const escudoR = getEscudo(rival);

      // CORRECCIÓN: equipo1 siempre es local (izquierda), equipo2 siempre es visitante (derecha)
      const escudoIzq = getEscudo(proximo.equipo1);
      const escudoDer = getEscudo(proximo.equipo2);
      const equipoIzq = proximo.equipo1;
      const equipoDer = proximo.equipo2;

      const fechaStr = `${t("jornada_abrev")}${proximo.jornada}`;

      html += `
        <div class="hero-block">
            <div class="hero-label-row">
                <span class="hero-comp-badge"><i class="fas fa-futbol"></i> LaLiga EA Sports</span>
                <span class="hero-jornada-badge">${fechaStr}</span>
            </div>
            <div class="hero-scoreboard">
                <div class="hero-team">
                    <img src="${escudoIzq}" alt="${equipoIzq}" class="hero-escudo ${equipoIzq === OVIEDO ? "hero-escudo--oviedo" : ""}">
                    <span class="hero-team-name ${equipoIzq === OVIEDO ? "hero-team-name--oviedo" : ""}">${equipoIzq}</span>
                    <span class="hero-team-tag">${t("local")}</span>
                </div>
                <div class="hero-score-center">
                    <div class="hero-score-box hero-score-box--upcoming">
                        <span class="hero-vs">VS</span>
                    </div>
                    <span class="hero-status hero-status--upcoming">
                        <i class="fas fa-clock"></i> ${t("por_disputar")}
                    </span>
                </div>
                <div class="hero-team">
                    <img src="${escudoDer}" alt="${equipoDer}" class="hero-escudo ${equipoDer === OVIEDO ? "hero-escudo--oviedo" : ""}">
                    <span class="hero-team-name ${equipoDer === OVIEDO ? "hero-team-name--oviedo" : ""}">${equipoDer}</span>
                    <span class="hero-team-tag">${t("visitante")}</span>
                </div>
            </div>
            <div class="hero-badge-result hero-badge--proximo">
                <i class="fas fa-calendar-alt"></i> ${t("proximo_partido_label")} · ${esLocal ? t("en_casa") : t("fuera")}
            </div>
        </div>`;
    }

    container.innerHTML = html;

    // === INYECTAR ESTILOS CSS (crítico para el tamaño correcto) ===
    if (!document.getElementById("heroMatchStyles")) {
      const s = document.createElement("style");
      s.id = "heroMatchStyles";
      s.textContent = `
            #heroMatch { display: flex; align-items: stretch; justify-content: center; flex-wrap: wrap; gap: 0; }
            .hero-block { flex: 1; min-width: 260px; max-width: 460px; display: flex; flex-direction: column; gap: 14px; padding: 28px 20px 20px; }
            .hero-divider { width: 1px; background: rgba(255,255,255,0.12); margin: 24px 0; flex-shrink: 0; }
            .hero-label-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
            .hero-comp-badge { font-size: .7em; font-weight: 700; color: #ffcc00; text-transform: uppercase; letter-spacing: .5px; display: flex; align-items: center; gap: 5px; }
            .hero-jornada-badge { font-size: .68em; font-weight: 600; color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: .4px; }
            .hero-scoreboard { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
            .hero-team { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; min-width: 0; }
            .hero-escudo { width: 54px; height: 54px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,.5)); }
            .hero-escudo--oviedo { filter: drop-shadow(0 0 10px rgba(255,204,0,.4)); }
            .hero-team-name { font-family: 'Oswald',sans-serif; font-size: .8em; font-weight: 600; color: rgba(255,255,255,.8); text-align: center; text-transform: uppercase; letter-spacing: .3px; line-height: 1.2; }
            .hero-team-name--oviedo { color: #ffcc00; }
            .hero-team-tag { font-size: .6em; color: rgba(255,255,255,.35); text-transform: uppercase; letter-spacing: .5px; font-weight: 600; }
            .hero-score-center { display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; }
            .hero-score-box { display: flex; align-items: center; gap: 2px; background: rgba(0,0,0,.35); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: 10px 18px; }
            .hero-score-box--upcoming { background: rgba(255,204,0,.08); border-color: rgba(255,204,0,.2); padding: 12px 22px; }
            .hero-score { font-family: 'Oswald',sans-serif; font-size: 2em; font-weight: 700; color: white; line-height: 1; min-width: 26px; text-align: center; }
            .hero-score--win { color: #69f0ae; }
            .hero-score--lose { color: #ff6e6e; }
            .hero-score-sep { font-family: 'Oswald',sans-serif; font-size: 1.4em; color: rgba(255,255,255,.25); margin: 0 5px; }
            .hero-vs { font-family: 'Oswald',sans-serif; font-size: 1.6em; font-weight: 700; color: rgba(255,204,0,.65); letter-spacing: 3px; }
            .hero-status { font-size: .68em; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
            .hero-status--final { color: rgba(255,255,255,.4); }
            .hero-status--upcoming { color: rgba(255,204,0,.75); display: flex; align-items: center; gap: 5px; text-align: center; }
            .hero-badge-result { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: .7em; font-weight: 700; padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: .4px; align-self: center; }
            .hero-badge--victoria { background: rgba(105,240,174,.15); color: #69f0ae; border: 1px solid rgba(105,240,174,.3); }
            .hero-badge--derrota { background: rgba(255,110,110,.15); color: #ff6e6e; border: 1px solid rgba(255,110,110,.3); }
            .hero-badge--empate { background: rgba(255,255,255,.1); color: rgba(255,255,255,.6); border: 1px solid rgba(255,255,255,.2); }
            .hero-badge--proximo { background: rgba(255,204,0,.15); color: #ffcc00; border: 1px solid rgba(255,204,0,.3); }
            
            @media(max-width:640px) {
                .hero-block { padding: 18px 12px 14px; min-width: 100%; }
                .hero-divider { width: 100%; height: 1px; margin: 0; }
                .hero-escudo { width: 42px; height: 42px; }
                .hero-score { font-size: 1.6em; }
                .hero-team-name { font-size: .72em; }
            }
        `;
      document.head.appendChild(s);
    }
  },

  renderEstadisticasEquipo: function () {
    const container = document.getElementById("teamStatsGrid");
    if (!container) return;
    const stats = getTemporada(this.temporadaActiva).estadisticasEquipo;
    container.innerHTML = `
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-trophy"></i></div><div class="stat-number">${stats.posicion}º</div><div class="stat-label">${t("posicion")}</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-futbol"></i></div><div class="stat-number">${stats.golesFavor}</div><div class="stat-label">${t("goles_favor")}</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-shield-alt"></i></div><div class="stat-number">${stats.golesContra}</div><div class="stat-label">${t("goles_contra")}</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-check-circle"></i></div><div class="stat-number">${stats.victorias}</div><div class="stat-label">${t("victorias")}</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-handshake"></i></div><div class="stat-number">${stats.empates}</div><div class="stat-label">${t("empates")}</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-times-circle"></i></div><div class="stat-number">${stats.derrotas}</div><div class="stat-label">${t("derrotas")}</div></div>`;
  },

  renderPlantillaCompleta: function () {
    const container = document.getElementById("plantillaCompleta");
    if (!container) return;
    const temporada = getTemporada(this.temporadaActiva);

    // FUSIONAR con datos del maestro
    const jugadoresCompletos = temporada.jugadores
      .map((j) => getJugadorById(j.codigo || j.id, this.temporadaActiva))
      .filter((j) => j !== null);

    const posiciones = {
      [t("porteros")]: ["Portero"],
      [t("defensas")]: ["Lateral Derecho", "Lateral Izquierdo", "Central"],
      [t("centrocampistas")]: [
        "Mediocentro Defensivo",
        "Centrocampista",
        "Mediocentro",
        "Mediapunta",
      ],
      [t("delanteros")]: [
        "Delantero Centro",
        "Extremo Derecho",
        "Extremo Izquierdo",
        "Delantero",
      ],
    };

    let html = "";
    for (const [nombrePosicion, posicionesLista] of Object.entries(
      posiciones,
    )) {
      const jugadoresPos = jugadoresCompletos.filter((j) =>
        posicionesLista.includes(j.posicion),
      );
      if (jugadoresPos.length === 0) continue;
      let icon = "fa-user";
      if (nombrePosicion.includes("Port") || nombrePosicion.includes("Goal"))
        icon = "fa-hand-paper";
      else if (
        nombrePosicion.includes("Def") ||
        nombrePosicion.includes("Back")
      )
        icon = "fa-shield-alt";
      else if (
        nombrePosicion.includes("Centro") ||
        nombrePosicion.includes("Mid")
      )
        icon = "fa-sync-alt";
      else if (
        nombrePosicion.includes("Delan") ||
        nombrePosicion.includes("Forward")
      )
        icon = "fa-bullseye";
      html += `<div class="position-group"><h3 class="position-title"><span class="position-icon"><i class="fas ${icon}"></i></span>${nombrePosicion}</h3><div class="squad-grid">`;
      jugadoresPos.forEach((jugador) => {
        html += this.renderJugadorCard(jugador);
      });
      html += `</div></div>`;
    }
    container.innerHTML = html;
  },

  renderJugadorCard: function (jugador) {
    // Calcular edad si no existe pero hay fecha de nacimiento
    let edadMostrar = jugador.edad;
    if (!edadMostrar && jugador.fechaNacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(jugador.fechaNacimiento);
      edadMostrar = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edadMostrar--;
      }
    }
    // Si sigue sin haber edad, mostrar mensaje
    if (!edadMostrar) {
      edadMostrar = t("desconocida") || "Desconocida";
    }

    const ribbonHtml = jugador.fallecido
      ? '<div class="deceased-ribbon"></div>'
      : "";
    const playerUrl = jugador.codigo
      ? `fichas/${jugador.codigo}.html`
      : `ficha-jugador.html?id=${jugador.id}&season=${this.temporadaActiva}`;

    // DIFERENCIAR GOLES/ENCAJADOS PARA PORTEROS
    const esPorteroPos = esPortero(jugador);
    const golesStats = esPorteroPos
      ? `<div class="mini-stat conceded"><span class="mini-stat-value" style="color:#e74c3c">${jugador.stats.goles || 0}</span><span class="mini-stat-label">Encajados</span></div>`
      : `<div class="mini-stat"><span class="mini-stat-value">${jugador.stats.goles || 0}</span><span class="mini-stat-label">${t("goles")}</span></div>`;

    return `
    <article class="squad-card">
      <a href="${playerUrl}" class="squad-link">
        <div class="squad-image">
          <img src="${jugador.imagen}" alt="${jugador.nombreCompleto}">
          <span class="squad-number">${jugador.dorsal}</span>
          ${ribbonHtml}
          <div class="squad-overlay"><span class="view-profile">${t("ver_ficha")}</span></div>
        </div>
        <div class="squad-info">
          <h4 class="squad-name">${jugador.apodo || jugador.nombre}</h4>
          <span class="squad-position">${translatePosition(jugador.posicion)}</span>
          <div class="squad-meta">
            <span><i class="far fa-calendar"></i> ${edadMostrar}${typeof edadMostrar === "number" ? " " + (t("edad") || "años") : ""}</span>
            <span><i class="fas fa-ruler-vertical"></i> ${jugador.altura ? jugador.altura + "m" : t("desconocida")}</span>
          </div>
          <div class="squad-stats">
            <div class="mini-stat"><span class="mini-stat-value">${jugador.stats.partidos}</span><span class="mini-stat-label">${t("partidos")}</span></div>
            ${golesStats}
          </div>
        </div>
      </a>
    </article>`;
  },

  renderCuerpoTecnico: function () {
    const container = document.getElementById("cuerpoTecnicoGrid");
    if (!container) return;
    const temporada = getTemporada(this.temporadaActiva);
    let html = "";
    temporada.cuerpoTecnico.forEach((miembro) => {
      html += `<article class="coach-card ${miembro.esPrincipal ? "main-coach" : ""}"><div class="coach-image"><img src="${miembro.imagen}" alt="${miembro.nombre}"></div><div class="coach-info"><span class="coach-role">${miembro.cargo}</span><h3 class="coach-name">${miembro.nombre}</h3><p class="coach-bio">${miembro.descripcion}</p>${miembro.estadisticas ? `<div class="coach-stats"><div class="coach-stat"><span class="coach-stat-value">${miembro.estadisticas.partidos}</span><span class="coach-stat-label">${t("partidos")}</span></div><div class="coach-stat"><span class="coach-stat-value">${Math.round((miembro.estadisticas.victorias / miembro.estadisticas.partidos) * 100)}%</span><span class="coach-stat-label">${t("victorias")}</span></div></div>` : ""}</div></article>`;
    });
    container.innerHTML = html;
  },

  renderFichaJugador: function () {
    const container = document.getElementById("fichaJugadorContent");
    if (!container) return;
    let jugadorId, seasonId;
    if (window.PLAYER_DATA_STATIC) {
      jugadorId =
        window.PLAYER_DATA_STATIC.id || window.PLAYER_DATA_STATIC.codigo;
      seasonId = window.PLAYER_DATA_STATIC.season;
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      jugadorId =
        urlParams.get("id") ||
        urlParams.get("codigo") ||
        urlParams.get("player");
      seasonId = urlParams.get("season") || CLUB_DATA.temporadaActual;
    }
    const jugador = getJugadorById(jugadorId, seasonId);
    if (!jugador) {
      container.innerHTML =
        '<p style="text-align:center; padding:40px;">Jugador no encontrado</p>';
      return;
    }
    document.title = `${jugador.nombreCompleto} | ${CLUB_DATA.club.nombreCorto}`;
    this.updateMetaTags(jugador);
    const breadcrumb = document.querySelector(".breadcrumb .current");
    if (breadcrumb) breadcrumb.textContent = jugador.nombreCompleto;
    const esTemporadaActual = seasonId === CLUB_DATA.temporadaActual;
    const haFallecido = jugador.fallecido === true;
    const fechaFallecimiento = jugador.fechaFallecimiento || null;

    // CALCULAR EDAD
    let edadMostrar = jugador.edad;
    if (!edadMostrar && jugador.fechaNacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(jugador.fechaNacimiento);
      edadMostrar = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edadMostrar--;
      }
    }
    // Si está fallecido, calcular edad al fallecer
    if (haFallecido && fechaFallecimiento && jugador.fechaNacimiento) {
      const nacimiento = new Date(jugador.fechaNacimiento);
      const muerte = new Date(fechaFallecimiento);
      let edadMuerte = muerte.getFullYear() - nacimiento.getFullYear();
      const m = muerte.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && muerte.getDate() < nacimiento.getDate()))
        edadMuerte--;
      edadMostrar = edadMuerte;
    }
    // Fallback final
    if (!edadMostrar) {
      edadMostrar = t("desconocida") || "Desconocida";
    }

    const pageUrl = window.location.href;
    const shareText = `Ficha de ${jugador.nombreCompleto} - ${CLUB_DATA.club.nombreCorto}`;
    const shareLinks = `
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + pageUrl)}" target="_blank" class="player-social whatsapp" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
            <a href="https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="player-social telegram" title="Telegram"><i class="fab fa-telegram-plane"></i></a>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="player-social twitter" title="Twitter"><i class="fab fa-twitter"></i></a>`;

    // DIFERENCIAR ESTADÍSTICAS PARA PORTEROS EN LA FICHA
    const esPorteroPos = esPortero(jugador);
    const golesLabel = esPorteroPos ? "Goles Encajados" : t("goles") || "Goles";
    const golesValue = esPorteroPos
      ? `<span style="color:#e74c3c;font-weight:700">${jugador.stats.goles || 0}</span>`
      : jugador.stats.goles || 0;
    const iconoGoles = esPorteroPos ? "fa-shield-alt" : "fa-futbol";

    container.innerHTML = `
            <div class="player-photo-container">
                <div class="player-photo-wrapper">
                    <img src="${jugador.imagen}" alt="${jugador.nombreCompleto}" class="player-main-photo">
                    <div class="player-number-large">${jugador.dorsal}</div>
                    <div class="player-role-badge"><span>${translatePosition(jugador.posicion)}</span></div>
                    ${haFallecido ? '<div class="deceased-ribbon"></div>' : ""}
                </div>
            </div>
            <div class="player-info-container">
                <div class="player-name-section">
                    <span class="player-position-label">${translatePosition(jugador.posicion)}</span>
                    <h1 class="player-full-name">${jugador.nombreCompleto}</h1>
                    <div class="player-social-links">${shareLinks}</div>
                </div>
                <div class="player-quick-stats">${this.renderQuickStats(jugador, haFallecido, fechaFallecimiento, edadMostrar, esTemporadaActual)}</div>
                <div class="player-season-stats">
                    <h3 class="stats-title">${t("temporada")} ${seasonId.replace("-", "/")}</h3>
                    <div class="season-stats-grid">
                        <div class="season-stat ${esPorteroPos ? "portero-stat" : ""}"><div class="season-stat-icon"><i class="fas ${iconoGoles}"></i></div><div class="season-stat-content"><span class="season-stat-value">${golesValue}</span><span class="season-stat-label">${golesLabel}</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-hands-helping"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.asistencias || 0}</span><span class="season-stat-label">${t("asistencias")}</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-running"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.partidos}</span><span class="season-stat-label">${t("partidos")}</span></div></div>
                        <div class="season-stat"><div class="season-stat-icon"><i class="fas fa-clock"></i></div><div class="season-stat-content"><span class="season-stat-value">${jugador.stats.minutos.toLocaleString()}</span><span class="season-stat-label">${t("minutos")}</span></div></div>
                    </div>
                </div>
            </div>`;
    this.renderFichaOverview(jugador);
    this.renderFichaMatches(jugador, seasonId);
    this.renderFichaCareerHistory(jugador, seasonId);
  },

  updateMetaTags: function (jugador) {
    let metaImage = document.querySelector('meta[property="og:image"]');
    if (!metaImage) {
      metaImage = document.createElement("meta");
      metaImage.setAttribute("property", "og:image");
      document.head.appendChild(metaImage);
    }
    metaImage.setAttribute("content", jugador.imagen);
  },

  renderQuickStats: function (
    jugador,
    haFallecido,
    fechaFallecimiento,
    edadMostrar,
    esTemporadaActual,
  ) {
    const altura = jugador.altura ? `${jugador.altura}m` : t("desconocida");
    let html = "";
    if (esTemporadaActual) {
      // Solo mostrar edad y altura, los goles/encajados aparecen abajo en el grid
      html = `<div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">${t("edad")}</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">${t("altura")}</span></div>`;
    } else {
      if (haFallecido) {
        const fechaFormateada = fechaFallecimiento
          ? formatearFecha(fechaFallecimiento).completa
          : t("fecha_desconocida");
        html = `<div class="quick-stat"><span class="quick-stat-value deceased-text">${fechaFormateada}</span><span class="quick-stat-label">${t("fallecimiento")}</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">${t("altura")}</span></div><div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">${t("edad")}</span></div>`;
      } else {
        // Solo edad y altura, sin goles/encajados (ya aparecen abajo)
        html = `<div class="quick-stat"><span class="quick-stat-value">${edadMostrar}</span><span class="quick-stat-label">${t("edad")}</span></div><div class="quick-stat"><span class="quick-stat-value">${altura}</span><span class="quick-stat-label">${t("altura")}</span></div>`;
      }
    }
    return html;
  },

  renderFichaOverview: function (jugador) {
    const container = document.getElementById("tabOverview");
    if (!container) return;
    const fechaNac = formatearFecha(jugador.fechaNacimiento);

    // DIFERENCIAR CÁLCULOS PARA PORTEROS
    const esPorteroPos = esPortero(jugador);
    const golesPorPartido = esPorteroPos
      ? jugador.stats.partidos > 0
        ? (jugador.stats.goles / jugador.stats.partidos).toFixed(2)
        : "0.00"
      : jugador.stats.partidos > 0
        ? (jugador.stats.goles / jugador.stats.partidos).toFixed(2)
        : "0.00";

    const minutosPorPartido =
      jugador.stats.partidos > 0
        ? Math.round(jugador.stats.minutos / jugador.stats.partidos)
        : 0;

    const golesPorcentaje =
      jugador.stats.partidos > 0
        ? Math.min((jugador.stats.goles / jugador.stats.partidos) * 100, 100)
        : 0;

    const minutosPorcentaje =
      jugador.stats.partidos > 0
        ? Math.min(
            (jugador.stats.minutos / jugador.stats.partidos / 90) * 100,
            100,
          )
        : 0;

    const rendimientoTitle = esPorteroPos
      ? "Rendimiento Defensivo"
      : t("rendimiento") || "Rendimiento";
    const golesPartidoLabel = esPorteroPos
      ? "Goles Encajados/Partido"
      : t("goles_partido") || "Goles por partido";
    const golesColor = esPorteroPos ? "#e74c3c" : "var(--secondary-color)";

    container.innerHTML = `
            <div class="overview-grid">
                <div class="performance-card">
                    <h3 class="card-title">${rendimientoTitle}</h3>
                    <div class="performance-stats">
                        <div class="performance-item"><div class="performance-header"><span>${golesPartidoLabel}</span><span class="performance-value" style="color:${golesColor}">${golesPorPartido}</span></div><div class="performance-bar"><div class="performance-fill" style="width: ${golesPorcentaje}%; background:${golesColor}"></div></div></div>
                        <div class="performance-item"><div class="performance-header"><span>${t("minutos_partido") || "Minutos por partido"}</span><span class="performance-value">${minutosPorPartido}'</span></div><div class="performance-bar"><div class="performance-fill" style="width: ${minutosPorcentaje}%"></div></div></div>
                    </div>
                </div>
                <div class="personal-info-card">
                    <h3 class="card-title">${t("informacion") || "Información Personal"}</h3>
                    <div class="personal-info-list">
                        <div class="info-row"><span class="info-label"><i class="far fa-calendar"></i> ${t("nacimiento") || "Nacimiento"}</span><span class="info-value">${fechaNac.completa}</span></div>
                        <div class="info-row"><span class="info-label"><i class="fas fa-map-marker-alt"></i> ${t("lugar") || "Lugar"}</span><span class="info-value">${jugador.lugarNacimiento}</span></div>
                        <div class="info-row"><span class="info-label"><i class="fas fa-flag"></i> ${t("nacionalidad") || "Nacionalidad"}</span><span class="info-value">${jugador.nacionalidad}</span></div>
                        <div class="info-row"><span class="info-label"><i class="far fa-calendar-check"></i> ${t("en_club_desde") || "En club desde"}</span><span class="info-value">${jugador.enClubDesde}</span></div>
                    </div>
                </div>
                <div class="disciplinary-card">
                    <h3 class="card-title">${t("disciplina") || "Disciplina"}</h3>
                    <div class="cards-display">
                        <div class="card-item yellow"><div class="card-icon"><i class="fas fa-square"></i></div><div class="card-info"><span class="card-count">${jugador.stats.amarillas ?? 0}</span><span class="card-label">${t("amarillas") || "Amarillas"}</span></div></div>
                        <div class="card-item red"><div class="card-icon"><i class="fas fa-square"></i></div><div class="card-info"><span class="card-count">${jugador.stats.rojas ?? 0}</span><span class="card-label">${t("rojas") || "Rojas"}</span></div></div>
                    </div>
                </div>
            </div>`;
  },

  renderFichaMatches: function (jugador, seasonId, filtroCompeticion = "all") {
    const container = document.getElementById("tabMatches");
    if (!container) return;

    const temporada = getTemporada(seasonId);

    // FIX: Solo usar fallback de temporada si partidos es null/undefined
    // Si es array vacío [], significa que el jugador no ha jugado partidos (no hay fallback)
    const tienePartidosDefinidos =
      jugador.partidos !== null && jugador.partidos !== undefined;
    const listaPartidos = tienePartidosDefinidos
      ? jugador.partidos
      : temporada.partidosJugados || [];

    // El jugador tiene array de partidos explícito (incluso si está vacío)
    const tienePartidosIndividuales = tienePartidosDefinidos;

    if (listaPartidos.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:#666; padding: 20px;">No hay datos de partidos para este jugador.</p>`;
      return;
    }

    const competiciones = [
      "all",
      ...new Set(
        listaPartidos.map((p) => p.competicion || temporada.competicion),
      ),
    ];
    const partidosFiltrados =
      filtroCompeticion === "all"
        ? listaPartidos
        : listaPartidos.filter(
            (p) =>
              (p.competicion || temporada.competicion) === filtroCompeticion,
          );

    let html = `
            <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 20px; gap: 10px; flex-wrap: wrap;">
                <label for="filterMatches" style="font-weight: 600; color: #333;">Competición:</label>
                <select id="filterMatches" style="padding: 8px 12px; border-radius: 6px; border: 1px solid #ccd6ff; background: #f0f4ff; color: #001a6e; font-family: 'Source Sans 3', sans-serif; font-weight: 600; cursor: pointer; outline: none;">
                    ${competiciones.map((c) => `<option value="${c}" ${c === filtroCompeticion ? "selected" : ""}>${c === "all" ? "Todas las competiciones" : c}</option>`).join("")}
                </select>
            </div>
            <div class="matches-list">`;

    if (partidosFiltrados.length === 0) {
      html += `<p style="text-align:center; color:#666; padding: 20px; width: 100%;">No hay partidos en esta competición.</p>`;
    } else {
      partidosFiltrados.forEach((partido) => {
        const fecha = formatearFecha(partido.fecha);
        const resultClass =
          partido.resultado === "V"
            ? "win"
            : partido.resultado === "E"
              ? "draw"
              : "loss";
        const compNombre = partido.competicion || temporada.competicion;
        const jorTexto =
          typeof partido.jornada === "number"
            ? `J${partido.jornada}`
            : partido.jornada;

        let playerStatsHtml = "";
        if (tienePartidosIndividuales) {
          const chips = [];
          if (partido.minutos !== undefined)
            chips.push(
              `<span class="match-chip"><i class="fas fa-clock"></i> ${partido.minutos}'</span>`,
            );
          // Para porteros, mostrar goles encajados en rojo si es > 0
          if (partido.goles > 0) {
            const esPorteroPos = esPortero(jugador);
            const goalChipClass = esPorteroPos ? "chip-conceded" : "chip-goal";
            const goalIcon = esPorteroPos ? "fa-shield-alt" : "fa-futbol";
            const goalText = esPorteroPos
              ? "Encajados"
              : partido.goles > 1
                ? partido.goles + " goles"
                : "Gol";
            chips.push(
              `<span class="match-chip ${goalChipClass}"><i class="fas ${goalIcon}"></i> ${partido.goles} ${esPorteroPos ? "Enc." : partido.goles > 1 ? "Goles" : "Gol"}</span>`,
            );
          }
          if (partido.asistencias > 0)
            chips.push(
              `<span class="match-chip chip-assist"><i class="fas fa-hands-helping"></i> ${partido.asistencias > 1 ? partido.asistencias + " asis." : "Asist."}</span>`,
            );
          if (partido.amarilla)
            chips.push(
              `<span class="match-chip chip-yellow"><i class="fas fa-square"></i></span>`,
            );
          if (partido.roja)
            chips.push(
              `<span class="match-chip chip-red"><i class="fas fa-square"></i></span>`,
            );
          if (chips.length > 0)
            playerStatsHtml = `<div class="match-player-chips">${chips.join("")}</div>`;
        }

        html += `
                    <article class="match-detail-card">
                        <div class="match-detail-header">
                            <div class="match-date-badge ${resultClass}">
                                <span class="match-day">${fecha.dia}</span>
                                <span class="match-month">${fecha.mesCorto}</span>
                            </div>
                            <div class="match-competition-info">
                                <span class="competition-name">${compNombre} · ${jorTexto}</span>
                                <div class="match-teams-result">
                                    <span class="team-home">${partido.local}</span>
                                    <span class="match-score">${partido.golesLocal} - ${partido.golesVisitante}</span>
                                    <span class="team-away">${partido.visitante}</span>
                                </div>
                                ${playerStatsHtml}
                            </div>
                        </div>
                    </article>`;
      });
    }

    html += "</div>";
    container.innerHTML = html;

    if (!document.getElementById("matchChipsStyles")) {
      const s = document.createElement("style");
      s.id = "matchChipsStyles";
      s.textContent = `
                .match-player-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
                .match-chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px; font-size: 0.75em; font-weight: 600; background: #f0f4ff; border: 1px solid #ccd6ff; color: #001a6e; }
                .chip-goal { background: #e6f9ed; border-color: #6dcc8a; color: #1a7a3c; }
                .chip-conceded { background: #ffe6e6; border-color: #e74c3c; color: #c0392b; }
                .chip-assist { background: #e8f4fd; border-color: #6bb8e8; color: #1a5a8a; }
                .chip-yellow { background: #FFFFF0; border-color: #FFD700; color: #8a7000; }
                .chip-red { background: #FFF5F5; border-color: #FF4136; color: #8a1010; }
            `;
      document.head.appendChild(s);
    }

    const filterSelect = document.getElementById("filterMatches");
    if (filterSelect) {
      filterSelect.addEventListener("change", (e) => {
        this.renderFichaMatches(jugador, seasonId, e.target.value);
      });
    }
  },

  renderFichaCareerHistory: function (
    jugadorActual,
    currentSeasonId,
    filtroCompeticion = "all",
  ) {
    const container = document.getElementById("tabCareer");
    if (!container) return;

    const buscaId = String(jugadorActual.id || "");
    const buscaCodigo = String(jugadorActual.codigo || jugadorActual.id || "");
    const esPorteroActual = esPortero(jugadorActual);

    const historial = [];

    // TOTALES SEPARADOS: Club vs Selección
    let totalesClub = {
      partidos: 0,
      goles: 0,
      asistencias: 0,
      amarillas: 0,
      rojas: 0,
      minutos: 0,
    };

    let totalesSeleccion = {
      partidos: 0,
      goles: 0,
      asistencias: 0,
      amarillas: 0,
      rojas: 0,
      minutos: 0,
      categorias: {}, // Para desglose por categoría
    };

    const competicionesSet = new Set();

    // ============================================
    // PROCESAR SELECCIÓN NACIONAL
    // ============================================
    if (jugadorActual.seleccion && jugadorActual.seleccion.datos) {
      const sel = jugadorActual.seleccion;

      sel.datos.forEach((cat) => {
        const nombreCompeticion = `Selección ${cat.categoria}`;
        competicionesSet.add(nombreCompeticion);

        // Guardar en totales por categoría (todos los campos disponibles)
        if (!totalesSeleccion.categorias[cat.categoria]) {
          totalesSeleccion.categorias[cat.categoria] = {
            partidos: 0,
            goles: 0,
            asistencias: 0,
            amarillas: 0,
            rojas: 0,
            minutos: 0,
          };
        }
        totalesSeleccion.categorias[cat.categoria].partidos +=
          cat.partidos || 0;
        totalesSeleccion.categorias[cat.categoria].goles += cat.goles || 0;
        totalesSeleccion.categorias[cat.categoria].asistencias +=
          cat.asistencias || 0;
        totalesSeleccion.categorias[cat.categoria].amarillas +=
          cat.amarillas || 0;
        totalesSeleccion.categorias[cat.categoria].rojas += cat.rojas || 0;
        totalesSeleccion.categorias[cat.categoria].minutos += cat.minutos || 0;

        // Totales generales selección (todos los campos)
        totalesSeleccion.partidos += cat.partidos || 0;
        totalesSeleccion.goles += cat.goles || 0;
        totalesSeleccion.asistencias += cat.asistencias || 0;
        totalesSeleccion.amarillas += cat.amarillas || 0;
        totalesSeleccion.rojas += cat.rojas || 0;
        totalesSeleccion.minutos += cat.minutos || 0;

        historial.push({
          temporada: cat.categoria, // "Absoluta", "U21", etc.
          equipo: sel.pais,
          logo: sel.bandera,
          esSeleccion: true,
          categoriaSeleccion: cat.categoria,
          competicionFiltro: nombreCompeticion, // Para el filtrado
          stats: {
            partidos: cat.partidos || 0,
            goles: cat.goles || 0,
            asistencias: cat.asistencias || 0,
            amarillas: cat.amarillas || 0,
            rojas: cat.rojas || 0,
            minutos: cat.minutos || 0,
          },
          dorsal: "-",
          posicion: jugadorActual.posicion || "Jugador",
          actual: false,
          statsGlobales: null,
          esPortero: esPorteroActual,
        });
      });
    }
    // ============================================

    // RECORRER TEMPORADAS DEL CLUB
    CLUB_DATA.temporadasDisponibles.forEach((temp) => {
      const datosTemporada = CLUB_DATA.temporadas[temp.id];
      if (!datosTemporada) return;

      const jugadorEnTemporada = datosTemporada.jugadores.find(
        (j) =>
          String(j.id) === buscaId ||
          String(j.codigo) === buscaCodigo ||
          String(j.id) === buscaCodigo ||
          String(j.codigo) === buscaId,
      );

      if (!jugadorEnTemporada) return;

      const datosMaestro =
        CLUB_DATA.jugadoresMaestro[jugadorEnTemporada.codigo] || {};
      const compNombre = datosTemporada.competicion || "Competición";
      const esPorteroTemp = esPortero({
        ...datosMaestro,
        ...jugadorEnTemporada,
      });

      if (jugadorEnTemporada.stats.desglose) {
        Object.keys(jugadorEnTemporada.stats.desglose).forEach((c) =>
          competicionesSet.add(c),
        );
      }

      // Siempre añadimos la competición principal al set
      competicionesSet.add(compNombre);

      let statsAMostrar = { ...jugadorEnTemporada.stats };
      let mostrarEstaTemporada = true;

      // Lógica de filtrado mejorada
      if (filtroCompeticion !== "all") {
        const esFiltroSeleccion = filtroCompeticion.startsWith("Selección");

        if (esFiltroSeleccion) {
          // Si filtro es selección, no mostrar temporadas de club
          mostrarEstaTemporada = false;
        } else {
          // Si filtro es competición de club
          if (
            jugadorEnTemporada.stats.desglose &&
            jugadorEnTemporada.stats.desglose[filtroCompeticion]
          ) {
            statsAMostrar =
              jugadorEnTemporada.stats.desglose[filtroCompeticion];
          } else if (compNombre !== filtroCompeticion) {
            mostrarEstaTemporada = false;
          }
        }
      }

      if (mostrarEstaTemporada) {
        historial.push({
          temporada: temp.nombre,
          equipo: CLUB_DATA.club.nombreCorto,
          logo: CLUB_DATA.club.logo || "",
          esSeleccion: false,
          competicionFiltro: compNombre,
          stats: statsAMostrar,
          statsGlobales: jugadorEnTemporada.stats,
          dorsal: jugadorEnTemporada.dorsal,
          posicion:
            datosMaestro.posicion ||
            jugadorEnTemporada.posicion ||
            "Desconocida",
          actual: temp.id === currentSeasonId,
          esPortero: esPorteroTemp,
        });

        // Sumar solo a totales de club
        totalesClub.partidos += statsAMostrar.partidos || 0;
        totalesClub.goles += statsAMostrar.goles || 0;
        totalesClub.asistencias += statsAMostrar.asistencias || 0;
        totalesClub.amarillas += statsAMostrar.amarillas || 0;
        totalesClub.rojas += statsAMostrar.rojas || 0;
        totalesClub.minutos += statsAMostrar.minutos || 0;
      }
    });

    // FILTRAR HISTORIAL SI ES SELECCIÓN
    let historialFiltrado = historial;
    if (
      filtroCompeticion !== "all" &&
      filtroCompeticion.startsWith("Selección")
    ) {
      const categoriaBuscada = filtroCompeticion.replace("Selección ", "");
      historialFiltrado = historial.filter(
        (h) => h.esSeleccion && h.categoriaSeleccion === categoriaBuscada,
      );
    } else if (filtroCompeticion !== "all") {
      // Filtrar solo club para competiciones normales
      historialFiltrado = historial.filter((h) => !h.esSeleccion);
    }

    // GENERAR HTML DEL TIMELINE
    let timelineHtml = "";
    historialFiltrado.forEach((h) => {
      const badgeHtml = h.logo
        ? `<img src="${h.logo}" alt="Logo" class="team-badge-img">`
        : `<span class="team-badge-text">OVI</span>`;

      // DIFERENCIAR GOLES/ENCAJADOS EN EL TIMELINE
      const golesLabelTimeline = h.esPortero ? "Enc." : t("goles") || "Goles";
      const golesStyleTimeline = h.esPortero
        ? 'style="color:#e74c3c;font-weight:700"'
        : "";

      let statsHtml = `<div class="timeline-stats">
      <span><strong>${h.stats.partidos}</strong> ${t("partidos")}</span>
      <span><strong ${golesStyleTimeline}>${h.stats.goles}</strong> ${golesLabelTimeline}</span>
      ${!h.esSeleccion ? `<span><strong>${h.stats.asistencias}</strong> ${t("asistencias")}</span>` : `<span><strong>${h.stats.asistencias}</strong> ${t("asistencias")}</span>`}
    </div>`;

      // Desglose solo para clubes
      if (
        !h.esSeleccion &&
        filtroCompeticion === "all" &&
        h.statsGlobales &&
        h.statsGlobales.desglose
      ) {
        statsHtml += `<div class="timeline-breakdown-box">`;
        for (const [comp, data] of Object.entries(h.statsGlobales.desglose)) {
          const concedeStyle = h.esPortero ? 'style="color:#e74c3c"' : "";
          const goalLabel = h.esPortero ? "Enc." : "G";
          statsHtml += `
          <div class="breakdown-row">
            <span class="breakdown-comp-name">${comp}</span>
            <div class="breakdown-data-chips">
              <span class="chip"><b>${data.partidos}</b> PJ</span>
              <span class="chip" ${concedeStyle}><b>${data.goles}</b> ${goalLabel}</span>
              <span class="chip chip-yellow"><b>${data.amarillas || 0}</b> <i class="fas fa-square"></i></span>
              ${data.rojas > 0 ? `<span class="chip chip-red"><b>${data.rojas}</b> <i class="fas fa-square"></i></span>` : ""}
            </div>
          </div>`;
        }
        statsHtml += `</div>`;
      }

      timelineHtml += `
      <div class="timeline-item ${h.actual ? "current" : ""} ${h.esSeleccion ? "seleccion-nacional" : ""}">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-club">
              <span class="team-badge">${badgeHtml}</span>
              ${h.esSeleccion ? `<i class="fas fa-flag" style="margin-right: 8px; color: var(--secondary-color);"></i>` : ""}
              ${h.equipo}
            </span>
            <span class="timeline-years">${h.temporada}</span>
          </div>
          <div class="timeline-position">
            <span class="pos-label"><i class="fas fa-tshirt"></i> #${h.dorsal}</span>
            <span class="pos-name">${translatePosition(h.posicion)}</span>
          </div>
          ${statsHtml}
        </div>
      </div>`;
    });

    // CONSTRUIR DROPDOWN CON GRUPOS
    const listaComps = Array.from(competicionesSet).sort();
    const tieneSeleccion =
      jugadorActual.seleccion && jugadorActual.seleccion.datos;
    const tieneClub = historial.some((h) => !h.esSeleccion);

    let dropdownHtml = `<div class="filter-container" style="display:flex; justify-content:flex-end; margin-bottom:20px; align-items:center; gap:10px;">
    <label style="font-weight:bold;">Filtrar:</label>
    <select id="filterCareer" style="padding:8px 12px; border-radius:6px; border:1px solid #001a6e; background:#fff; color:#001a6e; font-family:inherit;">`;

    dropdownHtml += `<option value="all" ${filtroCompeticion === "all" ? "selected" : ""}>Todas las competiciones</option>`;

    // Grupo Club
    if (tieneClub) {
      dropdownHtml += `<optgroup label="Club">`;
      listaComps
        .filter((c) => !c.startsWith("Selección"))
        .forEach((c) => {
          dropdownHtml += `<option value="${c}" ${c === filtroCompeticion ? "selected" : ""}>${c}</option>`;
        });
      dropdownHtml += `</optgroup>`;
    }

    // Grupo Selección
    if (tieneSeleccion) {
      dropdownHtml += `<optgroup label="Selección Nacional">`;
      listaComps
        .filter((c) => c.startsWith("Selección"))
        .forEach((c) => {
          const cat = c.replace("Selección ", "");
          dropdownHtml += `<option value="${c}" ${c === filtroCompeticion ? "selected" : ""}>${cat}</option>`;
        });
      dropdownHtml += `</optgroup>`;
    }

    dropdownHtml += `</select></div>`;

    // GENERAR TARJETAS DE TOTALES SEPARADAS
    let totalesHtml = "";

    // Solo mostrar totales de club si hay datos de club y el filtro lo permite
    const mostrarTotalesClub =
      (filtroCompeticion === "all" ||
        !filtroCompeticion.startsWith("Selección")) &&
      totalesClub.partidos > 0;

    // Solo mostrar totales de selección si hay datos de selección y el filtro lo permite
    const mostrarTotalesSeleccion =
      (filtroCompeticion === "all" ||
        filtroCompeticion.startsWith("Selección")) &&
      totalesSeleccion.partidos > 0;

    if (mostrarTotalesClub) {
      const golesLabelTotal = esPorteroActual
        ? "Encajados"
        : t("goles") || "Goles";
      const golesStyleTotal = esPorteroActual ? 'style="color:#e74c3c"' : "";

      totalesHtml += `
      <div class="career-totals-card club-totals">
        <h3 class="card-title"><i class="fas fa-shield-alt" style="margin-right: 8px;"></i>Total Club</h3>
        <div class="totals-grid">
          <div class="total-item"><span class="total-value">${totalesClub.partidos}</span><span class="total-label">${t("partidos")}</span></div>
          <div class="total-item highlight" ${golesStyleTotal}><span class="total-value" ${golesStyleTotal}>${totalesClub.goles}</span><span class="total-label">${golesLabelTotal}</span></div>
          <div class="total-item"><span class="total-value">${totalesClub.asistencias}</span><span class="total-label">${t("asistencias")}</span></div>
          <div class="total-item yellow-card"><span class="total-value">${totalesClub.amarillas}</span><span class="total-label">${t("amarillas")}</span></div>
          <div class="total-item red-card"><span class="total-value">${totalesClub.rojas}</span><span class="total-label">${t("rojas")}</span></div>
          <div class="total-item minutes"><span class="total-value">${totalesClub.minutos.toLocaleString()}</span><span class="total-label">${t("minutos")}</span></div>
        </div>
      </div>`;
    }

    if (mostrarTotalesSeleccion) {
      // Detectar si es portero para aplicar estilos de goles encajados
      const golesLabelSel = esPorteroActual
        ? "Encajados"
        : t("goles") || "Goles";
      const golesStyleSel = esPorteroActual ? 'style="color:#e74c3c"' : "";

      // Si filtramos por categoría específica, mostrar solo esa
      const esFiltroCategoriaEspecifica =
        filtroCompeticion.startsWith("Selección");
      const categoriaFiltro = esFiltroCategoriaEspecifica
        ? filtroCompeticion.replace("Selección ", "")
        : null;

      let statsSeleccionHtml = "";

      if (
        esFiltroCategoriaEspecifica &&
        totalesSeleccion.categorias[categoriaFiltro]
      ) {
        // Solo esa categoría
        const cat = totalesSeleccion.categorias[categoriaFiltro];
        statsSeleccionHtml = `
        <div class="total-item" style="grid-column: 1 / -1; text-align: center; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 8px; margin-bottom: 5px;">
          <span style="font-weight: 600; color: #001a6e;">${categoriaFiltro}</span>
        </div>
        <div class="total-item"><span class="total-value">${cat.partidos}</span><span class="total-label">${t("partidos")}</span></div>
        <div class="total-item highlight" ${golesStyleSel}><span class="total-value" ${golesStyleSel}>${cat.goles}</span><span class="total-label">${golesLabelSel}</span></div>
        <div class="total-item"><span class="total-value">${cat.asistencias}</span><span class="total-label">${t("asistencias")}</span></div>
        <div class="total-item yellow-card"><span class="total-value">${cat.amarillas}</span><span class="total-label">${t("amarillas")}</span></div>
        <div class="total-item red-card"><span class="total-value">${cat.rojas}</span><span class="total-label">${t("rojas")}</span></div>
        <div class="total-item minutes"><span class="total-value">${cat.minutos.toLocaleString()}</span><span class="total-label">${t("minutos")}</span></div>
      `;
      } else {
        // Todas las categorías de selección
        statsSeleccionHtml = `
        <div class="total-item"><span class="total-value">${totalesSeleccion.partidos}</span><span class="total-label">${t("partidos")}</span></div>
        <div class="total-item highlight" ${golesStyleSel}><span class="total-value" ${golesStyleSel}>${totalesSeleccion.goles}</span><span class="total-label">${golesLabelSel}</span></div>
        <div class="total-item"><span class="total-value">${totalesSeleccion.asistencias}</span><span class="total-label">${t("asistencias")}</span></div>
        <div class="total-item yellow-card"><span class="total-value">${totalesSeleccion.amarillas}</span><span class="total-label">${t("amarillas")}</span></div>
        <div class="total-item red-card"><span class="total-value">${totalesSeleccion.rojas}</span><span class="total-label">${t("rojas")}</span></div>
        <div class="total-item minutes"><span class="total-value">${totalesSeleccion.minutos.toLocaleString()}</span><span class="total-label">${t("minutos")}</span></div>
      `;
      }

      totalesHtml += `
      <div class="career-totals-card selection-totals" style="border-top: 4px solid #FFD700;">
        <h3 class="card-title"><i class="fas fa-flag" style="margin-right: 8px; color: #FFD700;"></i>Total Selección</h3>
        <div class="totals-grid">
          ${statsSeleccionHtml}
        </div>
      </div>`;
    }

    container.innerHTML = `${dropdownHtml}
    <div class="career-grid">
      <div class="career-timeline-card">
        <h3 class="card-title">${t("historial")}</h3>
        <div class="timeline">${timelineHtml || "<p>No hay datos.</p>"}</div>
      </div>
      <div class="career-sidebar">
        ${totalesHtml}
      </div>
    </div>`;

    const filterSelect = document.getElementById("filterCareer");
    if (filterSelect) {
      filterSelect.addEventListener("change", (e) => {
        this.renderFichaCareerHistory(
          jugadorActual,
          currentSeasonId,
          e.target.value,
        );
      });
    }
  },

  renderJuegos: function () {
    const container = document.getElementById("juegosGrid");
    if (!container || !CLUB_DATA.juegos) return;
    let html = "";
    CLUB_DATA.juegos.forEach((juego) => {
      const specialClass = juego.esEspecial ? "especial" : "";
      html += `<a href="${juego.enlace}" class="juego-card ${specialClass}"><img src="${juego.imagen}" alt="${juego.titulo}"><h3>${juego.titulo}</h3><p>${juego.descripcion}</p></a>`;
    });
    container.innerHTML = html;
  },

  renderVideos: function () {
    const container = document.getElementById("videosGrid");
    if (!container || !CLUB_DATA.videos) return;
    let html = "";
    CLUB_DATA.videos.forEach((video) => {
      const fecha = video.fecha ? formatearFecha(video.fecha).completa : "";
      const thumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
      const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
      const shareText = `${video.titulo} - Real Oviedo | Sangre Carbayona`;
      html += `<div class="video-card"><a href="${videoUrl}" target="_blank" rel="noopener noreferrer" class="video-main-link" style="text-decoration: none; color: inherit; display: block;"><div class="video-thumbnail"><img src="${thumbnailUrl}" alt="${video.titulo}"><div class="play-overlay"><i class="fas fa-play-circle"></i></div></div><div class="video-info"><h3>${video.titulo}</h3><div class="video-meta"><span><i class="far fa-calendar"></i> ${fecha}</span>${video.jornada ? `<span style="margin-left: 10px;"><i class="fas fa-futbol"></i> J${video.jornada}</span>` : ""}</div></div></a><div class="video-card-actions"><a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + videoUrl)}" target="_blank" class="video-action-btn whatsapp" title="WhatsApp"><i class="fab fa-whatsapp"></i></a><a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="video-action-btn twitter" title="Twitter"><i class="fab fa-twitter"></i></a><a href="https://t.me/share/url?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="video-action-btn telegram" title="Telegram"><i class="fab fa-telegram-plane"></i></a></div></div>`;
    });
    container.innerHTML = html;
  },
};

/* ===================================
   ESTILOS DINÁMICOS RESPONSIVE
   =================================== */
if (!document.getElementById("responsiveAppStyles")) {
  const s = document.createElement("style");
  s.id = "responsiveAppStyles";
  s.textContent = `
        /* Caja de desglose */
        .timeline-breakdown-box { margin-top:12px; background:rgba(0,0,0,0.03); padding:10px; border-radius:8px; border:1px solid rgba(0,0,0,0.05); }
        .breakdown-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding-bottom:8px; border-bottom:1px solid rgba(0,0,0,0.05); }
        .breakdown-row:last-child { margin-bottom:0; padding-bottom:0; border-bottom:none; }
        .breakdown-comp-name { font-weight:700; font-size:0.8em; color:#001a6e; text-transform: uppercase; }
        .breakdown-data-chips { display:flex; gap:4px; }
        
        /* Estilo de los chips de datos */
        .chip { background:#fff; padding:2px 8px; border-radius:4px; font-size:0.75em; border:1px solid #ddd; white-space:nowrap; display:flex; align-items:center; gap:4px; font-weight:600; color: #333; }
        
        /* Tarjetas con colores vibrantes y sombras para que se distingan */
        .chip-yellow i { color: #FFD700 !important; filter: drop-shadow(1px 1px 0px rgba(0,0,0,0.3)); font-size: 1.1em; }
        .chip-red i { color: #FF4136 !important; filter: drop-shadow(1px 1px 0px rgba(0,0,0,0.3)); font-size: 1.1em; }
        
        .chip-yellow { border-color: #FFD700; background: #FFFFF0; }
        .chip-red { border-color: #FF4136; background: #FFF5F5; }

        /* Adaptación móvil y tablet */
        @media (max-width: 768px) {
            .breakdown-row { flex-direction: column; align-items: flex-start; gap: 8px; }
            .breakdown-data-chips { width: 100%; display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; }
            .chip { justify-content: center; padding: 6px; font-size: 0.8em; }
            .breakdown-comp-name { font-size: 0.85em; margin-bottom: 2px; }
        }
    `;
  document.head.appendChild(s);
}

/* ===================================
   ESTILOS PARA PORTEROS (GOLES ENCAJADOS)
   =================================== */
if (!document.getElementById("porteroStyles")) {
  const s = document.createElement("style");
  s.id = "porteroStyles";
  s.textContent = `
    .mini-stat.conceded .mini-stat-value {
      color: #e74c3c !important;
      font-weight: 700;
    }
    .mini-stat.conceded .mini-stat-label {
      color: #c0392b;
      font-size: 0.7em;
      font-weight: 600;
    }
    .quick-stat.conceded .quick-stat-value {
      color: #e74c3c !important;
      font-weight: 700;
    }
    .quick-stat.conceded .quick-stat-label {
      color: #c0392b;
      font-weight: 600;
    }
    .season-stat.portero-stat .season-stat-value {
      color: #e74c3c;
      font-weight: 700;
    }
    .season-stat.portero-stat .season-stat-label {
      color: #c0392b;
    }
    .chip-conceded {
      background: #ffe6e6 !important;
      border-color: #e74c3c !important;
      color: #c0392b !important;
    }
    .chip-conceded i {
      color: #e74c3c !important;
    }
  `;
  document.head.appendChild(s);
}

/* ===================================
   AJUSTE UNIFORME DE FOTOS DE JUGADORES
   =================================== */
function ajustarFotosJugadores() {
  const selectores = [
    ".player-main-photo",
    ".squad-image img",
    ".player-card img",
    ".squad-card .squad-image img",
  ];

  const fotos = document.querySelectorAll(selectores.join(", "));

  fotos.forEach((img) => {
    if (img.complete) {
      aplicarAjuste(img);
    } else {
      img.onload = function () {
        aplicarAjuste(this);
      };
      img.onerror = function () {
        this.src =
          "https://via.placeholder.com/400x500/1a365d/ffffff?text=Jugador";
      };
    }
  });
}

function aplicarAjuste(img) {
  const ratio = img.naturalWidth / img.naturalHeight;

  if (ratio < 0.6) {
    img.style.objectPosition = "center 20%";
    img.style.transform = "scale(1.1)";
  } else if (ratio < 0.8) {
    img.style.objectPosition = "center 15%";
    img.style.transform = "scale(1.05)";
  } else if (ratio > 1.3) {
    img.style.objectPosition = "center 25%";
    img.style.transform = "scale(1.15)";
  } else {
    img.style.objectPosition = "center 20%";
    img.style.transform = "scale(1.08)";
  }
}

const originalRenderFichaJugador = App.renderFichaJugador;
App.renderFichaJugador = function () {
  originalRenderFichaJugador.call(this);
  setTimeout(ajustarFotosJugadores, 100);
};

const originalRenderPlantillaCompleta = App.renderPlantillaCompleta;
App.renderPlantillaCompleta = function () {
  originalRenderPlantillaCompleta.call(this);
  setTimeout(ajustarFotosJugadores, 100);
};

const originalRenderPlantillaHome = App.renderPlantillaHome;
App.renderPlantillaHome = function (filter) {
  originalRenderPlantillaHome.call(this, filter);
  setTimeout(ajustarFotosJugadores, 100);
};

document.addEventListener("DOMContentLoaded", function () {
  App.init();
});
window.App = App;
