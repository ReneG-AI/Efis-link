'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rutas en el cliente
 * Redirecciona al login si el usuario no está autenticado
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Si no está cargando y no hay sesión, redirigir al login
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname || '/')}`);
    }
  }, [status, router, pathname]);

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-700">Verificando sesión...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido
  return session ? <>{children}</> : null;
} 