import { db } from './db';
import { users } from './schemas/users';

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    await db.insert(users).values([
      { email: 'admin@example.com' },
      { email: 'test@example.com' },
      { email: 'user@large-event.com' }
    ]).onConflictDoNothing();

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();