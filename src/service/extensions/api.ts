import { axiosInstance } from '@/core/axios';
import type { Extension, ExtensionFilters, PaginatedResponse } from './types';

/**
 * Extension API Service
 * Endpoint follows /api/v1/extension convention from module-clsm.md
 */
export const extensionApi = {
  /**
   * Get list of all registered extensions
   * curl /api/v1/extension/list?page=1&limit=20&sort=&order=asc
   */
  getExtensions: async (params?: ExtensionFilters) => {
    const { data } = await axiosInstance.get<PaginatedResponse<Extension>>('/api/v1/extension/list', {
      params,
    });
    return data;
  },


  /**
   * Send action to a specific extension
   * curl POST /api/v1/extension/{id}/action
   */
  sendAction: async (id: string, action: string) => {
    const { data } = await axiosInstance.post(`/api/v1/extension/${id}/action`, { action });
    return data;
  },
};
