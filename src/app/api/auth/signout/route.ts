import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Redirigir a la página de inicio después de cerrar sesión
  return NextResponse.redirect(new URL('/login', request.url));
} 