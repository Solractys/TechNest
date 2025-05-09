import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // Default role
      },
    });

    // Return the user without the password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "Usuário criado com sucesso",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erro ao registrar: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Ocorreu um erro ao registrar o usuário" },
      { status: 500 }
    );
  }
}