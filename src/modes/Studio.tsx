import React, { useEffect, useState } from 'react';
import { useFontStore } from '../stores/fontStore';
import ControlPanel from '../components/studio/ControlPanel/ControlPanel';
import { useFontEngine } from '../hooks/useFontEngine';
import ExportModal from '../components/export/ExportModal';
import LibraryModal from '../components/library/LibraryModal';
import { useAutosave } from '../hooks/useAutosave';
import { shareUtils } from '../lib/shareUtils';
import { Sun, Moon, Undo2, Redo2, LayoutGrid, Eye, Share2, Download } from 'lucide-react';

const Studio: React.FC = () => {
  const { previewText, activeProject, undo, redo, previewFontSize, theme, setTheme } = useFontStore();
  const { fontUrl } = useFontEngine();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [appliedFont, setAppliedFont] = useState('sans-serif');

  useAutosave();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    if (!fontUrl) return;
    const name = `TyperaLive-${Date.now()}`;
    const style = document.createElement('style');
    style.textContent = `@font-face { font-family: "${name}"; src: url("${fontUrl}") format("truetype"); font-display: block; }`;
    document.head.appendChild(style);
    setAppliedFont(name);
    return () => { if (style.parentNode) document.head.removeChild(style); };
  }, [fontUrl]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--bg-base)] text-[var(--text-primary)] overflow-hidden">
      {/* Header */}
      <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-[var(--bg-surface)] border-b border-[var(--border)] z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-accent/20">T</div>
          <span className="font-bold text-xl tracking-tighter font-display">TYPERA</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 mr-2 p-1 bg-[var(--bg-base)] rounded-xl border border-[var(--border)]">
            <button onClick={undo} className="p-2 hover:bg-[var(--bg-surface)] rounded-lg text-[var(--text-secondary)] hover:text-accent transition-all"><Undo2 size={18}/></button>
            <button onClick={redo} className="p-2 hover:bg-[var(--bg-surface)] rounded-lg text-[var(--text-secondary)] hover:text-accent transition-all"><Redo2 size={18}/></button>
          </div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-10 h-10 flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl hover:border-accent transition-all">
            {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
          <button onClick={() => setIsLibraryOpen(true)} className="w-10 h-10 flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl hover:border-accent transition-all"><LayoutGrid size={18}/></button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 p-10 flex flex-col items-center justify-center relative bg-[var(--bg-base)]">
          <div className="bg-white dark:bg-[#111] rounded-[48px] shadow-2xl w-full max-w-5xl h-[85%] flex items-center justify-center relative overflow-hidden border border-[var(--border)]">
            <div className="absolute top-8 left-10 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
               <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.3em]">Engine Active</span>
            </div>
            <p style={{ fontFamily: appliedFont, fontSize: `${previewFontSize}px`, letterSpacing: `${activeProject.parameters.tracking / 100}em` }} className="text-center px-16 break-words leading-none text-[#111] dark:text-[#eee]">
              {previewText || 'Aa'}
            </p>
          </div>

          <div className="absolute bottom-10 flex gap-2 bg-[var(--bg-surface)]/80 backdrop-blur-xl p-2 rounded-2xl border border-[var(--border)] shadow-2xl z-30">
            <button className="flex items-center gap-2 px-5 py-2.5 hover:bg-[var(--bg-base)] rounded-xl text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] transition-all"><Eye size={16}/> View</button>
            <button className="flex items-center gap-2 px-5 py-2.5 hover:bg-[var(--bg-base)] rounded-xl text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] transition-all"><Share2 size={16}/> Share</button>
            <button onClick={() => setIsExportOpen(true)} className="flex items-center gap-2 px-8 py-2.5 bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all">Export</button>
          </div>
        </main>

        <aside className="w-80 h-full border-l border-[var(--border)] bg-[var(--bg-surface)] overflow-y-auto custom-scrollbar shrink-0">
          <ControlPanel />
        </aside>
      </div>

      <ExportModal open={isExportOpen} onOpenChange={setIsExportOpen} />
      <LibraryModal open={isLibraryOpen} onOpenChange={setIsLibraryOpen} />
    </div>
  );
};

export default Studio;
