"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <header className="bg-blue-900 text-white p-4">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
          </header>

          <main className="container mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Bienvenido, {session?.user?.name || 'Usuario'}</h2>
              <p className="text-gray-700 mb-4">
                Esta es la plataforma de gestión de contenido para Efis Link. Aquí podrás planificar, organizar y controlar todo el contenido para redes sociales.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Calendario</h3>
                <p className="text-gray-600 mb-4">Planifica y organiza las publicaciones en un calendario interactivo.</p>
                <a href="/calendar" className="text-blue-600 hover:underline">Ir al calendario →</a>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Ideas de Contenido</h3>
                <p className="text-gray-600 mb-4">Administra y guarda ideas para futuras publicaciones.</p>
                <a href="/ideas" className="text-blue-600 hover:underline">Ver ideas →</a>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Estadísticas</h3>
                <p className="text-gray-600 mb-4">Visualiza el rendimiento de tus publicaciones en todas las plataformas.</p>
                <a href="/stats" className="text-blue-600 hover:underline">Ver estadísticas →</a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
} 