import { create } from 'zustand';
import { FontProject, FontCategory } from '../types/font';
import { storage } from '../lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface ProjectState {
  projects: FontProject[];

  // Actions
  loadProjects: () => void;
  createProject: (name: string, category: FontCategory) => FontProject;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => FontProject | null;
  updateProject: (project: FontProject) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],

  loadProjects: () => {
    const projects = storage.getProjects();
    set({ projects });
  },

  createProject: (name, category) => {
    const newProject: FontProject = {
      id: uuidv4(),
      name,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      baseFont: 'inter',
      metadata: {
        designer: 'Visitante',
        description: 'Criada no Typera',
        version: '1.0',
        license: 'proprietary',
      },
      parameters: {
        weight: 400,
        width: 0,
        contrast: 0,
        roundness: 0,
        slant: 0,
        xHeight: 0,
        tracking: 0,
        leading: 120,
        terminalStyle: 'straight',
        junctionStyle: 'angular',
      },
    };

    storage.saveProject(newProject);
    set((state) => ({ projects: [...state.projects, newProject] }));
    return newProject;
  },

  updateProject: (project) => {
    storage.saveProject(project);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p)),
    }));
  },

  deleteProject: (id) => {
    storage.deleteProject(id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    }));
  },

  duplicateProject: (id) => {
    const { projects } = get();
    const original = projects.find((p) => p.id === id);
    if (!original) return null;

    const duplicate: FontProject = {
      ...JSON.parse(JSON.stringify(original)),
      id: uuidv4(),
      name: `${original.name} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.saveProject(duplicate);
    set((state) => ({ projects: [...state.projects, duplicate] }));
    return duplicate;
  },
}));
