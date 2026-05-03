import React from 'react';
import { FontCategory } from '../../../types/font';
import { useFontStore } from '../../../stores/fontStore';
import { clsx } from 'clsx';

const categories: { id: FontCategory; label: string; preview: string }[] = [
  { id: 'serif', label: 'Serif', preview: 'S' },
  { id: 'sans-serif', label: 'Sans', preview: 'S' },
  { id: 'monospace', label: 'Mono', preview: 'M' },
  { id: 'display', label: 'Display', preview: 'D' },
  { id: 'slab', label: 'Slab', preview: 'B' },
  { id: 'geometric', label: 'Geo', preview: 'G' },
];

const CategorySelector: React.FC = () => {
  const { activeProject, setParameter } = useFontStore();

  return (
    <div className="grid grid-cols-3 gap-3">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setParameter('category' as any, cat.id)}
          className={clsx(
            "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-500 group relative overflow-hidden",
            activeProject.category === cat.id
              ? "border-m3-primary bg-m3-primary/10 shadow-xl shadow-m3-primary/5"
              : "border-m3-outline/5 bg-m3-surface-variant/30 hover:border-m3-primary/30"
          )}
        >
          {activeProject.category === cat.id && (
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-m3-primary" />
          )}
          
          <span className={clsx(
            "text-2xl mb-2 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 font-black",
            cat.id === 'serif' ? 'font-serif' : 'font-display',
            activeProject.category === cat.id ? "text-m3-primary" : "text-m3-on-surface-variant/20"
          )}>
            {cat.preview}
          </span>
          <span className={clsx(
            "text-[9px] uppercase tracking-[0.2em] font-black transition-colors duration-300",
            activeProject.category === cat.id ? "text-m3-primary" : "text-m3-on-surface-variant/40"
          )}>
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
