/* ===================================
   BUSCADOR.JS
   Motor del buscador avanzado (buscador.html).

   Construye, en el navegador y a partir de los datos ya
   cargados (CLUB_DATA, DERBIS_DATA), un índice único con todo
   lo que se puede buscar en la web: jugadores, entrenadores,
   partidos del primer equipo, títulos, estadios, capítulos de
   historia, derbis y oviesportinguistas.

   Al construirse en vivo leyendo las mismas estructuras que ya
   usa el resto de la web (en vez de tener su propia copia de
   datos), cualquier jugador, partido, título, etc. que se añada
   en el futuro aparece aquí automáticamente, sin tocar este
   archivo.

   Los partidos se deduplican con la misma clave que ya usa
   autoCalcularStatsEquipo() en js/app.js (competicion|jornada|
   fecha), para no listar el mismo partido una vez por cada
   jugador que lo jugó.
   =================================== */

/* global CLUB_DATA, DERBIS_DATA */

(function () {
  'use strict';

  const OVIEDO = 'Real Oviedo';
  const PAGINA = 30; // resultados que se muestran por tanda

  // ── HELPERS ────────────────────────────────────────────────

  function normalizar(str) {
    if (!str) return '';
    return String(str).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function resolverImagen(imagen) {
    if (!imagen) return '';
    if (imagen.startsWith('http') || imagen.startsWith('//')) return imagen;
    return imagen.replace(/^\//, '');
  }

  function urlJugador(codigo) {
    return `fichas/${codigo}.html`;
  }

  function urlEntrenador(codigo, seasonId) {
    const temporada =
      seasonId || (window.CLUB_DATA && CLUB_DATA.temporadaActual) || '';
    return `ficha-jugador.html?tipo=entrenador&id=${codigo}&season=${temporada}`;
  }

  // ── MAPA DE TEMPORADAS POR JUGADOR/ENTRENADOR ───────────────
  // (mismo patrón que js/busqueda.js)

  function construirMapaTemporadas() {
    const mapa = {};
    if (!window.CLUB_DATA || !CLUB_DATA.temporadas) return mapa;

    const dispLookup = {};
    (CLUB_DATA.temporadasDisponibles || []).forEach((t) => {
      dispLookup[t.id] = { nombre: t.nombre, actual: !!t.actual };
    });

    Object.keys(CLUB_DATA.temporadas)
      .sort()
      .reverse()
      .forEach((seasonId) => {
        const temporada = CLUB_DATA.temporadas[seasonId];
        if (!temporada) return;
        const meta = dispLookup[seasonId] || {
          nombre: seasonId.replace('-', '/'),
          actual: seasonId === CLUB_DATA.temporadaActual,
        };

        (temporada.jugadores || []).forEach((j) => {
          const cod = j.codigo || j.id;
          if (!cod) return;
          if (!mapa[cod]) mapa[cod] = [];
          if (!mapa[cod].find((x) => x.id === seasonId)) {
            mapa[cod].push({
              id: seasonId,
              nombre: meta.nombre,
              actual: meta.actual,
            });
          }
        });

        (temporada.cuerpoTecnico || []).forEach((c) => {
          const cod = c.codigo || c.id;
          if (!cod) return;
          if (!mapa[cod]) mapa[cod] = [];
          if (!mapa[cod].find((x) => x.id === seasonId)) {
            mapa[cod].push({
              id: seasonId,
              nombre: meta.nombre,
              actual: meta.actual,
            });
          }
        });
      });

    return mapa;
  }

  // ── ÍNDICE: JUGADORES Y ENTRENADORES ─────────────────────────

  function indexarPersonas(indice) {
    if (!window.CLUB_DATA) return;
    const mapaTemporadas = construirMapaTemporadas();

    const maestro = CLUB_DATA.jugadoresMaestro || {};
    Object.entries(maestro).forEach(([codigo, datos]) => {
      const temporadas = mapaTemporadas[codigo] || [];
      const nombreMostrar =
        datos.apodo || datos.nombreCompleto || datos.nombre || codigo;

      indice.push({
        tipo: 'jugador',
        titulo: nombreMostrar,
        subtitulo:
          datos.nombreCompleto && datos.nombreCompleto !== nombreMostrar
            ? datos.nombreCompleto
            : '',
        meta: datos.posicionCorta || datos.posicion || '',
        posicion: datos.posicion || '',
        nacionalidad: (datos.nacionalidad && datos.nacionalidad[0]) || '',
        nacionalidades: datos.nacionalidad || [],
        temporada: temporadas.length ? temporadas[0].id : null,
        temporadas: temporadas.map((t) => t.id),
        competicion: null,
        resultado: null,
        imagen: resolverImagen(datos.imagen),
        url: urlJugador(codigo),
        _tokens: normalizar(
          [
            datos.apodo,
            datos.nombre,
            datos.apellidos,
            datos.nombreCompleto,
            datos.lugarNacimiento,
            datos.provinciaNacimiento,
            (datos.nacionalidad || []).join(' '),
          ]
            .filter(Boolean)
            .join(' '),
        ),
      });
    });

    const entMaestro = CLUB_DATA.entrenadorMaestro || {};
    Object.entries(entMaestro).forEach(([codigo, datos]) => {
      const temporadas = mapaTemporadas[codigo] || [];
      const nombreMostrar =
        datos.apodo || datos.nombreCompleto || datos.nombre || codigo;
      const seasonPorDefecto = temporadas.length ? temporadas[0].id : null;

      indice.push({
        tipo: 'entrenador',
        titulo: nombreMostrar,
        subtitulo:
          datos.nombreCompleto && datos.nombreCompleto !== nombreMostrar
            ? datos.nombreCompleto
            : '',
        meta: datos.cargo || 'Entrenador',
        posicion: '',
        nacionalidad: (datos.nacionalidad && datos.nacionalidad[0]) || '',
        nacionalidades: datos.nacionalidad || [],
        temporada: seasonPorDefecto,
        temporadas: temporadas.map((t) => t.id),
        competicion: null,
        resultado: null,
        imagen: resolverImagen(datos.imagen),
        url: urlEntrenador(codigo, seasonPorDefecto),
        _tokens: normalizar(
          [
            datos.apodo,
            datos.nombre,
            datos.apellidos,
            datos.nombreCompleto,
            datos.lugarNacimiento,
            datos.provinciaNacimiento,
            (datos.nacionalidad || []).join(' '),
          ]
            .filter(Boolean)
            .join(' '),
        ),
      });
    });
  }

  // ── ÍNDICE: PARTIDOS DEL PRIMER EQUIPO ───────────────────────
  // Deduplicados con la misma clave que autoCalcularStatsEquipo()
  // en js/app.js: competicion|jornada|fecha.

  function resultadoEfectivo(p) {
    let r = p.resultado;
    if (
      typeof p.penaltisLocal === 'number' &&
      typeof p.penaltisVisitante === 'number'
    ) {
      const esLocal = p.local === OVIEDO;
      const pf = esLocal ? p.penaltisLocal : p.penaltisVisitante;
      const pc = esLocal ? p.penaltisVisitante : p.penaltisLocal;
      if (p.resultado === 'E' && pf !== pc) r = pf > pc ? 'V' : 'D';
    }
    return r;
  }

  function indexarPartidos(indice) {
    if (!window.CLUB_DATA || !CLUB_DATA.temporadas) return;
    const maestro = CLUB_DATA.jugadoresMaestro || {};

    // Primera pasada: agrupar por partido (misma clave que ya usa
    // autoCalcularStatsEquipo en js/app.js) y recoger, para cada uno,
    // a TODOS los jugadores cuyo partidos[] lo incluye. Sin este
    // agrupamiento previo, el partido se quedaba solo con los datos
    // del primer jugador que lo tenía registrado y buscar por el
    // nombre de cualquier otro jugador que también lo jugó no
    // encontraba nada.
    const porClave = new Map();

    Object.entries(CLUB_DATA.temporadas).forEach(([seasonId, temporada]) => {
      (temporada.jugadores || []).forEach((jugadorTemp) => {
        const datosMaestro = maestro[jugadorTemp.codigo] || {};
        const nombreJugador =
          datosMaestro.apodo ||
          datosMaestro.nombreCompleto ||
          jugadorTemp.codigo;

        (jugadorTemp.partidos || []).forEach((p) => {
          if (!p.local || !p.visitante || !p.fecha) return;
          const clave = `${p.competicion}|${p.jornada}|${p.fecha}`;
          if (!porClave.has(clave)) {
            porClave.set(clave, {
              p,
              seasonId,
              jugadores: new Set(),
              goleadores: new Set(),
              amarilla: false,
              roja: false,
              statsPorJugador: {},
            });
          }
          const grupo = porClave.get(clave);
          const esPortero = datosMaestro.posicion === 'Portero';
          grupo.jugadores.add(nombreJugador);
          // En los porteros, "goles" son los encajados, no marcados
          // (mismo criterio que ya usa el resto del proyecto) — no
          // deben contar como goleadores.
          if (p.goles > 0 && !esPortero) {
            grupo.goleadores.add(nombreJugador);
          }
          if (p.amarilla) grupo.amarilla = true;
          if (p.roja) grupo.roja = true;

          // Aportación individual de este jugador en este partido en
          // concreto, para poder mostrarla al filtrar por su nombre
          // (cuántos goles marcó, o si es portero cuántos encajó).
          grupo.statsPorJugador[nombreJugador] = {
            goles: p.goles || 0,
            esPortero,
            asistencias: p.asistencias || 0,
            amarilla: !!p.amarilla,
            roja: !!p.roja,
            minutos: p.minutos || 0,
          };
        });
      });
    });

    // Segunda pasada: un item de índice por partido único, ya con la
    // lista completa de jugadores que lo disputaron, quién marcó y si
    // hubo tarjetas.
    porClave.forEach(
      ({
        p,
        seasonId,
        jugadores,
        goleadores,
        amarilla,
        roja,
        statsPorJugador,
      }) => {
        const esLocal = p.local === OVIEDO;
        const rival = esLocal ? p.visitante : p.local;
        const res = resultadoEfectivo(p);
        const resTexto =
          { V: 'Victoria', E: 'Empate', D: 'Derrota' }[res] || '';
        const marcador =
          typeof p.golesLocal === 'number' &&
          typeof p.golesVisitante === 'number'
            ? `${p.golesLocal} - ${p.golesVisitante}`
            : '';
        const listaJugadores = Array.from(jugadores);
        const listaGoleadores = Array.from(goleadores);

        indice.push({
          tipo: 'partido',
          titulo: `${p.local} ${marcador} ${p.visitante}`.trim(),
          subtitulo: `${p.competicion || ''}${p.jornada ? ' · Jornada ' + p.jornada : ''}`,
          meta: resTexto,
          posicion: '',
          temporada: seasonId,
          temporadas: [seasonId],
          competicion: p.competicion || '',
          resultado: res || '',
          rival,
          esLocal,
          jornada: p.jornada != null ? String(p.jornada) : '',
          jugadores: listaJugadores,
          goleadores: listaGoleadores,
          statsPorJugador,
          amarilla,
          roja,
          imagen: '',
          fecha: p.fecha,
          url: null,
          _tokens: normalizar(
            [
              p.local,
              p.visitante,
              rival,
              p.competicion,
              p.fecha,
              seasonId,
              listaJugadores.join(' '),
              listaGoleadores.join(' '),
            ]
              .filter(Boolean)
              .join(' '),
          ),
        });
      },
    );
  }

  // ── ÍNDICE: TÍTULOS ───────────────────────────────────────────

  function indexarTitulos(indice) {
    if (!window.CLUB_DATA || !CLUB_DATA.palmares) return;
    const p = CLUB_DATA.palmares;

    (p.nacionales || []).forEach((t) => {
      (t.temporadas || []).forEach((temporada) => {
        indice.push({
          tipo: 'titulo',
          titulo: `${t.competicion} ${temporada}`,
          subtitulo: 'Título nacional',
          meta: temporada,
          posicion: '',
          temporada,
          temporadas: [temporada],
          competicion: t.competicion,
          resultado: null,
          imagen: '',
          url: 'palmares.html',
          _tokens: normalizar(
            [t.competicion, temporada, 'titulo campeon palmares'].join(' '),
          ),
        });
      });
    });

    (p.regionales || []).forEach((t) => {
      (t.temporadas || []).forEach((temporada) => {
        indice.push({
          tipo: 'titulo',
          titulo: `${t.competicion} ${temporada}`,
          subtitulo: 'Campeonato regional',
          meta: temporada,
          posicion: '',
          temporada,
          temporadas: [temporada],
          competicion: t.competicion,
          resultado: null,
          imagen: '',
          url: 'palmares.html',
          _tokens: normalizar(
            [t.competicion, temporada, 'titulo campeon palmares regional'].join(
              ' ',
            ),
          ),
        });
      });
    });
  }

  // ── ÍNDICE: ESTADIOS ───────────────────────────────────────────

  function indexarEstadios(indice) {
    if (!window.CLUB_DATA || !CLUB_DATA.estadios) return;
    CLUB_DATA.estadios.forEach((club) => {
      indice.push({
        tipo: 'estadio',
        titulo: club.estadio,
        subtitulo: `${club.equipo} · ${club.ciudad}`,
        meta: club.ciudad,
        posicion: '',
        temporada: null,
        temporadas: [],
        competicion: null,
        resultado: null,
        imagen: resolverImagen(club.escudo),
        url: 'estadios.html',
        _tokens: normalizar([club.estadio, club.equipo, club.ciudad].join(' ')),
      });
    });
  }

  // ── ÍNDICE: CAPÍTULOS DE HISTORIA ─────────────────────────────

  function indexarHistoria(indice) {
    if (!window.CLUB_DATA || !CLUB_DATA.historia) return;
    CLUB_DATA.historia.forEach((cap) => {
      indice.push({
        tipo: 'historia',
        titulo: cap.titulo,
        subtitulo: cap.periodo,
        meta: cap.periodo,
        posicion: '',
        temporada: null,
        temporadas: [],
        competicion: null,
        resultado: null,
        imagen: cap.escudo || '',
        url: `historia.html#${cap.id}`,
        _tokens: normalizar(
          [cap.titulo, cap.periodo, (cap.texto || []).join(' ')].join(' '),
        ),
      });
    });
  }

  // ── ÍNDICE: OVIESPORTINGUISTAS ─────────────────────────────────

  function indexarOviesportinguistas(indice) {
    if (!window.CLUB_DATA || !CLUB_DATA.oviesportinguistas) return;
    const datos = CLUB_DATA.oviesportinguistas;

    (datos.jugadores || []).forEach((persona) => {
      indice.push({
        tipo: 'oviesportinguista',
        titulo: persona.nombre,
        subtitulo: persona.texto,
        meta: 'Jugador',
        posicion: '',
        temporada: null,
        temporadas: [],
        competicion: null,
        resultado: null,
        imagen: persona.imagen || '',
        url: 'oviesportinguistas.html',
        _tokens: normalizar([persona.nombre, persona.texto].join(' ')),
      });
    });

    (datos.entrenadores || []).forEach((persona) => {
      indice.push({
        tipo: 'oviesportinguista',
        titulo: persona.nombre,
        subtitulo: persona.texto,
        meta: 'Entrenador',
        posicion: '',
        temporada: null,
        temporadas: [],
        competicion: null,
        resultado: null,
        imagen: persona.imagen || '',
        url: 'oviesportinguistas.html',
        _tokens: normalizar([persona.nombre, persona.texto].join(' ')),
      });
    });
  }

  // ── ÍNDICE: DERBIS ───────────────────────────────────────────

  function indexarDerbis(indice) {
    if (!window.DERBIS_DATA) return;
    DERBIS_DATA.forEach((derbi) => {
      indice.push({
        tipo: 'derbi',
        titulo: `${derbi.local.nombre} ${derbi.resultado} ${derbi.visitante.nombre}`,
        subtitulo: `${derbi.competicion || ''}${derbi.jornada ? ' · Jornada ' + derbi.jornada : ''} · ${derbi.temporada || ''}`,
        meta:
          derbi.ganador === 'oviedo'
            ? 'Victoria'
            : derbi.ganador === 'sporting'
              ? 'Derrota'
              : 'Empate',
        posicion: '',
        temporada: derbi.temporada || null,
        temporadas: derbi.temporada ? [derbi.temporada] : [],
        competicion: derbi.competicion || '',
        resultado:
          derbi.ganador === 'oviedo'
            ? 'V'
            : derbi.ganador === 'sporting'
              ? 'D'
              : 'E',
        rival:
          derbi.local.nombre === OVIEDO
            ? derbi.visitante.nombre
            : derbi.local.nombre,
        esLocal: derbi.local.nombre === OVIEDO,
        jornada: derbi.jornada != null ? String(derbi.jornada) : '',
        imagen: derbi.local.escudo || '',
        url: `fichas/derbi-${derbi.id}.html`,
        _tokens: normalizar(
          [
            derbi.local.nombre,
            derbi.visitante.nombre,
            derbi.competicion,
            derbi.temporada,
            derbi.estadio,
          ].join(' '),
        ),
      });
    });
  }

  // ── CONSTRUIR ÍNDICE COMPLETO ──────────────────────────────────

  function construirIndice() {
    const indice = [];
    indexarPersonas(indice);
    indexarPartidos(indice);
    indexarTitulos(indice);
    indexarEstadios(indice);
    indexarHistoria(indice);
    indexarOviesportinguistas(indice);
    indexarDerbis(indice);
    return indice;
  }

  // ── POBLAR FILTROS DINÁMICAMENTE A PARTIR DEL ÍNDICE ────────────

  function poblarSelect(select, valores, etiquetaTodos, orden) {
    const actuales = new Set(valores.filter(Boolean));
    const ordenados = Array.from(actuales).sort((a, b) => {
      if (orden === 'numerico') {
        const na = parseInt(a, 10);
        const nb = parseInt(b, 10);
        const aEsNum = !Number.isNaN(na) && String(na) === a;
        const bEsNum = !Number.isNaN(nb) && String(nb) === b;
        if (aEsNum && bEsNum) return na - nb;
        if (aEsNum) return -1; // números antes que jornadas tipo "Final"
        if (bEsNum) return 1;
        return a.localeCompare(b, 'es');
      }
      return orden === 'desc'
        ? b.localeCompare(a, 'es')
        : a.localeCompare(b, 'es');
    });
    select.innerHTML =
      `<option value="">${etiquetaTodos}</option>` +
      ordenados.map((v) => `<option value="${v}">${v}</option>`).join('');
  }

  function poblarFiltros(indice) {
    const temporadas = indice.flatMap((i) => i.temporadas || []);
    const competiciones = indice.map((i) => i.competicion);
    const posiciones = indice.map((i) => i.posicion);
    const rivales = indice.map((i) => i.rival);
    const nacionalidades = indice.flatMap((i) => i.nacionalidades || []);
    const jornadas = indice.map((i) => i.jornada);
    const nombresJugadores = indice
      .filter((i) => i.tipo === 'jugador')
      .map((i) => i.titulo);

    poblarSelect(
      document.getElementById('buscJugador'),
      nombresJugadores,
      'Elige un jugador...',
    );
    poblarSelect(
      document.getElementById('buscTemporada'),
      temporadas,
      'Todas las temporadas',
      'desc',
    );
    poblarSelect(
      document.getElementById('buscCompeticion'),
      competiciones,
      'Todas las competiciones',
    );
    poblarSelect(
      document.getElementById('buscPosicion'),
      posiciones,
      'Todas las posiciones',
    );
    poblarSelect(
      document.getElementById('buscRival'),
      rivales,
      'Todos los rivales',
    );
    poblarSelect(
      document.getElementById('buscNacionalidad'),
      nacionalidades,
      'Todas las nacionalidades',
    );
    poblarSelect(
      document.getElementById('buscJornada'),
      jornadas,
      'Todas las jornadas',
      'numerico',
    );
  }

  // ── FILTRADO ─────────────────────────────────────────────────

  function cumpleFiltros(item, estado) {
    if (estado.tipo !== 'todos' && item.tipo !== estado.tipo) return false;
    if (estado.temporada && !(item.temporadas || []).includes(estado.temporada))
      return false;
    if (estado.competicion && item.competicion !== estado.competicion)
      return false;
    if (estado.posicion && item.posicion !== estado.posicion) return false;
    if (estado.resultado && item.resultado !== estado.resultado) return false;
    if (estado.rival && item.rival !== estado.rival) return false;
    if (estado.localidad && String(item.esLocal) !== estado.localidad)
      return false;
    if (
      estado.nacionalidad &&
      !(item.nacionalidades || []).includes(estado.nacionalidad)
    )
      return false;
    if (estado.jornada && item.jornada !== estado.jornada) return false;
    if (estado.jugador && !(item.jugadores || []).includes(estado.jugador))
      return false;
    if (estado.tarjeta === 'amarilla' && !item.amarilla) return false;
    if (estado.tarjeta === 'roja' && !item.roja) return false;
    if (estado.tarjeta === 'ninguna' && (item.amarilla || item.roja))
      return false;

    if (estado.query) {
      const palabras = estado.query.split(/\s+/).filter(Boolean);
      const coincideTodas = palabras.every((p) => item._tokens.includes(p));
      if (!coincideTodas) return false;
    }

    return true;
  }

  function filtrar(indice, estado) {
    return indice.filter((item) => cumpleFiltros(item, estado));
  }

  // ── RENDER ───────────────────────────────────────────────────

  const ICONOS = {
    jugador: 'fa-user',
    entrenador: 'fa-clipboard-user',
    partido: 'fa-futbol',
    titulo: 'fa-trophy',
    estadio: 'fa-flag',
    historia: 'fa-landmark',
    oviesportinguista: 'fa-people-arrows',
    derbi: 'fa-shield-halved',
  };

  const ETIQUETAS_TIPO = {
    jugador: 'Jugador',
    entrenador: 'Entrenador',
    partido: 'Partido',
    titulo: 'Título',
    estadio: 'Estadio',
    historia: 'Historia',
    oviesportinguista: 'Oviesportinguista',
    derbi: 'Derbi',
  };

  function statsJugadorHtml(item, jugadorSeleccionado) {
    if (
      !jugadorSeleccionado ||
      item.tipo !== 'partido' ||
      !item.statsPorJugador
    )
      return '';
    const s = item.statsPorJugador[jugadorSeleccionado];
    if (!s) return '';

    const partes = [];
    if (s.esPortero) {
      partes.push(
        s.goles > 0
          ? `Encajó ${s.goles} gol${s.goles === 1 ? '' : 'es'}`
          : 'Portería a cero',
      );
    } else if (s.goles > 0) {
      partes.push(`${s.goles} gol${s.goles === 1 ? '' : 'es'}`);
    }
    if (s.asistencias > 0)
      partes.push(
        `${s.asistencias} asistencia${s.asistencias === 1 ? '' : 's'}`,
      );
    if (s.amarilla) partes.push('Amarilla');
    if (s.roja) partes.push('Roja');
    if (s.minutos) partes.push(`${s.minutos}'`);

    if (!partes.length) partes.push('Jugó sin incidencias');

    return `<p class="busc-stats-jugador"><i class="fas fa-star"></i> ${jugadorSeleccionado}: ${partes.join(' · ')}</p>`;
  }

  function crearTarjeta(item, jugadorSeleccionado) {
    const esEnlazable = !!item.url;
    const Tag = esEnlazable ? 'a' : 'div';
    const card = document.createElement(Tag);
    card.className = `busc-card busc-tipo-${item.tipo}`;
    if (esEnlazable) card.setAttribute('href', item.url);

    const iconoFoto = item.imagen
      ? `<img class="busc-foto" src="${item.imagen}" alt="" loading="lazy" onerror="this.outerHTML='<div class=&quot;busc-foto-fallback&quot;><i class=&quot;fas ${ICONOS[item.tipo]}&quot;></i></div>'" />`
      : `<div class="busc-foto-fallback"><i class="fas ${ICONOS[item.tipo]}"></i></div>`;

    function listaCorta(lista, icono) {
      if (!lista || !lista.length) return '';
      const maxVisibles = 6;
      const visibles = lista.slice(0, maxVisibles).join(', ');
      const resto = lista.length - maxVisibles;
      return `<p class="busc-jugadores"><i class="fas ${icono}"></i> ${visibles}${resto > 0 ? ` y ${resto} más` : ''}</p>`;
    }

    const jugadoresHtml = listaCorta(item.jugadores, 'fa-users');
    const goleadoresHtml = listaCorta(item.goleadores, 'fa-futbol');
    const statsHtml = statsJugadorHtml(item, jugadorSeleccionado);

    let tarjetasHtml = '';
    if (item.amarilla || item.roja) {
      tarjetasHtml = `<p class="busc-tarjetas">
        ${item.amarilla ? '<span class="busc-tarjeta busc-tarjeta-amarilla"></span>' : ''}
        ${item.roja ? '<span class="busc-tarjeta busc-tarjeta-roja"></span>' : ''}
      </p>`;
    }

    card.innerHTML = `
      ${iconoFoto}
      <div class="busc-info">
        <span class="busc-tipo-badge busc-tipo-badge-${item.tipo}">${ETIQUETAS_TIPO[item.tipo]}</span>
        <b class="busc-titulo">${item.titulo}</b>
        ${item.subtitulo ? `<p class="busc-subtitulo">${item.subtitulo}</p>` : ''}
        ${statsHtml}
        ${jugadoresHtml}
        ${goleadoresHtml}
        ${tarjetasHtml}
        ${item.meta ? `<span class="busc-meta busc-meta-${(item.resultado || '').toLowerCase()}">${item.meta}</span>` : ''}
      </div>
    `;
    return card;
  }

  function render(
    resultados,
    contenedor,
    contador,
    mostrados,
    jugadorSeleccionado,
  ) {
    contenedor.innerHTML = '';
    const lote = resultados.slice(0, mostrados);
    lote.forEach((item) =>
      contenedor.appendChild(crearTarjeta(item, jugadorSeleccionado)),
    );

    contador.textContent = resultados.length
      ? `${resultados.length} resultado${resultados.length === 1 ? '' : 's'}`
      : 'Sin resultados';

    return lote.length < resultados.length;
  }

  // ── INICIALIZACIÓN ───────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    const indice = construirIndice();
    poblarFiltros(indice);

    const inputTexto = document.getElementById('buscTexto');
    const selTipo = document.getElementById('buscTipoChips');
    const selTemporada = document.getElementById('buscTemporada');
    const selCompeticion = document.getElementById('buscCompeticion');
    const selPosicion = document.getElementById('buscPosicion');
    const selResultado = document.getElementById('buscResultado');
    const selRival = document.getElementById('buscRival');
    const selLocalidad = document.getElementById('buscLocalidad');
    const selJugador = document.getElementById('buscJugador');
    const contenedor = document.getElementById('buscResultados');
    const contador = document.getElementById('buscContador');
    const btnMas = document.getElementById('buscMostrarMas');
    const selJornada = document.getElementById('buscJornada');
    const selTarjeta = document.getElementById('buscTarjeta');
    const selNacionalidad = document.getElementById('buscNacionalidad');
    const btnLimpiar = document.getElementById('buscLimpiar');
    const campoResultado = document.getElementById('buscCampoResultado');
    const campoPosicion = document.getElementById('buscCampoPosicion');
    const campoRival = document.getElementById('buscCampoRival');
    const campoLocalidad = document.getElementById('buscCampoLocalidad');
    const campoJornada = document.getElementById('buscCampoJornada');
    const campoTarjeta = document.getElementById('buscCampoTarjeta');
    const campoNacionalidad = document.getElementById('buscCampoNacionalidad');
    const campoJugador = document.getElementById('buscCampoJugador');

    let resultadosActuales = [];
    let mostrados = PAGINA;

    function estadoActual() {
      return {
        query: normalizar(inputTexto.value.trim()),
        tipo:
          selTipo.querySelector('.busc-chip.active')?.dataset.tipo || 'todos',
        temporada: selTemporada.value,
        competicion: selCompeticion.value,
        posicion: selPosicion.value,
        resultado: selResultado.value,
        rival: selRival.value,
        localidad: selLocalidad.value,
        jornada: selJornada.value,
        tarjeta: selTarjeta.value,
        nacionalidad: selNacionalidad.value,
        jugador: selJugador.value,
      };
    }

    function actualizar() {
      const estado = estadoActual();

      // Cada filtro se oculta cuando el tipo elegido no lo usa para
      // nada, para no dejar en pantalla un control que no va a
      // cambiar ningún resultado.
      const esTipoJugador =
        estado.tipo === 'todos' || estado.tipo === 'jugador';
      const esTipoPartido =
        estado.tipo === 'todos' ||
        estado.tipo === 'partido' ||
        estado.tipo === 'derbi';
      const esTipoSoloPartido =
        estado.tipo === 'todos' || estado.tipo === 'partido';
      const esTipoConNacionalidad =
        estado.tipo === 'todos' ||
        estado.tipo === 'jugador' ||
        estado.tipo === 'entrenador';

      campoPosicion.style.display = esTipoJugador ? '' : 'none';
      campoResultado.style.display = esTipoPartido ? '' : 'none';
      campoRival.style.display = esTipoPartido ? '' : 'none';
      campoLocalidad.style.display = esTipoPartido ? '' : 'none';
      campoJornada.style.display = esTipoPartido ? '' : 'none';
      campoTarjeta.style.display = esTipoSoloPartido ? '' : 'none';
      campoNacionalidad.style.display = esTipoConNacionalidad ? '' : 'none';
      campoJugador.style.display = esTipoSoloPartido ? '' : 'none';

      mostrados = PAGINA;
      resultadosActuales = filtrar(indice, estado);
      const hayMas = render(
        resultadosActuales,
        contenedor,
        contador,
        mostrados,
        estado.jugador,
      );
      btnMas.style.display = hayMas ? '' : 'none';
    }

    let debounce;
    inputTexto.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(actualizar, 150);
    });

    [
      selTemporada,
      selCompeticion,
      selPosicion,
      selResultado,
      selRival,
      selLocalidad,
      selJornada,
      selTarjeta,
      selNacionalidad,
      selJugador,
    ].forEach((sel) => sel.addEventListener('change', actualizar));

    selTipo.querySelectorAll('.busc-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        selTipo
          .querySelectorAll('.busc-chip')
          .forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        actualizar();
      });
    });

    btnMas.addEventListener('click', () => {
      mostrados += PAGINA;
      const hayMas = render(
        resultadosActuales,
        contenedor,
        contador,
        mostrados,
        selJugador.value,
      );
      btnMas.style.display = hayMas ? '' : 'none';
    });

    btnLimpiar.addEventListener('click', () => {
      inputTexto.value = '';
      selTemporada.value = '';
      selCompeticion.value = '';
      selPosicion.value = '';
      selResultado.value = '';
      selRival.value = '';
      selLocalidad.value = '';
      selJornada.value = '';
      selTarjeta.value = '';
      selNacionalidad.value = '';
      selJugador.value = '';
      selTipo
        .querySelectorAll('.busc-chip')
        .forEach((c) => c.classList.remove('active'));
      selTipo
        .querySelector('.busc-chip[data-tipo="todos"]')
        .classList.add('active');
      actualizar();
    });

    actualizar();
  });
})();
