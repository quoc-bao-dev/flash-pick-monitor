'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Monitor, MoreVertical, Plus, RotateCcw, Settings, Power,
  Video, VideoOff, Maximize2, Minimize2, HandMetal,
  Thermometer, Clock, Cpu, X, Activity,
} from 'lucide-react';
import { Button } from '@/common/components/ui/Button';
import { Badge } from '@/common/components/ui/Badge';
import { MetricCard } from '@/common/components/ui/MetricCard';
import { ProgressBar } from '@/common/components/ui/ProgressBar';
import { SectionHeader } from '@/common/components/ui/SectionHeader';
import { StatusDot } from '@/common/components/ui/StatusDot';
import { IconBox } from '@/common/components/ui/IconBox';
import { BarChart } from '@/common/components/ui/BarChart';
import { WorkerStatusBadge } from '../components/WorkerStatusBadge';
import { WorkerResourceBars } from '../components/WorkerResourceBars';
import { MiniSparkline } from '../components/MiniSparkline';
import { MOCK_WORKERS } from '../data/mock-workers';
import type { Worker, WorkerStatus } from '../types';
import { cn } from '@/common/utils/cn';

// ─── Row action buttons ───────────────────────────────────────────────────────
function WorkerRowActions({ worker }: { worker: Worker }) {
  const isOffline = worker.status === 'OFFLINE';
  if (isOffline) {
    return (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="icon" title="Power On"
          className="text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400">
          <Power size={16} />
        </Button>
      </div>
    );
  }
  const isStreaming = worker.status === 'ONLINE';
  return (
    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="icon-ghost" size="icon" title="Restart">
        <RotateCcw size={15} />
      </Button>
      <Button variant="icon-ghost" size="icon" title="Settings">
        <Settings size={15} />
      </Button>
      <Button
        size="icon"
        title={isStreaming ? 'Streaming' : 'View Stream'}
        className={cn(
          'w-8 h-8 rounded-lg',
          isStreaming
            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
            : 'bg-zinc-800 text-zinc-400 hover:text-orange-500',
        )}
      >
        <Video size={15} />
      </Button>
    </div>
  );
}

// ─── Stream Panel ─────────────────────────────────────────────────────────────
function LiveStreamPanel({ worker, onClose }: { worker: Worker; onClose: () => void }) {
  const cpuColor = worker.resources.cpuPercent >= 80 ? 'error' : worker.resources.cpuPercent >= 50 ? 'warning' : 'success';
  const tempColor = (worker.tempCelsius ?? 0) >= 75 ? 'text-red-400' : 'text-orange-400';

  // ── Fullscreen ──
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync state when user presses Esc or the API changes
  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!viewportRef.current) return;
    if (!document.fullscreenElement) {
      await viewportRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  return (
    <div className="glass-panel border border-orange-500/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-orange-500/5 h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-950/60 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Video size={14} className="text-orange-500" />
            <h3 className="font-headline font-bold text-sm text-white">
              {worker.name}
            </h3>
            <Badge variant="active" size="sm" dot pulse>Live</Badge>
          </div>
          <p className="text-[10px] text-orange-500/70 font-mono mt-0.5 tracking-tight">
            LATENCY: 12ms | 1080p 60FPS
          </p>
        </div>
        <Button variant="icon-ghost" size="icon" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      {/* Stream viewport — this element goes fullscreen */}
      <div
        ref={viewportRef}
        className={cn(
          'relative bg-black overflow-hidden group cursor-crosshair flex-1 min-h-0',
          // In fullscreen the element IS the viewport, so fill it completely
          isFullscreen && 'w-screen h-screen',
        )}
      >
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-30"
          style={{
            background:
              'linear-gradient(rgba(18,16,16,0) 50%,rgba(0,0,0,0.25) 50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))',
            backgroundSize: '100% 2px,3px 100%',
          }}
        />

        {worker.streamUrl ? (
          <img
            src={worker.streamUrl}
            alt={`Live stream from ${worker.name}`}
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="flex items-center justify-center h-full flex-col gap-3 opacity-40">
            <VideoOff size={40} />
            <p className="text-xs font-mono">No stream available</p>
          </div>
        )}

        {/* Hover / always-visible controls overlay */}
        <div
          className={cn(
            'absolute bottom-4 left-4 right-4 flex justify-between items-end z-20 transition-opacity',
            isFullscreen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          )}
        >
          <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-lg">
            <span className="text-[10px] font-mono text-zinc-400">
              SESSION: {worker.sessionId ?? '—'}
            </span>
          </div>
          {/* Fullscreen toggle */}
          <Button
            variant="icon-ghost"
            size="icon"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            onClick={toggleFullscreen}
            className="bg-zinc-900/90 border border-zinc-700 hover:border-orange-500 transition-colors"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </Button>
        </div>

        {/* Fullscreen: top-right info bar (only visible in fullscreen) */}
        {isFullscreen && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
            <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg">
              <Video size={12} className="text-orange-500" />
              <span className="font-headline font-bold text-sm text-white">{worker.name}</span>
              <Badge variant="active" size="sm" dot pulse>Live</Badge>
            </div>
            <div className="bg-zinc-950/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg">
              <span className="text-[10px] font-mono text-orange-400">LATENCY: 12ms | 1080p 60FPS</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats — hidden inside fullscreen (the element only shows the video) */}
      <div className="p-4 space-y-4 bg-zinc-950/60 shrink-0 border-t border-white/5">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[9px] text-zinc-500 uppercase tracking-wide mb-1 flex items-center gap-1">
              <Clock size={10} /> Uptime
            </p>
            <p className="font-headline font-bold text-sm text-white">{worker.uptime ?? '—'}</p>
          </div>
          <div>
            <p className="text-[9px] text-zinc-500 uppercase tracking-wide mb-1 flex items-center gap-1">
              <Thermometer size={10} /> Temp
            </p>
            <p className={cn('font-headline font-bold text-sm', tempColor)}>
              {worker.tempCelsius != null ? `${worker.tempCelsius}°C` : '—'}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-zinc-500 uppercase tracking-wide mb-1 flex items-center gap-1">
              <Cpu size={10} /> Process
            </p>
            <p className="font-headline font-bold text-sm text-white truncate">
              {worker.activeProcess ?? '—'}
            </p>
          </div>
        </div>

        {/* Resource bars detail */}
        <div className="space-y-2">
          <ProgressBar
            label="CPU"
            value={worker.resources.cpuPercent}
            color={cpuColor}
            height="sm"
          />
          <ProgressBar
            label="Memory"
            value={worker.resources.memPercent}
            valueLabel={worker.resources.memLabel ?? `${worker.resources.memPercent}%`}
            color="info"
            height="sm"
          />
        </div>

        {/* Net Speed history */}
        <div>
          <p className="text-[9px] text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Activity size={10} /> Network Speed History
          </p>
          <BarChart
            data={worker.netSpeed.history.map((v, i) => ({ value: v, label: `-${4 - i}s` }))}
            height={40}
            color="primary"
            gap={3}
            showTooltip
          />
        </div>

        {/* CTA Actions */}
        <div className="flex gap-3 pt-1">
          <Button variant="primary" size="md" className="flex-1">
            <HandMetal size={14} />
            Take Control
          </Button>
          <Button
            variant="icon-ghost"
            size="icon"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            onClick={toggleFullscreen}
            className="bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-500/50"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
          <Button variant="icon-ghost" size="icon"
            className="bg-zinc-900 border border-zinc-800 rounded-xl hover:border-orange-500/50">
            <Settings size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────
export function WorkersView() {
  const [selectedWorker, setSelectedWorker] = useState<Worker>(MOCK_WORKERS[0]);

  const onlineCount = MOCK_WORKERS.filter((w) => w.status !== 'OFFLINE').length;
  const busyCount   = MOCK_WORKERS.filter((w) => w.status === 'BUSY').length;
  const offlineCount = MOCK_WORKERS.filter((w) => w.status === 'OFFLINE').length;

  return (
    <div className="flex flex-col gap-6">

      {/* ─ Page header + metrics ─ */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionHeader
          icon={<Monitor size={26} />}
          title="Active PC Workers"
          subtitle={`Managing ${MOCK_WORKERS.length} instances across North America clusters.`}
          size="lg"
        />
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" size="md">Export Logs</Button>
          <Button variant="primary" size="md">
            <Plus size={16} />
            Add Worker
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard label="Online" value={onlineCount} trendDir="up" trend={`${onlineCount}/${MOCK_WORKERS.length}`} />
        <MetricCard label="Busy"   value={busyCount}   trendDir="neutral" />
        <MetricCard label="Offline" value={offlineCount} trendDir={offlineCount > 0 ? 'down' : 'neutral'} invertTrend />
      </div>

      {/* ─ Table + Panel ─ */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-18rem)]">

        {/* Table */}
        <section className="flex-1 glass-panel rounded-2xl overflow-hidden border border-white/5 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  {['Status', 'Worker ID', 'Address', 'CPU / RAM', 'Net Speed', ''].map((h) => (
                    <th key={h} className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_WORKERS.map((worker) => {
                  const isSelected = selectedWorker.id === worker.id;
                  return (
                    <tr
                      key={worker.id}
                      onClick={() => setSelectedWorker(worker)}
                      className={cn(
                        'transition-colors cursor-pointer group',
                        isSelected
                          ? 'bg-orange-500/10 border-l-2 border-l-orange-500'
                          : 'hover:bg-white/5',
                        worker.status === 'OFFLINE' && 'opacity-60',
                      )}
                    >
                      <td className="px-6 py-4">
                        <WorkerStatusBadge status={worker.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <IconBox color={worker.status === 'OFFLINE' ? 'neutral' : 'primary'} size="sm" rounded="md">
                            <Monitor size={14} />
                          </IconBox>
                          <div>
                            <p className={cn('font-headline font-bold text-sm', worker.status === 'OFFLINE' ? 'text-zinc-500' : 'text-white')}>
                              {worker.name}
                            </p>
                            {worker.activeProcess && (
                              <p className="text-[10px] font-mono text-zinc-500">{worker.activeProcess}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-zinc-400">{worker.ipAddress}</td>
                      <td className="px-6 py-4">
                        <WorkerResourceBars resources={worker.resources} />
                      </td>
                      <td className="px-6 py-4">
                        <MiniSparkline netSpeed={worker.netSpeed} status={worker.status} />
                      </td>
                      <td className="px-6 py-4">
                        <WorkerRowActions worker={worker} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer status bar */}
          <div className="border-t border-white/5 bg-zinc-950/60 px-6 py-3 flex items-center gap-6 text-[10px] font-mono text-zinc-600 shrink-0">
            <span className="flex items-center gap-1.5">
              <StatusDot color="green" size="xs" />
              System Nominal
            </span>
            <span className="h-3 w-px bg-zinc-800" />
            <span>CLUSTER: NA-EAST-01</span>
            <span className="ml-auto">MEM: 24.1 / 128.0 GB · CPU: 18.4%</span>
          </div>
        </section>

        {/* Live Stream Panel */}
        <aside className="w-full lg:w-[360px] xl:w-[400px] shrink-0 flex flex-col">
          <LiveStreamPanel
            worker={selectedWorker}
            onClose={() => {}}
          />
        </aside>
      </div>
    </div>
  );
}
