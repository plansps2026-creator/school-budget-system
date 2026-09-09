# Production Verification Gate

## Required checks
Run in a target environment with PostgreSQL:
`npm install --no-audit --no-fund`, `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`, `npm run build`, `npm test`.

## Environment requirements
- Node.js 22+
- PostgreSQL 16+
- DATABASE_URL
- JWT_SECRET (minimum 32 characters in production)
- NEXT_PUBLIC_API_URL

## Release gate
Do not mark Production Ready until CI or equivalent target environment reports Prisma generation, migration, seed, API build, web build, automated tests, security review, backup/restore drill and pilot acceptance as PASS.
