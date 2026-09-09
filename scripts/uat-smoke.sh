#!/usr/bin/env bash
set -euo pipefail
: "${BASE_URL:=http://localhost:4000/api}"
: "${UAT_EMAIL:=admin@school.local}"
: "${UAT_PASSWORD:=ChangeMe123!}"
command -v curl >/dev/null || { echo 'curl is required'; exit 2; }
health=$(curl -fsS "$BASE_URL/health"); echo "$health" | grep -q 'ok' || { echo 'FAIL health'; exit 1; }
token=$(curl -fsS -X POST "$BASE_URL/auth/login" -H 'content-type: application/json' --data "{\"email\":\"$UAT_EMAIL\",\"password\":\"$UAT_PASSWORD\"}" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
test -n "$token" || { echo 'FAIL login'; exit 1; }
for path in auth/me master/schools master/fiscal-years master/academic-years budgets/sources projects reports/dashboard regulations ai/guardrails; do code=$(curl -sS -o /tmp/uat.out -w '%{http_code}' "$BASE_URL/$path" -H "Authorization: Bearer $token"); [ "$code" = 200 ] || { echo "FAIL $path HTTP $code"; cat /tmp/uat.out; exit 1; }; echo "PASS $path"; done
echo 'UAT smoke PASS'
