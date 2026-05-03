import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useProjectStore } from '../../stores/projectStore';
import { useFontStore } from '../../stores/fontStore';
import { X, FolderPlus, Trash2, Copy, Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

interface LibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const { projects, deleteProject, duplicateProject, createProject, loadProjects } = useProjectStore();
  const { activeProject, setProject } = useFontStore() as any;

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
        <Dialog.Overlay className="fixed inset-0 bg-m3-surface/80 backdrop-blur-xl z-[60] animate-in fade-in duration-500" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[80vh] bg-m3-surface-container border border-m3-outline/10 rounded-[48px] shadow-2xl z-[70] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-400">

          {/* Header do Modal */}
          <div className="p-8 border-b border-m3-outline/5 flex justify-between items-center bg-m3-surface/30">
            <div>
              <Dialog.Title className="text-3xl font-display font-black text-m3-primary tracking-tighter">Minha Biblioteca</Dialog.Title>
              <Dialog.Description className="text-m3-on-surface-variant/50 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                {projects.length} Projetos salvos localmente
              </Dialog.Description>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-3 bg-m3-primary text-m3-on-primary px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:shadow-xl hover:shadow-m3-primary/20 transition-all active:scale-95"
              >
                <FolderPlus size={18} />
                Novo Projeto
              </button>
              <Dialog.Close className="p-3 text-m3-on-surface-variant/40 hover:text-m3-primary transition-colors">
                <X size={28} />
              </Dialog.Close>
            </div>
          </div>

          {/* Grid de Projetos */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            {projects.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-m3-surface-variant rounded-3xl flex items-center justify-center text-m3-on-surface-variant/10">
                  <Hash size={48} />
                </div>
                <div className="space-y-2">
                  <p className="text-m3-on-surface font-bold text-lg">Nenhum projeto encontrado</p>
                  <p className="text-m3-on-surface-variant/40 text-sm">Crie sua primeira fonte para começar.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={clsx(
                      "group relative flex flex-col bg-m3-surface-variant/30 border-2 rounded-[32px] overflow-hidden transition-all duration-500 hover:border-m3-primary/50 hover:shadow-2xl",
                      activeProject?.id === project.id ? "border-m3-primary bg-m3-primary/5" : "border-m3-outline/5"
                    )}
                  >
                    {/* Preview da Fonte no Card */}
                    <div
                      onClick={() => handleSelect(project)}
                      className="h-40 bg-white flex items-center justify-center cursor-pointer overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
                    >
                      <span className="text-black text-7xl font-display font-black select-none">Aa</span>
                    </div>

                    {/* Info do Projeto */}
                    <div className="p-6 flex flex-col gap-2 border-t border-m3-outline/5 bg-m3-surface/40">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-black text-m3-on-surface truncate max-w-[150px]">{project.name}</h4>
                        <span className="text-[9px] uppercase font-black tracking-widest text-m3-primary bg-m3-primary/10 px-2.5 py-1 rounded-full border border-m3-primary/10">
                          {project.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-m3-on-surface-variant/30 uppercase tracking-widest">
                        Editado {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Ações Rápidas (Hover) */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); duplicateProject(project.id); }}
                        className="p-2.5 bg-m3-surface-container/90 backdrop-blur-xl rounded-2xl border border-m3-outline/10 text-m3-on-surface-variant hover:text-m3-primary transition-all shadow-xl"
                        title="Duplicar"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                        className="p-2.5 bg-m3-surface-container/90 backdrop-blur-xl rounded-2xl border border-m3-outline/10 text-m3-on-surface-variant hover:text-red-500 transition-all shadow-xl"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
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
