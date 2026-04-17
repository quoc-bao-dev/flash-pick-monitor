import { cn } from '@/common/utils/cn';

// ─── Color map ────────────────────────────────────────────────────────────────
const trackColors: Record<string, string> = {
  primary: 'bg-primary',
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-orange-400',
  info: 'bg-blue-400',
};

const valueColors: Record<string, string> = {
  primary: 'text-primary',
  success: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-orange-400',
  info: 'text-blue-400',
};

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0–100
  label?: string;
  valueLabel?: string; // custom label, defaults to `${value}%`
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info';
  /** Shimmer animation on the fill */
  animated?: boolean;
  /** Height preset */
  height?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  label,
  valueLabel,
  color = 'primary',
  animated = false,
  height = 'xs',
  showLabel = true,
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const fillColor = trackColors[color];
  const textColor = valueColors[color];

  const heightMap = { xs: 'h-1.5', sm: 'h-2', md: 'h-3' };

  return (
    <div className={cn('space-y-1.5', className)} {...props}>
      {showLabel && (label || valueLabel !== undefined) && (
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
          {label && <span className="text-zinc-500">{label}</span>}
          <span className={textColor}>{valueLabel ?? `${clampedValue}%`}</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-500/10 rounded-full overflow-hidden', heightMap[height])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            fillColor,
            animated && 'shimmer-progress animate-[shimmer_2s_infinite]',
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
