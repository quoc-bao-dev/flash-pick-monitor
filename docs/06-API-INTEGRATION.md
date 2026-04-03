---
title: Hướng Dẫn Tích Hợp API
version: 1.0.0
updated: 2026-03-29
author: Engineering Team
status: Approved
---

# 🔌 Hướng Dẫn Tích Hợp API

Tài liệu mô tả pattern tích hợp API trong Flash Pick Monitor: Axios instance, service layer structure, Tanstack Query hooks, error handling, và real-time integration.

---

## Mục Lục

- [1. Axios Instance](#1-axios-instance)
- [2. Service Layer Structure](#2-service-layer-structure)
- [3. Query Keys Convention](#3-query-keys-convention)
- [4. Query Hooks](#4-query-hooks)
- [5. Mutation Hooks](#5-mutation-hooks)
- [6. Error Handling](#6-error-handling)
- [7. Real-time (Socket.io)](#7-real-time-socketio)
- [8. Template Tạo Service Mới](#8-template-tạo-service-mới)

---

## 1. Axios Instance

### 1.1. Cấu Hình

```typescript
// core/axios/instance.ts
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 1.2. Request Interceptor

```typescript
// core/axios/interceptors.ts
import { axiosInstance } from './instance';
import { useAuthStore } from '@/core/store/authStore';

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 1.3. Response Interceptor

```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
```

> [!WARNING]
> **Không bao giờ** import `axios` trực tiếp trong file UI. Mọi API call phải qua `axiosInstance`.

---

## 2. Service Layer Structure

```text
src/service/
├── common/
│   └── types.ts            ← Type dùng chung
└── worker/                 ← Service cho domain "worker"
    ├── api.ts              ← Hàm gọi API thuần
    ├── query.ts            ← useQuery hooks
    ├── mutation.ts          ← useMutation hooks
    ├── keys.ts             ← Query key factory
    ├── types.ts            ← DTOs, request/response types
    └── index.ts            ← Barrel export
```

### 2.1. Common Types

```typescript
// service/common/types.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

---

## 3. Query Keys Convention

```typescript
// service/worker/keys.ts
export const workerKeys = {
  all:      ['workers'] as const,
  lists:    () => [...workerKeys.all, 'list'] as const,
  list:     (filters?: WorkerFilters) => [...workerKeys.lists(), filters] as const,
  details:  () => [...workerKeys.all, 'detail'] as const,
  detail:   (id: string) => [...workerKeys.details(), id] as const,
  stats:    () => [...workerKeys.all, 'stats'] as const,
};
```

**Quy tắc:**
- Key root = tên resource (số nhiều): `'workers'`, `'sessions'`
- Mỗi level thêm specificity: `all` → `lists()` → `list(filters)`
- Dùng `as const` để type-safe

---

## 4. Query Hooks

### 4.1. API Layer (thuần Axios)

```typescript
// service/worker/api.ts
import { axiosInstance } from '@/core/axios';
import type { Worker, WorkerFilters, WorkerDetail } from './types';
import type { ApiResponse, PaginatedResponse } from '../common/types';

export const workerApi = {
  getWorkers: async (filters?: WorkerFilters) => {
    const { data } = await axiosInstance.get<PaginatedResponse<Worker>>('/workers', {
      params: filters,
    });
    return data;
  },

  getWorkerById: async (id: string) => {
    const { data } = await axiosInstance.get<ApiResponse<WorkerDetail>>(`/workers/${id}`);
    return data.data;
  },

  getWorkerStats: async () => {
    const { data } = await axiosInstance.get<ApiResponse<WorkerStats>>('/workers/stats');
    return data.data;
  },
};
```

### 4.2. Query Hooks (Tanstack Query)

```typescript
// service/worker/query.ts
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { workerApi } from './api';
import { workerKeys } from './keys';
import type { WorkerFilters } from './types';

/** Hook cho danh sách workers (loading state) */
export const useWorkerListQuery = (filters?: WorkerFilters) =>
  useQuery({
    queryKey: workerKeys.list(filters),
    queryFn: () => workerApi.getWorkers(filters),
    staleTime: 5_000,
  });

/** Hook cho worker detail (Suspense, no loading state) */
export const useWorkerDetailSuspense = (id: string) =>
  useSuspenseQuery({
    queryKey: workerKeys.detail(id),
    queryFn: () => workerApi.getWorkerById(id),
  });

/** Hook cho dashboard stats (auto refetch) */
export const useWorkerStatsQuery = () =>
  useQuery({
    queryKey: workerKeys.stats(),
    queryFn: workerApi.getWorkerStats,
    refetchInterval: 10_000,  // polling mỗi 10s
  });
```

---

## 5. Mutation Hooks

```typescript
// service/worker/mutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workerApi } from './api';
import { workerKeys } from './keys';

export const useCreateWorkerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: workerApi.createWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workerKeys.lists() });
    },
  });
};

export const useRestartWorkerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workerApi.restartWorker(id),
    // Optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: workerKeys.lists() });
      const previous = queryClient.getQueryData(workerKeys.lists());

      queryClient.setQueryData(workerKeys.lists(), (old: any) => ({
        ...old,
        data: old.data.map((w: any) =>
          w.id === id ? { ...w, status: 'restarting' } : w
        ),
      }));

      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(workerKeys.lists(), context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: workerKeys.all });
    },
  });
};
```

---

## 6. Error Handling

### 6.1. Error Types

```typescript
// service/common/types.ts
export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;  // Validation errors
}
```

### 6.2. Error Handling Trong Component

```typescript
function WorkersView() {
  const { data, isLoading, isError, error } = useWorkerListQuery();

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;

  return <WorkersTable workers={data.data} />;
}
```

### 6.3. Global Error Handler

```typescript
// core/config/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { toast } from '@/common/components/overlay/Toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5_000,
    },
    mutations: {
      onError: (error: any) => {
        toast.error(error?.response?.data?.message ?? 'Đã xảy ra lỗi');
      },
    },
  },
});
```

---

## 7. Real-time (Socket.io)

### 7.1. Socket Instance

```typescript
// core/socket/instance.ts
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/core/store/authStore';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token: useAuthStore.getState().token },
      transports: ['websocket'],
    });
  }
  return socket;
}
```

### 7.2. Real-time Query Invalidation

```typescript
// Hook: auto-invalidate khi nhận socket event
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/core/socket/instance';
import { workerKeys } from '@/service/worker/keys';

export function useWorkerRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    socket.on('worker:statusChanged', () => {
      queryClient.invalidateQueries({ queryKey: workerKeys.all });
    });

    return () => { socket.off('worker:statusChanged'); };
  }, [queryClient]);
}
```

---

## 8. Template Tạo Service Mới

Khi thêm domain mới (ví dụ: `session`), tạo các file sau:

```text
service/session/
├── api.ts          ← Axios calls
├── query.ts        ← useQuery hooks
├── mutation.ts     ← useMutation hooks
├── keys.ts         ← Query key factory
├── types.ts        ← DTOs
└── index.ts        ← Barrel export
```

**Barrel export chuẩn:**

```typescript
// service/session/index.ts
export { sessionApi } from './api';
export { sessionKeys } from './keys';
export { useSessionListQuery, useSessionDetailSuspense } from './query';
export { useCreateSessionMutation, useDeleteSessionMutation } from './mutation';
export type { Session, SessionFilters, CreateSessionDto } from './types';
```

---

## Tài Liệu Liên Quan

| Tài liệu | Mô tả |
|-----------|--------|
| [Architecture](./02-ARCHITECTURE.md) | Service layer trong kiến trúc |
| [State Management](./05-STATE-MANAGEMENT.md) | Server state vs client state |
| [Configuration](./07-CONFIGURATION.md) | Biến môi trường API |
