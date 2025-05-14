import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

// This would be replaced with actual data from the API
const mockEvents = [
  {
    id: "1",
    title: "React São Paulo Meetup",
    slug: "react-sao-paulo-meetup",
    date: new Date(2023, 10, 15, 19, 0),
    location: "Google for Startups Campus",
    imageUrl: "https://images.unsplash.com/photo-1558403194-611308249627",
    categories: [{ name: "Frontend" }, { name: "React" }],
  },
  {
    id: "2",
    title: "AWS User Group SP",
    slug: "aws-user-group-sp",
    date: new Date(2023, 10, 20, 18, 30),
    location: "iFood HQ",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095",
    categories: [{ name: "Cloud" }, { name: "AWS" }],
  },
  {
    id: "3",
    title: "Python São Paulo",
    slug: "python-sao-paulo",
    date: new Date(2023, 10, 25, 19, 0),
    location: "Nubank Office",
    imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
    categories: [{ name: "Backend" }, { name: "Python" }],
  },
];

export default function Home() {
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
            {mockEvents.map((event) => (
              <Link
                href={`/events/${event.slug}`}
                key={event.id}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={`${event.imageUrl}?auto=format&fit=crop&w=800&q=80`}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 text-xs rounded-full">
                      {format(event.date, "dd MMM", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="text-gray-600 mb-2">
                    <time dateTime={event.date.toISOString()}>
                      {format(event.date, "E, dd MMM · HH:mm", {
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
            ))}
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
            {[
              "Frontend",
              "Backend",
              "DevOps",
              "Data Science",
              "Mobile",
              "Cloud",
              "Security",
              "AI & ML",
            ].map((category) => (
              <Link
                href={`/categories/${category.toLowerCase().replace(" & ", "-").replace(" ", "-")}`}
                key={category}
                className="bg-white p-6 rounded-lg shadow text-center hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-lg text-black">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Faça parte da comunidade tech
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Conecte-se com profissionais, aprenda com especialistas e fique por
            dentro dos eventos mais relevantes da comunidade de tecnologia.
          </p>
          <Link href="/signup" className="btn btn-primary">
            Criar uma conta gratuita
          </Link>
        </div>
      </section>
    </main>
  );
}
