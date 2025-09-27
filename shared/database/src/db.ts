import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schemas';

const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/large_event_db';

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });

export { schema };