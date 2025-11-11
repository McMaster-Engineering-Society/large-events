export { db, schema, createDatabase, type DatabaseConfig, type Database } from './db';
export * from './schemas';

// Re-export drizzle-orm operators to ensure consistent types across all consumers
export { eq, and, or, sql, not, isNull, isNotNull, inArray, notInArray, exists, notExists } from 'drizzle-orm';