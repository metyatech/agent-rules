# Course Exam Markdown and QTI Format

## Common question format

- When creating or editing Markdown questions, quizzes, exams, or preparation
  question sets, use the common Markdown question format below. Small quizzes,
  exams, and preparation question collections share this format.
- Markdown question files live under `courses/<slug>/question-bank/`.

  Reusable weekly quiz questions live under
  `courses/<slug>/question-bank/quiz-bank/**/*.q.md`.

  Migrated historical questions live under
  `courses/<slug>/question-bank/imported/...`.

- markdown-to-qti is the only supported Markdown parser/compiler for question
  Markdown.
- The authoritative human/AI-edited sources are the question-bank Markdown
  question files plus the assessment manifest. The shared intermediate
  representation is the generated QTI package.
- Track publish workflows should treat the QTI package as the source artifact
  when publishing support is available.

```md
---
question_type: descriptive
time_budget_seconds: 180
---

# Title

## Prompt

...

## Explanation

...

## Scoring

- ブラケット記法 `user["name"]` を使えることを説明している
- ドット記法とブラケット記法が同じプロパティにアクセスできることを説明している
- ブラケット内ではキー名を文字列として指定することを説明している
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
- Cloze answer markers are active only in `question_type: cloze`.
- In descriptive and choice questions, `{{...}}` is ordinary text and MAY appear in language examples or code snippets.
- Use `question_type: cloze` when `{{...}}` is intended as a fill-in answer marker.
- `## Scoring`, when present, MUST be a flat bullet list. Each bullet is one
  scoring criterion described in prose.
- `## Scoring` bullets MUST NOT carry inline points. An inline-point prefix
  form (a hyphen, a number, then a colon before the criterion text) is
  FORBIDDEN.
- `## Scoring` MUST NOT use nested list items. A nested list under `## Scoring`
  is an error.
- An empty `## Scoring` section is an error.
- Points are not stored in the question Markdown. Points live in the assessment
  manifest item `points` array.
- The manifest item `points` array is REQUIRED if and only if the referenced
  question has a `## Scoring` section, and its length MUST equal the `## Scoring`
  bullet count.
- Keep educational quality rules in the education domain separate from this
  operational Markdown/QTI format rule.

## Manifest format

- The manifest is `assessment.yaml`.
- Manifests MUST contain `title` and `items`.
- Manifests MAY contain `time_limit_seconds`.
- The manifest root MUST contain only `title`, optional `time_limit_seconds`,
  and `items`.
- A root `type` field is FORBIDDEN. Manifest `type: quiz` and `type: exam` MUST NOT be used. Distinguish quiz,
  exam, and preparation-set behavior outside the common manifest schema.
- `items` MUST be an array of objects. A string item is FORBIDDEN.
- Each item MUST contain `id` and `ref`, and MAY contain `points`.
- `id` MUST match `/^[A-Za-z0-9][A-Za-z0-9_.:-]*$/` and MUST be unique within
  the manifest.
- `ref` MUST be a relative path from the manifest file's directory.
- `ref` MUST point within the same course's `question-bank/` subtree.
- `ref` absolute paths are FORBIDDEN and URLs are FORBIDDEN.
- `ref` MUST resolve to an existing file.
- `points`, when present, MUST be an array of positive integers.
- `points` decimal values are FORBIDDEN.
- `points` length MUST equal the `## Scoring` bullet count in the referenced
  question.
- `points` is REQUIRED when the referenced question has a `## Scoring` section.
- `points` is FORBIDDEN when the referenced question does NOT have a `## Scoring`
  section.
- Scoring criterion IDs are FORBIDDEN. Scoring criterion text is NOT a key.
  Correspondence between a `## Scoring` bullet and its `points` entry is by array
  index only.
- The manifest `id` of an item is the QTI item XML filename and the QTI item
  identifier.
- Item order in the manifest is the assessment-test order.
- When `time_limit_seconds` is present, it is the time limit for the entire
  question set.
- When `time_limit_seconds` is absent, the set time budget is the sum of each
  referenced question's `time_budget_seconds`.
- Do not apply weekly quiz-specific fixed-window rules such as
  `DEFAULT_WINDOW_SECONDS` checks to the common format. Keep weekly quiz
  scheduling/publication policy in weekly quiz-specific rules only.

Example manifest:

```yaml
title: 2026 JavaScript 中間試験
time_limit_seconds: 1200
items:
  - id: q1
    ref: ../../../../question-bank/imported/2026/1semester/exams/1midterm-exam/2regular/q1.q.md
    points: [2, 2, 1]
  - id: q2
    ref: ../../../../question-bank/imported/2026/1semester/exams/1midterm-exam/2regular/q2.q.md
    points: [3, 2, 2]
  - id: q3
    ref: ../../../../question-bank/imported/2026/1semester/exams/1midterm-exam/2regular/q3.q.md
```

## Question-bank layout

- `courses/<slug>/question-bank/` is the course question bank.
- Reusable weekly quiz questions live under
  `courses/<slug>/question-bank/quiz-bank/**/*.q.md`.
- Migrated historical questions live under
  `courses/<slug>/question-bank/imported/<year>/<semester>/<kind>/<assessment-relative-path>/<qN>.q.md`.
- Assessment directories MUST NOT keep question Markdown locally. They hold
  `assessment.yaml`, `assessment-run.json`, and `result/` only.
- The `ref`-referenced question-bank Markdown is the only source of truth for
  question content.

## Preparation and regular exam pairing

- Pair preparation and regular exam questions by manifest item order.
  - Example: the first item in `1preparation/assessment.yaml` corresponds to the first item in `2regular/assessment.yaml`.
  - Example: the second item in `1preparation/assessment.yaml` corresponds to the second item in `2regular/assessment.yaml`.
- The paired manifest items MAY use different `id` and `ref` values, but their referenced questions MUST assess the same skill.
- Pair preparation and regular exam questions one-to-one; their item counts and
  their `## Scoring` criterion counts MUST match.
- When using a note such as `本試験では`, write it for the paired regular exam
  question and clearly describe what changes in that paired regular exam
  question.
- Write preparation questions as surface-varied versions of the paired regular
  exam questions when students may view preparation materials during the exam.
  Change surface details such as values, strings, prompt text, conditions,
  ranges, examples, or output text while keeping the same assessed skill.
- Use exactly the same `## Scoring` bullet list for each paired preparation and
  regular exam question.
- Scoring criterion text in `## Scoring` MUST be abstract enough to apply to both
  a preparation question and the paired regular exam question (for example
  `指定された値`, `指定された文字列`, `要求通りの出力`, `下限値以上`, and
  `上限値以下`).
- Points live in each assessment manifest item `points` array. When the paired
  preparation and regular exam share the same points, set `points` to the same
  array in both manifests.
- Put the question intent at the beginning of `## Explanation`.
  - Example: `出題意図: ...`

## Legacy tooling

- `convert-exam-md-to-html` is legacy/deprecated. Do not use it for new
  Markdown question compilation, validation, preview, or publication flows.
- Migrate existing workflows toward `markdown-to-qti` output and QTI packages
  instead of HTML generated from exam Markdown.

## Backward compatibility

- There is no backward compatibility with the old `- N: ...` inline-point
  scoring form or the old string-item manifest format.
- Validation MUST hard-fail on the old `- N: ...` scoring form, on string
  manifest items, and on a root `type` field.
