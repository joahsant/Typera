import { useState, useEffect, useRef } from 'react';
import { useFontStore } from '../stores/fontStore';
import { fontTransforms } from '../lib/fontTransforms';
import * as opentype from 'opentype.js';

export const useFontEngine = () => {
  const { activeProject } = useFontStore();
  const [fontUrl, setFontUrl] = useState<string | null>(null);
  const baseBufferRef = useRef<ArrayBuffer | null>(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    fetch('/fonts/Inter-Regular.ttf')
      .then(res => res.arrayBuffer())
      .then(buffer => {
        baseBufferRef.current = buffer;
        mutate();
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (baseBufferRef.current) mutate();
  }, [activeProject.parameters]);

  const mutate = async () => {
    if (!baseBufferRef.current || isProcessing.current) return;
    isProcessing.current = true;
    try {
      const font = opentype.parse(baseBufferRef.current.slice(0));
      const { parameters } = activeProject;

      for (let i = 0; i < font.glyphs.length; i++) {
        const glyph = font.glyphs.get(i);
        if (!glyph.path || !glyph.unicode) continue;
        const isLower = glyph.unicode >= 97 && glyph.unicode <= 122;
        fontTransforms.applyWeight(glyph.path, parameters.weight);
        fontTransforms.applyWidth(glyph.path, parameters.width);
        fontTransforms.applySlant(glyph.path, parameters.slant);
        fontTransforms.applyContrast(glyph.path, parameters.contrast);
        fontTransforms.applyXHeight(glyph.path, parameters.xHeight, isLower);
      }

      const blob = new Blob([font.toArrayBuffer()], { type: 'font/ttf' });
      if (fontUrl) URL.revokeObjectURL(fontUrl);
      setFontUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    } finally {
      isProcessing.current = false;
    }
  };

  return { fontUrl };
};
