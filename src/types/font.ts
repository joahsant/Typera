export type FontCategory =
  | 'serif'
  | 'sans-serif'
  | 'monospace'
  | 'display'
  | 'slab'
  | 'geometric';

export type TerminalStyle = 'straight' | 'oblique' | 'round' | 'flared' | 'serif';
export type JunctionStyle = 'angular' | 'smooth' | 'rounded';

export interface FontParameters {
  weight: number;          // 100–900, padrão 400
  width: number;           // -100–100, padrão 0
  contrast: number;        // 0–100, padrão 0
  roundness: number;       // 0–100, padrão 0
  slant: number;           // -30–30, padrão 0
  xHeight: number;         // -50–50, padrão 0
  tracking: number;        // -100–200, padrão 0
  leading: number;         // 80–200, padrão 120
  terminalStyle: TerminalStyle;
  junctionStyle: JunctionStyle;
}

export interface FontMetadata {
  designer: string;
  description: string;
  version: string;
  license: 'proprietary' | 'OFL';
}

export interface FontProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  category: FontCategory;
  baseFont: 'typera-neutral' | 'inter';
  parameters: FontParameters;
  metadata: FontMetadata;
}

export interface SystemState {
  activeProjectId: string | null;
  previewText: string;
  isDirty: boolean;
  activeMode: 'studio' | 'forge' | 'academy';
  theme: 'dark' | 'light';
  locale: 'pt-BR' | 'en-US';
}
