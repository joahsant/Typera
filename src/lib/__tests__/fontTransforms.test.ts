import { describe, it, expect } from 'vitest';
import * as opentype from 'opentype.js';
import { fontTransforms } from '../fontTransforms';

/**
 * Agent: QA & Performance
 * Validação de integridade matemática das transformações.
 */
describe('fontTransforms', () => {
  const createMockPath = () => {
    const path = new opentype.Path();
    path.moveTo(0, 0);
    path.lineTo(100, 100);
    return path;
  };

  it('deve aplicar slant corretamente usando shear matemático', () => {
    const path = createMockPath();
    const angle = 45; // tan(45) = 1
    fontTransforms.applySlant(path, angle);

    // O ponto (100, 100) deve se tornar (200, 100)
    const lastCmd = path.commands[1] as any;
    expect(lastCmd.x).toBeCloseTo(200);
    expect(lastCmd.y).toBe(100);
  });

  it('deve manter a integridade do path após múltiplas transformações', () => {
    const path = createMockPath();
    fontTransforms.applyWeight(path, 500);
    fontTransforms.applyWidth(path, 50);

    expect(path.commands.length).toBe(2);
    expect(path.commands[0].type).toBe('M');
  });
});
