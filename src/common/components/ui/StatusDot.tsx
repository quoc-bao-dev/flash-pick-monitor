import { cn } from '@/common/utils/cn';

type DotColor = 'green' | 'orange' | 'red' | 'blue' | 'zinc';

const colorMap: Record<DotColor, string> = {
  green:  'bg-emerald-500',
  orange: 'bg-orange-500',
  red:    'bg-red-500',
  blue:   'bg-blue-500',
  zinc:   'bg-zinc-400',
};

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: DotColor;
  pulse?: boolean;
  size?: 'xs' | 'sm' | 'md';
}

export function StatusDot({
  color = 'green',
  pulse = false,
  size = 'sm',
  className,
  ...props
}: StatusDotProps) {
  const sizeMap = { xs: 'w-1 h-1', sm: 'w-1.5 h-1.5', md: 'w-2 h-2' };
  return (
    <span
      className={cn(
        'inline-block shrink-0 rounded-full',
        colorMap[color],
        sizeMap[size],
        pulse && 'animate-pulse',
        className,
      )}
      {...props}
    />
  );
}
