import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useFontStore } from '../../stores/fontStore';
import { exportUtils } from '../../lib/exportUtils';
import { fontEngine } from '../../lib/fontEngine';
import { fontTransforms } from '../../lib/fontTransforms';
import { X, Download, FileType, Check } from 'lucide-react';
import { clsx } from 'clsx';

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

      (font.names as any).fontFamily.en = activeProject.name;
      (font.names as any).fullName.en = activeProject.name;

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
        <Dialog.Overlay className="fixed inset-0 bg-m3-surface/80 backdrop-blur-xl z-50 animate-in fade-in duration-500" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-m3-surface-container border border-m3-outline/10 p-8 rounded-[40px] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-8">
            <Dialog.Title className="text-2xl font-display font-black text-m3-primary tracking-tighter flex items-center gap-3">
              <Download size={24} />
              Exportar
            </Dialog.Title>
            <Dialog.Close className="text-m3-on-surface-variant/40 hover:text-m3-primary transition-colors">
              <X size={24} />
            </Dialog.Close>
          </div>

          <Dialog.Description className="text-m3-on-surface-variant text-sm font-medium leading-relaxed mb-8">
            Selecione os formatos desejados. O Typera gerará um pacote ZIP profissional pronto para uso.
          </Dialog.Description>

          <div className="space-y-4 mb-10">
            {[
              { id: 'ttf', label: 'TTF (TrueType)', desc: 'Desktop & Adobe Ready' },
              { id: 'woff2', label: 'WOFF2 (Web)', desc: 'Web Moderno (Otimizado)' },
            ].map((format) => (
              <label
                key={format.id}
                className={clsx(
                  "flex items-center gap-5 p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer group",
                  formats.includes(format.id) ? "border-m3-primary bg-m3-primary/5" : "border-m3-outline/5 bg-m3-surface-variant/20 hover:border-m3-primary/20"
                )}
              >
                <Checkbox.Root
                  className="w-6 h-6 rounded-lg border-2 border-m3-outline/20 flex items-center justify-center data-[state=checked]:bg-m3-primary data-[state=checked]:border-m3-primary transition-all duration-300"
                  checked={formats.includes(format.id)}
                  onCheckedChange={() => toggleFormat(format.id)}
                >
                  <Checkbox.Indicator className="text-m3-on-primary">
                    <Check size={16} strokeWidth={4} />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <div className="flex-1">
                  <div className="text-sm font-black text-m3-on-surface uppercase tracking-wider">{format.label}</div>
                  <div className="text-[10px] text-m3-on-surface-variant/50 font-bold uppercase tracking-[0.2em] mt-1">{format.desc}</div>
                </div>
                <FileType size={20} className={clsx("transition-colors duration-300", formats.includes(format.id) ? "text-m3-primary" : "text-m3-outline/20")} />
              </label>
            ))}
          </div>

          <button
            onClick={handleExport}
            disabled={formats.length === 0 || isExporting}
            className="w-full bg-m3-primary hover:shadow-2xl hover:shadow-m3-primary/30 disabled:bg-m3-surface-variant disabled:text-m3-on-surface-variant/30 disabled:cursor-not-allowed text-m3-on-primary font-black uppercase tracking-widest py-5 rounded-[24px] transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            {isExporting ? (
              <span className="animate-pulse">Processando...</span>
            ) : (
              <>
                <Download size={20} />
                Gerar Pacote .zip
              </>
            )}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ExportModal;
