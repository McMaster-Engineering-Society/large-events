# Git Submodules with Sparse Checkout Guide

This document explains how to work with the team submodules in the Large Event Monorepo.

## Overview

The monorepo includes team repositories as git submodules with sparse-checkout configured to only include the `src/` directory from each team's repository. This keeps the monorepo lightweight while allowing integration with team codebases.

## Scripts Available

### 1. Initialize Submodules (First Time Setup)
```bash
./scripts/init-submodules.sh
```
- Clones all team repositories with sparse-checkout enabled
- Only checks out the `src/` directory from each repository
- Configures git submodules properly

### 2. Sync Latest Changes
```bash
./scripts/sync-submodules.sh
```
- Pulls latest changes from all team repositories
- Maintains sparse-checkout configuration
- Use this to get updates from team repositories

### 3. Setup Sparse Checkout Only
```bash
./scripts/setup-sparse-checkout.sh
```
- Configures sparse-checkout for existing submodules
- Use if you already have the repositories but want to enable sparse-checkout

## Team Repository Structure

After initialization, your teams directory will look like:
```
teams/
├── teamA/
│   ├── .git/
│   └── src/          # Only the src directory is checked out
├── teamB/
│   ├── .git/
│   └── src/
├── teamC/
│   ├── .git/
│   └── src/
└── teamD/
    ├── .git/
    └── src/
```

## Troubleshooting

### "pathspec 'src/*' did not match any files"
This error occurs when the team repository doesn't have a `src/` directory. Solutions:
1. Check if the team repository has the correct structure
2. Verify the repository URL in `.gitmodules` is correct
3. Temporarily disable sparse-checkout: `git config core.sparseCheckout false`

### Empty team directories
If team directories exist but are empty:
1. Remove the empty directories: `rm -rf teams/teamA teams/teamB teams/teamC teams/teamD`
2. Run the initialization script: `./scripts/init-submodules.sh`

### .gitignore blocking teams directory
If you get "ignored by .gitignore" errors:
1. Remove `teams/` from `.gitignore`
2. Run `git add teams/` to track the submodules

### Submodule not found in .gitmodules
This happens when submodules aren't properly configured:
1. Run `./scripts/init-submodules.sh` to properly initialize all submodules
2. Check that `.gitmodules` contains the correct repository URLs

## Working with Team Code

### Viewing team source code
```bash
# View teamA source
ls teams/teamA/src/

# Read a team file
cat teams/teamA/src/README.md
```

### Making changes to team code
**Important**: Don't make changes directly in the monorepo. Instead:
1. Work in the team's original repository
2. Push changes to the team repository
3. Sync changes in the monorepo: `./scripts/sync-submodules.sh`

### Adding a new team repository
1. Add the submodule to `.gitmodules`:
   ```
   [submodule "teams/teamE"]
       path = teams/teamE
       url = https://github.com/team/repository.git
       branch = main
   ```
2. Update the scripts to include the new team
3. Run `./scripts/init-submodules.sh`

## Development Workflow

### Initial Setup
1. Clone the monorepo
2. Run `./scripts/setup.sh` (includes submodule initialization)
3. Start development: `pnpm dev`

### Regular Development
1. Pull monorepo changes: `git pull`
2. Sync team changes: `./scripts/sync-submodules.sh`
3. Install dependencies if needed: `pnpm install`
4. Start development: `pnpm dev`

### Before Pushing Changes
1. Ensure all team submodules are up to date
2. Test the integration works correctly
3. Commit any submodule reference updates

## Configuration Files

### .gitmodules
Contains the configuration for all team submodules:
```
[submodule "teams/teamA"]
    path = teams/teamA
    url = https://github.com/KhushiiSaini/capstone_2025-26-Group24
    branch = main
```

### .git/info/sparse-checkout (per team)
Configures which files/directories to check out:
```
src/*
```

## Tips

1. **Always use the provided scripts** instead of manual git submodule commands
2. **Keep team repositories focused** - only put integration code in `src/`
3. **Coordinate with teams** before syncing their latest changes
4. **Test integrations** after syncing team updates
5. **Document API changes** that affect team integration