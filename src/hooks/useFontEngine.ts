/**
 * @module useFontEngine
 * @description React hook – loads Inter-Regular as a base buffer, then re-mutates
 * it whenever activeProject.parameters change. Returns a blob URL pointing to the
 * freshly generated font so the preview <p> can consume it via font-family.
 *
 * Flow: mount → fetch base TTF → parse → applyTransforms → toArrayBuffer → blobUrl
 * On each parameter change the previous blob is revoked to avoid memory leaks.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import * as opentype from 'opentype.js';
import { useFontStore } from '../stores/fontStore';
import { fontTransforms } from '../lib/fontTransforms';

// Vite resolves this to the hashed asset URL at build time
import interFontUrl from '../assets/fonts/Inter-Regular.ttf?url';

export const useFontEngine = () => {
  const { activeProject } = useFontStore();

  const [fontUrl, setFontUrl]     = useState<string | null>(null);
  const [isLoaded, setIsLoaded]   = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // Refs so callbacks always read the latest value without being listed as deps
  const baseBufferRef   = useRef<ArrayBuffer | null>(null);
  const currentUrlRef   = useRef<string | null>(null);   // tracks the live blob URL for revocation
  const isProcessingRef = useRef(false);
  const pendingRef      = useRef(false);

  // ── Load base font once ────────────────────────────────────────────────────
  useEffect(() => {
    fetch(interFontUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status} fetching base font`);
        return res.arrayBuffer();
      })
      .then(buffer => {
        if (buffer.byteLength < 1000) throw new Error('Base font buffer too small – file may be corrupt');
        baseBufferRef.current = buffer;
        setIsLoaded(true);
      })
      .catch(err => {
        console.error('[useFontEngine] Failed to load base font:', err);
        setError(err.message);
      });
  }, []); // runs once

  // ── Mutation function ──────────────────────────────────────────────────────
  const mutateFont = useCallback(async () => {
    if (!baseBufferRef.current) return;

    isProcessingRef.current = true;
    pendingRef.current      = false;

    try {
      // slice(0) copies the buffer so opentype doesn't mutate the original
      const font = opentype.parse(baseBufferRef.current.slice(0));
      const { parameters } = activeProject;

      // Give each generated font a unique name to bust browser font-cache
      const fontName = `TyperaFont-${Date.now()}`;
      (font.names as any).fontFamily.en   = fontName;
      (font.names as any).fullName.en     = fontName;

      // Apply parametric transforms glyph-by-glyph
      for (let i = 0; i < font.glyphs.length; i++) {
        const glyph = font.glyphs.get(i);
        if (!glyph?.path || !glyph.unicode) continue;

        const isLower = glyph.unicode >= 97 && glyph.unicode <= 122;

        fontTransforms.applyWeight(glyph.path, parameters.weight);
        fontTransforms.applyWidth(glyph.path, parameters.width);
        fontTransforms.applySlant(glyph.path, parameters.slant);
        fontTransforms.applyContrast(glyph.path, parameters.contrast);
        fontTransforms.applyXHeight(glyph.path, parameters.xHeight, isLower);
      }

      const blob   = new Blob([font.toArrayBuffer()], { type: 'font/ttf' });
      const newUrl = URL.createObjectURL(blob);

      // Revoke previous blob to avoid memory leaks
      if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = newUrl;

      setFontUrl(newUrl);
      setError(null);

    } catch (err: any) {
      console.error('[useFontEngine] Mutation failed:', err);
      setError(err.message);
    } finally {
      isProcessingRef.current = false;
      // If a new request came in while we were busy, process it now
      if (pendingRef.current) mutateFont();
    }
  }, [activeProject]); // recreated when activeProject identity changes

  // ── Re-mutate whenever parameters change ─────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    if (isProcessingRef.current) {
      // Don't stack mutations; just flag that we need one more pass
      pendingRef.current = true;
    } else {
      mutateFont();
    }
  }, [isLoaded, mutateFont]);

  // ── Cleanup blob on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (currentUrlRef.current) URL.revokeObjectURL(currentUrlRef.current);
    };
  }, []);

  return { fontUrl, isLoaded, error };
};
