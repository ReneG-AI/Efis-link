"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO, getDay, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, addYears, subYears, startOfYear, endOfYear, addWeeks, endOfWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

// Tipos
interface Person {
  id: string;
  name: string;
  lastName: string;
  color: string;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  endTime?: string;
  platform?: string;
  contentType?: string;
  description: string;
  color: string;
  location?: string;
  isRecurring?: boolean;
  recurringDays?: number[];
  people?: string[];
}

// Iconos de componentes
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ExportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterPerson, setFilterPerson] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'year'>('week');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Lista de personas del equipo
  const people: Person[] = [
    { id: '1', name: 'René', lastName: 'Garcia', color: 'bg-purple-500' },
    { id: '2', name: 'Joan', lastName: 'Alonso', color: 'bg-yellow-500' },
    { id: '3', name: 'Ayub', lastName: 'Allach', color: 'bg-green-500' },
    { id: '4', name: 'Albert', lastName: 'Llamas', color: 'bg-blue-500' }
  ];

  // Evento de grabación base
  const recordingEventBase = {
    title: 'Grabación Podcast',
    time: '10:00',
    endTime: '13:00',
    description: 'Sesión de grabación del podcast',
    location: 'Lleida Cowork, Carrer Torres de Sanui, 5, entresòl 1er dreta, 25006 Lleida',
    color: 'bg-gray-700',
    isRecurring: true,
    recurringDays: [1, 2, 3, 4, 5], // Lunes a viernes
    people: ['1', '2', '3', '4'] // Todos los miembros
  };

  // Plataformas para publicación
  const platforms = [
    { name: 'Instagram', color: 'bg-pink-500' },
    { name: 'LinkedIn', color: 'bg-blue-500' },
    { name: 'YouTube', color: 'bg-red-500' },
    { name: 'TikTok', color: 'bg-black' },
    { name: 'Spotify', color: 'bg-green-500' }
  ];
  
  const contentTypes = [
    'Reel', 'Historia', 'Post', 'Carrusel', 'Video', 'Podcast', 'Artículo', 'Grabación'
  ];

  // Estado de eventos
  const [events, setEvents] = useState<Event[]>(() => {
    // Intentar cargar eventos desde localStorage
    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('calendar-events');
      if (savedEvents) {
        try {
          // Convertir las fechas de string a objetos Date
          const parsedEvents = JSON.parse(savedEvents, (key, value) => {
            if (key === 'date') {
              return new Date(value);
            }
            return value;
          });
          return parsedEvents;
        } catch (error) {
          console.error('Error al cargar eventos guardados:', error);
        }
      }
    }
    
    // Eventos por defecto si no hay datos guardados
    return [
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
    ];
  });
  
  // Guardar eventos en localStorage cuando cambien
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('calendar-events', JSON.stringify(events));
    }
  }, [events]);
  
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    date: new Date(),
    time: '20:00',
    platform: 'Instagram',
    contentType: 'Reel',
    description: '',
    color: 'bg-pink-500',
    people: []
  });

  // Generar eventos de grabación recurrentes
  useEffect(() => {
    const generateRecurringEvents = () => {
      // Obtener la fecha actual y el inicio de la semana
      const today = new Date();
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      
      // Comprobar si ya existen eventos de grabación para esta semana
      const hasRecordingEventsThisWeek = events.some(event => 
        event.isRecurring && 
        event.date >= weekStart && 
        event.date < addDays(weekStart, 7) &&
        event.title === recordingEventBase.title
      );
      
      // Si no hay eventos de grabación, generarlos
      if (!hasRecordingEventsThisWeek) {
        const newRecordingEvents: Event[] = [];
        
        // Para cada día de la semana (0-6, donde 0 es domingo)
        for (let i = 0; i < 7; i++) {
          const currentDay = addDays(weekStart, i);
          const dayOfWeek = getDay(currentDay);
          
          // Si es un día laborable (lunes a viernes: 1-5)
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            newRecordingEvents.push({
              id: `recording-${currentDay.getTime()}`,
              title: recordingEventBase.title,
              date: currentDay,
              time: recordingEventBase.time,
              endTime: recordingEventBase.endTime,
              description: recordingEventBase.description,
              color: recordingEventBase.color,
              location: recordingEventBase.location,
              isRecurring: true,
              contentType: 'Grabación',
              recurringDays: recordingEventBase.recurringDays,
              people: recordingEventBase.people
            });
          }
        }
        
        // Añadir los nuevos eventos al estado
        setEvents(prevEvents => [...prevEvents, ...newRecordingEvents]);
      }
    };
    
    generateRecurringEvents();
  }, [currentDate, events]);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

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
    setSelectedEvent(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEditing(true);
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

  const handlePersonToggle = (personId: string) => {
    const updatedPeople = newEvent.people?.includes(personId)
      ? newEvent.people.filter(id => id !== personId)
      : [...(newEvent.people || []), personId];
    
    setNewEvent({
      ...newEvent,
      people: updatedPeople
    });
  };

  const handleSaveEvent = () => {
    if (isEditing && selectedEvent) {
      // Actualizar evento existente
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === selectedEvent.id 
            ? { ...event, ...newEvent, id: event.id } 
            : event
        )
      );
    } else {
      // Crear nuevo evento
      const eventToSave = {
        id: Math.random().toString(36).substring(2, 9),
        ...newEvent
      };
      
      setEvents([...events, eventToSave]);
    }
    
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      date: new Date(),
      time: '20:00',
      platform: 'Instagram',
      contentType: 'Reel',
      description: '',
      color: 'bg-pink-500',
      people: []
    });
    setSelectedEvent(null);
    setIsEditing(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const getEventsForDay = (day: Date) => {
    let filteredEvents = events.filter(event => isSameDay(event.date, day));
    
    // Aplicar filtros
    if (filterPerson) {
      filteredEvents = filteredEvents.filter(event => 
        event.people?.includes(filterPerson)
      );
    }
    
    if (filterPlatform) {
      filteredEvents = filteredEvents.filter(event => 
        event.platform === filterPlatform
      );
    }
    
    return filteredEvents;
  };

  // Funciones de exportación
  const exportToGoogleCalendar = () => {
    // Crear eventos en formato Google Calendar
    const filteredEvents = filterPerson || filterPlatform 
      ? events.filter(event => {
          if (filterPerson && !event.people?.includes(filterPerson)) return false;
          if (filterPlatform && event.platform !== filterPlatform) return false;
          return true;
        })
      : events;
      
    const googleCalendarEvents = filteredEvents.map(event => {
      const eventDate = event.date.toISOString().split('T')[0];
      const [hours, minutes] = event.time.split(':');
      const startTime = `${eventDate}T${hours}:${minutes}:00`;
      
      let endTime;
      if (event.endTime) {
        const [endHours, endMinutes] = event.endTime.split(':');
        endTime = `${eventDate}T${endHours}:${endMinutes}:00`;
      } else {
        // Si no hay hora de fin, asumimos 1 hora de duración
        const eventDateTime = new Date(event.date);
        eventDateTime.setHours(parseInt(hours), parseInt(minutes) + 60);
        endTime = eventDateTime.toISOString().split('.')[0];
      }
      
      // Formato: descripción con detalles adicionales
      let details = event.description;
      if (event.location) details += `\nLugar: ${event.location}`;
      if (event.platform) details += `\nPlataforma: ${event.platform}`;
      if (event.people && event.people.length > 0) {
        const peopleNames = event.people.map(id => 
          people.find(p => p.id === id)?.name || ''
        ).join(', ');
        details += `\nPersonas: ${peopleNames}`;
      }
      
      // Construir la URL para Google Calendar
      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        dates: `${startTime.replace(/[-:]/g, '')}/${endTime.replace(/[-:]/g, '')}`,
        details,
        ...(event.location && { location: event.location })
      });
      
      return `https://www.google.com/calendar/render?${params.toString()}`;
    });
    
    // Abrir la URL para el primer evento y mostrar mensaje para múltiples eventos
    if (googleCalendarEvents.length > 0) {
      window.open(googleCalendarEvents[0], '_blank');
      
      if (googleCalendarEvents.length > 1) {
        alert(`Se abrirá el primer evento en Google Calendar. Para añadir los ${googleCalendarEvents.length} eventos, deberás repetir el proceso para cada uno.`);
      }
    }
  };

  const exportToCSV = () => {
    // Filtrar eventos según los filtros aplicados
    const filteredEvents = filterPerson || filterPlatform 
      ? events.filter(event => {
          if (filterPerson && !event.people?.includes(filterPerson)) return false;
          if (filterPlatform && event.platform !== filterPlatform) return false;
          return true;
        })
      : events;
    
    // Cabeceras del CSV
    const headers = [
      'Título', 'Fecha', 'Hora inicio', 'Hora fin', 'Descripción', 
      'Ubicación', 'Plataforma', 'Tipo de contenido', 'Personas'
    ];
    
    // Convertir eventos a filas CSV
    const rows = filteredEvents.map(event => {
      const peopleNames = event.people 
        ? event.people.map(id => people.find(p => p.id === id)?.name || '').join(', ')
        : '';
      
      return [
        event.title,
        format(event.date, 'dd/MM/yyyy'),
        event.time,
        event.endTime || '',
        event.description,
        event.location || '',
        event.platform || '',
        event.contentType || '',
        peopleNames
      ];
    });
    
    // Crear el contenido del CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `efis-link-calendario-${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Funciones para cambiar el modo de visualización
  const handleViewModeChange = (mode: 'week' | 'month' | 'year') => {
    setViewMode(mode);
    
    // Resetear filtros de fechas específicas
    setShowDateFilter(false);
    
    // Ajustar la fecha actual según el modo
    const today = new Date();
    switch (mode) {
      case 'week':
        setCurrentDate(today);
        break;
      case 'month':
        setCurrentDate(startOfMonth(today));
        break;
      case 'year':
        setCurrentDate(startOfYear(today));
        break;
    }
  };

  // Manejar navegación en diferentes modos
  const handlePrevious = () => {
    switch (viewMode) {
      case 'week':
        setCurrentDate(addDays(currentDate, -7));
        break;
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(subYears(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (viewMode) {
      case 'week':
        setCurrentDate(addDays(currentDate, 7));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'year':
        setCurrentDate(addYears(currentDate, 1));
        break;
    }
  };

  // Manejar filtro de fechas específicas
  const handleDateFilterToggle = () => {
    setShowDateFilter(!showDateFilter);
    if (showDateFilter) {
      // Si estamos ocultando el filtro, volver al modo normal
      handleViewModeChange(viewMode);
    }
  };

  const handleDateFilterApply = () => {
    if (startDate && endDate) {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      
      if (start > end) {
        alert('La fecha de inicio debe ser anterior a la fecha de fin.');
        return;
      }
      
      setCurrentDate(start);
      // No establecemos un modo específico, ya que estamos en modo personalizado
    }
  };

  // Calcular días a mostrar según el modo de visualización
  const getDaysToShow = () => {
    if (showDateFilter && startDate && endDate) {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      
      if (start > end) {
        return []; // Fechas inválidas
      }
      
      return eachDayOfInterval({ start, end });
    }
    
    switch (viewMode) {
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
      
      case 'month':
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const firstDay = startOfWeek(monthStart, { weekStartsOn: 1 });
        const lastDay = addDays(endOfWeek(monthEnd, { weekStartsOn: 1 }), 1);
        return eachDayOfInterval({ start: firstDay, end: lastDay });
      
      case 'year':
        const yearStart = startOfYear(currentDate);
        const yearEnd = endOfYear(currentDate);
        return eachDayOfInterval({ 
          start: startOfMonth(yearStart), 
          end: endOfMonth(yearEnd) 
        }).filter(date => date.getDate() === 1); // Solo mostrar el primer día de cada mes
      
      default:
        return [];
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1">
        <header className="bg-blue-900 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <CalendarIcon />
              <h1 className="text-2xl font-bold ml-2">Calendario de Publicaciones</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span>{format(currentDate, 'MMMM yyyy', { locale: es })}</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {/* Controles de visualización */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewModeChange('week')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'week' 
                      ? 'bg-blue-900 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Semana
                </button>
                <button 
                  onClick={() => handleViewModeChange('month')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'month' 
                      ? 'bg-blue-900 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Mes
                </button>
                <button 
                  onClick={() => handleViewModeChange('year')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'year' 
                      ? 'bg-blue-900 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Año
                </button>
                <button 
                  onClick={handleDateFilterToggle}
                  className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
                    showDateFilter 
                      ? 'bg-blue-900 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  <FilterIcon />
                  <span className="ml-1">Fechas</span>
                </button>
              </div>

              {showDateFilter && (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center">
                    <span className="mr-2">Desde:</span>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border rounded p-2"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">Hasta:</span>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border rounded p-2"
                    />
                  </div>
                  <button 
                    onClick={handleDateFilterApply}
                    className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                  >
                    Aplicar
                  </button>
                </div>
              )}
            </div>

            {/* Filtros y controles de navegación */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div className="flex gap-4 flex-wrap md:flex-nowrap">
                <button 
                  onClick={handlePrevious}
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                >
                  {viewMode === 'week' ? 'Semana Anterior' : 
                   viewMode === 'month' ? 'Mes Anterior' : 'Año Anterior'}
                </button>
                <h2 className="text-xl font-semibold whitespace-nowrap">
                  {viewMode === 'week' ? (
                    <>
                      {format(getDaysToShow()[0], 'dd')} - {format(getDaysToShow()[getDaysToShow().length - 1], 'dd')} de {format(getDaysToShow()[0], 'MMMM', { locale: es })}
                    </>
                  ) : viewMode === 'month' ? (
                    format(currentDate, 'MMMM yyyy', { locale: es })
                  ) : (
                    format(currentDate, 'yyyy')
                  )}
                </h2>
                <button 
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                >
                  {viewMode === 'week' ? 'Siguiente Semana' : 
                   viewMode === 'month' ? 'Siguiente Mes' : 'Siguiente Año'}
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                <select
                  value={filterPerson || ''}
                  onChange={(e) => setFilterPerson(e.target.value || null)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las personas</option>
                  {people.map(person => (
                    <option key={person.id} value={person.id}>{person.name} {person.lastName}</option>
                  ))}
                </select>

                <select
                  value={filterPlatform || ''}
                  onChange={(e) => setFilterPlatform(e.target.value || null)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las plataformas</option>
                  {platforms.map(platform => (
                    <option key={platform.name} value={platform.name}>{platform.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={exportToGoogleCalendar}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <ExportIcon />
                  <span>Google Calendar</span>
                </button>
                <button 
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <DownloadIcon />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            {/* Calendario según el modo de visualización */}
            <div className={`grid ${
              viewMode === 'week' ? 'grid-cols-7' : 
              viewMode === 'month' ? 'grid-cols-7' : 
              'grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
            } gap-2`}>
              {getDaysToShow().map((day, index) => {
                const isCurrentDay = isSameDay(day, new Date());
                const eventsForDay = getEventsForDay(day);
                
                return (
                  <div 
                    key={index} 
                    className={`border rounded-lg overflow-hidden ${
                      viewMode === 'year' ? 'h-28' : ''
                    }`}
                  >
                    <div className={`p-2 ${isCurrentDay ? 'bg-blue-100 font-bold' : 'bg-gray-100'}`}>
                      <div className="text-center">
                        {viewMode === 'week' && (
                          <div className="text-sm text-gray-500">
                            {format(day, 'EEEE', { locale: es })}
                          </div>
                        )}
                        {viewMode === 'year' ? (
                          <div className="font-medium">{format(day, 'MMMM', { locale: es })}</div>
                        ) : (
                          <div className="text-lg">
                            {format(day, 'd')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div 
                      className={`${
                        viewMode === 'week' 
                          ? 'min-h-[200px] max-h-[300px]' 
                          : viewMode === 'month' 
                            ? 'min-h-[100px] max-h-[150px]' 
                            : 'min-h-0'
                      } p-2 cursor-pointer overflow-y-auto`}
                      onClick={() => handleDayClick(day)}
                    >
                      {viewMode === 'year' ? (
                        // En vista anual, mostrar solo el número de eventos
                        <div className="text-center">
                          <span className="font-medium">{eventsForDay.length}</span> 
                          <span className="text-xs text-gray-500"> eventos</span>
                        </div>
                      ) : (
                        // En vista semanal o mensual, mostrar los eventos
                        <>
                          {eventsForDay.map(event => (
                            <div 
                              key={event.id} 
                              className={`p-2 mb-2 rounded-lg ${event.color} text-white text-sm relative group`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                            >
                              <div className="font-bold">{event.title}</div>
                              <div className="text-xs">
                                {event.time} 
                                {event.endTime && ` - ${event.endTime}`} 
                                {event.platform && ` · ${event.platform}`}
                              </div>
                              {event.people && event.people.length > 0 && (
                                <div className="flex -space-x-1 mt-1">
                                  {event.people.map(personId => {
                                    const person = people.find(p => p.id === personId);
                                    return person ? (
                                      <div 
                                        key={personId}
                                        className={`w-5 h-5 rounded-full ${person.color} flex items-center justify-center text-xs border border-white overflow-hidden`}
                                        title={`${person.name} ${person.lastName}`}
                                      >
                                        {person.name.charAt(0)}{person.lastName.charAt(0)}
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              )}
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
                          {eventsForDay.length === 0 && (
                            <div className="text-center text-gray-400 text-xs p-2">
                              + Añadir evento
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lista de próximas publicaciones */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Próximas Publicaciones</h3>
              <div className="space-y-4">
                {events
                  .filter(event => !event.isRecurring) // Excluir eventos de grabación recurrentes
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
                        {event.people && event.people.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {event.people.map(personId => {
                              const person = people.find(p => p.id === personId);
                              return person ? (
                                <span 
                                  key={personId}
                                  className={`px-2 py-1 rounded-full text-xs ${person.color} text-white`}
                                >
                                  {person.name} {person.lastName}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => deleteEvent(event.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                
                {/* Si no hay eventos próximos */}
                {events.filter(event => !event.isRecurring).length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No hay eventos próximos programados.
                  </div>
                )}
              </div>
            </div>
            
            {/* Resumen */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Resumen</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Total eventos</span>
                    <span className="font-bold text-lg">{events.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Grabaciones</span>
                    <span className="font-bold text-lg">
                      {events.filter(e => e.isRecurring).length}
                    </span>
                  </div>
                </div>
                
                <h4 className="font-medium">Por plataforma</h4>
                <div className="space-y-2">
                  {platforms.map(platform => {
                    const count = events.filter(e => e.platform === platform.name).length;
                    return (
                      <div key={platform.name} className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${platform.color} mr-2`}></div>
                          <span>{platform.name}</span>
                        </div>
                        <div className="font-semibold">{count}</div>
                      </div>
                    );
                  })}
                </div>

                <h4 className="font-medium">Por persona</h4>
                <div className="space-y-2">
                  {people.map(person => {
                    const count = events.filter(e => e.people?.includes(person.id)).length;
                    return (
                      <div key={person.id} className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full ${person.color} flex items-center justify-center text-xs text-white`}>
                            {person.name.charAt(0)}{person.lastName.charAt(0)}
                          </div>
                          <span className="ml-2">{person.name} {person.lastName}</span>
                        </div>
                        <div className="font-semibold">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para crear/editar evento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <input 
                    type="text" 
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Título del evento"
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
                    <label className="block text-sm font-medium mb-1">Hora inicio</label>
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
                    <label className="block text-sm font-medium mb-1">Hora fin (opcional)</label>
                    <input 
                      type="time" 
                      name="endTime"
                      value={newEvent.endTime || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Contenido</label>
                    <select 
                      name="contentType"
                      value={newEvent.contentType || ''}
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
                  <label className="block text-sm font-medium mb-1">Plataforma (para publicaciones)</label>
                  <select 
                    name="platform"
                    value={newEvent.platform || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Ninguna</option>
                    {platforms.map(platform => (
                      <option key={platform.name} value={platform.name}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea 
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Descripción del evento"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ubicación (opcional)</label>
                  <input 
                    type="text" 
                    name="location"
                    value={newEvent.location || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dirección o lugar del evento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Personas</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {people.map(person => (
                      <div 
                        key={person.id}
                        className={`flex items-center space-x-2 p-2 rounded cursor-pointer
                          ${newEvent.people?.includes(person.id) 
                            ? `${person.color} text-white` 
                            : 'bg-gray-100'}`}
                        onClick={() => handlePersonToggle(person.id)}
                      >
                        <input 
                          type="checkbox" 
                          checked={newEvent.people?.includes(person.id) || false}
                          onChange={() => handlePersonToggle(person.id)}
                          className="h-4 w-4"
                        />
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs mr-1">
                            {person.name.charAt(0)}{person.lastName.charAt(0)}
                          </div>
                          <span>{person.name} {person.lastName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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