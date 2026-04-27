import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { shareUtils } from '../lib/shareUtils';
import { FontProject } from '../types/font';
import { useFontEngine } from '../hooks/useFontEngine';
import { useFontStore } from '../stores/fontStore';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const Preview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sharedProject, setSharedProject] = useState<FontProject | null>(null);
  const { setProject, previewFontSize, previewText } = useFontStore();

  // Reutilizamos a engine de mutação, mas precisamos injetar o projeto compartilhado no store
  // para que o hook useFontEngine o perceba.
  useEffect(() => {
    const data = searchParams.get('s');
    if (data) {
      const project = shareUtils.deserializeProject(data);
      if (project) {
        setSharedProject(project);
        setProject(project); // Injeta no store para renderizar
      }
    }
  }, [searchParams, setProject]);

  const { fontUrl } = useFontEngine();

  if (!sharedProject) {
    return (
      <div className="h-full flex items-center justify-center bg-base text-secondary">
        Carregando preview...
      </div>
    );
  }

  return (
    <div className="h-full bg-base flex flex-col items-center p-8">
      {/* Header Simples de Preview */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} /> Voltar para o Typera
        </button>
        <div className="text-center">
          <h1 className="text-xl font-display text-primary">{sharedProject.name}</h1>
          <p className="text-[10px] text-muted uppercase tracking-widest">Visualizando Fonte Compartilhada</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-accent text-preview-text px-4 py-2 rounded text-sm font-bold hover:bg-accent-hover transition-colors"
        >
          Editar no Typera <ExternalLink size={16} />
        </button>
      </header>

      {/* Preview Card Grande */}
      <div className="bg-preview-bg rounded-preview shadow-preview p-20 w-full max-w-5xl flex flex-col items-center justify-center relative overflow-hidden">
        <div className="w-full text-center">
          <p
            className="text-preview-text leading-tight break-words"
            style={{
              fontSize: `${previewFontSize * 1.5}px`,
              fontFamily: fontUrl ? 'TyperaDynamic' : 'sans-serif'
            }}
          >
            {previewText || 'Aa'}
          </p>
        </div>

        <div className="mt-16 w-full grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40 border-t border-border/10 pt-12">
          <div className="space-y-4">
            <p className="text-preview-text/60 text-sm font-mono tracking-widest">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ
            </p>
            <p className="text-preview-text/60 text-sm font-mono tracking-widest">
              abcdefghijklmnopqrstuvwxyz
            </p>
          </div>
          <div className="space-y-4 text-right">
            <p className="text-preview-text/60 text-sm font-mono tracking-widest">
              0123456789
            </p>
            <p className="text-preview-text/60 text-sm font-mono tracking-widest">
              {"!@#$%^&*()_+-=[]{}|;:\",.<>?"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
