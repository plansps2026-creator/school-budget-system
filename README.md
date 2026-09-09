# School Budget System

ระบบบริหารแผนงานและงบประมาณโรงเรียนสำหรับวางแผน จัดสรร ติดตาม และตรวจสอบการใช้งบประมาณ โดยออกแบบจาก **Master System Specification v1.0 (MSS-DMF-BOPP-001)**, ใช้ workflow ของ DMF Projects เป็น functional baseline และออกแบบการอ้างอิงกฎ/ประกาศของ BOPP ให้เป็น **versioned evidence** ไม่ hard-code อัตราหรือเงื่อนไขราชการโดยไม่มีแหล่งอ้างอิงและช่วงเวลาที่มีผล

> **สถานะสำคัญ:** Repository นี้อยู่ระหว่างการพัฒนาและยังไม่ควรถือว่าเป็นระบบ Production ที่ผ่านการ UAT, security review, database migration และ deployment ครบทุกขั้นตอน

## Contents

- [1. ภาพรวม](#1-ภาพรวม)
- [2. เป้าหมายและขอบเขต](#2-เป้าหมายและขอบเขต)
- [3. Functional baseline](#3-functional-baseline)
- [4. โครงสร้างงบประมาณ](#4-โครงสร้างงบประมาณ)
- [5. Workflow และการอนุมัติ](#5-workflow-และการอนุมัติ)
- [6. AI Guardrails](#6-ai-guardrails)
- [7. Regulation / BOPP Evidence](#7-regulation--bopp-evidence)
- [8. สถาปัตยกรรม](#8-สถาปัตยกรรม)
- [9. Project Structure](#9-project-structure)
- [10. Data model](#10-data-model)
- [11. การติดตั้งและรันในเครื่อง](#11-การติดตั้งและรันในเครื่อง)
- [12. การตรวจสอบและทดสอบ](#12-การตรวจสอบและทดสอบ)
- [13. UAT / Backup / Security](#13-uat--backup--security)
- [14. CI/CD และ Internet Demo](#14-cicd-และ-internet-demo)
- [15. Production Readiness](#15-production-readiness)
- [16. Security Notes](#16-security-notes)
- [17. Roadmap](#17-roadmap)
- [18. เอกสารอ้างอิง](#18-เอกสารอ้างอิง)

## 1. ภาพรวม

ระบบมีแนวคิดหลักเป็น:

```text
School
  └── Fiscal Year / Academic Year
        └── Funding Sources / Budget Pools / Budget Pockets
              └── Projects
                    └── Activities
                          └── Expenses / Reports / Attachments

Workflow + Approval + Audit + Regulation Evidence + AI Assistance
```

**Free15 ไม่ถูกออกแบบให้เป็น parent ของ Project** แต่เป็นแหล่ง/กรอบงบประมาณที่เชื่อมกับปีและ budget structure ตามกติกาที่กำหนดไว้

Functional flow หลัก:

```text
Login
  → Dashboard
  → Budget / Free15
  → Project
  → Activity
  → Expense
  → Report
  → Approval
  → Audit
```

## 2. เป้าหมายและขอบเขต

### เป้าหมาย

- รวมข้อมูลแผนงาน โครงการ กิจกรรม และงบประมาณไว้ในระบบเดียว
- คำนวณยอดงบประมาณจาก ledger แทนการแก้ยอดคงเหลือโดยตรง
- แยก School scope และ RBAC อย่างชัดเจน
- รองรับ Fiscal Year และ Academic Year
- เก็บหลักฐาน/แหล่งอ้างอิงของกฎและประกาศแบบ versioned
- มี workflow การตรวจสอบและอนุมัติที่ปรับได้
- ใช้ AI เพื่อช่วย **วิเคราะห์ / ร่าง / อธิบาย / สรุป** โดยไม่มอบอำนาจอนุมัติหรือจ่ายเงินให้ AI
- รองรับ audit trail และการตรวจสอบย้อนหลัง

### ขอบเขตระยะที่มีอยู่ใน source

- Authentication
- RBAC / school scope
- Organization / School
- Fiscal Year / Academic Year
- Budget Source / Pool / Pocket
- Ledger-based Budget Transactions
- Project / Activity foundations
- KPI / Project Member foundations
- Audit logging foundation
- Regulation / Evidence foundation
- AI audit / guardrail foundation
- NestJS API
- Next.js Web UI shell
- PostgreSQL + Prisma schema / seed
- Automated test / UAT / backup / security gate scripts

## 3. Functional baseline

ระบบยึด flow จาก DMF Projects เป็น baseline เชิงหน้าที่ โดยแนวคิดเดิมประกอบด้วย login, dashboard, project, activity, expense/report และ approval

ตัวอย่าง route ที่ใช้เป็น baseline ในการ reverse-engineering:

```text
/auth/login.php
/dashboard/
/projects/
/projects/view.php?id={id}
/projects/edit.php?id={id}
/activities/view.php?id={id}
/activities/report.php?id={id}
/activities/report_pdf.php?id={id}
/free15/index.php?year={yyyy}
/free15/print.php?year={yyyy}
/api/approve_action.php
/api/revoke_approval.php
/api/add_member.php
/api/remove_member.php
/api/delete_activity.php
/api/switch_school.php
```

ระบบใหม่ไม่ได้คัดลอก URL เหล่านี้โดยตรง แต่แปลงเป็น domain/module architecture ที่แยก concern ชัดเจนกว่าเดิม

## 4. โครงสร้างงบประมาณ

### หลักการ

งบประมาณถูกออกแบบเป็น ledger โดย transaction ที่เกี่ยวข้องประกอบด้วย:

```text
OPENING
ALLOCATION
TRANSFER_IN
TRANSFER_OUT
COMMITMENT
EXPENSE
ADJUSTMENT
REVERSAL
```

ยอดคงเหลือคำนวณจากรายการบัญชี ไม่ควรแก้ `balance` แบบอิสระ

แนวคิดโดยย่อ:

```text
Balance = Additions - Deductions

Additions:
  OPENING + ALLOCATION + TRANSFER_IN + ADJUSTMENT + REVERSAL

Deductions:
  TRANSFER_OUT + COMMITMENT + EXPENSE
```

ก่อนสร้างรายการที่ใช้เงิน ระบบควรตรวจสอบ budget sufficiency ตาม ledger และ business rules

### Free15

Free15 เป็น domain/funding context ที่ต้องเชื่อมกับปีและ budget structure โดยไม่ทำให้ project hierarchy ผูกติดกับหน้า Free15 โดยตรง

การคำนวณ/อัตรา/เงื่อนไขราชการต้องอ้างอิง regulation/evidence ที่มี version และ effective date ไม่ควรฝังค่าคงที่ใน business logic โดยไม่มีหลักฐาน

## 5. Workflow และการอนุมัติ

Baseline เดิมมีลำดับประมาณ:

```text
Planning Officer
  → Head of Planning / Budget Admin
  → Deputy Director
  → Director
```

ระบบใหม่ควรทำให้ approval chain configurable ตามโรงเรียน/องค์กร ไม่ hard-code ลำดับเดียวตายตัว

หลักการสำคัญ:

- ผู้อนุมัติต้องอยู่ใน scope ที่ถูกต้อง
- action สำคัญต้องตรวจสิทธิ์และสถานะ workflow
- approve / reject / revoke ต้องถูกบันทึก audit
- AI ไม่สามารถทำ approval action แทนผู้มีอำนาจ

## 6. AI Guardrails

AI ในระบบเป็น **decision-support / assistant** ไม่ใช่ผู้มีอำนาจทางการเงิน

### Allowed

```text
ANALYZE
DRAFT
EXPLAIN
SUMMARIZE
```

### Forbidden

```text
APPROVE
REJECT
TRANSFER
PAY
```

AI ควรช่วยได้ เช่น:

- วิเคราะห์ความสอดคล้องของโครงการกับแผน
- ร่างข้อความ/เอกสาร
- อธิบายกฎหรือข้อมูลที่มี evidence
- สรุปงบประมาณและรายงาน

แต่การอนุมัติ การโอนงบประมาณ และการจ่ายเงินต้องเกิดจาก authorized human action และผ่าน workflow/security controls

## 7. Regulation / BOPP Evidence

ระบบออกแบบให้กฎ/ประกาศราชการเป็นข้อมูลที่มี version และ evidence เช่น:

```text
Regulation
  └── Version
        ├── Effective date
        ├── Source / evidence
        └── Rules / parameters
```

หลักการจากเอกสาร BOPP ที่ใช้เป็น baseline คือการบริหารงบประมาณโดยคำนึงถึงความถูกต้อง ประสิทธิภาพ ประสิทธิผล ความคุ้มค่า ประหยัด โปร่งใส และประโยชน์ต่อนักเรียน/ภาครัฐ รวมถึงการมีส่วนร่วมของครู ผู้ปกครอง ชุมชน และนักเรียน

**ข้อควรระวัง:** อัตราการจัดสรร เงื่อนไข หรือหลักเกณฑ์ของแต่ละปีต้องตรวจสอบจากประกาศ/เอกสารทางการฉบับที่มีผลในช่วงเวลานั้นก่อนนำไปใช้จริง

## 8. สถาปัตยกรรม

ภาพรวม:

```text
┌──────────────────────────────┐
│ Next.js Web Application      │
│ Dashboard / Budget / Project │
└──────────────┬───────────────┘
               │ HTTP API
┌──────────────▼───────────────┐
│ NestJS API                   │
│ Auth / RBAC / Domain Rules   │
│ Budget / Projects / Activity │
│ Workflow / Reports / AI      │
└──────────────┬───────────────┘
               │ Prisma
┌──────────────▼───────────────┐
│ PostgreSQL                   │
│ Domain + Ledger + Audit      │
└──────────────────────────────┘

Cross-cutting:
  Security / School Scope / Audit / Regulation Evidence / AI Guardrails
```

### Technology baseline

- TypeScript
- NestJS
- Next.js
- PostgreSQL
- Prisma
- Jest
- npm workspaces
- GitHub Actions
- GitHub Pages สำหรับ Web static demo

## 9. Project Structure

```text
.
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── activities/
│   │   │   ├── ai/
│   │   │   ├── auth/
│   │   │   ├── budget/
│   │   │   ├── common/
│   │   │   ├── free15/
│   │   │   ├── health/
│   │   │   ├── master/
│   │   │   ├── prisma/
│   │   │   ├── projects/
│   │   │   ├── regulations/
│   │   │   ├── reports/
│   │   │   └── workflow/
│   │   └── test/
│   └── web/                 # Next.js frontend
│       └── app/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── docs/
│   ├── PRODUCTION-VERIFICATION.md
│   └── UAT-BACKUP-SECURITY-GATE.md
├── scripts/
│   ├── security-gate.sh
│   ├── uat-smoke.sh
│   ├── backup-restore-test.sh
│   └── verify-production.sh
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── pages.yml
├── docker-compose.yml
├── package.json
└── README.md
```

> หมายเหตุ: โครงสร้างใน repository อาจเพิ่ม/เปลี่ยนตาม phase การพัฒนา ควรถือ source tree จริงเป็นแหล่งอ้างอิงล่าสุด

## 10. Data model

Prisma schema ปัจจุบันมี domain หลักสำหรับ:

- Organization / School
- User / Role / School scope
- Fiscal Year / Academic Year
- Budget Source / Pool / Pocket
- Budget Transaction / Ledger
- Project / Project Member / KPI
- Activity / Expense / Report / Attachment foundations
- Workflow / Approval / Audit
- Regulation / Regulation Version / Evidence
- Free15
- AI audit / related guardrail data

ก่อนนำขึ้น Production ต้องตรวจสอบ schema, migration history, indexes, foreign keys, constraints และ seed data กับ database จริงอีกครั้ง

## 11. การติดตั้งและรันในเครื่อง

### Prerequisites

- Node.js 20+ (แนะนำ LTS)
- npm 10+
- PostgreSQL 14+
- Git

### Environment

```bash
cp .env.example .env
```

ตรวจสอบค่า database และ JWT secret ให้เหมาะกับ environment ก่อนรัน

### Install

```bash
npm install
```

### Prisma

```bash
npm run db:generate
npm run db:migrate -- --name phase2_budget_foundation
npm run db:seed
```

### Development

```bash
npm run dev
```

โดยค่าเริ่มต้น:

```text
Web: http://localhost:3000
API: http://localhost:4000/api/health
```

### Demo credential

ถ้าใช้ seed ที่มี demo account:

```text
admin@school.local / ChangeMe123!
```

**ห้ามใช้ credential นี้ใน Production** และต้องเปลี่ยน JWT secret/credentials ก่อนนำระบบออกสู่ภายนอก

## 12. การตรวจสอบและทดสอบ

คำสั่งหลักที่เตรียมไว้:

```bash
npm test
npm run security:gate
npm run uat:smoke
npm run backup:verify
npm run build
```

ตรวจ syntax ของ gate scripts ได้ด้วย:

```bash
bash -n scripts/security-gate.sh \
        scripts/uat-smoke.sh \
        scripts/backup-restore-test.sh \
        scripts/verify-production.sh
```

### สิ่งที่ควรถือว่าเป็นหลักฐานผ่าน

การมี script หรือ workflow อยู่ **ไม่เท่ากับการทดสอบผ่าน** ต้องมีผล execution จริงและตรวจสอบ logs/artifacts ประกอบ

ดังนั้น status ของแต่ละ gate ต้องแยกเป็น:

```text
IMPLEMENTED   = มี source/script/workflow แล้ว
PASSED        = รันจริงและผ่าน
BLOCKED       = มี dependency/environment ที่ยังไม่พร้อม
NOT RUN       = ยังไม่ได้รัน
```

## 13. UAT / Backup / Security

เอกสารและ scripts สำหรับ production gate อยู่ที่:

```text
docs/UAT-BACKUP-SECURITY-GATE.md
scripts/uat-smoke.sh
scripts/backup-restore-test.sh
scripts/security-gate.sh
scripts/verify-production.sh
```

Security gate ตรวจประเด็นสำคัญ เช่น:

- ไม่ commit production env files
- ตรวจ hard-coded production secret ที่เห็นได้ชัด
- มี production JWT secret length guard
- มี AI forbidden-action guardrail
- มี school-scope guard
- มี CI workflow
- npm audit เมื่อ environment มี package-lock พร้อมใช้งาน

Backup gate ต้องพิสูจน์ **restore ได้จริง** ไม่ใช่เพียงสร้าง backup file ได้

UAT ต้องทดสอบอย่างน้อย:

```text
Login / RBAC
School scope
Budget allocation
Ledger / balance
Project
Activity
Expense
Workflow / Approval
Report
Audit
AI guardrails
Backup / Restore
```

## 14. CI/CD และ Internet Demo

### GitHub repository

```text
plansps2026-creator/school-budget-system
```

### CI

`.github/workflows/ci.yml` มี security gate สำหรับ push และ pull request

> **สำคัญ:** CI ปัจจุบันเป็น security-focused gate ไม่ควรตีความว่าเป็น full build/test pipeline จนกว่าจะเพิ่มและรันขั้นตอน install, Prisma, test และ build ครบถ้วนบน GitHub Actions

### GitHub Pages

`.github/workflows/pages.yml` เตรียม deployment ของ Web UI แบบ static export

Demo URL ที่ตั้งใจใช้:

```text
https://plansps2026-creator.github.io/school-budget-system/
```

GitHub Pages ใช้สำหรับ **Web demo/static UI** เท่านั้นในสถานะปัจจุบัน ไม่ได้ทำให้ NestJS API หรือ PostgreSQL กลายเป็น public production service โดยอัตโนมัติ

Production architecture ควร deploy อย่างน้อย:

```text
Browser
  → Web hosting
  → API hosting
  → PostgreSQL
  → Object/file storage (ถ้ามี attachment)
```

## 15. Production Readiness

| Area | สถานะจาก source | ต้องพิสูจน์ก่อน Production |
|---|---|---|
| Domain model | Implemented foundation | Review completeness |
| Auth / RBAC | Implemented foundation | Full security/UAT |
| School scope | Guard exists | Cross-school negative tests |
| Budget ledger | Implemented foundation | DB + integration tests |
| Free15 | Domain foundation | Validate yearly official rules |
| Project / Activity | Implemented foundation | Full workflow/UAT |
| Expense / Report | Foundation | End-to-end verification |
| Workflow | Foundation | Config + approval UAT |
| Audit | Foundation | Verify coverage/immutability policy |
| Regulation | Foundation | Load authoritative evidence |
| AI guardrails | Implemented foundation | Adversarial/security tests |
| Prisma schema | Present | Validate against real DB |
| Migrations | Not yet proven complete | Create/test migration history |
| Automated tests | Test source exists | Execute in CI |
| UAT | Script exists | Execute against running system |
| Backup/restore | Script exists | Execute real restore test |
| Security gate | Script exists | Execute in CI/production-like env |
| Web static demo | Deployment configured | Confirm successful Pages run |
| API deployment | Not provided by Pages | Deploy separately |
| PostgreSQL production | Not provided by Pages | Provision and secure separately |

## 16. Security Notes

ก่อน Production อย่างน้อยต้อง:

1. เปลี่ยน demo credentials
2. ใช้ JWT secret ที่สุ่มและมีความยาวเพียงพอ
3. ไม่ commit `.env` หรือ production secrets
4. ใช้ HTTPS
5. จำกัด database network access
6. ตั้ง least-privilege database/application credentials
7. ทดสอบ authorization ทั้ง positive และ negative cases
8. ตรวจ school-scope isolation ข้ามโรงเรียน
9. ตรวจ audit coverage ของ financial/workflow actions
10. ทดสอบ backup และ restore จริง
11. ตรวจ dependency vulnerabilities
12. แยก AI assistance ออกจาก authorization boundary

## 17. Roadmap

### Phase 1 — Foundation

- Auth / RBAC
- Organization / School
- Fiscal / Academic Year
- Base domain structure

### Phase 2 — Budget Foundation

- Budget Source / Pool / Pocket
- Ledger
- Balance calculation
- Free15 foundation
- Audit foundation

### Phase 3 — Project Execution

- Project lifecycle
- Activities
- Expenses
- Attachments
- KPI / progress
- Reports

### Phase 4 — Workflow / Compliance

- Configurable approval chain
- Revoke / return / reject flows
- Regulation engine
- Evidence management
- Advanced audit

### Phase 5 — AI / Production Hardening

- AI assistant workflows
- AI audit trail
- Adversarial guardrail tests
- Full integration/E2E tests
- Production deployment
- Observability
- Backup/restore automation
- Security review

## 18. เอกสารอ้างอิง

### Project specifications

- Master System Specification v1.0: `MSS-DMF-BOPP-001`
- DMF Projects reverse-engineering baseline
- `docs/PRODUCTION-VERIFICATION.md`
- `docs/UAT-BACKUP-SECURITY-GATE.md`

### BOPP

Official source: `https://www.bopp.go.th/`

เอกสาร/ประกาศที่ใช้เป็น evidence baseline ในการศึกษาโครงการ ได้แก่:

- แนวทางปีงบประมาณ 2569: `https://www.bopp.go.th/?p=10119`
- การจัดสรร 30%: `https://www.bopp.go.th/?p=11731`
- การจัดสรร 70%: `https://www.bopp.go.th/?p=10799`
- การจัดสรรพิเศษด้านอาชีวศึกษา 30%: `https://www.bopp.go.th/?p=12097`
- การโอนเงินกลับส่วนกลาง: `https://www.bopp.go.th/?p=12079`
- ปัจจัยพื้นฐานนักเรียนยากจน: `https://www.bopp.go.th/?p=11987`
- การติดตาม/สำรวจ: `https://www.bopp.go.th/?p=12016`

> URL ข้างต้นเป็นแหล่งอ้างอิงสำหรับการศึกษาและ evidence mapping ไม่ควรนำตัวเลขหรือเงื่อนไขไป hard-code โดยไม่ตรวจฉบับล่าสุดและ effective date ที่เกี่ยวข้อง

---

## License / Usage

ยังไม่ได้กำหนด license สำหรับการเผยแพร่สาธารณะใน repository นี้อย่างเป็นทางการ ควรกำหนด license และนโยบายการใช้งานก่อนเปิดให้บุคคลภายนอกนำ source ไปใช้ต่อ

## Maintainer

`plansps2026-creator/school-budget-system`
