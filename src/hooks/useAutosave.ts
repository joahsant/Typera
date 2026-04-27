import { useEffect, useRef } from 'react';
import { useFontStore } from '../stores/fontStore';
import { useProjectStore } from '../stores/projectStore';

/**
 * Hook de Autosave com Debounce (300ms).
 * Salva o projeto ativo no storage local sempre que houver modificações.
 */
export const useAutosave = () => {
  const { activeProject, isDirty } = useFontStore();
  const { updateProject } = useProjectStore();
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    if (isDirty) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        updateProject(activeProject);
      }, 300);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeProject, isDirty, updateProject]);
};
