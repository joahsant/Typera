import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useFontStore } from '../../stores/fontStore';
import { exportUtils } from '../../lib/exportUtils';
import { fontEngine } from '../../lib/fontEngine';
import { fontTransforms } from '../../lib/fontTransforms';
import { X, Download, FileType } from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ open, onOpenChange }) => {
  const { activeProject } = useFontStore();
  const [formats, setFormats] = useState<string[]>(['ttf', 'woff2']);
  const [isExporting, setIsExporting] = useState(false);

  const toggleFormat = (format: string) => {
    setFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // 1. Carrega e transforma a fonte para o arquivo final
      const font = await fontEngine.loadFont('/fonts/Inter-Regular.ttf');
      const { parameters } = activeProject;

      for (let i = 0; i < font.glyphs.length; i++) {
        const glyph = font.glyphs.get(i);
        if (!glyph.path || !glyph.unicode) continue;
        const isLowercase = glyph.unicode >= 97 && glyph.unicode <= 122;
        fontTransforms.applyWeight(glyph.path, parameters.weight);
        fontTransforms.applyWidth(glyph.path, parameters.width);
        fontTransforms.applySlant(glyph.path, parameters.slant);
        fontTransforms.applyContrast(glyph.path, parameters.contrast);
        fontTransforms.applyXHeight(glyph.path, parameters.xHeight, isLowercase);
      }

      // 2. Renomeia a fonte internamente
      (font.names as any).fontFamily.en = activeProject.name;
      (font.names as any).fullName.en = activeProject.name;

      // 3. Gera o pacote
      const blob = await exportUtils.generatePackage(font, activeProject, formats);
      exportUtils.downloadBlob(blob, `${activeProject.name.replace(/\s+/g, '_')}-Typera.zip`);

      onOpenChange(false);
    } catch (error) {
      console.error('Falha ao exportar:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-base/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface border border-border p-6 rounded-preview shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-display text-primary flex items-center gap-2">
              <Download size={20} className="text-accent" />
              Exportar Fonte
            </Dialog.Title>
            <Dialog.Close className="text-muted hover:text-primary transition-colors">
              <X size={20} />
            </Dialog.Close>
          </div>

          <Dialog.Description className="text-secondary text-sm mb-6">
            Selecione os formatos desejados. O Typera gerará um arquivo ZIP pronto para produção.
          </Dialog.Description>

          <div className="space-y-3 mb-8">
            {[
              { id: 'ttf', label: 'TTF (TrueType)', desc: 'Desktop, Adobe, Microsoft' },
              { id: 'woff2', label: 'WOFF2 (Web)', desc: 'Web moderno, 30% menor' },
            ].map((format) => (
              <label
                key={format.id}
                className="flex items-center gap-4 p-3 rounded border border-border bg-base/50 hover:border-accent/50 cursor-pointer transition-colors group"
              >
                <Checkbox.Root
                  className="w-5 h-5 rounded border-2 border-border flex items-center justify-center data-[state=checked]:bg-accent data-[state=checked]:border-accent transition-colors"
                  checked={formats.includes(format.id)}
                  onCheckedChange={() => toggleFormat(format.id)}
                >
                  <Checkbox.Indicator className="text-preview-text">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <div className="flex-1">
                  <div className="text-sm font-medium text-primary">{format.label}</div>
                  <div className="text-[10px] text-muted uppercase tracking-wider">{format.desc}</div>
                </div>
                <FileType size={18} className="text-border group-hover:text-accent/30 transition-colors" />
              </label>
            ))}
          </div>

          <button
            onClick={handleExport}
            disabled={formats.length === 0 || isExporting}
            className="w-full bg-accent hover:bg-accent-hover disabled:bg-muted disabled:cursor-not-allowed text-preview-text font-bold py-3 rounded transition-all flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>Carregando...</>
            ) : (
              <>
                <Download size={18} />
                Baixar Pacote .zip
              </>
            )}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ExportModal;
