import JSZip from 'jszip';
import opentype from 'opentype.js';
// @ts-ignore
import { compress } from 'wawoff2';
import { FontProject } from '../types/font';

export const exportUtils = {
  /**
   * Gera um pacote ZIP contendo a fonte em múltiplos formatos.
   */
  generatePackage: async (font: opentype.Font, project: FontProject, formats: string[]): Promise<Blob> => {
    const zip = new JSZip();
    const folder = zip.folder(`${project.name}-Typera`);

    // 1. Gerar TTF (Base)
    const ttfBuffer = font.toArrayBuffer();
    const safeName = project.name.replace(/[\/\\?%*:|"<>]/g, '-');

    if (formats.includes('ttf')) {
      folder?.file(`${safeName}.ttf`, ttfBuffer);
    }

    // 2. Gerar WOFF2 (Via WASM)
    if (formats.includes('woff2')) {
      try {
        const uint8Array = new Uint8Array(ttfBuffer);
        const woff2Buffer = await compress(uint8Array);
        folder?.file(`${safeName}.woff2`, woff2Buffer);
      } catch (e) {
        console.error('Erro ao gerar WOFF2:', e);
      }
    }

    // 3. Adicionar README.txt (Documentação de Qualidade)
    const readmeContent = `
# ${project.name}
Gerada via Typera — "To type, for type, you type."

## Detalhes da Fonte
- Nome: ${project.name}
- Categoria: ${project.category}
- Designer: ${project.metadata.designer}
- Licença: ${project.metadata.license}
- Data de Criação: ${new Date().toLocaleDateString()}

## Parâmetros Utilizados
${Object.entries(project.parameters).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

---
Instruções:
- Windows/macOS: Clique duas vezes no arquivo .ttf para instalar.
- Web: Use o formato .woff2 para melhor performance.
    `;

    folder?.file('README.txt', readmeContent);

    return await zip.generateAsync({ type: 'blob' });
  },

  /**
   * Dispara o download no browser.
   */
  downloadBlob: (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
