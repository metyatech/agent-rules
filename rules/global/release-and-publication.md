# Release and publication

## Packaging and distribution

- Include LICENSE in published artifacts (copyright holder: metyatech).
- Do not ship build/test artifacts or local configs; ensure a clean environment can use the product via README steps.
- Define a SemVer policy and document what counts as a breaking change.

## Public repository metadata

- For public repos, set GitHub Description, Topics, and Homepage.
- Ensure required repo files exist: .github/workflows/ci.yml, issue templates, PR template, SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, CHANGELOG.md.
- Configure CI to run the repo's standard lint/test/build commands.

## Versioning and release flow

- Update version metadata when release content changes; keep package version and Git tag consistent.
- Create and push a release tag; create a GitHub Release based on CHANGELOG.
- If asked to choose a version, decide it yourself.
- When bumping a version, create the GitHub Release and publish the package in the same update.
- For npm publishing, ask the user to run npm publish (do not execute it directly).
- Before publishing, run required prep commands (e.g., npm install, npm test, npm pack --dry-run) and only proceed when ready.
- If authentication fails during publish, ask the user to complete the publish step.
- Run dependency security checks before release, address critical issues, and report results.
- After publishing, update any locally installed copy to the newly published release and verify the resolved version.
  - Completion gate: do not report “done” until this verification is completed (or the user explicitly declines).
  - Include evidence (exact commands + observed version) in the final report.
  - For npm CLIs:
    - If installed globally: check `npm ls -g <pkg> --depth=0`, update via `npm i -g <pkg>@latest` (or the published dist-tag), then verify with `<pkg> --version`.
    - If not installed globally: skip the global update, and verify availability via `npx <pkg>@latest --version` (or the ecosystem-equivalent).

## Published artifact requirements

- Populate package metadata (name, description, repository, issues, homepage, engines).
- Validate executable entrypoints and required shebangs so installed commands work.
- If a repo represents a single tool/product, publish a single package (bundle related scripts).
