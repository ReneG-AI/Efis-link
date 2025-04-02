"use client";

import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

interface Event {
  id: string;
  title: string;
  date: string | Date;
  time: string;
  type: string;
  platform: string;
  status: string;
}

interface EventCalendarProps {
  events: Event[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(startDate, i);
    return {
      date,
      dayName: format(date, "EEE", { locale: es }),
      dayNumber: format(date, "d"),
    };
  });
  
  const getDayEvents = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date);
    });
  };
  
  const getPreviousWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, -7));
  };
  
  const getNextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={getPreviousWeek}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          Anterior
        </button>
        
        <h3 className="font-medium">
          {format(startDate, "MMMM yyyy", { locale: es })}
        </h3>
        
        <button 
          onClick={getNextWeek}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          Siguiente
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => (
          <div key={day.date.toString()} className="text-center">
            <div className="p-1 font-medium text-xs uppercase">{day.dayName}</div>
            <div className="font-bold">{day.dayNumber}</div>
          </div>
        ))}
        
        {days.map(day => (
          <div 
            key={`events-${day.date.toString()}`} 
            className="min-h-[80px] p-1 border rounded overflow-y-auto text-xs"
          >
            {getDayEvents(day.date).map(event => (
              <div 
                key={event.id}
                className={`p-1 mb-1 rounded text-white ${
                  event.type === "podcast" ? "bg-blue-600" : 
                  event.type === "video" ? "bg-red-600" : 
                  "bg-green-600"
                }`}
              >
                <div className="font-medium truncate">{event.title}</div>
                <div>{event.time}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 