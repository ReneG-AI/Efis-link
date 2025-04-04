import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/calendar-events/:id
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    const event = await prisma.calendarEvent.findUnique({
      where: { id }
    });

    if (!event) {
      return NextResponse.json({ error: "Calendar event not found" }, { status: 404 });
    }

    // Convertir fecha para JSON
    const formattedEvent = {
      ...event,
      date: event.date.toISOString()
    };

    return NextResponse.json(formattedEvent);
  } catch (error) {
    console.error("Error fetching calendar event:", error);
    return NextResponse.json({ error: "Failed to fetch calendar event" }, { status: 500 });
  }
}

// PUT /api/calendar-events/:id
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const data = await request.json();

    // Validar datos mínimos
    if (!data.title || !data.date || !data.time || !data.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verificar si el evento existe
    const existingEvent = await prisma.calendarEvent.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Calendar event not found" }, { status: 404 });
    }

    // Asegurarse de que la fecha es un objeto Date
    const eventData = {
      ...data,
      date: new Date(data.date),
      updatedAt: new Date()
    };

    const updatedEvent = await prisma.calendarEvent.update({
      where: { id },
      data: eventData
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating calendar event:", error);
    return NextResponse.json({ error: "Failed to update calendar event" }, { status: 500 });
  }
}

// DELETE /api/calendar-events/:id
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    // Verificar si el evento existe
    const existingEvent = await prisma.calendarEvent.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Calendar event not found" }, { status: 404 });
    }

    await prisma.calendarEvent.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    return NextResponse.json({ error: "Failed to delete calendar event" }, { status: 500 });
  }
} 