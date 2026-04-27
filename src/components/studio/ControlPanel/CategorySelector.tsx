import React from 'react';
import { FontCategory } from '../../../types/font';
import { useFontStore } from '../../../stores/fontStore';
import { clsx } from 'clsx';

const categories: { id: FontCategory; label: string; preview: string }[] = [
  { id: 'serif', label: 'Serif', preview: 'A' },
  { id: 'sans-serif', label: 'Sans', preview: 'A' },
  { id: 'monospace', label: 'Mono', preview: 'A' },
  { id: 'display', label: 'Display', preview: 'A' },
  { id: 'slab', label: 'Slab', preview: 'A' },
  { id: 'geometric', label: 'Geo', preview: 'A' },
];

const CategorySelector: React.FC = () => {
  const { activeProject, setParameter } = useFontStore();

  return (
    <div className="grid grid-cols-3 gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setParameter('category' as any, cat.id)}
          className={clsx(
            "flex flex-col items-center justify-center p-3 rounded border-2 transition-all duration-200 group",
            activeProject.category === cat.id
              ? "border-accent bg-accent/10"
              : "border-border bg-base hover:border-border-strong"
          )}
        >
          <span className={clsx(
            "text-2xl mb-1 transition-transform group-hover:scale-110",
            cat.id === 'serif' ? 'font-serif' : 'font-sans',
            activeProject.category === cat.id ? "text-accent" : "text-primary"
          )}>
            {cat.preview}
          </span>
          <span className="text-[9px] uppercase tracking-widest font-medium text-muted">
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
