import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/core/utils/jwt';

// Các đường dẫn KHÔNG cần đăng nhập
const publicPaths = ['/login', '/api/auth/login'];

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Bỏ qua check đối với tài nguyên tĩnh (_next) và file khác
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') && !pathname.startsWith('/api/auth') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.includes(pathname);

  // Payload verification if token exists
  const payload = token ? await verifyToken(token) : null;

  // Nếu không có token (hoặc token lỗi/hết hạn) mà cố vào trang private -> văng ra /login
  if (!payload && !isPublicPath) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    
    // Clear invalid cookie
    const response = NextResponse.redirect(loginUrl);
    if (token) response.cookies.delete('token');
    return response;
  }

  // Nếu đã đăng nhập thành công (token valid) mà cố vào /login -> chuyển về /
  if (payload && isPublicPath && pathname === '/login') {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = '/';
    return NextResponse.next(); // or redirect
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
