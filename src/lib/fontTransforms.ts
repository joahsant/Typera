import * as opentype from 'opentype.js';

export const fontTransforms = {
  /**
   * Weight (Espessura)
   * Aumenta a espessura deslocando os pontos para fora.
   */
  applyWeight: (path: opentype.Path, weight: number): opentype.Path => {
    // Multiplicador mais agressivo para visibilidade (0.5 em vez de 0.25)
    const offset = (weight - 400) * 0.6;
    path.commands.forEach((cmd: any) => {
      // Simplificação: Se o ponto está longe da "linha central" do glifo (estimada em 400)
      if ('x' in cmd) cmd.x += cmd.x > 400 ? offset : -offset;
      if ('x1' in cmd) cmd.x1 += cmd.x1 > 400 ? offset : -offset;
      if ('x2' in cmd) cmd.x2 += cmd.x2 > 400 ? offset : -offset;
    });
    return path;
  },

  /**
   * Width (Largura)
   */
  applyWidth: (path: opentype.Path, width: number): opentype.Path => {
    const scaleX = 1 + (width / 100); // 100% de variação
    path.commands.forEach((cmd: any) => {
      if ('x' in cmd) cmd.x *= scaleX;
      if ('x1' in cmd) cmd.x1 *= scaleX;
      if ('x2' in cmd) cmd.x2 *= scaleX;
    });
    return path;
  },

  /**
   * Slant (Inclinação)
   */
  applySlant: (path: opentype.Path, angle: number): opentype.Path => {
    const factor = Math.tan((angle * Math.PI) / 180);
    path.commands.forEach((cmd: any) => {
      // Inclinação clássica: x = x + (y * factor)
      // Nota: em fontes y cresce para cima, mas no canvas para baixo.
      // opentype.js usa coordenadas tipográficas (y positivo para cima).
      if ('x' in cmd) cmd.x += cmd.y * factor;
      if ('x1' in cmd) cmd.x1 += cmd.y1 * factor;
      if ('x2' in cmd) cmd.x2 += cmd.y2 * factor;
    });
    return path;
  },

  /**
   * Contrast (Contraste)
   */
  applyContrast: (path: opentype.Path, contrast: number): opentype.Path => {
    const factor = 1 - (contrast / 100) * 0.8;
    path.commands.forEach((cmd: any) => {
      // Reduz a altura das curvas e linhas horizontais
      if ('y' in cmd) cmd.y *= factor;
      if ('y1' in cmd) cmd.y1 *= factor;
      if ('y2' in cmd) cmd.y2 *= factor;
    });
    return path;
  },

  /**
   * x-Height (Altura das minúsculas)
   */
  applyXHeight: (path: opentype.Path, xHeight: number, isLowercase: boolean): opentype.Path => {
    if (!isLowercase) return path;
    const scaleY = 1 + (xHeight / 100) * 0.5;
    path.commands.forEach((cmd: any) => {
      if ('y' in cmd) cmd.y *= scaleY;
      if ('y1' in cmd) cmd.y1 *= scaleY;
      if ('y2' in cmd) cmd.y2 *= scaleY;
    });
    return path;
  }
};
