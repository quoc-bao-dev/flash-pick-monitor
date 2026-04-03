// modules/workers/data/mock-workers.ts
// Replace with real API calls via service layer when backend is ready.
import type { Worker } from '../types';

export const MOCK_WORKERS: Worker[] = [
  {
    id: 'WORKER_01',
    name: 'WORKER_01',
    ipAddress: '192.168.1.104',
    status: 'ONLINE',
    resources: { cpuPercent: 65, memPercent: 42, memLabel: '5.4GB' },
    netSpeed: { history: [20, 40, 80, 60, 90] },
    uptime: '14h 22m',
    tempCelsius: 54,
    activeProcess: 'node.exe',
    sessionId: 'FP-8821-X',
    streamUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAiH20GrnSh4UUvd2GOVp8uooCZ8KJDBA5VmwocITkWoPCA-rBxHfM3KocNeiAsuF1xlLzIaogVhtU6uLslcOgZweUOioUKjNtmBf4LT_RwOsFkMZ0tZq6MkMQKvuQtJK_CfNnc8CcjwGy1qfrm-fyQOv1gudh09GwxOgBkF3S1UfxCFIRXrRGeIE7lFdWFJvJk_HmcRYxl6AJfrs2UlTtr04u0NelSc_-_OFU4iADNucbOp8ppuwYIlb4zZqFXsmvcankt6mTjt2fL',
  },
  {
    id: 'WORKER_02',
    name: 'WORKER_02',
    ipAddress: '192.168.1.108',
    status: 'IDLE',
    resources: { cpuPercent: 12, memPercent: 28, memLabel: '3.6GB' },
    netSpeed: { history: [10, 15, 10, 20, 12] },
  },
  {
    id: 'WORKER_03',
    name: 'WORKER_03',
    ipAddress: '192.168.1.112',
    status: 'BUSY',
    resources: { cpuPercent: 92, memPercent: 76, memLabel: '9.7GB' },
    netSpeed: { history: [60, 75, 90, 85, 95] },
    uptime: '06h 05m',
    tempCelsius: 78,
    activeProcess: 'chromium',
    sessionId: 'FP-9120-B',
  },
  {
    id: 'WORKER_04',
    name: 'WORKER_04',
    ipAddress: '192.168.1.115',
    status: 'OFFLINE',
    resources: { cpuPercent: 0, memPercent: 0 },
    netSpeed: { history: [0, 0, 0, 0, 0] },
  },
  {
    id: 'WORKER_05',
    name: 'WORKER_05',
    ipAddress: '192.168.1.119',
    status: 'IDLE',
    resources: { cpuPercent: 8, memPercent: 21, memLabel: '2.7GB' },
    netSpeed: { history: [5, 10, 8, 15, 9] },
  },
];
