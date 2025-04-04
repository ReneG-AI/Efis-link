"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  platform: string;
  contentType: string;
  description: string;
  color: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Publicación Instagram',
      date: new Date(),
      time: '20:00',
      platform: 'Instagram',
      contentType: 'Reel',
      description: 'Resumen del podcast sobre desarrollo personal',
      color: 'bg-pink-500'
    },
    {
      id: '2',
      title: 'Publicación LinkedIn',
      date: addDays(new Date(), 1),
      time: '20:00',
      platform: 'LinkedIn',
      contentType: 'Post',
      description: 'Artículo sobre liderazgo empresarial',
      color: 'bg-blue-500'
    },
    {
      id: '3',
      title: 'Publicación YouTube',
      date: addDays(new Date(), 2),
      time: '20:00',
      platform: 'YouTube',
      contentType: 'Video',
      description: 'Entrevista completa con experto en marketing',
      color: 'bg-red-500'
    }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    date: new Date(),
    time: '20:00',
    platform: 'Instagram',
    contentType: 'Reel',
    description: '',
    color: 'bg-pink-500'
  });

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const platforms = [
    { name: 'Instagram', color: 'bg-pink-500' },
    { name: 'LinkedIn', color: 'bg-blue-500' },
    { name: 'YouTube', color: 'bg-red-500' },
    { name: 'TikTok', color: 'bg-black' },
    { name: 'Spotify', color: 'bg-green-500' }
  ];
  
  const contentTypes = [
    'Reel', 'Historia', 'Post', 'Carrusel', 'Video', 'Podcast', 'Artículo'
  ];

  const handlePrevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setNewEvent({
      ...newEvent,
      date: day,
    });
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'platform') {
      const selectedPlatform = platforms.find(p => p.name === value);
      setNewEvent({
        ...newEvent,
        [name]: value,
        color: selectedPlatform ? selectedPlatform.color : 'bg-gray-500'
      });
    } else {
      setNewEvent({
        ...newEvent,
        [name]: value
      });
    }
  };

  const handleSaveEvent = () => {
    const eventToSave = {
      id: Math.random().toString(36).substring(2, 9),
      ...newEvent
    };
    
    setEvents([...events, eventToSave]);
    setShowModal(false);
    setNewEvent({
      title: '',
      date: new Date(),
      time: '20:00',
      platform: 'Instagram',
      contentType: 'Reel',
      description: '',
      color: 'bg-pink-500'
    });
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1">
        <header className="bg-blue-900 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Calendario de Publicaciones</h1>
            <div className="flex items-center space-x-4">
              <span>{format(currentDate, 'MMMM yyyy', { locale: es })}</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={handlePrevWeek}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
              >
                Semana Anterior
              </button>
              <h2 className="text-xl font-semibold">
                {format(weekStart, 'dd')} - {format(addDays(weekStart, 6), 'dd')} de {format(weekStart, 'MMMM', { locale: es })}
              </h2>
              <button 
                onClick={handleNextWeek}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
              >
                Siguiente Semana
              </button>
            </div>

            <div className="grid grid-cols-7 gap-4">
              {weekDays.map((day, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className={`p-2 ${isSameDay(day, new Date()) ? 'bg-blue-100 font-bold' : 'bg-gray-100'}`}>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">
                        {format(day, 'EEEE', { locale: es })}
                      </div>
                      <div className="text-lg">
                        {format(day, 'd')}
                      </div>
                    </div>
                  </div>
                  <div 
                    className="min-h-[120px] p-2 cursor-pointer"
                    onClick={() => handleDayClick(day)}
                  >
                    {getEventsForDay(day).map(event => (
                      <div 
                        key={event.id} 
                        className={`p-2 mb-2 rounded-lg ${event.color} text-white text-sm relative group`}
                      >
                        <div className="font-bold">{event.title}</div>
                        <div>{event.time} - {event.platform}</div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEvent(event.id);
                          }}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {getEventsForDay(day).length === 0 && (
                      <div className="text-center text-gray-400 text-sm p-2">
                        + Añadir evento
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Próximas Publicaciones</h3>
              <div className="space-y-4">
                {events
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 5)
                  .map(event => (
                    <div key={event.id} className="flex items-center p-3 border rounded-lg">
                      <div className={`w-4 h-4 rounded-full ${event.color} mr-3`}></div>
                      <div className="flex-1">
                        <div className="font-semibold">{event.title}</div>
                        <div className="text-sm text-gray-500">
                          {format(event.date, 'dd/MM/yyyy')} - {event.time} - {event.platform}
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteEvent(event.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Resumen por Plataforma</h3>
              <div className="space-y-4">
                {platforms.map(platform => {
                  const count = events.filter(e => e.platform === platform.name).length;
                  return (
                    <div key={platform.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${platform.color} mr-3`}></div>
                        <span>{platform.name}</span>
                      </div>
                      <div className="font-semibold">{count} publicaciones</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para crear evento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Crear Nueva Publicación</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <input 
                    type="text" 
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Título de la publicación"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha</label>
                    <div className="text-gray-700 p-2 bg-gray-100 rounded">
                      {selectedDay ? format(selectedDay, 'dd/MM/yyyy') : ''}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Hora</label>
                    <input 
                      type="time" 
                      name="time"
                      value={newEvent.time}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Plataforma</label>
                    <select 
                      name="platform"
                      value={newEvent.platform}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {platforms.map(platform => (
                        <option key={platform.name} value={platform.name}>
                          {platform.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Contenido</label>
                    <select 
                      name="contentType"
                      value={newEvent.contentType}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {contentTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea 
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Descripción de la publicación"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveEvent}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                  disabled={!newEvent.title}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 