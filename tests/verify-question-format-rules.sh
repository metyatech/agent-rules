#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

require_contains() {
  local file="$1"
  local pattern="$2"

  if ! grep -Fq -- "$pattern" "$repo_root/$file"; then
    printf 'Expected %s to contain: %s\n' "$file" "$pattern" >&2
    return 1
  fi
}

require_not_contains() {
  local file="$1"
  local pattern="$2"

  if grep -Fq -- "$pattern" "$repo_root/$file"; then
    printf 'Expected %s not to contain: %s\n' "$file" "$pattern" >&2
    return 1
  fi
}

# Common Markdown/QTI format lives in the course-exams domain.
for pattern in \
  "markdown-to-qti is the only supported Markdown parser/compiler" \
  "question_type" \
  "time_budget_seconds" \
  "descriptive" \
  "choice" \
  "cloze" \
  "{{answer}}" \
  "{{/regex/}}" \
  "title" \
  "time_limit_seconds" \
  "items" \
  "convert-exam-md-to-html" \
  "legacy/deprecated" \
  "## Scoring" \
  "question-bank/imported" \
  "points:" \
  "id:" \
  "ref:" \
  "id" \
  "ref" \
  "points" \
  '/^[A-Za-z0-9][A-Za-z0-9_.:-]*$/' \
  "A string item is FORBIDDEN." \
  "Item order in the manifest is the assessment-test order." \
  '`points` is REQUIRED when the referenced question has a `## Scoring` section.' \
  '`points` is FORBIDDEN when the referenced question does NOT have a `## Scoring`' \
  "Scoring criterion IDs are FORBIDDEN." \
  '`${...}` MUST NOT be used' \
  '`## Type` MUST NOT be used' \
  '`time_estimate_seconds` MUST NOT be used' \
  'Manifest `type: quiz` and `type: exam` MUST NOT be used' \
  "Do not apply weekly quiz-specific fixed-window rules" \
  'Cloze answer markers are active only in `question_type: cloze`.' \
  'In descriptive and choice questions, `{{...}}` is ordinary text' \
  'Use `question_type: cloze` when `{{...}}` is intended as a fill-in answer marker.'
do
  require_contains rules/domains/course-exams/markdown-qti-format.md "$pattern"
done

# General educational question quality lives in the education domain.
for pattern in \
  "Multiple-choice distractors MUST NOT be obviously unrelated options" \
  "Questions, prompts, options, answers, scoring criteria, and explanations MUST NOT introduce"
do
  require_contains rules/domains/education/question-authoring.md "$pattern"
done

# Course-exam-specific scoring/scope rules live in course-exams domain.
require_contains rules/domains/course-exams/question-authoring.md \
  "Distribute exam points across the important taught targets"

# README still surfaces the common format and tool name.
require_contains README.md "Question and exam Markdown"
require_contains README.md "markdown-to-qti"
require_contains README.md "convert-exam-md-to-html"

# Common Markdown/QTI format file must not reference the legacy exam path.
require_not_contains rules/domains/course-exams/markdown-qti-format.md \
  "markdown-to-qti/markdown-question-spec.md"

# The old inline-point scoring example (`- 2: ...`) must be gone from the spec.
require_not_contains rules/domains/course-exams/markdown-qti-format.md \
  "- 2:"

# Preparation/regular pairing now shares the `## Scoring` bullet list.
require_contains rules/domains/course-exams/markdown-qti-format.md \
  "Use exactly the same \`## Scoring\` bullet list"
