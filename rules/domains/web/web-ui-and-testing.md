# Web UI and automation

## Browser automation

- For web automation or UI verification, use the browser automation tooling
  available in the current agent environment.
- If browser launch fails due to missing Playwright binaries, run
  `npx playwright install chromium` and retry.

## UI verification and E2E

- For user-visible UI changes, verify in a real browser; if not possible,
  explain and provide manual steps.
- Select existing tests or browser checks by the changed behavior, risk, and
  uncovered contract; do not add an E2E harness or require E2E/PR CI for every
  user-visible change. Preserve existing required gates and add automation only
  when it provides distinct value over the current verification.
- For React UI changes, add tests that cover initial mount and at least one
  update (re-render) path; include unmount/cleanup when relevant.
- If behavior differs between first render and later renders (effects, caching,
  hydration), cover both paths explicitly.
- Configure E2E to fail fast and avoid auto-opening browsers (headless/no-open).
- For Next.js E2E, prefer next build + next start.
- If Playwright tests fail to launch, clear playwright/.cache and retry.
- When adding/changing links, add tests that verify the target resolves; if not
  feasible, document manual verification.
- For cross-system integration flows, add an end-to-end test (or a contract test
  at the boundary). If impractical, document the limitation and get explicit
  user approval before skipping.
- Use established icon libraries; do not handcraft custom icons or inline SVGs.
