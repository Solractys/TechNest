import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";

export async function GET(request: Request) {
  try {
    const session = await getServerAuthSession();
    
    // Enhanced session validation and debugging
    console.log("Session data:", JSON.stringify(session, null, 2));
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    if (!session.user.id) {
      return NextResponse.json(
        { error: "ID do usuário não encontrado na sessão", sessionData: session },
        { status: 400 }
      );
    }

    // Verify user exists in database before proceeding
    console.log(`Looking up user with ID: ${session.user.id}`);
    
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
      console.log(`User with ID ${session.user.id} not found in database`);
      return NextResponse.json(
        { 
          error: "Usuário não encontrado", 
          userId: session.user.id,
          sessionValid: true,
          suggestion: "Tente fazer logout e login novamente para obter uma nova sessão."
        },
        { status: 404 }
      );
    }

    // Get the JWT token for additional validation
    const token = await getToken({ 
      cookieName: process.env.NEXTAUTH_COOKIE_NAME || "next-auth.session-token",
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
      // Pass request headers instead of the request object
      headers: headers() as any,
    });
    
    return NextResponse.json({
      ...user,
      sessionValid: true,
      tokenValid: !!token,
      isTokenMatching: token?.sub === session.user.id
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { 
        error: "Erro ao carregar perfil",
        details: error instanceof Error ? error.message : "Unknown error",
        suggestion: "Verifique sua sessão ou tente fazer login novamente."
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerAuthSession();
    
    // Detailed session check for PUT requests
    console.log("Update profile - Session data:", JSON.stringify(session, null, 2));
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    if (!session.user.id) {
      return NextResponse.json(
        { error: "ID do usuário não encontrado na sessão", sessionData: session },
        { status: 400 }
      );
    }
    
    // Verify user exists before updating
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    });
    
    if (!userExists) {
      return NextResponse.json(
        { 
          error: "Usuário não encontrado no banco de dados",
          suggestion: "Faça logout e login novamente para obter uma sessão válida."
        },
        { status: 404 }
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