import React from 'react';
import Sidebar from './Sidebar';
import ContentCalendar from './ContentCalendar';
import SocialLinks from './SocialLinks';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-efis-black mb-8">
          Panel de Control EFIS Podcast
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Enlaces Rápidos</h2>
            <SocialLinks />
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Seguidores</p>
                <p className="text-2xl font-bold">4,128</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Publicaciones</p>
                <p className="text-2xl font-bold">87</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Interacciones</p>
                <p className="text-2xl font-bold">1,563</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Reproducciones</p>
                <p className="text-2xl font-bold">15,423</p>
              </div>
            </div>
          </div>
          
          <div className="card lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Calendario de Contenido</h2>
            <ContentCalendar />
          </div>
        </div>
      </div>
    </div>
  );
} 