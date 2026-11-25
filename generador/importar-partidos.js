#!/usr/bin/env node
/**
 * importar-partidos.js — `npm run importar-partidos -- "excel/partidos-2007-08.xlsx"`
 *
 * Lee el Excel de partidos de una temporada (el de `npm run
 * plantilla-partidos -- 2007-08`) y escribe esa temporada en
 * js/data-historico.js: jugadores con todos sus partidos, cuerpo técnico
 * y, si se pide, las estadísticas del equipo.
 *
 * Primero SOLO revisa y enseña lo que haría. Para escribir de verdad:
 *   npm run importar-partidos -- "excel/partidos-2007-08.xlsx" --aplicar
 *
 * El Excel es la versión completa de la temporada: los jugadores y
 * entrenadores de esa temporada se reescriben con lo que hay en él. Por
 * seguridad, si en la web hay jugadores de esa temporada que NO están en
 * el Excel, se para y avisa (con --reemplazar se borran igualmente).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ExcelJS = require('exceljs');
const C = require('./partidos-excel-comun');

const ARCHIVO = path.join(C.RAIZ, 'js', 'data-historico.js');
const args = process.argv.slice(2);
const APLICAR = args.includes('--aplicar');
const REEMPLAZAR = args.includes('--reemplazar');
const excel = args.find((a) => !a.startsWith('--'));
if (!excel) {
  console.error(
    'Uso: npm run importar-partidos -- "excel/partidos-2007-08.xlsx" [--aplicar]',
  );
  process.exit(1);
}

const datos = C.cargarDatos();
const { MJ, ME, TEMPORADAS } = datos;

// ── Lectura de celdas ───────────────────────────────────────────
function valor(celda) {
  let v = celda && celda.value;
  if (v && typeof v === 'object') {
    if (v instanceof Date) return v;
    if ('formula' in v || 'sharedFormula' in v) return v.result ?? null;
    if ('text' in v) v = v.text;
    else if (Array.isArray(v.richText))
      v = v.richText.map((t) => t.text).join('');
    else if ('error' in v) return null;
  }
  if (typeof v === 'string') v = v.replace(/\s+/g, ' ').trim();
  return v === '' ? null : (v ?? null);
}
const texto = (v) => (v == null ? null : String(v).trim() || null);
function numero(v) {
  if (v == null) return null;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
}
function fechaISO(v) {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'number')
    return new Date(Math.round((v - 25569) * 864e5)).toISOString().slice(0, 10);
  const m = String(v).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(v))) return String(v);
  return undefined;
}
function filas(ws, columnas) {
  const res = [];
  if (!ws) return res;
  ws.eachRow((row, n) => {
    if (n === 1) return;
    const o = { _fila: n };
    columnas.forEach((c, i) => c && (o[c] = valor(row.getCell(i + 1))));
    res.push(o);
  });
  return res;
}

// ── Avisos ──────────────────────────────────────────────────────
const errores = []; // la fila no entra
const avisos = []; // entra, pero conviene mirarlo
const err = (m) => errores.push(m);
const aviso = (m) => avisos.push(m);

// ── Personas: etiqueta del Excel → código ───────────────────────
function indice(maestro) {
  const idx = new Map();
  const apodos = new Map();
  Object.entries(maestro).forEach(([codigo, d]) => {
    [C.etiqueta(d), d.nombreCompleto, codigo].forEach(
      (k) => k && idx.set(C.norm(k), codigo),
    );
    const a = C.norm(d.apodo);
    apodos.set(a, apodos.has(a) ? null : codigo); // null = apodo repetido
  });
  return (etq) => {
    const k = C.norm(etq);
    if (idx.has(k)) return idx.get(k);
    if (apodos.get(k)) return apodos.get(k);
    const dentro = String(etq).match(/\(([^)]+)\)\s*$/); // "Lo que sea (Nombre Completo)"
    if (dentro && idx.has(C.norm(dentro[1]))) return idx.get(C.norm(dentro[1]));
    return null;
  };
}
const buscarJugador = indice(MJ);
const buscarEntrenador = indice(ME);
const codigoNuevo = (etq) => {
  const m = String(etq).match(/\(([^)]+)\)\s*$/);
  return C.codigoDe(m ? m[1] : etq);
};

async function main() {
  const ruta = path.resolve(C.RAIZ, excel);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(ruta);

  // ── Temporada ──
  const conf = {};
  const TS = wb.getWorksheet('Temporada');
  if (TS)
    TS.eachRow(
      (row, n) =>
        n > 1 && (conf[C.norm(valor(row.getCell(1)))] = valor(row.getCell(2))),
    );
  const id = texto(conf['temporada']);
  if (!id || !/^\d{4}-\d{2}$/.test(id))
    throw new Error('En la hoja Temporada falta la temporada (así: 2007-08).');
  const existente = TEMPORADAS[id] || null;
  const liga =
    texto(conf['competicion de liga']) ||
    (existente && existente.competicion) ||
    null;
  const recalcular =
    C.norm(conf['recalcular estadisticas del equipo']) === 'si' || !existente;

  // ── Partidos ──
  const partidos = new Map(); // Nº → partido
  const fechas = new Map();
  filas(wb.getWorksheet('Partidos'), [
    'n',
    'competicion',
    'jornada',
    'fecha',
    'local',
    'visitante',
    'gl',
    'gv',
    'prorroga',
    'pl',
    'pv',
    null,
    'entrenador',
  ]).forEach((f) => {
    const relleno = [
      'competicion',
      'jornada',
      'fecha',
      'local',
      'visitante',
      'gl',
      'gv',
    ].some((c) => f[c] != null);
    if (!relleno) return;
    const donde = `Partidos fila ${f._fila}`;
    const p = {};
    const n = numero(f.n);
    const fecha = fechaISO(f.fecha);
    p.competicion = texto(f.competicion) || liga;
    p.jornada =
      f.jornada == null
        ? null
        : /^\d+$/.test(String(f.jornada))
          ? Number(f.jornada)
          : texto(f.jornada);
    p.local = texto(f.local);
    p.visitante = texto(f.visitante);
    p.golesLocal = numero(f.gl);
    p.golesVisitante = numero(f.gv);
    const fallos = [];
    if (!Number.isInteger(n)) fallos.push('falta el Nº');
    else if (partidos.has(n)) fallos.push(`el Nº ${n} está repetido`);
    if (!fecha)
      fallos.push(fecha === undefined ? 'fecha no válida' : 'falta la fecha');
    else if (fechas.has(fecha))
      fallos.push(`ya hay otro partido el ${fecha} (Nº ${fechas.get(fecha)})`);
    if (!p.competicion) fallos.push('falta la competición');
    if (p.jornada == null) fallos.push('falta la jornada o ronda');
    if (!p.local || !p.visitante) fallos.push('falta local o visitante');
    else if (p.local !== C.CLUB && p.visitante !== C.CLUB)
      fallos.push(`ni local ni visitante es "${C.CLUB}"`);
    if (!Number.isInteger(p.golesLocal) || !Number.isInteger(p.golesVisitante))
      fallos.push('faltan los goles');
    if (fallos.length) return err(`${donde}: ${fallos.join('; ')} → no entra`);
    p.fecha = fecha;
    const pl = numero(f.pl);
    const pv = numero(f.pv);
    if (pl != null || pv != null) {
      if (!Number.isInteger(pl) || !Number.isInteger(pv))
        err(`${donde}: penaltis a medias (rellena los dos) → se ignoran`);
      else if (p.golesLocal !== p.golesVisitante)
        aviso(
          `${donde}: tiene penaltis pero el marcador no es empate (${p.golesLocal}-${p.golesVisitante})`,
        );
      else if (pl === pv)
        err(`${donde}: penaltis empatados (${pl}-${pv}) → se ignoran`);
      else {
        p.penaltisLocal = pl;
        p.penaltisVisitante = pv;
      }
    }
    const casa = p.local === C.CLUB;
    const dif = casa
      ? p.golesLocal - p.golesVisitante
      : p.golesVisitante - p.golesLocal;
    const difPen =
      p.penaltisLocal == null
        ? 0
        : casa
          ? p.penaltisLocal - p.penaltisVisitante
          : p.penaltisVisitante - p.penaltisLocal;
    p.resultado =
      dif > 0 ? 'V' : dif < 0 ? 'D' : difPen > 0 ? 'V' : difPen < 0 ? 'D' : 'E';
    p.n = n;
    p.prorroga = C.norm(f.prorroga) === 'si' || p.penaltisLocal != null;
    p.entrenador = texto(f.entrenador);
    p.fila = f._fila;
    partidos.set(n, p);
    fechas.set(fecha, n);
  });
  const conocidos = new Set(C.listas(datos).equipos);
  const equiposNuevos = new Set();
  partidos.forEach((p) =>
    [p.local, p.visitante].forEach(
      (e) => !conocidos.has(e) && equiposNuevos.add(e),
    ),
  );
  if (equiposNuevos.size)
    aviso(
      `equipos que no salen en ninguna otra temporada (¿bien escritos?): ${[...equiposNuevos].join(', ')}`,
    );

  // ── Plantilla ──
  const plantilla = [];
  const porEtiqueta = new Map();
  filas(wb.getWorksheet('Plantilla'), [
    'jugador',
    null,
    'dorsal',
    'posicion',
    'desde',
    'hasta',
    'situacion',
    'cedidoEn',
  ]).forEach((f, orden) => {
    const etq = texto(f.jugador);
    if (!etq) return;
    const donde = `Plantilla fila ${f._fila} (${etq})`;
    let codigo = buscarJugador(etq);
    if (!codigo) {
      codigo = codigoNuevo(etq);
      aviso(
        `${donde}: no tiene ficha en data-jugadores.js → se mete como "${codigo}" (saldrá sin foto ni nombre hasta que tenga ficha)`,
      );
    }
    if (plantilla.some((x) => x.codigo === codigo))
      return err(
        `${donde}: está dos veces en la Plantilla → la segunda no entra`,
      );
    const m = MJ[codigo];
    const j = { id: codigo, codigo };
    const dorsal = numero(f.dorsal);
    j.dorsal = dorsal == null || Number.isNaN(dorsal) ? '-' : dorsal;
    const pos =
      texto(f.posicion) || (m && C.POS_DE_CORTA[m.posicionCorta]) || null;
    if (pos) j.posicion = pos;
    if (pos && !C.POSICIONES.includes(pos))
      aviso(`${donde}: posición "${pos}" no es de la lista`);
    const desde = numero(f.desde);
    const hasta = numero(f.hasta);
    if (!Number.isInteger(desde) || !Number.isInteger(hasta))
      return err(
        `${donde}: faltan los años "en el club desde/hasta" → no entra`,
      );
    if (hasta < desde)
      aviso(`${donde}: "hasta" (${hasta}) es anterior a "desde" (${desde})`);
    j.enClubDesde = String(desde);
    j.contratoHasta = String(hasta);
    const sit = C.norm(f.situacion);
    const club = texto(f.cedidoEn);
    if (sit === 'baja') j.estado = 'baja';
    else if (sit === 'cedido') {
      j.estado = 'cedido';
      if (club) j.cedidoEn = club;
      else aviso(`${donde}: cedido, pero sin club`);
    } else if (sit === 'cedido y despues baja') {
      j.estados = [
        club ? { tipo: 'cedido', club } : { tipo: 'cedido' },
        { tipo: 'baja' },
      ];
      if (!club) aviso(`${donde}: cedido, pero sin club`);
    } else if (sit)
      aviso(`${donde}: situación "${f.situacion}" no reconocida → se ignora`);
    if (club && !sit)
      aviso(
        `${donde}: tiene club de cesión pero la situación está vacía → se ignora el club`,
      );
    const x = {
      codigo,
      j,
      orden,
      etq,
      portero: pos === 'Portero' || (!pos && m && m.posicion === 'Portero'),
      maestro: m,
      actuaciones: [],
    };
    plantilla.push(x);
    porEtiqueta.set(C.norm(etq), x);
  });

  // ── Actuaciones ──
  const vistos = new Set();
  filas(wb.getWorksheet('Actuaciones'), [
    'n',
    null,
    null,
    null,
    'jugador',
    null,
    'minutos',
    'goles',
    'asistencias',
    'tarjetas',
    'propia',
  ]).forEach((f) => {
    const etq = texto(f.jugador);
    // "25 · J19 · 06/01/2008 · ..." → 25 (o el número a secas).
    const n =
      f.n == null ? null : numero(String(f.n).match(/^\s*(\d+)/)?.[1] ?? f.n);
    const resto = [
      'minutos',
      'goles',
      'asistencias',
      'tarjetas',
      'propia',
    ].some((c) => f[c] != null);
    if (!etq && n == null && !resto) return;
    const donde = `Actuaciones fila ${f._fila}${etq ? ` (${etq})` : ''}`;
    if (n == null || !etq)
      return err(
        `${donde}: falta ${n == null ? 'el Nº de partido' : 'el jugador'} → no entra`,
      );
    const p = partidos.get(n);
    if (!p)
      return err(
        `${donde}: el partido Nº ${n} no está (bien) en la hoja Partidos → no entra`,
      );
    const x = porEtiqueta.get(C.norm(etq));
    if (!x)
      return err(`${donde}: "${etq}" no está en la hoja Plantilla → no entra`);
    const clave = `${x.codigo}|${n}`;
    if (vistos.has(clave))
      return err(
        `${donde}: ${etq} ya tiene una fila para el partido Nº ${n} → la repetida no entra`,
      );
    vistos.add(clave);

    const completo = p.prorroga ? 120 : 90;
    let minutos = numero(f.minutos);
    if (minutos == null) minutos = completo;
    if (!Number.isInteger(minutos) || minutos < 0 || minutos > 130)
      return err(`${donde}: minutos raros (${f.minutos}) → no entra`);
    if (minutos === 0)
      aviso(`${donde}: 0 minutos en el Nº ${n}; si no jugó, borra la fila`);
    if (minutos > 90 && !p.prorroga)
      aviso(
        `${donde}: ${minutos} minutos en el Nº ${n}, que no tiene prórroga marcada`,
      );
    const rival = p.local === C.CLUB ? p.golesVisitante : p.golesLocal;
    let goles = numero(f.goles);
    if (goles == null) {
      goles = 0;
      if (x.portero) {
        if (minutos >= completo) goles = rival;
        else
          aviso(
            `${donde}: portero que no jugó entero el Nº ${n} y sin goles encajados → se pone 0`,
          );
      }
    }
    const asistencias = numero(f.asistencias) ?? 0;
    const propia = numero(f.propia) ?? 0;
    if (
      ![goles, asistencias, propia].every((v) => Number.isInteger(v) && v >= 0)
    )
      return err(
        `${donde}: goles/asistencias no son números enteros → no entra`,
      );
    if (x.portero && goles > rival)
      aviso(
        `${donde}: portero con ${goles} encajados en el Nº ${n}, pero el rival solo marcó ${rival}`,
      );
    if (x.portero && minutos >= completo && goles !== rival)
      aviso(
        `${donde}: portero que jugó entero el Nº ${n} con ${goles} encajados, pero el rival marcó ${rival}`,
      );
    let tarjetas = { amarilla: false, roja: false };
    const tj = texto(f.tarjetas);
    if (tj) {
      const k = Object.keys(C.TARJETAS).find((t) => C.norm(t) === C.norm(tj));
      if (!k) aviso(`${donde}: tarjeta "${tj}" no reconocida → sin tarjeta`);
      else tarjetas = { ...C.TARJETAS[k] };
    }
    x.actuaciones.push({
      p,
      minutos,
      goles,
      asistencias,
      propia,
      tarjetas,
      fila: f._fila,
    });
  });

  // Comprobaciones por partido.
  partidos.forEach((p) => {
    const acts = plantilla.flatMap((x) =>
      x.actuaciones.filter((a) => a.p === p).map((a) => ({ ...a, x })),
    );
    if (!acts.length) return;
    const nuestros = p.local === C.CLUB ? p.golesLocal : p.golesVisitante;
    const marcados = acts
      .filter((a) => !a.x.portero)
      .reduce((s, a) => s + a.goles, 0);
    const asist = acts.reduce((s, a) => s + a.asistencias, 0);
    if (marcados > nuestros)
      aviso(
        `partido Nº ${p.n} (${p.fecha}): los jugadores suman ${marcados} goles pero el Oviedo marcó ${nuestros}`,
      );
    if (asist > nuestros)
      aviso(
        `partido Nº ${p.n} (${p.fecha}): ${asist} asistencias para ${nuestros} goles`,
      );
    if (acts.length > 14)
      aviso(
        `partido Nº ${p.n} (${p.fecha}): ${acts.length} jugadores con minutos (¿alguna fila de más?)`,
      );
  });

  // ── Entrenadores ──
  const tecnicos = [];
  filas(wb.getWorksheet('Entrenadores'), [
    'entrenador',
    null,
    'cargo',
    'desde',
    'hasta',
    'situacion',
  ]).forEach((f) => {
    const etq = texto(f.entrenador);
    if (!etq) return;
    const donde = `Entrenadores fila ${f._fila} (${etq})`;
    let codigo = buscarEntrenador(etq);
    if (!codigo) {
      codigo = codigoNuevo(etq);
      aviso(
        `${donde}: no tiene ficha en entrenadorMaestro → se mete como "${codigo}"`,
      );
    }
    if (tecnicos.some((t) => t.codigo === codigo))
      return err(`${donde}: repetido → no entra`);
    const desde = numero(f.desde);
    const hasta = numero(f.hasta);
    if (!Number.isInteger(desde) || !Number.isInteger(hasta))
      return err(`${donde}: faltan los años desde/hasta → no entra`);
    const m = ME[codigo];
    const cargo = texto(f.cargo) || 'Entrenador Principal';
    const e = {
      id: codigo,
      codigo,
      nombre: (m && m.nombreCompleto) || etq.replace(/\s*\(.*\)\s*$/, ''),
      cargo,
      imagen: (m && m.imagen) || '',
      esPrincipal: cargo === 'Entrenador Principal',
      enClubDesde: String(desde),
      contratoHasta: String(hasta),
    };
    if (C.norm(f.situacion) === 'baja') e.estado = 'baja';
    tecnicos.push({ codigo, e, etq, partidos: [] });
  });
  const principales = tecnicos.filter((t) => t.e.esPrincipal);
  const sinEntrenador = [];
  partidos.forEach((p) => {
    if (p.entrenador) {
      const t = tecnicos.find(
        (x) =>
          C.norm(x.etq) === C.norm(p.entrenador) ||
          x.codigo === buscarEntrenador(p.entrenador),
      );
      if (t) t.partidos.push(p);
      else
        err(
          `Partidos fila ${p.fila}: el entrenador "${p.entrenador}" no está en la hoja Entrenadores`,
        );
    } else if (principales.length === 1) principales[0].partidos.push(p);
    else if (principales.length > 1) sinEntrenador.push(p.n);
  });
  if (sinEntrenador.length)
    aviso(
      `partidos sin entrenador (hay ${principales.length} principales, di cuál en la columna Entrenador): Nº ${sinEntrenador.join(', ')}`,
    );

  // ── Estadísticas del equipo ──
  const desglose = {};
  [...partidos.values()]
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .forEach((p) => {
      const d = (desglose[p.competicion] = desglose[p.competicion] || {
        partidos: 0,
        victorias: 0,
        empates: 0,
        derrotas: 0,
        golesFavor: 0,
        golesContra: 0,
      });
      const casa = p.local === C.CLUB;
      d.partidos++;
      d[{ V: 'victorias', E: 'empates', D: 'derrotas' }[p.resultado]]++;
      d.golesFavor += casa ? p.golesLocal : p.golesVisitante;
      d.golesContra += casa ? p.golesVisitante : p.golesLocal;
    });

  // ── Resumen ──
  console.log(
    `\nExcel: ${path.relative(C.RAIZ, ruta)}  →  temporada ${id}${existente ? ' (ya existe: se actualiza)' : ' (NUEVA)'}\n`,
  );
  console.log(
    `  ${partidos.size} partidos · ${plantilla.length} jugadores · ${tecnicos.length} entrenadores · ${plantilla.reduce((s, x) => s + x.actuaciones.length, 0)} actuaciones`,
  );
  console.log('\n  Estadísticas del equipo según la hoja Partidos:');
  const previo =
    (existente &&
      existente.estadisticasEquipo &&
      existente.estadisticasEquipo.desglose) ||
    {};
  const comps = [
    ...new Set([...Object.keys(desglose), ...Object.keys(previo)]),
  ];
  comps.forEach((c) => {
    const a = desglose[c];
    const b = previo[c];
    const txt = (d) =>
      d
        ? `${d.partidos} PJ ${d.victorias}V ${d.empates}E ${d.derrotas}D ${d.golesFavor}-${d.golesContra}`
        : '—';
    const igual =
      a &&
      b &&
      [
        'partidos',
        'victorias',
        'empates',
        'derrotas',
        'golesFavor',
        'golesContra',
      ].every((k) => a[k] === b[k]);
    console.log(
      `    ${igual || !existente ? '✔' : '≠'} ${c}: ${txt(a)}${existente && !igual ? `   (en la web: ${txt(b)})` : ''}`,
    );
  });
  if (
    existente &&
    !recalcular &&
    comps.some((c) => JSON.stringify(desglose[c]) !== JSON.stringify(previo[c]))
  )
    console.log(
      '    (≠ = no cuadra con lo que hay en la web; normal si aún faltan partidos. No se toca salvo "Recalcular = Sí".)',
    );
  console.log('');
  plantilla.forEach((x) => {
    const a = x.actuaciones;
    const g = a.reduce((s, y) => s + y.goles, 0);
    console.log(
      `  ✔ ${x.j.dorsal === '-' ? '  ' : String(x.j.dorsal).padStart(2)} ${(x.maestro ? x.maestro.apodo : x.etq).padEnd(22)} ${String(a.length).padStart(3)} PJ  ${String(a.reduce((s, y) => s + y.minutos, 0)).padStart(5)}'  ${x.portero ? `${g} encajados` : `${g} goles`}`,
    );
  });
  tecnicos.forEach((t) =>
    console.log(`  ✔ Entrenador ${t.e.nombre}: ${t.partidos.length} partidos`),
  );
  errores.forEach((m) => console.log(`  ✖ ${m}`));
  avisos.forEach((m) => console.log(`  ⚠ ${m}`));

  // Seguridad: no perder jugadores que ya estaban.
  const perdidos = existente
    ? (existente.jugadores || [])
        .filter((j) => !plantilla.some((x) => x.codigo === j.codigo))
        .map((j) => j.codigo)
    : [];
  const perdidosT =
    existente && tecnicos.length
      ? (existente.cuerpoTecnico || [])
          .filter((e) => !tecnicos.some((t) => t.codigo === e.codigo))
          .map((e) => e.codigo)
      : [];
  if (plantilla.length && (perdidos.length || perdidosT.length)) {
    console.log(
      `\n  ⚠ En la web hay de ${id} y NO están en el Excel: ${[...perdidos, ...perdidosT].join(', ')}`,
    );
    if (!REEMPLAZAR) {
      console.log(
        '    Se borrarían. Añádelos a la Plantilla/Entrenadores, o usa --reemplazar si de verdad sobran.',
      );
      if (APLICAR) process.exitCode = 1;
      if (APLICAR) return;
    }
  }

  if (!APLICAR) {
    console.log(
      `\nSolo revisión: no se ha cambiado nada. Para meterlo en js/data-historico.js, añade --aplicar.`,
    );
    return;
  }

  // ── Escritura ──
  const jugadoresJS = construirJugadores(plantilla);
  const tecnicosJS = tecnicos.map((t) => lineaTecnico(t)).join('\n');
  let fuente = fs.readFileSync(ARCHIVO, 'utf8');
  const estadisticas = recalcular
    ? bloqueEstadisticas(
        Number(numero(conf['posicion final en liga'])) ||
          (existente &&
            existente.estadisticasEquipo &&
            existente.estadisticasEquipo.posicion) ||
          null,
        desglose,
      )
    : null;
  if (existente) {
    const b = bloqueTemporada(fuente, id);
    let cuerpo = fuente.slice(b.ini, b.fin);
    if (plantilla.length)
      cuerpo = reemplazarArray(cuerpo, 'jugadores', jugadoresJS);
    if (tecnicos.length)
      cuerpo = reemplazarArray(cuerpo, 'cuerpoTecnico', `\n${tecnicosJS}\n  `);
    if (estadisticas)
      cuerpo = reemplazarValor(cuerpo, 'estadisticasEquipo', estadisticas);
    fuente = fuente.slice(0, b.ini) + cuerpo + fuente.slice(b.fin);
  } else {
    if (!liga)
      throw new Error(
        'Temporada nueva: falta "Competición de liga" en la hoja Temporada.',
      );
    const [a1] = id.split('-').map(Number);
    const grupo = texto(conf['grupo']) || 'null';
    const bloque = [
      '// ===================================',
      `// TEMPORADA ${a1}/${a1 + 1}`,
      '// ===================================',
      `CLUB_DATA.temporadas['${id}'] = {`,
      `  competicion: ${js(liga).replace(/"/g, "'")},`,
      `  grupo: ${js(grupo).replace(/"/g, "'")},`,
      '',
      `  estadisticasEquipo: ${estadisticas},`,
      '',
      `  jugadores: [${jugadoresJS}],`,
      '',
      '  // ENTRENADORES',
      `  cuerpoTecnico: [${tecnicos.length ? `\n${tecnicosJS}\n  ` : '\n    \n  '}],`,
      '};',
      '',
      '',
    ].join('\n');
    fuente = insertarTemporada(fuente, id, bloque);
  }
  // Comprobación: si algo quedara mal escrito, falla aquí y no se guarda.
  const prueba = { window: {} };
  vm.createContext(prueba);
  vm.runInContext(
    fs
      .readFileSync(path.join(C.RAIZ, 'js', 'data-club.js'), 'utf8')
      .replace(/^const CLUB_DATA/m, 'var CLUB_DATA'),
    prueba,
  );
  vm.runInContext(fuente, prueba);
  const t2 = prueba.CLUB_DATA.temporadas[id];
  if (!t2 || (plantilla.length && t2.jugadores.length !== plantilla.length))
    throw new Error('La comprobación final no cuadra; no se ha guardado nada.');
  fs.writeFileSync(ARCHIVO, fuente);
  console.log(
    `\n✔ Temporada ${id} escrita en js/data-historico.js. Ahora: npm run subir`,
  );
}

// ── Formato de salida (igual que el resto de data-historico.js) ──
const js = (v) => {
  if (v === null || v === undefined) return 'null';
  if (Array.isArray(v)) return `[ ${v.map(js).join(', ')} ]`;
  if (typeof v === 'object')
    return `{ ${Object.entries(v)
      .map(([k, x]) => `${k}: ${js(x)}`)
      .join(', ')} }`;
  return typeof v === 'string' ? JSON.stringify(v) : String(v);
};
const lista = (arr) =>
  arr.length ? `[ ${arr.map((o) => `${js(o)}, `).join('')}]` : '[ ]';

function partidoJugador(a, idx) {
  const p = a.p;
  const o = {
    id: idx + 1,
    jornada: p.jornada,
    competicion: p.competicion,
    fecha: p.fecha,
    local: p.local,
    visitante: p.visitante,
    golesLocal: p.golesLocal,
    golesVisitante: p.golesVisitante,
    resultado: p.resultado,
    minutos: a.minutos,
  };
  if (p.penaltisLocal != null)
    Object.assign(o, {
      penaltisLocal: p.penaltisLocal,
      penaltisVisitante: p.penaltisVisitante,
    });
  o.goles = a.goles;
  if (a.propia) o.golesPropia = a.propia;
  Object.assign(o, {
    asistencias: a.asistencias,
    amarilla: a.tarjetas.amarilla,
    roja: a.tarjetas.roja,
  });
  if (a.tarjetas.rojaDirecta) o.rojaDirecta = true;
  return o;
}
function partidoTecnico(p, idx) {
  const o = {
    id: idx + 1,
    jornada: p.jornada,
    competicion: p.competicion,
    fecha: p.fecha,
    local: p.local,
    visitante: p.visitante,
    golesLocal: p.golesLocal,
    golesVisitante: p.golesVisitante,
    resultado: p.resultado,
  };
  if (p.penaltisLocal != null)
    Object.assign(o, {
      penaltisLocal: p.penaltisLocal,
      penaltisVisitante: p.penaltisVisitante,
    });
  return o;
}
const porFecha = (a, b) => a.fecha.localeCompare(b.fecha);

function construirJugadores(plantilla) {
  const grupos = C.GRUPOS.map(() => []);
  plantilla.forEach((x) => grupos[C.grupoDe(x.j.posicion, x.maestro)].push(x));
  const d = (x) => (typeof x.j.dorsal === 'number' ? x.j.dorsal : 1000);
  let out = '\n';
  grupos.forEach((g, i) => {
    out += `\n    // ${C.GRUPOS[i][0]}\n`;
    g.sort((a, b) => d(a) - d(b) || a.orden - b.orden).forEach((x) => {
      const partidos = x.actuaciones
        .slice()
        .sort((a, b) => porFecha(a.p, b.p))
        .map(partidoJugador);
      const { j } = x;
      const campos = [
        `id: ${js(j.id)}`,
        `codigo: ${js(j.codigo)}`,
        `dorsal: ${js(j.dorsal)}`,
        j.posicion && `posicion: ${js(j.posicion)}`,
        `enClubDesde: ${js(j.enClubDesde)}`,
        `contratoHasta: ${js(j.contratoHasta)}`,
        j.estado && `estado: ${js(j.estado)}`,
        j.cedidoEn && `cedidoEn: ${js(j.cedidoEn)}`,
        j.estados && `estados: ${js(j.estados)}`,
        'stats: {}',
        `partidos: ${lista(partidos)}`,
      ].filter(Boolean);
      out += `    { ${campos.join(', ')} }, \n`;
    });
  });
  return `${out}\n  `;
}
function lineaTecnico(t) {
  const { e } = t;
  const partidos = t.partidos.slice().sort(porFecha).map(partidoTecnico);
  const campos = Object.entries(e).map(([k, v]) => `${k}: ${js(v)}`);
  campos.push('estadisticas: {}', `partidos: ${lista(partidos)}`);
  return `    { ${campos.join(', ')} }, `;
}
function bloqueEstadisticas(posicion, desglose) {
  const filasComp = Object.entries(desglose)
    .map(
      ([c, d]) =>
        `      ${js(c).replace(/^"(.*)"$/, "'$1'")}: {\n` +
        Object.entries(d)
          .map(([k, v]) => `        ${`${k}:`.padEnd(13)}${v},`)
          .join('\n') +
        '\n      },',
    )
    .join('\n');
  return `{\n    posicion: ${posicion == null ? 'null' : posicion},\n    desglose: {\n${filasComp}\n    },\n  }`;
}

// ── Localizar trozos dentro de data-historico.js ─────────────────
// Busca el cierre que corresponde a la apertura en `i`, saltando textos
// entre comillas y comentarios.
function cierre(src, i) {
  const abre = src[i];
  const cierra = { '{': '}', '[': ']' }[abre];
  let nivel = 0;
  for (let k = i; k < src.length; k++) {
    const ch = src[k];
    if (ch === '"' || ch === "'" || ch === '`') {
      for (k++; k < src.length && src[k] !== ch; k++) if (src[k] === '\\') k++;
    } else if (ch === '/' && src[k + 1] === '/') k = src.indexOf('\n', k);
    else if (ch === '/' && src[k + 1] === '*') k = src.indexOf('*/', k) + 1;
    else if (ch === '{' || ch === '[') nivel++;
    else if (ch === '}' || ch === ']') {
      nivel--;
      if (nivel === 0) {
        if (ch !== cierra)
          throw new Error('Llaves descuadradas en data-historico.js');
        return k;
      }
    }
    if (k < 0) break;
  }
  throw new Error('No encuentro el cierre en data-historico.js');
}
function bloqueTemporada(src, id) {
  const cab = `CLUB_DATA.temporadas['${id}'] = `;
  const i = src.indexOf(cab);
  if (i < 0) throw new Error(`No encuentro la temporada ${id}`);
  const ini = i + cab.length;
  return { ini, fin: cierre(src, ini) + 1 };
}
function posicionClave(cuerpo, clave) {
  const re = new RegExp(`\\n\\s*${clave}\\s*:\\s*`, 'g');
  // Solo claves del primer nivel del bloque de la temporada.
  let m;
  while ((m = re.exec(cuerpo))) {
    const antes = cuerpo.slice(0, m.index);
    let nivel = 0;
    for (let k = 0; k < antes.length; k++) {
      const ch = antes[k];
      if (ch === '"' || ch === "'") {
        for (k++; k < antes.length && antes[k] !== ch; k++)
          if (antes[k] === '\\') k++;
      } else if (ch === '/' && antes[k + 1] === '/') k = antes.indexOf('\n', k);
      else if (ch === '{' || ch === '[') nivel++;
      else if (ch === '}' || ch === ']') nivel--;
      if (k < 0) break;
    }
    if (nivel === 1) return m.index + m[0].length;
  }
  return -1;
}
function reemplazarArray(cuerpo, clave, contenido) {
  const i = posicionClave(cuerpo, clave);
  if (i < 0 || cuerpo[i] !== '[')
    throw new Error(`No encuentro "${clave}: [" en la temporada`);
  const f = cierre(cuerpo, i);
  return cuerpo.slice(0, i + 1) + contenido + cuerpo.slice(f);
}
function reemplazarValor(cuerpo, clave, valorTexto) {
  const i = posicionClave(cuerpo, clave);
  if (i < 0) {
    const j = posicionClave(cuerpo, 'jugadores');
    const linea = cuerpo.lastIndexOf('\n', j - 1);
    return `${cuerpo.slice(0, linea)}\n  ${clave}: ${valorTexto},\n${cuerpo.slice(linea)}`;
  }
  const f = cierre(cuerpo, i);
  return cuerpo.slice(0, i) + valorTexto + cuerpo.slice(f + 1);
}
function insertarTemporada(src, id, bloque) {
  // Las temporadas van de la más nueva a la más vieja.
  const re = /CLUB_DATA\.temporadas\['(\d{4}-\d{2})'\] = /g;
  let m;
  let antesDe = -1;
  while ((m = re.exec(src))) {
    if (m[1] < id) {
      antesDe = m.index;
      break;
    }
  }
  if (antesDe >= 0) {
    const banner = src.lastIndexOf(
      '// ===================================\n// TEMPORADA',
      antesDe,
    );
    const ini = banner >= 0 && antesDe - banner < 120 ? banner : antesDe;
    return src.slice(0, ini) + bloque + src.slice(ini);
  }
  const fin = src.lastIndexOf('window.CLUB_DATA = CLUB_DATA;');
  if (fin < 0) throw new Error('No encuentro el final de data-historico.js');
  return `${src.slice(0, fin)}${bloque}${src.slice(fin)}`;
}

main().catch((e) => {
  console.error('✖', e.message);
  process.exit(1);
});
