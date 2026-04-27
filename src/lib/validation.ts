/**
 * Agent: Security & System Integrity
 * Utilitários de sanitização e validação de contratos.
 */
export const validation = {
  /**
   * Sanitiza nomes de arquivos e strings de UI para evitar XSS e erros de FS.
   */
  sanitizeString: (str: string): string => {
    return str
      .replace(/[<>]/g, '') // Remove tags HTML
      .replace(/[\/\\?%*:|"<>]/g, '-') // Substitui caracteres inválidos de arquivo por '-'
      .trim();
  },

  /**
   * Garante que os parâmetros tipográficos fiquem dentro dos limites técnicos.
   */
  clampParameter: (val: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, val));
  }
};
