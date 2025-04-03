import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/api/auth', '/_next', '/favicon.ico', '/images'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar autenticación para rutas protegidas
  if (!publicRoutes.some(route => pathname.startsWith(route))) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // Redireccionar a login si no hay sesión
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Configurar para que se ejecute en todas las rutas excepto recursos estáticos
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images).*)'],
}; 