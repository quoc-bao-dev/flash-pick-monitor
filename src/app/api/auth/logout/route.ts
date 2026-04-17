import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  
  // Clear the cookie by setting it to expire
  response.cookies.delete('token');
  
  return response;
}
