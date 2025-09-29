# Database Workflow Guide

This guide explains the Drizzle ORM + PostgreSQL development workflow for the large-event monorepo.

## Overview

The database system is structured with:

- **Shared Database Schema** (`shared/database`): Core schemas used across all teams
- **Team Local Overlays** (`teams/teamD/src/database`): Team-specific extensions and customizations
- **Dockerized PostgreSQL**: Shared development database instance
- **Timestamped Migrations**: Automated migration naming with timestamps
- **Schema Promotion Path**: Clean workflow for promoting team changes upstream

## Quick Start

### 1. Initial Setup

```bash
# Set up the entire database system
./scripts/db-workflow.sh setup
```

This will:
- Start PostgreSQL container
- Install all dependencies
- Run shared database migrations
- Set up Team D overlay system

### 2. Daily Development

```bash
# Start database
./scripts/db-workflow.sh start

# Work on shared schemas
pnpm db:generate     # Generate migrations
pnpm db:migrate      # Apply migrations
pnpm db:studio       # Open Drizzle Studio

# Work on Team D overlays
pnpm teamd:db:generate  # Generate Team D migrations
pnpm teamd:db:migrate   # Apply Team D migrations
pnpm teamd:db:studio    # Open Team D Studio
```

## Directory Structure

```
large-event/
├── shared/database/              # Shared database schemas
│   ├── src/
│   │   ├── schemas/             # Core database schemas
│   │   │   ├── users.ts         # User schema
│   │   │   └── index.ts         # Schema exports
│   │   ├── db.ts                # Database connection
│   │   └── migrate.ts           # Migration runner
│   ├── drizzle/                 # Generated migrations
│   ├── scripts/
│   │   └── generate-migration.js # Timestamped migration generator
│   └── drizzle.config.ts        # Drizzle configuration
│
└── teams/teamD/src/database/     # Team D overlay system
    ├── src/
    │   ├── overlays/            # Team-specific schemas
    │   │   ├── team-specific-tables.ts
    │   │   ├── extensions.ts
    │   │   └── index.ts
    │   ├── scripts/
    │   │   └── promote-schema.js # Schema promotion tool
    │   └── index.ts             # Team D database factory
    ├── drizzle/                 # Team D migrations
    └── drizzle.config.ts        # Team D Drizzle config
```

## Core Workflows

### 1. Working with Shared Schemas

When making changes that affect all teams:

```bash
# 1. Edit shared schemas
vim shared/database/src/schemas/users.ts

# 2. Generate timestamped migration
pnpm db:generate

# 3. Review generated migration
cat shared/database/drizzle/0002_20250928_143022.sql

# 4. Apply migration
pnpm db:migrate

# 5. Test with Drizzle Studio
pnpm db:studio
```

### 2. Working with Team D Overlays

When adding team-specific functionality:

```bash
# 1. Create/edit overlay schemas
vim teams/teamD/src/database/src/overlays/team-specific-tables.ts

# 2. Generate Team D migration
pnpm teamd:db:generate

# 3. Apply Team D migration
pnpm teamd:db:migrate

# 4. Test Team D schema
pnpm teamd:db:studio
```

### 3. Promoting Team Changes Upstream

When Team D overlay schemas should become shared:

```bash
# 1. Use the promotion tool
pnpm teamd:db:promote

# 2. Follow the interactive prompts to select schemas
# 3. The tool will copy schemas to shared/database
# 4. Generate new shared migrations
pnpm db:generate

# 5. Update Team D overlays to use promoted schemas
# 6. Test across all teams
```

## Schema Design Patterns

### Shared Schemas

Place in `shared/database/src/schemas/` when:
- Used by multiple teams
- Core business logic
- Cross-team relationships
- Platform-wide features

Example:
```typescript
// shared/database/src/schemas/users.ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 50 }).default('user'),
  // ... other shared fields
});
```

### Team Overlays

Place in `teams/teamD/src/database/src/overlays/` when:
- Team-specific features
- Experimental schemas
- Local customizations
- Team-specific extensions

Example:
```typescript
// teams/teamD/src/database/src/overlays/team-specific-tables.ts
export const teamDProjects = pgTable('teamd_projects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  leadId: integer('lead_id').references(() => users.id),
  // ... team-specific fields
});
```

## Migration Naming

Migrations are automatically timestamped with the timestamp at the start:
- `YYYYMMDD_HHMMSS_descriptive_name.sql`
- Example: `20250929_123648_slim_marvel_zombies.sql`

This ensures:
- Clear chronological ordering
- No naming conflicts between teams
- Easy identification of migration timing

## Database Configuration

### Connection Management

```typescript
// Shared database
import { db } from '@large-event/database';

// Team D database (with overlays)
import { db } from '@teamd/database';
```

### Environment Variables

```bash
# Shared across all environments
DATABASE_URL=postgresql://user:password@localhost:5432/large_event_db
```

## Docker Setup

The PostgreSQL instance is configured in `docker-compose.yml`:

```yaml
postgres:
  image: postgres:15
  environment:
    POSTGRES_DB: large_event_db
    POSTGRES_USER: user
    POSTGRES_PASSWORD: password
  ports:
    - "5432:5432"
```

## Troubleshooting

### Common Issues

1. **Migration conflicts**: Use timestamped migrations to avoid conflicts
2. **Schema promotion**: Use the interactive promotion tool
3. **Connection issues**: Ensure PostgreSQL container is running
4. **Build errors**: Rebuild shared database after schema changes

### Useful Commands

```bash
# Reset everything
./scripts/db-workflow.sh reset

# Check database status
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Connect directly to database
docker-compose exec postgres psql -U user -d large_event_db
```

## Best Practices

1. **Always generate migrations**: Never manually edit migration files
2. **Test locally first**: Use overlays for experimental features
3. **Promote thoughtfully**: Only promote stable, tested schemas
4. **Coordinate with teams**: Communicate shared schema changes
5. **Use semantic names**: Choose descriptive table and column names
6. **Document relationships**: Add comments for complex foreign keys
7. **Version control**: Commit migrations with descriptive messages

## Team Coordination

When working across teams:

1. **Shared changes**: Coordinate via team leads
2. **Breaking changes**: Require approval from all teams
3. **New schemas**: Start in team overlays, promote when stable
4. **Database reviews**: Include database changes in code reviews

This workflow ensures clean separation between shared and team-specific concerns while providing a clear path for promoting successful team innovations to the shared platform.