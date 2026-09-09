#!/usr/bin/env bash
set -euo pipefail
: "${DATABASE_URL:?DATABASE_URL is required}"
: "${BACKUP_DIR:=./artifacts/backup-test}"
command -v pg_dump >/dev/null || { echo 'pg_dump is required'; exit 2; }
command -v pg_restore >/dev/null || { echo 'pg_restore is required'; exit 2; }
mkdir -p "$BACKUP_DIR"
file="$BACKUP_DIR/school-budget-$(date +%Y%m%d%H%M%S).dump"
pg_dump --format=custom --no-owner --no-acl "$DATABASE_URL" > "$file"
pg_restore --list "$file" >/dev/null
echo "BACKUP VERIFY PASS: $file"
