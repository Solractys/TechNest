import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import prisma from "@/lib/prisma";

// Get featured events from the database
async function getFeaturedEvents() {
  try {
    // Get upcoming events, ordered by date, limited to 3
    const events = await prisma.event.findMany({
      where: {
        published: true,
        date: {
          gte: new Date(),
        },
      },
      include: {
        categories: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
      take: 3,
    });

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// Get categories from the database
async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function Home() {
  const featuredEvents = await getFeaturedEvents();
  const categories = await getCategories();
  return (
    <main className="min-h-screen text-slate-700">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Encontre eventos tech em São Paulo
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            TechNest conecta você com os melhores eventos de tecnologia
            acontecendo em São Paulo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/events" className="btn btn-secondary">
              Ver todos os eventos
            </Link>
            <Link
              href="/events/create"
              className="btn bg-white text-primary-600 hover:bg-gray-100"
            >
              Organizar um evento
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Eventos em Destaque
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.length > 0 ? (
              featuredEvents.map((event) => (
                <Link
                  href={`/events/${event.slug}`}
                  key={event.id}
                  className="card hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={
                        event.imageUrl ||
                        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <span className="bg-primary-100 text-primary-700 px-2 py-1 text-xs rounded-full">
                        {format(new Date(event.date), "dd MMM", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <div className="text-gray-600 mb-2">
                      <time dateTime={new Date(event.date).toISOString()}>
                        {format(new Date(event.date), "E, dd MMM · HH:mm", {
                          locale: ptBR,
                        })}
                      </time>
                    </div>
                    <div className="text-gray-600 mb-4">{event.location}</div>
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
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">
                  Nenhum evento disponível no momento
                </p>
                <Link
                  href="/events/create"
                  className="mt-4 inline-block btn btn-primary"
                >
                  Seja o primeiro a criar um evento
                </Link>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link href="/events" className="btn btn-primary">
              Ver mais eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Categorias</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.length > 0 ? (
              categories.map((category: any) => (
                <Link
                  href={`/events?category=${category.slug}`}
                  key={category.id}
                  className="bg-white p-6 rounded-lg shadow text-center hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-lg text-black">
                    {category.name}
                  </h3>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">Nenhuma categoria disponível</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-slate-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Faça parte da comunidade tech
          </h2>
          <p className="text-xl text-slate-100 max-w-3xl mx-auto mb-8">
            Conecte-se com profissionais, aprenda com especialistas e fique por
            dentro dos eventos mais relevantes da comunidade de tecnologia.
          </p>
          <Link href="/signup" className="btn btn-secondary">
            Criar uma conta gratuita
          </Link>
        </div>
      </section>
    </main>
  );
}
