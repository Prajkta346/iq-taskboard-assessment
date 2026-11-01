## Before fixes

[33mThe CJS build of Vite's Node API is deprecated. See https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.[39m

 RUN  v2.1.8 /app

 × src/tests/part2.test.ts > task access control > a viewer cannot update a task 2397ms
   → expected 200 to be 403 // Object.is equality
 × src/tests/part2.test.ts > task access control > a viewer cannot create a task 5005ms
   → Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ✓ src/tests/part2.test.ts > task access control > a member can create a task 3146ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/tests/part2.test.ts > task access control > a viewer cannot update a task
AssertionError: expected 200 to be 403 // Object.is equality

- Expected
+ Received

- 403
+ 200

 ❯ src/tests/part2.test.ts:57:24
     55|       body: JSON.stringify({ title: "viewer update attempt" }),
     56|     });
     57|     expect(res.status).toBe(403);
       |                        ^
     58|   });
     59| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/tests/part2.test.ts > task access control > a viewer cannot create a task
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯

 Test Files  1 failed (1)
      Tests  2 failed | 1 passed (3)
   Start at  16:28:38
   Duration  22.42s (transform 246ms, setup 1.05s, collect 107ms, tests 17.72s, environment 0ms, prepare 343ms)

## after fixes

[33mThe CJS build of Vite's Node API is deprecated. See https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.[39m

 RUN  v2.1.8 /app

 ✓ src/tests/part2.test.ts > task access control > a viewer cannot update a task 2277ms
 ✓ src/tests/part2.test.ts > task access control > a viewer cannot create a task 2237ms
 ✓ src/tests/part2.test.ts > task access control > a member can create a task 2553ms

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/tests/part2-extra.test.ts [ src/tests/part2-extra.test.ts ]
Error: Transform failed with 1 error:
/app/src/tests/part2-extra.test.ts:1:73: ERROR: Unterminated regular expression
  Plugin: vite:esbuild
  File: /app/src/tests/part2-extra.test.ts:1:73
  
  Unterminated regular expression
  1  |  / Part 2 — additional coverage: a non-member (no membership row at all,
  2  |  // not just a lower-privileged member) attempting to update a task.
     |   ^
  3  |  // Requires the dev server running on http://localhost:3000
  4  |  
  
 ❯ failureErrorWithLog node_modules/vite/node_modules/esbuild/lib/main.js:1472:15
 ❯ node_modules/vite/node_modules/esbuild/lib/main.js:755:50
 ❯ responseCallbacks.<computed> node_modules/vite/node_modules/esbuild/lib/main.js:622:9
 ❯ handleIncomingPacket node_modules/vite/node_modules/esbuild/lib/main.js:677:12
 ❯ Socket.readFromStdout node_modules/vite/node_modules/esbuild/lib/main.js:600:7

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { __vitest_rollup_error__: { plugin: 'vite:esbuild', id: '/app/src/tests/part2-extra.test.ts', loc: { column: 73, file: '/app/src/tests/part2-extra.test.ts', length: +0, line: 1, lineText: '/ Part 2 — additional coverage: a non-member (no membership row at all,', namespace: '', suggestion: '' }, frame: '\nUnterminated regular expression\n1  |  / Part 2 — additional coverage: a non-member (no membership row at all,\n2  |  // not just a lower-privileged member) attempting to update a task.\n   |   ^\n3  |  // Requires the dev server running on http://localhost:3000\n4  |  \n' } }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed | 1 passed (2)
      Tests  3 passed (3)
   Start at  17:44:42
   Duration  21.58s (transform 767ms, setup 2.19s, collect 209ms, tests 18.05s, environment 3.39s, prepare 720ms)

