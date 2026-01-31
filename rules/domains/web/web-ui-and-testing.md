# Web UI and automation

## Browser automation

- For web automation, use the agent-browser CLI.
- Prefer the ref-based workflow: agent-browser open <url> -> agent-browser snapshot -i --json -> interact using @eN refs -> re-snapshot after changes.
- If browser launch fails due to missing Playwright binaries, run npx playwright install chromium and retry.

## UI verification and E2E

- For user-visible UI changes, verify in a real browser using agent-browser; if not possible, explain and provide manual steps.
- Always add E2E tests for user-visible changes; if no harness exists, add one.
- Configure E2E to fail fast and avoid auto-opening browsers (headless/no-open).
- For Next.js E2E, prefer next build + next start.
- If Playwright tests fail to launch, clear playwright/.cache and retry.
- When adding/changing links, add tests that verify the target resolves; if not feasible, document manual verification.
- Use established icon libraries; do not handcraft custom icons or inline SVGs.
