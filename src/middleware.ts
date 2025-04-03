import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Este middleware se ejecuta antes de cada solicitud
export function middleware(request: NextRequest) {
  // No necesitamos modificar la solicitud, solo asegurarnos de que
  // Next.js inicialice correctamente
  return NextResponse.next();
}

// Configurar para que se ejecute en todas las rutas
export const config = {
  matcher: [
    /*
     * Excluir todas las rutas que no deberían activar el middleware.
     * Agregar más patrones aquí si es necesario.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 