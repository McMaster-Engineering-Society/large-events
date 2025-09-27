#!/bin/bash

# Git Submodules Sync Script with Sparse Checkout

set -e

echo "🔄 Syncing git submodules with sparse-checkout..."

# Array of team directories
TEAMS=("teamA" "teamB" "teamC" "teamD")

for team in "${TEAMS[@]}"; do
    TEAM_DIR="teams/$team"

    if [ -d "$TEAM_DIR" ] && [ -d "$TEAM_DIR/.git" ]; then
        echo "🔄 Syncing $team..."

        # Enter team directory
        cd "$TEAM_DIR"

        # Ensure sparse-checkout is configured
        if [ ! -f ".git/info/sparse-checkout" ]; then
            echo "🔧 Setting up sparse-checkout for $team..."
            git config core.sparseCheckout true
            echo "src/*" > .git/info/sparse-checkout
        fi

        # Pull latest changes
        git fetch origin
        git checkout main
        git pull origin main

        # Apply sparse-checkout to ensure only src/ is checked out
        git read-tree -m -u HEAD

        # Go back to root
        cd ../..

        echo "✅ $team synced successfully (src/ only)"
    else
        echo "⚠️ $team directory not found or not a git repository"
        echo "   Run ./scripts/init-submodules.sh first to initialize submodules"
    fi
done

echo "✅ All available submodules synced successfully!"
echo ""
echo "📁 Current submodule status:"
git submodule status