import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/auth";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/ideas/:id
export async function GET(request: NextRequest, { params }: Params) {
  return withAuth(request, async (req, session) => {
    try {
      const { id } = params;

      const idea = await prisma.idea.findUnique({
        where: { id }
      });

      if (!idea) {
        return NextResponse.json({ error: "Idea not found" }, { status: 404 });
      }

      // Convertir fecha para JSON
      const formattedIdea = {
        ...idea,
        createdAt: idea.createdAt.toISOString(),
        updatedAt: idea.updatedAt.toISOString()
      };

      return NextResponse.json(formattedIdea);
    } catch (error) {
      console.error("Error fetching idea:", error);
      return NextResponse.json({ error: "Failed to fetch idea" }, { status: 500 });
    }
  });
}

// PUT /api/ideas/:id
export async function PUT(request: NextRequest, { params }: Params) {
  return withAuth(request, async (req, session) => {
    try {
      const { id } = params;
      const data = await req.json();

      // Validar datos mínimos
      if (!data.title || !data.description || !data.platform || !data.status) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      // Verificar si la idea existe
      const existingIdea = await prisma.idea.findUnique({
        where: { id }
      });

      if (!existingIdea) {
        return NextResponse.json({ error: "Idea not found" }, { status: 404 });
      }

      // Preparar datos para la actualización
      const ideaData = {
        ...data,
        tags: data.tags || [],
        updatedAt: new Date()
      };

      const updatedIdea = await prisma.idea.update({
        where: { id },
        data: ideaData
      });

      return NextResponse.json(updatedIdea);
    } catch (error) {
      console.error("Error updating idea:", error);
      return NextResponse.json({ error: "Failed to update idea" }, { status: 500 });
    }
  });
}

// DELETE /api/ideas/:id
export async function DELETE(request: NextRequest, { params }: Params) {
  return withAuth(request, async (req, session) => {
    try {
      const { id } = params;

      // Verificar si la idea existe
      const existingIdea = await prisma.idea.findUnique({
        where: { id }
      });

      if (!existingIdea) {
        return NextResponse.json({ error: "Idea not found" }, { status: 404 });
      }

      await prisma.idea.delete({
        where: { id }
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting idea:", error);
      return NextResponse.json({ error: "Failed to delete idea" }, { status: 500 });
    }
  });
} 