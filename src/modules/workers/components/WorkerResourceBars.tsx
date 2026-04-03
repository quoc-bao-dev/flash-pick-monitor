import { ProgressBar } from '@/common/components/ui/ProgressBar';
import type { WorkerResource } from '@/modules/workers/types';

interface WorkerResourceBarsProps {
  resources: WorkerResource;
}

export function WorkerResourceBars({ resources }: WorkerResourceBarsProps) {
  const isActive = resources.cpuPercent > 0 || resources.memPercent > 0;
  const color = resources.cpuPercent >= 80 ? 'error' : resources.cpuPercent >= 50 ? 'warning' : 'success';

  if (!isActive) {
    return (
      <div className="flex flex-col gap-1.5 w-24">
        <div className="h-1 w-full bg-zinc-900 rounded-full" />
        <div className="h-1 w-full bg-zinc-900 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 w-28">
      <ProgressBar value={resources.cpuPercent} color={color} height="xs" showLabel={false} />
      <ProgressBar value={resources.memPercent} color="info"  height="xs" showLabel={false} />
    </div>
  );
}
