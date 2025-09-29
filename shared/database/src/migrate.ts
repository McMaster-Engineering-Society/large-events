import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/large_event_db';

  console.log('🚀 Running database migrations...');
  console.log(`📍 Database: ${connectionString.replace(/:[^:@]*@/, ':***@')}`);

  const pool = new Pool({
    connectionString,
  });

  const db = drizzle(pool);

  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();