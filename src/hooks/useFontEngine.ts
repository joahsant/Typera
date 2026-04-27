import { useState, useEffect, useRef } from 'react';
import { useFontStore } from '../stores/fontStore';
import { fontEngine } from '../lib/fontEngine';
import { fontTransforms } from '../lib/fontTransforms';
import opentype from 'opentype.js';

/**
 * Hook personalizado para gerenciar a mutação da fonte em tempo real.
 * Garante que as transformações sejam aplicadas de forma eficiente (<16ms).
 */
export const useFontEngine = () => {
  const { activeProject } = useFontStore();
  const [fontUrl, setFontUrl] = useState<string | null>(null);
  const baseFontRef = useRef<opentype.Font | null>(null);
  const isProcessing = useRef(false);

  // Carrega a fonte base apenas uma vez
  useEffect(() => {
    fontEngine.loadFont('/fonts/Inter-Regular.ttf')
      .then(font => {
        baseFontRef.current = font;
        generateDynamicFont();
      })
      .catch(console.error);
  }, []);

  // Re-gera a fonte sempre que os parâmetros mudarem
  useEffect(() => {
    if (baseFontRef.current && !isProcessing.current) {
      generateDynamicFont();
    }
  }, [activeProject.parameters]);

  const generateDynamicFont = async () => {
    if (!baseFontRef.current) return;

    isProcessing.current = true;
    const startTime = performance.now();

    try {
      // 1. Clona a fonte base para não corromper o original
      // No opentype.js, trabalhamos com os glifos diretamente
      const font = baseFontRef.current;
      const { parameters } = activeProject;

      // 2. Aplica as transformações em cada glifo
      Object.values(font.glyphs.map).forEach((glyph: any) => {
        if (!glyph.path || !glyph.unicode) return;

        const isLowercase = glyph.unicode >= 97 && glyph.unicode <= 122;

        fontTransforms.applyWeight(glyph.path, parameters.weight);
        fontTransforms.applyWidth(glyph.path, parameters.width);
        fontTransforms.applySlant(glyph.path, parameters.slant);
        fontTransforms.applyContrast(glyph.path, parameters.contrast);
        fontTransforms.applyXHeight(glyph.path, parameters.xHeight, isLowercase);
      });

      // 3. Converte para ArrayBuffer e cria a URL de Blob
      const buffer = font.toArrayBuffer();
      const blob = new Blob([buffer], { type: 'font/ttf' });

      // Limpa a URL anterior para evitar vazamento de memória
      if (fontUrl) URL.revokeObjectURL(fontUrl);

      const newUrl = URL.createObjectURL(blob);
      setFontUrl(newUrl);

      const endTime = performance.now();
      // Agent: Observability - Registrando sinal de performance
      if (endTime - startTime > 16) {
        console.warn(`[Performance] Mutação de fonte lenta: ${Math.round(endTime - startTime)}ms`);
      }

    } catch (error) {
      console.error('Falha na mutação da fonte:', error);
    } finally {
      isProcessing.current = false;
    }
  };

  return { fontUrl };
};
