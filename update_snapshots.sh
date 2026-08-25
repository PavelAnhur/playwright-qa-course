#!/bin/bash
# update_snapshots.sh
set -euo pipefail

# # Get the actual Playwright version from package.json
# PLAYWRIGHT_VERSION=$(node -p "require('./package.json').devDependencies['@playwright/test']" | sed 's/[\^~]//g')
# echo "Using Playwright version: ${PLAYWRIGHT_VERSION}"

# # Try to pull the image first (optional but recommended)
# docker pull mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-focal

echo "Generating Linux snapshots using Playwright Docker image..."

# Ensure Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running."
  exit 1
fi

docker run --rm --network host \
  -v $(pwd):/work/ \
  -w /work/ \
  -it mcr.microsoft.com/playwright:v1.62.1 \
  npx playwright test --update-snapshots

echo "Snapshot update complete. Please review and commit the changes."
