# Release and publication

- Include LICENSE in published artifacts (copyright holder: metyatech).
- Do not ship build/test artifacts or local configs; ensure a clean environment can use the product via README steps.
- Define a SemVer policy and document what counts as a breaking change.
- Keep package version and Git tag consistent.
- Run dependency security checks before release.
- Verify published packages resolve and run correctly before reporting done.
- For npm publishing in metyatech-owned packages, execute `npm publish` directly (an automation token is configured); do not ask the user to run it manually.
