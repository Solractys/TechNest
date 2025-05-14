"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  imageUrl?: string;
  location: string;
  online: boolean;
  published: boolean;
}

interface UserEvent {
  id: string;
  status: string;
  event: Event;
}

export default function MyEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [interestedEvents, setInterestedEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("organized"); // 'organized' or 'interested'

  useEffect(() => {
    // Redirect if not logged in
    if (status === "unauthenticated") {
      router.push("/signin");
    }

    // Fetch events when session is available
    if (status === "authenticated" && session) {
      fetchEvents();
    }
  }, [status, session, router]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      // Fetch events organized by the user
      const response = await fetch("/api/user/events");

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setMyEvents(data.organizedEvents || []);
      setInterestedEvents(data.interestedEvents || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(
        "Ocorreu um erro ao carregar seus eventos. Tente novamente mais tarde.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600 font-medium">
          Carregando informações...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-slate-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Meus Eventos</h1>
          <p className="text-gray-600">
            Gerencie eventos que você organiza ou tem interesse
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            href="/events/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="mr-2 h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Criar Evento
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("organized")}
            className={`${
              activeTab === "organized"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            aria-selected={activeTab === "organized"}
            role="tab"
          >
            Organizados
            {myEvents.length > 0 && (
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === "organized" ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-600"}`}
              >
                {myEvents.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("interested")}
            className={`${
              activeTab === "interested"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            aria-selected={activeTab === "interested"}
            role="tab"
          >
            Tenho Interesse
            {interestedEvents.length > 0 && (
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === "interested" ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-600"}`}
              >
                {interestedEvents.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-md border border-red-200 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-3 text-gray-600 text-sm">Carregando eventos...</p>
        </div>
      ) : activeTab === "organized" ? (
        <div>
          {myEvents.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mx-auto h-12 w-12 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum evento organizado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando seu primeiro evento.
              </p>
              <div className="mt-6">
                <Link
                  href="/events/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Criar Evento
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={
                        event.imageUrl ||
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
                      }
                      alt={event.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to default image if there's an error
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://images.unsplash.com/photo-1540575467063-178a50c2df87";
                      }}
                    />
                    {!event.published && (
                      <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full border border-yellow-200">
                        Rascunho
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {event.title}
                      </h3>
                      <span className="bg-primary-100 text-primary-700 px-2 py-1 text-xs rounded-full">
                        {format(new Date(event.date), "dd MMM", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm mb-4">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {event.online ? "Online" : event.location}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/events/${event.slug}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Visualizar
                      </Link>
                      <span className="text-gray-300">|</span>
                      <Link
                        href={`/events/edit/${event.slug}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Editar
                      </Link>
                      {!event.published && (
                        <>
                          <span className="text-gray-300">|</span>
                          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                            Publicar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {interestedEvents.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mx-auto h-12 w-12 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Você ainda não mostrou interesse em eventos
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Encontre eventos e marque seu interesse.
              </p>
              <div className="mt-6">
                <Link
                  href="/events"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Ver Eventos
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {interestedEvents.map((userEvent) => (
                <div
                  key={userEvent.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={
                        userEvent.event.imageUrl ||
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
                      }
                      alt={userEvent.event.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to default image if there's an error
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://images.unsplash.com/photo-1540575467063-178a50c2df87";
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          userEvent.status === "GOING"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {userEvent.status === "GOING"
                          ? "Vou participar"
                          : "Tenho interesse"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {userEvent.event.title}
                      </h3>
                      <span className="bg-primary-100 text-primary-700 px-2 py-1 text-xs rounded-full">
                        {format(new Date(userEvent.event.date), "dd MMM", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm mb-4">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {userEvent.event.online
                          ? "Online"
                          : userEvent.event.location}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/events/${userEvent.event.slug}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Visualizar
                      </Link>
                      <span className="text-gray-300">|</span>
                      <button
                        className={`text-sm font-medium ${
                          userEvent.status === "GOING"
                            ? "text-blue-600 hover:text-blue-700"
                            : "text-green-600 hover:text-green-700"
                        }`}
                      >
                        {userEvent.status === "GOING"
                          ? "Marcar interesse"
                          : "Confirmar presença"}
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
