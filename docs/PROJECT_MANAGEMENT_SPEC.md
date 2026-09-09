# PROJECT MANAGEMENT SPECIFICATION

**Document ID:** PMS-SBS-001  
**Version:** 1.0  
**Status:** Standard for implementation  
**System:** School Budget System  
**Companion standard:** `docs/DESIGN_SYSTEM.md`  
**Authority baseline:** `README.md`, `Master System Specification v1.0 (MSS-DMF-BOPP-001)`, reverse-engineered DMF Projects workflow, and versioned BOPP evidence.

---

## 1. Purpose

เอกสารนี้กำหนดมาตรฐานกลางสำหรับ **Project Management** ของ School Budget System ตั้งแต่การสร้างโครงการ การวางแผนงบประมาณ การกำหนดกิจกรรม การบันทึกค่าใช้จ่าย การติดตาม KPI หลักฐาน การตรวจสอบ การอนุมัติ และการปิดโครงการ

เป้าหมายคือทำให้ `/projects` → `/projects/view` → `/projects/edit` → `/activities` → `/expenses` เป็น **workflow เดียวกัน**, ใช้ domain model เดียวกัน, ใช้ budget ledger เดียวกัน, ใช้ RBAC/school scope เดียวกัน และมี audit trail ต่อเนื่อง

> เอกสารนี้เป็น functional/UX/application standard ไม่ใช่กฎหมายหรือประกาศราชการ และไม่กำหนดอัตรางบประมาณของรัฐโดยไม่มี regulation/evidence ที่มีผลใช้บังคับ

---

## 2. Design Principles

1. **Project is the management unit** — Project เป็นหน่วยบริหาร ไม่ใช่เพียง record สำหรับ CRUD
2. **Activity is execution unit** — Activity เป็นหน่วยปฏิบัติภายใต้ Project
3. **Budget follows ledger** — ยอดงบประมาณคำนวณจาก transaction/ledger ไม่แก้ balance โดยตรง
4. **One source of truth** — Project, Activity และ Expense ต้องอ้างอิง entity เดียวกัน ไม่สร้างยอดซ้ำคนละหน้า
5. **Human approval boundary** — AI ช่วยวิเคราะห์/ร่าง/อธิบาย/สรุป แต่ไม่อนุมัติ ไม่ปฏิเสธ ไม่โอน และไม่จ่ายเงิน
6. **School scope first** — ทุก query และ mutation ต้องตรวจ school/organization scope
7. **Workflow is explicit** — การเปลี่ยนสถานะต้องผ่าน transition ที่กำหนด ไม่เปลี่ยน status ตามใจ client
8. **Evidence matters** — รายการสำคัญต้อง trace กลับไปยังเอกสาร/หลักฐานและผู้กระทำ
9. **Financial clarity** — แยก Allocated, Planned, Committed, Spent, Remaining อย่างชัดเจน
10. **Accessible by default** — ใช้มาตรฐานร่วมกับ `DESIGN_SYSTEM.md` และ WCAG 2.2 AA เป็นเป้าหมาย

---

## 3. Scope and Boundaries

### 3.1 In scope

- Project master data
- Project members/ownership
- Project objectives and scope
- Project budget allocation/reference
- KPI and targets
- Activities
- Activity budget lines
- Expenses
- Attachments/evidence
- Project progress
- Workflow and approval
- Audit history
- Reports/summary
- AI assistance within guardrails

### 3.2 Out of scope

- การทำบัญชีการเงินแทนระบบบัญชีทางการ
- การสั่งจ่ายเงินจริงโดยระบบ AI
- การกำหนดอัตราจัดสรรราชการขึ้นเอง
- การแทนที่ procurement/accounting controls ที่องค์กรกำหนด

---

## 4. Domain Model

```text
School
  └── Fiscal Year / Academic Year
        └── Funding Source
              └── Budget Pool / Pocket
                    └── Project
                          ├── Members
                          ├── KPI / Targets
                          ├── Activities
                          │     ├── Budget Lines
                          │     ├── Expenses
                          │     └── Evidence
                          ├── Workflow
                          ├── Attachments
                          ├── Reports
                          └── Audit Events
```

**Free15 is a funding context, not the parent entity of Project.** Project must remain usable with other funding sources.

### 4.1 Core relationships

| Entity | Cardinality | Rule |
|---|---|---|
| School → Project | 1:N | Project belongs to exactly one school scope |
| Fiscal Year → Project | 1:N | Project has one fiscal context |
| Funding Source → Project | 1:N | Source must be valid for the fiscal year |
| Project → Member | 1:N | At least one accountable owner |
| Project → KPI | 1:N | KPI target must be measurable |
| Project → Activity | 1:N | Activity cannot exist outside a Project |
| Activity → Expense | 1:N | Expense must belong to an activity |
| Project/Activity → Evidence | 1:N | Evidence is traceable and auditable |
| Project → Workflow | 1:1 active workflow | Transition history is append-only |

---

## 5. Project Lifecycle

### 5.1 Canonical states

```text
DRAFT
  ↓
SUBMITTED
  ↓
PENDING_REVIEW
  ├──→ REJECTED → DRAFT
  └──→ APPROVED
           ↓
       IN_PROGRESS
           ↓
       COMPLETED
```

Optional terminal state:

```text
CANCELLED
```

### 5.2 State meanings

| State | Meaning | Editing |
|---|---|---|
| DRAFT | เจ้าของกำลังจัดทำ | Full within permission |
| SUBMITTED | ส่งเข้ากระบวนการ | Limited |
| PENDING_REVIEW | รอตรวจ/อนุมัติ | No financial mutation unless workflow allows |
| REJECTED | ถูกส่งกลับพร้อมเหตุผล | Return to Draft |
| APPROVED | ได้รับอนุมัติ | Controlled amendments |
| IN_PROGRESS | กำลังดำเนินการ | Activity/expense operations allowed |
| COMPLETED | ดำเนินการเสร็จ | Read-only except controlled closeout |
| CANCELLED | ยกเลิก | Read-only except audit |

### 5.3 Transition rules

- Client ห้าม set status โดยตรง
- Server ตรวจ current state + actor role + school scope + required data
- ทุก transition สร้าง audit event
- Reject ต้องมี reason
- Approve ต้องมี authorized approver
- Revoke ต้องมี permission และเหตุผลตาม policy
- การแก้ไขข้อมูลสำคัญหลัง approval ต้องใช้ amendment/review policy

---

## 6. Project Data Contract

### 6.1 Required fields

- project code
- project name
- school
- fiscal year
- funding source/pool/pocket where applicable
- responsible owner
- objective
- target group
- start date
- end date
- planned budget
- at least one measurable KPI for a complete submission

### 6.2 Recommended fields

- strategic plan alignment
- rationale
- expected outcomes
- risks
- assumptions
- participation information
- location
- beneficiaries
- implementation method
- sustainability/continuity
- attachments

### 6.3 Validation

1. End date must not precede start date
2. Planned budget must be non-negative
3. Planned budget must be compatible with selected budget pocket/source
4. Activity dates must fall within Project period unless exception is explicitly configured
5. Activity planned total must not exceed Project planned budget without an explicit approved rule
6. KPI target must specify unit/measurement where applicable
7. Owner must belong to the same school scope
8. Required evidence must exist before defined workflow transitions
9. Project code must be unique within its school/year policy
10. Mutations must pass authorization and optimistic/concurrency controls

---

## 7. Budget Management Standard

### 7.1 Financial vocabulary

- **Allocated** — เงินที่จัดสรรเข้าขอบเขตงบ
- **Planned** — งบที่วางแผนไว้ใน Project/Activity
- **Committed** — งบที่ผูกพันแล้ว
- **Spent** — ค่าใช้จ่ายที่เกิด/บันทึกตาม business rule
- **Remaining** — เงินที่เหลือตาม ledger/business rule

### 7.2 Ledger types

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

### 7.3 Ledger invariant

```text
Additions = OPENING + ALLOCATION + TRANSFER_IN + ADJUSTMENT + REVERSAL
Deductions = TRANSFER_OUT + COMMITMENT + EXPENSE
Balance = Additions - Deductions
```

ตัวเลขบน `/projects/view`, `/activities`, `/expenses` ต้องใช้ calculation source เดียวกัน

### 7.4 Financial controls

- ห้าม expense เกิน available budget
- ตรวจ commitment ก่อน expense ตาม policy
- reversal ต้องอ้างอิงรายการเดิม
- transfer ต้องมีสิทธิ์เฉพาะและ audit
- rounding/decimal policy ต้องเหมือนกันทั้ง API และ UI
- client-side calculation เป็น presentation only

---

## 8. Project Members and Responsibility

### Roles within a project

- **Owner** — รับผิดชอบโครงการ
- **Member** — ปฏิบัติงาน/บันทึกข้อมูลที่ได้รับสิทธิ์
- **Reviewer** — ตรวจสอบข้อมูล
- **Approver** — ผู้มีอำนาจอนุมัติตาม workflow

หลักการ separation of duties ต้องถูกบังคับโดย backend ไม่ใช่แค่ซ่อนปุ่มใน UI

---

## 9. KPI and Progress

Project ต้องแยก **financial progress** และ **operational progress**

```text
Operational Progress
  = completed work / planned work

Financial Progress
  = spent / allocated or approved planned budget
```

ห้ามนำสองค่าไปรวมเป็นค่าเดียวโดยไม่มีคำอธิบาย

KPI ควรมี:

- name
- description
- unit
- baseline
- target
- actual
- measurement date
- evidence/reference
- status

---

## 10. Activity Management

Activity เป็น child ของ Project และต้องมี:

- activity code/name
- objective
- owner
- planned date/time
- participants/target group
- planned budget
- execution status
- result/outcome
- evidence
- expenses

### Activity lifecycle

```text
DRAFT → PLANNED → IN_PROGRESS → COMPLETED
                  └→ CANCELLED
```

Activity ที่มี expense แล้วไม่ควรถูกลบแบบ hard delete; ใช้ cancellation/soft-delete policy และเก็บ audit

---

## 11. Expense Management

Expense เป็น transaction-level operational record ไม่ใช่เพียงตัวเลขใน Project

### Required concepts

- expense date
- description
- category/type
- amount
- activity
- budget source/pocket
- payee/vendor where applicable
- document/reference number where applicable
- evidence/attachment
- created by
- status

### Expense validation

1. Amount > 0 เว้นแต่ reversal policy
2. Activity อยู่ใน Project เดียวกัน
3. Project/Activity อยู่ใน school scope ของ actor
4. Expense date สอดคล้องกับ period policy
5. Budget sufficiency ผ่านก่อน post
6. Duplicate/reference controls ตาม policy
7. Attachment requirement ตาม expense type
8. Posted expense ต้องไม่ถูกแก้ไขแบบทำลาย audit; ใช้ reversal/correction workflow

---

## 12. Evidence and Attachments

Evidence ที่สำคัญควรระบุ:

- file/document reference
- type
- uploaded by
- uploaded at
- related entity
- checksum/version ถ้าระบบรองรับ
- description

เอกสารที่ถูกใช้ประกอบ approval ต้องไม่ถูกเปลี่ยนโดยไร้ trace

---

## 13. Workflow and Approval

Baseline จาก DMF สามารถรองรับ:

```text
Planning Officer
  → Head of Planning / Budget Admin
  → Deputy Director
  → Director
```

แต่ implementation ต้อง **configurable** ตามองค์กร

### Approval contract

Approval action ต้องตรวจ:

```text
Actor
+ Role
+ School Scope
+ Current State
+ Workflow Step
+ Required Data
+ Evidence
+ Conflict-of-interest / separation rule where configured
```

ทุก approval/rejection/revoke สร้าง immutable audit event

---

## 14. Page and Route Standard

### `/projects`

หน้ารายการและค้นหา Project

ต้องมี:

- page header
- year/school context
- search
- status filter
- funding source filter
- owner filter
- date filter
- budget summary/filter
- project table
- pagination
- primary action `สร้างโครงการ`

แต่ละ row ต้องนำไป `/projects/view` และแสดง status/budget อย่างอ่านง่าย

### `/projects/view`

หน้า single-project command center

Sections:

1. Project header + status
2. Actions ตาม permission
3. Budget summary
4. Project information
5. KPI/progress
6. Activities
7. Evidence
8. Workflow/approval
9. Audit timeline

Actions ที่ควรมี:

- แก้ไข
- ส่งตรวจ
- อนุมัติ (authorized only)
- ไม่อนุมัติ (authorized only)
- เพิ่มกิจกรรม
- ดูค่าใช้จ่าย
- ปิดโครงการ (ตาม policy)

### `/projects/edit`

เป็น form เดียวสำหรับ create/edit ตาม mode

Sections:

- Identity
- Planning
- Scope
- Timeline
- Budget
- Owner/members
- KPI
- Evidence
- Save draft / Submit

ต้องมี unsaved-change protection และ validation summary

### `/activities`

Activity workbench ของ project/context ที่เลือก

ต้องมี:

- project context
- activity list
- status
- planned vs spent
- dates
- owner
- completion/progress
- create/edit action
- expense action
- report/evidence action

### `/expenses`

Expense workbench

ต้องมี:

- project/activity context
- filters
- expense table
- totals
- remaining budget
- create expense
- view evidence
- correction/reversal action ตาม permission

---

## 15. Unified User Journey

```text
Projects
  │
  ├── Create/Edit Project
  │       │
  │       └── Save Draft / Submit
  │
  └── View Project
          │
          ├── Activities
          │      │
          │      ├── Create/Update Activity
          │      └── Record Expense
          │              │
          │              └── Evidence
          │
          ├── KPI / Progress
          ├── Workflow / Approval
          └── Audit
```

### Context propagation

ทุกหน้าต้องรักษา context อย่างน้อย:

```text
School
Fiscal Year
Project
Activity (when applicable)
```

การเปลี่ยน context ต้องชัดเจนและไม่ทำให้ user บันทึกข้อมูลผิดโครงการ

---

## 16. API Contract Principles

Recommended resource shape:

```text
GET    /projects
POST   /projects
GET    /projects/:id
PATCH  /projects/:id
POST   /projects/:id/submit
POST   /projects/:id/approve
POST   /projects/:id/reject
POST   /projects/:id/revoke-approval
GET    /projects/:id/activities
POST   /projects/:id/activities
GET    /activities/:id
PATCH  /activities/:id
GET    /activities/:id/expenses
POST   /activities/:id/expenses
GET    /expenses/:id
PATCH  /expenses/:id
POST   /expenses/:id/reverse
```

Actual API naming may follow the existing NestJS module convention, but semantics must remain equivalent

### API requirements

- DTO validation
- authentication
- RBAC
- school scope guard
- transaction boundaries
- idempotency for critical commands where appropriate
- consistent error envelope
- audit event on sensitive mutation

---

## 17. Authorization Matrix

| Action | Owner | Member | Reviewer | Approver | Admin |
|---|---:|---:|---:|---:|---:|
| View project | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create project | ✓ | policy | ✓ | ✓ | ✓ |
| Edit draft | ✓ | policy | ✓ | policy | ✓ |
| Submit | ✓ | policy | ✓ | policy | ✓ |
| Review | — | — | ✓ | ✓ | ✓ |
| Approve | — | — | policy | ✓ | policy |
| Reject | — | — | ✓ | ✓ | ✓ |
| Record activity | ✓ | ✓ | policy | policy | ✓ |
| Record expense | ✓ | ✓ | policy | policy | ✓ |
| Reverse expense | policy | policy | policy | policy | ✓ |
| Transfer budget | — | — | — | policy | ✓ |

`policy` หมายถึง configurable permission ที่ต้องตรวจจาก backend

---

## 18. Error and Empty States

### Empty

- No projects: อธิบายสาเหตุ + `สร้างโครงการ`
- No activities: อธิบาย + `เพิ่มกิจกรรม`
- No expenses: อธิบาย + `บันทึกค่าใช้จ่าย`

### Error

ต้องบอก:

- what failed
- whether data was saved
- retry action
- support/reference ID when appropriate

### Financial conflict

ตัวอย่าง:

```text
ไม่สามารถบันทึกค่าใช้จ่ายได้
เนื่องจากงบประมาณคงเหลือไม่เพียงพอ
คงเหลือ: 8,500.00 บาท
รายการ: 12,000.00 บาท
```

ห้ามแก้ด้วยการให้ client override budget

---

## 19. Audit Standard

Sensitive events อย่างน้อย:

- project created/updated
- project submitted
- project approved/rejected/revoked
- activity created/updated/cancelled
- expense created/posted/updated/reversed
- budget allocation/transfer/adjustment
- member changes
- evidence changes

Audit record ควรมี:

```text
actor
school scope
entity type/id
action
before/after or structured diff
timestamp
request/correlation id where available
reason where required
```

---

## 20. AI Integration Standard

AI is advisory only.

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

AI UI ต้องแสดงว่าเป็นคำแนะนำ/ร่าง และผู้ใช้ต้องเป็นผู้ยืนยันการกระทำที่มีผลต่อ workflow/การเงิน

AI output ที่นำไปใช้กับเอกสารสำคัญควรเก็บ AI audit ตาม policy

---

## 21. Design System Integration

Project Management ต้องใช้ `docs/DESIGN_SYSTEM.md` เป็น UI contract

### Required reusable primitives

- Button
- Card
- StatusBadge
- Form controls
- DataTable
- Alert
- Modal/Confirmation
- PageHeader
- BudgetSummary
- WorkflowStepper
- AuditTimeline
- EmptyState
- LoadingState

### Visual rules

- semantic status colors เท่านั้น
- financial numbers ใช้ numeric alignment
- ไม่ใช้สีเพียงอย่างเดียวในการสื่อสถานะ
- primary action มีความหมายเดียว
- destructive action ต้องมี confirmation
- responsive ตาม breakpoints ของ Design System

---

## 22. Accessibility

Target: WCAG 2.2 AA

Minimum:

- keyboard reachable controls
- visible focus
- labels for form fields
- semantic headings
- table headers
- status announced appropriately
- no color-only state indication
- adequate contrast
- error summary + field-level errors
- touch target suitable for mobile

---

## 23. Responsive Behavior

### Desktop

- sidebar + main workspace
- dense financial tables allowed

### Tablet

- collapsible navigation
- tables may horizontally scroll

### Mobile

- single-column sections
- sticky/clear primary action where useful
- project summary stacks vertically
- filters collapse into a panel
- expense rows become readable cards or horizontally scrollable table

---

## 24. Security and Data Integrity

1. Never trust client-provided school/project ownership
2. Validate all IDs against scope
3. Use parameterized ORM queries
4. Validate uploads and content types
5. Avoid secrets in source
6. Audit financial mutations
7. Protect against duplicate commands
8. Prevent unauthorized status changes
9. Do not expose internal error details to users
10. Apply least privilege

---

## 25. Performance

- Server-side pagination for large Project/Expense lists
- indexed filters: school, year, status, owner, project, activity, date
- aggregate financial values efficiently
- avoid N+1 relation loading
- debounce free-text search
- lazy-load non-critical evidence metadata
- preserve fast first render for `/projects`

---

## 26. Testing Standard

### Unit

- lifecycle transitions
- budget calculation
- budget sufficiency
- KPI progress
- date validation
- authorization rules

### Integration

- project + activity + expense transaction
- school scope isolation
- approval workflow
- ledger invariants
- audit event creation

### E2E/UAT

Canonical happy path:

```text
Login
→ select year/school
→ create project
→ save draft
→ edit
→ submit
→ review/approve
→ create activity
→ record expense
→ attach evidence
→ verify budget
→ complete activity
→ complete project
→ view report/audit
```

### Regression

Any change to Project Management must verify:

- budget pages
- dashboard summaries
- workflow
- reports
- audit
- AI guardrails

---

## 27. Definition of Done

A Project Management feature is Done only when:

- [ ] domain rule documented
- [ ] API contract implemented/verified
- [ ] authorization verified
- [ ] school scope verified
- [ ] ledger behavior verified where financial
- [ ] audit behavior verified
- [ ] UI uses Design System
- [ ] loading/empty/error states exist
- [ ] accessibility reviewed
- [ ] responsive behavior reviewed
- [ ] tests added/updated
- [ ] UAT path updated if necessary
- [ ] README/status accurately reflects implementation

---

## 28. Implementation Phases

### Phase PM-01 — Foundation

- Project list
- Project detail
- Project form
- reusable components
- route/context model

### Phase PM-02 — Execution

- Activity workbench
- Activity form
- Expense workbench
- Expense entry
- evidence

### Phase PM-03 — Governance

- workflow UI
- approval
- audit timeline
- KPI/progress

### Phase PM-04 — Hardening

- API integration
- tests
- accessibility
- performance
- security
- UAT

### Phase PM-05 — Production readiness

- migration
- backup/restore
- deployment
- monitoring
- security review
- formal UAT sign-off

---

## 29. Current Implementation Status

This document defines the target standard. The repository may contain foundations that are not yet fully wired to a live backend or production database.

| Area | Target | Status |
|---|---|---|
| Project domain foundation | Required | Implemented foundation |
| Project list UI | Required | Implementing |
| Project detail UI | Required | Implementing |
| Project edit UI | Required | Implementing |
| Activity workbench | Required | Implementing |
| Expense workbench | Required | Implementing |
| Unified navigation/context | Required | Implementing |
| Workflow UI | Required | Foundation/next phase |
| Audit UI | Required | Foundation/next phase |
| Full API integration | Required | Not claimed complete |
| Automated full build/test | Required | Not claimed complete |
| Production deployment | Required | Not claimed complete |

---

## 30. Governance

Changes to this specification require:

1. version increment when semantics change
2. changelog entry
3. affected UI/API/domain review
4. regression/UAT impact assessment
5. update to Design System if visual behavior changes
6. update to README when implementation status changes

**Versioning:** MAJOR = breaking domain/workflow change; MINOR = additive capability; PATCH = clarification/non-semantic correction.

---

## 31. Acceptance Standard

The Project Management implementation is considered conformant when a user can complete the full journey without leaving the domain context:

```text
Project
  → Activity
  → Expense
  → Evidence
  → Budget recalculation
  → Workflow
  → Audit
```

and every financial/workflow mutation is authorized, traceable, consistent with the ledger, and represented consistently by the shared Design System.
