#!/bin/bash

# Development Environment Startup Script

set -e

echo "🚀 Starting Large Event Development Environment..."

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start infrastructure services
echo "🗃️ Starting database and Redis..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run database migrations
echo "🗃️ Running database migrations..."
pnpm db:migrate

# Start all services in development mode
echo "🚀 Starting all services..."

# Start services in background
# Check if team repositories are set up
TEAMS=("teamA" "teamB" "teamC" "teamD")
MISSING_TEAMS=()

for team in "${TEAMS[@]}"; do
    if [ ! -d "teams/$team/src" ]; then
        MISSING_TEAMS+=("$team")
    fi
done

if [ ${#MISSING_TEAMS[@]} -gt 0 ]; then
    echo "⚠️ Team repositories not found: ${MISSING_TEAMS[*]}"
    echo "📝 Please:"
    echo "   1. Update .gitmodules with actual team repository URLs"
    echo "   2. Run: ./scripts/sync-submodules.sh"
    echo "   3. Then run this script again"
    exit 1
fi

echo "Starting Internal API Gateway..."
pnpm --filter @large-event/gateway dev &
INTERNAL_GATEWAY_PID=$!

echo "Starting Integrated Web User App..."
pnpm --filter @large-event/web-user dev &
WEB_USER_PID=$!

echo "Starting Integrated Web Admin App..."
pnpm --filter @large-event/web-admin dev &
WEB_ADMIN_PID=$!

Start team services if they have package.json files
for team in "${TEAMS[@]}"; do
    if [ -f "teams/$team/src/package.json" ]; then
        echo "Starting $team services..."
        cd "teams/$team/src"
        pnpm dev &
        eval "${team^^}_PID=$!"
        cd ../../..
    else
        echo "⚠️ No package.json found for $team, skipping..."
    fi
done

echo ""
echo "✅ All available services started!"
echo ""
echo "📖 Available Services:"
echo "🌐 Integrated Platform:"
echo "  - Main Gateway: http://localhost:80 (nginx)"
echo "  - User Portal: http://localhost:4000"
echo "  - Admin Portal: http://localhost:4001"
echo ""
echo "⚙️  Development Services:"
echo "  - API Gateway: http://localhost:3000"
echo "  - Database: postgresql://localhost:5432"
echo "  - Redis: redis://localhost:6379"
echo ""
echo "🏢 Team Standalone Apps:"
echo "  - Available at /teams/teamX/user/ and /teams/teamX/admin/"
echo ""
echo "📝 Team services will be available based on their individual configurations"
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo "🚨 Stopping all services..."
    # Kill all background jobs
    jobs -p | xargs -r kill 2>/dev/null
    docker-compose down
    echo "✅ All services stopped"
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Wait for user to stop
wait