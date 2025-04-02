// Datos de eventos
let contentEvents = JSON.parse(localStorage.getItem('efisEvents')) || [];

// Elementos DOM
const eventModal = document.getElementById('event-modal');
const eventForm = document.getElementById('event-form');
const modalTitle = document.getElementById('modal-title');
const deleteEventBtn = document.getElementById('delete-event');
const closeModalBtn = document.getElementById('close-modal');
const prevWeekBtn = document.getElementById('prev-week');
const nextWeekBtn = document.getElementById('next-week');
const weekTitleEl = document.getElementById('week-title');

// Variables globales
let currentWeekStart = getMonday(new Date());
let currentEventId = null;

// Formatear fecha
function formatDate(date) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}

// Obtener el lunes de la semana actual o anterior
function getMonday(date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

// Obtener fecha para un día específico de la semana (0-4: lunes a viernes)
function getDateForDay(weekStart, dayOffset) {
  const date = new Date(weekStart);
  date.setDate(date.getDate() + dayOffset);
  return date;
}

// Formatear rango de fechas para el título
function formatWeekRange(weekStart) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4);
  
  return `Semana del ${weekStart.getDate()} al ${weekEnd.getDate()} de ${weekEnd.toLocaleDateString('es-ES', { month: 'long' })}, ${weekEnd.getFullYear()}`;
}

// Actualizar calendario
function updateCalendar() {
  // Actualizar título de la semana
  weekTitleEl.textContent = formatWeekRange(currentWeekStart);
  
  // Limpiar contenedores
  document.getElementById('recording-container').innerHTML = '';
  document.getElementById('publishing-container').innerHTML = '';
  
  // Crear celdas para cada día de la semana (lunes a viernes)
  for (let i = 0; i < 5; i++) {
    const currentDate = getDateForDay(currentWeekStart, i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Crear celda para grabación
    const recordingCell = createCalendarCell(dateStr, '11:00', 'recording');
    document.getElementById('recording-container').appendChild(recordingCell);
    
    // Crear celda para publicación
    const publishingCell = createCalendarCell(dateStr, '20:00', 'publishing');
    document.getElementById('publishing-container').appendChild(publishingCell);
  }
  
  // Actualizar eventos en el calendario
  updateEventsInCalendar();
  
  // Actualizar tabla de publicaciones programadas
  updateScheduledTable();
}

// Crear celda de calendario
function createCalendarCell(date, time, type) {
  const cell = document.createElement('div');
  cell.className = 'min-h-[80px] p-2 border border-gray-200 bg-gray-50 relative';
  cell.dataset.date = date;
  cell.dataset.time = time;
  cell.dataset.type = type;
  
  // Añadir listener para abrir modal al hacer clic
  cell.addEventListener('click', () => openEventModal(date, time));
  
  return cell;
}

// Crear elemento de evento para mostrar en calendario
function createEventElement(event) {
  const eventEl = document.createElement('div');
  let bgColor = 'bg-gray-100';
  
  switch(event.type) {
    case 'podcast':
      bgColor = 'bg-blue-100 border-blue-300';
      break;
    case 'reel':
      bgColor = 'bg-green-100 border-green-300';
      break;
    case 'teaser':
      bgColor = 'bg-yellow-100 border-yellow-300';
      break;
    case 'post':
      bgColor = 'bg-purple-100 border-purple-300';
      break;
  }
  
  eventEl.className = `${bgColor} p-1 text-xs rounded border mb-1 cursor-pointer`;
  eventEl.textContent = event.title;
  eventEl.dataset.id = event.id;
  
  // Mostrar modal al hacer clic en un evento
  eventEl.addEventListener('click', (e) => {
    e.stopPropagation();
    openEventModal(event.date, event.time, event.id);
  });
  
  return eventEl;
}

// Actualizar eventos en el calendario
function updateEventsInCalendar() {
  // Limpiar eventos existentes
  document.querySelectorAll('.calendar-event').forEach(el => el.remove());
  
  // Obtener fechas de la semana actual
  const weekDates = [];
  for (let i = 0; i < 5; i++) {
    const date = getDateForDay(currentWeekStart, i);
    weekDates.push(date.toISOString().split('T')[0]);
  }
  
  // Filtrar eventos de la semana actual
  const currentWeekEvents = contentEvents.filter(event => 
    weekDates.includes(event.date)
  );
  
  // Añadir eventos al calendario
  currentWeekEvents.forEach(event => {
    const cell = document.querySelector(`[data-date="${event.date}"][data-time="${event.time}"]`);
    if (cell) {
      const eventEl = createEventElement(event);
      eventEl.classList.add('calendar-event');
      cell.appendChild(eventEl);
    }
  });
}

// Actualizar tabla de publicaciones programadas
function updateScheduledTable() {
  // Implementación futura para la tabla de publicaciones programadas
}

// Abrir modal para crear/editar evento
function openEventModal(date, time, eventId = null) {
  const titleInput = document.getElementById('event-title');
  const typeSelect = document.getElementById('event-type');
  const dateInput = document.getElementById('event-date');
  const timeInput = document.getElementById('event-time');
  const platformCheckboxes = document.querySelectorAll('#event-platforms input[type="checkbox"]');
  
  // Restablecer formulario
  eventForm.reset();
  
  // Establecer fecha y hora
  dateInput.value = date;
  timeInput.value = time;
  
  // Si hay un ID de evento, cargar sus datos
  if (eventId) {
    const event = contentEvents.find(e => e.id === eventId);
    if (event) {
      currentEventId = eventId;
      modalTitle.textContent = 'Editar Evento';
      titleInput.value = event.title;
      typeSelect.value = event.type;
      
      // Marcar plataformas
      if (event.platforms) {
        platformCheckboxes.forEach(checkbox => {
          checkbox.checked = event.platforms.includes(checkbox.value);
        });
      }
      
      // Mostrar botón de eliminar
      deleteEventBtn.classList.remove('hidden');
    }
  } else {
    // Nuevo evento
    currentEventId = null;
    modalTitle.textContent = 'Nuevo Evento';
    deleteEventBtn.classList.add('hidden');
  }
  
  // Mostrar modal
  eventModal.classList.remove('hidden');
}

// Cerrar modal
function closeEventModal() {
  eventModal.classList.add('hidden');
}

// Guardar evento
function saveEvent(event) {
  event.preventDefault();
  
  const titleInput = document.getElementById('event-title');
  const typeSelect = document.getElementById('event-type');
  const dateInput = document.getElementById('event-date');
  const timeInput = document.getElementById('event-time');
  const platformCheckboxes = document.querySelectorAll('#event-platforms input[type="checkbox"]:checked');
  
  // Validar formulario
  if (!titleInput.value || !typeSelect.value) {
    alert('Por favor, completa los campos obligatorios');
    return;
  }
  
  // Recopilar plataformas seleccionadas
  const platforms = Array.from(platformCheckboxes).map(cb => cb.value);
  
  // Crear objeto de evento
  const eventData = {
    title: titleInput.value,
    type: typeSelect.value,
    date: dateInput.value,
    time: timeInput.value,
    platforms: platforms,
    status: 'pending'
  };
  
  if (currentEventId) {
    // Actualizar evento existente
    const index = contentEvents.findIndex(e => e.id === currentEventId);
    if (index !== -1) {
      eventData.id = currentEventId;
      contentEvents[index] = eventData;
    }
  } else {
    // Crear nuevo evento con ID único
    eventData.id = Date.now().toString();
    contentEvents.push(eventData);
  }
  
  // Guardar en localStorage
  localStorage.setItem('efisEvents', JSON.stringify(contentEvents));
  
  // Actualizar calendario
  updateCalendar();
  
  // Cerrar modal
  closeEventModal();
}

// Eliminar evento
function deleteEvent() {
  if (currentEventId) {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      contentEvents = contentEvents.filter(e => e.id !== currentEventId);
      
      // Guardar en localStorage
      localStorage.setItem('efisEvents', JSON.stringify(contentEvents));
      
      // Actualizar calendario
      updateCalendar();
      
      // Cerrar modal
      closeEventModal();
    }
  }
}

// Semana anterior
function goToPrevWeek() {
  const prevWeek = new Date(currentWeekStart);
  prevWeek.setDate(prevWeek.getDate() - 7);
  currentWeekStart = prevWeek;
  updateCalendar();
}

// Semana siguiente
function goToNextWeek() {
  const nextWeek = new Date(currentWeekStart);
  nextWeek.setDate(nextWeek.getDate() + 7);
  currentWeekStart = nextWeek;
  updateCalendar();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar calendario
  updateCalendar();
  
  // Event Listeners
  eventForm.addEventListener('submit', saveEvent);
  deleteEventBtn.addEventListener('click', deleteEvent);
  closeModalBtn.addEventListener('click', closeEventModal);
  prevWeekBtn.addEventListener('click', goToPrevWeek);
  nextWeekBtn.addEventListener('click', goToNextWeek);
}); 