# School Budget System — Design System

**Document ID:** DS-SBS-001  
**Version:** 1.0  
**Status:** Proposed standard for implementation  
**Scope:** Next.js Web Application  
**Related:** `README.md`, `MSS-DMF-BOPP-001`

---

## 1. Purpose

เอกสารนี้เป็นมาตรฐานกลางด้าน UI/UX สำหรับ School Budget System เพื่อให้ทุกหน้าของระบบมีภาษาภาพเดียวกัน ใช้งานง่าย ตรวจสอบได้ และเหมาะกับระบบบริหารงบประมาณโรงเรียนที่มีข้อมูลเชิงราชการ การเงิน Workflow และ Audit จำนวนมาก

Design System นี้ครอบคลุม 4 ชั้น:

```text
FOUNDATION
  ↓
PRIMITIVES
  ↓
PATTERNS
  ↓
DOMAIN COMPONENTS
```

หลักการสำคัญคือ **semantic, accessible, consistent, data-first, responsive และ auditable**

---

## 2. Design Principles

### 2.1 Data first

ข้อมูลโครงการ งบประมาณ กิจกรรม และสถานะ workflow ต้องเด่นกว่า decoration

### 2.2 One action, one meaning

ปุ่มแต่ละประเภทต้องมีความหมายคงที่ทั่วระบบ เช่น primary = ดำเนินการหลัก, danger = การกระทำที่มีความเสี่ยง

### 2.3 Semantic over cosmetic

ใช้ semantic token เช่น `success`, `warning`, `danger` แทนการผูก component เข้ากับสีเฉพาะหน้า

### 2.4 Accessibility by default

สีไม่ใช่ตัวบอกสถานะเพียงอย่างเดียว ต้องมี text/icon/structure และ keyboard focus ที่ชัดเจน

### 2.5 Financial clarity

ตัวเลขงบประมาณต้องอ่านง่าย หน่วยเงินชัดเจน และจัดแนวสม่ำเสมอ

### 2.6 Progressive disclosure

ข้อมูลจำนวนมากต้องแบ่งเป็น section, tab, drawer หรือ detail view แทนการยัดทุกอย่างในหน้าเดียว

### 2.7 Human approval boundary

UI ของ AI ต้องไม่ทำให้ผู้ใช้เข้าใจว่า AI มีอำนาจอนุมัติ ปฏิเสธ โอน หรือจ่ายเงิน

### 2.8 Responsive without destroying information

Desktop/tablet/mobile ต้องรักษาความหมายของข้อมูล โดยเฉพาะตารางการเงิน ไม่บังคับให้ข้อมูลทุก column ย่อจนอ่านไม่ได้

---

## 3. Information Architecture

Application shell มาตรฐาน:

```text
Top Bar
 ├── Brand
 ├── School Context
 ├── Fiscal/Academic Year
 └── User Menu

Sidebar
 ├── Dashboard
 ├── Budget
 ├── Free15
 ├── Projects
 ├── Activities
 ├── Expenses
 ├── Reports
 ├── Workflow / Approval
 ├── Audit
 └── Administration

Main Content
 ├── Breadcrumb
 ├── Page Header
 ├── Page Actions
 └── Content
```

---

## 4. Design Tokens

Tokens เป็น single source of truth ของ visual language และต้องนำไปใช้ผ่าน CSS variables ไม่ควรกำหนดสี/spacing ซ้ำใน component โดยตรง

### 4.1 Color semantics

```css
--color-primary
--color-primary-hover
--color-primary-active
--color-secondary
--color-success
--color-success-subtle
--color-warning
--color-warning-subtle
--color-danger
--color-danger-subtle
--color-info
--color-info-subtle
--color-background
--color-surface
--color-surface-muted
--color-border
--color-border-strong
--color-text
--color-text-muted
--color-text-inverse
```

Semantic rules:

| Semantic | Use |
|---|---|
| Primary | main action / active navigation |
| Success | approved / completed / valid |
| Warning | pending / attention / near limit |
| Danger | rejected / destructive / error |
| Info | contextual information |
| Neutral | normal metadata |

ไม่ควรใช้ success กับปุ่มทั่วไปเพียงเพราะต้องการให้ปุ่มดูเด่น

### 4.2 Typography

```css
--font-family-sans
--font-size-xs
--font-size-sm
--font-size-md
--font-size-lg
--font-size-xl
--font-size-2xl
--font-size-3xl
--font-weight-normal
--font-weight-medium
--font-weight-semibold
--font-weight-bold
--line-height-tight
--line-height-normal
--line-height-relaxed
```

แนะนำ font family ที่รองรับภาษาไทย เช่น Noto Sans Thai, IBM Plex Sans Thai หรือ Sarabun โดยต้องเลือกหนึ่งชุดเป็นมาตรฐานของ production deployment

### 4.3 Spacing

Base spacing scale:

```text
0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
```

### 4.4 Radius

```text
--radius-sm
--radius-md
--radius-lg
--radius-xl
--radius-full
```

ใช้ radius ระดับเล็กถึงกลางเป็นหลักเพื่อรักษาความเป็น enterprise application

### 4.5 Shadow

```text
--shadow-sm
--shadow-md
--shadow-lg
```

Shadow ใช้แยก layer เช่น modal/popover มากกว่าตกแต่ง card ทุกใบ

### 4.6 Breakpoints

```text
sm  640px
md  768px
a lg 1024px
xl  1280px
2xl 1536px
```

ค่าจริงสามารถปรับตาม implementation แต่ต้องใช้ token กลางเท่านั้น

### 4.7 Z-index layers

```text
base       0
sticky    10
dropdown   20
overlay    30
modal      40
toast      50
tooltip    60
```

---

## 5. Foundation Rules

### 5.1 Page width

หน้า dashboard/data-heavy ใช้ max-width ที่เหมาะกับข้อมูลและปล่อยพื้นที่ยืดหยุ่นเมื่อจำเป็น

### 5.2 Grid

ใช้ CSS Grid/Flexbox โดย component ไม่ควรรู้รายละเอียด layout ของ parent เกินจำเป็น

### 5.3 Focus

ทุก interactive element ต้องมี visible keyboard focus

### 5.4 Motion

Animation ต้องสั้นและช่วยบอก state ไม่ใช่สร้างความสวยงามที่รบกวนงาน

ควรเคารพ `prefers-reduced-motion`

---

## 6. Primitive Components

Primitive เป็น component พื้นฐานที่ทุก module ใช้ร่วมกัน

```text
Button
IconButton
Link
Input
Textarea
Select
Checkbox
Radio
Switch
Label
Badge
StatusBadge
Tooltip
Avatar
Divider
Spinner
Skeleton
Alert
Card
Tabs
Accordion
DropdownMenu
Popover
Dialog
Drawer
Pagination
```

ทุก primitive ต้อง:

- มี TypeScript props ที่ชัดเจน
- รองรับ keyboard
- มี disabled/loading state เมื่อเหมาะสม
- ไม่ผูก business logic
- ใช้ design tokens

---

## 7. Button Standard

Variants:

```text
primary
secondary
outline
ghost
danger
```

Sizes:

```text
sm
md
lg
```

ตัวอย่างการใช้:

```tsx
<Button variant="primary">บันทึก</Button>
<Button variant="secondary">ยกเลิก</Button>
<Button variant="danger">ลบ</Button>
```

Rules:

- หนึ่งหน้าไม่ควรมี primary action หลักหลายรายการโดยไม่จำเป็น
- destructive action ใช้ danger
- loading ต้องป้องกันการ submit ซ้ำ
- icon-only button ต้องมี accessible label

---

## 8. Status System

Status ต้องเป็น domain-neutral component ที่รับ semantic state

```tsx
<StatusBadge status="DRAFT" />
<StatusBadge status="PENDING" />
<StatusBadge status="APPROVED" />
<StatusBadge status="REJECTED" />
<StatusBadge status="COMPLETED" />
```

มาตรฐาน:

```text
DRAFT       → neutral
SUBMITTED   → info
PENDING     → warning
APPROVED    → success
REJECTED    → danger
COMPLETED   → success
CANCELLED   → neutral/danger ตามบริบท
```

ต้องแสดงข้อความ ไม่ใช้จุดสีอย่างเดียว

---

## 9. Data Table Standard

DataTable เป็น component หลักของระบบ

Capabilities ที่ควร support:

- sorting
- filtering
- pagination
- search
- column visibility
- row selection
- bulk actions
- empty state
- loading state
- error state
- responsive overflow

Financial columns:

```text
quantity / amount / balance → right aligned
status → semantic badge
text → left aligned
```

จำนวนเงินควรแสดงแบบอ่านง่าย เช่น:

```text
250,000.00 บาท
```

ไม่ใช้ compact notation ในหน้าที่ต้องตรวจสอบตัวเลขจริง เช่น `250K`

---

## 10. Form Standard

Form ต้องแบ่งเป็น semantic sections

```text
Page
 └── Form
      ├── Section: ข้อมูลพื้นฐาน
      ├── Section: งบประมาณ
      ├── Section: กิจกรรม
      └── Section: เอกสารประกอบ
```

ทุก field ควรมี:

- label
- required indicator เมื่อจำเป็น
- helper text เมื่อจำเป็น
- validation message
- accessible association

ห้ามใช้ placeholder แทน label

---

## 11. Card / Summary Standard

Stat cards เหมาะกับ dashboard:

```text
งบประมาณทั้งหมด
1,250,000.00 บาท
```

Card ต้องไม่ใช้ shadow หนักทุกใบ และไม่ควรใส่กราฟเพียงเพื่อ decoration

---

## 12. Budget Components

Domain components สำหรับงบประมาณ:

```text
BudgetSummary
BudgetBalance
BudgetProgress
BudgetLedgerTable
BudgetTransactionForm
BudgetAllocationCard
```

BudgetSummary ควรแสดง:

```text
ได้รับจัดสรร
ผูกพัน
เบิกจ่าย
คงเหลือ
```

และควรอธิบาย calculation context เมื่อผู้ใช้ต้องตรวจสอบยอด

---

## 13. Project Components

```text
ProjectCard
ProjectHeader
ProjectSummary
ProjectBudget
ProjectActivities
ProjectKPI
ProjectMembers
ProjectFiles
ProjectTimeline
```

Project detail ควรใช้ workspace/tab pattern:

```text
Overview | Budget | Activities | KPI | Files | History
```

---

## 14. Activity / Expense Components

```text
ActivityList
ActivityForm
ActivityProgress
ExpenseTable
ExpenseForm
ExpenseSummary
AttachmentList
```

Expense UI ต้องแยก:

```text
planned
committed
spent
remaining
```

เมื่อ domain data รองรับ และต้องไม่สรุปยอดด้วย client-side approximation ที่ขัดกับ backend ledger

---

## 15. Workflow Components

```text
ApprovalStepper
WorkflowStatus
ApprovalActionPanel
ApprovalHistory
ReviewerCard
```

ตัวอย่าง:

```text
✓ จัดทำ
│
✓ ส่งตรวจ
│
● ตรวจสอบ
│
○ รองผู้อำนวยการ
│
○ ผู้อำนวยการ
```

Approval action ต้องแยกจาก AI suggestion อย่างชัดเจน

---

## 16. Audit Components

```text
AuditTimeline
AuditTable
ChangeSummary
ActorBadge
```

Audit entry ควรมีอย่างน้อย:

```text
timestamp
actor
action
resource
summary
```

สำหรับ financial/workflow action ต้องมีข้อมูลเพียงพอสำหรับตรวจสอบย้อนหลังตาม backend policy

---

## 17. Regulation / Evidence Components

```text
RegulationCard
RegulationVersion
EvidenceList
EvidenceLink
RuleExplanation
```

UI ต้องแยกให้เห็นว่า:

```text
Rule
Source
Version
Effective Date
Evidence
```

ห้ามแสดงข้อความ AI explanation ให้ดูเหมือนเป็นตัวบทกฎหมายโดยตรง

---

## 18. AI Components

```text
AIAssistant
AISuggestion
AIExplanation
AIEvidence
AIActionGuard
```

AI UI ต้องใช้ visual distinction จาก financial authorization controls แต่ต้องไม่ใช้สีที่ทำให้เข้าใจว่า AI เป็นผู้อนุมัติ

Mandatory disclaimer เมื่อเกี่ยวข้องกับ financial/workflow decision:

```text
AI เป็นผู้ช่วยวิเคราะห์/ร่าง/อธิบาย/สรุป
การอนุมัติ ปฏิเสธ โอน และจ่ายเงินต้องดำเนินการโดยผู้มีอำนาจ
```

Forbidden action UI ต้องไม่แสดงเป็นปุ่มที่ AI สามารถ execute ได้:

```text
APPROVE
REJECT
TRANSFER
PAY
```

---

## 19. Navigation / Shell

### Top Bar

ต้องแสดง context ที่มีผลต่อข้อมูล เช่น:

```text
School
Fiscal Year
Academic Year
Current User
```

### Sidebar

Menu ต้องจัดตามงาน ไม่ใช่ตาม database tables

```text
ภาพรวม
งบประมาณ
แผนงาน
การเงิน
การติดตาม
ระบบ
```

### Breadcrumb

ใช้เมื่อ hierarchy ลึกกว่า 1–2 ระดับ และต้องสะท้อน context ปัจจุบัน

---

## 20. Empty / Loading / Error States

ทุก data component ต้องออกแบบอย่างน้อย 4 states:

```text
loading
empty
error
success
```

ตัวอย่าง empty:

```text
ยังไม่มีโครงการ
เริ่มต้นด้วยการสร้างโครงการแรก

[สร้างโครงการ]
```

Error ต้องบอกสิ่งที่ผู้ใช้ทำต่อได้ และไม่แสดง stack trace ให้ผู้ใช้ทั่วไป

---

## 21. Dialog / Confirmation

Destructive financial actions ต้องใช้ confirmation dialog เมื่อเหมาะสม

```text
ยืนยันการลบรายการ?

การดำเนินการนี้อาจส่งผลต่อข้อมูลที่เกี่ยวข้อง

[ยกเลิก] [ยืนยันการลบ]
```

Approval/revoke/reject ต้องมีข้อความที่ชัดเจนว่าการกระทำมีผลอย่างไร

---

## 22. Accessibility Standard

ขั้นต่ำ:

- semantic HTML
- keyboard navigation
- visible focus
- labels for controls
- accessible dialog semantics
- sufficient color contrast
- status conveyed by text/icon as well as color
- touch target เหมาะสมสำหรับ mobile
- reduced motion support
- table headers correctly associated
- form validation announced/associated

เป้าหมายควรสอดคล้องกับ WCAG 2.2 AA โดยต้องทำ accessibility audit จริงก่อน production

---

## 23. Responsive Standard

### Desktop

Sidebar เต็ม + multi-column dashboard + full tables

### Tablet

Sidebar collapsed/compact + responsive grid

### Mobile

```text
Top bar
↓
Content
↓
Cards
↓
Forms
↓
Scrollable tables
```

ห้ามทำ financial table ให้บีบจนค่าตัวเลขอ่านไม่ได้ ให้ใช้ horizontal scrolling หรือ mobile-specific detail presentation

---

## 24. Next.js Implementation Contract

Design System ต้องผูกกับ Next.js Web โดยตรงผ่าน shared CSS/tokens/components

โครงสร้างที่แนะนำ:

```text
apps/web/
├── app/
├── components/
│   ├── ui/                  # primitives
│   ├── patterns/            # reusable patterns
│   ├── domain/              # budget/project/workflow/etc.
│   └── layout/              # shell/navigation
├── lib/
├── styles/
│   └── tokens.css           # generated/central tokens
└── next.config.ts
```

หลักการ dependency:

```text
ui → tokens only
patterns → ui
 domain → patterns + ui
pages → domain/patterns/ui
```

Component ระดับล่างห้าม import business service โดยตรง

---

## 25. Naming Convention

React components ใช้ PascalCase:

```text
BudgetSummary.tsx
StatusBadge.tsx
ApprovalStepper.tsx
```

Props ใช้ camelCase:

```tsx
<BudgetSummary
  allocated={1000000}
  spent={350000}
/>
```

CSS custom properties ใช้ kebab-case:

```css
--color-primary
--space-4
--radius-md
```

Domain status ใช้ uppercase enum/string ตาม backend contract:

```text
APPROVED
PENDING
REJECTED
```

---

## 26. Do / Don't

### Do

- ใช้ token กลาง
- ใช้ component กลาง
- ใช้ semantic status
- ใช้ table สำหรับข้อมูลจำนวนมาก
- แสดงหน่วยเงินชัดเจน
- แสดง workflow state
- ทำ mobile overflow อย่างเหมาะสม
- ทำ loading/empty/error state

### Don't

- hard-code สีใน page
- สร้าง button style ใหม่ทุกหน้า
- ใช้สีอย่างเดียวแทนสถานะ
- แสดงเงินแบบ `1.2M` ในหน้าตรวจสอบทางการเงินโดยไม่มี exact value
- ให้ AI ดูเหมือนเป็น approver
- ซ่อน error สำคัญ
- ใช้ placeholder เป็น label
- สร้าง component ที่ผูกกับ database โดยตรงใน primitive layer

---

## 27. Definition of Done สำหรับ UI

UI feature ถือว่าพร้อมเมื่อ:

- [ ] ใช้ design tokens
- [ ] ใช้ reusable component
- [ ] รองรับ loading/empty/error state
- [ ] มี keyboard/focus behavior
- [ ] responsive
- [ ] status มี semantic + text
- [ ] financial values format ถูกต้อง
- [ ] authorization action แยกจาก AI suggestion
- [ ] ไม่มี hard-coded production secret/config
- [ ] ผ่าน lint/type/test ที่เกี่ยวข้อง
- [ ] ผ่าน manual UAT ของหน้าจอนั้น

---

## 28. Governance

การเปลี่ยน Design System ต้อง:

1. เพิ่ม/แก้ token อย่างมีเหตุผล
2. ประเมินผลกระทบ component ที่ใช้ token
3. หลีกเลี่ยง breaking change โดยไม่มี migration note
4. อัปเดตเอกสารนี้เมื่อมีมาตรฐานใหม่
5. ทดสอบ responsive/accessibility ใน component ที่เปลี่ยน

Versioning:

```text
MAJOR = breaking visual/API component change
MINOR = additive token/component/variant
PATCH = bug fix / documentation / non-breaking adjustment
```

---

## 29. Current Implementation Status

เอกสารนี้กำหนด **target standard** สำหรับ Web UI ของโครงการ ไม่ได้หมายความว่า component ทุกตัวถูก implement ครบแล้ว

สถานะที่ต้องตรวจจาก source/CI จริง:

| Layer | Target | Current interpretation |
|---|---|---|
| Tokens | Central CSS variables | ต้องผูกเข้ากับ Web source |
| Primitives | Reusable UI | ต้องตรวจ coverage |
| Patterns | Reusable patterns | ต้องทยอย implement |
| Domain components | Budget/Project/Workflow/AI | อยู่ตาม phase |
| Accessibility | WCAG 2.2 AA target | ต้อง audit จริง |
| Visual regression | Recommended | ยังต้องเพิ่มถ้าต้องการ production gate |
| Storybook/catalog | Recommended | ยังไม่ถือว่ามีจนกว่าจะเพิ่มใน source |

---

## 30. Acceptance Standard

Design System จะถือว่า integrated เมื่อ:

```text
README.md
   ↓
DESIGN_SYSTEM.md
   ↓
Design Tokens
   ↓
Reusable Components
   ↓
Next.js Pages
   ↓
Automated checks
   ↓
UAT / Accessibility / Responsive review
```

ทุก UI ใหม่ควรเพิ่มจาก component/pattern ที่มีอยู่ก่อนสร้าง one-off implementation

---

**End of Design System Standard v1.0**
