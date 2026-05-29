#!/bin/bash
# ─────────────────────────────────────────────────────────────
# backup.sh — Export all PC Part Compare collections to JSON
# Uses mongoexport (included with MongoDB tools) or falls back
# to a Node.js script if mongo tools aren't installed.
# ─────────────────────────────────────────────────────────────
# Usage:  bash scripts/backup.sh
# Output: backups/backup_YYYY-MM-DD_HH-MM-SS/
# ─────────────────────────────────────────────────────────────

set -e

# Load .env
if [ -f "$(dirname "$0")/../.env" ]; then
  export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

if [ -z "$MONGO_URI" ]; then
  echo "❌ MONGO_URI not set. Make sure .env exists."
  exit 1
fi

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="$(dirname "$0")/../backups/backup_${TIMESTAMP}"
mkdir -p "$BACKUP_DIR"

echo "📦 Starting backup → $BACKUP_DIR"
echo "🕐 Timestamp: $TIMESTAMP"

# Run the Node.js backup script (works without mongo CLI tools)
node "$(dirname "$0")/backup.js" "$BACKUP_DIR" "$MONGO_URI"

echo ""
echo "✅ Backup complete: $BACKUP_DIR"
echo "📁 Files:"
ls -lh "$BACKUP_DIR"
