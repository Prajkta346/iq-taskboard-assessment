/ Part 2 — additional coverage: a non-member (no membership row at all,
// not just a lower-privileged member) attempting to update a task.
// Requires the dev server running on http://localhost:3000

import { describe, it, expect, beforeAll } from "vitest";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

async function login(email: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "password123" }),
  });
  const data = (await res.json()) as { token: string };
  return data.token;
}

let taskId: string;
let outsiderToken: string;

beforeAll(async () => {
  const meera = await login("meera@taskboard.dev");

  const projectsRes = await fetch(`${BASE_URL}/api/projects`, {
    headers: { Authorization: `Bearer ${meera}` },
  });
  const { projects } = (await projectsRes.json()) as {
    projects: { id: string; name: string }[];
  };
  const projectId = projects.find((p) => p.name === "Q3 Launch")!.id;

  const tasksRes = await fetch(`${BASE_URL}/api/projects/${projectId}/tasks`, {
    headers: { Authorization: `Bearer ${meera}` },
  });
  const { tasks } = (await tasksRes.json()) as { tasks: { id: string }[] };
  taskId = tasks[0].id;

  // lina@example.com is seeded as a member of "Customer Onboarding Revamp"
  // only — she has no membership row on "Q3 Launch" at all.
  outsiderToken = await login("lina@example.com");
});

describe("task access control — non-member", () => {
  it("a user with no membership on the project cannot update a task in it", async () => {
    const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${outsiderToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: "outsider update attempt" }),
    });
    expect(res.status).toBe(403);
  });
});
