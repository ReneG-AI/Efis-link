"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir directamente al dashboard sin autenticación
    router.push('/dashboard');
  }, [router]);

  // Mostrar un mensaje de carga mientras se redirige
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="animate-pulse text-xl text-blue-900 font-semibold mb-4">
        Cargando EFIS Podcast Panel...
      </div>
      <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
} 