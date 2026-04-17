export type ExtensionStatus = 'CONNECTED' | 'DISCONNECTED' | 'ACTIVE' | 'RUNNING' | 'ERROR';

export interface Extension {
  id: string;
  name: string;
  status: ExtensionStatus;
  version?: string;
  profile_browser_id?: string;
  lastUpdated?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface ExtensionFilters {
  status?: ExtensionStatus;
  name?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

