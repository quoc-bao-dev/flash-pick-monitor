import { cn } from '@/common/utils/cn';
import { Check } from 'lucide-react';
import React from 'react';

// ─── Checkbox ─────────────────────────────────────────────────────────────────
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  wrapperClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, wrapperClassName, id, ...props }, ref) => {
    const inputId = id ?? (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (
      <label
        htmlFor={inputId}
        className={cn(
          'flex items-center gap-3 cursor-pointer group select-none',
          wrapperClassName,
        )}
      >
        <div className="relative flex items-center justify-center shrink-0">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          {/* Custom box */}
          <div
            className={cn(
              'w-5 h-5 rounded-md transition-all duration-150',
              'bg-surface-container-highest border border-white/10',
              'peer-checked:bg-primary peer-checked:border-primary',
              'group-hover:border-primary/50',
              className,
            )}
          />
          {/* Checkmark */}
          <Check
            size={13}
            strokeWidth={3}
            className="absolute text-white transition-opacity peer-checked:opacity-100 opacity-0"
          />
        </div>
        {label && (
          <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors leading-tight">
            {label}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';

// ─── Toggle Switch ────────────────────────────────────────────────────────────
export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  wrapperClassName?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, wrapperClassName, id, ...props }, ref) => {
    const inputId = id ?? (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (
      <label
        htmlFor={inputId}
        className={cn('flex items-center gap-3 cursor-pointer group select-none', wrapperClassName)}
      >
        <div className="relative shrink-0">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          {/* Track */}
          <div className={cn(
            'w-10 h-5 rounded-full transition-all duration-200',
            'bg-surface-container-highest border border-white/10',
            'peer-checked:bg-primary peer-checked:border-primary',
            className,
          )} />
          {/* Thumb */}
          <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 peer-checked:left-5.5 shadow-sm pointer-events-none" />
        </div>
        {label && (
          <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  },
);

Toggle.displayName = 'Toggle';
