import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Verificar autenticação
    const session = await getServerAuthSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Inicializar variáveis
    let eventId: string | null = null;
    let status: string | null = null;
    let action: string | null = null;
    
    // Processar corpo da requisição de acordo com o content-type
    const contentType = req.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        // Processar como JSON
        const body = await req.json();
        eventId = body.eventId;
        status = body.status;
        action = body.action;
        console.log("[Interest API] Recebido body JSON:", { eventId, status, action });
      } else if (contentType.includes('application/x-www-form-urlencoded') || 
                contentType.includes('multipart/form-data')) {
        // Processar como FormData
        const formData = await req.formData();
        eventId = formData.get('eventId') as string;
        status = formData.get('status') as string;
        action = formData.get('action') as string;
        console.log("[Interest API] Recebido FormData:", { eventId, status, action });
      } else {
        // Tentar como texto e depois como JSON ou URL encoded
        const text = await req.text();
        console.log("[Interest API] Recebido texto:", text);
        
        try {
          // Tentar JSON
          const data = JSON.parse(text);
          eventId = data.eventId;
          status = data.status;
          action = data.action;
          console.log("[Interest API] Parsed como JSON:", { eventId, status, action });
        } catch (jsonError) {
          // Se falhar, verificar URL encoded
          if (text.includes('=')) {
            const params = new URLSearchParams(text);
            eventId = params.get('eventId');
            status = params.get('status');
            action = params.get('action');
            console.log("[Interest API] Parsed como URL encoded:", { eventId, status, action });
          }
        }
      }
    } catch (parseError) {
      console.error("[Interest API] Erro ao processar corpo da requisição:", parseError);
      return NextResponse.json(
        { error: "Formato de requisição inválido" },
        { status: 400 }
      );
    }

    // Validar eventId
    if (!eventId) {
      return NextResponse.json(
        { error: "ID do evento é obrigatório" },
        { status: 400 }
      );
    }

    console.log(`[Interest API] Processando action="${action}" para eventId=${eventId} do usuário ${session.user.id}`);

    // Verificar se o evento existe
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

    // Verificar se usuário é organizador
    if (event.organizerId === session.user.id) {
      return NextResponse.json(
        { error: "Você não pode marcar interesse no seu próprio evento" },
        { status: 400 }
      );
    }

    // Verificar interesse existente
    const existingInterest = await prisma.userEvent.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });

    // Processar ação de remover interesse
    if (action === "remove") {
      console.log("[Interest API] Processando remoção de interesse");
      
      if (!existingInterest) {
        return NextResponse.json(
          { error: "Interesse não encontrado" },
          { status: 404 }
        );
      }

      await prisma.userEvent.delete({
        where: { id: existingInterest.id },
      });

      return NextResponse.json({
        message: "Interesse removido com sucesso"
      });
    }

    // Para outras ações, processar como adicionar/atualizar interesse
    
    // Verificar capacidade máxima para status "GOING"
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

    // Validar status
    const validStatuses = ["INTERESTED", "GOING", "NOT_GOING"];
    const finalStatus = status || "INTERESTED";
    
    if (!validStatuses.includes(finalStatus)) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      );
    }

    // Adicionar ou atualizar interesse
    if (existingInterest) {
      // Atualizar interesse existente
      const updatedInterest = await prisma.userEvent.update({
        where: { id: existingInterest.id },
        data: {
          status: finalStatus as "INTERESTED" | "GOING" | "NOT_GOING",
        },
        select: {
          id: true,
          status: true,
          event: {
            select: { title: true }
          }
        },
      });

      return NextResponse.json({
        interest: updatedInterest,
        message: "Status atualizado com sucesso",
      });
    } else {
      // Criar novo interesse
      const interest = await prisma.userEvent.create({
        data: {
          userId: session.user.id,
          eventId,
          status: finalStatus as "INTERESTED" | "GOING" | "NOT_GOING",
        },
        select: {
          id: true,
          status: true,
          event: {
            select: { title: true }
          }
        },
      });

      return NextResponse.json({
        interest,
        message: "Interesse registrado com sucesso",
      }, { status: 201 });
    }

  } catch (error) {
    console.error("[Interest API] Erro não tratado:", error);
    
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

    console.log(`[Interest API] Removendo interesse via DELETE para eventId=${eventId} do usuário ${session.user.id}`);

    // Verificar se o interesse existe e pertence ao usuário
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

    // Remover o interesse
    await prisma.userEvent.delete({
      where: {
        id: userEvent.id,
      },
    });

    return NextResponse.json({
      message: "Interesse removido com sucesso",
    });
  } catch (error) {
    console.error("[Interest API] Erro ao remover interesse:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erro ao remover interesse: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Erro ao remover interesse no evento" },
      { status: 500 }
    );
  }
}