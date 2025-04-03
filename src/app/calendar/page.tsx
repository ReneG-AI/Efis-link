"use client";

import React, { useState, useEffect } from 'react';
import ContentCalendar from '@/components/ContentCalendar';
import Sidebar from '@/components/Sidebar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0
  });

  // Función para obtener estadísticas (simulada)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events');
        if (response.ok) {
          const events = await response.json();
          const now = new Date();
          
          const completed = events.filter((event: any) => 
            event.status === 'completed').length;
            
          const upcoming = events.filter((event: any) => 
            new Date(event.date) > now && event.status !== 'completed').length;
            
          setStats({
            total: events.length,
            completed,
            upcoming
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Calendario de Contenido</h1>
            <p className="text-gray-500 mt-1">
              Planifica y organiza tus contenidos de forma sencilla
            </p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Total Eventos</h2>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Completados</h2>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-100 p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Próximos</h2>
                  <p className="text-2xl font-bold">{stats.upcoming}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Fecha Actual</h2>
                  <p className="text-xl font-bold">{format(new Date(), 'd MMM yyyy', { locale: es })}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Planificación Semanal</h2>
            <ContentCalendar />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Consejos de Planificación</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 text-sm font-medium">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Mantén un horario constante</h3>
                    <p className="text-gray-600 text-sm">Publica en los mismos días y horas para crear hábito en tu audiencia.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 text-sm font-medium">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Diversifica el contenido</h3>
                    <p className="text-gray-600 text-sm">Alterna entre reels, podcasts, teasers y posts para mantener la variedad.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 text-sm font-medium">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Planifica con anticipación</h3>
                    <p className="text-gray-600 text-sm">Prepara tu contenido con al menos una semana de antelación.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Horarios Recomendados</h2>
              
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <h3 className="font-medium text-gray-800">Instagram</h3>
                  <p className="text-gray-600 text-sm">Mejores horas: 11:00 - 13:00 y 19:00 - 21:00</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <h3 className="font-medium text-gray-800">TikTok</h3>
                  <p className="text-gray-600 text-sm">Mejores horas: 9:00 - 11:00 y 20:00 - 22:00</p>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4 py-1">
                  <h3 className="font-medium text-gray-800">YouTube</h3>
                  <p className="text-gray-600 text-sm">Mejores horas: 15:00 - 16:00 y 18:00 - 20:00</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <h3 className="font-medium text-gray-800">Podcast</h3>
                  <p className="text-gray-600 text-sm">Mejores días: Lunes para lanzamientos, miércoles para episodios especiales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 