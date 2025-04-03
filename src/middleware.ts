import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { initializeDatabase } from './lib/initializeDb';

// Variable para controlar si ya se inicializó la base de datos
let databaseInitialized = false;

// Este middleware se ejecuta antes de cada solicitud
export async function middleware(request: NextRequest) {
  // Solo intentar inicializar si no se ha hecho previamente
  if (!databaseInitialized) {
    console.log('Middleware: Iniciando proceso de inicialización de base de datos...');
    try {
      const success = await initializeDatabase();
      databaseInitialized = success;
      if (success) {
        console.log('Middleware: Base de datos inicializada correctamente');
      } else {
        console.error('Middleware: Falló la inicialización de la base de datos, pero continuando con la aplicación');
      }
    } catch (error) {
      console.error('Middleware: Error crítico durante la inicialización de la base de datos:', error);
      // Aún así marcamos como inicializado para no seguir intentándolo
      databaseInitialized = true;
    }
  }
  
  // No necesitamos modificar la solicitud, solo asegurarnos de que
  // Next.js inicialice correctamente
  return NextResponse.next();
}

// Configurar para que se ejecute en todas las rutas
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 