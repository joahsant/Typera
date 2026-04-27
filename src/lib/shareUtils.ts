import LZString from 'lz-string';
import { FontProject } from '../types/font';

export const shareUtils = {
  /**
   * Serializa e comprime o projeto para uma string de URL.
   */
  serializeProject: (project: FontProject): string => {
    const json = JSON.stringify(project);
    return LZString.compressToEncodedURIComponent(json);
  },

  /**
   * Deserializa o projeto a partir de uma string de URL.
   */
  deserializeProject: (data: string): FontProject | null => {
    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(data);
      if (!decompressed) return null;
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Falha ao deserializar projeto compartilhado:', error);
      return null;
    }
  },

  /**
   * Gera o link completo de compartilhamento.
   */
  generateShareLink: (project: FontProject): string => {
    const data = shareUtils.serializeProject(project);
    const baseUrl = window.location.origin;
    return `${baseUrl}/preview?s=${data}`;
  }
};
