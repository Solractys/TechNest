import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { notFound } from 'next/navigation';

type EventPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  // In a real app, fetch the event data from the database
  const event = mockEvents.find((event) => event.slug === params.slug);
  
  if (!event) {
    return {
      title: 'Evento não encontrado | TechNest.app',
      description: 'O evento que você está procurando não foi encontrado.',
    };
  }
  
  return {
    title: `${event.title} | TechNest.app`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [event.imageUrl],
    },
  };
}

// This would be replaced with actual data fetching in a real implementation
const mockEvents = [
  {
    id: '1',
    title: 'React São Paulo Meetup',
    slug: 'react-sao-paulo-meetup',
    description: 'Encontro mensal para discutir as últimas novidades do ecossistema React. Neste meetup, teremos palestras sobre React Server Components, Suspense, e as novidades do React 18. Venha fazer networking com outros desenvolvedores React e trocar experiências!',
    date: new Date(2023, 10, 15, 19, 0),
    endDate: new Date(2023, 10, 15, 22, 0),
    location: 'Google for Startups Campus',
    address: 'Rua Coronel Oscar Porto, 70 - Paraíso',
    city: 'São Paulo',
    state: 'SP',
    online: false,
    imageUrl: 'https://images.unsplash.com/photo-1558403194-611308249627',
    website: 'https://reactsaopaulo.com.br',
    categories: [{ name: 'Frontend' }, { name: 'React' }],
    organizer: {
      name: 'Comunidade React São Paulo',
      image: 'https://github.com/reactjs.png',
    },
    attendeeCount: 87,
  },
  {
    id: '2',
    title: 'AWS User Group SP',
    slug: 'aws-user-group-sp',
    description: 'O AWS User Group São Paulo convida você para mais um encontro! Nesta edição, vamos falar sobre Amazon EKS, AWS Lambda e as melhores práticas para arquiteturas serverless. Venha aprender e compartilhar conhecimento com outros entusiastas de cloud computing.',
    date: new Date(2023, 10, 20, 18, 30),
    endDate: new Date(2023, 10, 20, 21, 30),
    location: 'iFood HQ',
    address: 'Avenida dos Autonomistas, 1496 - Vila Yara',
    city: 'Osasco',
    state: 'SP',
    online: false,
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095',
    website: 'https://awsusergroupsp.com',
    categories: [{ name: 'Cloud' }, { name: 'AWS' }],
    organizer: {
      name: 'AWS User Group São Paulo',
      image: 'https://github.com/aws.png',
    },
    attendeeCount: 65,
  },
  {
    id: '5',
    title: 'AI Summit Online',
    slug: 'ai-summit-online',
    description: 'Webinar sobre os avanços recentes em Inteligência Artificial e Machine Learning. Este evento virtual reunirá especialistas da indústria e academia para discutir as últimas tendências em IA generativa, computer vision e processamento de linguagem natural.',
    date: new Date(2023, 11, 12, 14, 0),
    endDate: new Date(2023, 11, 12, 18, 0),
    location: 'Online',
    city: 'São Paulo',
    state: 'SP',
    online: true,
    meetingUrl: 'https://zoom.us/j/123456789',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    website: 'https://ai-summit.tech',
    categories: [{ name: 'AI' }, { name: 'ML' }],
    organizer: {
      name: 'AI Brasil',
      image: 'https://github.com/deeplearning-ai.png',
    },
    attendeeCount: 215,
  },
];

export default function EventPage({ params }: EventPageProps) {
  // In a real app, fetch the event data from the database
  const event = mockEvents.find((event) => event.slug === params.slug);
  
  if (!event) {
    notFound();
  }

  const isEventPassed = new Date(event.date) < new Date();
  
  return (
    <div className="bg-white">
      {/* Event Image Header */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        <Image
          src={`${event.imageUrl}?auto=format&fit=crop&w=1920&q=80`}
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
                {event.categories.map((category, idx) => (
                  <span
                    key={idx}
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
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
              
              {/* Organizer */}
              <div className="flex items-center mb-6">
                <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                  <Image 
                    src={event.organizer.image}
                    alt={event.organizer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organizado por</p>
                  <p className="font-medium">{event.organizer.name}</p>
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
                <h3 className="text-lg font-semibold mb-2">Website do evento</h3>
                <a 
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline flex items-center"
                >
                  {event.website}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="card sticky top-4">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg mb-4">Informações do evento</h3>
                
                {/* Date and Time */}
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">
                      {format(event.date, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
                    </p>
                    <p className="text-gray-500">
                      {format(event.date, 'HH:mm', { locale: ptBR })} - 
                      {event.endDate && (
                        ` ${format(event.endDate, 'HH:mm', { locale: ptBR })}`
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{event.location}</p>
                    {!event.online && event.address && (
                      <p className="text-gray-500">{event.address}</p>
                    )}
                    <p className="text-gray-500">{event.city}, {event.state}</p>
                    
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
                  <span className="font-semibold">{event.attendeeCount}</span>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="p-4">
                {isEventPassed ? (
                  <button 
                    className="w-full py-2 px-4 rounded bg-gray-200 text-gray-600 cursor-not-allowed"
                    disabled
                  >
                    Evento encerrado
                  </button>
                ) : (
                  <button 
                    className="w-full btn btn-primary"
                  >
                    Tenho interesse
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}