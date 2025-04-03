import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

type ContentEvent = {
  id: string;
  title: string;
  type: 'podcast' | 'reel' | 'teaser' | 'post';
  date: Date | string;
  time: string;
  platform: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  userId?: string;
};

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<ContentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ContentEvent | null>(null);
  const [selectedCell, setSelectedCell] = useState<{day: string, timeSlot: string} | null>(null);

  // Fetch events from the API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          // Convertir cadenas de fecha a objetos Date
          const formattedEvents = data.map((event: any) => ({
            ...event,
            date: new Date(event.date)
          }));
          setEvents(formattedEvents);
        } else {
          console.error('Error fetching events');
          // Usar datos de ejemplo si hay error
          setEvents(getSampleEvents());
        }
      } catch (error) {
        console.error('Error:', error);
        // Usar datos de ejemplo si hay error
        setEvents(getSampleEvents());
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const getSampleEvents = (): ContentEvent[] => {
    const today = new Date();
    return [
      {
        id: '1',
        title: 'Grabación Podcast EFIS',
        type: 'podcast',
        date: addDays(today, 1),
        time: '11:00',
        platform: 'Zoom',
        status: 'scheduled',
      },
      {
        id: '2',
        title: 'Publicación Reel: Finanzas Personales',
        type: 'reel',
        date: addDays(today, 2),
        time: '20:00',
        platform: 'Instagram, TikTok',
        status: 'scheduled',
      },
      {
        id: '3',
        title: 'Teaser próximo episodio',
        type: 'teaser',
        date: addDays(today, 3),
        time: '15:00',
        platform: 'Instagram',
        status: 'scheduled',
      },
    ];
  };

  // Calcular fechas de la semana actual
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Días de la semana
  const days = Array.from({ length: 5 }, (_, i) => {
    const day = addDays(weekStart, i);
    return {
      date: day,
      name: format(day, 'EEEE', { locale: es }),
      displayDate: format(day, 'd MMM', { locale: es }),
    };
  });

  // Franjas horarias
  const timeSlots = ['09:00', '11:00', '13:00', '15:00', '17:00', '20:00'];

  // Navegar entre semanas
  const goToPreviousWeek = () => setCurrentDate(subDays(currentDate, 7));
  const goToNextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const goToCurrentWeek = () => setCurrentDate(new Date());

  // Función para mostrar el modal para crear/editar un evento
  const handleCellClick = (day: string, timeSlot: string) => {
    setSelectedCell({ day, timeSlot });
    setSelectedEvent(null);
    setShowModal(true);
  };

  // Función para mostrar el modal para editar un evento existente
  const handleEventClick = (event: ContentEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedCell(null);
    setShowModal(true);
  };

  // Función para verificar si un evento debe mostrarse en una celda específica
  const shouldShowEvent = (date: Date, timeSlot: string, event: ContentEvent) => {
    const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
    return format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && event.time === timeSlot;
  };

  // Obtener el color de fondo según el tipo de evento
  const getEventBgColor = (type: string) => {
    switch (type) {
      case 'podcast':
        return 'bg-blue-100 border-blue-300';
      case 'reel':
        return 'bg-green-100 border-green-300';
      case 'teaser':
        return 'bg-yellow-100 border-yellow-300';
      case 'post':
        return 'bg-purple-100 border-purple-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  // Manejador de guardado de evento (simulado)
  const handleSaveEvent = (event: ContentEvent) => {
    // Aquí iría el código para guardar en la API
    if (selectedEvent) {
      // Editar evento existente
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? event : e));
    } else {
      // Crear nuevo evento
      setEvents(prev => [...prev, { ...event, id: `temp-${Date.now()}` }]);
    }
    setShowModal(false);
  };

  // Manejador de eliminación de evento (simulado)
  const handleDeleteEvent = (id: string) => {
    // Aquí iría el código para eliminar en la API
    setEvents(prev => prev.filter(e => e.id !== id));
    setShowModal(false);
  };

  return (
    <div className="w-full">
      {/* Controles de Navegación */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium text-lg">
          {format(weekStart, "'Semana del' d 'al'", { locale: es })} 
          {format(weekEnd, "d 'de' MMMM, yyyy", { locale: es })}
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={goToPreviousWeek}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-sm"
          >
            &larr; Anterior
          </button>
          <button 
            onClick={goToCurrentWeek}
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded transition-colors text-sm"
          >
            Hoy
          </button>
          <button 
            onClick={goToNextWeek}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-sm"
          >
            Siguiente &rarr;
          </button>
          <button 
            onClick={() => handleCellClick(format(new Date(), 'yyyy-MM-dd'), '11:00')}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm"
          >
            + Nuevo Evento
          </button>
        </div>
      </div>
      
      {/* Calendario */}
      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {/* Encabezados de días */}
        <div className="grid grid-cols-6 bg-gray-50">
          <div className="p-3 border-b border-r border-gray-200 font-medium text-gray-500">
            Horario
          </div>
          {days.map(day => (
            <div 
              key={day.name} 
              className="p-3 border-b border-r border-gray-200 font-medium"
            >
              <div>{day.name}</div>
              <div className="text-sm text-gray-500">{day.displayDate}</div>
            </div>
          ))}
        </div>
        
        {/* Celdas de tiempo */}
        {timeSlots.map(timeSlot => (
          <div key={timeSlot} className="grid grid-cols-6">
            {/* Encabezado de hora */}
            <div className="p-3 border-b border-r border-gray-200 bg-gray-50 font-medium text-gray-500">
              {timeSlot}
            </div>
            
            {/* Celdas por día */}
            {days.map(day => (
              <div 
                key={`${day.name}-${timeSlot}`} 
                className="p-2 border-b border-r border-gray-200 min-h-[80px] relative hover:bg-gray-50 cursor-pointer"
                onClick={() => handleCellClick(format(day.date, 'yyyy-MM-dd'), timeSlot)}
              >
                {events.filter(event => shouldShowEvent(day.date, timeSlot, event)).map(event => (
                  <div 
                    key={event.id}
                    className={`text-xs p-2 mb-1 rounded border ${getEventBgColor(event.type)} hover:shadow-md transition-shadow cursor-pointer`}
                    onClick={(e) => handleEventClick(event, e)}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-gray-500 mt-1">{event.platform}</div>
                    <div className="text-xs mt-1 capitalize">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                        event.status === 'completed' ? 'bg-green-500' : 
                        event.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></span>
                      {event.status}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Leyenda */}
      <div className="flex mt-6 text-sm">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300 mr-1"></div>
          <span>Podcast</span>
        </div>
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300 mr-1"></div>
          <span>Reel</span>
        </div>
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300 mr-1"></div>
          <span>Teaser</span>
        </div>
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300 mr-1"></div>
          <span>Post</span>
        </div>
      </div>
      
      {/* Estado de carga */}
      {isLoading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-2"></div>
          <span>Cargando eventos...</span>
        </div>
      )}
      
      {/* Modal para crear/editar eventos */}
      {showModal && (
        <EventModal 
          event={selectedEvent}
          onClose={() => setShowModal(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          initialDate={selectedCell?.day}
          initialTime={selectedCell?.timeSlot}
        />
      )}
    </div>
  );
}

// Componente de Modal para Eventos
function EventModal({ 
  event, 
  onClose, 
  onSave, 
  onDelete, 
  initialDate,
  initialTime
}: { 
  event: ContentEvent | null, 
  onClose: () => void, 
  onSave: (event: ContentEvent) => void,
  onDelete: (id: string) => void,
  initialDate?: string,
  initialTime?: string
}) {
  const [formData, setFormData] = useState<Partial<ContentEvent>>(
    event || {
      title: '',
      type: 'podcast',
      date: initialDate || format(new Date(), 'yyyy-MM-dd'),
      time: initialTime || '11:00',
      platform: '',
      status: 'scheduled'
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as ContentEvent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {event ? 'Editar Evento' : 'Crear Nuevo Evento'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                name="type"
                value={formData.type || 'podcast'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="podcast">Podcast</option>
                <option value="reel">Reel</option>
                <option value="teaser">Teaser</option>
                <option value="post">Post</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                name="status"
                value={formData.status || 'scheduled'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="scheduled">Programado</option>
                <option value="in-progress">En Progreso</option>
                <option value="completed">Completado</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                name="date"
                value={typeof formData.date === 'string' ? formData.date : format(formData.date as Date, 'yyyy-MM-dd')}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Hora</label>
              <input
                type="time"
                name="time"
                value={formData.time || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Plataforma</label>
            <input
              type="text"
              name="platform"
              value={formData.platform || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ej: Instagram, TikTok"
              required
            />
          </div>
          
          <div className="flex justify-between mt-6">
            {event && (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            )}
            
            <div className="space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 