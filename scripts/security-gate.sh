#!/usr/bin/env bash
set -euo pipefail
fail=0
check(){ local label="$1"; shift; if "$@"; then echo "PASS  $label"; else echo "FAIL  $label"; fail=1; fi; }
check 'no committed env files' bash -c '! git ls-files | grep -E "(^|/)(\.env|\.env\.production)$"'
check 'no obvious hard-coded JWT production secret' bash -c '! git grep -nE "JWT_SECRET=(admin|password|secret|ChangeMe123)" -- . ":!docs/"'
check 'production secret length guard exists' grep -q 'JWT_SECRET.*32' scripts/verify-production.sh
check 'AI forbidden actions documented in source' grep -q "APPROVE.*REJECT.*TRANSFER.*PAY" apps/api/src/common/domain/ai-guardrails.ts
check 'school scope guard exists' grep -R -q 'Outside school scope' apps/api/src
check 'CI workflow exists' test -f .github/workflows/ci.yml
if command -v npm >/dev/null 2>&1 && [ -f package-lock.json ]; then npm audit --audit-level=high || fail=1; else echo 'SKIP  npm audit (no package-lock)'; fi
exit "$fail"
