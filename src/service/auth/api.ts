import { axiosInstance } from '@/core/axios';
import type { LoginDto, AuthResponse } from './types';

export const authApi = {
  login: async (dto: LoginDto) => {
    const { data } = await axiosInstance.post<AuthResponse>('/api/auth/login', dto, { baseURL: '/' });
    return data;
  },
  logout: async () => {
    const { data } = await axiosInstance.post('/api/auth/logout', { baseURL: '/' });
    return data;
  }
};
