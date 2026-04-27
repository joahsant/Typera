import { FontProject } from '../types/font';

const STORAGE_KEY = 'typera_projects';

export const storage = {
  /**
   * Obtém todos os projetos salvos no localStorage.
   */
  getProjects: (): FontProject[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Falha ao ler projetos do storage:', error);
      return [];
    }
  },

  /**
   * Salva ou atualiza um projeto.
   */
  saveProject: (project: FontProject): void => {
    try {
      const projects = storage.getProjects();
      const index = projects.findIndex((p) => p.id === project.id);

      if (index !== -1) {
        projects[index] = { ...project, updatedAt: new Date().toISOString() };
      } else {
        projects.push(project);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      // Trata erro de Storage Cheio (QuotaExceededError)
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Memória do navegador cheia! Por favor, exclua alguns projetos antigos.');
      }
      console.error('Falha ao salvar projeto:', error);
    }
  },

  /**
   * Remove um projeto pelo ID.
   */
  deleteProject: (id: string): void => {
    try {
      const projects = storage.getProjects().filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Falha ao excluir projeto:', error);
    }
  }
};
