import React, { useEffect, useState } from 'react';
import { useFontStore } from '../stores/fontStore';
import ControlPanel from '../components/studio/ControlPanel/ControlPanel';
import { useTranslation } from 'react-i18next';
import { useFontEngine } from '../hooks/useFontEngine';
import ExportModal from '../components/export/ExportModal';
import LibraryModal from '../components/library/LibraryModal';
import { useAutosave } from '../hooks/useAutosave';
import { shareUtils } from '../lib/shareUtils';
import { Sun, Moon, Undo2, Redo2, LayoutGrid, Share2, Eye, Download, Play } from 'lucide-react';

const Studio: React.FC = () => {
  const { t } = useTranslation();
  const { previewText, activeProject, undo, redo, previewFontSize, theme, setTheme } = useFontStore();
  const { fontUrl } = useFontEngine();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  useEffect(() => {
    // Sincronização de tema centralizada no store
  }, [theme]);

  useAutosave();

  // A aplicação da fonte agora é feita via JSX para evitar manipulação manual do DOM
  // que pode causar erros de Reconciliação (removeChild) no React.

  const [appliedFontName, setAppliedFontName] = useState('sans-serif');

  useEffect(() => {
    if (fontUrl) {
      setAppliedFontName(`TyperaDynamic-${Date.now()}`);
    }
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
    <div className="h-screen w-screen flex flex-col bg-m3-surface text-m3-on-surface overflow-hidden">
      {/* Premium Header */}
      <header className="h-[72px] shrink-0 border-b border-m3-outline/10 bg-m3-surface/70 backdrop-blur-3xl flex items-center justify-between px-8 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-10 h-10 rounded-2xl bg-m3-primary flex items-center justify-center text-m3-on-primary font-display font-black text-lg shadow-2xl shadow-m3-primary/20 group-hover:scale-110 transition-transform duration-500">
              T
            </div>
            <div className="flex flex-col">
              <h1 className="font-display text-xl font-black text-m3-primary tracking-tighter leading-none">TYPERA</h1>
              <span className="text-[9px] font-bold text-m3-on-surface-variant uppercase tracking-[0.3em] mt-1">Font Engine</span>
            </div>
          </div>

          <nav className="hidden md:flex gap-1 bg-m3-surface-container p-1 rounded-full border border-m3-outline/10">
            <button className="text-[9px] font-black uppercase tracking-widest px-5 py-2 bg-m3-primary text-m3-on-primary rounded-full transition-all">{t('modes.studio')}</button>
            <button className="text-[9px] font-black uppercase tracking-widest px-5 py-2 text-m3-on-surface-variant/30">{t('modes.forge')}</button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-m3-surface-container p-1 rounded-2xl border border-m3-outline/5">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-m3-on-surface-variant hover:bg-m3-surface-variant hover:text-m3-primary transition-all active:scale-90"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="w-px h-6 bg-m3-outline/10 my-auto mx-1" />
            <button onClick={undo} className="w-10 h-10 flex items-center justify-center rounded-xl text-m3-on-surface-variant hover:bg-m3-surface-variant hover:text-m3-primary"><Undo2 size={18} /></button>
            <button onClick={redo} className="w-10 h-10 flex items-center justify-center rounded-xl text-m3-on-surface-variant hover:bg-m3-surface-variant hover:text-m3-primary"><Redo2 size={18} /></button>
          </div>

          <button
            onClick={() => setIsLibraryOpen(true)}
            className="w-11 h-11 rounded-2xl bg-m3-surface-variant border border-m3-outline/10 flex items-center justify-center hover:border-m3-primary transition-all"
          >
             <LayoutGrid size={20} className="text-m3-on-surface-variant" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Area (Fixed Preview) */}
        <section className="flex-1 h-full p-6 md:p-10 flex flex-col relative overflow-hidden bg-m3-surface">
          <div className="flex-1 h-full flex flex-col items-center justify-center bg-preview-bg rounded-preview shadow-preview relative overflow-hidden border border-m3-outline/5">
             {/* Engine Status */}
             <div className="absolute top-10 left-12 flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full bg-m3-primary animate-ping absolute opacity-50" />
               <div className="w-2.5 h-2.5 rounded-full bg-m3-primary" />
               <span className="text-[10px] font-display text-m3-on-surface/40 uppercase tracking-[0.4em] font-black">Mutation System Online</span>
             </div>

             {/* Main Typography Preview */}
             <div className="flex-1 w-full flex items-center justify-center px-12 overflow-hidden">
                <p
                  key={appliedFontName}
                  className="text-preview-text leading-none break-words outline-none select-all text-center"
                  style={{
                    fontSize: `${previewFontSize}px`,
                    fontFamily: appliedFontName,
                    letterSpacing: `${activeProject.parameters.tracking / 100}em`
                  }}
                >
                  {previewText || 'Aa'}
                </p>
             </div>

             {/* Specimen Strip */}
             <div className="mb-20 w-full max-w-2xl border-t border-m3-on-surface/5 pt-8 flex justify-center opacity-30">
                <span className="text-preview-text/60 text-[10px] font-mono tracking-[0.3em] font-black text-center uppercase">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
                </span>
             </div>

             {/* Floating Action Bar */}
             <footer className="absolute bottom-10 flex items-center gap-2 p-1.5 bg-m3-surface-container/80 backdrop-blur-3xl border border-m3-outline/10 rounded-[28px] shadow-2xl">
                <button onClick={handleView} className="px-6 py-3 hover:bg-m3-primary/10 rounded-full transition-all group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-m3-on-surface-variant hover:text-m3-primary">
                  <Eye size={14} /> {t('studio.view')}
                </button>
                <div className="w-px h-5 bg-m3-outline/10" />
                <button onClick={handleShare} className="px-6 py-3 hover:bg-m3-primary/10 rounded-full transition-all group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-m3-on-surface-variant hover:text-m3-primary">
                  <Share2 size={14} /> {t('studio.share')}
                </button>
                <button onClick={() => setIsExportOpen(true)} className="px-8 py-3 bg-m3-primary text-m3-on-primary rounded-full transition-all text-[10px] font-black uppercase tracking-widest hover:shadow-lg shadow-m3-primary/20">
                  {t('studio.export')}
                </button>
             </footer>
          </div>

          <ExportModal open={isExportOpen} onOpenChange={setIsExportOpen} />
          <LibraryModal open={isLibraryOpen} onOpenChange={setIsLibraryOpen} />
        </section>

        {/* Sidebar Controls (Scrollable) */}
        <section className="w-[400px] h-full border-l border-m3-outline/10 bg-m3-surface-container z-20 overflow-hidden flex flex-col">
          <ControlPanel />
        </section>
      </div>
    </div>
  );
};

export default Studio;
