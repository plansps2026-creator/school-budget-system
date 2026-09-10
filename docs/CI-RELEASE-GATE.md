# CI Release Gate

## Purpose
CI is the release authority for the School Budget System. No Production Ready declaration is permitted from local/static checks alone.

## Required gates
1. Install dependencies.
2. Generate Prisma client.
3. Apply versioned migrations with `prisma migrate deploy`.
4. Seed deterministic CI data.
5. Build API and Web.
6. Run unit/domain/service tests.
7. Start the API and execute UAT smoke against real HTTP endpoints.
8. Run the security gate.

## Release rule
A release candidate is **not Production Ready** unless the GitHub Actions `CI` workflow finishes with `success`. A queued, cancelled, or failed workflow is a release blocker.

## Database rule
`prisma db push` is intentionally not the release gate. Production/CI verification uses committed migration history so schema changes are reviewable and repeatable.
