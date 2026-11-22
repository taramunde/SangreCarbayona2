/* =====================================================
   js/cuenta-atras.js — Cuenta atrás de la portada
   Depende de: js/clasificacion.js y js/calendario.js (cargar antes).

   Cuenta hasta el inicio del próximo partido del Oviedo (liga o Copa),
   usando la fecha y la hora puestas en clasificacion.js
   ("enfrentamientos") o en calendario.js ("partidosEspeciales").
   Las horas se entienden como hora de España (Europe/Madrid), así que
   la cuenta es correcta aunque quien mire la web esté en otro país.

   En cuanto llega a cero (empieza el partido), pasa sola al siguiente
   partido que tenga fecha, sin esperar a que se meta el resultado.
   Si un partido no tiene hora todavía, cuenta hasta las 00:00 de ese
   día y lo avisa con "Hora por confirmar".
   ===================================================== */
(function () {
  const OVIEDO = 'Real Oviedo';
  const ZONA = 'Europe/Madrid';

  const tr = (k, porDefecto) =>
    (typeof t === 'function' && t(k) !== k && t(k)) || porDefecto;

  // Diferencia (ms) entre la hora de Madrid y UTC en un instante dado.
  function desfaseMadrid(ts) {
    const partes = new Intl.DateTimeFormat('en-US', {
      timeZone: ZONA,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).formatToParts(new Date(ts));
    const v = {};
    partes.forEach((p) => (v[p.type] = Number(p.value)));
    return Date.UTC(v.year, v.month - 1, v.day, v.hour, v.minute, v.second) - ts;
  }

  // "2026-11-22" + "14:00" (hora de Madrid) → instante real (ms).
  function inicioPartido(p) {
    const [y, m, d] = p.fecha.split('-').map(Number);
    const [hh, mm] = (p.hora || '00:00').split(':').map(Number);
    const comoUTC = Date.UTC(y, m - 1, d, hh, mm);
    let ts = comoUTC - desfaseMadrid(comoUTC);
    ts = comoUTC - desfaseMadrid(ts); // ajuste fino en cambios de hora
    return ts;
  }

  function siguientePartido() {
    if (typeof window.getPartidosPendientesOviedo !== 'function') return null;
    const ahora = Date.now();
    return (
      window
        .getPartidosPendientesOviedo()
        .map((p) => ({ p, inicio: inicioPartido(p) }))
        .filter((x) => x.inicio > ahora)
        .sort((a, b) => a.inicio - b.inicio)[0] || null
    );
  }

  const dos = (n) => String(n).padStart(2, '0');

  function escudo(nombre) {
    const url = window.getEscudoEquipo ? window.getEscudoEquipo(nombre) : '';
    return url ? `<img src="${url}" alt="${nombre}" class="ca-escudo">` : '';
  }

  let actual = null;
  let timer = null;

  function pintarCabecera(cont) {
    const p = actual.p;
    const etapa = p.ronda
      ? window.translateRonda
        ? translateRonda(p.ronda)
        : p.ronda
      : p.jornada != null
        ? `${tr('jornada', 'Jornada')} ${p.jornada}`
        : '';
    const competicion = p.competicion || '';
    const fecha = window.getEtiquetaFecha ? window.getEtiquetaFecha(p) : p.fecha;
    const sinHora = !p.hora
      ? ` · ${tr('cuenta_hora_por_confirmar', 'Hora por confirmar')}`
      : '';

    cont.innerHTML = `
      <div class="ca-card">
        <div class="ca-titulo"><i class="fas fa-stopwatch"></i> ${tr('cuenta_atras_titulo', 'Cuenta atrás para el próximo partido')}</div>
        <div class="ca-partido">
          ${escudo(p.equipo1)}
          <span class="${p.equipo1 === OVIEDO ? 'es-oviedo' : ''}">${p.equipo1}</span>
          <span class="ca-vs">vs</span>
          <span class="${p.equipo2 === OVIEDO ? 'es-oviedo' : ''}">${p.equipo2}</span>
          ${escudo(p.equipo2)}
        </div>
        <div class="ca-reloj">
          <div class="ca-unidad"><span class="ca-num" data-u="d">00</span><span class="ca-label">${tr('cuenta_dias', 'Días')}</span></div>
          <span class="ca-sep">:</span>
          <div class="ca-unidad"><span class="ca-num" data-u="h">00</span><span class="ca-label">${tr('cuenta_horas', 'Horas')}</span></div>
          <span class="ca-sep">:</span>
          <div class="ca-unidad"><span class="ca-num" data-u="m">00</span><span class="ca-label">${tr('cuenta_minutos', 'Minutos')}</span></div>
          <span class="ca-sep">:</span>
          <div class="ca-unidad"><span class="ca-num" data-u="s">00</span><span class="ca-label">${tr('cuenta_segundos', 'Segundos')}</span></div>
        </div>
        <div class="ca-info">${[competicion, etapa, fecha].filter(Boolean).join(' · ')}${sinHora}</div>
      </div>`;
  }

  function tic() {
    const cont = document.getElementById('cuentaAtras');
    if (!cont) return;

    // Sin partido, o el actual ya ha empezado → buscar el siguiente.
    if (!actual || actual.inicio <= Date.now()) {
      actual = siguientePartido();
      if (!actual) {
        cont.innerHTML = '';
        cont.parentElement.style.display = 'none';
        return;
      }
      cont.parentElement.style.display = '';
      pintarCabecera(cont);
    }

    let resto = Math.max(0, Math.floor((actual.inicio - Date.now()) / 1000));
    const d = Math.floor(resto / 86400);
    resto %= 86400;
    const valores = {
      d: dos(d),
      h: dos(Math.floor(resto / 3600)),
      m: dos(Math.floor((resto % 3600) / 60)),
      s: dos(resto % 60),
    };
    cont.querySelectorAll('.ca-num').forEach((el) => {
      const v = valores[el.dataset.u];
      if (el.textContent !== v) el.textContent = v;
    });
  }

  function iniciar() {
    if (!document.getElementById('cuentaAtras')) return;
    tic();
    clearInterval(timer);
    timer = setInterval(tic, 1000);
  }

  // Al cambiar de idioma: volver a pintar los textos.
  window.renderCuentaAtras = function () {
    const cont = document.getElementById('cuentaAtras');
    if (cont && actual) pintarCabecera(cont);
    tic();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
