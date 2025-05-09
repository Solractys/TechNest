import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export const metadata: Metadata = {
  title: 'Eventos Tech em São Paulo | TechNest.app',
  description: 'Encontre os melhores eventos de tecnologia em São Paulo. Confira conferências, meetups, workshops e mais.',
};

// This would be replaced with actual data fetching in a real implementation
const mockEvents = [
  {
    id: '1',
    title: 'React São Paulo Meetup',
    slug: 'react-sao-paulo-meetup',
    description: 'Encontro mensal para discutir as últimas novidades do ecossistema React.',
    date: new Date(2023, 10, 15, 19, 0),
    location: 'Google for Startups Campus',
    imageUrl: 'https://images.unsplash.com/photo-1558403194-611308249627',
    categories: [{ name: 'Frontend' }, { name: 'React' }],
    online: false,
  },
  {
    id: '2',
    title: 'AWS User Group SP',
    slug: 'aws-user-group-sp',
    description: 'Grupo de usuários AWS de São Paulo. Venha discutir sobre cloud computing e networking.',
    date: new Date(2023, 10, 20, 18, 30),
    location: 'iFood HQ',
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095',
    categories: [{ name: 'Cloud' }, { name: 'AWS' }],
    online: false,
  },
  {
    id: '3',
    title: 'Python São Paulo',
    slug: 'python-sao-paulo',
    description: 'Evento da comunidade Python de São Paulo com palestras e networking.',
    date: new Date(2023, 10, 25, 19, 0),
    location: 'Nubank Office',
    imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935',
    categories: [{ name: 'Backend' }, { name: 'Python' }],
    online: false,
  },
  {
    id: '4',
    title: 'DevOps Days São Paulo',
    slug: 'devops-days-sao-paulo',
    description: 'Conferência sobre cultura DevOps, automação, e práticas modernas de TI.',
    date: new Date(2023, 11, 5, 9, 0),
    location: 'Centro de Convenções Rebouças',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb',
    categories: [{ name: 'DevOps' }, { name: 'Cloud' }],
    online: false,
  },
  {
    id: '5',
    title: 'AI Summit Online',
    slug: 'ai-summit-online',
    description: 'Webinar sobre os avanços recentes em Inteligência Artificial e Machine Learning.',
    date: new Date(2023, 11, 12, 14, 0),
    location: 'Online',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    categories: [{ name: 'AI' }, { name: 'ML' }],
    online: true,
  },
  {
    id: '6',
    title: 'Frontend Week SP',
    slug: 'frontend-week-sp',
    description: 'Semana dedicada a desenvolvimento frontend com workshops e palestras.',
    date: new Date(2023, 11, 18, 9, 0),
    location: 'Red Ventures Office',
    imageUrl: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f',
    categories: [{ name: 'Frontend' }, { name: 'UX/UI' }],
    online: false,
  },
];

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Eventos Tech em São Paulo</h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Encontre os próximos eventos de tecnologia na cidade</p>
          <Link href="/events/create" className="btn btn-primary">
            Organizar um evento
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              id="category"
              name="category"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              defaultValue=""
            >
              <option value="">Todas as categorias</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="devops">DevOps</option>
              <option value="data-science">Data Science</option>
              <option value="cloud">Cloud</option>
              <option value="ai-ml">AI & ML</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <select
              id="date"
              name="date"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              defaultValue=""
            >
              <option value="">Qualquer data</option>
              <option value="today">Hoje</option>
              <option value="tomorrow">Amanhã</option>
              <option value="this-week">Esta semana</option>
              <option value="this-month">Este mês</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
              Formato
            </label>
            <select
              id="format"
              name="format"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              defaultValue=""
            >
              <option value="">Todos os formatos</option>
              <option value="in-person">Presencial</option>
              <option value="online">Online</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              id="search"
              name="search"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              placeholder="Nome ou descrição do evento"
            />
          </div>
        </div>
      </div>
      
      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockEvents.map((event) => (
          <div key={event.id} className="card hover:shadow-lg transition-shadow duration-300">
            <Link href={`/events/${event.slug}`} className="block">
              <div className="relative h-48">
                <Image
                  src={`${event.imageUrl}?auto=format&fit=crop&w=800&q=80`}
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
                    {format(event.date, 'dd MMM', { locale: ptBR })}
                  </span>
                </div>
                <div className="text-gray-600 mb-2">
                  <time dateTime={event.date.toISOString()}>
                    {format(event.date, 'E, dd MMM · HH:mm', { locale: ptBR })}
                  </time>
                </div>
                <div className="text-gray-600 mb-2">{event.location}</div>
                <p className="text-gray-500 mb-4 line-clamp-2">{event.description}</p>
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
      
      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <a
            href="#"
            className="inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span className="sr-only">Anterior</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href="#"
            className="inline-flex items-center border border-gray-300 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600"
            aria-current="page"
          >
            1
          </a>
          <a
            href="#"
            className="inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            2
          </a>
          <a
            href="#"
            className="inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            3
          </a>
          <span className="inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
            ...
          </span>
          <a
            href="#"
            className="inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span className="sr-only">Próxima</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  );
}