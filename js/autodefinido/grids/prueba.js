/* Rejilla mínima de prueba (MATA cruzando con AZUL), usada solo para
   verificar que el motor funciona antes de construir la rejilla real. */

const B = { type: 'blocked' };
const L = (answer) => ({ type: 'letter', answer });
const C = (across, down) => ({ type: 'clue', across: across || null, down: down || null });

export default {
  id: 'prueba',
  title: 'Prueba (MATA / AZUL)',
  grid: {
    cols: 5,
    rows: 5,
    cells: [
      [B, B, C(null, 'Color principal de la camiseta del Real Oviedo'), B, B],
      [
        C('Canterano ovetense que ganó la Champions League y el Mundial con España', null),
        L('M'),
        L('A'),
        L('T'),
        L('A'),
      ],
      [B, B, L('Z'), B, B],
      [B, B, L('U'), B, B],
      [B, B, L('L'), B, B],
    ],
  },
};
