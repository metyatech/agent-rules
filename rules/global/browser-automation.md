# Browser automation (Codex)

- For web automation, use the `agent-browser` CLI.
- Prefer the ref-based workflow: `agent-browser open <url>` → `agent-browser snapshot -i --json` → interact using `@eN` refs → re-snapshot after changes.
- If browser launch fails due to missing Playwright binaries, run `npx playwright install chromium` and retry.
