import { cn } from '@/common/utils/cn';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Lucide icon node */
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Right-side action slot */
  action?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function SectionHeader({ icon, title, subtitle, action, size = 'md', className, ...props }: SectionHeaderProps) {
  const titleSize = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };
  const iconSize = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-7 h-7' };

  return (
    <div className={cn('flex items-start justify-between gap-4', className)} {...props}>
      <div>
        <h2 className={cn('font-headline font-bold text-on-surface flex items-center gap-2', titleSize[size])}>
          {icon && <span className={cn('shrink-0 text-primary', iconSize[size])}>{icon}</span>}
          {title}
        </h2>
        {subtitle && <p className="text-zinc-400 text-sm mt-0.5 ml-8">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
