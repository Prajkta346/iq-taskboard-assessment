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


## 2. Viewers (and any role) can edit tasks via PATCH — missing authorization check

- **File:** `src/app/api/tasks/[id]/route.ts`, lines 16–38 (`PATCH`)
- **Category:** Architecture
- **Severity:** Critical
- **Description:** `PATCH /api/tasks/:id` loads the task and updates it immediately after basic auth + schema validation — it never calls `getProjectMembership` or `canEditTasks`, unlike `DELETE` in the *same file* (lines 40–57), which does both correctly. Any authenticated user who can guess or enumerate a task id can edit a task in a project they don't belong to, or a `viewer` can edit tasks in a project they can only read. **This is the same defect `src/tests/part2.test.ts` Test A ("a viewer cannot update a task") is built to catch** — that test currently fails because this code path is missing the check, not because the test is wrong (see TEST_OUTPUT.md).
- **Reproduction (curl):**
  ```bash
  curl -s -X PATCH "localhost:3000/api/tasks/$TASK_ID" \
    -H "Authorization: Bearer $DEV" -H "Content-Type: application/json" \
    -d '{"title":"viewer update attempt"}'
  # Actual: HTTP 200, task updated.  Expected: HTTP 403 (same as DELETE on the same task/user).


## 3. `passwordHash` returned in the project detail API response

- **File:** `src/app/api/projects/[id]/route.ts`, lines 25–40 (`GET`)
- **Category:** Security
- **Severity:** High
- **Description:** The Prisma query uses `owner: true` and `memberships: { include: { user: true } }` with no `select`, so every column on `User` — including the bcrypt `passwordHash` — is serialized into the JSON response. Any authenticated project member, including a `viewer`, can see every other member's (and the owner's) password hash by opening a project or inspecting the network tab. This turns any offline-crackable low-entropy password on the team into full account takeover.
- **Reproduction (curl):**
  ```bash
  curl -s "localhost:3000/api/projects/$PID" -H "Authorization: Bearer $DEV" \
    | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).project.memberships.map(m=>m.user.email+' -> '+m.user.passwordHash).join('\n')"
  # prints "email -> $2a$10$..." for every member, confirmed against prisma/schema.prisma's passwordHash field

