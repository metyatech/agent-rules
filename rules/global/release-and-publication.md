# Release and publication

- Include LICENSE in published artifacts (copyright holder: metyatech).
- Do not ship build/test artifacts or local configs; ensure a clean environment can use the product via README steps.
- Define a SemVer policy and document what counts as a breaking change.
- Keep package version and Git tag consistent.
- Run dependency security checks before release.
- Verify published packages resolve and run correctly before reporting done.
- For new user-owned repositories created during a task, create the GitHub remote and push the initial history before reporting complete unless the user explicitly opts out.
- For public repos, set GitHub Description, Topics, and Homepage. Assign topics from the standard set defined in the `release-publish` skill.
- For public npm packages published from GitHub Actions, use npm trusted publishing (OIDC) instead of long-lived npm tokens whenever supported, and keep the publish workflow on a Node/npm runtime that satisfies trusted-publishing requirements.
- Before reporting a publishable-package change as complete, verify the full delivery chain (commit → push → version bump → release → publish → install verify). Procedures in the `release-publish` skill.
- For user-owned publishable packages, when the user asks to commit/push or finalize a fix, treat release/publish as in-scope follow-up by default and execute the full delivery chain unless the user explicitly opts out.
