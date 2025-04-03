"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1">
        <header className="bg-blue-900 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">EFIS Podcast Panel</h1>
            <div className="flex items-center space-x-4">
              <span>Bienvenido, Administrador</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Panel de Control</h2>
            <p>¡Bienvenido al panel de administración de EFIS Podcast!</p>
            <p className="mt-2">
              Desde aquí podrás gestionar el calendario, las publicaciones y las
              redes sociales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Calendario</h3>
              <p>Gestiona los eventos y publicaciones programadas.</p>
              <button
                onClick={() => router.push("/calendar")}
                className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Ver calendario
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Publicaciones</h3>
              <p>Administra el contenido de tus episodios y publicaciones.</p>
              <button
                onClick={() => router.push("/publications")}
                className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Ver publicaciones
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Redes Sociales</h3>
              <p>Gestiona tus cuentas y publicaciones en redes sociales.</p>
              <button
                onClick={() => router.push("/social")}
                className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Ver redes sociales
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 