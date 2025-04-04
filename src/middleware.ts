// Middleware deshabilitado para permitir acceso directo sin autenticación

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/api/auth'];
  
  // Comprobar si la ruta actual es pública
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Obtener token de sesión
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Permitir acceso a rutas públicas sin autenticación
  if (isPublicPath) {
    // Si el usuario ya está autenticado y trata de acceder a login, redirigir al dashboard
    if (token && request.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Para todas las demás rutas, verificar autenticación
  if (!token) {
    // Guardar la URL a la que se intentaba acceder para redireccionar después del login
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(url);
  }

  // Usuario autenticado, permitir acceso
  return NextResponse.next();
}

export const config = {
  // Aplicar middleware a todas las rutas excepto a recursos estáticos
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|.*\\.png$).*)'],
}; 