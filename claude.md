# MacEngSociety Large Event Platform

## Project Overview

The MacEngSociety Large Event Platform is a **hybrid monorepo** designed for multi-team collaborative development of an event management system. It combines a centralized integration layer with autonomous team development through git submodules and iframe-based UI composition.

**Key Innovation**: Teams develop independently in their own repositories while automatically integrating into a unified production platform.

---

## Architecture Pattern

**Type**: Hybrid Monorepo with Git Submodules + Sparse Checkout

**Characteristics**:
- 4 team repositories integrated via git submodules
- Sparse checkout (only `src/` directories from team repos)
- Shell applications with iframe-based team integration
- Docker-based infrastructure (PostgreSQL, Redis, Nginx)
- pnpm workspaces for efficient dependency management
- Database overlay system for team experimentation

---

## Directory Structure

```
large-event/
├── apps/                      # Integrated Platform Layer
│   ├── gateway/              # Nginx reverse proxy config
│   ├── web-user/            # User portal shell (iframe-based)
│   ├── web-admin/           # Admin portal shell (iframe-based)
│   └── mobile-shell/        # React Native mobile app shell
│
├── teams/                    # Team Git Submodules (Sparse Checkout)
│   ├── teamA/src/           # Only src/ from team repo
│   ├── teamB/src/           # Only src/ from team repo
│   ├── teamC/src/           # Only src/ from team repo
│   └── teamD/src/           # Only src/ from team repo
│
├── shared/                   # Shared Infrastructure Packages
│   ├── database/            # Drizzle ORM + PostgreSQL schemas
│   ├── api-types/           # TypeScript API type definitions
│   └── api/                 # Shared API utilities
│
├── legacy-gateway/           # Fastify Internal API Gateway
├── scripts/                  # Automation & setup scripts
├── docs/                     # Documentation
├── docker-compose.yml        # 17 containerized services
└── package.json              # Root workspace configuration
```

---

## Team Submodules

### Configuration
**File**: `.gitmodules`

| Team   | GitHub Repository | Branch | Sparse Path |
|--------|------------------|--------|-------------|
| Team A | `KhushiiSaini/capstone_2025-26-Group24` | main | `teams/teamA` |
| Team B | `VirochaanRG/MES-Event-Management-System` | main | `teams/teamB` |
| Team C | `4G06-Streamliners/MacSync` | main | `teams/teamC` |
| Team D | `l-schuurman/capstoneMock` | main | `teams/teamD` |

### Sparse Checkout Strategy
Only these paths from team repositories are checked out:
- `src/` (entire source directory)
- `.gitignore`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `README.md`

### Team Repository Structure
Each team's `src/` directory contains:
```
src/
├── api/          # Fastify/Express backend API
├── web-user/     # Vite + React user portal
├── web-admin/    # Vite + React admin panel
├── mobile/       # React Native mobile components
├── shared/       # Team-specific utilities
├── database/     # (Optional) Team database overlays
└── package.json  # Team workspace config
```

---

## Component Interaction

### Two Development Modes

#### 1. Integrated Platform Mode (Production)
**Access Points**:
- Main User Portal: `http://localhost/` (Port 80)
- Admin Portal: `http://localhost/admin/`
- API Gateway: `http://localhost/api/`

**Features**:
- Shell applications integrate team features
- Iframe-based embedding for team UIs
- Unified navigation and authentication
- Single user experience across all teams

#### 2. Team Standalone Mode (Development)
**Access Points**:
- Team A User: `http://localhost/teams/teamA/user/`
- Team A Admin: `http://localhost/teams/teamA/admin/`
- (Similar for teams B, C, D)

**Benefits**:
- Teams develop and test in isolation
- Independent deployment cycles
- Automatic integration into main platform

### Request Flow Architecture

```
User Request
    ↓
┌─────────────────────────────────────┐
│  Nginx Gateway (Port 80/443)        │
│  - Rate limiting                    │
│  - Security headers                 │
│  - Gzip compression                 │
└─────────────────────────────────────┘
    ↓
    ├─→ /api/*           → Internal Gateway (Port 3000)
    │                       ↓
    │                       ├─→ /api/v1/teamA/* → Team A API (Port 3001)
    │                       ├─→ /api/v1/teamB/* → Team B API (Port 3002)
    │                       ├─→ /api/v1/teamC/* → Team C API (Port 3003)
    │                       └─→ /api/v1/teamD/* → Team D API (Port 3004)
    │
    ├─→ /                → Web User Shell (Port 4000)
    │                       ↓
    │                       Embeds team UIs via iframes
    │
    ├─→ /admin/*         → Web Admin Shell (Port 4001)
    │                       ↓
    │                       Embeds team admin panels via iframes
    │
    └─→ /teams/teamX/*   → Individual Team Apps (Ports 3011-3024)
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.1.1 | UI library |
| Vite | 5.4.8 | Build tool for all web apps |
| TanStack Router | 1.x | Type-safe routing |
| TanStack Query | 5.x | Data fetching & caching |
| Styled Components | 6.x | CSS-in-JS |
| Tailwind CSS | 3.x | Utility CSS |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Fastify | 4.26.2 - 5.2.0 | API gateway & Team D servers |
| Express | 4.19.2 | SSR servers for web apps |
| Drizzle ORM | 0.30.10 | Type-safe database ORM |
| PostgreSQL | 15 | Primary database |
| Redis | 7 | Caching & sessions |

### Mobile
| Technology | Version | Purpose |
|-----------|---------|---------|
| React Native | 0.74.5 | Mobile framework |
| Expo | 51.0.8 | Development platform |
| React Navigation | 6.x | Navigation |

### Build Tools
| Tool | Version | Purpose |
|------|---------|---------|
| pnpm | 8.15.0 | Package manager |
| TypeScript | 5.4.5 | Type safety |
| Docker | Latest | Containerization |
| Nginx | Alpine | Reverse proxy |

---

## Development Workflows

### Initial Setup
```bash
# Clone repository
git clone <repo-url>
cd large-event

# Install dependencies and initialize submodules
pnpm install
./scripts/setup.sh

# Start all services (Docker + dev servers)
./scripts/dev-start.sh
```

### Common Commands

#### Development
```bash
pnpm dev                    # Run all services in parallel
pnpm build                  # Build all packages
pnpm test                   # Run all tests
```

#### Submodule Management
```bash
pnpm sync-submodules        # Pull latest team changes
./scripts/init-submodules.sh  # First-time submodule init
```

#### Database Operations
```bash
# Shared database
pnpm db:generate            # Generate migrations from schema changes
pnpm db:migrate             # Apply migrations to database
pnpm db:push                # Push schema directly (dev only)
pnpm db:studio              # Open Drizzle Studio GUI

# Team D database overlays
pnpm teamd:db:generate      # Generate team-specific migrations
pnpm teamd:db:migrate       # Apply team migrations
pnpm teamd:db:promote       # Promote team schemas to shared layer
```

#### Docker Services
```bash
docker-compose up -d        # Start infrastructure (PostgreSQL, Redis)
docker-compose down         # Stop all services
docker-compose logs -f      # View logs
```

#### Mobile Package Development & Publishing

The platform supports team-specific mobile component packages published to Verdaccio. Teams develop native React Native components independently, then publish them for integration into the mobile-shell.

**Development Workflow:**

```bash
# 1. Develop mobile components in team repository
cd teams/teamD/src/mobile/src/components
# Edit/create React Native components

# 2. Build the mobile package locally
pnpm teamd:mobile:build

# 3. Start Verdaccio (if not running)
docker-compose up -d verdaccio

# 4. Authenticate with Verdaccio (first time only)
npm login --registry http://localhost:4873
# Username: test, Password: test

# 5. Publish package to Verdaccio
pnpm teamd:mobile:publish
# Or manually: cd teams/teamD/src/mobile && pnpm publish --registry http://localhost:4873

# 6. Mobile-shell automatically uses workspace link for development
# Use "workspace:*" in package.json for active development
# Use "1.0.0" (specific version) to test published packages
```

**Two Integration Modes:**

1. **Workspace Development** (Default):
   - Mobile-shell uses `"@teamd/mobile-components": "workspace:*"` in package.json
   - Changes in team mobile components immediately available
   - Best for active development and testing

2. **Published Package Integration**:
   - Change to `"@teamd/mobile-components": "1.0.0"` (specific version)
   - Tests the published Verdaccio package
   - Simulates production deployment
   - Required for verifying package exports work correctly

**Team Mobile Package Structure:**

```
teams/teamD/src/mobile/
├── src/
│   ├── components/       # React Native components
│   │   └── Placeholder.tsx
│   ├── services/         # API clients and utilities
│   │   └── api.ts        # Team D API client
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── index.ts          # Package exports
├── dist/                 # Compiled output (generated)
├── package.json          # Package config with publishConfig
├── tsconfig.json         # TypeScript config
└── README.md             # Team documentation
```

**Integration in Mobile-Shell:**

```typescript
// Import team component
import { TeamDPlaceholder } from '@teamd/mobile-components';
import { useAuth } from '../contexts/AuthContext';
import TeamComponentWrapper from '../components/TeamComponentWrapper';

function TeamDHomeScreen() {
  const { user, token, instances } = useAuth();

  return (
    <TeamComponentWrapper
      user={user!}
      token={token!}
      instances={instances}
      teamName="Team D"
    >
      <TeamDPlaceholder
        user={user!}
        token={token!}
        instances={instances}
      />
    </TeamComponentWrapper>
  );
}
```

**Props Interface:**

All team mobile components receive these props:

```typescript
interface TeamComponentProps {
  user: AuthUser;              // Authenticated user info
  token: string;               // JWT token
  instances: InstanceResponse[]; // User's accessible instances
  onNavigateBack?: () => void; // Optional navigation callback
}
```

**Verdaccio Setup:**

- Registry URL: `http://localhost:4873`
- Web UI: `http://localhost:4873`
- Configured scopes: `@large-event/*`, `@teamd/*`, `@teama/*`, `@teamb/*`, `@teamc/*`
- Authentication: test/test (development only)

**Notes:**
- Team mobile packages export React Native components (NOT web components)
- Components use react-native primitives (View, Text, ScrollView, etc.)
- Teams include their own API clients in `services/` directory
- Mobile-shell provides auth context and shared types via `@large-event/api-types`
- Published packages include both source (`src/`) and compiled (`dist/`) code

### Development Server Ports

| Service | Port | URL |
|---------|------|-----|
| Nginx Gateway | 80 | `http://localhost/` |
| Internal Gateway | 3000 | Internal only |
| Team A API | 3001 | Via `/api/v1/teamA/*` |
| Team B API | 3002 | Via `/api/v1/teamB/*` |
| Team C API | 3003 | Via `/api/v1/teamC/*` |
| Team D API | 3004 | Via `/api/v1/teamD/*` |
| Web User Shell | 4000 | `http://localhost/` |
| Web Admin Shell | 4001 | `http://localhost/admin/` |
| Team A User | 3011 | `http://localhost/teams/teamA/user/` |
| Team A Admin | 3021 | `http://localhost/teams/teamA/admin/` |
| Team B User | 3012 | `http://localhost/teams/teamB/user/` |
| Team B Admin | 3022 | `http://localhost/teams/teamB/admin/` |
| Team C User | 3013 | `http://localhost/teams/teamC/user/` |
| Team C Admin | 3023 | `http://localhost/teams/teamC/admin/` |
| Team D User | 3014 | `http://localhost/teams/teamD/user/` |
| Team D Admin | 3024 | `http://localhost/teams/teamD/admin/` |
| PostgreSQL | 5432 | `postgresql://localhost:5432` |
| Redis | 6379 | `redis://localhost:6379` |

---

## Routing Architecture

### Nginx Configuration
**File**: `apps/gateway/nginx.conf`

| Route Pattern | Upstream | Purpose |
|--------------|----------|---------|
| `/api/*` | `internal-gateway:3000` | API requests → Gateway |
| `/` | `web-user:4000` | Integrated user portal |
| `/admin/*` | `web-admin:4001` | Integrated admin portal |
| `/teams/teamA/user/*` | `team-a-web-user:3011` | Team A standalone user |
| `/teams/teamA/admin/*` | `team-a-web-admin:3021` | Team A standalone admin |
| `/teams/teamB/user/*` | `team-b-web-user:3012` | Team B standalone user |
| `/teams/teamB/admin/*` | `team-b-web-admin:3022` | Team B standalone admin |
| `/teams/teamC/user/*` | `team-c-web-user:3013` | Team C standalone user |
| `/teams/teamC/admin/*` | `team-c-web-admin:3023` | Team C standalone admin |
| `/teams/teamD/user/*` | `team-d-web-user:3014` | Team D standalone user |
| `/teams/teamD/admin/*` | `team-d-web-admin:3024` | Team D standalone admin |
| `/health` | `internal-gateway:3000/health` | Health check |
| `/ws` | `web-user:4000` | WebSocket (HMR) |

### Security Features
- Rate limiting: 10 req/s (API), 30 req/s (web)
- Security headers: X-Frame-Options, X-XSS-Protection, etc.
- CORS configuration
- Gzip compression
- Asset caching (1 year for static files)

---

## Database Architecture

### Shared Database Layer
**Package**: `@large-event/database`
**Location**: `shared/database/`
**Technology**: Drizzle ORM + PostgreSQL

**Purpose**: Cross-team database schemas and shared data models

**Structure**:
```
shared/database/
├── src/
│   ├── schemas/          # Shared table schemas
│   │   └── users.ts      # User authentication & management
│   ├── migrations/       # Timestamped SQL migrations
│   ├── index.ts          # Database connection & exports
│   └── ...
└── package.json
```

**Migration Format**: `YYYYMMDD_HHMMSS_description.sql`

**Exports**:
- Database connection client
- Shared schema definitions
- Migration utilities
- Database utilities

### Team Database Overlays
**Package**: `@teamd/database` (example)
**Location**: `teams/teamD/src/database/`

**Purpose**: Team-specific database extensions without conflicts

**Structure**:
```
teams/teamD/src/database/
├── src/
│   ├── overlays/         # Team-specific schemas
│   ├── migrations/       # Team migrations
│   └── index.ts
└── package.json
```

**Workflow**:
1. Team creates schemas in `overlays/` directory
2. Generate migrations: `pnpm teamd:db:generate`
3. Test independently with team data
4. Promote to shared layer when stable: `pnpm teamd:db:promote`
5. Other teams benefit from promoted schemas

**Benefits**:
- Teams experiment without breaking shared schemas
- Independent migration cycles
- Clear promotion path for proven patterns
- Prevents database conflicts between teams

---

## Shared Packages

### @large-event/database
**Path**: `shared/database/`
**Purpose**: Cross-team database schemas and ORM
**Technology**: Drizzle ORM + PostgreSQL
**Exports**: DB connection, schemas, migrations

### @large-event/api-types
**Path**: `shared/api-types/`
**Purpose**: Shared TypeScript types for APIs
**Dependencies**: `@large-event/database`
**Exports**: Common types, team-specific type namespaces

### @large-event/api
**Path**: `shared/api/`
**Purpose**: Shared API utilities and helpers
**Usage**: Common API logic across teams

### @large-event/gateway
**Path**: `legacy-gateway/`
**Purpose**: Internal Fastify API gateway
**Technology**: Fastify 4.26.2
**Features**: Proxy, CORS, rate limiting, Helmet security

### @large-event/web-user
**Path**: `apps/web-user/`
**Purpose**: Integrated user portal shell
**Technology**: React 19 + Vite + TanStack Router
**Features**: Iframe-based team UI embedding, authentication

### @large-event/web-admin
**Path**: `apps/web-admin/`
**Purpose**: Integrated admin portal shell
**Technology**: React 19 + Vite + TanStack Router
**Features**: Iframe-based team admin embedding, dashboards, data viz (Recharts)

### @large-event/mobile-shell
**Path**: `apps/mobile-shell/`
**Purpose**: Mobile application shell
**Technology**: React Native 0.74.5 + Expo 51
**Features**: WebView integration of team components

---

## Workspace Configuration

### pnpm Workspaces
**File**: Root `package.json`

```json
{
  "workspaces": [
    "shared/database",
    "shared/api-types",
    "shared/api",
    "legacy-gateway",
    "apps/web-user",
    "apps/web-admin",
    "apps/mobile-shell",
    "teams/teamA/src",
    "teams/teamB/src",
    "teams/teamC/src",
    "teams/teamD/src",
    "teams/teamD/src/database"
  ]
}
```

### TypeScript Path Mapping
```typescript
{
  "paths": {
    "@large-event/database": ["./shared/database/src"],
    "@large-event/api-types": ["./shared/api-types/src"],
    "@large-event/api": ["./shared/api/src"],
    "@teamA/*": ["./teams/teamA/src/*"],
    "@teamB/*": ["./teams/teamB/src/*"],
    "@teamC/*": ["./teams/teamC/src/*"],
    "@teamD/*": ["./teams/teamD/src/*"]
  }
}
```

---

## Docker Services

### Infrastructure Services
- **postgres**: PostgreSQL 15 database (Port 5432)
- **redis**: Redis 7 cache and session store (Port 6379)

### Gateway Services
- **gateway**: Nginx reverse proxy (Port 80/443)
- **internal-gateway**: Fastify API gateway (Port 3000)

### Integrated App Services
- **web-user**: User portal shell (Port 4000)
- **web-admin**: Admin portal shell (Port 4001)

### Team API Services
- **team-a-api** through **team-d-api** (Ports 3001-3004)

### Team Web Services (8 services)
- User portals: **team-{a,b,c,d}-web-user** (Ports 3011-3014)
- Admin portals: **team-{a,b,c,d}-web-admin** (Ports 3021-3024)

**Total**: 17 containerized services in `docker-compose.yml`

---

## Key Architectural Patterns

### 1. Monorepo with Git Submodules
- Central integration point
- Team autonomy in separate repositories
- Sparse checkout reduces monorepo size
- Submodule updates pull team changes

### 2. Iframe-Based Integration Architecture
- Shell applications host team features
- Iframe embedding for UI composition
- Independent team app deployment
- Unified navigation and authentication layer

### 3. API Gateway Pattern
- Fastify internal gateway routes to team APIs
- Centralized CORS, rate limiting, security
- Nginx production load balancing
- Health check endpoints

### 4. Database Overlay System
- Shared schemas for cross-team data
- Team overlays for experimentation
- Promotion path for proven schemas
- Prevents database conflicts

### 5. Workspace-based Dependencies
- pnpm workspaces for package management
- Shared packages: `@large-event/*`
- Team packages: `@teamA/*`, `@teamD/*`, etc.
- Catalog-based version management

---

## Automation Scripts

**Location**: `scripts/`

| Script | Purpose |
|--------|---------|
| `setup.sh` | Initial project setup (dependencies, submodules, builds) |
| `sync-submodules.sh` | Sync team repositories with sparse checkout |
| `init-submodules.sh` | First-time submodule initialization |
| `dev-start.sh` | Start development environment (Docker + servers) |
| `db-workflow.sh` | Database management (setup, migrations, overlays) |

### Script Usage Examples
```bash
# Initial setup
./scripts/setup.sh

# Sync latest team changes
./scripts/sync-submodules.sh

# Start development with team servers
./scripts/dev-start.sh --teams

# Reset and rebuild database
./scripts/db-workflow.sh reset
```

---

## Development Best Practices

### For Platform Maintainers
1. **Submodule updates**: Run `pnpm sync-submodules` regularly to pull team changes
2. **Shared schemas**: Only promote stable, tested schemas from team overlays
3. **Breaking changes**: Coordinate with all teams before changing shared packages
4. **Gateway updates**: Test routing changes with all team services running

### For Team Developers
1. **Work in team repo**: Develop features in your team's GitHub repository
2. **Use overlays**: Experiment with database schemas in your overlay directory
3. **Test standalone**: Use `/teams/teamX/*` routes for isolated testing
4. **Promote when ready**: Move stable schemas to shared layer via promotion workflow
5. **Respect shared packages**: Don't modify `@large-event/*` packages directly

### Database Workflow
1. Create schema in team overlay: `teams/teamD/src/database/src/overlays/`
2. Generate migration: `pnpm teamd:db:generate`
3. Apply to local DB: `pnpm teamd:db:migrate`
4. Test with team data
5. When stable, promote: `pnpm teamd:db:promote`
6. Coordinate with platform team for shared layer merge

---

## Quick Reference

### Most Used Commands
```bash
# Start everything
./scripts/dev-start.sh

# Update team code
pnpm sync-submodules

# Database changes
pnpm db:generate && pnpm db:migrate

# Build all packages
pnpm build

# Run tests
pnpm test
```

### Common URLs
- Integrated Platform: http://localhost/
- Admin Dashboard: http://localhost/admin/
- API Gateway: http://localhost/api/
- Team A Standalone: http://localhost/teams/teamA/user/
- Database Studio: `pnpm db:studio`

### Key Files
- Workspace config: `package.json`
- Submodules: `.gitmodules`
- Docker services: `docker-compose.yml`
- Nginx routes: `apps/gateway/nginx.conf`
- Shared DB schemas: `shared/database/src/schemas/`
- Internal gateway: `legacy-gateway/src/index.ts`

---

## Project Metadata

**Package Manager**: pnpm@8.15.0
**Node Version**: >=18.0.0
**Total Services**: 17 Docker containers
**Teams**: 4 (A, B, C, D)
**Workspaces**: 12+ packages
**Architecture**: Hybrid Monorepo + Iframe-based Integration
**Database**: PostgreSQL 15 + Drizzle ORM
**Primary Language**: TypeScript 5.4.5

---

## Important Notes

### Framework Migration History
- **Current**: All web apps now use **Vite + TanStack Router** for improved performance and developer experience

### Backend Frameworks
- **Fastify**: Used for API gateway (legacy-gateway) and Team D servers
- **Express**: Used for SSR servers in web-user and web-admin shells

### Frontend Integration Approach
- **Current Implementation**: Iframe-based embedding of team applications
- **Architecture**: Each team app runs independently on separate ports (3011-3024)
- **Shell Apps**: web-user and web-admin shells embed team UIs via `<iframe>` tags
- **Navigation**: Team apps can be accessed standalone via `/teams/teamX/*` routes or embedded in shells
- **Communication**: Standard iframe postMessage for cross-origin communication