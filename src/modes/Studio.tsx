import React, { useEffect, useState } from 'react';
import { useFontStore } from '../stores/fontStore';
import ControlPanel from '../components/studio/ControlPanel/ControlPanel';
import { useTranslation } from 'react-i18next';
import { useFontEngine } from '../hooks/useFontEngine';
import ExportModal from '../components/export/ExportModal';
import LibraryModal from '../components/library/LibraryModal';
import { useAutosave } from '../hooks/useAutosave';
import { shareUtils } from '../lib/shareUtils';

const Studio: React.FC = () => {
  const { t } = useTranslation();
  const { previewText, activeProject, undo, redo, previewFontSize } = useFontStore();
  const { fontUrl } = useFontEngine();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Ativa o autosave automático
  useAutosave();

  // Aplica a fonte dinâmica via style tag
  useEffect(() => {
    if (!fontUrl) return;

    const styleId = 'dynamic-typera-font';
    let style = document.getElementById(styleId) as HTMLStyleElement;

    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.innerHTML = `
      @font-face {
        font-family: 'TyperaDynamic';
        src: url('${fontUrl}') format('truetype');
        font-display: block;
      }
    `;
  }, [fontUrl]);

  const handleShare = () => {
    const link = shareUtils.generateShareLink(activeProject);
    navigator.clipboard.writeText(link);
    alert('Link de compartilhamento copiado para o clipboard!');
  };

  const handleView = () => {
    const data = shareUtils.serializeProject(activeProject);
    window.open(`/preview?s=${data}`, '_blank');
  };

  return (
    <div className={`flex flex-col h-full bg-base transition-colors duration-300`}>
      {/* Header Fixo */}
      <header className="h-header border-b border-border bg-surface flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-preview-text font-bold text-xs">
            J
          </div>
          <h1 className="font-display text-xl text-accent tracking-tighter">TYPERA</h1>

          {/* Undo/Redo integrados no Header ao lado do Perfil */}
          <div className="flex gap-1 bg-base/50 rounded-lg p-1 ml-2 border border-border/50">
            <button
              onClick={undo}
              title="Undo (Ctrl+Z)"
              className="p-1 hover:bg-hover rounded text-secondary transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-15 9 9 0 0 0-9 15c1.65 1.66 3.7 2.7 5.93 3"/></svg>
            </button>
            <button
              onClick={redo}
              title="Redo (Ctrl+Y)"
              className="p-1 hover:bg-hover rounded text-secondary transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-15 9 9 0 0 1 9 15c-1.65 1.66-3.7 2.7-5.93 3"/></svg>
            </button>
          </div>
        </div>

        <nav className="flex gap-6">
          <button className="text-sm font-medium border-b-2 border-accent py-4">{t('modes.studio')}</button>
          <button className="text-sm font-medium text-secondary py-4 opacity-50 cursor-not-allowed">{t('modes.forge')}</button>
          <button className="text-sm font-medium text-secondary py-4 opacity-50 cursor-not-allowed">{t('modes.academy')}</button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-muted font-mono uppercase tracking-tighter leading-none mb-1">Projeto Ativo</span>
            <span className="text-xs text-primary font-medium leading-none truncate max-w-[100px]">{activeProject.name}</span>
          </div>
          <button
            onClick={() => setIsLibraryOpen(true)}
            className="w-8 h-8 rounded bg-elevated border border-border flex items-center justify-center hover:border-accent transition-colors group"
          >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:text-accent transition-colors"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/></svg>
          </button>
        </div>
      </header>

      {/* Body Layout 75/25 */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lado Esquerdo (75%) - Workspace */}
        <section className="w-[75%] h-full p-4 flex flex-col relative bg-base">
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-preview-bg rounded-preview shadow-preview p-12 w-full h-[80%] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300">
               <span className="absolute top-8 left-10 text-[10px] font-mono text-muted/30 uppercase tracking-widest">Studio Preview</span>

               <div className="w-full text-center">
                  <p
                    className="text-preview-text leading-tight break-words outline-none transition-all duration-75"
                    style={{
                      fontSize: `${previewFontSize}px`,
                      fontFamily: fontUrl ? 'TyperaDynamic' : 'sans-serif'
                    }}
                  >
                    {previewText || 'Aa'}
                  </p>
               </div>

               <div className="mt-12 w-full max-w-2xl border-t border-border/10 pt-8 flex justify-center flex-wrap gap-2 opacity-40">
                  <span className="text-preview-text/60 text-sm font-mono tracking-widest">
                    ABCDEFGHIJKLM NOPQRSTUVWXYZ 0123456789
                  </span>
               </div>
            </div>
          </div>

          {/* Footer de Ações (Fixo 75%) */}
          <footer className="h-footer absolute bottom-0 left-0 w-full bg-surface border-t border-border flex items-center justify-around px-8">
             <button
              onClick={handleView}
              className="flex items-center gap-2 text-xs font-medium hover:text-accent transition-colors group"
             >
               <span className="group-hover:scale-110 transition-transform">👁</span> Visualizar
             </button>
             <button
              onClick={handleShare}
              className="flex items-center gap-2 text-xs font-medium hover:text-accent transition-colors group"
             >
               <span className="group-hover:scale-110 transition-transform">↗</span> Compartilhar
             </button>
             <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-2 text-xs font-medium hover:text-accent transition-colors group"
             >
               <span className="group-hover:scale-110 transition-transform">⬇</span> Exportar
             </button>
          </footer>

          <ExportModal open={isExportOpen} onOpenChange={setIsExportOpen} />
          <LibraryModal open={isLibraryOpen} onOpenChange={setIsLibraryOpen} />
        </section>

        {/* Lado Direito (25%) - Painel de Controle */}
        <section className="w-[25%] h-full">
          <ControlPanel />
        </section>
      </div>
    </div>
  );
};

export default Studio;
