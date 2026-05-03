import React from 'react';
import { useFontStore } from '../../../stores/fontStore';
import { useTranslation } from 'react-i18next';
import ParameterSlider from '../ParameterSlider';
import CategorySelector from './CategorySelector';
import { Type, Info, Settings2, Box } from 'lucide-react';

const ControlPanel: React.FC = () => {
  const { t } = useTranslation();
  const {
    previewText,
    setPreviewText,
    activeProject,
    setParameter,
    previewFontSize,
    setPreviewFontSize,
    pushToHistory
  } = useFontStore();

  const handleCommit = () => {
    pushToHistory(activeProject);
  };

  return (
    <aside className="w-full h-full flex flex-col overflow-hidden bg-m3-surface-container relative">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-12 pb-32">
        
        {/* Section: Identity */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-m3-primary/10 flex items-center justify-center text-m3-primary">
               <Info size={16} />
             </div>
             <h2 className="text-[11px] font-black text-m3-primary uppercase tracking-[0.3em]">Identidade</h2>
          </div>

          <div className="space-y-6">
            {/* Family Name */}
            <section className="space-y-3">
              <label className="text-[11px] font-black text-m3-on-surface-variant/50 uppercase tracking-widest ml-1">
                {t('studio.font_name', 'Family Name')}
              </label>
              <input
                type="text"
                value={activeProject.name}
                onChange={(e) => setParameter('name' as any, e.target.value)}
                onBlur={handleCommit}
                className="w-full bg-m3-surface-variant/50 border border-m3-outline/10 rounded-2xl px-5 py-4 text-sm font-bold text-m3-on-surface focus:border-m3-primary focus:ring-4 focus:ring-m3-primary/10 outline-none transition-all"
              />
            </section>

            {/* Category */}
            <section className="space-y-3">
              <label className="text-[11px] font-black text-m3-on-surface-variant/50 uppercase tracking-widest ml-1">
                {t('studio.category', 'Categoria')}
              </label>
              <CategorySelector />
            </section>
          </div>
        </div>

        {/* Section: Preview Control */}
        <div className="space-y-8">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-m3-secondary/10 flex items-center justify-center text-m3-secondary">
               <Type size={16} />
             </div>
             <h2 className="text-[11px] font-black text-m3-secondary uppercase tracking-[0.3em]">Visualização</h2>
          </div>

          <section className="space-y-10">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-m3-on-surface-variant/50 uppercase tracking-widest ml-1">
                {t('studio.preview_text', 'Texto de Preview')}
              </label>
              <textarea
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder={t('studio.preview_placeholder')}
                rows={2}
                className="w-full bg-m3-surface-variant/50 border border-m3-outline/10 rounded-2xl px-5 py-4 text-sm font-bold text-m3-on-surface focus:border-m3-secondary focus:ring-4 focus:ring-m3-secondary/10 outline-none transition-all resize-none"
              />
            </div>

            <ParameterSlider
              label={t('studio.font_size', 'Tamanho')}
              value={previewFontSize}
              min={16}
              max={300}
              onChange={setPreviewFontSize}
              tooltip="Ajusta o tamanho visual do texto no preview."
              minLabel="P"
              maxLabel="G"
            />
          </section>
        </div>

        <div className="h-px bg-m3-outline/5" />

        {/* Section: Architecture */}
        <div className="space-y-10">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-m3-tertiary/10 flex items-center justify-center text-m3-tertiary">
               <Settings2 size={16} />
             </div>
             <h2 className="text-[11px] font-black text-m3-tertiary uppercase tracking-[0.3em]">Arquitetura</h2>
          </div>

          <section className="space-y-12">
            <ParameterSlider
              label={t('studio.weight', 'Espessura')}
              value={activeProject.parameters.weight}
              min={100}
              max={900}
              onChange={(v) => setParameter('weight', v)}
              onCommit={handleCommit}
              tooltip="Controla a espessura das hastes. Thin (100) a Black (900)."
              minLabel="Thin"
              maxLabel="Black"
            />
            <ParameterSlider
              label={t('studio.width', 'Largura')}
              value={activeProject.parameters.width}
              min={-100}
              max={100}
              onChange={(v) => setParameter('width', v)}
              onCommit={handleCommit}
              tooltip="Expande ou comprime horizontalmente todos os glifos."
              minLabel="Cond"
              maxLabel="Exp"
            />
            <ParameterSlider
              label={t('studio.contrast', 'Contraste')}
              value={activeProject.parameters.contrast}
              min={0}
              max={100}
              onChange={(v) => setParameter('contrast', v)}
              onCommit={handleCommit}
              tooltip="Diferença entre hastes finas e grossas."
              minLabel="Mono"
              maxLabel="High"
            />
            <ParameterSlider
              label={t('studio.slant', 'Inclinação')}
              value={activeProject.parameters.slant}
              min={-30}
              max={30}
              onChange={(v) => setParameter('slant', v)}
              onCommit={handleCommit}
              tooltip="Inclina lateralmente os glifos (Oblique/Italic)."
              minLabel="-30°"
              maxLabel="30°"
            />
            <ParameterSlider
              label={t('studio.x_height', 'Altura-X')}
              value={activeProject.parameters.xHeight}
              min={-50}
              max={50}
              onChange={(v) => setParameter('xHeight', v)}
              onCommit={handleCommit}
              tooltip="Altura das letras minúsculas em relação às maiúsculas."
              minLabel="Low"
              maxLabel="High"
            />
            <ParameterSlider
              label={t('studio.tracking', 'Espaçamento')}
              value={activeProject.parameters.tracking}
              min={-100}
              max={200}
              onChange={(v) => setParameter('tracking', v)}
              onCommit={handleCommit}
              tooltip="Espaço entre todos os caracteres."
              minLabel="Tight"
              maxLabel="Loose"
            />
          </section>
        </div>

      </div>

      {/* Commit Status Footer */}
      <div className="absolute bottom-0 right-0 left-0 p-6 bg-m3-surface-container/80 backdrop-blur-md border-t border-m3-outline/5 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-m3-primary animate-pulse" />
            <span className="text-[10px] font-bold text-m3-on-surface-variant uppercase tracking-widest">All changes synced</span>
         </div>
         <Box size={14} className="text-m3-outline/40" />
      </div>
    </aside>
  );
};

export default ControlPanel;
