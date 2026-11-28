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
- Test React initial/update paths and relevant cleanup when changed behavior
  depends on state, effects, async data, hydration, caching, or other
  transition-dependent behavior; static or presentational edits need no such tests.
- Configure E2E to fail fast and avoid auto-opening browsers (headless/no-open).
- For Next.js E2E, prefer next build + next start.
- If Playwright tests fail to launch, clear playwright/.cache and retry.
- Verify changed links by browser/manual/direct check; automate critical or
  generated destinations and recurring failures.
- For cross-system flows, use proportionate boundary checks; manual checks suit
  low-risk personal paths. Use integration/E2E for material boundary risk and
  report unverified high-risk gaps.
- Use established icon libraries; do not handcraft custom icons or inline SVGs.
