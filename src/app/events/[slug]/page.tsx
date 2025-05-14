import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import InterestButtons from "./components/InterestButtons";

type EventPageProps = {
  params: {
    slug: string;
  };
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Organizer = {
  id: string;
  name: string | null;
  image: string | null;
};

type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string | Date;
  endDate: string | Date | null;
  location: string;
  address: string | null;
  city: string;
  state: string;
  online: boolean;
  meetingUrl: string | null;
  imageUrl: string | null;
  website: string | null;
  maxAttendees: number | null;
  price: string | null;
  currency: string;
  published: boolean;
  featured: boolean;
  categories: Category[];
  organizer: Organizer;
  _count: {
    attendees: number;
  };
  userInterest?: {
    id: string;
    status: string;
  } | null;
};

// Função para formatar data de maneira segura
function formatDateSafe(dateStr: string | Date | null, formatStr: string) {
  try {
    if (!dateStr) return "";
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) {
      return ""; // Data inválida
    }
    return format(date, formatStr, { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
  }
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  try {
    // Buscar direto do banco de dados usando Prisma
    const slug = await params.slug;
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
      },
    });

    if (!event) {
      return {
        title: "Evento não encontrado | TechNest.app",
        description: "O evento que você está procurando não foi encontrado.",
      };
    }

    return {
      title: `${event.title} | TechNest.app`,
      description: event.description,
      openGraph: {
        title: event.title,
        description: event.description,
        images: event.imageUrl ? [event.imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Evento | TechNest.app",
      description: "Detalhes do evento TechNest.",
    };
  }
}

export default async function EventPage({ params }: EventPageProps) {
  // Buscar evento diretamente do banco de dados
  const session = await getServerAuthSession();
  
  // Buscar o evento com todos os dados necessários
  const slug = await params.slug;
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
    notFound();
  }

  // Buscar o interesse do usuário se estiver logado
  let userInterest = null;
  if (session?.user?.id) {
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

  // Adicionar interesse do usuário ao evento
  const eventWithUserInterest = {
    ...event,
    userInterest,
  };

  // Check if the event has already passed
  const isEventPassed = new Date(event.date) < new Date();

  // Get the user session to customize UI based on login status
  const isLoggedIn = !!session?.user;

  return (
    <div className="bg-white text-slate-700">
      {/* Event Image Header */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        <Image
          src={
            event.imageUrl ||
            "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1920&q=80"
          }
          alt={event.title}
          fill
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              {/* Event Title and Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {event.categories.map((category) => (
                  <span
                    key={category.id}
                    className="bg-primary-100 text-primary-700 px-2 py-1 text-xs rounded-full"
                  >
                    {category.name}
                  </span>
                ))}

                {event.online && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                    Online
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {event.title}
              </h1>

              {/* Organizer */}
              <div className="flex items-center mb-6">
                <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={
                      event.organizer.image || "https://github.com/ghost.png"
                    }
                    alt={event.organizer.name || "Organizador"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organizado por</p>
                  <p className="font-medium">
                    {event.organizer.name || "Organizador"}
                  </p>
                </div>
              </div>

              {/* Event Description */}
              <div className="prose max-w-none">
                <p>{event.description}</p>
              </div>
            </div>

            {/* Website Link */}
            {event.website && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">
                  Website do evento
                </h3>
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline flex items-center"
                >
                  {event.website}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 ml-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="card sticky top-4">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg mb-4">
                  Informações do evento
                </h3>

                {/* Date and Time */}
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">
                      {formatDateSafe(
                        event.date,
                        "EEEE, dd 'de' MMMM 'de' yyyy",
                      )}
                    </p>
                    <p className="text-gray-500">
                      {formatDateSafe(event.date, "HH:mm")}
                      {event.endDate &&
                        ` - ${formatDateSafe(event.endDate, "HH:mm")}`}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{event.location}</p>
                    {!event.online && event.address && (
                      <p className="text-gray-500">{event.address}</p>
                    )}
                    <p className="text-gray-500">
                      {event.city}, {event.state}
                    </p>

                    {event.online && event.meetingUrl && (
                      <a
                        href={event.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline text-sm mt-2 inline-block"
                      >
                        Link da reunião
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Attendee Information */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Interessados</span>
                  <span className="font-semibold">
                    {event._count.attendees}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4">
                <InterestButtons
                  eventId={event.id}
                  userInterest={eventWithUserInterest.userInterest}
                  isEventPassed={isEventPassed}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
