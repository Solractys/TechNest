import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const event = await prisma.event.findUnique({
      where: {
        slug,
      },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        organizer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            attendees: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    const session = await getServerAuthSession();
    let userInterest = null;

    if (session?.user) {
      // Get user's interest status for this event
      userInterest = await prisma.userEvent.findUnique({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId: event.id,
          },
        },
        select: {
          id: true,
          status: true,
        },
      });
    }

    return NextResponse.json({
      ...event,
      userInterest,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Erro ao carregar evento" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { slug } = params;
    const data = await req.json();

    // Find the event and check if the user is the organizer
    const event = await prisma.event.findUnique({
      where: { slug },
      select: { id: true, organizerId: true }
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    // Check if user is the organizer or an admin
    if (event.organizerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Você não tem permissão para editar este evento" },
        { status: 403 }
      );
    }

    // Extract category IDs for the connection
    const { categories, ...eventData } = data;
    
    // Update the event including categories
    const updatedEvent = await prisma.event.update({
      where: { id: event.id },
      data: {
        ...eventData,
        categories: categories ? {
          set: [], // Clear existing connections
          connect: categories.map((categoryId: string) => ({ id: categoryId }))
        } : undefined
      },
      include: {
        categories: true
      }
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erro ao atualizar evento: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Erro ao atualizar evento" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { slug } = params;

    // Find the event and check if the user is the organizer
    const event = await prisma.event.findUnique({
      where: { slug },
      select: { id: true, organizerId: true }
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    // Check if user is the organizer or an admin
    if (event.organizerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Você não tem permissão para excluir este evento" },
        { status: 403 }
      );
    }

    // Delete the event
    await prisma.event.delete({
      where: { id: event.id },
    });

    return NextResponse.json({
      message: "Evento excluído com sucesso",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Erro ao excluir evento" },
      { status: 500 }
    );
  }
}