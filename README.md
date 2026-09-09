# School Budget System

ระบบแผนงานและงบประมาณโรงเรียน พัฒนาจาก Master System Specification v1.0 โดยใช้ DMF เป็น functional baseline และใช้กฎ/เอกสาร BOPP แบบ versioned evidence ใน Regulation Engine

## Internet demo
GitHub Pages deployment is configured for the web demo:
https://plansps2026-creator.github.io/school-budget-system/

> หมายเหตุ: GitHub Pages แสดง Web UI แบบ static demo เท่านั้น ส่วน API + PostgreSQL ยังต้อง deploy แยกก่อนจึงจะใช้งานข้อมูลจริงและการเข้าสู่ระบบได้

## Status
**Phase 1 + Phase 2 implemented in source**

- Authentication + RBAC/School scope
- Organization / School / Fiscal Year / Academic Year
- Budget Source / Pool / Pocket
- Ledger-based Budget Transactions + balance calculation
- Audit logging foundation
- Next.js web shell + NestJS API
- PostgreSQL + Prisma schema and seed
- Automated tests + UAT / Backup / Security gates

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

## Verification
See `docs/PRODUCTION-VERIFICATION.md` and `docs/UAT-BACKUP-SECURITY-GATE.md`.
CI is defined in `.github/workflows/ci.yml` and the web demo deployment is defined in `.github/workflows/pages.yml`.
