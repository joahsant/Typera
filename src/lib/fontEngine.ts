import opentype from 'opentype.js';

/**
 * Engine responsável pelo carregamento e gerenciamento binário de fontes.
 */
export const fontEngine = {
  /**
   * Carrega uma fonte a partir de uma URL ou caminho local.
   */
  loadFont: async (url: string): Promise<opentype.Font> => {
    return new Promise((resolve, reject) => {
      opentype.load(url, (err, font) => {
        if (err) {
          console.error('Erro ao carregar fonte:', err);
          reject(err);
        } else if (font) {
          resolve(font);
        }
      });
    });
  },

  /**
   * Converte o objeto font de volta para um ArrayBuffer (para exportação).
   */
  fontToBuffer: (font: opentype.Font): ArrayBuffer => {
    return font.toArrayBuffer();
  }
};
