import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

// Inicialización de Prisma
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/api/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Inicialización de la base de datos
  try {
    await prisma.$connect();
    console.log('Base de datos conectada correctamente');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
  
  // Verificar autenticación para rutas protegidas
  if (!publicRoutes.some(route => pathname.startsWith(route))) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // Redireccionar a login si no hay sesión
    if (!token && pathname !== '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Configurar para que se ejecute en todas las rutas
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 