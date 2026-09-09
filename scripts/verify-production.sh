#!/usr/bin/env bash
set -euo pipefail
: "${DATABASE_URL:?DATABASE_URL is required}"
: "${JWT_SECRET:?JWT_SECRET is required}"
if [ "${NODE_ENV:-development}" = "production" ] && [ "${#JWT_SECRET}" -lt 32 ]; then echo "JWT_SECRET must be at least 32 characters in production" >&2; exit 1; fi
npm run db:generate
npm run db:migrate
npm run db:seed
npm run build
npm test
echo "Production verification commands completed successfully."
