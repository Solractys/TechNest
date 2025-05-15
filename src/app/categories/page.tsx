import { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Categorias de Eventos Tech | TechNest.app",
  description:
    "Explore as diferentes categorias de eventos de tecnologia disponíveis no TechNest - frontend, backend, cloud, AI e muito mais.",
};

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { events: true },
        },
      },
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

export default async function CategoriesPage() {
  const categories = await getCategories();

  const randomColors = [
    "bg-blue-100 text-blue-800 hover:bg-blue-200",
    "bg-green-100 text-green-800 hover:bg-green-200",
    "bg-purple-100 text-purple-800 hover:bg-purple-200",
    "bg-pink-100 text-pink-800 hover:bg-pink-200",
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    "bg-red-100 text-red-800 hover:bg-red-200",
    "bg-teal-100 text-teal-800 hover:bg-teal-200",
    "bg-orange-100 text-orange-800 hover:bg-orange-200",
    "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  ];

  const getColorClass = (index: number) => {
    return randomColors[index % randomColors.length];
  };

  return (
    <div className="container text-slate-700 mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Categorias de Eventos</h1>
        <p className="text-gray-600">
          Explore eventos de tecnologia por categorias e encontre aqueles que
          combinam com seus interesses
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Nenhuma categoria encontrada. As categorias serão adicionadas em
                breve.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              href={`/events?category=${category.slug}`}
              key={category.id}
              className={`${getColorClass(index)} rounded-lg p-6 shadow-sm transition-all duration-300 transform hover:scale-105 hover:shadow-md`}
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <span className="rounded-full px-3 py-1 text-sm bg-white bg-opacity-50">
                  {category._count.events}{" "}
                  {category._count.events === 1 ? "evento" : "eventos"}
                </span>
              </div>
              <p className="mt-2 text-sm opacity-90">
                Explore todos os eventos de {category.name}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 bg-gray-50 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Não encontrou o que procura?
        </h2>
        <p className="text-gray-600 mb-4">
          Se você está organizando um evento em uma categoria que não está
          listada, você pode criar seu evento e sugerir uma nova categoria.
        </p>
        <Link href="/events/create" className="btn btn-primary">
          Organizar um evento
        </Link>
      </div>
    </div>
  );
}

