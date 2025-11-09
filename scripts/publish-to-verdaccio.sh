#!/bin/bash

#
# Publish @large-event packages to local Verdaccio registry
# Usage: ./scripts/publish-to-verdaccio.sh [--unpublish]
#
# Options:
#   --unpublish    Unpublish existing versions before publishing (useful for local dev)
#

set -e

# Parse command line arguments
UNPUBLISH=false
if [ "$1" = "--unpublish" ] || [ "$1" = "-u" ]; then
  UNPUBLISH=true
fi

# Cleanup function to restore .npmrc on exit
cleanup() {
  if [ -f .npmrc.bak ]; then
    echo -e "\n${YELLOW}🔄 Restoring .npmrc...${NC}"
    mv .npmrc.bak .npmrc
    echo -e "${GREEN}✓ .npmrc restored${NC}"
  fi
}

# Set trap to run cleanup on exit
trap cleanup EXIT

REGISTRY="http://localhost:4873"
PACKAGES=("database" "api-types" "api")

# Colors for output
GREEN='\033[0.32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Publishing @large-event packages to Verdaccio${NC}"
echo -e "${GREEN}Registry: ${REGISTRY}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if Verdaccio is running
if ! curl -s "${REGISTRY}" > /dev/null; then
  echo -e "${RED}Error: Verdaccio is not running at ${REGISTRY}${NC}"
  echo -e "${YELLOW}Start it with: docker-compose up -d verdaccio${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Verdaccio is running${NC}"
echo ""

# Check if authenticated with Verdaccio
echo -e "${YELLOW}📝 Checking Verdaccio authentication...${NC}"
if ! npm whoami --registry "${REGISTRY}" &>/dev/null; then
  echo -e "${YELLOW}⚠️  Not authenticated with Verdaccio${NC}"
  echo -e "${YELLOW}⚠️  Please run the following command manually to authenticate:${NC}"
  echo -e "${YELLOW}   npm adduser --registry ${REGISTRY}${NC}"
  echo -e "${YELLOW}   (Use any username/password, e.g., 'test'/'test')${NC}"
  echo ""
  echo -e "${YELLOW}After authentication, run this script again.${NC}"
  exit 1
else
  echo -e "${GREEN}✓ Already authenticated${NC}"
fi
echo ""

# Temporarily modify .npmrc to use Verdaccio
echo -e "${YELLOW}📝 Temporarily updating .npmrc...${NC}"
cp .npmrc .npmrc.bak

# Comment out GitHub Packages registry and add Verdaccio
sed -i.tmp 's|^@large-event:registry=https://npm.pkg.github.com|# @large-event:registry=https://npm.pkg.github.com|' .npmrc
sed -i.tmp 's|^//npm.pkg.github.com/:_authToken|# //npm.pkg.github.com/:_authToken|' .npmrc
echo "@large-event:registry=${REGISTRY}" >> .npmrc
rm .npmrc.tmp 2>/dev/null || true

echo -e "${GREEN}✓ .npmrc configured for Verdaccio${NC}"
echo ""

# Unpublish existing versions if requested
if [ "$UNPUBLISH" = true ]; then
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}🗑️  Unpublishing existing versions...${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""

  for pkg in "${PACKAGES[@]}"; do
    # Get the current version from package.json
    PKG_VERSION=$(node -e "console.log(require('./shared/${pkg}/package.json').version)")

    echo -e "${YELLOW}📦 Unpublishing @large-event/${pkg}@${PKG_VERSION}...${NC}"

    # Check if package exists before trying to unpublish
    if npm view "@large-event/${pkg}@${PKG_VERSION}" --registry "${REGISTRY}" &>/dev/null; then
      npm unpublish "@large-event/${pkg}@${PKG_VERSION}" --registry "${REGISTRY}" --force

      if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Unpublished successfully${NC}"
      else
        echo -e "${YELLOW}⚠️  Failed to unpublish (may not exist)${NC}"
      fi
    else
      echo -e "${YELLOW}⚠️  Version does not exist, skipping${NC}"
    fi
    echo ""
  done

  echo -e "${GREEN}✓ Unpublish phase complete${NC}"
  echo ""
fi

# Build and publish each package
for pkg in "${PACKAGES[@]}"; do
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}📦 Processing @large-event/${pkg}...${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

  # Build the package
  echo -e "${YELLOW}🔨 Building...${NC}"
  pnpm --filter "@large-event/${pkg}" build

  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
  else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
  fi

  # Temporarily backup and remove publishConfig to allow registry override
  PKG_DIR="shared/${pkg}"
  BACKUP_FILE="${PKG_DIR}/package.json.bak"

  echo -e "${YELLOW}📝 Temporarily removing publishConfig...${NC}"
  cp "${PKG_DIR}/package.json" "${BACKUP_FILE}"

  # Remove publishConfig section using Node.js
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('${PKG_DIR}/package.json', 'utf8'));
    delete pkg.publishConfig;
    fs.writeFileSync('${PKG_DIR}/package.json', JSON.stringify(pkg, null, 2) + '\n');
  "

  # Publish to Verdaccio
  echo -e "${YELLOW}📤 Publishing to Verdaccio...${NC}"
  pnpm --filter "@large-event/${pkg}" publish \
    --registry "${REGISTRY}" \
    --no-git-checks \
    --force

  PUBLISH_EXIT_CODE=$?

  # Restore original package.json
  echo -e "${YELLOW}🔄 Restoring package.json...${NC}"
  mv "${BACKUP_FILE}" "${PKG_DIR}/package.json"

  if [ $PUBLISH_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ Published successfully${NC}"
  else
    echo -e "${RED}✗ Publish failed${NC}"
    exit 1
  fi

  echo ""
done

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ All packages published successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}View packages at: ${REGISTRY}${NC}"
echo -e "${YELLOW}Install with: npm install @large-event/<package> --registry ${REGISTRY}${NC}"
