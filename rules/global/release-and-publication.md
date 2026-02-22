# Release and publication

- Include LICENSE in published artifacts (copyright holder: metyatech).
- Do not ship build/test artifacts or local configs; ensure a clean environment can use the product via README steps.
- Define a SemVer policy and document what counts as a breaking change.
- Keep package version and Git tag consistent.
- Run dependency security checks before release.
- Verify published packages resolve and run correctly before reporting done.

## Delivery chain gate

Before reporting a code change as complete in a publishable package, verify the full delivery chain. Each step that applies must be done; do not stop mid-chain.

1. Committed
2. Pushed
3. Version bumped (if publishable change)
4. GitHub Release created
5. Package published to registry
6. Global/local install updated and verified

If you discover you stopped mid-chain, resume from where you left off immediately — do not wait for the user to point it out.
