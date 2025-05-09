import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.userEvent.deleteMany();
  await prisma.event.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verificationToken.deleteMany();

  console.log('Seeding database...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Frontend',
        slug: 'frontend',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Backend',
        slug: 'backend',
      },
    }),
    prisma.category.create({
      data: {
        name: 'DevOps',
        slug: 'devops',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cloud',
        slug: 'cloud',
      },
    }),
    prisma.category.create({
      data: {
        name: 'AI & ML',
        slug: 'ai-ml',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mobile',
        slug: 'mobile',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Data Science',
        slug: 'data-science',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Security',
        slug: 'security',
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@technest.app',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create organizer user
  const organizerPassword = await hash('organizer123', 10);
  const organizer = await prisma.user.create({
    data: {
      name: 'Event Organizer',
      email: 'organizer@technest.app',
      password: organizerPassword,
      role: Role.ORGANIZER,
    },
  });

  // Create regular user
  const userPassword = await hash('user123', 10);
  const regularUser = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@technest.app',
      password: userPassword,
      role: Role.USER,
    },
  });

  console.log(`Created 3 users`);

  // Create sample events
  const today = new Date();
  const futureDate = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
  };
  
  const sampleEvents = [
    {
      title: 'React São Paulo Meetup',
      slug: 'react-sao-paulo-meetup',
      description: 'Encontro mensal para discutir as últimas novidades do ecossistema React. Neste meetup, teremos palestras sobre React Server Components, Suspense, e as novidades do React 18.',
      date: futureDate(7),
      endDate: futureDate(7),
      location: 'Google for Startups Campus',
      address: 'Rua Coronel Oscar Porto, 70 - Paraíso',
      city: 'São Paulo',
      state: 'SP',
      online: false,
      imageUrl: 'https://images.unsplash.com/photo-1558403194-611308249627',
      website: 'https://reactsaopaulo.com.br',
      published: true,
      organizerId: organizer.id,
      categories: {
        connect: [
          { slug: 'frontend' },
        ],
      },
    },
    {
      title: 'AWS User Group SP',
      slug: 'aws-user-group-sp',
      description: 'Grupo de usuários AWS de São Paulo. Venha discutir sobre cloud computing e networking.',
      date: futureDate(14),
      endDate: futureDate(14),
      location: 'iFood HQ',
      address: 'Avenida dos Autonomistas, 1496 - Vila Yara',
      city: 'Osasco',
      state: 'SP',
      online: false,
      imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095',
      website: 'https://awsusergroupsp.com',
      published: true,
      organizerId: organizer.id,
      categories: {
        connect: [
          { slug: 'cloud' },
        ],
      },
    },
    {
      title: 'Python São Paulo',
      slug: 'python-sao-paulo',
      description: 'Evento da comunidade Python de São Paulo com palestras e networking.',
      date: futureDate(21),
      endDate: futureDate(21),
      location: 'Nubank Office',
      address: 'Rua Capote Valente, 39 - Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      online: false,
      imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935',
      website: 'https://pythonsaopaulo.com.br',
      published: true,
      organizerId: organizer.id,
      categories: {
        connect: [
          { slug: 'backend' },
        ],
      },
    },
    {
      title: 'AI Summit Online',
      slug: 'ai-summit-online',
      description: 'Webinar sobre os avanços recentes em Inteligência Artificial e Machine Learning.',
      date: futureDate(30),
      endDate: futureDate(30),
      location: 'Online',
      city: 'São Paulo',
      state: 'SP',
      online: true,
      meetingUrl: 'https://zoom.us/j/123456789',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
      website: 'https://ai-summit.tech',
      published: true,
      organizerId: organizer.id,
      categories: {
        connect: [
          { slug: 'ai-ml' },
        ],
      },
    },
  ];
  
  for (const eventData of sampleEvents) {
    await prisma.event.create({
      data: eventData,
    });
  }

  console.log(`Created ${sampleEvents.length} sample events`);

  // Add user interest in events
  await prisma.userEvent.create({
    data: {
      userId: regularUser.id,
      eventId: (await prisma.event.findUnique({ where: { slug: 'react-sao-paulo-meetup' } }))!.id,
      status: 'INTERESTED',
    },
  });

  await prisma.userEvent.create({
    data: {
      userId: regularUser.id,
      eventId: (await prisma.event.findUnique({ where: { slug: 'ai-summit-online' } }))!.id,
      status: 'GOING',
    },
  });

  console.log('Database seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });