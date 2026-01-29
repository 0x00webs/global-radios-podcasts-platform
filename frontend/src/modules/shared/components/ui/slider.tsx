import * as React from "react"

import { cn } from "@/lib/utils"

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value = [0], onValueChange, max = 100, step = 1, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState(value[0] || 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      setLocalValue(newValue);
      onValueChange?.([newValue]);
    };

    React.useEffect(() => {
      setLocalValue(value[0] || 0);
    }, [value]);

    return (
      <div ref={ref} className={cn("w-full", className)}>
        <input
          type="range"
          min="0"
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          className={cn(
            "w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700",
            "accent-slate-900 dark:accent-slate-50",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
