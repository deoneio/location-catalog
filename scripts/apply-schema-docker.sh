#!/usr/bin/env bash
set -e

# Configuration
CONTAINER_NAME="${1:-shareloc-directus}"
SCHEMA_FILE="$(dirname "$0")/../schema.yaml"

if [ ! -f "$SCHEMA_FILE" ]; then
  echo "Error: schema.yaml not found at $SCHEMA_FILE"
  exit 1
fi

echo "=== Applying Directus Schema Snapshot ==="
echo "Target Container: $CONTAINER_NAME"
echo "Schema File: $SCHEMA_FILE"

# 1. Copy schema.yaml into container
echo "[1/2] Copying schema.yaml to container..."
docker cp "$SCHEMA_FILE" "$CONTAINER_NAME":/directus/schema.yaml

# 2. Run directus schema apply
echo "[2/2] Executing directus schema apply inside container..."
docker exec -i "$CONTAINER_NAME" /directus/node_modules/.pnpm/node_modules/.bin/directus schema apply --yes ./schema.yaml

echo "=== Schema Snapshot Applied Successfully! ==="
