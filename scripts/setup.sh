#!/bin/bash

# Large Event Monorepo Setup Script

set -e

echo "🚀 Setting up Large Event Monorepo..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️ Docker is not installed. Docker is recommended for local development."
    echo "Please install Docker from https://docker.com"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build shared packages first
echo "🔨 Building shared packages..."
pnpm --filter @large-event/database build
pnpm --filter @large-event/api-types build

# Initialize git submodules with sparse-checkout (if they exist)
if [ -f ".gitmodules" ]; then
    echo "🔄 Initializing git submodules with sparse-checkout..."
    ./scripts/init-submodules.sh
fi

# Copy environment file
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "Please update the .env file with your configuration"
fi

# Generate database schemas
echo "🗃️ Generating database schemas..."
pnpm --filter @large-event/database generate

echo "✅ Setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Start the database: docker-compose up postgres redis -d"
echo "3. Run migrations: pnpm db:migrate"
echo "4. Start development: pnpm dev"
echo ""
echo "📖 Documentation:"
echo "- API Gateway: http://localhost:3000/api"
echo "- Team A API: http://localhost:3001/api"
echo "- Team B API: http://localhost:3002/api"
echo "- Team C API: http://localhost:3003/api"
echo "- Team D API: http://localhost:3004/api"