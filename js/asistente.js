/* ===================================
   ASISTENTE.JS — "Pregúntale al Carbayón"
   Chat que responde preguntas sobre los datos de la web (jugadores,
   entrenadores, partidos, rivales, temporadas) sin IA ni servidor:
   entiende la pregunta por palabras clave y calcula la respuesta en el
   navegador con los mismos datos que usa el resto de la web, así que
   crece solo según se van metiendo datos.

   Lo carga js/main.js en todas las páginas. Los datos (algunos pesan
   bastante) solo se descargan la primera vez que se abre el chat.

   Para enseñarle un tipo de pregunta nuevo: añadir una entrada en
   INTENCIONES (palabras que la delatan) y su respuesta en responder().
   =================================== */

(function () {
  'use strict';

  if (window.SCAsistente) return;

  const scriptActual = document.currentScript;
  const SRC = scriptActual ? scriptActual.src : '';
  // Raíz de la web (la carpeta que contiene js/), válida también desde
  // /fichas/, /partidos/ o /juegos/.
  const RAIZ = new URL('../', SRC || window.location.href).href;
  const NOCACHE = SRC.includes('?') ? SRC.split('?')[1] : '';
  const OVIEDO = 'Real Oviedo';

  // Mismo orden que buscador.html: algunos dependen de los anteriores.
  const SCRIPTS_DATOS = [
    'data-club',
    'data-jugadores',
    'data-temporada-actual',
    'data-historico',
    'data-utils',
    // Nombres históricos de clubes: los mismos que usa el generador para
    // las páginas de historial (partidos/rival-...html).
    'data-equipos',
    // Goles en propia puerta de rivales (los lee buscador.js al
    // construir el índice de partidos).
    'data-goles-propia',
    'data-palmares',
    'data-estadios',
    'data-historia',
    'data-oviesportinguistas',
    'data-derbis',
    'buscador',
  ];

  // ── UTILIDADES ───────────────────────────────────────────────

  function norm(str) {
    return String(str || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/\./g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function plural(n, singular, pluralTxt) {
    return `${n} ${n === 1 ? singular : pluralTxt}`;
  }

  const MESES = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  function fechaLarga(iso) {
    if (!iso) return '';
    const [a, m, d] = iso.split('-').map(Number);
    if (!a || !m || !d) return iso;
    return `${d} de ${MESES[m - 1]} de ${a}`;
  }

  function nombreTemporada(id) {
    return String(id || '').replace('-', '/');
  }

  function slug(texto) {
    return String(texto || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[.,'´`’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function url(relativa) {
    return new URL(relativa, RAIZ).href;
  }

  function enlace(texto, href) {
    return href ? `<a href="${esc(href)}">${esc(texto)}</a>` : esc(texto);
  }

  // Páginas de partido/rival generadas por generador/: casi siempre
  // existen, pero algunos nombres de los datos no coinciden con el
  // archivo, así que se comprueban antes de dejar el enlace activo.
  function enlaceVerificado(texto, href) {
    return `<a href="${esc(href)}" data-verificar="1">${esc(texto)}</a>`;
  }

  function cargarScript(nombre) {
    if (document.querySelector(`script[src*="js/${nombre}.js"]`))
      return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = url(`js/${nombre}.js${NOCACHE ? '?' + NOCACHE : ''}`);
      s.onload = resolve;
      s.onerror = () => reject(new Error(nombre));
      document.head.appendChild(s);
    });
  }

  async function cargarDatos() {
    for (const nombre of SCRIPTS_DATOS) {
      await cargarScript(nombre);
    }
  }

  // ── MODELO DE DATOS ──────────────────────────────────────────

  let M = null; // se construye una sola vez, al abrir el chat

  const PREFIJOS_CLUB = new Set(
    'cd sd ud fc cf ad ce rc rcd rs rsd ca cp ue up ae ub ucam r'.split(' '),
  );
  const PALABRAS_VACIAS = new Set('de la las los el del y'.split(' '));
  // Palabras que nunca deben tomarse por un nombre aunque coincidan con
  // un apodo o con parte del nombre de un club.
  const NO_SON_NOMBRES = new Set(
    (
      'real oviedo club futbol deportivo deportiva cultural union atletico ' +
      'balompie sport universidad gran canaria goles gol partido partidos ' +
      'temporada temporadas contra copa liga casa fuera jugado jugador ' +
      'jugadores entrenador entrenadores cuantos cuantas quien quienes mas ' +
      'veces campo primera segunda division ultimo ultima primer historia ' +
      'marcado marco tarjetas rojas amarillas minutos edad altura apodo ' +
      'nombre nacionalidad donde cuando sido este esta todos todas'
    ).split(' '),
  );
  const APELLIDOS_COMUNES = new Set(
    (
      'garcia fernandez gonzalez rodriguez lopez martinez sanchez perez ' +
      'gomez martin jimenez ruiz hernandez diaz moreno alvarez munoz ' +
      'romero alonso gutierrez navarro torres dominguez vazquez ramos ' +
      'gil ramirez serrano blanco suarez molina morales ortega delgado ' +
      'castro ortiz rubio marin sanz iglesias nunez medina garrido ' +
      'menendez fernandes'
    ).split(' '),
  );
  const ALIAS_EXTRA_RIVALES = {
    depor: 'R.C. Deportivo de La Coruña',
    deportivo: 'R.C. Deportivo de La Coruña',
    barca: 'F.C. Barcelona',
    atleti: 'Atlético de Madrid',
    nastic: 'Gimnàstic de Tarragona',
    sporting: 'Real Sporting de Gijón',
    alaves: 'Deportivo Alavés',
    castilla: 'Real Madrid Castilla',
  };

  function claveClub(nombre) {
    return norm(nombre)
      .split(' ')
      .filter((w) => !PREFIJOS_CLUB.has(w) && !PALABRAS_VACIAS.has(w))
      .join(' ')
      .replace(/(.)\1+/g, '$1');
  }

  // ── CLUBES CON VARIOS NOMBRES (js/data-equipos.js) ───────────
  // Misma lógica que generador/partidos-comun.js (crearBuscadorDeClub):
  // (nombre en el partido, temporada) → nombre ACTUAL del club, que es
  // el que da nombre a su página de historial. Un alias con periodo
  // (desde/hasta) gana a uno sin periodo; si nada encaja, el nombre se
  // queda tal cual.
  function claveEquipo(nombre) {
    return String(nombre || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  function crearBuscadorDeClub(CD) {
    const reglas = [];
    const otrosNombres = new Map(); // nombre actual → [otros nombres]
    (CD.equiposHistoricos || [])
      .filter((c) => c && c.nombre)
      .forEach((c) => {
        reglas.push({ clave: claveEquipo(c.nombre), club: c.nombre });
        const otros = [];
        (c.otrosNombres || []).forEach((o) => {
          const a =
            typeof o === 'string'
              ? { nombre: o }
              : { nombre: o.nombre, desde: o.desde, hasta: o.hasta };
          if (!a.nombre) return;
          otros.push(a.nombre);
          reglas.push({
            clave: claveEquipo(a.nombre),
            club: c.nombre,
            desde: a.desde || null,
            hasta: a.hasta || null,
          });
        });
        otrosNombres.set(c.nombre, otros);
      });
    const clubDe = (nombre, tid) => {
      const clave = claveEquipo(nombre);
      const candidatas = reglas.filter(
        (r) =>
          r.clave === clave &&
          (!r.desde || !tid || tid >= r.desde) &&
          (!r.hasta || !tid || tid <= r.hasta),
      );
      if (!candidatas.length) return nombre;
      candidatas.sort(
        (a, b) =>
          Number(Boolean(b.desde || b.hasta)) -
          Number(Boolean(a.desde || a.hasta)),
      );
      return candidatas[0].club;
    };
    return { clubDe, otrosNombres };
  }

  function construirModelo() {
    const CD = window.CLUB_DATA;
    const indice = window.SCIndice.construir();
    const partidos = indice
      .filter((i) => i.tipo === 'partido')
      .sort((a, b) => (a.fecha < b.fecha ? -1 : 1));

    const temporadaActual = CD.temporadaActualId || CD.temporadaActual;
    const idsTemporada = Object.keys(CD.temporadas || {}).sort();

    // Partidos de cada jugador/entrenador por código (no por nombre:
    // hay apodos repetidos entre jugadores distintos).
    const partidosPorCodigo = {};
    const temporadasPorCodigo = {};
    Object.entries(CD.temporadas || {}).forEach(([tid, temp]) => {
      [
        ...(temp.jugadores || []).map((j) => ['j', j]),
        ...(temp.cuerpoTecnico || []).map((c) => ['e', c]),
      ].forEach(([tipo, miembro]) => {
        const cod = `${tipo}:${miembro.codigo}`;
        (temporadasPorCodigo[cod] = temporadasPorCodigo[cod] || new Set()).add(
          tid,
        );
        (miembro.partidos || []).forEach((p) => {
          if (!p.local || !p.visitante || !p.fecha) return;
          (partidosPorCodigo[cod] = partidosPorCodigo[cod] || []).push({
            ...p,
            temporada: tid,
          });
        });
      });
    });

    const personas = [];
    const anadirPersonas = (maestro, tipo) => {
      Object.entries(maestro || {}).forEach(([codigo, d]) => {
        const nombre = d.apodo || d.nombreCompleto || d.nombre || codigo;
        const temporadas = Array.from(
          temporadasPorCodigo[`${tipo}:${codigo}`] || [],
        ).sort();
        const ultima = temporadas[temporadas.length - 1];
        personas.push({
          clase: tipo === 'j' ? 'jugador' : 'entrenador',
          codigo,
          nombre,
          d,
          temporadas,
          partidos: partidosPorCodigo[`${tipo}:${codigo}`] || [],
          url:
            tipo === 'j'
              ? url(`fichas/${codigo}.html`)
              : url(
                  `ficha-jugador.html?tipo=entrenador&id=${codigo}&season=${ultima || temporadaActual}`,
                ),
        });
      });
    };
    anadirPersonas(CD.jugadoresMaestro, 'j');
    anadirPersonas(CD.entrenadorMaestro, 'e');

    // Rivales agrupados por club: los datos tienen alguna variante del
    // mismo nombre ("Gimnàstic Tarragona"/"Gimnàstic de Tarragona") y
    // clubes que cambiaron de nombre (js/data-equipos.js: "Real Gijón"
    // es el Sporting; el "Real Avilés C.F." de 2012-2020 es el Real
    // Avilés Industrial, no el Avilés original). Cada partido se asigna
    // a su club según el nombre Y la temporada.
    const { clubDe, otrosNombres } = crearBuscadorDeClub(CD);
    const claveRival = (nombre, tid) => claveClub(clubDe(nombre, tid));
    const clubes = new Map();
    partidos.forEach((p) => {
      const actual = clubDe(p.rival, p.temporada);
      const k = claveClub(actual);
      if (!clubes.has(k))
        clubes.set(k, { clave: k, nombres: new Set(), cuenta: {} });
      const c = clubes.get(k);
      c.nombres.add(p.rival);
      if (actual !== p.rival) c.nombreActual = actual;
      c.cuenta[p.rival] = (c.cuenta[p.rival] || 0) + 1;
    });
    clubes.forEach((c) => {
      // Nombre a mostrar: el actual si el club cambió de nombre (es el
      // de su página de historial); si no, el que más partidos tiene.
      c.nombre =
        c.nombreActual ||
        Object.keys(c.cuenta).sort((a, b) => c.cuenta[b] - c.cuenta[a])[0];
      // El nombre actual y los antiguos también sirven para preguntar.
      if (c.nombreActual) {
        c.nombres.add(c.nombreActual);
        (otrosNombres.get(c.nombreActual) || []).forEach((n) =>
          c.nombres.add(n),
        );
      }
      delete c.cuenta;
    });

    // Alias → entidades. Se busca la frase más larga que aparezca entera
    // en la pregunta.
    // peso: 2 = nombre completo o apodo exacto; 1 = una sola palabra
    // suelta. Ante la misma coincidencia gana el peso mayor ("Aarón"
    // es Aarón Escandell, no Aarón Ñíguez).
    const alias = [];
    const anadirAlias = (texto, entidad, peso = 2) => {
      const a = norm(texto);
      if (!a || a.length < 3) return;
      if (!a.includes(' ') && NO_SON_NOMBRES.has(a)) return;
      if (a === 'real oviedo' || a === 'oviedo') return;
      alias.push({ alias: a, entidad, peso });
    };

    personas.forEach((per) => {
      const d = per.d;
      const e = { tipo: per.clase, ref: per };
      [
        per.nombre,
        d.nombreCompleto,
        d.nombre && d.apellidos ? `${d.nombre} ${d.apellidos}` : '',
        d.apellidos,
      ].forEach((t) => anadirAlias(t, e));
      const palabras = new Set([
        ...norm(per.nombre).split(' '),
        ...norm(d.apellidos).split(' '),
      ]);
      palabras.forEach((w) => {
        if (w.length >= 4 && !APELLIDOS_COMUNES.has(w)) anadirAlias(w, e, 1);
      });
    });

    clubes.forEach((club) => {
      const e = { tipo: 'rival', ref: club };
      club.nombres.forEach((n) => {
        const limpio = norm(n)
          .split(' ')
          .filter((w) => !PREFIJOS_CLUB.has(w));
        anadirAlias(n, e);
        anadirAlias(limpio.join(' '), e);
        anadirAlias(limpio.filter((w) => !PALABRAS_VACIAS.has(w)).join(' '), e);
        const esFilial =
          /\b(b|c|castilla)$/.test(limpio.join(' ')) ||
          /sevilla atletico|bilbao athletic/.test(limpio.join(' '));
        if (!esFilial) {
          limpio.forEach((w) => {
            if (w.length >= 4) anadirAlias(w, e, 1);
          });
        }
      });
    });
    // Apodos de club habituales: mandan sobre las palabras sueltas
    // ("deportivo" → Dépor, no Alavés ni Caudal).
    Object.entries(ALIAS_EXTRA_RIVALES).forEach(([a, nombre]) => {
      const club = clubes.get(claveClub(nombre));
      if (club)
        alias.push({
          alias: a,
          entidad: { tipo: 'rival', ref: club },
          peso: 3,
        });
    });

    return {
      partidos,
      personas,
      clubes,
      claveRival,
      alias,
      temporadaActual,
      idsTemporada,
    };
  }

  // ── ENTENDER LA PREGUNTA ─────────────────────────────────────

  const INTENCIONES = {
    goleador:
      /maximo goleador|maximos goleadores|pichichi|mas goles|quien (ha )?marcado mas|quienes (han )?marcado mas|goleadores/,
    masPartidos:
      /mas partidos|mas veces ha jugado|mas apariciones|quien (ha )?jugado mas/,
    goleada:
      /goleada|mayor victoria|peor derrota|mayor derrota|resultado mas abultado/,
    ultimo: /ultimo partido|ultima vez|ultimo enfrentamiento/,
    primero: /primer partido|primera vez|primer enfrentamiento|debut/,
    quienMarco: /quien marco|quienes marcaron|quien hizo (el|los) gol/,
    entrenador: /entrenador|entreno|entrenaba|dirigi|banquillo|mister/,
    encajados: /encaj|porteria a cero|porterias a cero/,
    goles: /\bgol(es)?\b|marc|anot/,
    asistencias: /asistenc|pase de gol|pases de gol/,
    tarjetas: /amarill|\broja|tarjeta|expuls/,
    minutos: /minuto/,
    partidos: /partidos|jugad|\bjugo\b|disputad|apariciones|\bveces\b/,
    nacionalidad: /nacionalidad|de donde es|de que pais|natural de|\bpais\b/,
    nacimiento:
      /\bedad\b|anos tiene|fecha de nacimiento|\bnacio\b|\bnacido\b|cumple/,
    altura: /altura|cuanto mide|\bmide\b/,
    posicion: /posicion|demarcacion|juega de|de que juega/,
    apodo: /apodo|\bmote\b|como le llaman|como le dicen/,
    nombreCompleto: /nombre completo|como se llama|apellido/,
    temporadas:
      /temporadas|cuando jugo|que anos|cuantos anos|etapa|cuando estuvo/,
    balance:
      /balance|historial|enfrentamiento|victorias|derrotas|empates|ganado|perdido|empatado|resultado/,
  };

  function detectarIntenciones(q) {
    const res = {};
    Object.entries(INTENCIONES).forEach(([k, re]) => {
      if (re.test(q)) res[k] = true;
    });
    return res;
  }

  function detectarTemporada(q, preguntaOriginal) {
    const m = preguntaOriginal.match(/(\d{2,4})\s*[/-]\s*(\d{2,4})/);
    if (m) {
      let a = parseInt(m[1], 10);
      if (a < 100) a += a > 50 ? 1900 : 2000;
      const id = `${a}-${String(a + 1).slice(-2)}`;
      return M.idsTemporada.includes(id)
        ? id
        : { noExiste: nombreTemporada(id) };
    }
    if (
      /esta temporada|temporada actual|este ano|esta campana|este curso/.test(q)
    )
      return M.temporadaActual;
    if (/temporada pasada|ano pasado|campana pasada|curso pasado/.test(q)) {
      const i = M.idsTemporada.indexOf(M.temporadaActual);
      return i > 0 ? M.idsTemporada[i - 1] : null;
    }
    return null;
  }

  function detectarCompeticion(q) {
    if (/copa/.test(q))
      return { texto: 'en Copa', test: (c) => /copa/i.test(c) };
    if (/ascenso|play ?off/.test(q))
      return { texto: 'en fase de ascenso', test: (c) => /ascenso/i.test(c) };
    if (/segunda b|2a b|segunda division b/.test(q))
      return {
        texto: 'en Segunda B',
        test: (c) => c === 'Segunda División B',
      };
    if (/primera division|en primera/.test(q))
      return { texto: 'en Primera', test: (c) => c === 'Primera División' };
    if (/segunda division|en segunda/.test(q))
      return { texto: 'en Segunda', test: (c) => c === 'Segunda División' };
    if (/\bliga\b/.test(q))
      return {
        texto: 'en liga',
        test: (c) => !/copa|ascenso|descenso/i.test(c),
      };
    return null;
  }

  function detectarLocalidad(q) {
    if (/en casa|en el tartiere|como local|de local/.test(q))
      return { texto: 'en casa', esLocal: true };
    if (
      /fuera de casa|como visitante|de visitante|a domicilio|\bfuera\b/.test(q)
    )
      return { texto: 'fuera de casa', esLocal: false };
    return null;
  }

  // Busca nombres de jugadores, entrenadores y rivales en la pregunta.
  function detectarEntidades(q) {
    const texto = ` ${q} `;
    const hallados = [];
    M.alias.forEach(({ alias, entidad, peso }) => {
      let desde = 0;
      for (;;) {
        const pos = texto.indexOf(` ${alias} `, desde);
        if (pos < 0) break;
        hallados.push({
          alias,
          entidad,
          peso,
          ini: pos,
          fin: pos + alias.length,
        });
        desde = pos + 1;
      }
    });
    // Primero las coincidencias más largas (y, a igual longitud, las de
    // más peso); las que caigan dentro de otra ya elegida se descartan
    // ("borja baston" > "borja").
    hallados.sort((a, b) => b.alias.length - a.alias.length || b.peso - a.peso);
    const grupos = [];
    hallados.forEach((h) => {
      const solapa = grupos.find((g) => h.ini < g.fin && h.fin > g.ini);
      if (!solapa) {
        grupos.push({
          ini: h.ini,
          fin: h.fin,
          alias: h.alias,
          peso: h.peso,
          ents: [h.entidad],
        });
      } else if (
        solapa.ini === h.ini &&
        solapa.fin === h.fin &&
        h.peso === solapa.peso &&
        !solapa.ents.some((e) => e.ref === h.entidad.ref)
      ) {
        solapa.ents.push(h.entidad);
      }
    });

    const resultado = {
      personas: [],
      rivales: [],
      dudas: [],
      // Textos tal cual aparecen en la pregunta (para la memoria de la
      // conversación: "¿y Toché?" → sustituir a la persona anterior).
      aliasPersona: null,
      aliasRival: null,
    };
    grupos.forEach((g) => {
      const antes = texto.slice(0, g.ini);
      const pideRival =
        /(contra|ante|frente a|al|vs|versus|con el|con la|del|el)\s*$/.test(
          antes,
        );
      let ents = g.ents;
      const rivales = ents.filter((e) => e.tipo === 'rival');
      const pers = ents.filter((e) => e.tipo !== 'rival');
      if (rivales.length && pers.length) ents = pideRival ? rivales : pers;
      if (ents.length > 1) {
        resultado.dudas.push({ alias: g.alias, ents });
        if (ents.every((e) => e.tipo === 'rival'))
          resultado.aliasRival = resultado.aliasRival || g.alias;
        else resultado.aliasPersona = resultado.aliasPersona || g.alias;
      } else if (ents[0].tipo === 'rival') {
        resultado.rivales.push(ents[0].ref);
        resultado.aliasRival = resultado.aliasRival || g.alias;
      } else {
        resultado.personas.push(ents[0]);
        resultado.aliasPersona = resultado.aliasPersona || g.alias;
      }
    });
    return resultado;
  }

  // ── CÁLCULOS ─────────────────────────────────────────────────

  function resultadoDe(p, esLocalOviedo) {
    let r = p.resultado;
    if (
      typeof p.penaltisLocal === 'number' &&
      typeof p.penaltisVisitante === 'number'
    ) {
      const pf = esLocalOviedo ? p.penaltisLocal : p.penaltisVisitante;
      const pc = esLocalOviedo ? p.penaltisVisitante : p.penaltisLocal;
      if (r === 'E' && pf !== pc) r = pf > pc ? 'V' : 'D';
    }
    return r;
  }

  // Filtros comunes a partidos del índice (p.rival/p.esLocal) y a
  // partidos de un jugador (p.local/p.visitante).
  function pasaFiltros(p, f) {
    const esLocal = p.esLocal !== undefined ? p.esLocal : p.local === OVIEDO;
    const rival = p.rival || (esLocal ? p.visitante : p.local);
    // Por club (nombre + temporada), no por nombre suelto: el mismo
    // "Real Avilés C.F." son dos clubes distintos según la época.
    if (f.rival && M.claveRival(rival, p.temporada) !== f.rival.clave)
      return false;
    if (f.temporada && p.temporada !== f.temporada) return false;
    if (f.comp && !f.comp.test(p.competicion || '')) return false;
    if (f.localidad && esLocal !== f.localidad.esLocal) return false;
    return true;
  }

  function balance(lista) {
    const b = { pj: lista.length, v: 0, e: 0, d: 0, gf: 0, gc: 0 };
    lista.forEach((p) => {
      if (p.resultado === 'V') b.v++;
      else if (p.resultado === 'E') b.e++;
      else if (p.resultado === 'D') b.d++;
      b.gf += p.golesFavor || 0;
      b.gc += p.golesContra || 0;
    });
    return b;
  }

  function textoBalance(b) {
    return (
      `${plural(b.v, 'victoria', 'victorias')}, ${plural(b.e, 'empate', 'empates')} y ` +
      `${plural(b.d, 'derrota', 'derrotas')} (${b.gf} goles a favor y ${b.gc} en contra)`
    );
  }

  function statsPersona(per, f) {
    const lista = per.partidos.filter((p) => pasaFiltros(p, f));
    const s = {
      lista,
      pj: lista.length,
      goles: 0,
      asist: 0,
      amar: 0,
      rojas: 0,
      min: 0,
      cero: 0,
      v: 0,
      e: 0,
      d: 0,
      temporadas: new Set(),
    };
    lista.forEach((p) => {
      s.goles += p.goles || 0;
      s.asist += p.asistencias || 0;
      if (p.amarilla) s.amar++;
      if (p.roja) s.rojas++;
      s.min += p.minutos || 0;
      if (!p.goles) s.cero++;
      const r = resultadoDe(p, p.local === OVIEDO);
      if (r === 'V') s.v++;
      else if (r === 'E') s.e++;
      else if (r === 'D') s.d++;
      s.temporadas.add(p.temporada);
    });
    return s;
  }

  function filaPartido(p) {
    const local = p.esLocal ? OVIEDO : p.rival;
    const visitante = p.esLocal ? p.rival : OVIEDO;
    const marcador =
      typeof p.golesFavor === 'number'
        ? p.esLocal
          ? `${p.golesFavor}-${p.golesContra}`
          : `${p.golesContra}-${p.golesFavor}`
        : '';
    const titulo = `${local} ${marcador} ${visitante}`;
    const href = url(
      `partidos/${slug(local)}-${slug(visitante)}-${p.fecha}.html`,
    );
    const extra = p.penaltisMarcador ? ` (${p.penaltisMarcador})` : '';
    const nombresGoles = [
      ...(p.goleadores || []),
      ...(p.golesEnPropia || []).map(
        (og) =>
          `${og.jugador}${og.goles > 1 ? ` (${og.goles})` : ''} (en propia puerta)`,
      ),
    ];
    const goleadores = nombresGoles.length
      ? ` — goles: ${esc(nombresGoles.join(', '))}`
      : '';
    return `<li>${enlaceVerificado(titulo, href)}${esc(extra)} <small>${esc(fechaLarga(p.fecha))} · ${esc(p.competicion)}</small>${goleadores}</li>`;
  }

  // Enlace a la página de historial contra un rival (partidos/rival-...).
  function enlaceHistorialRival(rival) {
    return enlaceVerificado(
      rival.nombre,
      url(`partidos/rival-${slug(rival.nombre)}.html`),
    );
  }

  // Partidos de un jugador/entrenador contra un rival, con enlace a la
  // página de cada partido (se usa el partido del índice, que trae el
  // marcador y los goleadores) y al historial completo contra ese club.
  // Partidos (del índice, con marcador y goleadores) de un jugador o
  // entrenador que cumplen los filtros de la pregunta.
  function partidosDePersona(per, f) {
    return per.partidos
      .filter((p) => pasaFiltros(p, f))
      .map((pp) =>
        M.partidos.find(
          (ip) => ip.fecha === pp.fecha && ip.temporada === pp.temporada,
        ),
      )
      .filter(Boolean)
      .sort((a, b) => (a.fecha < b.fecha ? -1 : 1));
  }

  // Lista enlazada de esos partidos: todos si son pocos; si son muchos,
  // los últimos y el enlace a la ficha (que los tiene todos).
  const MAX_LISTA_PARTIDOS = 12;
  function bloquePartidosPersona(per, f) {
    const filas = partidosDePersona(per, f);
    if (!filas.length) return '';
    if (filas.length <= MAX_LISTA_PARTIDOS)
      return `<ul>${filas.map(filaPartido).join('')}</ul>`;
    const ultimos = filas.slice(-5);
    return (
      `<br>Los últimos ${ultimos.length}:<ul>${ultimos.map(filaPartido).join('')}</ul>` +
      `Todos sus partidos, en su ficha: ${enlace(per.nombre, per.url)}.`
    );
  }

  function bloquePartidosContraRival(per, f) {
    if (!f.rival) return '';
    const filas = partidosDePersona(per, f);
    let t = '';
    if (filas.length && filas.length <= MAX_LISTA_PARTIDOS)
      t += `<ul>${filas.map(filaPartido).join('')}</ul>`;
    t += `Historial completo del Oviedo contra el ${enlaceHistorialRival(f.rival)}.`;
    return t;
  }

  // "¿Cuántos jugadores se llaman Carlos?" / "...con el nombre Carlos"
  const RE_CUANTOS_NOMBRE =
    /^(?:y )?cuant[oa]s (jugadores|futbolistas|entrenadores|tecnicos|personas)?\b.*?\b(?:llamad[oa]s?|se llaman|se llamen|se llamaba[n]?|con (?:el )?nombre(?: de)?|de nombre|que se llame)\s+(.+)$/;

  function respuestaCuantosConNombre(q, pregunta) {
    const m = q.match(RE_CUANTOS_NOMBRE);
    if (!m) return null;
    // Para mostrarlo, el nombre tal como lo escribió (con tildes y
    // mayúsculas): las mismas últimas palabras de la pregunta original.
    const nPalabras = m[2].split(' ').length;
    const comoLoEscribio = String(pregunta || '')
      .replace(/[¿?¡!.,;:"]/g, ' ')
      .trim()
      .split(/\s+/)
      .slice(-nPalabras)
      .join(' ');
    const quiereEntrenadores = /entrenador|tecnico/.test(m[1] || '');
    const buscado = m[2]
      .replace(/\b(en|el|del|real|oviedo|hay|han|ha|jugado|pasado)\b/g, ' ')
      .trim();
    const palabras = buscado.split(/\s+/).filter(Boolean);
    if (!palabras.length) return null;
    const contieneTodas = (texto) => {
      const t = ` ${norm(texto)} `;
      return palabras.every((w) => t.includes(` ${w} `));
    };
    const lista = M.personas
      .filter(
        (per) =>
          per.clase === (quiereEntrenadores ? 'entrenador' : 'jugador') &&
          per.temporadas.length &&
          // Con una sola palabra se mira el nombre de pila (Carlos ≠
          // Juan Carlos? sí cuenta: se llama Juan Carlos); con más, el
          // nombre completo.
          (palabras.length === 1
            ? contieneTodas(per.d.nombre || per.nombre)
            : contieneTodas(
                `${per.d.nombreCompleto || ''} ${per.nombre} ${per.d.nombre || ''} ${per.d.apellidos || ''}`,
              )),
      )
      .sort(
        (a, b) =>
          (a.temporadas[0] || '').localeCompare(b.temporadas[0] || '') ||
          a.nombre.localeCompare(b.nombre, 'es'),
      );
    const clase = quiereEntrenadores ? 'entrenador' : 'jugador';
    const clases = quiereEntrenadores ? 'entrenadores' : 'jugadores';
    if (!lista.length)
      return `No tengo ningún ${clase} del Oviedo llamado "${esc(comoLoEscribio)}" (datos de 2009/10 a hoy).`;
    const fila = (per) => {
      const completo = per.d.nombreCompleto || per.nombre;
      return `<li>${enlace(per.nombre, per.url)}${completo !== per.nombre ? ` <small>${esc(completo)}</small>` : ''} <small>· ${esc(rangoTemporadas(per.temporadas))}</small></li>`;
    };
    return (
      `${lista.length === 1 ? 'Solo hay' : 'Hay'} <b>${plural(lista.length, clase, clases)}</b> del Oviedo llamado${lista.length === 1 ? '' : 's'} "${esc(comoLoEscribio)}" (de 2009/10 a hoy):` +
      `<ul>${lista.map(fila).join('')}</ul>`
    );
  }

  function contexto(f) {
    const partes = [];
    if (f.rival) partes.push(`contra el ${f.rival.nombre}`);
    if (f.comp) partes.push(f.comp.texto);
    if (f.localidad) partes.push(f.localidad.texto);
    if (f.temporada) partes.push(`en la ${nombreTemporada(f.temporada)}`);
    return partes.length ? ' ' + partes.join(' ') : '';
  }

  function edad(fechaIso, hasta) {
    if (!fechaIso) return null;
    const n = new Date(fechaIso);
    const h = hasta ? new Date(hasta) : new Date();
    let e = h.getFullYear() - n.getFullYear();
    const m = h.getMonth() - n.getMonth();
    if (m < 0 || (m === 0 && h.getDate() < n.getDate())) e--;
    return e;
  }

  function rangoTemporadas(ids) {
    if (!ids.length) return '';
    const ini = nombreTemporada(ids[0]);
    const fin = nombreTemporada(ids[ids.length - 1]);
    return ids.length === 1
      ? `la temporada ${ini}`
      : `${ids.length} temporadas (de ${ini} a ${fin})`;
  }

  // ── RESPUESTAS ───────────────────────────────────────────────

  function respuestaPersonal(per, it) {
    const d = per.d;
    const nom = enlace(per.nombre, per.url);
    const partes = [];
    if (it.nombreCompleto || it.apodo) {
      partes.push(
        `${nom} se llama <b>${esc(d.nombreCompleto || per.nombre)}</b>` +
          (d.apodo && d.apodo !== d.nombreCompleto
            ? `, y se le conoce como <b>${esc(d.apodo)}</b>`
            : '') +
          '.',
      );
    }
    const lugar =
      d.lugarNacimiento &&
      d.provinciaNacimiento &&
      d.lugarNacimiento !== d.provinciaNacimiento
        ? `${d.lugarNacimiento} (${d.provinciaNacimiento})`
        : d.lugarNacimiento || d.provinciaNacimiento || '';
    if (it.nacionalidad && !it.nacimiento) {
      const nac = (d.nacionalidad || []).join(' y ').toLowerCase();
      partes.push(
        `${nom}${lugar ? ` es de <b>${esc(lugar)}</b> y` : ''} tiene nacionalidad <b>${esc(nac || 'desconocida')}</b>.`,
      );
    }
    if (it.nacimiento) {
      let t = `${nom} nació`;
      if (d.fechaNacimiento)
        t += ` el <b>${esc(fechaLarga(d.fechaNacimiento))}</b>`;
      if (lugar) t += ` en <b>${esc(lugar)}</b>`;
      if (d.fallecido || d.fechaFallecimiento) {
        t += `. Falleció${d.fechaFallecimiento ? ' el ' + esc(fechaLarga(d.fechaFallecimiento)) : ''}`;
      } else if (d.fechaNacimiento) {
        t += `; tiene <b>${edad(d.fechaNacimiento)} años</b>`;
      }
      partes.push(t + '.');
    }
    if (it.altura && d.altura) {
      partes.push(
        `${nom} mide <b>${Number(d.altura).toFixed(2).replace('.', ',')} m</b>.`,
      );
    }
    if (it.posicion) {
      partes.push(
        per.clase === 'entrenador'
          ? `${nom} es <b>${esc(d.cargo || 'entrenador')}</b>.`
          : `${nom} juega de <b>${esc((d.posicion || 'posición desconocida').toLowerCase())}</b>.`,
      );
    }
    return partes.join('<br>');
  }

  function respuestaJugador(per, it, f) {
    const s = statsPersona(per, f);
    const nom = enlace(per.nombre, per.url);
    const ctx = contexto(f);
    const esPortero = per.d.posicion === 'Portero';

    if (!s.pj) {
      return `No tengo registrado ningún partido de ${nom}${esc(ctx)}.`;
    }
    const lineas = [];
    if (it.encajados || (esPortero && it.goles)) {
      lineas.push(
        `${nom} ha encajado <b>${plural(s.goles, 'gol', 'goles')}</b> en ${plural(s.pj, 'partido', 'partidos')}${esc(ctx)}` +
          `, con <b>${plural(s.cero, 'portería a cero', 'porterías a cero')}</b>.`,
      );
    } else if (it.goles) {
      lineas.push(
        `${nom} ha marcado <b>${plural(s.goles, 'gol', 'goles')}</b> en ${plural(s.pj, 'partido', 'partidos')}${esc(ctx)}.`,
      );
    }
    // La primera frase lleva el nombre; las siguientes, no.
    const sujeto = () => (lineas.length ? '' : `${nom} `);
    const verbo = (v) => (lineas.length ? v : v.toLowerCase());
    if (it.asistencias)
      lineas.push(
        `${sujeto()}${verbo('Ha')} dado <b>${plural(s.asist, 'asistencia', 'asistencias')}</b>${esc(ctx)}.`,
      );
    if (it.tarjetas)
      lineas.push(
        `${sujeto()}${verbo('Ha')} visto <b>${plural(s.amar, 'amarilla', 'amarillas')}</b> y <b>${plural(s.rojas, 'roja', 'rojas')}</b>${esc(ctx)}.`,
      );
    if (it.minutos)
      lineas.push(
        `${sujeto()}${verbo('Ha')} jugado <b>${s.min.toLocaleString('es-ES')} minutos</b>${esc(ctx)}.`,
      );
    if (it.partidos && !lineas.length)
      lineas.push(
        `${nom} ha jugado <b>${plural(s.pj, 'partido', 'partidos')}</b>${esc(ctx)}: ` +
          `${plural(s.v, 'victoria', 'victorias')}, ${plural(s.e, 'empate', 'empates')} y ${plural(s.d, 'derrota', 'derrotas')}.` +
          // Contra un rival ya se listan más abajo (con su historial).
          (f.rival ? '' : bloquePartidosPersona(per, f)),
      );
    if (it.temporadas)
      lineas.push(`En el Oviedo: ${esc(rangoTemporadas(per.temporadas))}.`);

    if (!lineas.length) {
      // Sin pregunta concreta: ficha resumida.
      const d = per.d;
      lineas.push(
        `<b>${nom}</b> — ${esc((d.posicion || '').toLowerCase())}${d.nacionalidad && d.nacionalidad.length ? ', ' + esc(d.nacionalidad.join(' y ').toLowerCase()) : ''}` +
          `${d.fechaNacimiento ? ', nacido el ' + esc(fechaLarga(d.fechaNacimiento)) : ''}.`,
      );
      lineas.push(
        `${plural(s.pj, 'partido', 'partidos')}${esc(ctx)}, ` +
          (esPortero
            ? `${plural(s.goles, 'gol encajado', 'goles encajados')}`
            : `${plural(s.goles, 'gol', 'goles')} y ${plural(s.asist, 'asistencia', 'asistencias')}`) +
          `. ${esc(rangoTemporadas(per.temporadas).replace(/^./, (c) => c.toUpperCase()))}.`,
      );
    }
    if (f.rival) lineas.push(bloquePartidosContraRival(per, f));
    return lineas.join('<br>');
  }

  function respuestaEntrenador(per, it, f) {
    const lista = per.partidos.filter((p) => pasaFiltros(p, f));
    const nom = enlace(per.nombre, per.url);
    const ctx = contexto(f);
    if (!lista.length)
      return `No tengo partidos dirigidos por ${nom}${esc(ctx)}.`;
    let v = 0;
    let e = 0;
    let dd = 0;
    lista.forEach((p) => {
      const r = resultadoDe(p, p.local === OVIEDO);
      if (r === 'V') v++;
      else if (r === 'E') e++;
      else if (r === 'D') dd++;
    });
    let t =
      `${nom} ha dirigido al Oviedo en <b>${plural(lista.length, 'partido', 'partidos')}</b>${esc(ctx)}: ` +
      `${plural(v, 'victoria', 'victorias')}, ${plural(e, 'empate', 'empates')} y ${plural(dd, 'derrota', 'derrotas')}.`;
    if (!f.temporada)
      t += `<br>En el banquillo: ${esc(rangoTemporadas(per.temporadas))}.`;
    if (f.rival) t += `<br>${bloquePartidosContraRival(per, f)}`;
    else t += bloquePartidosPersona(per, f);
    return t;
  }

  function rankingPersonas(f, clave) {
    const filas = [];
    M.personas.forEach((per) => {
      if (per.clase !== 'jugador') return;
      if (clave === 'goles' && per.d.posicion === 'Portero') return;
      const s = statsPersona(per, f);
      const valor = clave === 'goles' ? s.goles : s.pj;
      if (valor > 0) {
        const ultima = Array.from(s.temporadas).sort().pop() || '';
        filas.push({ per, valor, ultima });
      }
    });
    filas.sort(
      (a, b) =>
        b.valor - a.valor ||
        b.ultima.localeCompare(a.ultima) ||
        a.per.nombre.localeCompare(b.per.nombre, 'es'),
    );
    return filas;
  }

  function respuestaRanking(f, clave) {
    const filas = rankingPersonas(f, clave);
    const ctx = contexto(f);
    if (!filas.length) return `No tengo datos para ese ranking${esc(ctx)}.`;
    const [sing, plu] =
      clave === 'goles' ? ['gol', 'goles'] : ['partido', 'partidos'];
    const titulo =
      clave === 'goles' ? 'Máximos goleadores' : 'Más partidos jugados';
    const top = filas.slice(0, 10);
    return (
      `<b>${titulo}${esc(ctx)}:</b><ol>` +
      top
        .map(
          (x) =>
            `<li>${enlace(x.per.nombre, x.per.url)} — ${plural(x.valor, sing, plu)}</li>`,
        )
        .join('') +
      '</ol>' +
      (filas.length > 10
        ? `<small>El ranking completo está en el ${enlace('buscador', url('buscador.html'))}.</small>`
        : '')
    );
  }

  function respuestaEntrenadorTemporada(f) {
    const cuenta = new Map();
    M.personas.forEach((per) => {
      if (per.clase !== 'entrenador') return;
      const n = per.partidos.filter((p) => pasaFiltros(p, f)).length;
      if (n) cuenta.set(per, n);
    });
    const ctx = contexto(f);
    if (!cuenta.size) return `No tengo registrado el entrenador${esc(ctx)}.`;
    const lista = Array.from(cuenta.entries()).sort((a, b) => b[1] - a[1]);
    if (lista.length === 1)
      return `El entrenador${esc(ctx)} fue <b>${enlace(lista[0][0].nombre, lista[0][0].url)}</b> (${plural(lista[0][1], 'partido', 'partidos')}).`;
    return (
      `Entrenadores${esc(ctx)}:<ul>` +
      lista
        .map(
          ([per, n]) =>
            `<li>${enlace(per.nombre, per.url)} — ${plural(n, 'partido', 'partidos')}</li>`,
        )
        .join('') +
      '</ul>'
    );
  }

  function respuestaPartidos(f, it) {
    const lista = M.partidos.filter((p) => pasaFiltros(p, f));
    const ctx = contexto(f);
    if (!lista.length) return `No tengo ningún partido del Oviedo${esc(ctx)}.`;

    if (it.ultimo || it.primero) {
      const p = it.ultimo ? lista[lista.length - 1] : lista[0];
      return `${it.ultimo ? 'El último' : 'El primer'} partido${esc(ctx)} que tengo registrado:<ul>${filaPartido(p)}</ul>`;
    }
    if (it.goleada) {
      const conDif = lista.filter((p) => typeof p.golesFavor === 'number');
      const mejor = conDif
        .slice()
        .sort(
          (a, b) =>
            b.golesFavor - b.golesContra - (a.golesFavor - a.golesContra) ||
            b.golesFavor - a.golesFavor,
        )[0];
      const peor = conDif
        .slice()
        .sort(
          (a, b) =>
            a.golesFavor - a.golesContra - (b.golesFavor - b.golesContra) ||
            b.golesContra - a.golesContra,
        )[0];
      let t = '';
      if (mejor && mejor.golesFavor > mejor.golesContra)
        t += `<b>Mayor victoria${esc(ctx)}:</b><ul>${filaPartido(mejor)}</ul>`;
      if (peor && peor.golesContra > peor.golesFavor)
        t += `<b>Peor derrota${esc(ctx)}:</b><ul>${filaPartido(peor)}</ul>`;
      return t || `No hay ni victorias ni derrotas${esc(ctx)}: todo empates.`;
    }
    if (it.quienMarco || lista.length <= 3) {
      return `Partidos${esc(ctx)}:<ul>${lista.slice(-10).map(filaPartido).join('')}</ul>`;
    }
    const b = balance(lista);
    let t = `El Oviedo ha jugado <b>${plural(b.pj, 'partido', 'partidos')}</b>${esc(ctx)}: ${textoBalance(b)}.`;
    if (f.rival) {
      t += `<br>Último: <ul>${filaPartido(lista[lista.length - 1])}</ul>Historial completo: ${enlaceHistorialRival(f.rival)}.`;
    } else if (f.temporada) {
      const g = rankingPersonas(f, 'goles')[0];
      if (g)
        t += `<br>Máximo goleador: ${enlace(g.per.nombre, g.per.url)} (${plural(g.valor, 'gol', 'goles')}).`;
    }
    return t;
  }

  const EJEMPLOS = [
    '¿Cuántos goles ha marcado Linares?',
    '¿Cuántas veces hemos jugado contra el Sporting?',
    '¿Quién es el máximo goleador contra el Lugo?',
    '¿De dónde es Borja Bastón?',
    '¿Quién era el entrenador en la 2017/18?',
    '¿Cuál fue nuestra mayor goleada?',
    '¿Cuántos goles ha encajado Aarón en casa?',
    '¿Último partido contra el Racing de Santander?',
  ];

  function ayuda() {
    ultimaFueAyuda = true;
    return (
      'No he entendido la pregunta. Puedo responder cosas como:<ul>' +
      EJEMPLOS.slice(0, 5)
        .map((e) => `<li>${esc(e)}</li>`)
        .join('') +
      '</ul><small>Pregunta por jugadores, entrenadores, rivales o temporadas (por ejemplo "2015/16").</small>'
    );
  }

  // ── MEMORIA DE LA CONVERSACIÓN ───────────────────────────────
  // El chat no es una IA: entiende cada pregunta por separado con
  // reglas. Para encadenar ("¿cuántos goles ha marcado Linares?" →
  // "¿y Toché?" → "¿y contra el Sporting?" → "¿y en 2015/16?") se
  // guardan las piezas de la última pregunta entendida y, si la nueva
  // es un seguimiento, se rellena lo que le falta con ellas.
  let ultimaPregunta = null;
  let ultimaFueAyuda = false;

  const RE_TEMPORADA_TXT = /(\d{2,4})\s*[/-]\s*(\d{2,4})/;
  const RE_TEMPORADA_FRASE =
    /esta temporada|temporada actual|este ano|esta campana|este curso|temporada pasada|ano pasado|campana pasada|curso pasado/;
  const RE_COMP_FRASE =
    /en (?:la )?copa(?: del rey)?|en (?:la )?fase de ascenso|en (?:los )?play ?offs?|en segunda b|en segunda division b/;
  const RE_LOCALIDAD_FRASE =
    /en casa|en el tartiere|como local|de local|fuera de casa|como visitante|de visitante|a domicilio|\bfuera\b/;
  const RE_INICIO_SEGUIMIENTO =
    /^(?:y|e|pero|entonces|tambien|y tambien|y que tal|que tal)\b\s*/;

  // Piezas de una pregunta: qué se pregunta (texto sin nombres) y con
  // qué filtros (persona, rival, temporada, competición, casa/fuera).
  function piezasDe(pregunta) {
    const q = norm(pregunta);
    const nombre = q.match(RE_CUANTOS_NOMBRE);
    const ents = detectarEntidades(q);
    const tempTxt =
      (pregunta.match(RE_TEMPORADA_TXT) || [])[0] ||
      (q.match(RE_TEMPORADA_FRASE) || [])[0] ||
      null;
    const compTxt = (q.match(RE_COMP_FRASE) || [])[0] || null;
    const locTxt = (q.match(RE_LOCALIDAD_FRASE) || [])[0] || null;
    let resto = ` ${q} `;
    [ents.aliasPersona, ents.aliasRival, compTxt, locTxt]
      .filter(Boolean)
      .forEach((t) => {
        resto = resto.replace(` ${t} `, ' ');
      });
    resto = resto
      .replace(/\b(?:19|20)?\d{2} (?:19|20)?\d{2}\b/g, ' ')
      .replace(RE_TEMPORADA_FRASE, ' ')
      .replace(
        /\b(?:contra|ante|frente a|vs|versus)(?: el| la| los)?\s*$/g,
        ' ',
      )
      .replace(
        /\s+(?:de|del|al|a|en|el|la|contra el|contra la|contra)\s*$/g,
        ' ',
      )
      .replace(RE_INICIO_SEGUIMIENTO, '')
      .replace(/\s+/g, ' ')
      .trim();
    return {
      q,
      nombrePrefijo: nombre
        ? q.slice(0, q.length - nombre[2].length).trim()
        : null,
      persona: ents.aliasPersona,
      rival: ents.aliasRival,
      temporada: tempTxt,
      comp: compTxt,
      localidad: locTxt,
      pregunta: resto, // lo que se pregunta, sin nombres ni filtros
      intenciones: Object.keys(detectarIntenciones(q)).length > 0,
    };
  }

  function esSeguimiento(p) {
    if (!ultimaPregunta) return false;
    if (RE_INICIO_SEGUIMIENTO.test(p.q)) return true;
    // Pregunta corta sin nada que preguntar ("Toché", "en 2015/16",
    // "contra el Sporting"): se entiende como continuación.
    return !p.intenciones && !p.nombrePrefijo && p.q.split(' ').length <= 5;
  }

  // Devuelve la pregunta completa a responder (texto) y una descripción
  // legible de lo que se ha entendido, o null si no es un seguimiento.
  function combinarConAnterior(pregunta) {
    const actual = piezasDe(pregunta);
    if (!esSeguimiento(actual)) return null;
    const prev = ultimaPregunta;

    // "¿Cuántos jugadores se llaman Carlos?" → "¿Y José?"
    if (prev.nombrePrefijo && !actual.intenciones) {
      const nuevo = actual.q.replace(RE_INICIO_SEGUIMIENTO, '').trim();
      if (!nuevo) return null;
      const original = pregunta
        .replace(/[¿?¡!]/g, ' ')
        .trim()
        .replace(/^(?:y|e|pero|entonces|también|tambien)\s+/i, '');
      return { texto: `${prev.nombrePrefijo} ${original}`, entendido: null };
    }

    const qQuePregunta = actual.intenciones ? actual.pregunta : prev.pregunta;
    // Si no hay nada nuevo que preguntar ni ningún filtro, no hay con
    // qué continuar.
    if (
      !actual.intenciones &&
      !actual.persona &&
      !actual.rival &&
      !actual.temporada &&
      !actual.comp &&
      !actual.localidad
    )
      return null;
    const persona = actual.persona || prev.persona;
    const rival = actual.rival || prev.rival;
    const temporada = actual.temporada || prev.temporada;
    const comp = actual.comp || prev.comp;
    const localidad = actual.localidad || prev.localidad;
    const texto = [
      qQuePregunta,
      persona ? `de ${persona}` : '',
      rival ? `contra el ${rival}` : '',
      comp || '',
      localidad || '',
      temporada ? `en ${temporada}` : '',
    ]
      .filter(Boolean)
      .join(' ');
    return { texto, combinado: true };
  }

  function responder(pregunta) {
    let aResponder = pregunta;
    let combinado = false;
    const seguimiento = combinarConAnterior(pregunta);
    if (seguimiento) {
      aResponder = seguimiento.texto;
      combinado = !!seguimiento.combinado;
    }
    ultimaFueAyuda = false;
    let html = responderTexto(aResponder);
    // Si la combinación no ha servido, se prueba la pregunta tal cual.
    if (combinado && ultimaFueAyuda) {
      ultimaFueAyuda = false;
      html = responderTexto(pregunta);
      aResponder = pregunta;
    }
    // Se recuerda solo lo que se ha entendido.
    if (!ultimaFueAyuda) ultimaPregunta = piezasDe(aResponder);
    return html;
  }

  function responderTexto(pregunta) {
    const q = norm(pregunta);
    if (!q) return ayuda();
    const it = detectarIntenciones(q);

    // Recuento por nombre: va antes de detectar personas, porque si no
    // "Carlos" se toma como "¿a qué Carlos te refieres?".
    const porNombre = respuestaCuantosConNombre(q, pregunta);
    if (porNombre) return porNombre;

    const ents = detectarEntidades(q);

    if (ents.dudas.length) {
      const d = ents.dudas[0];
      const opciones = d.ents.slice(0, 8).map((e) => {
        if (e.tipo === 'rival')
          return { texto: e.ref.nombre, por: e.ref.nombre };
        const completo = e.ref.d.nombreCompleto || e.ref.nombre;
        const texto =
          (completo !== e.ref.nombre
            ? `${e.ref.nombre} (${completo})`
            : completo) + (e.tipo === 'entrenador' ? ' · entrenador' : '');
        return { texto, por: completo };
      });
      return (
        `"${esc(d.alias)}" puede ser varios. ¿Cuál de estos?<ul>` +
        opciones
          .map(
            (o) =>
              `<li><button type="button" class="sc-asis-sugerencia" data-sustituir="${esc(d.alias)}" data-por="${esc(o.por)}">${esc(o.texto)}</button></li>`,
          )
          .join('') +
        '</ul>' +
        (d.ents.length > 8
          ? '<small>Hay más; escribe también el apellido.</small>'
          : '')
      );
    }

    const temp = detectarTemporada(q, pregunta);
    if (temp && temp.noExiste)
      return `No tengo datos de la temporada ${esc(temp.noExiste)}.`;
    const f = {
      rival: ents.rivales[0] || null,
      temporada: temp,
      comp: detectarCompeticion(q),
      localidad: detectarLocalidad(q),
    };

    const persona = ents.personas[0];
    if (persona) {
      const per = persona.ref;
      const personal =
        it.nacionalidad ||
        it.nacimiento ||
        it.altura ||
        it.posicion ||
        it.apodo ||
        it.nombreCompleto;
      const numerica =
        it.goles ||
        it.encajados ||
        it.asistencias ||
        it.tarjetas ||
        it.minutos ||
        it.partidos ||
        it.temporadas;
      if (personal && !numerica) return respuestaPersonal(per, it);
      if (per.clase === 'entrenador') return respuestaEntrenador(per, it, f);
      const r = respuestaJugador(per, it, f);
      return personal ? respuestaPersonal(per, it) + '<br>' + r : r;
    }

    if (it.goleador && !it.goleada) return respuestaRanking(f, 'goles');
    if (it.masPartidos) return respuestaRanking(f, 'partidos');
    if (it.entrenador && (f.temporada || f.rival))
      return respuestaEntrenadorTemporada(f);
    if (
      f.rival ||
      f.temporada ||
      it.goleada ||
      it.ultimo ||
      it.primero ||
      /oviedo|hemos|nuestr/.test(q)
    ) {
      if (
        it.partidos ||
        it.balance ||
        it.goleada ||
        it.ultimo ||
        it.primero ||
        it.quienMarco ||
        it.goles ||
        f.rival ||
        f.temporada
      )
        return respuestaPartidos(f, it);
    }
    return ayuda();
  }

  // ── INTERFAZ ─────────────────────────────────────────────────

  let panel;
  let mensajes;
  let entrada;
  let estado = 'sin-cargar'; // 'cargando' | 'listo' | 'error'

  // ── CONVERSACIÓN GUARDADA ──────────────────────────────────
  // Toda la conversación (mensajes + memoria de la última pregunta) se
  // guarda en sessionStorage mientras el chat está abierto: si se pulsa
  // un enlace de una respuesta o se cambia de página, el chat se vuelve
  // a abrir solo, con todo lo hablado, y sigue entendiendo los "¿y…?".
  // Al cerrarlo (X, Escape o el botón flotante) se borra y la próxima
  // vez empieza una conversación nueva. sessionStorage dura lo que la
  // pestaña: al cerrar el navegador también se olvida.
  const CLAVE_CONVERSACION = 'scAsistenteConversacion';
  let conversacion = []; // [{ html, quien }]

  function guardarConversacion(abierto) {
    try {
      sessionStorage.setItem(
        CLAVE_CONVERSACION,
        JSON.stringify({ abierto, mensajes: conversacion, ultimaPregunta }),
      );
    } catch (e) {
      /* sin almacenamiento (modo privado, etc.): se sigue sin guardar */
    }
  }

  function leerConversacion() {
    try {
      const datos = JSON.parse(
        sessionStorage.getItem(CLAVE_CONVERSACION) || 'null',
      );
      return datos && Array.isArray(datos.mensajes) ? datos : null;
    } catch (e) {
      return null;
    }
  }

  function borrarConversacion() {
    conversacion = [];
    ultimaPregunta = null;
    if (mensajes) mensajes.innerHTML = '';
    try {
      sessionStorage.removeItem(CLAVE_CONVERSACION);
    } catch (e) {
      /* nada que borrar */
    }
  }

  function anadirMensaje(html, quien, recordar = true) {
    if (recordar) {
      conversacion.push({ html, quien });
      guardarConversacion(true);
    }
    const div = document.createElement('div');
    div.className = `sc-asis-msg sc-asis-msg--${quien}`;
    div.innerHTML = html;
    mensajes.appendChild(div);
    mensajes.scrollTop = mensajes.scrollHeight;
    div.querySelectorAll('a[data-verificar]').forEach((a) => {
      fetch(a.href, { method: 'HEAD' })
        .then((r) => {
          if (!r.ok) a.replaceWith(document.createTextNode(a.textContent));
        })
        .catch(() => {});
    });
    return div;
  }

  function preguntar(texto) {
    const t = texto.trim();
    if (!t || estado !== 'listo') return;
    anadirMensaje(esc(t), 'usuario');
    let html;
    try {
      html = responder(t);
    } catch (e) {
      console.error(e);
      html =
        'Vaya, algo ha fallado al buscar la respuesta. Prueba a preguntarlo de otra forma.';
    }
    anadirMensaje(html, 'bot'); // guarda también la memoria actualizada
  }

  function chips(lista) {
    return (
      '<div class="sc-asis-chips">' +
      lista
        .map(
          (e) =>
            `<button type="button" class="sc-asis-sugerencia" data-preguntar="${esc(e)}">${esc(e)}</button>`,
        )
        .join('') +
      '</div>'
    );
  }

  async function prepararDatos() {
    if (estado === 'listo' || estado === 'cargando') return;
    estado = 'cargando';
    entrada.disabled = true;
    const aviso = anadirMensaje(
      '<i class="fas fa-spinner fa-spin"></i> Cargando los datos del Oviedo…',
      'bot',
      false,
    );
    try {
      await cargarDatos();
      M = construirModelo();
      estado = 'listo';
      aviso.remove();
      // Conversación de otra página de la web: se recupera tal cual.
      const guardada = leerConversacion();
      if (guardada && guardada.mensajes.length) {
        ultimaPregunta = guardada.ultimaPregunta || null;
        guardada.mensajes.forEach((m) => anadirMensaje(m.html, m.quien));
      } else
        anadirMensaje(
          '¡Hola, carbayón! Pregúntame por jugadores, entrenadores, rivales o temporadas. Por ejemplo:' +
            chips(EJEMPLOS.slice(0, 4)),
          'bot',
        );
      entrada.disabled = false;
      entrada.focus();
    } catch (e) {
      console.error(e);
      estado = 'error';
      aviso.innerHTML =
        'No he podido cargar los datos. Revisa la conexión y vuelve a abrir el chat.';
    }
  }

  function abrir() {
    crearInterfaz();
    panel.classList.add('sc-asis-panel--abierto');
    document
      .getElementById('scAsistenteBoton')
      .setAttribute('aria-expanded', 'true');
    if (estado === 'error') estado = 'sin-cargar';
    prepararDatos();
    if (estado === 'listo') {
      // Reabierto después de cerrarlo: conversación nueva.
      if (!conversacion.length)
        anadirMensaje(
          '¡Hola, carbayón! Pregúntame por jugadores, entrenadores, rivales o temporadas. Por ejemplo:' +
            chips(EJEMPLOS.slice(0, 4)),
          'bot',
        );
      guardarConversacion(true);
      entrada.focus();
    }
  }

  function cerrar() {
    if (!panel) return;
    // Cerrar el chat termina la conversación (y su memoria).
    borrarConversacion();
    panel.classList.remove('sc-asis-panel--abierto');
    document
      .getElementById('scAsistenteBoton')
      .setAttribute('aria-expanded', 'false');
  }

  function crearInterfaz() {
    if (panel) return;
    panel = document.createElement('section');
    panel.className = 'sc-asis-panel';
    panel.id = 'scAsistentePanel';
    panel.setAttribute('aria-label', 'Pregúntale al Carbayón');
    panel.innerHTML = `
      <header class="sc-asis-cabecera">
        <img src="${esc(url('img/escudos/Oviedo.webp'))}" alt="" />
        <div>
          <b>Pregúntale al Carbayón</b>
          <small>Datos de la web, de 2009/10 a hoy</small>
        </div>
        <button type="button" class="sc-asis-cerrar" aria-label="Cerrar"><i class="fas fa-times"></i></button>
      </header>
      <div class="sc-asis-mensajes" aria-live="polite"></div>
      <form class="sc-asis-form">
        <input type="text" placeholder="Escribe tu pregunta…" aria-label="Tu pregunta" autocomplete="off" />
        <button type="submit" aria-label="Enviar"><i class="fas fa-paper-plane"></i></button>
      </form>`;
    document.body.appendChild(panel);
    mensajes = panel.querySelector('.sc-asis-mensajes');
    entrada = panel.querySelector('input');

    panel.querySelector('.sc-asis-cerrar').addEventListener('click', cerrar);
    panel.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const t = entrada.value;
      entrada.value = '';
      preguntar(t);
    });
    mensajes.addEventListener('click', (e) => {
      const b = e.target.closest('.sc-asis-sugerencia');
      if (!b) return;
      if (b.dataset.preguntar) {
        preguntar(b.dataset.preguntar);
      } else if (b.dataset.sustituir) {
        // Rehace la última pregunta cambiando el nombre ambiguo por el elegido.
        const ultimas = mensajes.querySelectorAll('.sc-asis-msg--usuario');
        const ultima = ultimas.length
          ? ultimas[ultimas.length - 1].textContent
          : '';
        const re = new RegExp(
          b.dataset.sustituir.split(' ').join('[^a-záéíóúüñ0-9]+'),
          'i',
        );
        const nueva = re.test(norm(ultima))
          ? norm(ultima).replace(re, b.dataset.por)
          : `${ultima} ${b.dataset.por}`;
        preguntar(nueva);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cerrar();
    });
  }

  function crearBoton() {
    if (document.getElementById('scAsistenteBoton')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.id = 'scAsistenteBoton';
    b.className = 'sc-asis-boton';
    b.setAttribute('aria-controls', 'scAsistentePanel');
    b.setAttribute('aria-expanded', 'false');
    b.innerHTML =
      '<i class="fas fa-comments"></i><span>Pregúntale al Carbayón</span>';
    b.addEventListener('click', () => {
      if (panel && panel.classList.contains('sc-asis-panel--abierto')) cerrar();
      else abrir();
    });
    document.body.appendChild(b);
  }

  window.SCAsistente = {
    abrir,
    cerrar,
    responder: (p) => {
      if (!M && window.SCIndice) M = construirModelo();
      return M ? responder(p) : null;
    },
  };

  function iniciar() {
    crearBoton();
    // Si en la página anterior el chat estaba abierto, se reabre con la
    // conversación guardada.
    const guardada = leerConversacion();
    if (guardada && guardada.abierto) abrir();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
