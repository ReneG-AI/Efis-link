'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

type EventModalProps = {
  event: any | null;
  onClose: () => void;
  onSave: (event: any) => void;
  onDelete: (id: string) => void;
  initialDate?: string;
  initialTime?: string;
};

export default function EventModal({
  event,
  onClose,
  onSave,
  onDelete,
  initialDate,
  initialTime
}: EventModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    type: 'podcast',
    date: '',
    time: '',
    platform: '',
    status: 'scheduled',
    notes: ''
  });

  useEffect(() => {
    if (event) {
      // Editar evento existente
      const eventDate = event.date instanceof Date
        ? format(event.date, 'yyyy-MM-dd')
        : event.date;

      setFormData({
        id: event.id,
        title: event.title || '',
        type: event.type || 'podcast',
        date: eventDate || '',
        time: event.time || '',
        platform: event.platform || '',
        status: event.status || 'scheduled',
        notes: event.notes || ''
      });
    } else if (initialDate && initialTime) {
      // Crear nuevo evento con fecha/hora preseleccionada
      setFormData(prev => ({
        ...prev,
        date: initialDate,
        time: initialTime
      }));
    }
  }, [event, initialDate, initialTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (event && event.id && confirm('¿Estás seguro de eliminar este evento?')) {
      onDelete(event.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {event ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="podcast">Podcast</option>
              <option value="reel">Reel</option>
              <option value="teaser">Teaser</option>
              <option value="post">Post</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plataformas
            </label>
            <input
              type="text"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              placeholder="Ej: Instagram, TikTok"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="scheduled">Programado</option>
              <option value="in-progress">En Progreso</option>
              <option value="completed">Completado</option>
              <option value="canceled">Cancelado</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            ></textarea>
          </div>

          <div className="flex justify-between">
            <div>
              {event && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-danger mr-2"
                >
                  Eliminar
                </button>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
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