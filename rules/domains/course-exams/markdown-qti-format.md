# Course Exam Markdown and QTI Format

## Common question format

- When creating or editing Markdown questions, quizzes, exams, or preparation
  question sets, use the common Markdown question format below. Small quizzes,
  exams, and preparation question collections share this format.
- Markdown question files live under `courses/<slug>/question-bank/`.

  Reusable weekly quiz questions live under
  `courses/<slug>/question-bank/quizzes/<topic>/<question>.q.md`.

  Reusable exam (regular, preparation, retake) questions live under
  `courses/<slug>/question-bank/exams/<topic>/<question>.q.md`.

  Reusable submission questions live under
  `courses/<slug>/question-bank/submissions/<topic>/<question>.q.md`.

  For quizzes and exams, each `<topic>` folder groups related reusable
  questions under the taught material they target. The folder name MUST match
  the topic derived from `資料.path`:
    - For `.../<topic>/index.md` or `.../<topic>/index.mdx`, the topic is `<topic>`.
    - For `.../<topic>.md` or `.../<topic>.mdx`, the topic is `<topic>` (extension stripped).

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
- `time_budget_seconds` MAY be omitted. When present, it MUST be a positive
  integer.
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
- When `time_limit_seconds` is present, it is the question set's time limit
  and takes precedence over every referenced question's
  `time_budget_seconds`.
- When `time_limit_seconds` is absent and every referenced question has a
  `time_budget_seconds`, the set time budget is their sum.
- When `time_limit_seconds` is absent and every referenced question omits
  `time_budget_seconds`, the QTI assessment test MUST omit
  `qti-time-limits`.
- When `time_limit_seconds` is absent, a mix of present and omitted
  `time_budget_seconds` values is an error.
- Do not apply weekly quiz-specific fixed-window rules such as
  `DEFAULT_WINDOW_SECONDS` checks to the common format. Keep weekly quiz
  scheduling/publication policy in weekly quiz-specific rules only.

Example manifest:

```yaml
title: 2026 JavaScript 中間試験
time_limit_seconds: 1200
items:
  - id: q1
    ref: ../../../../question-bank/exams/variables-comments-assignment/console-log-regular.q.md
    points: [2, 2, 1]
  - id: q2
    ref: ../../../../question-bank/exams/variables-comments-assignment/execution-order-regular.q.md
    points: [3, 2, 2]
  - id: q3
    ref: ../../../../question-bank/exams/variables-comments-assignment/debug-error-regular.q.md
```

## Question-bank layout

- `courses/<slug>/question-bank/` is the course question bank.
- Reusable weekly quiz questions live under
  `courses/<slug>/question-bank/quizzes/<topic>/<question>.q.md`.
- Reusable exam (regular, preparation, retake) questions live under
  `courses/<slug>/question-bank/exams/<topic>/<question>.q.md`.
- Reusable submission questions live under
  `courses/<slug>/question-bank/submissions/<topic>/<question>.q.md`.
- For quizzes and exams, the `<topic>` folder name MUST match the topic
  derived from `資料.path`:
    - For `.../<topic>/index.md` or `.../<topic>/index.mdx`, the topic is `<topic>`.
    - For `.../<topic>.md` or `.../<topic>.mdx`, the topic is `<topic>` (extension stripped).
- `.q.md` files MUST live directly under
  `courses/<slug>/question-bank/quizzes/<topic>/`,
  `courses/<slug>/question-bank/exams/<topic>/`, or
  `courses/<slug>/question-bank/submissions/<topic>/` — no nested
  subdirectories under a `<topic>` folder, no flat `<question>.q.md` directly
  under a kind directory, no `imported/` or other intermediate directories.
- When a required or present `資料.path` cannot be parsed into a topic (for
  example, an EPUB path like `OEBPS/pages/{225..273}/page.xhtml` or any other
  non-topic-shaped path), validation MUST fail with a clear message. Fix the
  path to match the course's established convention rather than introducing an
  exception.
- Quiz assessment manifests MUST reference questions under
  `question-bank/quizzes/`.
- Exam assessment manifests MUST reference questions under
  `question-bank/exams/`.
- Submission assessment manifests MUST reference questions under
  `question-bank/submissions/`.
- Validation MUST refuse cross-kind refs: quizzes may reference only
  `question-bank/quizzes/`, exams only `question-bank/exams/`, and submissions
  only `question-bank/submissions/`.
- Assessment directories MUST NOT keep question Markdown locally. They hold
  `assessment.yaml`, an optional `assessment-run.json`, an optional
  `track-map.yaml`, and `result/` only.
- The `ref`-referenced question-bank Markdown is the only source of truth for
  question content.

## Assessment-kind requirements

- The supported assessment kinds are `quizzes`, `exams`, and `submissions`.
- All kinds support only the `descriptive`, `choice`, and `cloze`
  `question_type` values.
- Quiz and exam question-bank and assessment validation MUST require a
  positive-integer `time_budget_seconds`, a `資料` object, a `資料.path` whose
  derived topic matches the question-bank topic, and a non-empty
  `## Explanation` section.
- Quiz scoring and manifest `points` requirements remain as defined by the
  common scoring rules above.
- Exam validation MUST continue to require `## Scoring` and the corresponding
  manifest item `points` array.
- Submission question-bank and assessment validation MUST allow omitted
  `time_budget_seconds`, `資料`, and `## Explanation`. When a submission has a
  `time_budget_seconds`, it MUST be a positive integer. When it has `資料`, the
  existing `資料` shape validation and derived-topic match apply. When it has
  `## Explanation`, the section MUST be non-empty.
- Submission questions MUST NOT contain `## Scoring`, and submission manifest
  items MUST NOT contain `points`.
- Submission manifests MUST contain `time_limit_seconds`.

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
