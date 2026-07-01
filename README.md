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

Consuming repositories MUST NOT list domains directly and MUST NOT use `extra` or `agent-rules-local`.

## Profiles

Profiles are defined in `agent-profiles.json`.

Domains are internal groupings under `rules/domains/<domain>/`.

## Updating rules

Edit `agent-profiles.json`, `rules/global/`, or `rules/domains/`.

Do not edit generated `AGENTS.md` or `CLAUDE.md` directly.

## Skills

This repository does not install, resolve, or trigger skills.

Skill behavior belongs in each `skill-*` repository's `SKILL.md`.

The `skill` domain only contains repository rules for skill repositories.

## Private rules

General reusable rules belong in this public repository.

`agent-rules-private` is reserved only for future rules that contain genuinely private, user-specific, or organization-private information.

## Question and exam Markdown

Question, quiz, exam, and preparation-set authoring rules live in `rules/domains/course-exams/markdown-qti-format.md`.

The current common format uses Markdown question files plus a manifest as editable sources, `markdown-to-qti` as the only supported Markdown parser/compiler, and QTI packages as the shared output artifact.

Legacy `convert-exam-md-to-html` workflows are deprecated for new question authoring.