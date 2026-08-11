/* ===================================
   AUTODEFINIDO CARBAYÓN #1
   10 palabras sobre historia y leyendas del Real Oviedo. Construida a
   mano y verificada con generador/validar-autodefinido.js: cada letra
   pertenece a una palabra horizontal Y una vertical, y cada pista está
   sacada de js/quiz.js (los mismos datos ya usados en el Quiz
   Carbayón), para no introducir hechos históricos nuevos sin
   contrastar.
   =================================== */

const B = { type: 'blocked' };
const L = (answer) => ({ type: 'letter', answer });
const C = (across, down) => ({ type: 'clue', across: across || null, down: down || null });

export default {
  id: 'oviedo-01',
  title: 'Autodefinido Carbayón #1',
  grid: {
    cols: 11,
    rows: 12,
    cells: [
      [B, B, B, B, C(null, 'Entrenador del ascenso a Segunda en Cádiz (2015)'), B, B, B, B, B, B],
      [B, B, C('Campo que usó el Oviedo antes del estadio de Buenavista', null), L('T'), L('E'), L('A'), L('T'), L('I'), L('N'), L('O'), L('S')],
      [B, C(null, 'Récord de partidos oficiales con la camiseta azul (512)'), B, B, L('G'), B, B, B, B, B, B],
      [B, L('B'), B, C(null, 'Gentilicio con el que se conoce a la afición ovetense'), L('E'), B, B, B, B, B, B],
      [B, L('E'), C('Volvió al club en 2023 cobrando el salario mínimo', null), L('C'), L('A'), L('Z'), L('O'), L('R'), L('L'), L('A'), B],
      [B, L('R'), B, L('A'), B, B, B, B, B, B, C(null, 'Segundo máximo goleador histórico; dorsal 10')],
      [C('Apellido del primer presidente del club; da nombre al estadio', null), L('T'), L('A'), L('R'), L('T'), L('I'), L('E'), L('R'), L('E'), B, L('C')],
      [B, L('O'), B, L('B'), B, B, B, C(null, 'Canterano ovetense que ganó la Champions League y el Mundial'), B, B, L('A')],
      [B, B, B, L('A'), B, B, B, L('M'), B, B, L('R')],
      [B, B, B, L('Y'), B, B, C('Color principal de la camiseta del Real Oviedo', null), L('A'), L('Z'), L('U'), L('L')],
      [B, B, B, L('O'), B, B, B, L('T'), B, B, L('O')],
      [C('Máximo goleador histórico del club, con 257 goles', null), L('L'), L('A'), L('N'), L('G'), L('A'), L('R'), L('A'), B, B, L('S')],
    ],
  },
};
