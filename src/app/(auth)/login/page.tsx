import { LoginView } from '@/modules/auth/views/LoginView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Kinetic System Monitoring',
  description: 'Authenticate to enter secure environment',
};

export default function LoginPage() {
  return <LoginView />;
}
