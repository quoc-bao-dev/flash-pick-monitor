import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/common/utils/cn';
import React from 'react';

// ─── Wrapper variant ──────────────────────────────────────────────────────────
const inputWrapperVariants = cva('relative flex items-center group', {
  variants: {
    variant: {
      default: '',
      pill: '',
    },
  },
  defaultVariants: { variant: 'default' },
});

// ─── Input field variant ──────────────────────────────────────────────────────
const inputVariants = cva(
  [
    'w-full text-sm text-white placeholder:text-slate-600',
    'bg-surface-container-high',
    'border border-transparent',
    'outline-none transition-all duration-200',
    'focus:ring-2 focus:ring-primary/50 focus:bg-surface-container-highest',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        default: 'rounded-xl',
        pill: 'rounded-full',
      },
      hasLeadingIcon: {
        true: 'pl-11',
        false: 'pl-4',
      },
      hasTrailingIcon: {
        true: 'pr-11',
        false: 'pr-4',
      },
      size: {
        sm: 'py-2',
        md: 'py-3',
        lg: 'py-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      hasLeadingIcon: false,
      hasTrailingIcon: false,
      size: 'md',
    },
  },
);

// ─── Types ────────────────────────────────────────────────────────────────────
export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Pick<VariantProps<typeof inputVariants>, 'variant' | 'size'> {
  /** Icon rendered on the left inside the input */
  leadingIcon?: React.ReactNode;
  /** Icon/button rendered on the right inside the input */
  trailingIcon?: React.ReactNode;
  /** Additional class for the outer wrapper div */
  wrapperClassName?: string;
  label?: string;
  labelClassName?: string;
  error?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      variant,
      size,
      leadingIcon,
      trailingIcon,
      label,
      labelClassName,
      error,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('space-y-2', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block font-label text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1',
              labelClassName,
            )}
          >
            {label}
          </label>
        )}

        <div className={cn(inputWrapperVariants({ variant }))}>
          {/* Leading icon */}
          {leadingIcon && (
            <div className="absolute left-4 text-slate-500 group-focus-within:text-primary transition-colors pointer-events-none">
              {leadingIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'bg-surface-container-high',
              inputVariants({
                variant,
                size,
                hasLeadingIcon: !!leadingIcon,
                hasTrailingIcon: !!trailingIcon,
              }),
              error && 'focus:ring-red-500/50 ring-2 ring-red-500/30',
              className,
            )}
            {...props}
          />

          {/* Trailing icon (can be interactive button) */}
          {trailingIcon && <div className="absolute right-4 text-slate-500 flex items-center">{trailingIcon}</div>}
        </div>

        {/* Error message */}
        {error && <p className="text-[11px] font-medium text-red-400 ml-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

// ─── Textarea variant ─────────────────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, wrapperClassName, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('space-y-2', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block font-label text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full text-sm text-white placeholder:text-slate-600',
            'bg-surface-container-high rounded-xl px-4 py-3 min-h-[120px] resize-y',
            'border border-transparent outline-none transition-all duration-200',
            'focus:ring-2 focus:ring-primary/50 focus:bg-surface-container-highest',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            error && 'ring-2 ring-red-500/30 focus:ring-red-500/50',
            className,
          )}
          {...props}
        />
        {error && <p className="text-[11px] font-medium text-red-400 ml-1">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
