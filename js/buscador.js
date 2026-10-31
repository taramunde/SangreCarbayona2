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

  // Nombre mostrado → URL de su ficha, para poder enlazar desde la
  // ventana emergente de jugadores de un partido. Se rellena una vez
  // construido el índice (ver DOMContentLoaded). Si dos jugadores
  // distintos comparten nombre mostrado (apodo/nombre completo igual),
  // se queda con uno de los dos: la misma limitación que ya tiene el
  // filtro "Jugador", que también busca por nombre y no por código.
  let mapaJugadorUrl = {};

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
    const maestroEnt = CLUB_DATA.entrenadorMaestro || {};

    // Primera pasada: agrupar por partido (misma clave que ya usa
    // autoCalcularStatsEquipo en js/app.js) y recoger, para cada uno,
    // a TODOS los jugadores cuyo partidos[] lo incluye. Sin este
    // agrupamiento previo, el partido se quedaba solo con los datos
    // del primer jugador que lo tenía registrado y buscar por el
    // nombre de cualquier otro jugador que también lo jugó no
    // encontraba nada.
    const porClave = new Map();

    function grupoDe(clave, p, seasonId) {
      if (!porClave.has(clave)) {
        porClave.set(clave, {
          p,
          seasonId,
          jugadores: new Set(),
          entrenadores: new Set(),
          goleadores: new Set(),
          amarilla: false,
          roja: false,
          dobleAmarilla: false,
          statsPorJugador: {},
          // Prórroga: puede jugarla solo parte de la plantilla (p. ej. un
          // suplente que entró ya en los 90') — con que UNO solo llegue a
          // más de 90' en este partido, ya hubo prórroga para todos.
          maxMinutos: 0,
          penaltisLocal: undefined,
          penaltisVisitante: undefined,
        });
      }
      const grupo = porClave.get(clave);
      if ((p.minutos || 0) > grupo.maxMinutos) grupo.maxMinutos = p.minutos;
      if (
        grupo.penaltisLocal === undefined &&
        typeof p.penaltisLocal === 'number'
      ) {
        grupo.penaltisLocal = p.penaltisLocal;
        grupo.penaltisVisitante = p.penaltisVisitante;
      }
      return grupo;
    }

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
          const grupo = grupoDe(clave, p, seasonId);
          const esPortero = datosMaestro.posicion === 'Portero';
          grupo.jugadores.add(nombreJugador);
          // En los porteros, "goles" son los encajados, no marcados
          // (mismo criterio que ya usa el resto del proyecto) — no
          // deben contar como goleadores.
          if (p.goles > 0 && !esPortero) {
            grupo.goleadores.add(nombreJugador);
          }
          // Segunda amarilla (amarilla+roja sin ser roja directa) cuenta
          // como amarilla Y como "doble amarilla" propia, no como roja
          // suelta — mismo criterio que autoCalcularStatsJugador en
          // js/app.js.
          const esDobleAmarilla =
            p.amarilla === true && p.roja === true && p.rojaDirecta !== true;
          if (p.amarilla) grupo.amarilla = true;
          if (p.roja && (!p.amarilla || p.rojaDirecta === true))
            grupo.roja = true;
          if (esDobleAmarilla) grupo.dobleAmarilla = true;

          // Aportación individual de este jugador en este partido en
          // concreto, para poder mostrarla al filtrar por su nombre
          // (cuántos goles marcó, o si es portero cuántos encajó).
          grupo.statsPorJugador[nombreJugador] = {
            goles: p.goles || 0,
            esPortero,
            asistencias: p.asistencias || 0,
            amarilla: !!p.amarilla,
            roja: !!p.roja && (!p.amarilla || p.rojaDirecta === true),
            dobleAmarilla: esDobleAmarilla,
            minutos: p.minutos || 0,
          };
        });
      });

      // Entrenador(es) que dirigieron cada partido — mismos partidos[]
      // que ya usa autoCalcularStatsEntrenador en js/app.js, pero aquí
      // solo hace falta saber QUIÉN dirigió cada uno (no tienen goles ni
      // tarjetas propias).
      (temporada.cuerpoTecnico || []).forEach((entTemp) => {
        const datosMaestro = maestroEnt[entTemp.codigo] || {};
        const nombreEnt =
          datosMaestro.apodo || datosMaestro.nombreCompleto || entTemp.codigo;

        (entTemp.partidos || []).forEach((p) => {
          if (!p.local || !p.visitante || !p.fecha) return;
          const clave = `${p.competicion}|${p.jornada}|${p.fecha}`;
          grupoDe(clave, p, seasonId).entrenadores.add(nombreEnt);
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
        entrenadores,
        goleadores,
        amarilla,
        roja,
        dobleAmarilla,
        statsPorJugador,
        maxMinutos,
        penaltisLocal,
        penaltisVisitante,
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
        const listaEntrenadores = Array.from(entrenadores);
        const listaGoleadores = Array.from(goleadores);
        const golesFavor = esLocal ? p.golesLocal : p.golesVisitante;
        const golesContra = esLocal ? p.golesVisitante : p.golesLocal;
        const hayPenaltis = typeof penaltisLocal === 'number';
        const prorroga = maxMinutos > 90 || hayPenaltis;
        const penaltisMarcador = hayPenaltis
          ? `${penaltisLocal}-${penaltisVisitante} pen.`
          : '';

        // El Oviedo marcó pero ningún jugador tiene gol registrado en
        // los datos: lo más probable es que sea un gol en propia
        // puerta del rival (no sale en el partidos[] de ningún
        // jugador del Oviedo), aunque también podría ser un hueco en
        // los datos todavía sin rellenar. Se marca igual para no dejar
        // el partido sin ninguna pista de quién/qué hizo el gol.
        const golesOviedo = esLocal ? p.golesLocal : p.golesVisitante;
        const golSinAutor =
          typeof golesOviedo === 'number' &&
          golesOviedo > 0 &&
          listaGoleadores.length === 0;

        indice.push({
          tipo: 'partido',
          titulo: `${p.local} ${marcador} ${p.visitante}`.trim(),
          subtitulo: `${p.competicion || ''}${p.jornada ? ' · Jornada ' + p.jornada : ''} · ${seasonId.replace('-', '/')}`,
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
          entrenadores: listaEntrenadores,
          goleadores: listaGoleadores,
          golSinAutor,
          statsPorJugador,
          amarilla,
          roja,
          dobleAmarilla,
          golesFavor: typeof golesFavor === 'number' ? golesFavor : null,
          golesContra: typeof golesContra === 'number' ? golesContra : null,
          prorroga,
          penaltis: hayPenaltis,
          penaltisMarcador,
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
              listaEntrenadores.join(' '),
              listaGoleadores.join(' '),
              golSinAutor ? 'propia puerta autogol' : '',
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

  // Reutilizado por el asistente (js/asistente.js), que carga este
  // archivo en cualquier página para responder preguntas con los mismos
  // datos que el buscador.
  window.SCIndice = { construir: construirIndice, normalizar };

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

  // "indiceTipo" es el subconjunto del índice que corresponde al tipo
  // de contenido elegido (o el índice completo si es "todos"): cada
  // desplegable solo debe ofrecer valores que existan de verdad para
  // ese tipo (p. ej. si el tipo es "Entrenadores", "Nacionalidad" no
  // debe listar nacionalidades que solo tengan jugadores, aunque sí
  // existan en el índice completo).
  //
  // "indiceCompleto" se usa aparte solo para el desplegable de
  // "Jugador" (quién jugó cada partido): esa lista sale siempre de
  // los partidos, nunca de las fichas de jugador, así que no debe
  // vaciarse cuando el tipo elegido es "Partidos" (que es precisamente
  // cuando ese filtro tiene sentido y se muestra).
  function poblarFiltros(indiceTipo, indiceCompleto) {
    const temporadas = indiceTipo.flatMap((i) => i.temporadas || []);
    const competiciones = indiceTipo.map((i) => i.competicion);
    const posiciones = indiceTipo.map((i) => i.posicion);
    const rivales = indiceTipo.map((i) => i.rival);
    const nacionalidades = indiceTipo.flatMap((i) => i.nacionalidades || []);
    const jornadas = indiceTipo.map((i) => i.jornada);
    const nombresJugadores = Array.from(
      new Set(
        indiceCompleto
          .filter((i) => i.tipo === 'partido')
          .flatMap((i) => i.jugadores || []),
      ),
    );
    const nombresEntrenadores = Array.from(
      new Set(
        indiceCompleto
          .filter((i) => i.tipo === 'partido')
          .flatMap((i) => i.entrenadores || []),
      ),
    );

    poblarSelect(
      document.getElementById('buscJugador'),
      nombresJugadores,
      'Elige un jugador...',
    );
    poblarSelect(
      document.getElementById('buscEntrenador'),
      nombresEntrenadores,
      'Elige un entrenador...',
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
    if (
      estado.entrenador &&
      !(item.entrenadores || []).includes(estado.entrenador)
    )
      return false;

    if (estado.tarjeta) {
      // Si hay un jugador concreto elegido, la tarjeta tiene que ser la
      // SUYA en ese partido, no la de cualquier otro compañero que
      // también jugara (item.amarilla/item.roja son del partido entero,
      // no de una persona en particular).
      const statsJugador =
        estado.jugador && item.statsPorJugador
          ? item.statsPorJugador[estado.jugador]
          : null;
      const tieneAmarilla = statsJugador
        ? statsJugador.amarilla
        : item.amarilla;
      const tieneRoja = statsJugador ? statsJugador.roja : item.roja;
      const tieneDoble = statsJugador
        ? statsJugador.dobleAmarilla
        : item.dobleAmarilla;
      if (estado.tarjeta === 'amarilla' && !tieneAmarilla) return false;
      if (estado.tarjeta === 'roja' && !tieneRoja) return false;
      if (estado.tarjeta === 'dobleamarilla' && !tieneDoble) return false;
      if (estado.tarjeta === 'ninguna' && (tieneAmarilla || tieneRoja))
        return false;
    }

    if (estado.prorroga === 'si' && !item.prorroga) return false;
    if (estado.prorroga === 'no' && item.prorroga) return false;
    if (estado.prorroga === 'penaltis' && !item.penaltis) return false;

    if (estado.fechaDesde && item.fecha && item.fecha < estado.fechaDesde)
      return false;
    if (estado.fechaHasta && item.fecha && item.fecha > estado.fechaHasta)
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

  const CLAVES_TIPO = {
    jugador: 'busc_badge_jugador',
    entrenador: 'busc_badge_entrenador',
    partido: 'busc_badge_partido',
    titulo: 'busc_badge_titulo',
    estadio: 'busc_badge_estadio',
    historia: 'busc_badge_historia',
    oviesportinguista: 'busc_badge_oviesportinguista',
    derbi: 'busc_badge_derbi',
  };

  function etiquetaTipo(tipo) {
    return typeof window.t === 'function' ? window.t(CLAVES_TIPO[tipo]) : tipo;
  }

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
    const golEtiqueta = (n) =>
      n === 1 ? t('busc_gol_singular') : t('busc_gol_plural');
    if (s.esPortero) {
      partes.push(
        s.goles > 0
          ? `${t('busc_encajo')} ${s.goles} ${golEtiqueta(s.goles)}`
          : t('busc_porteria_a_cero'),
      );
    } else if (s.goles > 0) {
      partes.push(`${s.goles} ${golEtiqueta(s.goles)}`);
    }
    if (s.asistencias > 0)
      partes.push(
        `${s.asistencias} ${t('asistencia')}${s.asistencias === 1 ? '' : 's'}`,
      );
    if (s.amarilla) partes.push(t('busc_amarilla_singular'));
    if (s.roja) partes.push(t('busc_roja_singular'));
    if (s.minutos) partes.push(`${s.minutos}'`);

    if (!partes.length) partes.push(t('busc_jugo_sin_incidencias'));

    return `<p class="busc-stats-jugador"><i class="fas fa-star"></i> ${jugadorSeleccionado}: ${partes.join(' · ')}</p>`;
  }

  // ── VENTANA EMERGENTE CON EL LISTADO COMPLETO ───────────────────

  function abrirModal(tituloPartido, lista, etiqueta) {
    const overlay = document.getElementById('buscModalOverlay');
    const tituloEl = document.getElementById('buscModalTitulo');
    const subtituloEl = document.getElementById('buscModalSubtitulo');
    const listaEl = document.getElementById('buscModalLista');
    if (!overlay || !tituloEl || !subtituloEl || !listaEl) return;

    tituloEl.textContent = `${etiqueta} (${lista.length})`;
    subtituloEl.textContent = tituloPartido;
    listaEl.innerHTML = lista
      .map((nombre) => {
        const url = mapaJugadorUrl[nombre];
        return url
          ? `<li><a href="${url}">${nombre}</a></li>`
          : `<li>${nombre}</li>`;
      })
      .join('');
    overlay.classList.add('visible');
  }

  function cerrarModal() {
    const overlay = document.getElementById('buscModalOverlay');
    if (overlay) overlay.classList.remove('visible');
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

    function listaCorta(lista, icono, clave) {
      if (!lista || !lista.length) return '';
      const maxVisibles = 6;
      const visibles = lista.slice(0, maxVisibles).join(', ');
      const resto = lista.length - maxVisibles;
      const yMas =
        resto > 0 ? ` ${t('busc_y_mas').replace('{n}', resto)}` : '';
      return `<p class="busc-jugadores busc-clicable" data-lista="${clave}"><i class="fas ${icono}"></i> ${visibles}${yMas}</p>`;
    }

    const jugadoresHtml = listaCorta(item.jugadores, 'fa-users', 'jugadores');
    const goleadoresHtml = item.golSinAutor
      ? `<p class="busc-jugadores"><i class="fas fa-futbol"></i> ${t('busc_gol_sin_autor')}</p>`
      : listaCorta(item.goleadores, 'fa-futbol', 'goleadores');
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
        <span class="busc-tipo-badge busc-tipo-badge-${item.tipo}">${etiquetaTipo(item.tipo)}</span>
        <b class="busc-titulo">${item.titulo}</b>
        ${item.subtitulo ? `<p class="busc-subtitulo">${item.subtitulo}</p>` : ''}
        ${item.prorroga ? `<p class="busc-prorroga"><i class="fas fa-clock"></i> ${item.penaltisMarcador || t('busc_prorroga_generica')}</p>` : ''}
        ${statsHtml}
        ${jugadoresHtml}
        ${goleadoresHtml}
        ${tarjetasHtml}
        ${item.meta ? `<span class="busc-meta busc-meta-${(item.resultado || '').toLowerCase()}">${item.meta}</span>` : ''}
      </div>
    `;

    card.querySelectorAll('[data-lista]').forEach((el) => {
      const clave = el.dataset.lista;
      const lista = clave === 'goleadores' ? item.goleadores : item.jugadores;
      const etiqueta =
        clave === 'goleadores'
          ? t('busc_modal_goleadores')
          : t('busc_modal_jugadores');
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        abrirModal(item.titulo, lista, etiqueta);
      });
    });

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
      ? `${resultados.length} ${resultados.length === 1 ? t('busc_resultado_singular') : t('busc_resultado_plural')}`
      : t('busc_sin_resultados');

    return lote.length < resultados.length;
  }

  // ── TARJETA-RESUMEN (respuesta directa a "cuántos/cuántas veces") ──
  // Se calcula sumando los partidos que ya han pasado el resto de
  // filtros (rival, competición, temporada, resultado, local/
  // visitante, jornada) — no vuelve a filtrar nada por su cuenta, solo
  // agrega lo que ya se está mostrando abajo en la lista.

  function calcularResumen(resultadosFiltrados, estado) {
    if (!estado.jugador && !estado.entrenador) return null;
    const partidos = resultadosFiltrados.filter((i) => i.tipo === 'partido');
    if (!partidos.length) return null;

    if (estado.jugador) {
      const r = {
        quien: 'jugador',
        nombre: estado.jugador,
        esPortero: false,
        pj: 0,
        goles: 0,
        porteriasACero: 0,
        asistencias: 0,
        v: 0,
        e: 0,
        d: 0,
        amarillas: 0,
        rojas: 0,
        dobles: 0,
        minutos: 0,
      };
      partidos.forEach((item) => {
        const s = item.statsPorJugador && item.statsPorJugador[estado.jugador];
        if (!s) return;
        r.pj++;
        r.goles += s.goles || 0;
        r.asistencias += s.asistencias || 0;
        r.minutos += s.minutos || 0;
        if (s.amarilla) r.amarillas++;
        if (s.roja) r.rojas++;
        if (s.dobleAmarilla) r.dobles++;
        if (s.esPortero) {
          r.esPortero = true;
          if (!s.goles) r.porteriasACero++;
        }
        if (item.resultado === 'V') r.v++;
        else if (item.resultado === 'E') r.e++;
        else if (item.resultado === 'D') r.d++;
      });
      return r;
    }

    const r = {
      quien: 'entrenador',
      nombre: estado.entrenador,
      pj: 0,
      v: 0,
      e: 0,
      d: 0,
      gf: 0,
      gc: 0,
    };
    partidos.forEach((item) => {
      r.pj++;
      if (item.resultado === 'V') r.v++;
      else if (item.resultado === 'E') r.e++;
      else if (item.resultado === 'D') r.d++;
      if (typeof item.golesFavor === 'number') r.gf += item.golesFavor;
      if (typeof item.golesContra === 'number') r.gc += item.golesContra;
    });
    return r;
  }

  // Frase descriptiva con los filtros activos, para que la tarjeta deje
  // claro exactamente qué se está contando ("vs Sporting, en Liga,
  // fuera de casa...").
  function describirFiltros(estado) {
    const partes = [];
    if (estado.rival) partes.push(`${t('busc_filtro_contra')} ${estado.rival}`);
    if (estado.competicion)
      partes.push(`${t('busc_filtro_en')} ${estado.competicion}`);
    if (estado.temporada)
      partes.push(`${t('busc_filtro_temporada')} ${estado.temporada}`);
    if (estado.localidad)
      partes.push(
        estado.localidad === 'true'
          ? t('busc_filtro_en_casa')
          : t('busc_filtro_fuera_de_casa'),
      );
    if (estado.resultado)
      partes.push(
        {
          V: t('busc_filtro_ganados'),
          E: t('busc_filtro_empatados'),
          D: t('busc_filtro_perdidos'),
        }[estado.resultado],
      );
    if (estado.jornada)
      partes.push(`${t('busc_filtro_jornada')} ${estado.jornada}`);
    return partes.join(' · ');
  }

  function tile(numero, etiqueta) {
    return `<div class="busc-resumen-tile"><span class="busc-resumen-num">${numero}</span><span class="busc-resumen-label">${etiqueta}</span></div>`;
  }

  function renderResumen(contenedor, resultadosFiltrados, estado) {
    const r = calcularResumen(resultadosFiltrados, estado);
    if (!r) {
      contenedor.innerHTML = '';
      return;
    }

    const filtrosTexto = describirFiltros(estado);
    const tilesHtml =
      r.quien === 'jugador'
        ? [
            tile(r.pj, t('busc_res_partidos')),
            r.esPortero
              ? tile(r.goles, t('busc_res_encajados'))
              : tile(r.goles, t('busc_res_goles')),
            r.esPortero
              ? tile(r.porteriasACero, t('busc_res_porterias_cero'))
              : '',
            !r.esPortero ? tile(r.asistencias, t('busc_res_asistencias')) : '',
            tile(r.v, t('busc_res_victorias')),
            tile(r.e, t('busc_res_empates')),
            tile(r.d, t('busc_res_derrotas')),
            tile(r.amarillas, t('busc_res_amarillas')),
            tile(r.rojas, t('busc_res_rojas')),
            r.dobles > 0
              ? tile(r.dobles, t('busc_res_doble_amarilla'))
              : '',
          ].join('')
        : [
            tile(r.pj, t('busc_res_partidos_dirigidos')),
            tile(r.v, t('busc_res_victorias')),
            tile(r.e, t('busc_res_empates')),
            tile(r.d, t('busc_res_derrotas')),
            tile(r.gf, t('busc_res_goles_favor')),
            tile(r.gc, t('busc_res_goles_contra')),
          ].join('');

    contenedor.innerHTML = `
      <div class="busc-resumen">
        <div class="busc-resumen-cabecera">
          <i class="fas fa-chart-simple"></i>
          <div>
            <b>${r.nombre}</b>
            ${filtrosTexto ? `<span class="busc-resumen-filtros">${filtrosTexto}</span>` : ''}
          </div>
        </div>
        <div class="busc-resumen-tiles">${tilesHtml}</div>
      </div>
    `;
  }

  // ── RANKING (máximo goleador / más partidos, sin fijar un jugador) ──
  // Se muestra en vez del resumen de arriba cuando NO se ha elegido un
  // jugador/entrenador concreto: responde a "¿quién ha marcado más
  // contra tal rival?" en lugar de "cuánto ha marcado X contra tal
  // rival?". Usa los mismos filtros ya aplicados (rival, competición,
  // temporada, resultado, fechas...).
  const TOP_RANKING = 5;
  // Se conserva entre re-pintados (cada cambio de filtro vuelve a
  // generar el ranking), para que no se pliegue solo al filtrar.
  let rankingDesplegado = false;

  function calcularRanking(resultadosFiltrados) {
    const partidos = resultadosFiltrados.filter((i) => i.tipo === 'partido');
    if (!partidos.length) return null;

    const acumulado = {};
    partidos.forEach((item) => {
      Object.entries(item.statsPorJugador || {}).forEach(([nombre, s]) => {
        if (!acumulado[nombre]) {
          acumulado[nombre] = {
            nombre,
            partidos: 0,
            goles: 0,
            asistencias: 0,
            esPortero: s.esPortero,
            primeraTemporada: item.temporada,
            ultimaTemporada: item.temporada,
          };
        }
        const a = acumulado[nombre];
        a.partidos++;
        a.goles += s.goles || 0;
        a.asistencias += s.asistencias || 0;
        // Ids tipo "2026-27": el orden de texto coincide con el cronológico.
        if (item.temporada && item.temporada > (a.ultimaTemporada || ''))
          a.ultimaTemporada = item.temporada;
        if (
          item.temporada &&
          (!a.primeraTemporada || item.temporada < a.primeraTemporada)
        )
          a.primeraTemporada = item.temporada;
      });
    });

    // A igualdad de goles/partidos, primero quien jugó más recientemente.
    const porTemporadaReciente = (a, b) =>
      (b.ultimaTemporada || '').localeCompare(a.ultimaTemporada || '') ||
      a.nombre.localeCompare(b.nombre, 'es');

    const todos = Object.values(acumulado);
    const goleadores = todos
      .filter((v) => !v.esPortero && v.goles > 0)
      .sort((a, b) => b.goles - a.goles || porTemporadaReciente(a, b));
    const masPartidos = todos
      .slice()
      .sort((a, b) => b.partidos - a.partidos || porTemporadaReciente(a, b));

    if (!goleadores.length && !masPartidos.length) return null;
    return { goleadores, masPartidos, totalPartidos: partidos.length };
  }

  function textoTemporadas(it) {
    if (!it.primeraTemporada) return '';
    const ini = it.primeraTemporada.replace('-', '/');
    const fin = (it.ultimaTemporada || it.primeraTemporada).replace('-', '/');
    return ini === fin ? ini : `${ini} – ${fin}`;
  }

  function listaRanking(items, valorClave, etiquetaSingular, etiquetaPlural) {
    if (!items.length)
      return `<p class="busc-ranking-vacio">${t('busc_sin_datos')}</p>`;
    return `<ol class="busc-ranking-lista">${items
      .map((it) => {
        const url = mapaJugadorUrl[it.nombre];
        const nombreHtml = url
          ? `<a href="${url}">${it.nombre}</a>`
          : it.nombre;
        const valor = it[valorClave];
        const etiqueta = valor === 1 ? etiquetaSingular : etiquetaPlural;
        const temporadas = textoTemporadas(it);
        return `<li><span class="busc-ranking-nombre">${nombreHtml}${temporadas ? `<small class="busc-ranking-temporadas">${temporadas}</small>` : ''}</span><span class="busc-ranking-valor">${valor} ${etiqueta}</span></li>`;
      })
      .join('')}</ol>`;
  }

  function renderRanking(contenedor, resultadosFiltrados, estado) {
    // Solo tiene sentido para resultados de tipo partido, y solo cuando
    // no hay ya un jugador/entrenador concreto elegido (en ese caso se
    // ve el resumen de arriba, que responde algo más concreto).
    const aplica =
      (estado.tipo === 'todos' || estado.tipo === 'partido') &&
      !estado.jugador &&
      !estado.entrenador;
    if (!aplica) {
      contenedor.innerHTML = '';
      return;
    }
    const ranking = calcularRanking(resultadosFiltrados);
    if (!ranking) {
      contenedor.innerHTML = '';
      return;
    }

    const filtrosTexto = describirFiltros(estado);
    const totalPartidosTexto = t('busc_ranking_sobre_n_partidos').replace(
      '{n}',
      ranking.totalPartidos,
    );
    const hayMas =
      ranking.goleadores.length > TOP_RANKING ||
      ranking.masPartidos.length > TOP_RANKING;
    const desplegado = rankingDesplegado && hayMas;
    const recorte = (lista) =>
      desplegado ? lista : lista.slice(0, TOP_RANKING);

    const textoBoton = desplegado
      ? `<i class="fas fa-chevron-up"></i> <span>${t('busc_ranking_plegar')}</span>`
      : `<i class="fas fa-chevron-down"></i> <span>${t('busc_ranking_ver_todo')
          .replace('{g}', ranking.goleadores.length)
          .replace('{p}', ranking.masPartidos.length)}</span>`;

    contenedor.innerHTML = `
      <div class="busc-ranking${desplegado ? ' busc-ranking--desplegado' : ''}">
        <div class="busc-ranking-cabecera">
          <i class="fas fa-ranking-star"></i>
          <div>
            <b>${t('busc_ranking_titulo')}${filtrosTexto ? ` · ${filtrosTexto}` : ` · ${t('busc_ranking_toda_historia')}`}</b>
            <span class="busc-resumen-filtros">${totalPartidosTexto}</span>
          </div>
        </div>
        <div class="busc-ranking-columnas">
          <div class="busc-ranking-col">
            <h4><i class="fas fa-futbol"></i> ${t('busc_ranking_goleadores')}${desplegado ? ` <span class="busc-ranking-total">(${ranking.goleadores.length})</span>` : ''}</h4>
            ${listaRanking(recorte(ranking.goleadores), 'goles', t('busc_gol_singular'), t('busc_gol_plural'))}
          </div>
          <div class="busc-ranking-col">
            <h4><i class="fas fa-user-group"></i> ${t('busc_ranking_mas_partidos')}${desplegado ? ` <span class="busc-ranking-total">(${ranking.masPartidos.length})</span>` : ''}</h4>
            ${listaRanking(recorte(ranking.masPartidos), 'partidos', t('busc_partido_singular'), t('busc_partido_plural'))}
          </div>
        </div>
        ${hayMas ? `<button type="button" class="busc-ranking-toggle" aria-expanded="${desplegado}">${textoBoton}</button>` : ''}
      </div>
    `;

    const boton = contenedor.querySelector('.busc-ranking-toggle');
    if (boton) {
      boton.addEventListener('click', () => {
        rankingDesplegado = !rankingDesplegado;
        renderRanking(contenedor, resultadosFiltrados, estado);
        if (!rankingDesplegado)
          contenedor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  // ── INICIALIZACIÓN ───────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('buscTexto')) return;
    const indice = construirIndice();
    poblarFiltros(indice, indice);

    indice.forEach((i) => {
      if (i.tipo === 'jugador' && i.url) mapaJugadorUrl[i.titulo] = i.url;
    });

    const inputTexto = document.getElementById('buscTexto');
    const selTipo = document.getElementById('buscTipoChips');
    const selTemporada = document.getElementById('buscTemporada');
    const selCompeticion = document.getElementById('buscCompeticion');
    const selPosicion = document.getElementById('buscPosicion');
    const selResultado = document.getElementById('buscResultado');
    const selRival = document.getElementById('buscRival');
    const selLocalidad = document.getElementById('buscLocalidad');
    const selJugador = document.getElementById('buscJugador');
    const selEntrenador = document.getElementById('buscEntrenador');
    const contenedor = document.getElementById('buscResultados');
    const resumenContenedor = document.getElementById('buscResumen');
    const rankingContenedor = document.getElementById('buscRanking');
    const contador = document.getElementById('buscContador');
    const btnMas = document.getElementById('buscMostrarMas');
    const selJornada = document.getElementById('buscJornada');
    const selTarjeta = document.getElementById('buscTarjeta');
    const selProrroga = document.getElementById('buscProrroga');
    const inputFechaDesde = document.getElementById('buscFechaDesde');
    const inputFechaHasta = document.getElementById('buscFechaHasta');
    const selNacionalidad = document.getElementById('buscNacionalidad');
    const btnLimpiar = document.getElementById('buscLimpiar');
    const campoResultado = document.getElementById('buscCampoResultado');
    const campoPosicion = document.getElementById('buscCampoPosicion');
    const campoRival = document.getElementById('buscCampoRival');
    const campoLocalidad = document.getElementById('buscCampoLocalidad');
    const campoJornada = document.getElementById('buscCampoJornada');
    const campoTarjeta = document.getElementById('buscCampoTarjeta');
    const campoProrroga = document.getElementById('buscCampoProrroga');
    const campoFechaDesde = document.getElementById('buscCampoFechaDesde');
    const campoFechaHasta = document.getElementById('buscCampoFechaHasta');
    const campoNacionalidad = document.getElementById('buscCampoNacionalidad');
    const campoJugador = document.getElementById('buscCampoJugador');
    const campoEntrenador = document.getElementById('buscCampoEntrenador');

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
        entrenador: selEntrenador.value,
        prorroga: selProrroga.value,
        fechaDesde: inputFechaDesde.value,
        fechaHasta: inputFechaHasta.value,
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
      campoProrroga.style.display = esTipoSoloPartido ? '' : 'none';
      campoFechaDesde.style.display = esTipoPartido ? '' : 'none';
      campoFechaHasta.style.display = esTipoPartido ? '' : 'none';
      campoNacionalidad.style.display = esTipoConNacionalidad ? '' : 'none';
      campoJugador.style.display = esTipoSoloPartido ? '' : 'none';
      campoEntrenador.style.display = esTipoSoloPartido ? '' : 'none';

      mostrados = PAGINA;
      resultadosActuales = filtrar(indice, estado);
      renderResumen(resumenContenedor, resultadosActuales, estado);
      renderRanking(rankingContenedor, resultadosActuales, estado);
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
      selProrroga,
      inputFechaDesde,
      inputFechaHasta,
      selNacionalidad,
      selJugador,
      selEntrenador,
    ].forEach((sel) => sel.addEventListener('change', actualizar));

    // Filtros secundarios (todos salvo el texto libre y el propio tipo):
    // se reinician cada vez que se cambia de tipo de contenido. Si no,
    // un filtro elegido para "Partidos" (p. ej. Rival) se queda puesto
    // por debajo aunque el campo esté oculto, y como Oviesportinguistas
    // o Derbis no tienen ese dato, el filtro los descartaba todos sin
    // dar ninguna pista de por qué no salía nada.
    function resetFiltrosSecundarios() {
      selTemporada.value = '';
      selCompeticion.value = '';
      selPosicion.value = '';
      selResultado.value = '';
      selRival.value = '';
      selLocalidad.value = '';
      selJornada.value = '';
      selTarjeta.value = '';
      selProrroga.value = '';
      inputFechaDesde.value = '';
      inputFechaHasta.value = '';
      selNacionalidad.value = '';
      selJugador.value = '';
      selEntrenador.value = '';
    }

    // Recalcula las opciones de cada desplegable para que solo ofrezcan
    // valores que existan de verdad dentro del tipo de contenido
    // elegido (p. ej. "Nacionalidad" no debe listar nacionalidades que
    // solo tengan jugadores si el tipo elegido es "Entrenadores").
    function actualizarFiltrosDisponibles(tipo) {
      const indiceTipo =
        tipo === 'todos' ? indice : indice.filter((i) => i.tipo === tipo);
      poblarFiltros(indiceTipo, indice);
    }

    selTipo.querySelectorAll('.busc-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        selTipo
          .querySelectorAll('.busc-chip')
          .forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        resetFiltrosSecundarios();
        actualizarFiltrosDisponibles(chip.dataset.tipo);
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
      resetFiltrosSecundarios();
      selTipo
        .querySelectorAll('.busc-chip')
        .forEach((c) => c.classList.remove('active'));
      selTipo
        .querySelector('.busc-chip[data-tipo="todos"]')
        .classList.add('active');
      actualizarFiltrosDisponibles('todos');
      actualizar();
    });

    // ── Cierre de la ventana emergente de jugadores/goleadores ──
    const modalOverlay = document.getElementById('buscModalOverlay');
    const modalCerrar = document.getElementById('buscModalCerrar');
    if (modalCerrar) modalCerrar.addEventListener('click', cerrarModal);
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) cerrarModal();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cerrarModal();
    });

    // Soporte para ?q=... en la URL, para que el SearchAction del
    // JSON-LD sitewide (js/seo.js) y los enlaces compartidos lleguen
    // con la búsqueda ya rellena y ejecutada.
    const qUrl = new URLSearchParams(window.location.search).get('q');
    if (qUrl) inputTexto.value = qUrl;

    actualizar();

    // Para que setLanguage() (js/i18n.js) pueda volver a pintar las
    // tarjetas, el resumen y el ranking al cambiar de idioma, ya que
    // su contenido se genera aquí dinámicamente y no vía data-i18n.
    window.renderBuscador = actualizar;
  });
})();
