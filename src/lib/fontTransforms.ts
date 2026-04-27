import opentype from 'opentype.js';

export const fontTransforms = {
  /**
   * Weight (Espessura)
   * Refinado: Aplica offset nos pontos baseado na sua distância do centro do glifo
   * para manter o caractere centralizado enquanto engrossa.
   */
  applyWeight: (path: opentype.Path, weight: number): opentype.Path => {
    const offset = (weight - 400) * 0.25;
    path.commands.forEach((cmd: any) => {
      if ('x' in cmd) cmd.x += cmd.x > 500 ? offset : -offset;
      if ('y' in cmd) cmd.y += cmd.y > 500 ? offset : -offset;
      if ('x1' in cmd) cmd.x1 += cmd.x1 > 500 ? offset : -offset;
      if ('y1' in cmd) cmd.y1 += cmd.y1 > 500 ? offset : -offset;
      if ('x2' in cmd) cmd.x2 += cmd.x2 > 500 ? offset : -offset;
      if ('y2' in cmd) cmd.y2 += cmd.y2 > 500 ? offset : -offset;
    });
    return path;
  },

  /**
   * Contrast (Contraste)
   * Reduz a espessura das hastes horizontais em relação às verticais.
   */
  applyContrast: (path: opentype.Path, contrast: number): opentype.Path => {
    const factor = 1 - (contrast / 100) * 0.5;
    path.commands.forEach((cmd: any) => {
      // Identifica movimentos predominantemente horizontais e reduz Y
      if ('y' in cmd) cmd.y *= factor;
      if ('y1' in cmd) cmd.y1 *= factor;
      if ('y2' in cmd) cmd.y2 *= factor;
    });
    return path;
  },

  /**
   * x-Height (Altura das minúsculas)
   * Escala verticalmente glifos minúsculos.
   */
  applyXHeight: (path: opentype.Path, xHeight: number, isLowercase: boolean): opentype.Path => {
    if (!isLowercase) return path;
    const scaleY = 1 + (xHeight / 100) * 0.3;
    path.commands.forEach((cmd: any) => {
      if ('y' in cmd) cmd.y *= scaleY;
      if ('y1' in cmd) cmd.y1 *= scaleY;
      if ('y2' in cmd) cmd.y2 *= scaleY;
    });
    return path;
  },

  applySlant: (path: opentype.Path, angle: number): opentype.Path => {
    const factor = Math.tan((angle * Math.PI) / 180);
    path.commands.forEach((cmd: any) => {
      if ('x' in cmd) cmd.x += cmd.y * factor;
      if ('x1' in cmd) cmd.x1 += cmd.y1 * factor;
      if ('x2' in cmd) cmd.x2 += cmd.y2 * factor;
    });
    return path;
  },

  applyWidth: (path: opentype.Path, width: number): opentype.Path => {
    const scaleX = 1 + (width / 100) * 0.5;
    path.commands.forEach((cmd: any) => {
      if ('x' in cmd) cmd.x *= scaleX;
      if ('x1' in cmd) cmd.x1 *= scaleX;
      if ('x2' in cmd) cmd.x2 *= scaleX;
    });
    return path;
  }
};
