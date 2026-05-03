import React from 'react';
import { useFontStore } from '../../../stores/fontStore';
import ParameterSlider from '../ParameterSlider';
import CategorySelector from './CategorySelector';

const ControlPanel: React.FC = () => {
  const { previewText, setPreviewText, activeProject, setParameter, previewFontSize, setPreviewFontSize, pushToHistory } = useFontStore();
  const handleCommit = () => pushToHistory(activeProject);

  return (
    <div className="p-8 space-y-12">
      <section className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Identidade</label>
          <input
            type="text"
            value={activeProject.name}
            onChange={(e) => setParameter('name' as any, e.target.value)}
            onBlur={handleCommit}
            className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-accent transition-all"
          />
        </div>
        <CategorySelector />
      </section>

      <section className="space-y-6">
        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Visualização</label>
        <div className="space-y-4">
          <textarea
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-accent h-32 resize-none transition-all"
            placeholder="Digite algo..."
          />
          <ParameterSlider label="Tamanho" value={previewFontSize} min={16} max={300} onChange={setPreviewFontSize} tooltip="Visual size"/>
        </div>
      </section>

      <div className="h-px bg-[var(--border)]" />

      <section className="space-y-10 pb-20">
        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em]">Arquitetura</label>
        <div className="space-y-10">
          <ParameterSlider label="Espessura" value={activeProject.parameters.weight} min={100} max={900} onChange={(v) => setParameter('weight', v)} onCommit={handleCommit} tooltip="Weight"/>
          <ParameterSlider label="Largura" value={activeProject.parameters.width} min={-100} max={100} onChange={(v) => setParameter('width', v)} onCommit={handleCommit} tooltip="Width"/>
          <ParameterSlider label="Inclinação" value={activeProject.parameters.slant} min={-30} max={30} onChange={(v) => setParameter('slant', v)} onCommit={handleCommit} tooltip="Slant"/>
          <ParameterSlider label="Contraste" value={activeProject.parameters.contrast} min={0} max={100} onChange={(v) => setParameter('contrast', v)} onCommit={handleCommit} tooltip="Contrast"/>
          <ParameterSlider label="Altura-X" value={activeProject.parameters.xHeight} min={-50} max={50} onChange={(v) => setParameter('xHeight', v)} onCommit={handleCommit} tooltip="x-Height"/>
        </div>
      </section>
    </div>
  );
};

export default ControlPanel;
