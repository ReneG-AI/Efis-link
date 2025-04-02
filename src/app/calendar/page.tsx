import React from 'react';
import ContentCalendar from '@/components/ContentCalendar';

export default function CalendarPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Calendario de Contenido</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Planificación Semanal</h2>
          <ContentCalendar />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Plan de Grabación</h2>
            <div className="border-l-4 border-blue-500 pl-4 mb-4">
              <h3 className="font-medium">Lunes</h3>
              <p className="text-gray-600">Grabación de 1 reel (11:00 AM)</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 mb-4">
              <h3 className="font-medium">Martes</h3>
              <p className="text-gray-600">Grabación del podcast completo (11:00 AM)</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 mb-4">
              <h3 className="font-medium">Miércoles</h3>
              <p className="text-gray-600">Grabación de 1 reel (11:00 AM)</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 mb-4">
              <h3 className="font-medium">Jueves</h3>
              <p className="text-gray-600">Grabación de 1 reel (11:00 AM)</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium">Viernes</h3>
              <p className="text-gray-600">Grabación de teaser del podcast (11:00 AM)</p>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Plan de Publicación</h2>
            <div className="border-l-4 border-green-500 pl-4 mb-4">
              <h3 className="font-medium">Lunes</h3>
              <p className="text-gray-600">Publicación de un reel editado (20:00 PM)</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 mb-4">
              <h3 className="font-medium">Martes</h3>
              <p className="text-gray-600">Publicación del teaser del podcast (20:00 PM)</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 mb-4">
              <h3 className="font-medium">Miércoles</h3>
              <p className="text-gray-600">Publicación de un reel editado (20:00 PM)</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 mb-4">
              <h3 className="font-medium">Jueves</h3>
              <p className="text-gray-600">Publicación de un reel editado (20:00 PM)</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium">Viernes</h3>
              <p className="text-gray-600">Publicación del podcast completo (20:00 PM)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 