#!/bin/bash

# Initialize Submodules with Sparse Checkout Script

set -e

echo "🚀 Initializing git submodules with sparse-checkout for src/ only..."

# Create teams directory if it doesn't exist
mkdir -p teams

# Team configurations
TEAMS="teamA:https://github.com/KhushiiSaini/capstone_2025-26-Group24 teamB:https://github.com/VirochaanRG/MES-Event-Management-System.git teamC:https://github.com/4G06-Streamliners/MacSync teamD:https://github.com/l-schuurman/capstoneMock.git"

for team_config in $TEAMS; do
    team=$(echo $team_config | cut -d: -f1)
    url=$(echo $team_config | cut -d: -f2-)
    TEAM_DIR="teams/$team"
    TEAM_URL="$url"

    echo "🔧 Setting up $team..."

    # Remove existing directory if it exists but is not a git repo
    if [ -d "$TEAM_DIR" ] && [ ! -d "$TEAM_DIR/.git" ]; then
        echo "🧹 Removing existing non-git directory for $team..."
        rm -rf "$TEAM_DIR"
    fi

    # If directory doesn't exist, clone with sparse-checkout
    if [ ! -d "$TEAM_DIR" ]; then
        echo "📥 Cloning $team with sparse-checkout..."

        # Clone without checking out files
        git clone --no-checkout "$TEAM_URL" "$TEAM_DIR"

        # Enter the team directory
        cd "$TEAM_DIR"

        # Configure sparse-checkout
        git config core.sparseCheckout true
        echo "src/*" > .git/info/sparse-checkout

        # Checkout only the src/ directory
        git checkout main

        # Go back to root
        cd ../..

        echo "✅ $team initialized successfully (src/ only)"
    else
        echo "📁 $team already exists, updating sparse-checkout..."

        # Enter the team directory
        cd "$TEAM_DIR"

        # Ensure sparse-checkout is configured
        git config core.sparseCheckout true
        echo "src/*" > .git/info/sparse-checkout

        # Apply sparse-checkout
        git read-tree -m -u HEAD

        # Go back to root
        cd ../..

        echo "✅ $team sparse-checkout updated"
    fi
done

# Initialize submodules in git if they're not already tracked
echo "🔗 Adding submodules to git tracking..."
for team_config in $TEAMS; do
    team=$(echo $team_config | cut -d: -f1)
    url=$(echo $team_config | cut -d: -f2-)
    TEAM_DIR="teams/$team"
    TEAM_URL="$url"

    # Check if submodule is already in .gitmodules
    if ! grep -q "path = $TEAM_DIR" .gitmodules 2>/dev/null; then
        echo "📝 Adding $team to .gitmodules..."
        git submodule add -b main "$TEAM_URL" "$TEAM_DIR" || echo "⚠️ Submodule $team may already be configured"
    fi
done

echo "✅ All submodules initialized successfully!"
echo ""
echo "📁 Current submodule status:"
git submodule status

echo ""
echo "🎯 To sync latest changes from team repositories, run:"
echo "   ./scripts/sync-submodules.sh"