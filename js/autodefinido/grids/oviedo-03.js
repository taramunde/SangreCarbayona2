/* ===================================
   AUTODEFINIDO CARBAYÓN #3
   Últimas 7 palabras de la tanda de historia del Real Oviedo (incluye
   dos palabras largas, INGLATERRA y YUGOSLAVIA, por eso la rejilla es
   más grande que las anteriores). Respuestas confirmadas por el
   mantenedor de la web. Verificada con
   generador/validar-autodefinido.js.
   =================================== */

const B = { type: 'blocked' };
const L = (answer) => ({ type: 'letter', answer });
const C = (across, down) => ({ type: 'clue', across: across || null, down: down || null });

export default {
  id: 'oviedo-03',
  title: 'Autodefinido Carbayón #3',
  grid: {
    cols: 12,
    rows: 16,
    cells: [
      [B, C(null, 'Entrenador del último ascenso a Primera (1988)'), B, B, B, B, B, C(null, 'Mote de uno de los socios fundadores'), B, B, B, B],
      [B, L('M'), B, B, B, B, B, L('S'), B, B, B, B],
      [C('Entrenador en competición de la UEFA', null), L('I'), L('R'), L('U'), L('R'), L('E'), L('T'), L('A'), B, B, B, B],
      [B, L('E'), B, B, B, B, B, L('C'), B, B, B, B],
      [B, L('R'), B, B, B, B, B, L('A'), B, B, B, B],
      [B, L('A'), B, C(null, 'País del primer entrenador'), B, C('Ciudad de los Carbayones', null), L('O'), L('V'), L('I'), L('E'), L('D'), L('O')],
      [B, B, B, L('I'), B, B, B, L('E'), B, B, B, B],
      [B, B, B, L('N'), B, B, B, L('R'), B, B, B, B],
      [C('Primera Selección en visitar Oviedo', null), L('Y'), L('U'), L('G'), L('O'), L('S'), L('L'), L('A'), L('V'), L('I'), L('A'), B],
      [B, B, B, L('L'), B, B, B, B, B, B, B, B],
      [B, B, B, L('A'), B, B, B, B, B, B, B, B],
      [B, B, B, L('T'), B, B, B, B, B, B, B, B],
      [B, C('Ciudad Deportiva del Real Oviedo', null), L('R'), L('E'), L('Q'), L('U'), L('E'), L('X'), L('O'), L('N'), B, B],
      [B, B, B, L('R'), B, B, B, B, B, B, B, B],
      [B, B, B, L('R'), B, B, B, B, B, B, B, B],
      [B, B, B, L('A'), B, B, B, B, B, B, B, B],
    ],
  },
};
