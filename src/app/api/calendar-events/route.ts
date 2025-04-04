import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

// GET /api/calendar-events
export async function GET(request: NextRequest) {
  try {
    // Opcional: Validar sesión si quieres que sea privado
    // const session = await getServerSession() as Session | null;
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const events = await prisma.calendarEvent.findMany({
      orderBy: {
        date: 'asc',
      },
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
}

// POST /api/calendar-events
export async function POST(request: NextRequest) {
  try {
    // Opcional: Validar sesión
    // const session = await getServerSession() as Session | null;
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const data = await request.json();
    
    // Validar datos mínimos
    if (!data.title || !data.date || !data.time || !data.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Asegurarse que la fecha es un objeto Date
    const eventData = {
      ...data,
      date: new Date(data.date),
      // userId: session?.user?.id // Opcional: asociar con usuario
    };

    const event = await prisma.calendarEvent.create({
      data: eventData
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json({ error: "Failed to create calendar event" }, { status: 500 });
  }
}

// DELETE /api/calendar-events (con body que contiene el ID)
export async function DELETE(request: NextRequest) {
  try {
    // Opcional: Validar sesión
    // const session = await getServerSession() as Session | null;
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const data = await request.json();
    if (!data.id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

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
} 