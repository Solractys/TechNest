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

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        events: {
          select: {
            id: true,
            title: true,
            slug: true,
            date: true,
            imageUrl: true,
          },
        },
        interestedIn: {
          select: {
            id: true,
            status: true,
            event: {
              select: {
                id: true,
                title: true,
                slug: true,
                date: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Erro ao carregar perfil" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const data = await req.json();

    // Only allow updating certain fields
    const allowedFields = {
      name: data.name,
    };

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: allowedFields,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      message: "Perfil atualizado com sucesso",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erro ao atualizar perfil: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}