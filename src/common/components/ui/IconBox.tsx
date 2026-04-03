import { cn } from '@/common/utils/cn';

type BoxColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';

const colorMap: Record<BoxColor, { bg: string; text: string }> = {
  primary: { bg: 'bg-primary/10',      text: 'text-primary' },
  success: { bg: 'bg-emerald-500/10',  text: 'text-emerald-400' },
  error:   { bg: 'bg-red-500/10',      text: 'text-red-400' },
  warning: { bg: 'bg-orange-400/10',   text: 'text-orange-400' },
  info:    { bg: 'bg-blue-500/10',     text: 'text-blue-400' },
  neutral: { bg: 'bg-surface-container-highest', text: 'text-zinc-400' },
};

export interface IconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: BoxColor;
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'md' | 'lg' | 'xl';
}

export function IconBox({
  color = 'primary',
  size = 'md',
  rounded = 'xl',
  className,
  children,
  ...props
}: IconBoxProps) {
  const { bg, text } = colorMap[color];
  const sizeMap   = { sm: 'w-8 h-8',   md: 'w-10 h-10', lg: 'w-12 h-12' };
  const roundMap  = { md: 'rounded-lg', lg: 'rounded-xl', xl: 'rounded-2xl' };

  return (
    <div
      className={cn(
        'shrink-0 flex items-center justify-center',
        bg, text,
        sizeMap[size],
        roundMap[rounded],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
