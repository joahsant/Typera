import { create } from 'zustand';
import { FontProject, FontParameters, SystemState } from '../types/font';
import { v4 as uuidv4 } from 'uuid';
import { validation } from '../lib/validation';

interface FontState extends SystemState {
  previewFontSize: number;
  activeProject: FontProject;
  history: FontProject[];
  historyIndex: number;

  // Actions
  setProject: (project: FontProject) => void;
  setParameter: (key: keyof FontParameters | 'category' | 'name', value: any) => void;
  setPreviewText: (text: string) => void;
  setPreviewFontSize: (size: number) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setMode: (mode: SystemState['activeMode']) => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  pushToHistory: (project: FontProject) => void;
}

const DEFAULT_PARAMETERS: FontParameters = {
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
};

const initialProject: FontProject = {
  id: uuidv4(),
  name: 'Nova Fonte',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  category: 'sans-serif',
  baseFont: 'inter',
  parameters: DEFAULT_PARAMETERS,
  metadata: {
    designer: 'Visitante',
    description: 'Criada no Typera',
    version: '1.0',
    license: 'proprietary',
  },
};

export const useFontStore = create<FontState>((set, get) => ({
  activeProjectId: initialProject.id,
  activeProject: initialProject,
  previewText: 'Aa',
  isDirty: false,
  activeMode: 'studio',
  theme: 'dark',
  locale: 'pt-BR',
  previewFontSize: 120,
  history: [JSON.parse(JSON.stringify(initialProject))],
  historyIndex: 0,

  setProject: (project) => {
    set({
      activeProject: project,
      activeProjectId: project.id,
      history: [JSON.parse(JSON.stringify(project))],
      historyIndex: 0,
      isDirty: false
    });
  },

  setPreviewFontSize: (previewFontSize) => set({ previewFontSize }),

  setParameter: (key, value) => {
    const { activeProject } = get();
    let finalValue = value;
    if (key === 'name') finalValue = validation.sanitizeString(value);

    const isTopLevel = ['name', 'category'].includes(key as string);

    const newProject = {
      ...activeProject,
      [key]: finalValue,
      parameters: isTopLevel 
        ? activeProject.parameters 
        : { ...activeProject.parameters, [key]: finalValue },
      updatedAt: new Date().toISOString(),
    };

    set({ activeProject: newProject, isDirty: true });
  },

  setPreviewText: (text) => set({ previewText: text }),

  setTheme: (theme) => {
    set({ theme });
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  },

  setMode: (activeMode) => set({ activeMode }),

  pushToHistory: (project) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    if (newHistory.length >= 50) newHistory.shift();
    newHistory.push(JSON.parse(JSON.stringify(project)));
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isDirty: false
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      set({
        activeProject: JSON.parse(JSON.stringify(history[prevIndex])),
        historyIndex: prevIndex
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      set({
        activeProject: JSON.parse(JSON.stringify(history[nextIndex])),
        historyIndex: nextIndex
      });
    }
  },
}));
