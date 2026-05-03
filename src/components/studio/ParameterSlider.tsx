import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Tooltip from '@radix-ui/react-tooltip';
import { HelpCircle } from 'lucide-react';

interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  tooltip: string;
  minLabel?: string;
  maxLabel?: string;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label, value, min, max, step = 1, onChange, onCommit, tooltip, minLabel, maxLabel
}) => {
  return (
    <div className="space-y-4 group/slider">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest select-none group-hover/slider:text-accent transition-colors">
            {label}
          </label>
          <Tooltip.Provider>
            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <HelpCircle size={12} className="text-[var(--text-secondary)]/40 cursor-help hover:text-accent transition-colors" />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="max-w-[200px] bg-[var(--bg-elevated)] border border-[var(--border)] p-4 rounded-2xl text-[11px] text-[var(--text-primary)] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-300 backdrop-blur-xl"
                  sideOffset={8}
                >
                  <p className="leading-relaxed font-medium">{tooltip}</p>
                  <Tooltip.Arrow className="fill-[var(--border)]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
        <span className="text-[10px] font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/10">
          {value}
        </span>
      </div>

      <div className="px-1">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-6"
          value={[value]}
          max={max}
          min={min}
          step={step}
          onValueChange={([v]) => onChange(v)}
          onValueCommit={([v]) => onCommit?.(v)}
        >
          <Slider.Track className="bg-[var(--bg-elevated)] relative grow rounded-full h-2 overflow-hidden border border-[var(--border)]">
            <Slider.Range className="absolute bg-accent rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 bg-[var(--text-primary)] shadow-xl rounded-full hover:scale-110 focus:outline-none transition-all cursor-grab active:cursor-grabbing border-2 border-[var(--bg-surface)]"
            aria-label={label}
          />
        </Slider.Root>
      </div>

      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-[8px] text-[var(--text-secondary)]/30 font-bold uppercase tracking-widest px-1">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
};

export default ParameterSlider;
