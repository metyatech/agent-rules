# Release and publication

This module governs how the agent prepares, releases, and publishes
software artifacts. Detailed release procedures, GitHub metadata
standards, and per-ecosystem publish steps are defined in the
`release-publish` skill. Approval rules for release and publish
operations are defined in `approval-gates`.

## Definitions

- **Publishable package** — any artifact distributed via npm,
  PyPI, GitHub Releases, or any other public package registry that
  the user authoritatively controls.
- **Delivery chain** — defined in `delivery-chain`. Includes
  commit, push, version bump, release, publish, and install
  verification.

## Packaging hygiene

- Every published artifact MUST include a LICENSE file. The
  copyright holder MUST be `metyatech`.
- The agent MUST NOT ship build artifacts, test artifacts, or
  local configuration files. The agent MUST verify that a clean
  environment can install and use the product via the README's
  documented steps.
- The agent MUST define a SemVer policy for the package and MUST
  document what counts as a breaking change.
- The package version and the Git tag MUST be kept consistent.
- The agent MUST run dependency security checks before every
  release.

## Trusted publishing

- For public npm packages published from GitHub Actions, the agent
  MUST use npm trusted publishing (OIDC) instead of long-lived npm
  tokens whenever the package's npm registry supports it.
- The publish workflow MUST run on a Node and npm runtime version
  that satisfies trusted-publishing requirements.

## GitHub repository metadata

- For every public repository, the agent MUST set the GitHub
  Description, Topics, and Homepage fields.
- Topics MUST be assigned from the standard set defined in the
  `release-publish` skill.

## Verification of published artifacts

- Before reporting a publishable-package change as complete, the
  agent MUST verify the full delivery chain end-to-end:
  commit → push → version bump → release → publish → install
  verify.
- The agent MUST verify that the published package resolves and
  runs correctly from a clean install before reporting completion.

## New repository bootstrap

- When work is intentionally isolated into a new user-owned
  repository because that repository is the canonical home for the
  work, the agent MUST bootstrap it as a real Git repository,
  MUST create the GitHub remote, and MUST push the initial history
  before reporting completion. The agent MAY skip this only when
  the user explicitly opts out.
