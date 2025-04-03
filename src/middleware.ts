// Middleware deshabilitado para permitir acceso directo sin autenticación

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // No realizar ninguna redirección - acceso abierto a todas las rutas
  return NextResponse.next();
}

export const config = {
  // No aplicar a rutas estáticas o de API
  matcher: ['/((?!_next|api|static|favicon.ico|images).*)'],
}; 