# Exam Markdown

## Common question format

- When creating or editing Markdown questions, quizzes, exams, or preparation
  question sets, use the common Markdown question format below. Small quizzes,
  exams, and preparation question collections share this format.
- markdown-to-qti is the only supported Markdown parser/compiler for question
  Markdown.
- The authoritative human/AI-edited sources are Markdown question files plus a
  manifest. The shared intermediate representation is the generated QTI package.
- Track publish workflows should treat the QTI package as the source artifact
  when publishing support is available.

```md
---
question_type: choice
time_budget_seconds: 90
---

# Problem title

## Prompt

...

## Options

- [x] Correct answer
- [ ] Distractor

## Scoring

- 2: ...

## Explanation

...
```

## Question frontmatter and sections

- `question_type` MUST be one of `descriptive`, `choice`, or `cloze`.
- `time_budget_seconds` MUST be present and MUST be a positive integer.
- `time_estimate_seconds` MUST NOT be used.
- `## Type` MUST NOT be used. Put the type in `question_type` frontmatter
  instead.
- Cloze answers MUST use `{{answer}}` for exact answers or `{{/regex/}}` for
  regular-expression answers.
- `${...}` MUST NOT be used for cloze answers or any other answer placeholder.
- Keep educational quality rules in the education domain separate from this
  operational Markdown/QTI format rule.

## Manifest format

- Manifests MUST contain `title` and `items`.
- Manifests MAY contain `time_limit_seconds`.
- Manifest `type: quiz` and `type: exam` MUST NOT be used. Distinguish quiz,
  exam, and preparation-set behavior outside the common manifest schema.
- When `time_limit_seconds` is present, it is the time limit for the entire
  question set.
- When `time_limit_seconds` is absent, the set time budget is the sum of each
  item's `time_budget_seconds`.
- Do not apply weekly quiz-specific fixed-window rules such as
  `DEFAULT_WINDOW_SECONDS` checks to the common format. Keep weekly quiz
  scheduling/publication policy in weekly quiz-specific rules only.

## Legacy tooling

- `convert-exam-md-to-html` is legacy/deprecated. Do not use it for new
  Markdown question compilation, validation, preview, or publication flows.
- Migrate existing workflows toward `markdown-to-qti` output and QTI packages
  instead of HTML generated from exam Markdown.
