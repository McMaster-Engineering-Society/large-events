import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schemas';

export interface DatabaseConfig {
  url?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean;
}

export function createDatabase(config?: DatabaseConfig) {
  const connectionString = config?.url ||
    process.env.DATABASE_URL ||
    'postgresql://user:password@localhost:5432/large_event_db';

  const pool = new Pool({
    connectionString,
    ...config,
  });

  return drizzle(pool, { schema });
}

export const db = createDatabase();

export { schema };

export type Database = ReturnType<typeof createDatabase>;