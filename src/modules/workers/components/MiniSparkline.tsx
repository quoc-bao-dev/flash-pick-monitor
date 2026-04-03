import { BarChart } from '@/common/components/ui/BarChart';
import type { WorkerNetSpeed, WorkerStatus } from '@/modules/workers/types';

interface MiniSparklineProps {
  netSpeed: WorkerNetSpeed;
  status: WorkerStatus;
}

const colorMap: Record<WorkerStatus, 'primary' | 'success' | 'error' | 'warning' | 'info'> = {
  ONLINE:  'primary',
  BUSY:    'primary',
  IDLE:    'success',
  OFFLINE: 'info',
};

export function MiniSparkline({ netSpeed, status }: MiniSparklineProps) {
  if (status === 'OFFLINE') {
    return (
      <div className="flex items-end gap-0.5 h-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-1 bg-zinc-900 h-[5%] rounded-t-sm" />
        ))}
      </div>
    );
  }

  return (
    <BarChart
      data={netSpeed.history}
      height={24}
      gap={2}
      color={colorMap[status]}
      showTooltip={false}
      minOpacity={0.3}
      className="w-14"
    />
  );
}
