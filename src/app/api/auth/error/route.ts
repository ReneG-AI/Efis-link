import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Obtener la URL de redirección desde la query string
  const url = new URL(request.url);
  const callbackUrl = url.searchParams.get('callbackUrl') || '/login';
  
  // Devolver una redirección al login
  return NextResponse.redirect(new URL('/login', request.url));
}

export async function POST(request: Request) {
  // Redirigir también las peticiones POST
  return NextResponse.redirect(new URL('/login', request.url));
} 