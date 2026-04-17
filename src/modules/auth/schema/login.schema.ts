import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .max(128, 'Mật khẩu tối đa 128 ký tự'),
  maintainSession: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
