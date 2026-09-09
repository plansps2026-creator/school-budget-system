# School Budget System

ระบบแผนงานและงบประมาณโรงเรียน พัฒนาจาก Master System Specification v1.0 โดยใช้ DMF เป็น functional baseline และใช้กฎ/เอกสาร BOPP แบบ versioned evidence ใน Regulation Engine

## Status
**Phase 1 + Phase 2 implemented in source**

- Authentication + RBAC/School scope
- Organization / School / Fiscal Year / Academic Year
- Budget Source / Pool / Pocket
- Ledger-based Budget Transactions + balance calculation
- Audit logging foundation
- Next.js web shell + NestJS API
- PostgreSQL + Prisma schema and seed

## Run locally
```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate -- --name phase2_budget_foundation
npm run db:seed
npm run dev
```

Web: http://localhost:3000  
API: http://localhost:4000/api/health

Demo: `admin@school.local` / `ChangeMe123!`

> Change demo credentials and JWT secret before non-local use.

## Final production verification
See `docs/PRODUCTION-VERIFICATION.md` and run `./scripts/verify-production.sh` in an environment with PostgreSQL and npm registry access. CI is defined in `.github/workflows/ci.yml`.
