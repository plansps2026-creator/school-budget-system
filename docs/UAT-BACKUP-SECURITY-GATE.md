# UAT / Backup / Security Gate

## Automated gates
1. `npm run uat:smoke` checks health, login and protected read endpoints.
2. `npm run backup:verify` creates a PostgreSQL custom-format backup and verifies it with `pg_restore`.
3. `npm run security:gate` checks repository secrets, JWT guard, school scope guard, AI restrictions and npm audit when a lockfile is present.

## Release rule
Production release requires CI green, successful UAT, successful backup verification, and security gate PASS. No test result is inferred from source code alone.
