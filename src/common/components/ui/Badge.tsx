import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/common/utils/cn';

// ─── CVA ─────────────────────────────────────────────────────────────────────
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-bold uppercase tracking-wider border transition-colors',
  {
    variants: {
      variant: {
        success:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        warning:  'bg-orange-500/10  text-orange-400  border-orange-500/20',
        error:    'bg-red-500/10     text-red-400     border-red-500/20',
        info:     'bg-blue-500/10    text-blue-400    border-blue-500/20',
        neutral:  'bg-zinc-700/60    text-zinc-400    border-zinc-600/30',
        active:   'bg-orange-500/20  text-orange-500  border-orange-500/30',
        primary:  'bg-primary/20     text-primary     border-primary/30',
      },
      size: {
        sm: 'text-[9px]  px-1.5 py-0.5 rounded',
        md: 'text-[10px] px-2   py-0.5 rounded',
        lg: 'text-[11px] px-3   py-1   rounded-full',
      },
      /** Show a leading dot (optionally pulsing) */
      dot: {
        true:  '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
      dot: false,
    },
  },
);

// Dot color maps to variant
const dotColorMap: Record<string, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-orange-400',
  error:   'bg-red-500',
  info:    'bg-blue-400',
  neutral: 'bg-zinc-400',
  active:  'bg-orange-500',
  primary: 'bg-primary',
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Animate the dot with pulse */
  pulse?: boolean;
}

export function Badge({
  className,
  variant = 'neutral',
  size,
  dot,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const dotColor = dotColorMap[variant ?? 'neutral'];
  return (
    <span className={cn(badgeVariants({ variant, size, dot }), className)} {...props}>
      {dot && (
        <span
          className={cn('shrink-0 rounded-full', dotColor, size === 'lg' ? 'w-2 h-2' : 'w-1.5 h-1.5', pulse && 'animate-pulse')}
        />
      )}
      {children}
    </span>
  );
}
