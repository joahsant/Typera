/**
 * @module fontEngine
 * @description Low-level font I/O utilities (load from URL, convert to buffer).
 * Used by ExportModal and any future tool that needs a one-shot font load.
 *
 * NOTE: The live preview pipeline uses useFontEngine (hook) which manages its
 * own buffer internally for performance. This module is for explicit, one-time loads.
 *
 * @status ACTIVE – used by ExportModal
 */

import * as opentype from 'opentype.js';

export const fontEngine = {
  /**
   * Loads a font from a URL and returns an opentype.Font instance.
   * Prefer `fetch + opentype.parse` for ArrayBuffer control; this is a convenience wrapper.
   */
  loadFont: async (url: string): Promise<opentype.Font> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching font from ${url}`);
    const buffer = await res.arrayBuffer();
    return opentype.parse(buffer);
  },

  /** Converts a font object back to a raw ArrayBuffer (for export). */
  fontToBuffer: (font: opentype.Font): ArrayBuffer => font.toArrayBuffer(),
};
