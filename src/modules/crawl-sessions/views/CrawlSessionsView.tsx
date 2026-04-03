'use client';

import React, { useState } from 'react';
import {
  ListFilter, MoreVertical, Plus, Pause, StopCircle, Info, X, Rows3,
} from 'lucide-react';
import { Button } from '@/common/components/ui/Button';
import { Badge } from '@/common/components/ui/Badge';
import { ProgressBar } from '@/common/components/ui/ProgressBar';
import { StatusDot } from '@/common/components/ui/StatusDot';
import { MetricCard } from '@/common/components/ui/MetricCard';
import { LogStream, type LogEntry } from '@/common/components/ui/LogStream';
import { ActionModal } from '../components/ActionModal';
import { ConfirmationModal } from '../components/ConfirmationModal';

// ─── Types ────────────────────────────────────────────────────────────────────
type SessionStatus = 'CRAWLING' | 'FINISHED' | 'FAILED' | 'PAUSED';

interface Session {
  id: string;
  url: string;
  status: SessionStatus;
  successRate: number;
  runtime: string;
  proxy: string;
  dotColor: 'orange' | 'green' | 'red' | 'zinc';
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SESSIONS: Session[] = [
  { id: 'FP-9921-X', url: 'amazon.com/dp/B08N5K...',      status: 'CRAWLING',  successRate: 94,  runtime: '02:14:55', proxy: 'US-RES-Pool-4',  dotColor: 'orange' },
  { id: 'FP-9844-A', url: 'bestbuy.com/site/rtx4090...',  status: 'FINISHED',  successRate: 100, runtime: '00:45:12', proxy: 'UK-DC-Static-1', dotColor: 'green'  },
  { id: 'FP-9812-C', url: 'target.com/p/playstation...',  status: 'FAILED',    successRate: 12,  runtime: '00:02:10', proxy: 'DE-RES-Pool-2',  dotColor: 'red'    },
];

const statusBadgeMap: Record<SessionStatus, { variant: 'warning' | 'success' | 'error' | 'neutral', label: string }> = {
  CRAWLING: { variant: 'warning', label: 'Crawling' },
  FINISHED: { variant: 'success', label: 'Finished' },
  FAILED:   { variant: 'error',   label: 'Failed'   },
  PAUSED:   { variant: 'neutral', label: 'Paused'   },
};

const progressColorMap: Record<SessionStatus, 'primary' | 'success' | 'error' | 'warning'> = {
  CRAWLING: 'warning',
  FINISHED: 'success',
  FAILED:   'error',
  PAUSED:   'warning',
};

const SIDE_LOGS: LogEntry[] = [
  { timestamp: '14:32:01', level: 'INFO',    message: 'Initializing headless browser...' },
  { timestamp: '14:32:05', level: 'SUCCESS', message: 'Proxy auth confirmed: 192.168.1.44' },
  { timestamp: '14:32:10', level: 'WARN',    message: 'Slow response from amazon.com (1.2s)' },
  { timestamp: '14:32:15', level: 'INFO',    message: 'Parsing DOM content for price...' },
  { timestamp: '14:32:18', level: 'SUCCESS', message: <span className="font-bold text-zinc-200">MATCH FOUND: $499.99</span> },
  { timestamp: '14:32:22', level: 'INFO',    message: 'Rotating to next fingerprint...' },
];

// ─── View ─────────────────────────────────────────────────────────────────────
export function CrawlSessionsView() {
  const [activeActionSession, setActiveActionSession] = useState<string | null>(null);
  const [activeConfirmationSession, setActiveConfirmationSession] = useState<string | null>(null);

  const openActionModal       = (id: string) => setActiveActionSession(id);
  const closeActionModal      = ()           => setActiveActionSession(null);
  const openConfirmationModal = (id: string) => setActiveConfirmationSession(id);
  const closeConfirmationModal = ()          => setActiveConfirmationSession(null);

  const handleActionSelected = (action: string) => {
    if (action === 'pause') {
      openConfirmationModal(activeActionSession ?? 'Unknown');
      closeActionModal();
    } else {
      console.log('Action:', action, 'session:', activeActionSession);
      closeActionModal();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)] gap-6">

      {/* ── Table Section ────────────────────────────────────────────────── */}
      <section className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-headline font-bold text-white flex items-center gap-2">
              <Rows3 size={22} className="text-primary" />
              Crawl Sessions
            </h2>
            <p className="text-zinc-400 text-sm mt-0.5 ml-8">Managing 1,248 active browser instances</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="md">
              <ListFilter size={16} />
              Filter
            </Button>
            <Button variant="primary" size="md">
              <Plus size={16} />
              New Session
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  {['Session ID', 'Target URL', 'Status', 'Success Rate', 'Runtime', 'Proxy', ''].map((h) => (
                    <th key={h} className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {SESSIONS.map((s) => {
                  const badge   = statusBadgeMap[s.status];
                  const barColor = progressColorMap[s.status];
                  return (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <StatusDot color={s.dotColor} pulse={s.status === 'CRAWLING'} size="md" />
                          <span className="font-mono text-xs text-zinc-200">#{s.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">{s.url}</td>
                      <td className="px-6 py-4">
                        <Badge variant={badge.variant} size="md">{badge.label}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 w-32">
                          <ProgressBar
                            value={s.successRate}
                            color={barColor}
                            showLabel={false}
                            animated={s.status === 'CRAWLING'}
                            className="flex-1"
                          />
                          <span className="text-xs font-mono text-zinc-400 shrink-0">{s.successRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-zinc-400">{s.runtime}</td>
                      <td className="px-6 py-4 text-xs text-zinc-400">{s.proxy}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="icon-ghost" size="icon" onClick={() => openActionModal(s.id)}>
                          <MoreVertical size={18} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Side Panel ───────────────────────────────────────────────────── */}
      <aside className="w-full lg:w-[380px] xl:w-[420px] bg-zinc-950/40 border border-white/5 rounded-2xl lg:rounded-none lg:border-l lg:border-t-0 lg:border-b-0 lg:border-r-0 lg:bg-transparent backdrop-blur-2xl flex flex-col p-6 overflow-hidden shrink-0">
        {/* Panel header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Info size={18} className="text-orange-500" />
            <h3 className="text-lg font-headline font-bold text-white">Session Details</h3>
          </div>
          <Button variant="icon-ghost" size="icon"><X size={16} /></Button>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto pr-1">
          {/* Identity block */}
          <div className="p-4 bg-surface-container rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Session Identity</p>
                <p className="font-mono text-xl text-orange-400">#FP-9921-X</p>
              </div>
              <Badge variant="active" size="lg" dot pulse>Active</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-[10px] uppercase text-zinc-500 mb-1 font-bold">Threads</p>
                <p className="text-white font-medium text-sm">128 / 512</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-zinc-500 mb-1 font-bold">Bandwidth</p>
                <p className="text-white font-medium text-sm">45.2 Mbps</p>
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Request Count"
              value="14.2k"
              trend="+12%"
              trendDir="up"
            />
            <MetricCard
              label="Error Count"
              value="42"
              trend="-4%"
              trendDir="down"
              invertTrend
            />
          </div>

          {/* Log stream */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Real-time Logs</p>
              <StatusDot color="orange" pulse />
            </div>
            <LogStream
              entries={SIDE_LOGS}
              live
              accent="orange"
              className="h-64"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-3 shrink-0">
          <Button
            variant="ghost"
            size="md"
            className="bg-zinc-800 hover:bg-zinc-700 text-white"
            onClick={() => openActionModal('FP-9921-X')}
          >
            <Pause size={14} />
            Pause
          </Button>
          <Button
            variant="destructive-subtle"
            size="md"
            onClick={() => openConfirmationModal('FP-9921-X')}
          >
            <StopCircle size={14} />
            Terminate
          </Button>
        </div>
      </aside>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      <ActionModal
        isOpen={!!activeActionSession}
        sessionId={activeActionSession}
        onClose={closeActionModal}
        onAction={handleActionSelected}
      />
      <ConfirmationModal
        isOpen={!!activeConfirmationSession}
        sessionId={activeConfirmationSession}
        onConfirm={() => { console.log('Terminate:', activeConfirmationSession); closeConfirmationModal(); }}
        onCancel={closeConfirmationModal}
      />
    </div>
  );
}
