"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si la sesión está cargando, no hacer nada
    if (status === 'loading') return;
    
    // Si hay una sesión, redirigir al dashboard
    if (session) {
      router.push('/dashboard');
    } else {
      // Si no hay sesión, redirigir al login
      router.push('/login');
    }
  }, [session, status, router]);

  // Mostrar un mensaje de carga mientras se decide la redirección
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="animate-pulse text-xl text-blue-900 font-semibold mb-4">
        Cargando EFIS Podcast Panel...
      </div>
      <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
} 