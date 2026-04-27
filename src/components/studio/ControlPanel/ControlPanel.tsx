import React from 'react';
import { useFontStore } from '../../../stores/fontStore';
import { useTranslation } from 'react-i18next';
import ParameterSlider from '../ParameterSlider';
import CategorySelector from './CategorySelector';

const ControlPanel: React.FC = () => {
  const { t } = useTranslation();
  const {
    previewText,
    setPreviewText,
    activeProject,
    setParameter,
    previewFontSize,
    setPreviewFontSize
  } = useFontStore();

  return (
    <aside className="w-full h-full bg-surface border-l border-border flex flex-col overflow-y-auto custom-scrollbar">
      <div className="p-5 space-y-8 pb-10">

        {/* 1. Nome da Fonte */}
        <section className="space-y-2">
          <label className="text-xs font-display text-secondary uppercase tracking-wider">
            {t('studio.font_name', 'Nome da Família')}
          </label>
          <input
            type="text"
            value={activeProject.name}
            onChange={(e) => setParameter('name' as any, e.target.value)}
            className="w-full bg-base border border-border rounded px-3 py-2 text-primary focus:border-accent outline-none transition-colors font-ui"
          />
        </section>

        {/* 2. Categoria */}
        <section className="space-y-3">
          <label className="text-xs font-display text-secondary uppercase tracking-wider">
            {t('studio.category', 'Categoria')}
          </label>
          <CategorySelector />
        </section>

        {/* 3. Preview & Size */}
        <section className="space-y-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-display text-secondary uppercase tracking-wider">
              {t('studio.preview_text', 'Texto de Preview')}
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder={t('studio.preview_placeholder')}
              className="w-full bg-base border border-border rounded px-3 py-2 text-primary focus:border-accent outline-none transition-colors"
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

        <div className="h-px bg-border my-2" />
        <h3 className="text-[10px] font-display text-muted uppercase tracking-[0.2em] text-center">Personalização</h3>

        {/* 4. Sliders de Parâmetros Tipográficos */}
        <section className="space-y-8">
          <ParameterSlider
            label={t('studio.weight', 'Espessura')}
            value={activeProject.parameters.weight}
            min={100}
            max={900}
            onChange={(v) => setParameter('weight', v)}
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
            tooltip="Espaço entre todos os caracteres."
            minLabel="Tight"
            maxLabel="Loose"
          />
        </section>

      </div>
    </aside>
  );
};

export default ControlPanel;
