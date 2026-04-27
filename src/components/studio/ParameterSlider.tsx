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
  tooltip: string;
  minLabel?: string;
  maxLabel?: string;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label, value, min, max, step = 1, onChange, tooltip, minLabel, maxLabel
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <label className="text-[11px] font-medium text-secondary uppercase tracking-wider select-none">
            {label}
          </label>
          <Tooltip.Provider>
            <Tooltip.Root delayDuration={300}>
              <Tooltip.Trigger asChild>
                <HelpCircle size={12} className="text-muted cursor-help" />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="max-w-[200px] bg-elevated border border-border p-2 rounded text-[10px] text-primary shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200"
                  sideOffset={5}
                >
                  {tooltip}
                  <Tooltip.Arrow className="fill-border" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
        <span className="text-xs font-mono text-accent">{value}</span>
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        max={max}
        min={min}
        step={step}
        onValueChange={([v]) => onChange(v)}
      >
        <Slider.Track className="bg-border relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-accent rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 bg-primary shadow-lg rounded-full hover:bg-accent focus:outline-none transition-colors cursor-grab active:cursor-grabbing"
          aria-label={label}
        />
      </Slider.Root>

      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-[9px] text-muted font-display uppercase tracking-widest mt-1">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
};

export default ParameterSlider;
