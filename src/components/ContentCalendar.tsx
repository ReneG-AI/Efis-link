"use client";

// Componente simplificado de calendario sin dependencias externas
export default function ContentCalendar() {
  // Días de la semana
  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  // Datos simulados de eventos para la semana
  const weekEvents = {
    'Lunes': [
      { time: '10:00', title: 'Grabación Podcast', platform: 'Estudio' },
      { time: '14:00', title: 'Edición de Audio', platform: 'Trabajo' }
    ],
    'Martes': [
      { time: '11:30', title: 'Publicación Instagram', platform: 'Instagram' }
    ],
    'Miércoles': [
      { time: '09:00', title: 'Reunión de Equipo', platform: 'Zoom' },
      { time: '16:00', title: 'Publicación TikTok', platform: 'TikTok' }
    ],
    'Jueves': [
      { time: '12:00', title: 'Entrevista Invitado', platform: 'Estudio' }
    ],
    'Viernes': [
      { time: '18:00', title: 'Publicación Podcast', platform: 'Spotify' },
      { time: '19:00', title: 'Publicación YouTube', platform: 'YouTube' }
    ],
    'Sábado': [],
    'Domingo': [
      { time: '20:00', title: 'Planificación Semanal', platform: 'Notion' }
    ]
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Semana del {formatDate()}</h3>
        <button className="px-3 py-1 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors">
          + Nuevo Evento
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-4 min-w-[800px]">
          {weekDays.map((day) => (
            <div key={day} className="flex flex-col">
              <div className="bg-gray-100 p-2 text-center font-medium rounded-t-lg">
                {day}
              </div>
              <div className="bg-white border border-gray-200 rounded-b-lg p-2 h-64 overflow-y-auto">
                {weekEvents[day].length > 0 ? (
                  weekEvents[day].map((event, index) => (
                    <div 
                      key={`${day}-${index}`}
                      className="bg-blue-50 border-l-4 border-blue-500 p-2 mb-2 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <p className="text-xs text-gray-500">{event.time}</p>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-blue-600">{event.platform}</p>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    Sin eventos
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex mt-4 text-sm">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-blue-100 border-l-4 border-blue-500 mr-1"></div>
          <span>Eventos</span>
        </div>
      </div>
    </div>
  );
} 