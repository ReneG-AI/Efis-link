// Datos de eventos
let contentEvents = [];

try {
  const savedEvents = localStorage.getItem('efisEvents');
  if (savedEvents) {
    contentEvents = JSON.parse(savedEvents);
  }
} catch (error) {
  console.error('Error al cargar eventos:', error);
  contentEvents = [];
}

// Variables globales
let currentWeekStart = getMonday(new Date());
let currentEventId = null;

// Elementos DOM que se inicializarán cuando el documento esté listo
let eventModal;
let eventForm;
let modalTitle;
let deleteEventBtn;
let closeModalBtn;
let prevWeekBtn;
let nextWeekBtn;
let weekTitleEl;

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
  // Verificar que los elementos existan
  weekTitleEl = weekTitleEl || document.getElementById('week-title');
  const recordingContainer = document.getElementById('recording-container');
  const publishingContainer = document.getElementById('publishing-container');
  
  if (!weekTitleEl || !recordingContainer || !publishingContainer) {
    console.warn('Elementos del calendario no encontrados');
    return;
  }
  
  // Actualizar título de la semana
  weekTitleEl.textContent = formatWeekRange(currentWeekStart);
  
  // Limpiar contenedores
  recordingContainer.innerHTML = '';
  publishingContainer.innerHTML = '';
  
  // Crear celdas para cada día de la semana (lunes a viernes)
  for (let i = 0; i < 5; i++) {
    const currentDate = getDateForDay(currentWeekStart, i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Crear celda para grabación
    const recordingCell = createCalendarCell(dateStr, '11:00', 'recording');
    recordingContainer.appendChild(recordingCell);
    
    // Crear celda para publicación
    const publishingCell = createCalendarCell(dateStr, '20:00', 'publishing');
    publishingContainer.appendChild(publishingCell);
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
  cell.addEventListener('click', function() {
    window.openEventModal(date, time);
  });
  
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
  eventEl.addEventListener('click', function(e) {
    e.stopPropagation();
    window.openEventModal(event.date, event.time, event.id);
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
  const eventsTableBody = document.getElementById('events-table-body');
  if (eventsTableBody) {
    // Si estamos en la página de calendario, actualizar la tabla
    updateEventsTable();
  }
}

// Abrir modal para crear/editar evento
function openEventModal(date, time, eventId = null) {
  // Obtener referencias a los elementos
  eventModal = eventModal || document.getElementById('event-modal');
  eventForm = eventForm || document.getElementById('event-form');
  modalTitle = modalTitle || document.getElementById('modal-title');
  deleteEventBtn = deleteEventBtn || document.getElementById('delete-event');
  
  if (!eventModal || !eventForm || !modalTitle) {
    console.error('Elementos del modal no encontrados');
    return;
  }

  const titleInput = document.getElementById('event-title');
  const typeSelect = document.getElementById('event-type');
  const dateInput = document.getElementById('event-date');
  const timeInput = document.getElementById('event-time');
  const platformCheckboxes = document.querySelectorAll('#event-platforms input[type="checkbox"]');
  
  if (!titleInput || !typeSelect || !dateInput || !timeInput) {
    console.error('Elementos del formulario no encontrados');
    return;
  }
  
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
  eventModal = eventModal || document.getElementById('event-modal');
  
  if (eventModal) {
    eventModal.classList.add('hidden');
  }
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
  
  try {
    // Guardar en localStorage
    localStorage.setItem('efisEvents', JSON.stringify(contentEvents));
  } catch (error) {
    console.error('Error al guardar eventos:', error);
  }
  
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
      
      try {
        // Guardar en localStorage
        localStorage.setItem('efisEvents', JSON.stringify(contentEvents));
      } catch (error) {
        console.error('Error al guardar eventos después de eliminar:', error);
      }
      
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

// Funciones para la página de calendario
function updateMonthCalendar() {
  const calendarGrid = document.getElementById('calendar-grid');
  if (!calendarGrid) return;
  
  calendarGrid.innerHTML = '';
  
  // Obtener fecha actual
  const currentDate = new Date();
  
  // Actualizar título del mes
  const monthTitle = document.getElementById('month-title');
  if (monthTitle) {
    monthTitle.textContent = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }
  
  // Primer día del mes
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  // Ajustar el primer día para que empiece en lunes (0: lunes, 6: domingo)
  let firstDayOfGrid = new Date(firstDay);
  const dayOfWeek = firstDay.getDay(); // 0: domingo, 1: lunes, ..., 6: sábado
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convertir a 0: lunes, ..., 6: domingo
  firstDayOfGrid.setDate(firstDay.getDate() - adjustedDay);
  
  // Generar celdas del calendario (42 celdas para 6 semanas)
  const totalDays = 42;
  const today = new Date();
  
  for (let i = 0; i < totalDays; i++) {
    const currentDay = new Date(firstDayOfGrid);
    currentDay.setDate(firstDayOfGrid.getDate() + i);
    
    const isCurrentMonth = currentDay.getMonth() === currentDate.getMonth();
    const isToday = currentDay.toDateString() === today.toDateString();
    
    // Crear celda
    const cell = document.createElement('div');
    cell.className = `min-h-[80px] p-2 relative border ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'} ${isToday ? 'border-blue-500' : 'border-gray-100'}`;
    
    // Número de día
    const dayNumber = document.createElement('div');
    dayNumber.className = `absolute top-1 right-1 ${isToday ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`;
    dayNumber.textContent = currentDay.getDate();
    cell.appendChild(dayNumber);
    
    // Contenedor para eventos
    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'mt-6 space-y-1';
    
    // Añadir eventos si hay para este día
    const dateStr = currentDay.toISOString().split('T')[0];
    const dayEvents = contentEvents.filter(event => event.date === dateStr);
    
    dayEvents.forEach(event => {
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
      
      eventEl.className = `${bgColor} p-1 text-xs rounded border cursor-pointer truncate`;
      eventEl.textContent = `${event.time} - ${event.title}`;
      eventEl.dataset.id = event.id;
      
      // Mostrar modal al hacer clic en un evento
      eventEl.addEventListener('click', function() {
        window.openEventModal(event.date, event.time, event.id);
      });
      
      eventsContainer.appendChild(eventEl);
    });
    
    cell.appendChild(eventsContainer);
    
    // Hacer clic en celda para añadir evento
    cell.addEventListener('click', function(e) {
      if (e.target === cell || e.target === dayNumber) {
        window.openEventModal(dateStr, '11:00');
      }
    });
    
    calendarGrid.appendChild(cell);
  }
  
  // Actualizar tabla de eventos
  updateEventsTable();
}

function updateEventsTable() {
  const tableBody = document.getElementById('events-table-body');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  // Ordenar eventos por fecha y hora
  const sortedEvents = [...contentEvents].sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time);
    const dateB = new Date(b.date + 'T' + b.time);
    return dateA - dateB;
  });
  
  // Crear filas para cada evento
  sortedEvents.forEach(event => {
    const row = document.createElement('tr');
    row.className = 'border-b hover:bg-gray-50';
    
    // Formatear fecha para mostrar
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    
    // Contenido de la fila
    row.innerHTML = `
      <td class="px-4 py-2">${event.title}</td>
      <td class="px-4 py-2">
        <span class="inline-block px-2 py-1 text-xs rounded-full ${event.type === 'podcast' ? 'bg-blue-100 text-blue-800' : 
          event.type === 'reel' ? 'bg-green-100 text-green-800' : 
          event.type === 'teaser' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-purple-100 text-purple-800'}">
          ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </span>
      </td>
      <td class="px-4 py-2">${formattedDate}</td>
      <td class="px-4 py-2">${event.time}</td>
      <td class="px-4 py-2">
        <div class="flex flex-wrap gap-1">
          ${Array.isArray(event.platforms) ? event.platforms.map(platform => 
            `<span class="inline-block px-2 py-1 text-xs bg-gray-100 rounded-full">${platform}</span>`
          ).join('') : ''}
        </div>
      </td>
      <td class="px-4 py-2">
        <span class="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
          Pendiente
        </span>
      </td>
      <td class="px-4 py-2">
        <button 
          class="text-blue-600 hover:text-blue-800 mr-2"
          onclick="window.openEventModal('${event.date}', '${event.time}', '${event.id}')"
        >
          Editar
        </button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Navegación de meses
function goToPrevMonth() {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateMonthCalendar();
}

function goToNextMonth() {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateMonthCalendar();
}

// Funciones para la página de redes sociales
function openSocialPostModal() {
  const socialPostModal = document.getElementById('social-post-modal');
  if (socialPostModal) {
    socialPostModal.classList.remove('hidden');
  }
}

function closeSocialPostModal() {
  const socialPostModal = document.getElementById('social-post-modal');
  if (socialPostModal) {
    socialPostModal.classList.add('hidden');
  }
}

function handleSocialPostSubmit(e) {
  e.preventDefault();
  
  const title = document.getElementById('post-title').value;
  const content = document.getElementById('post-content').value;
  const date = document.getElementById('post-date').value;
  const time = document.getElementById('post-time').value;
  const platforms = Array.from(
    document.querySelectorAll('input[name="platforms"]:checked')
  ).map(cb => cb.value);
  const status = document.getElementById('post-status').value;
  
  // Simple validación
  if (!title || !content || platforms.length === 0) {
    alert('Por favor, completa los campos obligatorios');
    return;
  }
  
  // Simulando agregado a la tabla
  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const statusBadge = {
    draft: '<span class="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Borrador</span>',
    scheduled: '<span class="inline-block px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Programado</span>',
    published: '<span class="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Publicado</span>'
  };
  
  const platformBadges = platforms.map(platform => {
    const colors = {
      Instagram: 'bg-purple-100 text-purple-800',
      TikTok: 'bg-black text-white',
      YouTube: 'bg-red-100 text-red-800',
      Spotify: 'bg-green-100 text-green-800',
      LinkedIn: 'bg-blue-100 text-blue-800'
    };
    
    return `<span class="inline-block px-2 py-1 text-xs ${colors[platform]} rounded-full">${platform}</span>`;
  }).join(' ');
  
  // Crear nueva fila y agregarla a la tabla
  const newRow = document.createElement('tr');
  newRow.className = 'border-b hover:bg-gray-50';
  newRow.innerHTML = `
    <td class="px-4 py-2">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-gray-200 rounded mr-3"></div>
        <div>
          <p class="font-medium">${title}</p>
          <p class="text-xs text-gray-500">${content.substring(0, 30)}...</p>
        </div>
      </div>
    </td>
    <td class="px-4 py-2">
      <div class="flex space-x-1">
        ${platformBadges}
      </div>
    </td>
    <td class="px-4 py-2">${formattedDate}</td>
    <td class="px-4 py-2">
      <div class="flex space-x-2 text-sm">
        <div>-</div>
      </div>
    </td>
    <td class="px-4 py-2">
      ${statusBadge[status]}
    </td>
    <td class="px-4 py-2">
      <button class="text-blue-600 hover:text-blue-800 mr-2">Ver</button>
      <button class="text-gray-600 hover:text-gray-800">Editar</button>
    </td>
  `;
  
  // Agregar al inicio de la tabla
  const tableBody = document.getElementById('social-posts-table');
  if (tableBody) {
    tableBody.insertBefore(newRow, tableBody.firstChild);
  }
  
  // Cerrar modal y resetear formulario
  closeSocialPostModal();
  const socialPostForm = document.getElementById('social-post-form');
  if (socialPostForm) {
    socialPostForm.reset();
  }
}

// Inicializar elementos y eventos cuando el DOM esté listo
function initApp() {
  console.log('Inicializando aplicación EFIS...');
  
  // Inicializar elementos DOM globales
  eventModal = document.getElementById('event-modal');
  eventForm = document.getElementById('event-form');
  modalTitle = document.getElementById('modal-title');
  deleteEventBtn = document.getElementById('delete-event');
  closeModalBtn = document.getElementById('close-modal');
  prevWeekBtn = document.getElementById('prev-week');
  nextWeekBtn = document.getElementById('next-week');
  weekTitleEl = document.getElementById('week-title');
  
  // Event Listeners para el calendario principal
  if (eventForm) {
    eventForm.addEventListener('submit', saveEvent);
  }
  
  if (deleteEventBtn) {
    deleteEventBtn.addEventListener('click', deleteEvent);
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeEventModal);
  }
  
  if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', goToPrevWeek);
  }
  
  if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', goToNextWeek);
  }
  
  // Event Listeners para la página de calendario
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', goToPrevMonth);
  }
  
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', goToNextMonth);
  }
  
  // Event Listeners para la página de redes sociales
  const addSocialPostBtn = document.getElementById('add-social-post');
  const closeSocialModalBtn = document.getElementById('close-social-modal');
  const socialPostForm = document.getElementById('social-post-form');
  
  if (addSocialPostBtn) {
    addSocialPostBtn.addEventListener('click', openSocialPostModal);
  }
  
  if (closeSocialModalBtn) {
    closeSocialModalBtn.addEventListener('click', closeSocialPostModal);
  }
  
  if (socialPostForm) {
    socialPostForm.addEventListener('submit', handleSocialPostSubmit);
  }
  
  // Inicializar vistas
  if (document.getElementById('recording-container') && document.getElementById('publishing-container')) {
    // Estamos en el dashboard o index.html
    updateCalendar();
  }
  
  if (document.getElementById('calendar-grid')) {
    // Estamos en la página de calendario
    updateMonthCalendar();
  }
}

// Exponer funciones al ámbito global
window.openEventModal = openEventModal;
window.closeEventModal = closeEventModal;
window.openSocialPostModal = openSocialPostModal;
window.closeSocialPostModal = closeSocialPostModal;
window.saveEvent = saveEvent;
window.deleteEvent = deleteEvent;
window.goToPrevWeek = goToPrevWeek;
window.goToNextWeek = goToNextWeek;
window.goToPrevMonth = goToPrevMonth;
window.goToNextMonth = goToNextMonth;
window.handleSocialPostSubmit = handleSocialPostSubmit;

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);

// Intentar inicializar también cuando la ventana esté cargada 
// (en algunos casos DOMContentLoaded puede no dispararse correctamente en Vercel)
window.addEventListener('load', function() {
  console.log('Window loaded, initializing app if needed...');
  if (!eventModal && document.getElementById('event-modal')) {
    initApp();
  }
}); 