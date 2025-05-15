import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getToken, type JWT } from "next-auth/jwt";
import { NextRequest } from "next/server";

// Validate environment variables
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
if (!NEXTAUTH_SECRET) {
  console.error("Warning: NEXTAUTH_SECRET environment variable is not set");
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();

    // Enhanced session validation and debugging - log limited session info
    console.log(
      "Session present:",
      !!session,
      "User present:",
      !!session?.user,
      "User ID:",
      session?.user?.id?.substring(0, 5) + "...",
    );

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Não autorizado",
          message: "Faça login para acessar esta página",
        },
        { status: 401 },
      );
    }

    // Check if user.id exists
    if (!session.user.id) {
      return NextResponse.json(
        { error: "ID do usuário não encontrado na sessão" },
        { status: 400 },
      );
    }

    // Verify user exists in database before proceeding
    console.log(
      `Looking up user with ID: ${session.user.id.substring(0, 5)}...`,
    );

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
      console.log(
        `User with ID ${session.user.id.substring(0, 5)}... not found in database`,
      );
      return NextResponse.json(
        {
          error: "Usuário não encontrado",
          userId: session.user.id,
          sessionValid: true,
          suggestion:
            "Tente fazer logout e login novamente para obter uma nova sessão.",
        },
        { status: 404 },
      );
    }

    // Get the JWT token for additional validation
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });

    // Remove potentially sensitive data before returning
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      events: user.events,
      interestedIn: user.interestedIn,
      sessionValid: true,
      tokenValid: !!token,
      isTokenMatching: token?.sub === session.user.id,
    };

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Detailed error:", errorMessage);

    // Check for specific errors related to missing environment variables
    if (errorMessage.includes("secret") || errorMessage.includes("JWT")) {
      console.error(
        "Possible missing or invalid NEXTAUTH_SECRET environment variable",
      );
    }

    return NextResponse.json(
      {
        error: "Erro ao carregar perfil",
        details: errorMessage,
        suggestion: "Verifique sua sessão ou tente fazer login novamente.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerAuthSession();

    // Detailed session check for PUT requests - log limited info
    console.log(
      "Update profile - Session present:",
      !!session,
      "User ID present:",
      !!session?.user?.id,
    );

    // Check for environment variables in development mode
    if (process.env.NODE_ENV === "development" && !NEXTAUTH_SECRET) {
      console.warn("Warning: Missing NEXTAUTH_SECRET in development mode");
    }

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Não autorizado",
          message: "Faça login para atualizar seu perfil",
        },
        { status: 401 },
      );
    }

    if (!session.user.id) {
      return NextResponse.json(
        {
          error: "ID do usuário não encontrado na sessão",
          suggestion:
            "Faça logout e login novamente para obter uma sessão válida.",
        },
        { status: 400 },
      );
    }

    // Verify user exists before updating
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    if (!userExists) {
      return NextResponse.json(
        {
          error: "Usuário não encontrado no banco de dados",
          suggestion:
            "Faça logout e login novamente para obter uma sessão válida.",
        },
        { status: 404 },
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Detailed error:", errorMessage);

    if (error instanceof Error) {
      // Avoid exposing error stack in production
      return NextResponse.json(
        {
          error: `Erro ao atualizar perfil: ${error.message}`,
          details:
            process.env.NODE_ENV === "development"
              ? error.stack
              : "Erro interno",
          suggestion: "Verifique sua sessão ou tente fazer login novamente.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error: "Erro ao atualizar perfil",
        details: "Erro desconhecido durante a atualização",
        suggestion:
          "Tente novamente mais tarde ou entre em contato com o suporte.",
      },
      { status: 500 },
    );
  }
}
