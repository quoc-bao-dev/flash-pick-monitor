import { NextResponse } from 'next/server';
import { signToken } from '@/core/utils/jwt';

const USERS = [
  {
    email: 'admin@gmail.com',
    password: 'password123',
    name: 'System Admin',
    role: 'admin'
  },
  {
    email: 'user@example.com',
    password: 'password123',
    name: 'Normal User',
    role: 'user'
  }
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const user = USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { message: 'Sai email hoặc mật khẩu' },
        { status: 401 }
      );
    }

    const token = await signToken({
      email: user.email,
      role: user.role,
      name: user.name
    });

    const response = NextResponse.json({
      token,
      user: { email: user.email, name: user.name, role: user.role }
    }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
