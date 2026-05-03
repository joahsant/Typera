import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { shareUtils } from '../lib/shareUtils';
import { FontProject } from '../types/font';
import { useFontEngine } from '../hooks/useFontEngine';
import { useFontStore } from '../stores/fontStore';
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';

const Preview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sharedProject, setSharedProject] = useState<FontProject | null>(null);
  const { setProject, previewFontSize, previewText } = useFontStore();

  useEffect(() => {
    const data = searchParams.get('s');
    if (data) {
      const project = shareUtils.deserializeProject(data);
      if (project) {
        setSharedProject(project);
        setProject(project);
      }
    }
  }, [searchParams, setProject]);

  const { fontUrl } = useFontEngine();
  const [appliedFontName, setAppliedFontName] = useState('sans-serif');

  useEffect(() => {
    if (!fontUrl) return;
    const dynamicName = `TyperaPreview-${Date.now()}`;
    const styleId = 'dynamic-preview-font';
    let style = document.getElementById(styleId) as HTMLStyleElement;
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.innerHTML = `@font-face { font-family: '${dynamicName}'; src: url('${fontUrl}') format('truetype'); }`;
    setAppliedFontName(dynamicName);
  }, [fontUrl]);

  if (!sharedProject) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-m3-surface text-m3-on-surface-variant">
        <Sparkles className="animate-pulse mb-4 text-m3-primary" size={32} />
        <p className="font-display font-bold tracking-widest uppercase text-xs">Carregando preview...</p>
      </div>
    );
  }

  return (
    <div className="bg-m3-surface flex flex-col items-center p-8 min-h-screen w-full overflow-x-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-m3-primary/5 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 mb-16 z-10 animate-expressive">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-m3-on-surface-variant hover:text-m3-primary transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-m3-surface-container flex items-center justify-center group-hover:bg-m3-primary/10 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Voltar para o Typera
        </button>

        <div className="text-center">
          <h1 className="text-4xl font-display font-black text-m3-primary tracking-tighter mb-2">{sharedProject.name}</h1>
          <div className="flex items-center justify-center gap-2">
             <div className="w-1 h-1 rounded-full bg-m3-on-surface-variant/30" />
             <p className="text-[10px] text-m3-on-surface-variant/50 font-black uppercase tracking-[0.3em]">Visualizando Fonte Compartilhada</p>
             <div className="w-1 h-1 rounded-full bg-m3-on-surface-variant/30" />
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 bg-m3-primary text-m3-on-primary px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-m3-primary/20 transition-all active:scale-95"
        >
          Editar no Typera <ExternalLink size={16} />
        </button>
      </header>

      {/* Main Preview Card */}
      <div className="flex-1 bg-preview-bg rounded-[48px] shadow-preview p-12 md:p-24 w-full max-w-6xl flex flex-col items-center justify-center relative overflow-hidden border border-m3-outline/5 mb-12">
        <div className="flex-1 w-full flex items-center justify-center">
          <p
            className="text-preview-text leading-none break-words outline-none text-center"
            style={{
              fontSize: `${previewFontSize * 1.5}px`,
              fontFamily: appliedFontName,
              letterSpacing: `${sharedProject.parameters.tracking / 100}em`
            }}
          >
            {previewText || 'Aa'}
          </p>
        </div>

        {/* Specimen Details */}
        <div className="mt-24 w-full grid grid-cols-1 md:grid-cols-2 gap-12 opacity-30 border-t border-m3-on-surface/5 pt-16">
          <div className="space-y-6">
            <p className="text-preview-text/80 text-lg font-mono tracking-widest break-all">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ
            </p>
            <p className="text-preview-text/80 text-lg font-mono tracking-widest break-all">
              abcdefghijklmnopqrstuvwxyz
            </p>
          </div>
          <div className="space-y-6 text-left md:text-right">
            <p className="text-preview-text/80 text-lg font-mono tracking-widest">
              0123456789
            </p>
            <p className="text-preview-text/80 text-lg font-mono tracking-widest break-all">
              {"!@#$%^&*()_+-=[]{}|;:\",.<>?"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-16 text-center animate-expressive delay-200">
         <p className="text-[10px] text-m3-on-surface-variant/30 font-black uppercase tracking-[0.4em]">Gerado por Typera Font Engine • 2026</p>
      </div>
    </div>
  );
};

export default Preview;
