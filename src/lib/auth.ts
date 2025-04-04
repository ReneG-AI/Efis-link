import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Middleware para proteger rutas API que requieren autenticación
 * @param handler - El controlador de la ruta API
 * @returns El controlador protegido que verifica la autenticación
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, session: any) => Promise<NextResponse>
) {
  try {
    // Verificar sesión del usuario
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado. Debe iniciar sesión.' },
        { status: 401 }
      );
    }

    // Si está autenticado, pasar al controlador con la sesión
    return await handler(request, session);
  } catch (error) {
    console.error('Error de autenticación:', error);
    return NextResponse.json(
      { error: 'Error en el servidor durante la autenticación' },
      { status: 500 }
    );
  }
}

/**
 * Obtiene la sesión del usuario desde el servidor
 * @returns La sesión del usuario o null si no está autenticado
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Comprueba si un usuario está autenticado
 * @returns true si el usuario está autenticado, false en caso contrario
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
} 