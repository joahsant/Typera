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
    <div className="space-y-5 group/slider">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-black text-m3-on-surface-variant/70 uppercase tracking-[0.2em] select-none group-hover/slider:text-m3-primary transition-colors duration-300">
            {label}
          </label>
          <Tooltip.Provider>
            <Tooltip.Root delayDuration={200}>
              <Tooltip.Trigger asChild>
                <HelpCircle size={12} className="text-m3-outline/40 cursor-help hover:text-m3-primary transition-colors" />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="max-w-[200px] bg-m3-surface-container-high border border-m3-outline/10 p-4 rounded-2xl text-[11px] text-m3-on-surface-variant shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-300 backdrop-blur-xl"
                  sideOffset={8}
                >
                  <p className="leading-relaxed font-medium">{tooltip}</p>
                  <Tooltip.Arrow className="fill-m3-outline/10" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
        <span className="text-[11px] font-display font-black text-m3-primary bg-m3-primary/10 px-3 py-1 rounded-full border border-m3-primary/10 tabular-nums">
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
          <Slider.Track className="bg-m3-surface-variant relative grow rounded-full h-4 overflow-hidden border border-m3-outline/5">
            <Slider.Range className="absolute bg-m3-primary/20 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-6 h-6 bg-m3-primary shadow-xl rounded-full hover:scale-125 focus:outline-none transition-all duration-300 cursor-grab active:cursor-grabbing active:scale-110 border-4 border-m3-surface-container"
            aria-label={label}
          />
        </Slider.Root>
      </div>

      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-[9px] text-m3-on-surface-variant/30 font-black uppercase tracking-[0.3em] px-1">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
};

export default ParameterSlider;
