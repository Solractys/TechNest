import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export const metadata: Metadata = {
  title: "Eventos Tech em São Paulo | TechNest.app",
  description:
    "Encontre os melhores eventos de tecnologia em São Paulo. Confira conferências, meetups, workshops e mais.",
};

// Tipos baseados no schema do Prisma
type Category = {
  name: string;
  slug: string;
};

type Organizer = {
  name: string | null;
  image: string | null;
};

type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string; // ISO string
  endDate: string | null; // ISO string
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
};

type PaginationInfo = {
  totalEvents: number;
  totalPages: number;
  currentPage: number;
  eventsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type ApiResponse = {
  events: Event[];
  pagination: PaginationInfo;
};

// Função para formatar data de maneira segura
function formatDateSafe(dateStr: string, formatStr: string) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return ""; // Data inválida
    }
    return format(date, formatStr, { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
  }
}

// Componente principal
export default async function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extrair parâmetros de consulta da URL
  const page =
    typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;
  const date =
    typeof searchParams.date === "string" ? searchParams.date : undefined;
  const format =
    typeof searchParams.format === "string" ? searchParams.format : undefined;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  // Construir parâmetros de consulta
  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());

  if (category) queryParams.set("category", category);
  if (date) queryParams.set("date", date);
  if (format) queryParams.set("format", format);
  if (search) queryParams.set("search", search);

  let events: Event[] = [];
  let pagination: PaginationInfo = {
    totalEvents: 0,
    totalPages: 0,
    currentPage: page,
    eventsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: page > 1,
  };

  try {
    // Construir URL de forma segura para Next.js App Router
    const protocol =
      process.env.NODE_ENV === "development" ? "http:" : "https:";
    const host = process.env.VERCEL_URL || "localhost:3000";
    const apiUrl = new URL(
      `/api/events?${queryParams.toString()}`,
      `${protocol}//${host}`,
    );

    // Usar URL absoluta para evitar erros de parsing
    const res = await fetch(apiUrl.toString(), {
      cache: "no-store", // Não cachear para ver sempre dados atualizados
    });

    if (!res.ok) {
      throw new Error(`Falha ao buscar eventos: ${res.status}`);
    }

    const data: ApiResponse = await res.json();
    events = data.events;
    pagination = data.pagination;
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    // Manter events como array vazio para exibir mensagem de erro
  }

  // Função para construir os links da paginação preservando os filtros
  const getPaginationHref = (pageNum: number) => {
    const params = new URLSearchParams();
    params.append("page", pageNum.toString());

    if (category) params.append("category", category);
    if (date) params.append("date", date);
    if (format) params.append("format", format);
    if (search) params.append("search", search);

    return `/events?${params.toString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-slate-700">
        <h1 className="text-3xl font-bold mb-4">Eventos Tech em São Paulo</h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Encontre os próximos eventos de tecnologia na cidade
          </p>
          <Link href="/events/create" className="btn btn-primary">
            Organizar um evento
          </Link>
        </div>
      </div>

      {/* Filters Form */}
      <form
        action="/events"
        method="GET"
        className="bg-white p-4 rounded-lg text-slate-700 shadow mb-8"
      >
        <input type="hidden" name="page" value="1" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoria
            </label>
            <select
              id="category"
              name="category"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              defaultValue={category || ""}
            >
              <option value="">Todas as categorias</option>
              <option value="Startups">Startups</option>
              <option value="backend">Backend</option>
              <option value="devops">DevOps</option>
              <option value="data-science">Data Science</option>
              <option value="cloud">Cloud</option>
              <option value="ai-ml">AI & ML</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data
            </label>
            <select
              id="date"
              name="date"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              defaultValue={date || ""}
            >
              <option value="">Qualquer data</option>
              <option value="today">Hoje</option>
              <option value="tomorrow">Amanhã</option>
              <option value="this-week">Esta semana</option>
              <option value="this-month">Este mês</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="format"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Formato
            </label>
            <select
              id="format"
              name="format"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              defaultValue={format || ""}
            >
              <option value="">Todos os formatos</option>
              <option value="in-person">Presencial</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Buscar
            </label>
            <div className="flex">
              <input
                type="text"
                id="search"
                name="search"
                className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                placeholder="Nome ou descrição do evento"
                defaultValue={search || ""}
              />
              <button
                type="submit"
                className="bg-primary-500 text-white px-4 rounded-r-md hover:bg-primary-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-10 text-slate-700">
          <h2 className="text-xl font-medium text-gray-700 mb-4">
            Nenhum evento encontrado
          </h2>
          <p className="text-gray-500 mb-6">
            Tente modificar seus filtros de busca ou volte mais tarde.
          </p>
          <Link href="/events" className="btn btn-primary">
            Ver todos os eventos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-slate-700">
          {events.map((event) => (
            <div
              key={event.id}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <Link href={`/events/${event.slug}`} className="block">
                <div className="relative h-48">
                  <Image
                    src={
                      event.imageUrl ||
                      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={event.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  {event.online && (
                    <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Online
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 text-xs rounded-full">
                      {formatDateSafe(event.date, "dd MMM")}
                    </span>
                  </div>
                  <div className="text-gray-600 mb-2">
                    <time dateTime={event.date}>
                      {formatDateSafe(event.date, "E, dd MMM · HH:mm")}
                    </time>
                  </div>
                  <div className="text-gray-600 mb-2">{event.location}</div>
                  <p className="text-gray-500 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {event.categories.map((category, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded-full"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav
            className="inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {/* Previous page button */}
            {pagination.hasPrevPage ? (
              <Link
                href={getPaginationHref(pagination.currentPage - 1)}
                className="inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Anterior</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            ) : (
              <span className="inline-flex items-center rounded-l-md border border-gray-300 bg-gray-100 px-2 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                <span className="sr-only">Anterior</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}

            {/* Generate page numbers */}
            {Array.from({ length: Math.min(5, pagination.totalPages) }).map(
              (_, i) => {
                // Logic to show pages around current page
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (
                  pagination.currentPage >=
                  pagination.totalPages - 2
                ) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                const isCurrentPage = pageNum === pagination.currentPage;

                return (
                  <Link
                    key={i}
                    href={getPaginationHref(pageNum)}
                    className={`inline-flex items-center border ${
                      isCurrentPage
                        ? "border-primary-500 bg-primary-50 text-primary-600"
                        : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                    } px-4 py-2 text-sm font-medium`}
                    aria-current={isCurrentPage ? "page" : undefined}
                  >
                    {pageNum}
                  </Link>
                );
              },
            )}

            {/* Ellipsis for more pages */}
            {pagination.totalPages > 5 &&
              pagination.currentPage < pagination.totalPages - 2 && (
                <span className="inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                  ...
                </span>
              )}

            {/* Last page if not visible in the main range */}
            {pagination.totalPages > 5 &&
              pagination.currentPage < pagination.totalPages - 2 && (
                <Link
                  href={getPaginationHref(pagination.totalPages)}
                  className="inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  {pagination.totalPages}
                </Link>
              )}

            {/* Next page button */}
            {pagination.hasNextPage ? (
              <Link
                href={getPaginationHref(pagination.currentPage + 1)}
                className="inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Próxima</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            ) : (
              <span className="inline-flex items-center rounded-r-md border border-gray-300 bg-gray-100 px-2 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                <span className="sr-only">Próxima</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
