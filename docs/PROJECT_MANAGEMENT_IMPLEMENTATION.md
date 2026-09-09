# Project Management Implementation

**Status:** backend-authoritative implementation for `/projects → /activities → /expenses`.

## Runtime contract
- `GET /api/projects` — current-school project list.
- `POST /api/projects` — create a draft project.
- `GET/PATCH /api/projects/:id` — scoped detail/edit while editable.
- `POST /api/projects/:id/submit` — submit project workflow.
- `POST /api/projects/:id/approve|return|reject` — controlled workflow actions.
- `GET/POST/PATCH /api/activities` — scoped activity management.
- `POST /api/activities/:id/budgets` — map activity to a school budget pocket.
- `GET/POST /api/expenses` — list/post expenses.
- `GET /api/budgets/pockets/:id/balance` — authoritative ledger balance.

## Security and accounting invariants
1. Non-`SUPER_ADMIN` actors cannot cross their authenticated school boundary.
2. `schoolId` supplied by the browser is never trusted; the server validates it against the authenticated organization and role.
3. RBAC is enforced at controller level with `RolesGuard` and again in service-level business rules.
4. Project editing is limited to `DRAFT`, `RETURNED`, or `REJECTED`.
5. Expenses require an `APPROVED` project and an `ActivityBudget` mapping to the selected budget pocket.
6. Expense posting creates `Expense`, `BudgetTransaction(EXPENSE)`, and `AuditLog` in one database transaction.
7. Ledger sufficiency is checked inside a serializable transaction for budget transaction posting.
8. Posted expenses are immutable; corrections must be represented by a controlled reversal/correction workflow.
9. Workflow transitions update `WorkflowInstance`, `Project.status`, and `AuditLog` atomically.
10. The UI consumes API state and cannot authorize approvals or calculate authoritative balances.

## Default approval mapping
1. Planning review — `PLANNING_OFFICER` / `SCHOOL_ADMIN`
2. Budget administration — `SCHOOL_ADMIN` / `ORG_ADMIN`
3. Organization review — `ORG_ADMIN`
4. Final approval — `DIRECTOR`

`SUPER_ADMIN` is retained for controlled administration.

## Deployment boundary
The web application is a static Next.js export and therefore calls the NestJS API from the browser. Configure `NEXT_PUBLIC_API_URL` to the public API base ending in `/api`. Production verification still requires dependency installation, Prisma generation/migration, database deployment, automated tests, web build, UAT, and backup/restore checks in CI/deployment infrastructure.
