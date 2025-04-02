import React, { useState } from 'react';

type ContentEvent = {
  id: number;
  title: string;
  type: 'podcast' | 'reel' | 'teaser' | 'post';
  date: string;
  time: string;
  platform: string;
  status: 'planned' | 'in-progress' | 'completed';
};

export default function ContentCalendar() {
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  
  // Ejemplo de datos de calendario
  const calendarData: ContentEvent[] = [
    {
      id: 1,
      title: 'Grabación Reel: Cómo ahorrar dinero',
      type: 'reel',
      date: '2023-04-03',
      time: '11:00',
      platform: 'Instagram',
      status: 'planned',
    },
    {
      id: 2,
      title: 'Publicación Reel: 5 consejos para invertir',
      type: 'reel',
      date: '2023-04-03',
      time: '20:00',
      platform: 'Instagram, TikTok',
      status: 'planned',
    },
    {
      id: 3,
      title: 'Grabación Podcast: Finanzas para Jóvenes',
      type: 'podcast',
      date: '2023-04-04',
      time: '11:00',
      platform: 'Spotify, YouTube',
      status: 'planned',
    },
    {
      id: 4,
      title: 'Publicación Teaser: Podcast de la semana',
      type: 'teaser',
      date: '2023-04-04',
      time: '20:00',
      platform: 'Instagram, TikTok',
      status: 'planned',
    },
    {
      id: 5,
      title: 'Grabación Reel: Emprendimiento exitoso',
      type: 'reel',
      date: '2023-04-05',
      time: '11:00',
      platform: 'Instagram',
      status: 'planned',
    },
    {
      id: 6,
      title: 'Publicación Reel: Finanzas personales',
      type: 'reel',
      date: '2023-04-05',
      time: '20:00',
      platform: 'Instagram, TikTok',
      status: 'planned',
    },
    {
      id: 7,
      title: 'Grabación Reel: Hábitos financieros',
      type: 'reel',
      date: '2023-04-06',
      time: '11:00',
      platform: 'Instagram',
      status: 'planned',
    },
    {
      id: 8,
      title: 'Publicación Reel: Errores financieros',
      type: 'reel',
      date: '2023-04-06',
      time: '20:00',
      platform: 'Instagram, TikTok',
      status: 'planned',
    },
    {
      id: 9,
      title: 'Grabación Teaser: Podcast de la próxima semana',
      type: 'teaser',
      date: '2023-04-07',
      time: '11:00',
      platform: 'Instagram',
      status: 'planned',
    },
    {
      id: 10,
      title: 'Publicación Podcast: Finanzas para Jóvenes',
      type: 'podcast',
      date: '2023-04-07',
      time: '20:00',
      platform: 'Spotify, YouTube',
      status: 'planned',
    },
  ];

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  const getEventsByDay = (day: string, isRecording: boolean) => {
    const dayMap: { [key: string]: string } = {
      "Lunes": "2023-04-03",
      "Martes": "2023-04-04",
      "Miércoles": "2023-04-05",
      "Jueves": "2023-04-06",
      "Viernes": "2023-04-07",
    };
    
    return calendarData.filter(
      event => event.date === dayMap[day] && (
        isRecording ? event.time === "11:00" : event.time === "20:00"
      )
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Semana del 3 al 7 de Abril, 2023</h3>
        <div>
          <button className="btn btn-secondary mr-2" onClick={() => setCurrentWeek(currentWeek - 1)}>
            Anterior
          </button>
          <button className="btn btn-secondary" onClick={() => setCurrentWeek(currentWeek + 1)}>
            Siguiente
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-2">
        <div className="bg-gray-100 p-3 font-semibold"></div>
        {days.map(day => (
          <div key={day} className="bg-gray-100 p-3 font-semibold">
            {day}
          </div>
        ))}
        
        {/* Sección de Grabación */}
        <div className="bg-gray-100 p-3 font-semibold">
          Grabación<br />
          <span className="text-xs font-normal text-gray-500">11:00 AM</span>
        </div>
        
        {days.map(day => (
          <div key={`recording-${day}`} className="border border-gray-200 p-2 min-h-24">
            {getEventsByDay(day, true).map(event => (
              <div 
                key={event.id} 
                className={`text-xs p-2 mb-1 rounded ${
                  event.type === 'podcast' ? 'bg-blue-100' : 
                  event.type === 'reel' ? 'bg-green-100' : 
                  event.type === 'teaser' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}
              >
                {event.title}
              </div>
            ))}
          </div>
        ))}
        
        {/* Sección de Publicación */}
        <div className="bg-gray-100 p-3 font-semibold">
          Publicación<br />
          <span className="text-xs font-normal text-gray-500">20:00 PM</span>
        </div>
        
        {days.map(day => (
          <div key={`publishing-${day}`} className="border border-gray-200 p-2 min-h-24">
            {getEventsByDay(day, false).map(event => (
              <div 
                key={event.id} 
                className={`text-xs p-2 mb-1 rounded ${
                  event.type === 'podcast' ? 'bg-blue-100' : 
                  event.type === 'reel' ? 'bg-green-100' : 
                  event.type === 'teaser' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}
              >
                {event.title}
                <div className="text-gray-500 mt-1">{event.platform}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="flex mt-6 text-sm">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 rounded-full bg-blue-100 mr-1"></div>
          <span>Podcast</span>
        </div>
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 rounded-full bg-green-100 mr-1"></div>
          <span>Reel</span>
        </div>
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 rounded-full bg-yellow-100 mr-1"></div>
          <span>Teaser</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-100 mr-1"></div>
          <span>Otros</span>
        </div>
      </div>
    </div>
  );
} 