import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useProjectStore } from '../../stores/projectStore';
import { useFontStore } from '../../stores/fontStore';
import { X, FolderPlus, Trash2, Copy, ExternalLink, Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

interface LibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const { projects, deleteProject, duplicateProject, createProject, loadProjects } = useProjectStore();
  const { activeProject, setProject } = useFontStore() as any; // Using any for quick integration, will refine types later

  React.useEffect(() => {
    if (open) loadProjects();
  }, [open, loadProjects]);

  const handleCreateNew = () => {
    const newProj = createProject('Nova Fonte', 'sans-serif');
    setProject(newProj);
    onOpenChange(false);
  };

  const handleSelect = (project: any) => {
    setProject(project);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-base/90 backdrop-blur-md z-[60] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[80vh] bg-surface border border-border rounded-preview shadow-2xl z-[70] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

          {/* Header do Modal */}
          <div className="p-6 border-b border-border flex justify-between items-center bg-base/20">
            <div>
              <Dialog.Title className="text-2xl font-display text-primary">Minha Biblioteca</Dialog.Title>
              <Dialog.Description className="text-muted text-xs uppercase tracking-widest mt-1">
                {projects.length} Projetos salvos localmente
              </Dialog.Description>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-accent text-preview-text px-4 py-2 rounded text-sm font-bold hover:bg-accent-hover transition-colors"
              >
                <FolderPlus size={18} />
                Novo Projeto
              </button>
              <Dialog.Close className="p-2 text-muted hover:text-primary transition-colors">
                <X size={24} />
              </Dialog.Close>
            </div>
          </div>

          {/* Grid de Projetos */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {projects.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-base rounded-full flex items-center justify-center text-muted/20">
                  <Hash size={40} />
                </div>
                <div className="space-y-1">
                  <p className="text-secondary font-medium">Nenhum projeto encontrado</p>
                  <p className="text-muted text-sm">Crie sua primeira fonte para começar.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={clsx(
                      "group relative flex flex-col bg-base border rounded-preview overflow-hidden transition-all duration-300 hover:border-accent/50 hover:shadow-lg",
                      activeProject?.id === project.id ? "border-accent ring-1 ring-accent/20" : "border-border"
                    )}
                  >
                    {/* Preview da Fonte no Card */}
                    <div
                      onClick={() => handleSelect(project)}
                      className="h-32 bg-white flex items-center justify-center cursor-pointer overflow-hidden"
                    >
                      <span className="text-black text-6xl select-none">Aa</span>
                    </div>

                    {/* Info do Projeto */}
                    <div className="p-4 flex flex-col gap-1 border-t border-border bg-surface">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-primary truncate max-w-[150px]">{project.name}</h4>
                        <span className="text-[9px] uppercase tracking-tighter text-muted bg-base px-1.5 py-0.5 rounded border border-border">
                          {project.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted">
                        Editado {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Ações Rápidas (Hover) */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); duplicateProject(project.id); }}
                        className="p-1.5 bg-surface/90 backdrop-blur rounded border border-border text-secondary hover:text-accent transition-colors shadow-sm"
                        title="Duplicar"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                        className="p-1.5 bg-surface/90 backdrop-blur rounded border border-border text-secondary hover:text-red-500 transition-colors shadow-sm"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LibraryModal;
