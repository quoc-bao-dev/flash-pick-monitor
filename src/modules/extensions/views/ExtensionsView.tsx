'use client';

import React, { useState } from 'react';
import { ListFilter, MoreVertical, Plus, Pause, Play, Info, X, Puzzle, Settings, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/common/components/ui/Button';
import { Badge } from '@/common/components/ui/Badge';
import { StatusDot } from '@/common/components/ui/StatusDot';
import { MetricCard } from '@/common/components/ui/MetricCard';
import { SectionHeader } from '@/common/components/ui';
import { useExtensionListQuery, useExtensionActionMutation } from '@/service/extensions';

import type { ExtensionStatus } from '@/service/extensions';

// ─── Constants ────────────────────────────────────────────────────────────────
const statusBadgeMap: Record<
  ExtensionStatus,
  { variant: 'success' | 'neutral' | 'error' | 'warning'; label: string; dotColor: 'green' | 'zinc' | 'red' | 'orange' }
> = {
  ACTIVE: { variant: 'success', label: 'Active', dotColor: 'green' },
  RUNNING: { variant: 'success', label: 'Running', dotColor: 'green' },
  CONNECTED: { variant: 'success', label: 'Connected', dotColor: 'green' },
  DISCONNECTED: { variant: 'neutral', label: 'Disconnected', dotColor: 'zinc' },
  ERROR: { variant: 'error', label: 'Error', dotColor: 'red' },
};

export function ExtensionsView() {
  const [activeExtensionId, setActiveExtensionId] = useState<string | null>(null);

  // ─── Data Fetching ──────────────────────────────────────────────────────────
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useExtensionListQuery({
    page: 1,
    limit: 20,
    sort: '',
    order: 'asc',
  });

  const { mutate: sendAction, isPending: isActionPending } = useExtensionActionMutation();

  const extensions = response?.data ?? [];

  const activeExtension = extensions.find((e) => e.id === activeExtensionId);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)] gap-6">
      {/* ── Table Section ────────────────────────────────────────────────── */}
      <section className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <SectionHeader
              icon={<Puzzle size={22} className="text-primary" />}
              title="Extensions"
              subtitle="Manage active bot extensions and scripts"
              size="lg"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="md" onClick={() => refetch()}>
              <ListFilter size={16} />
              Refresh
            </Button>
            <Button variant="primary" size="md">
              <Plus size={16} />
              Add Extension
            </Button>
          </div>
        </div>

        {/* Table / Loading / Error */}
        <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden border border-white/5">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <p className="text-sm font-medium">Loading extensions...</p>
            </div>
          ) : isError ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-4">
              <p className="text-sm font-medium text-red-400">Failed to load extensions</p>
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    {['Extension ID', 'Name', 'Status', 'Version', 'Profile ID', 'Action', ''].map((h) => (
                      <th key={h} className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {extensions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 text-sm">
                        No extensions found
                      </td>
                    </tr>
                  ) : (
                    extensions.map((ext) => {
                      const badgeConfig = statusBadgeMap[ext.status] || statusBadgeMap.DISCONNECTED;
                      return (
                        <tr
                          key={ext.id}
                          className="hover:bg-white/5 transition-colors group cursor-pointer"
                          onClick={() => setActiveExtensionId(ext.id)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <StatusDot
                                color={badgeConfig.dotColor}
                                pulse={ext.status === 'CONNECTED' || ext.status === 'ACTIVE'}
                                size="md"
                              />
                              <span className="font-mono text-xs text-gray-500">#{ext.id.substring(0, 8)}...</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-zinc-200">{ext.name}</td>
                          <td className="px-6 py-4">
                            <Badge variant={badgeConfig.variant as any} size="md">
                              {badgeConfig.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-zinc-400">{ext.version || 'N/A'}</td>
                          <td className="px-6 py-4 text-xs font-mono text-zinc-400">
                            {ext.profile_browser_id || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              variant="icon-ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (ext.status === 'RUNNING') {
                                  // sendAction({ id: ext.id, action: 'STOP_CRAWL' });
                                } else {
                                  sendAction({ id: ext.id, action: 'START_CRAWL' });
                                }
                              }}
                            >
                              {ext.status === 'RUNNING' ? (
                                <Pause size={16} className="text-orange-400" />
                              ) : (
                                <Play size={16} className="text-green-400" />
                              )}
                            </Button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="icon-ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveExtensionId(ext.id);
                              }}
                            >
                              <MoreVertical size={18} />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ── Side Panel ───────────────────────────────────────────────────── */}
      {activeExtensionId && activeExtension && (
        <aside className="w-full lg:w-[380px] xl:w-[420px] bg-zinc-950/40 border border-white/5 rounded-2xl lg:rounded-none lg:border-l lg:border-t-0 lg:border-b-0 lg:border-r-0 lg:bg-transparent backdrop-blur-2xl flex flex-col p-6 overflow-hidden shrink-0">
          {/* Panel header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Info size={18} className="text-orange-500" />
              <h3 className="text-lg font-headline font-bold text-white">Extension Details</h3>
            </div>
            <Button variant="icon-ghost" size="icon" onClick={() => setActiveExtensionId(null)}>
              <X size={16} />
            </Button>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pr-1">
            {/* Identity block */}
            <div className="p-4 bg-surface-container rounded-xl border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="max-w-[180px]">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1 truncate">
                    {activeExtension.name}
                  </p>
                  <p className="font-mono text-xl text-orange-400 truncate">#{activeExtension.id.substring(0, 8)}</p>
                </div>
                <Badge
                  variant={(statusBadgeMap[activeExtension.status]?.variant || 'neutral') as any}
                  size="lg"
                  dot
                  pulse={activeExtension.status === 'CONNECTED' || activeExtension.status === 'ACTIVE'}
                >
                  {statusBadgeMap[activeExtension.status]?.label || 'Unknown'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-[10px] uppercase text-zinc-500 mb-1 font-bold">Version</p>
                  <p className="text-white font-medium text-sm">{activeExtension.version || 'v1.0.0'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-zinc-500 mb-1 font-bold">Browser Profile</p>
                  <p className="text-white font-medium text-sm truncate">
                    {activeExtension.profile_browser_id || 'ID-000'}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics grid - Simulation */}
            <div className="grid grid-cols-2 gap-4">
              <MetricCard label="Uptime" value="99.9%" trend="+0.1%" trendDir="up" />
              <MetricCard label="Last Beat" value="Just now" trend="Healthy" trendDir="up" />
            </div>

            {/* Config details */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <Settings size={14} className="text-zinc-500" />
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">System Info</p>
              </div>
              <div className="p-4 border border-white/5 rounded-xl bg-white/5 space-y-3">
                <div className="flex justify-between items-center h-6">
                  <span className="text-xs text-zinc-400">Full ID</span>
                  <span className="text-xs font-mono text-zinc-200 truncate ml-4" title={activeExtension.id}>
                    {activeExtension.id}
                  </span>
                </div>
                <div className="flex justify-between items-center h-6">
                  <span className="text-xs text-zinc-400">Manifest</span>
                  <span className="text-xs font-mono text-zinc-200">V3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-3 shrink-0">
            <Button
              variant="ghost"
              size="md"
              className="bg-zinc-800 hover:bg-zinc-700 text-white"
              onClick={() => console.log('Action: RESTART')}
            >
              <Pause size={14} />
              Restart Logic
            </Button>
            <Button variant="destructive-subtle" size="md" onClick={() => console.log('Action: DELETE')}>
              <Trash2 size={14} />
              Unregister
            </Button>
          </div>
        </aside>
      )}
    </div>
  );
}
