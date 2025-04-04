import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/auth";

// GET /api/calendar-events
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const events = await prisma.calendarEvent.findMany({
        orderBy: {
          date: 'asc',
        },
        // Si hay un userId en la sesión, filtrar por usuario (opcional)
        // where: session.user?.id ? { userId: parseInt(session.user.id) } : undefined,
      });

      // Convertir fecha para JSON
      const formattedEvents = events.map(event => ({
        ...event,
        date: event.date.toISOString()
      }));

      return NextResponse.json(formattedEvents);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      return NextResponse.json({ error: "Failed to fetch calendar events" }, { status: 500 });
    }
  });
}

// POST /api/calendar-events
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const data = await req.json();
      
      // Validar datos mínimos
      if (!data.title || !data.date || !data.time || !data.description) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      // Asegurarse que la fecha es un objeto Date y asociar con el usuario actual
      const eventData = {
        ...data,
        date: new Date(data.date),
        userId: session.user?.id ? parseInt(session.user.id) : undefined
      };

      const event = await prisma.calendarEvent.create({
        data: eventData
      });

      return NextResponse.json(event, { status: 201 });
    } catch (error) {
      console.error("Error creating calendar event:", error);
      return NextResponse.json({ error: "Failed to create calendar event" }, { status: 500 });
    }
  });
}

// DELETE /api/calendar-events (con body que contiene el ID)
export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const data = await req.json();
      if (!data.id) {
        return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
      }

      // Verificar permisos (opcional: comprobar que el evento pertenece al usuario)
      const event = await prisma.calendarEvent.findUnique({
        where: { id: data.id }
      });

      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }

      // Opcional: Verificar que el usuario es propietario del evento o es admin
      // if (event.userId && event.userId !== parseInt(session.user.id) && session.user.role !== 'ADMIN') {
      //   return NextResponse.json({ error: "Unauthorized to delete this event" }, { status: 403 });
      // }

      await prisma.calendarEvent.delete({
        where: {
          id: data.id
        }
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      return NextResponse.json({ error: "Failed to delete calendar event" }, { status: 500 });
    }
  });
} 