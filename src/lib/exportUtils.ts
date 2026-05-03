/**
 * @module exportUtils
 * @description Utilities for packaging and downloading font exports.
 * Generates ZIP bundles with TTF/WOFF2 + README.
 */

import JSZip from 'jszip';
import * as opentype from 'opentype.js';
// @ts-ignore – wawoff2 has no type declarations
import { compress } from 'wawoff2';
import { FontProject } from '../types/font';

export const exportUtils = {
  /**
   * Generates a ZIP blob containing the font in all requested formats + README.
   * @param font      Mutated opentype.Font object
   * @param project   Active FontProject (for metadata)
   * @param formats   Array of format ids: 'ttf' | 'woff2'
   */
  generatePackage: async (
    font: opentype.Font,
    project: FontProject,
    formats: string[]
  ): Promise<Blob> => {
    const zip       = new JSZip();
    const safeName  = project.name.replace(/[/\\?%*:|"<>]/g, '-');
    const folder    = zip.folder(`${safeName}-Typera`)!;
    const ttfBuffer = font.toArrayBuffer();

    if (formats.includes('ttf')) {
      folder.file(`${safeName}.ttf`, ttfBuffer);
    }

    if (formats.includes('woff2')) {
      try {
        const woff2 = await compress(new Uint8Array(ttfBuffer));
        folder.file(`${safeName}.woff2`, woff2);
      } catch (e) {
        console.warn('[exportUtils] WOFF2 compression failed, skipping:', e);
      }
    }

    const readme = `
# ${project.name}
Gerado via Typera — "To type, for type, you type."
Data: ${new Date().toLocaleDateString('pt-BR')}

## Parâmetros
${Object.entries(project.parameters).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

## Instalação
- Windows / macOS: clique duas vezes no .ttf
- Web: use o .woff2 via @font-face
    `.trim();

    folder.file('README.txt', readme);

    return zip.generateAsync({ type: 'blob' });
  },

  /**
   * Triggers a browser file download for the given Blob.
   * Uses a temporary <a> element safely cleaned up after click.
   */
  downloadBlob: (blob: Blob, filename: string): void => {
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    // Wait one tick so the browser registers the click before cleanup
    setTimeout(() => {
      if (link.parentNode) link.parentNode.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  },
};
