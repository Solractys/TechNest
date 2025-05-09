import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parse } from "url";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { query } = parse(request.url, true);
    
    // Parsing query parameters
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
    const skip = (page - 1) * limit;
    const category = query.category as string | undefined;
    const search = query.search as string | undefined;
    const format = query.format as string | undefined;
    const dateFilter = query.date as string | undefined;
    
    // Building the where clause for filters
    const where: any = {
      published: true,
    };
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Category filter
    if (category) {
      where.categories = {
        some: {
          slug: {
            equals: category,
          },
        },
      };
    }
    
    // Format filter (online/in-person)
    if (format === 'online') {
      where.online = true;
    } else if (format === 'in-person') {
      where.online = false;
    }
    
    // Date filter
    if (dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const thisWeekEnd = new Date(today);
      thisWeekEnd.setDate(today.getDate() + (7 - today.getDay()));
      
      const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      switch (dateFilter) {
        case 'today':
          where.date = {
            gte: today,
            lt: tomorrow,
          };
          break;
        case 'tomorrow':
          where.date = {
            gte: tomorrow,
            lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
          };
          break;
        case 'this-week':
          where.date = {
            gte: today,
            lte: thisWeekEnd,
          };
          break;
        case 'this-month':
          where.date = {
            gte: today,
            lte: thisMonthEnd,
          };
          break;
      }
    } else {
      // By default, only show upcoming events
      where.date = {
        gte: new Date(),
      };
    }

    // Fetch events with pagination and filters
    const events = await prisma.event.findMany({
      where,
      include: {
        categories: {
          select: {
            name: true,
            slug: true,
          },
        },
        organizer: {
          select: {
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
      orderBy: {
        date: 'asc',
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalEvents = await prisma.event.count({ where });
    const totalPages = Math.ceil(totalEvents / limit);
    
    return NextResponse.json({
      events,
      pagination: {
        totalEvents,
        totalPages,
        currentPage: page,
        eventsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get the user's session
    const session = await getServerAuthSession();
    
    console.log("Session debug:", JSON.stringify(session, null, 2));
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autorizado. Faça login para criar um evento." },
        { status: 401 }
      );
    }
    
    // Check if user.id exists
    if (!session.user.id) {
      return NextResponse.json(
        { error: "ID do usuário não encontrado na sessão." },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Basic validation
    if (!data.title || !data.date || !data.location) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    // Generate a slug from the title
    const slug = data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .trim();

    // Check if the slug already exists
    const existingEvent = await prisma.event.findUnique({
      where: { slug },
    });

    // If the slug exists, append a random string to make it unique
    const finalSlug = existingEvent 
      ? `${slug}-${Math.random().toString(36).substring(2, 7)}`
      : slug;

    // Verify the user exists in the database before attempting to create the event
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    });
    
    if (!userExists) {
      return NextResponse.json(
        { error: `Usuário com ID ${session.user.id} não encontrado no banco de dados.` },
        { status: 404 }
      );
    }
    
    console.log(`Creating event with organizerId: ${session.user.id}`);
    
    // Create the event
    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug: finalSlug,
        description: data.description || '',
        date: new Date(data.date),
        endDate: data.endDate ? new Date(data.endDate) : null,
        location: data.location,
        address: data.address,
        city: data.city || 'São Paulo',
        state: data.state || 'SP',
        online: data.online || false,
        meetingUrl: data.meetingUrl,
        imageUrl: data.imageUrl,
        website: data.website,
        maxAttendees: data.maxAttendees,
        price: data.price ? parseFloat(data.price.toString()) : null,
        currency: 'BRL',
        published: data.published ?? true,
        organizerId: session.user.id,
        categories: {
          connect: data.categories?.map((categoryId: string) => ({ id: categoryId })) || [],
        },
      },
    });

    return NextResponse.json({
      ...event,
      message: "Evento criado com sucesso"
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    
    // Check for specific Prisma errors
    if (error instanceof Error) {
      const errorMessage = error.message;
      
      // Handle foreign key constraint violation
      if (errorMessage.includes('Foreign key constraint') && errorMessage.includes('Event_organizerId_fkey')) {
        return NextResponse.json(
          { 
            error: "O ID do organizador não é válido ou não existe no banco de dados.",
            details: errorMessage,
            tip: "Tente fazer logout e login novamente para obter uma nova sessão."
          },
          { status: 400 }
        );
      }
      
      // General error with details
      return NextResponse.json(
        { 
          error: `Erro ao criar evento: ${errorMessage}`,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro ao criar evento' },
      { status: 500 }
    );
  }
}