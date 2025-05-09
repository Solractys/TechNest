const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Check users in the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            events: true
          }
        }
      }
    });
    
    console.log('Total users found:', users.length);
    
    if (users.length === 0) {
      console.log('No users found in the database. Please run the seed script.');
    } else {
      console.log('\nUser details:');
      
      users.forEach(user => {
        console.log(`
ID: ${user.id}
Name: ${user.name || 'N/A'}
Email: ${user.email}
Role: ${user.role}
Created: ${user.createdAt}
Events created: ${user._count.events}
----------------------------------------`);
      });
      
      // Check admin user
      const adminUser = users.find(user => user.email === 'admin@technest.app');
      if (adminUser) {
        console.log('\nAdmin user exists with ID:', adminUser.id);
      } else {
        console.log('\nAdmin user not found!');
      }
      
      // Check organizer user
      const organizerUser = users.find(user => user.email === 'organizer@technest.app');
      if (organizerUser) {
        console.log('Organizer user exists with ID:', organizerUser.id);
      } else {
        console.log('Organizer user not found!');
      }
    }
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();