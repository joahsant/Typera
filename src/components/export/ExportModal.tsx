/**
 * @module ExportModal
 * @description Modal para exportar a fonte mutada nos formatos TTF e WOFF2.
 */

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useFontStore } from '../../stores/fontStore';
import { exportUtils } from '../../lib/exportUtils';
import { fontTransforms } from '../../lib/fontTransforms';
import { X, Download, FileType, Check } from 'lucide-react';
import { clsx } from 'clsx';
import * as opentype from 'opentype.js';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORMAT_OPTIONS = [
  { id: 'ttf',   label: 'TTF (TrueType)',  desc: 'Desktop & Adobe Ready' },
  { id: 'woff2', label: 'WOFF2 (Web)',      desc: 'Web moderno (otimizado)' },
];

const ExportModal: React.FC<ExportModalProps> = ({ open, onOpenChange }) => {
  const { activeProject } = useFontStore();
  const [formats, setFormats]       = useState<string[]>(['ttf', 'woff2']);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const toggleFormat = (format: string) =>
    setFormats(prev => prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]);

  const handleExport = async () => {
    if (formats.length === 0) return;
    setIsExporting(true);
    setExportError(null);

    try {
      // Fetch the same base font, apply current parameters, then package
      const res = await fetch('/fonts/Inter-Regular.ttf');
      if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar fonte base`);
      const buffer = await res.arrayBuffer();

      const font = opentype.parse(buffer);
      const { parameters } = activeProject;

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

      (font.names as any).fontFamily.en = activeProject.name;
      (font.names as any).fullName.en   = activeProject.name;

      const blob     = await exportUtils.generatePackage(font, activeProject, formats);
      const filename = `${activeProject.name.replace(/\s+/g, '_')}-Typera.zip`;
      exportUtils.downloadBlob(blob, filename);
      onOpenChange(false);

    } catch (err: any) {
      console.error('[ExportModal] Export failed:', err);
      setExportError(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border)] p-8 rounded-[32px] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-300">

          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-bold tracking-tighter flex items-center gap-3">
              <Download size={22} className="text-accent" /> Exportar
            </Dialog.Title>
            <Dialog.Close className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1">
              <X size={22} />
            </Dialog.Close>
          </div>

          <Dialog.Description className="text-[var(--text-secondary)] text-sm mb-8">
            Selecione os formatos. O Typera gera um pacote <strong>.zip</strong> pronto para uso.
          </Dialog.Description>

          <div className="space-y-3 mb-8">
            {FORMAT_OPTIONS.map(fmt => (
              <label
                key={fmt.id}
                className={clsx(
                  'flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer',
                  formats.includes(fmt.id)
                    ? 'border-accent bg-accent/5'
                    : 'border-[var(--border)] hover:border-accent/30'
                )}
              >
                <Checkbox.Root
                  className="w-5 h-5 rounded border-2 border-[var(--border)] flex items-center justify-center data-[state=checked]:bg-accent data-[state=checked]:border-accent transition-all"
                  checked={formats.includes(fmt.id)}
                  onCheckedChange={() => toggleFormat(fmt.id)}
                >
                  <Checkbox.Indicator className="text-white">
                    <Check size={13} strokeWidth={4} />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <div className="flex-1">
                  <p className="text-sm font-bold">{fmt.label}</p>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">{fmt.desc}</p>
                </div>
                <FileType size={18} className="text-[var(--border)]" />
              </label>
            ))}
          </div>

          {exportError && <p className="text-red-500 text-xs mb-4">{exportError}</p>}

          <button
            onClick={handleExport}
            disabled={formats.length === 0 || isExporting}
            className="w-full bg-accent disabled:opacity-40 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            {isExporting ? 'Gerando...' : 'Baixar Pacote .zip'}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ExportModal;
