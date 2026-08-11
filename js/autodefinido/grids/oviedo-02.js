/* ===================================
   AUTODEFINIDO CARBAYÓN #2
   9 palabras más sobre historia del Real Oviedo. Respuestas y pistas
   facilitadas y confirmadas por el propio mantenedor de la web
   (no todas están en js/quiz.js, se han incorporado tal cual se
   confirmaron). Verificada con generador/validar-autodefinido.js.
   =================================== */

const B = { type: 'blocked' };
const L = (answer) => ({ type: 'letter', answer });
const C = (across, down) => ({ type: 'clue', across: across || null, down: down || null });

export default {
  id: 'oviedo-02',
  title: 'Autodefinido Carbayón #2',
  grid: {
    cols: 11,
    rows: 14,
    cells: [
      [B, B, B, B, B, B, B, B, B, C(null, 'Marcó el primer gol en Primera División'), B],
      [B, B, B, B, B, B, B, C(null, 'Eterno rival del Real Oviedo'), B, L('G'), B],
      [B, B, C('Primer campo donde se disputó un partido', null), L('V'), L('E'), L('T'), L('U'), L('S'), L('T'), L('A'), B],
      [B, B, B, B, B, B, B, L('P'), B, L('L'), B],
      [B, B, C('Marcó el primer gol de la historia del club', null), L('J'), L('U'), L('S'), L('T'), L('O'), B, L('L'), B],
      [B, B, B, C(null, 'Campo usado desde septiembre de 1926'), B, C(null, 'Grupo dueño del Real Oviedo'), B, L('R'), B, L('A'), B],
      [B, C(null, 'Goleador en competición de la UEFA'), B, L('T'), B, L('P'), B, L('T'), B, L('R'), B],
      [C('Estadio inaugurado en 1932', null), L('B'), L('U'), L('E'), L('N'), L('A'), L('V'), L('I'), L('S'), L('T'), L('A')],
      [B, L('A'), B, L('A'), B, L('C'), B, L('N'), B, B, B],
      [B, L('N'), B, L('T'), B, L('H'), B, L('G'), B, B, B],
      [B, L('G'), B, L('I'), B, L('U'), B, B, B, B, B],
      [B, L('O'), B, L('N'), C('Primer fichaje proveniente del Sporting', null), L('C'), L('H'), L('U'), L('S'), B, B],
      [B, B, B, L('O'), B, L('A'), B, B, B, B, B],
      [B, B, B, L('S'), B, B, B, B, B, B, B],
    ],
  },
};
