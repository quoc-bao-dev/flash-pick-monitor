import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/common/utils/cn';
import React from 'react';

// ─── CVA Definition ───────────────────────────────────────────────────────────
const buttonVariants = cva(
  // Base styles applied to all variants
  [
    'inline-flex items-center justify-center gap-2',
    'font-headline font-bold',
    'transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:opacity-40 disabled:pointer-events-none',
    'active:scale-[0.97]',
    'select-none',
  ],
  {
    variants: {
      variant: {
        /** Full orange fill — primary CTA */
        primary: [
          'bg-primary text-white',
          'hover:bg-orange-400',
          'shadow-[0_8px_24px_rgba(249,115,22,0.25)]',
          'hover:shadow-[0_12px_32px_rgba(249,115,22,0.4)]',
        ],
        /** Subtle filled surface — secondary action */
        secondary: [
          'bg-surface-container text-on-surface',
          'border border-white/5',
          'hover:bg-surface-container-high hover:border-white/10',
        ],
        /** Dark zinc surface — used in modals for dismiss */
        ghost: [
          'bg-white/5 text-zinc-400',
          'hover:bg-white/10 hover:text-white',
        ],
        /** Destructive red fill */
        destructive: [
          'bg-red-500 text-white',
          'shadow-[0_8px_24px_rgba(239,68,68,0.25)]',
          'hover:bg-red-400',
          'hover:shadow-[0_12px_32px_rgba(239,68,68,0.4)]',
        ],
        /** Destructive subtle (outline) */
        'destructive-subtle': [
          'bg-red-500/10 text-red-400',
          'border border-red-500/20',
          'hover:bg-red-500/20 hover:text-red-300',
        ],
        /** Text-only link */
        link: [
          'bg-transparent text-primary underline-offset-4',
          'hover:text-orange-300 hover:underline',
          'shadow-none active:scale-100',
        ],
        /** Transparent icon-only with hover ring — use with `size="icon"` */
        'icon-ghost': [
          'bg-transparent text-zinc-500',
          'hover:bg-white/10 hover:text-white',
        ],
      },
      size: {
        sm:   'text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-lg',
        md:   'text-xs tracking-widest uppercase px-4 py-2.5 rounded-xl',
        lg:   'text-sm tracking-wider uppercase px-6 py-4 rounded-2xl',
        /** Full-pill — used in LoginForm */
        pill: 'text-sm px-6 py-4 rounded-full',
        /** Square icon button */
        icon: 'w-9 h-9 rounded-xl p-0 shrink-0',
        /** Larger icon */
        'icon-lg': 'w-11 h-11 rounded-2xl p-0 shrink-0',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  },
);

// ─── Component ────────────────────────────────────────────────────────────────
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

// ─── Variants re-export for external use (e.g., Link-as-Button) ────────────────
export { buttonVariants };
