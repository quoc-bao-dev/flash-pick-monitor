import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/common/utils/cn';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  trend?: string;
  trendDir?: 'up' | 'down' | 'neutral';
  /** Invert trend sentiment: up=bad (error count), down=good */
  invertTrend?: boolean;
  size?: 'sm' | 'md';
}

export function MetricCard({
  label,
  value,
  trend,
  trendDir = 'neutral',
  invertTrend = false,
  size = 'md',
  className,
  ...props
}: MetricCardProps) {
  // Determine color: up is good by default; if invertTrend, up is bad
  const isPositive = invertTrend
    ? trendDir === 'down'
    : trendDir === 'up';

  const trendColor = trendDir === 'neutral'
    ? 'text-zinc-500'
    : isPositive ? 'text-emerald-400' : 'text-red-400';

  const TrendIcon = trendDir === 'up' ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        'bg-surface-container-low rounded-xl border border-white/5',
        size === 'sm' ? 'p-3' : 'p-4',
        className,
      )}
      {...props}
    >
      <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1.5">
        {label}
      </p>
      <p className={cn('font-headline font-bold text-white', size === 'sm' ? 'text-xl' : 'text-2xl')}>
        {value}
      </p>
      {trend && trendDir !== 'neutral' && (
        <div className={cn('mt-2 text-[10px] flex items-center gap-1 font-bold', trendColor)}>
          <TrendIcon size={11} />
          {trend}
        </div>
      )}
    </div>
  );
}
