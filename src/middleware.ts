import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { initializeDatabase } from './lib/initializeDb';

// Variable para controlar si ya se inicializó la base de datos
let dbInitialized = false;

// Este middleware se ejecuta antes de cada solicitud
export async function middleware(request: NextRequest) {
  // Solo inicializar la base de datos una vez
  if (!dbInitialized) {
    try {
      console.log('Iniciando inicialización de base de datos desde middleware...');
      // Inicializar la base de datos en segundo plano
      initializeDatabase().then(success => {
        if (success) {
          console.log('Base de datos inicializada correctamente desde middleware');
          dbInitialized = true;
        } else {
          console.error('Error al inicializar la base de datos desde middleware');
        }
      });
    } catch (error) {
      console.error('Error al intentar inicializar la base de datos:', error);
    }
  }
  
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