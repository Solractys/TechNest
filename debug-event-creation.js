const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Check for users with organizer role
    console.log('=== CHECKING ORGANIZER USERS ===');
    const organizers = await prisma.user.findMany({
      where: {
        role: 'ORGANIZER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    console.log(`Found ${organizers.length} organizer users.`);
    organizers.forEach(org => {
      console.log(`- ID: ${org.id}, Name: ${org.name}, Email: ${org.email}`);
    });

    if (organizers.length === 0) {
      console.log('\n⚠️ No organizer users found. This could cause event creation issues.');
      console.log('Suggestion: Create an organizer user or elevate an existing user to organizer role.');
    }

    // 2. Test create an event with an organizer ID
    if (organizers.length > 0) {
      console.log('\n=== TESTING EVENT CREATION ===');
      
      // Get the first organizer
      const organizer = organizers[0];
      
      // Generate a unique title and slug
      const testTitle = `Test Event ${Date.now()}`;
      const testSlug = `test-event-${Date.now()}`;
      
      try {
        console.log(`Attempting to create event with organizerId: ${organizer.id}`);
        
        const eventData = {
          title: testTitle,
          slug: testSlug,
          description: 'This is a test event for debugging',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          location: 'Test Location',
          city: 'São Paulo',
          state: 'SP',
          online: false,
          published: false,
          organizerId: organizer.id
        };
        
        // Try to create the event
        const event = await prisma.event.create({
          data: eventData
        });
        
        console.log('✅ Event created successfully:', {
          id: event.id,
          title: event.title,
          slug: event.slug,
          organizerId: event.organizerId
        });
        
        // Clean up - delete the test event
        await prisma.event.delete({
          where: { id: event.id }
        });
        console.log('Test event cleaned up.');
        
        console.log('\n=== DIAGNOSIS ===');
        console.log('The database can successfully create events with organizer IDs.');
        console.log('If you are still experiencing issues, the problem might be:');
        console.log('1. Session authentication issues - make sure you are properly logged in');
        console.log('2. API payload issues - check that all required fields are being sent properly');
        console.log('3. Session user ID not matching any user in the database');
        console.log('\nTo debug session issues, log the session data in your API route:');
        console.log('console.log("Session:", JSON.stringify(session, null, 2));');
      } catch (error) {
        console.error('❌ Failed to create test event:', error);
        console.log('\n=== DIAGNOSIS ===');
        console.log('There appears to be an issue with the database or the foreign key constraint.');
        console.log('Suggestions:');
        console.log('1. Verify the organizer ID exists in the user table');
        console.log('2. Check for any database integrity issues');
        console.log('3. Ensure no custom middleware is modifying the request before it reaches the database');
      }
    }

    // 3. Check the events table for existing events
    console.log('\n=== CHECKING EXISTING EVENTS ===');
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        organizerId: true,
        organizer: {
          select: {
            email: true,
            role: true
          }
        }
      },
      take: 5
    });

    console.log(`Found ${await prisma.event.count()} total events.`);
    console.log('Sample of existing events:');
    events.forEach(event => {
      console.log(`- ID: ${event.id}, Title: ${event.title}`);
      console.log(`  Organizer ID: ${event.organizerId}`);
      console.log(`  Organizer Email: ${event.organizer.email}, Role: ${event.organizer.role}`);
    });

  } catch (error) {
    console.error('Error during diagnosis:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();