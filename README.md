# Large Event Management Monorepo

A comprehensive multi-team monorepo architecture for large event management, featuring independent teams with their own APIs, web applications, and mobile apps.

## Architecture Overview

```
repo-main/
├── apps/                         # Integrated applications
│   ├── gateway/                  # Nginx gateway configuration
│   ├── web-user/                # Micro-frontend shell (user portal)
│   ├── web-admin/               # Micro-frontend shell (admin portal)
│   └── mobile/                  # Mobile app shell
├── teams/                       # Git submodules (sparse-checkout: src/ only)
│   ├── teamA/
│   │   └── src/                # Team A's source code from their repository
│   ├── teamB/
│   │   └── src/                # Team B's source code from their repository
│   └── teamC/
│   │   └── src/                # Team C's source code from their repository
│   └── teamD/
│   │   └── src/                # Team D's source code from their repository
├── shared/
│   ├── database/               # Drizzle ORM schemas (cross-team)
│   ├── api-types/              # Shared TypeScript types
│   └── api/                    # Shared API utilities
├── legacy-gateway/             # Legacy API gateway
└── scripts/                    # Automation and setup scripts
```

## Hybrid Development Model

This monorepo supports **two development approaches**:

### 1. **Integrated Applications** (`/apps`)
- **Micro-frontend shell apps** that combine all team features
- **Single user portal** at `/` with widgets from all teams
- **Single admin portal** at `/admin` with integrated management
- **Mobile app shell** that embeds team functionality via WebViews
- **Production-ready** with optimized routing and caching

### 2. **Team Standalone Development** (`/teams`)
- Teams develop **independently** in their own repositories
- **Individual team apps** accessible at `/teams/teamX/user/` and `/teams/teamX/admin/`
- Teams can **develop and test** their features in isolation
- **Automatic integration** into the shell apps via micro-frontends or iframe fallbacks

## Team Structure

Each team maintains their own independent repository with their complete application structure. This monorepo uses **git submodules with sparse-checkout** to include only the `src/` directory from each team's repository.

**Team repositories should follow this structure:**
```
team-repository/
├── src/                     # Only this directory is checked out in monorepo
│   ├── api/                # NestJS API
│   ├── web-user/           # Next.js User Portal
│   ├── web-admin/          # Next.js Admin Panel
│   ├── mobile/             # React Native App
│   ├── shared/             # Team-specific utilities
│   └── package.json        # Team workspace configuration
├── docs/                   # Team documentation (not in monorepo)
├── tests/                  # Team tests (not in monorepo)
└── README.md               # Team README (not in monorepo)
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- Git

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd large-event

# Run setup script
./scripts/setup.sh

# Configure team repositories
# 1. Edit .gitmodules with actual team repository URLs
# 2. Sync team repositories:
./scripts/sync-submodules.sh

# Start development environment
./scripts/dev-start.sh
```

### Manual Setup

```bash
# Install dependencies
pnpm install

# Build shared packages
pnpm --filter @large-event/database build
pnpm --filter @large-event/api-types build

# Configure team repositories
# 1. Update .gitmodules with actual team repository URLs
# 2. Initialize submodules with sparse-checkout:
./scripts/sync-submodules.sh

# Start infrastructure
docker-compose up -d postgres redis

# Run migrations
pnpm db:migrate

# Start gateway and available team services
./scripts/dev-start.sh
```

## Services & Ports

### Production Services
| Service | Port | Description |
|---------|------|-------------|
| **Nginx Gateway** | 80/443 | Main production gateway |
| **User Portal** | / | Integrated micro-frontend shell |
| **Admin Portal** | /admin | Integrated admin interface |

### Development Services
| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 3000 | Internal API proxy |
| User Shell | 4000 | Development user portal |
| Admin Shell | 4001 | Development admin portal |
| PostgreSQL | 5432 | Shared database |
| Redis | 6379 | Cache & session store |

### Team Services
| Path | Description |
|------|-------------|
| `/teams/teamA/user/` | Team A standalone user app |
| `/teams/teamA/admin/` | Team A standalone admin app |
| `/teams/teamB/user/` | Team B standalone user app |
| `/teams/teamB/admin/` | Team B standalone admin app |
| `/teams/teamC/user/` | Team C standalone user app |
| `/teams/teamC/admin/` | Team C standalone admin app |
| `/teams/teamD/user/` | Team D standalone user app |
| `/teams/teamD/admin/` | Team D standalone admin app |

**Team Port Configuration**: Teams define their own port configurations in their `src/package.json`

## API Documentation

### Production
- **Main Portal**: http://localhost/ (integrated experience)
- **Admin Portal**: http://localhost/admin (integrated admin)

### Development
- **User Shell**: http://localhost:4000 (development)
- **Admin Shell**: http://localhost:4001 (development)
- **API Gateway**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

### Team APIs
Team APIs are accessible through the gateway at `/api/v1/teamX/` endpoints. Each team maintains their own API documentation within their repository.

### Team Standalone Apps
- **Team A**: http://localhost/teams/teamA/user/ and /teams/teamA/admin/
- **Team B**: http://localhost/teams/teamB/user/ and /teams/teamB/admin/
- **Team C**: http://localhost/teams/teamC/user/ and /teams/teamC/admin/
- **Team D**: http://localhost/teams/teamD/user/ and /teams/teamD/admin/

## Development Workflow

### Git Submodules with Sparse Checkout

Each team maintains their own repository and is included as a submodule with sparse-checkout (only `src/` directory):

```bash
# Sync all team submodules
./scripts/sync-submodules.sh

# Work on a specific team (work in their main repository)
# Teams develop in their own repositories
# Changes are pulled into the monorepo via submodule updates

# Update a team's submodule reference
cd teams/teamA
git pull origin main
cd ../..
git add teams/teamA
git commit -m "Update teamA to latest version"
```

### Setting up Team Repositories

1. **Update .gitmodules** with actual team repository URLs:
   ```bash
   # Replace <TEAM_X_REPOSITORY_URL> with actual URLs
   vim .gitmodules
   ```

2. **Initialize submodules with sparse-checkout**:
   ```bash
   ./scripts/sync-submodules.sh
   ```

3. **Configure each team's repository** to have a `src/` directory with their applications

### Adding New Features

1. **Database Changes**: Update schemas in `shared/database/src/schemas/`
2. **API Types**: Update types in `shared/api-types/src/`
3. **Team Implementation**: Implement in respective team directories
4. **Integration**: Test inter-team communication

### Testing

```bash
# Run shared package tests
pnpm --filter @large-event/database test
pnpm --filter @large-event/api-types test

# Test gateway
pnpm --filter @large-event/gateway test

# Team testing is handled in their respective repositories
# Teams run their own test suites independently
```

### Deployment

#### Development
```bash
./scripts/dev-start.sh
```

#### Production
```bash
# Build all services
pnpm build

# Start with Docker Compose
docker-compose --profile production up -d
```

## Project Structure Details

### Application Types

#### 1. **Integrated Applications** (`/apps`)
- **Shell applications** that combine all team features
- **Iframe embedding** for team UI integration
- **Independent team deployment** with automatic integration
- **Unified navigation** and user experience

#### 2. **Shared Packages** (`/shared`)
- `@large-event/database`: Drizzle ORM schemas and database utilities
- `@large-event/api-types`: TypeScript interfaces for all APIs

#### 3. **Team Applications** (`/teams`)
- **Independent repositories** included as git submodules
- **Sparse checkout** of only the `src/` directory
- **Full autonomy** for team development practices

### Complete Architecture

```
large-event/
├── apps/                         # 🌐 Integrated Platform
│   ├── gateway/                  #    Nginx reverse proxy
│   ├── web-user/                #    Micro-frontend user shell
│   ├── web-admin/               #    Micro-frontend admin shell
│   └── mobile/                  #    React Native shell app
├── shared/                      # 🔧 Shared Infrastructure
│   ├── database/               #    Cross-team database schemas
│   ├── api-types/              #    Shared TypeScript interfaces
│   └── api/                    #    Shared API utilities
├── teams/                      # 🏢 Team Applications
│   ├── teamA/src/             #    Team A's applications
│   ├── teamB/src/             #    Team B's applications
│   ├── teamC/src/             #    Team C's applications
│   └── teamD/src/             #    Team D's applications
├── legacy-gateway/             # ⚙️  Legacy API Gateway
└── scripts/                   # 🛠️  Automation & Setup
```

### Team Repository Structure

Each team's repository should follow this structure:

```
team-repository/
├── src/                    # 📁 Only this directory is in the monorepo
│   ├── package.json       #    Team workspace configuration
│   ├── api/              #    Team's API server
│   ├── web-user/         #    Team's user-facing web app
│   ├── web-admin/        #    Team's admin web app
│   ├── mobile/           #    Team's mobile components
│   └── shared/           #    Team-specific utilities
├── docs/                 # 📚 Team documentation (not in monorepo)
├── tests/                # 🧪 Team tests (not in monorepo)
└── README.md             # 📖 Team README (not in monorepo)
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/large_event_db

# Gateway
GATEWAY_PORT=3000

# Team API URLs (configure based on team implementations)
TEAM_A_API_URL=http://localhost:3001
TEAM_B_API_URL=http://localhost:3002
TEAM_C_API_URL=http://localhost:3003
TEAM_D_API_URL=http://localhost:3004

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details