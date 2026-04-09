# Release and publication

Detailed release procedures, GitHub metadata standards, and
per-ecosystem publish steps live in the `release-publish` skill.
Approval rules for release and publish operations live in
`approval-gates`.

## Definitions

- **Publishable package** — any artifact distributed via npm,
  PyPI, GitHub Releases, or any other public package registry the
  user authoritatively controls.
- **Delivery chain** — defined in `delivery-chain`. Includes
  commit, push, version bump, release, publish, and install
  verification.

## Packaging hygiene

- Every published artifact MUST include a LICENSE file with
  `metyatech` as the copyright holder.
- The agent MUST NOT ship build artifacts, test artifacts, or
  local configuration files. Verify that a clean environment can
  install and use the product via the README's documented steps.
- Define a SemVer policy for the package and document what counts
  as a breaking change.
- Keep the package version and the Git tag consistent.
- Run dependency security checks before every release.

## Trusted publishing

- For public npm packages published from GitHub Actions, use npm
  trusted publishing (OIDC) instead of long-lived npm tokens
  whenever the package's npm registry supports it.
- The publish workflow MUST run on a Node and npm runtime version
  that satisfies trusted-publishing requirements.

## GitHub repository metadata

- For every public repository, set the GitHub Description, Topics,
  and Homepage fields. Topics MUST be assigned from the standard
  set defined in the `release-publish` skill.

## Verification of published artifacts

- Before reporting a publishable-package change as complete,
  verify the full delivery chain end-to-end:
  commit → push → version bump → release → publish → install
  verify.
- Verify that the published package resolves and runs correctly
  from a clean install before reporting completion.

## New repository bootstrap

- When work is intentionally isolated into a new user-owned
  repository because that repository is the canonical home for
  the work, bootstrap it as a real Git repository, create the
  GitHub remote, and push the initial history before reporting
  completion. Skip this only when the user explicitly opts out.
