# Phase 2 — Master Data + Budget Foundation

## Implemented
- BudgetSource master data
- BudgetPool by School + FiscalYear + BudgetSource
- BudgetPocket for sub-allocation categories
- Ledger-based BudgetTransaction
- Balance calculation from POSTED transactions
- Overspend guard for TRANSFER_OUT / COMMITMENT / EXPENSE
- Audit log on posted budget transactions
- School-scope checks
- Starter Budget UI page

## Domain decision
Free15/Student-count calculation is a source/allocation engine, not the parent of Project. Projects consume budget through budget sources/pockets. This matches the observed DMF flow where projects can use multiple funding sources.

## Formula
Available = additions - deductions

Additions: OPENING + ALLOCATION + TRANSFER_IN + ADJUSTMENT + REVERSAL
Deductions: TRANSFER_OUT + COMMITMENT + EXPENSE
