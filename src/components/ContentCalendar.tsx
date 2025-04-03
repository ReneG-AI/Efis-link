"use client";

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

const ContentCalendar = () => {
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

  return (
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
                    key={index}
                    className="bg-blue-50 border-l-4 border-blue-500 p-2 mb-2 rounded shadow-sm"
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
  );
};

export default ContentCalendar; 