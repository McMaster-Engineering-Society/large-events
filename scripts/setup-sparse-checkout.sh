#!/bin/bash

# Sparse Checkout Setup Script for Team Repositories

set -e

echo "🔧 Setting up sparse-checkout for team repositories..."

# Array of team directories
TEAMS=("teamA" "teamB" "teamC" "teamD")

for team in "${TEAMS[@]}"; do
    TEAM_DIR="teams/$team"

    if [ -d "$TEAM_DIR" ]; then
        echo "🔧 Configuring sparse-checkout for $team..."

        # Enter team directory
        cd "$TEAM_DIR"

        # Enable sparse-checkout
        git config core.sparseCheckout true

        # Configure sparse-checkout to only include src directory
        echo "src/*" > .git/info/sparse-checkout

        # Apply sparse-checkout
        git read-tree -m -u HEAD

        echo "✅ Sparse-checkout configured for $team (src/ only)"

        # Go back to root
        cd ../..
    else
        echo "⚠️ $team directory not found, skipping sparse-checkout setup..."
    fi
done

echo "✅ Sparse-checkout setup complete!"
echo ""
echo "📁 Team repositories are now configured to only checkout their src/ directories"
echo "🔄 Run ./scripts/sync-submodules.sh to sync the latest changes"