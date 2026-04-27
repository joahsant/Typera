import { describe, it, expect } from 'vitest';
import opentype from 'opentype.js';
import { fontTransforms } from '../fontTransforms';

/**
 * Agent: QA & Performance
 * Testes de stress e latência da engine.
 */
describe('Performance & Stress', () => {
  it('deve processar um glifo complexo em menos de 1ms', () => {
    const path = new opentype.Path();
    // Simula glifo com muitos pontos
    for (let i = 0; i < 500; i++) {
      path.lineTo(Math.random() * 1000, Math.random() * 1000);
    }

    const start = performance.now();
    fontTransforms.applyWeight(path, 900);
    fontTransforms.applyWidth(path, 100);
    fontTransforms.applySlant(path, 30);
    const end = performance.now();

    expect(end - start).toBeLessThan(1);
  });

  it('não deve causar overflow numérico em parâmetros extremos', () => {
    const path = new opentype.Path();
    path.moveTo(0, 0);
    path.lineTo(10, 10);

    // Testa limites dos sliders
    fontTransforms.applyWeight(path, 900);
    fontTransforms.applyWidth(path, 100);
    fontTransforms.applyContrast(path, 100);
    fontTransforms.applyXHeight(path, 50, true);

    path.commands.forEach((cmd: any) => {
      if ('x' in cmd) expect(Number.isFinite(cmd.x)).toBe(true);
      if ('y' in cmd) expect(Number.isFinite(cmd.y)).toBe(true);
    });
  });
});
