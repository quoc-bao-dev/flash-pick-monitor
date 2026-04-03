// modules/workers/types.ts
export type WorkerStatus = 'ONLINE' | 'IDLE' | 'BUSY' | 'OFFLINE';

export interface WorkerResource {
  cpuPercent: number;
  memPercent: number;
  memLabel?: string;
}

export interface WorkerNetSpeed {
  /** values 0-100 for mini sparkline */
  history: number[];
}

export interface Worker {
  id: string;
  name: string;
  ipAddress: string;
  status: WorkerStatus;
  resources: WorkerResource;
  netSpeed: WorkerNetSpeed;
  uptime?: string;
  tempCelsius?: number;
  activeProcess?: string;
  sessionId?: string;
  streamUrl?: string;
}
