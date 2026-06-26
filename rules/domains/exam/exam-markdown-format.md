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
- Cloze answer markers are active only in `question_type: cloze`.
- In descriptive and choice questions, `{{...}}` is ordinary text and MAY appear
  in language examples or code snippets.
- Use `question_type: cloze` when `{{...}}` is intended as a fill-in answer
  marker.
- Keep educational quality rules in the education domain separate from this
  operational Markdown/QTI format rule.

## Preparation and regular exam pairing

- When creating a preparation question set for a regular exam, pair each
  preparation question with the corresponding regular exam question one-to-one.
  - Example: `1preparation/q1.q.md` corresponds to `2regular` question 1.
  - Example: `1preparation/q2.q.md` corresponds to `2regular` question 2.
  - When the user explicitly requests a different structure, follow the user's
    requested structure.
- When using a note such as `本試験では`, write it for the paired regular exam
  question and clearly describe what changes in that paired regular exam
  question.
- Write preparation questions as surface-varied versions of the paired regular
  exam questions when students may view preparation materials during the exam.
  Change surface details such as values, strings, prompt text, conditions,
  ranges, examples, or output text while keeping the same assessed skill.
- Use exactly the same `## Scoring` text for each paired preparation and regular
  exam question.
- When the same scoring text needs to apply to both a preparation question and a
  regular exam question, write the scoring text abstractly enough to apply to
  both.
  - Use wording such as `指定された値`, `指定された文字列`,
    `要求通りの出力`, `下限値以上`, and `上限値以下`.
- Put the question intent at the beginning of `## Explanation`.
  - Example: `出題意図: ...`

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
