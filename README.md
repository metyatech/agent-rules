# Agent Rules

This repository stores public rule modules consumed by `compose-agentsmd`.

## Structure

- `agent-profiles.json`: maps profile names to domain lists.
- `rules/global/`: user-global rules shared across agent environments.
- `rules/domains/`: profile-selected repository-facing rules.
- `tests/`: repository checks for rule content invariants.

## Consuming repository ruleset

Consuming repositories use `sources` and `profile`.

```json
{
  "sources": ["github:metyatech/agent-rules"],
  "profile": "course-docs",
  "output": "AGENTS.md"
}
```

Consuming repositories MUST NOT list domains directly and MUST NOT use `extra`
or `agent-rules-local`.

## Profiles

Profiles are defined in `agent-profiles.json`.

Domains are internal groupings under `rules/domains/<domain>/`.

## Updating rules

Edit `agent-profiles.json`, `rules/global/`, or `rules/domains/`.

Do not edit generated `AGENTS.md` or `CLAUDE.md` directly.

Before editing a consumer's shared rules, run
`compose-agentsmd edit-rules --root <consumer repo>` to discover source
workspaces and review the initial effective total, 8000-token hard limit,
7000-token advisory target, and remaining margin. During repeated edits, use
the read-only `compose-agentsmd check-budget --root <agent-rules repo> --json`
for exact measurements; it works with rulesets using `global: false` and still
measures their editable global-rule source. It does not clone, fetch, push, or
write. Keep headroom instead of publishing at
the hard limit; aim near 7000 without treating it as another hard gate.

When the effective global count is above the 7000-token advisory target, new
always-on obligations should normally be paired in the same patch with lossless
deduplication of at least equal token size (net global growth <= 0). Otherwise,
record an explicit exception rationale and sustainable placement/mechanisation.
Use a profile-selected domain only for genuinely conditional obligations and a
skill only for procedures whose invocation is guaranteed. Never silently move
mandatory always-on rules out of scope or remove requirements to save tokens.
This is an authoring review practice, not a hard CI/test gate or a 7000-token
rejection threshold.

Place always-on invariants in `rules/global/`, profile-selected obligations
in `rules/domains/`, and procedures in task skills only when their invocation
is guaranteed. Never move a mandatory global rule into a conditional domain or
skill without proving it remains in force wherever required. After edits, run
the canonical full verifier below; `apply-rules` independently enforces the
8000-token hard gate before pushing or regenerating outputs.

## Verification

Run the canonical verification command with
`pwsh -NoProfile -File tools/verify.ps1`.
It runs the machine-contract tests for profile data, token budgets, verifier
configuration and CI jobs, `markdownlint-cli@0.49.1`, and the non-mutating
compose-agentsmd freshness check.
The command in [.mwt/config.toml](.mwt/config.toml) and CI both use the same
canonical verifier.
Use `compose-agentsmd check` to verify generated instruction synchronization.

## Skills

This repository does not install, resolve, or trigger skills.

Skill behavior belongs in each `skill-*` repository's `SKILL.md`.

The `skill` domain only contains repository rules for skill repositories.

## Private rules

General reusable rules belong in this public repository.

`agent-rules-private` is reserved only for future rules that contain genuinely
private, user-specific, or organization-private information.

## Question and exam Markdown

Question, quiz, exam, and preparation-set authoring rules live in `rules/domains/course-exams/markdown-qti-format.md`.

The current common format uses Markdown question files plus a manifest as
editable sources, `markdown-to-qti` as the only supported Markdown
parser/compiler, and QTI packages as the shared output artifact.

Legacy `convert-exam-md-to-html` workflows are deprecated for new question authoring.
