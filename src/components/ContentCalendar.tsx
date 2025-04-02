import React from 'react';

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
  ];

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Semana del 3 al 7 de Abril, 2023</h3>
        <div>
          <button className="btn btn-secondary mr-2">
            Anterior
          </button>
          <button className="btn btn-secondary">
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
            {day === "Lunes" && (
              <div className="text-xs p-2 mb-1 rounded bg-green-100">
                Grabación Reel: Cómo ahorrar dinero
              </div>
            )}
          </div>
        ))}
        
        {/* Sección de Publicación */}
        <div className="bg-gray-100 p-3 font-semibold">
          Publicación<br />
          <span className="text-xs font-normal text-gray-500">20:00 PM</span>
        </div>
        
        {days.map(day => (
          <div key={`publishing-${day}`} className="border border-gray-200 p-2 min-h-24">
            {day === "Lunes" && (
              <div className="text-xs p-2 mb-1 rounded bg-green-100">
                Publicación Reel: 5 consejos para invertir
                <div className="text-gray-500 mt-1">Instagram, TikTok</div>
              </div>
            )}
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
      </div>
    </div>
  );
} 