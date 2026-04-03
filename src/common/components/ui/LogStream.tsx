import { cn } from '@/common/utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'SYNC' | 'WORK' | 'DEBUG';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: React.ReactNode;
}

// ─── Level color map ──────────────────────────────────────────────────────────
const levelColorMap: Record<LogLevel, string> = {
  INFO:    'text-blue-400',
  WARN:    'text-orange-400',
  ERROR:   'text-red-400',
  SUCCESS: 'text-emerald-400',
  SYNC:    'text-purple-400',
  WORK:    'text-cyan-400',
  DEBUG:   'text-zinc-500',
};

// ─── LogEntry Row ─────────────────────────────────────────────────────────────
function LogLine({ timestamp, level, message }: LogEntry) {
  return (
    <div className="flex gap-3 leading-relaxed">
      <span className="text-zinc-600 shrink-0 tabular-nums">[{timestamp}]</span>
      <span className={cn('shrink-0 min-w-14 font-semibold', levelColorMap[level])}>
        {level}
      </span>
      <span className="text-zinc-400 break-all">{message}</span>
    </div>
  );
}

// ─── LogStream ────────────────────────────────────────────────────────────────
export interface LogStreamProps extends React.HTMLAttributes<HTMLDivElement> {
  entries: LogEntry[];
  /** Show a pulsing live cursor at the bottom */
  live?: boolean;
  /** Border accent color */
  accent?: 'orange' | 'none';
}

export function LogStream({ entries, live = true, accent = 'none', className, ...props }: LogStreamProps) {
  return (
    <div
      className={cn(
        'bg-black/80 rounded-xl p-4 font-mono text-[11px] overflow-y-auto',
        accent === 'orange' ? 'border border-orange-500/20' : 'border border-white/5',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-1.5">
        {entries.map((entry, i) => (
          <LogLine key={i} {...entry} />
        ))}
        {live && (
          <div className="flex gap-3 animate-pulse mt-1">
            <span className="text-zinc-600 shrink-0">_</span>
          </div>
        )}
      </div>
    </div>
  );
}
