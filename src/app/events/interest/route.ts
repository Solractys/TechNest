import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { eventId, status } = await req.json();

    if (!eventId) {
      return NextResponse.json(
        { error: "ID do evento é obrigatório" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["INTERESTED", "GOING", "NOT_GOING"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      );
    }

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        organizerId: true,
        maxAttendees: true,
        _count: {
          select: {
            attendees: {
              where: {
                status: "GOING",
              },
            },
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

    // Check if user is not trying to express interest in their own event
    if (event.organizerId === session.user.id) {
      return NextResponse.json(
        { error: "Você não pode marcar interesse no seu próprio evento" },
        { status: 400 }
      );
    }

    // Check if the event is at max capacity for "GOING" status
    if (
      status === "GOING" &&
      event.maxAttendees !== null &&
      event._count.attendees >= event.maxAttendees
    ) {
      return NextResponse.json(
        { error: "Este evento já atingiu a capacidade máxima" },
        { status: 400 }
      );
    }

    // Check if user already expressed interest
    const existingInterest = await prisma.userEvent.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });

    if (existingInterest) {
      // Update the existing interest
      const updatedInterest = await prisma.userEvent.update({
        where: {
          id: existingInterest.id,
        },
        data: {
          status: status || "INTERESTED",
        },
        select: {
          id: true,
          status: true,
          userId: true,
          eventId: true,
          event: {
            select: {
              title: true,
            },
          },
        },
      });

      return NextResponse.json({
        interest: updatedInterest,
        message: "Status atualizado com sucesso",
      });
    }

    // Create a new interest
    const interest = await prisma.userEvent.create({
      data: {
        userId: session.user.id,
        eventId,
        status: status || "INTERESTED",
      },
      select: {
        id: true,
        status: true,
        userId: true,
        eventId: true,
        event: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      interest,
      message: "Interesse registrado com sucesso",
    }, { status: 201 });
  } catch (error) {
    console.error("Error managing event interest:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erro ao gerenciar interesse: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Erro ao gerenciar interesse no evento" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: "ID do evento é obrigatório" },
        { status: 400 }
      );
    }

    // Check if the interest exists and belongs to the user
    const userEvent = await prisma.userEvent.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });

    if (!userEvent) {
      return NextResponse.json(
        { error: "Interesse não encontrado" },
        { status: 404 }
      );
    }

    // Delete the interest
    await prisma.userEvent.delete({
      where: {
        id: userEvent.id,
      },
    });

    return NextResponse.json({
      message: "Interesse removido com sucesso",
    });
  } catch (error) {
    console.error("Error removing event interest:", error);
    return NextResponse.json(
      { error: "Erro ao remover interesse no evento" },
      { status: 500 }
    );
  }
}