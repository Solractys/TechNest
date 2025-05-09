import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Fetch events organized by the user
    const organizedEvents = await prisma.event.findMany({
      where: {
        organizerId: session.user.id,
      },
      orderBy: {
        date: 'asc',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        date: true,
        location: true,
        imageUrl: true,
        online: true,
        published: true,
        _count: {
          select: {
            attendees: true,
          },
        },
      },
    });

    // Fetch events the user is interested in
    const interestedEvents = await prisma.userEvent.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            date: true,
            location: true,
            imageUrl: true,
            online: true,
            published: true,
          },
        },
      },
    });

    return NextResponse.json({
      organizedEvents,
      interestedEvents,
    });
  } catch (error) {
    console.error("Error fetching user events:", error);
    return NextResponse.json(
      { error: "Erro ao carregar eventos" },
      { status: 500 }
    );
  }
}

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

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
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
          status: status || 'INTERESTED',
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
        status: status || 'INTERESTED',
      },
    });

    return NextResponse.json({
      interest,
      message: "Interesse registrado com sucesso",
    });
  } catch (error) {
    console.error("Error managing event interest:", error);
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
    const userEventId = searchParams.get('id');

    if (!userEventId) {
      return NextResponse.json(
        { error: "ID do interesse é obrigatório" },
        { status: 400 }
      );
    }

    // Check if the interest exists and belongs to the user
    const userEvent = await prisma.userEvent.findFirst({
      where: {
        id: userEventId,
        userId: session.user.id,
      },
    });

    if (!userEvent) {
      return NextResponse.json(
        { error: "Interesse não encontrado ou não pertence a você" },
        { status: 404 }
      );
    }

    // Delete the interest
    await prisma.userEvent.delete({
      where: { id: userEventId },
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