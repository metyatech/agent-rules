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

for file in \
  rules/domains/exam/exam-markdown-format.md \
  AGENTS.md
do
  require_contains "$file" "markdown-to-qti is the only supported Markdown parser/compiler"
  require_contains "$file" "question_type"
  require_contains "$file" "time_budget_seconds"
  require_contains "$file" "descriptive"
  require_contains "$file" "choice"
  require_contains "$file" "cloze"
  require_contains "$file" "{{answer}}"
  require_contains "$file" "{{/regex/}}"
  require_contains "$file" "title"
  require_contains "$file" "time_limit_seconds"
  require_contains "$file" "items"
  require_contains "$file" "convert-exam-md-to-html"
  require_contains "$file" "legacy/deprecated"
  require_contains "$file" '`${...}` MUST NOT be used'
  require_contains "$file" '`## Type` MUST NOT be used'
  require_contains "$file" '`time_estimate_seconds` MUST NOT be used'
  require_contains "$file" 'Manifest `type: quiz` and `type: exam` MUST NOT be used'
  require_contains "$file" "Do not apply weekly quiz-specific fixed-window rules"
  require_contains "$file" 'Cloze answer markers are active only in `question_type: cloze`.'
  require_contains "$file" 'In descriptive and choice questions, `{{...}}` is ordinary text'
  require_contains "$file" 'Use `question_type: cloze` when `{{...}}` is intended as a fill-in answer marker.'
done

for file in \
  rules/domains/education/question-authoring.md \
  AGENTS.md
do
  require_contains "$file" "Questions, prompts, options, answers, scoring criteria, and explanations MUST NOT introduce"
  require_contains "$file" "Distribute exam points across the important taught targets"
done

require_contains README.md "Question and exam Markdown"
require_contains README.md "markdown-to-qti"
require_contains README.md "convert-exam-md-to-html"

require_not_contains rules/domains/exam/exam-markdown-format.md "markdown-to-qti/markdown-question-spec.md"
