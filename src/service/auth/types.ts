import type { LoginFormData } from '@/modules/auth/schema/login.schema';

export interface User {
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type LoginDto = LoginFormData;
