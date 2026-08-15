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

require_matches() {
  local file="$1"
  local pattern="$2"

  if ! grep -Eq -- "$pattern" "$repo_root/$file"; then
    printf 'Expected %s to match regex: %s\n' "$file" "$pattern" >&2
    return 1
  fi
}

require_not_matches() {
  local file="$1"
  local pattern="$2"

  if grep -Eq -- "$pattern" "$repo_root/$file"; then
    printf 'Expected %s not to match regex: %s\n' "$file" "$pattern" >&2
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
  'no `imported/` or other intermediate directories' \
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

require_contains rules/domains/course-exams/markdown-qti-format.md \
  '`資料` MAY be omitted for quizzes, exams, and submissions.'
require_not_contains rules/domains/course-exams/markdown-qti-format.md \
  'a `資料` object'

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

# Preparation/regular pairing must use manifest item order, not old qN path
# examples or `2regular` question-number phrasing.
require_not_contains rules/domains/course-exams/markdown-qti-format.md \
  "1preparation/q1.q.md"
require_not_matches rules/domains/course-exams/markdown-qti-format.md \
  '2regular.*question 1'
require_contains rules/domains/course-exams/markdown-qti-format.md \
  'Pair preparation and regular exam questions by manifest item order.'
require_contains rules/domains/course-exams/markdown-qti-format.md \
  'the first item in `1preparation/assessment.yaml` corresponds to the first item in `2regular/assessment.yaml`.'

# Preparation/regular pairing now shares the `## Scoring` bullet list.
require_contains rules/domains/course-exams/markdown-qti-format.md \
  "Use exactly the same \`## Scoring\` bullet list"

# Rule-system composition docs must use the singular compose-agentsmd source key.
require_contains rules/global/rule-system.md \
  'with `source` and `domains`'
require_not_contains rules/global/rule-system.md \
  'with `sources` and `profile`'

# Agent-tooling composition rule must align with the current sources + profile ruleset.
require_contains rules/domains/agent-tooling/composition.md \
  'reproducible from `agent-ruleset.json` and the selected `profile`'
require_contains rules/domains/agent-tooling/composition.md \
  'MUST declare the complete ordered `sources` list and `profile`'
require_contains rules/domains/agent-tooling/composition.md \
  'Profiles in `agent-profiles.json` MUST select the complete set'

# Rule-system docs must not require the retired profile schema.
require_not_contains rules/global/rule-system.md \
  'selected profile'
require_not_contains rules/global/rule-system.md \
  'profile-selected domains'
require_not_contains rules/global/rule-system.md \
  'Profiles MUST'
require_not_contains rules/global/rule-system.md \
  'mapping profiles to domains'

# Markdown-to-QTI must retain the canonical HTML-native presentation contract.
require_contains rules/domains/markdown-to-qti/project.md \
  'MDAST to HAST, parsed raw HTML merged into that HAST'
require_contains rules/domains/markdown-to-qti/project.md \
  'Ordinary presentation MUST use standard HTML element names'
require_contains rules/domains/markdown-to-qti/project.md \
  'Reserve `qti-*` names for actual QTI-specific structures and interactions.'
require_contains rules/domains/markdown-to-qti/project.md \
  'Retired qti-prefixed presentation aliases are FORBIDDEN'
require_contains rules/domains/markdown-to-qti/project.md \
  'Authored raw `<pre><code>` MAY contain intentional nested rich HTML.'
require_contains rules/domains/markdown-to-qti/project.md \
  'ordinary standard HTML `p` criteria; `qti-p` is FORBIDDEN.'
require_not_contains rules/domains/markdown-to-qti/project.md \
  'Golden tests MUST preserve parity with historical Kotlin fixture outputs'

# Course-exams authoring and Track delivery share the same canonical contract.
require_contains rules/domains/course-exams/markdown-qti-format.md \
  'Raw HTML is the generic first-class mechanism for authored presentation'
require_contains rules/domains/course-exams/markdown-qti-format.md \
  'Do not manually prefix option text with display ordinals solely for numbering.'
require_contains rules/domains/course-exams/markdown-qti-format.md \
  'with no Markdown intermediate or Markdown reparsing'
require_contains rules/domains/course-exams/markdown-qti-format.md \
  'decode XML entities once to semantic text and escape once for Track HTML.'
require_contains rules/domains/course-exams/markdown-qti-format.md \
  'no backward compatibility requirement for retired qti-prefixed'
require_contains rules/domains/course-exams/markdown-qti-format.md \
  'nested pre/code markup'
