import { cn } from '@/common/utils/cn';
import type { WorkerStatus } from '@/modules/workers/types';
import { StatusDot } from '@/common/components/ui/StatusDot';
import { Badge } from '@/common/components/ui/Badge';

type DotColor = 'orange' | 'green' | 'red' | 'zinc';

const statusConfig: Record<
  WorkerStatus,
  { dot: DotColor; pulse: boolean; variant: 'success' | 'warning' | 'error' | 'neutral'; label: string }
> = {
  ONLINE:  { dot: 'orange', pulse: true,  variant: 'warning', label: 'Online'  },
  IDLE:    { dot: 'green',  pulse: false, variant: 'success', label: 'Idle'    },
  BUSY:    { dot: 'orange', pulse: true,  variant: 'warning', label: 'Busy'    },
  OFFLINE: { dot: 'zinc',   pulse: false, variant: 'neutral', label: 'Offline' },
};

interface WorkerStatusBadgeProps {
  status: WorkerStatus;
  className?: string;
}

export function WorkerStatusBadge({ status, className }: WorkerStatusBadgeProps) {
  const cfg = statusConfig[status];
  return (
    <Badge
      variant={cfg.variant}
      size="md"
      dot
      pulse={cfg.pulse}
      className={cn(className)}
    >
      {cfg.label}
    </Badge>
  );
}
