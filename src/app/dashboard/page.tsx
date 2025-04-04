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
            <h1 className="text-2xl font-bold">Efis Link</h1>
            <div className="flex items-center space-x-4">
              <span>Bienvenido, Administrador</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Panel de Control</h2>
            <p>¡Bienvenido a Efis Link!</p>
            <p className="mt-2">
              Desde aquí podrás planificar y gestionar todo el contenido para redes sociales
              de Efis Podcast y Efis App, siguiendo nuestro horario de grabación de lunes a viernes
              de 10:00 a 13:00, con publicaciones programadas para las 20:00.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Instagram</h3>
              <p>Reels e historias para generar engagement</p>
              <button
                onClick={() => router.push("/social/instagram")}
                className="mt-4 bg-white text-pink-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Gestionar
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">LinkedIn</h3>
              <p>Contenido profesional y networking</p>
              <button
                onClick={() => router.push("/social/linkedin")}
                className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Gestionar
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">YouTube</h3>
              <p>Videos y clips de los podcasts</p>
              <button
                onClick={() => router.push("/social/youtube")}
                className="mt-4 bg-white text-red-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Gestionar
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Spotify</h3>
              <p>Episodios completos del podcast</p>
              <button
                onClick={() => router.push("/social/spotify")}
                className="mt-4 bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Gestionar
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Calendario de Publicaciones</h3>
              <p>Programa y visualiza todo el contenido de la semana (L-V, 20:00).</p>
              <button
                onClick={() => router.push("/calendar")}
                className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Ver calendario
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Planificación de Grabaciones</h3>
              <p>Organiza las sesiones de grabación (L-V, 10:00-13:00).</p>
              <button
                onClick={() => router.push("/recordings")}
                className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Ver planificación
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 