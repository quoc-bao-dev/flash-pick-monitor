import {
  Clock,
  Monitor,
  Terminal,
  Server,
  AlertTriangle,
  RotateCcw,
  Settings,
  Power,
  Activity,
  Database,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Button } from '@/common/components/ui/Button';
import { Badge } from '@/common/components/ui/Badge';
import { ProgressBar } from '@/common/components/ui/ProgressBar';
import { SectionHeader } from '@/common/components/ui/SectionHeader';
import { StatusDot } from '@/common/components/ui/StatusDot';
import { IconBox } from '@/common/components/ui/IconBox';
import { LogStream, type LogEntry } from '@/common/components/ui/LogStream';
import { BarChart } from '@/common/components/ui/BarChart';

export function DashboardView() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-16">
        <WorkerManagement />
        <NetworkThroughput />
      </div>
      <CrawlSessions />
      <SystemLogs />
    </div>
  );
}

function DashboardHeader() {
  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-white mb-2">
          Operational <span className="text-primary">Dashboard</span>
        </h1>
        <p className="text-secondary font-medium tracking-wide">V2.4.0 • SYSTEM UPTIME: 99.98%</p>
      </div>
      <div className="flex gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl border border-white/5">
          <StatusDot color="green" pulse size="md" />
          <span className="text-xs font-mono text-on-surface">NODE_EU_WEST_1: ACTIVE</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl border border-white/5">
          <Clock size={16} className="text-primary" />
          <span className="text-xs font-mono text-on-surface">14:02:45 UTC</span>
        </div>
      </div>
    </div>
  );
}

function WorkerManagement() {
  return (
    <section className="xl:col-span-2 space-y-6">
      <SectionHeader
        icon={<Monitor size={24} />}
        title="PC Worker Management"
        action={
          <Button variant="link" size="sm">
            View All Nodes
          </Button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Worker Card 1 — Online */}
        <div className="glass-panel p-5 rounded-2xl group hover:border-primary/30 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <IconBox color="primary" size="md">
                <Terminal size={20} />
              </IconBox>
              <div>
                <h3 className="font-bold text-white leading-tight">WORKER_ALPHA_01</h3>
                <p className="text-xs text-slate-500 font-mono">IP: 192.168.1.104</p>
              </div>
            </div>
            <Badge variant="success" size="md" dot pulse>
              Online
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <ProgressBar label="CPU Load" value={42} color="primary" />
            <ProgressBar label="Memory" value={68} valueLabel="6.4GB" color="primary" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                JS
              </div>
              <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                PY
              </div>
              <div className="w-6 h-6 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                +2
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="icon-ghost" size="icon">
                <RotateCcw size={16} />
              </Button>
              <Button variant="icon-ghost" size="icon">
                <Settings size={16} />
              </Button>
              <Button variant="destructive-subtle" size="icon">
                <Power size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Worker Card 2 — Offline */}
        <div className="glass-panel p-5 rounded-2xl group hover:border-primary/30 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <IconBox color="primary" size="md">
                <Server size={20} />
              </IconBox>
              <div>
                <h3 className="font-bold text-white leading-tight">WORKER_BETA_09</h3>
                <p className="text-xs text-slate-500 font-mono">IP: 192.168.1.105</p>
              </div>
            </div>
            <Badge variant="error" size="md" dot>
              Offline
            </Badge>
          </div>
          <div className="flex flex-col items-center justify-center py-4 space-y-2 opacity-40">
            <AlertTriangle size={32} />
            <p className="text-xs font-medium">Node Heartbeat Lost</p>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="primary" size="sm">
              Reconnect
            </Button>
            <Button variant="icon-ghost" size="icon">
              <Terminal size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const THROUGHPUT_DATA = [
  { value: 48,  label: '14:00' },
  { value: 64,  label: '14:01' },
  { value: 80,  label: '14:02' },
  { value: 112, label: '14:03' },
  { value: 96,  label: '14:04' },
  { value: 128, label: '14:05' },
  { value: 112, label: '14:06' },
  { value: 64,  label: '14:07' },
  { value: 40,  label: '14:08' },
];

function NetworkThroughput() {
  return (
    <section className="space-y-6">
      <SectionHeader icon={<Activity size={24} />} title="Network Throughput" />
      <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between overflow-hidden relative">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Ingress</p>
            <span className="text-green-400 text-xs font-mono font-bold">+12.4%</span>
          </div>
          <div className="font-headline text-5xl font-bold text-white tracking-tighter mb-1">
            842.<span className="text-primary">4</span>{' '}
            <span className="text-sm font-medium text-slate-500">MB/s</span>
          </div>
        </div>
        <BarChart
          data={THROUGHPUT_DATA}
          height={128}
          color="primary"
          gap={4}
          showTooltip
          className="mt-6 relative z-10"
        />
      </div>
    </section>
  );
}

function CrawlSessions() {
  return (
    <section className="mb-6 space-y-6">
      <SectionHeader
        icon={<Database size={24} />}
        title="Data Crawl Sessions"
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-white/5">
              <Button
                variant="icon-ghost"
                size="icon"
                className="bg-surface-container-highest text-primary w-7 h-7 rounded-md"
              >
                <LayoutGrid size={14} />
              </Button>
              <Button variant="icon-ghost" size="icon" className="w-7 h-7 rounded-md">
                <List size={14} />
              </Button>
            </div>
            <Button variant="secondary" size="md">
              Filters
            </Button>
          </div>
        }
      />
      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
          <thead>
            <tr className="bg-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
              <th className="px-6 py-4">Session ID</th>
              <th className="px-6 py-4">Target Resource</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4">Items Parsed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            <tr className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-5 font-mono text-primary">SID-88210-X</td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <StatusDot color="blue" />
                  <span className="text-white font-medium">market_index_bloomberg</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="w-48 space-y-1">
                  <Badge variant="info" size="sm">
                    Crawling
                  </Badge>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="w-48 space-y-1">
                  <ProgressBar value={84} color="info" animated showLabel={false} />
                  <p className="text-[10px] text-right text-slate-500 font-mono">84%</p>
                </div>
              </td>
              <td className="px-6 py-5 font-mono text-slate-400">142,903</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-5 font-mono text-primary">SID-88211-Y</td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <StatusDot color="blue" />
                  <span className="text-white font-medium">social_sentiment_stream</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="w-48 space-y-1">
                  <Badge variant="success" size="sm">
                    Verifying
                  </Badge>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="w-48 space-y-1">
                  <ProgressBar value={100} color="success" showLabel={false} />
                  <p className="text-[10px] text-right text-slate-500 font-mono">100%</p>
                </div>
              </td>
              <td className="px-6 py-5 font-mono text-slate-400">12,442</td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-5 font-mono text-primary">SID-88212-Z</td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <StatusDot color="orange" />
                  <span className="text-white font-medium">crypto_exchange_orderbook</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="w-48 space-y-1">
                  <Badge variant="error" size="sm">
                    Stalled
                  </Badge>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="w-48 space-y-1">
                  <ProgressBar value={12} color="error" showLabel={false} />
                  <p className="text-[10px] text-right text-red-400 font-mono">12%</p>
                </div>
              </td>
              <td className="px-6 py-5 font-mono text-slate-400">2,105</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

const SYSTEM_LOGS: LogEntry[] = [
  {
    timestamp: '14:02:41',
    level: 'INFO',
    message: (
      <>
        Establishing tunnel to <span className="text-primary underline">192.168.1.104</span>... [OK]
      </>
    ),
  },
  {
    timestamp: '14:02:42',
    level: 'SYNC',
    message: (
      <>
        Pushing session <span className="text-white">SID-88210-X</span> buffer (42KB)
      </>
    ),
  },
  {
    timestamp: '14:02:43',
    level: 'WORK',
    message: (
      <>
        Parser <span className="text-white">v2.1-legacy</span> initialized on node ALPHA
      </>
    ),
  },
  {
    timestamp: '14:02:45',
    level: 'WARN',
    message: (
      <>
        Retry attempt #4 for node <span className="text-white">BETA_09</span>. Timeout 5000ms
      </>
    ),
  },
  {
    timestamp: '14:02:45',
    level: 'INFO',
    message: (
      <>
        Ingress rate peak detected: <span className="text-primary font-bold">1.2GB/s</span>
      </>
    ),
  },
];

function SystemLogs() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <SectionHeader icon={<Terminal size={18} />} title="System Logs Stream" size="sm" />
        <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-slate-500">
          <span className="flex items-center gap-1.5">
            <StatusDot color="green" pulse />
            LIVE
          </span>
          <span>FILTER: ALL_NODES</span>
        </div>
      </div>
      <LogStream entries={SYSTEM_LOGS} live className="min-h-[200px] bg-[#080e1d]" />
    </section>
  );
}
