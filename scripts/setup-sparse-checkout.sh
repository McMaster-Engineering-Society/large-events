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

        # Configure sparse-checkout to include src directory and root files
        cat > .git/info/sparse-checkout << EOF
src/*
.gitignore
pnpm-lock.yaml
pnpm-workspace.yaml
package.json
README.md
EOF

        # Apply sparse-checkout
        git read-tree -m -u HEAD

        echo "✅ Sparse-checkout configured for $team (src/ + root files)"

        # Go back to root
        cd ../..
    else
        echo "⚠️ $team directory not found, skipping sparse-checkout setup..."
    fi
done

echo "✅ Sparse-checkout setup complete!"
echo ""
echo "📁 Team repositories are now configured to checkout their src/ directories + root files"
echo "🔄 Run ./scripts/sync-submodules.sh to sync the latest changes"