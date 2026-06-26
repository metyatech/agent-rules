<!-- markdownlint-disable MD025 -->
# Tool Rules (compose-agentsmd)

- **Session gate**: before starting substantive work for each externally supplied human/operator instruction, run `compose-agentsmd` once from the project root. AGENTS.md contains the rules you operate under; stale rules cause rule violations. Do not rerun this gate within the same instruction after tool results, retries, generated continuations, or resumed execution. If you discover you skipped this step mid-session, stop, run it immediately, re-read the diff, and adjust your behavior before continuing.
- `compose-agentsmd` intentionally regenerates `AGENTS.md`; any resulting `AGENTS.md` diff is expected and must not be treated as an unexpected external change.
- If `compose-agentsmd` is not available, run it via `npx compose-agentsmd`. If `npx` is unavailable or cannot fetch the package, install it via npm with an environment-appropriate method such as `npm install -g compose-agentsmd` when global installs are permitted, or a user-local npm prefix when global installs are not permitted.
- To update shared/global rules, use `compose-agentsmd edit-rules` to locate the writable rules workspace, make changes only in that workspace, then run `compose-agentsmd apply-rules` (do not manually clone or edit the rules source repo outside this workflow).
- If you find an existing clone of the rules source repo elsewhere, do not assume it is the correct rules workspace; always treat `compose-agentsmd edit-rules` output as the source of truth.
- `compose-agentsmd apply-rules` pushes the rules workspace when `source` is GitHub (if the workspace is clean), then regenerates `AGENTS.md` with refreshed rules.
- Do not edit `AGENTS.md` directly; update the source rules and regenerate.
- `tools/tool-rules.md` is the shared rule source for all repositories that use compose-agentsmd.
- Before applying any rule updates, present the planned changes first with an ANSI-colored diff-style preview, ask for explicit approval, then make the edits.
- These tool rules live in tools/tool-rules.md in the compose-agentsmd repository; do not duplicate them in other rule modules.

Source: rules/domains/education/question-authoring.md

# Educational Question Authoring

## Scientific foundations

- Apply Cognitive Load Theory: reduce extraneous load by making prompts
  self-contained, explicit, and free of source-document references.
- Apply retrieval practice and the testing effect: questions should require
  learners to recall, explain, or apply taught knowledge, not merely recognize
  classroom events.
- Apply transfer-appropriate processing: questions should assess concepts,
  procedures, judgments, debugging cues, or misconceptions in reusable contexts.
- Apply formative feedback principles: explanations should help learners repair
  misconceptions at their current level, not merely reveal the answer.

- Educational questions MUST align with the intended learning target, learner
  level, and already-taught scope.
- Each question MUST focus on one concept, skill, judgment, or misconception.
- Prompts MUST be answerable from the question context without relying on
  hidden classroom-event memory.
- Prompts, answers, and explanations MUST stand alone without referring to
  "this material", "the attached document", "lesson N", or other external
  source context unless that source context is included in the prompt itself.
- Questions, prompts, options, answers, scoring criteria, and explanations MUST NOT introduce, require, or casually reference untaught concepts, features, parameters, APIs, syntax, techniques, tools, or extension-only content unless the user explicitly requests extension-level assessment.
- Questions MUST have a single defensible answer, or explicitly state the
  accepted answer range.
- Multiple-choice distractors MUST be plausible, close to the correct answer,
  and based on likely misconceptions or mistakes.
- Each multiple-choice distractor MUST differ from the correct answer by one
  meaningful concept, target, condition, order, or effect.
- Multiple-choice distractors MUST NOT be obviously unrelated options from a
  different feature area when the question assesses specific technical
  understanding.
- For technical workflow questions, multiple-choice distractors SHOULD remain
  within the same tool, editor, panel, node family, command family, or
  operation category as the correct answer.
- Multiple-choice distractors MAY be obviously wrong only when the learning
  objective is basic vocabulary recognition for first exposure.
- Fill-in questions MUST specify the expected answer format and any forbidden or
  equivalent answers when ambiguity is likely.
- Explanations MUST state the reasoning, concept, procedure, or misconception
  behind the answer.
- Explanations for novice learners MUST be instructional rather than answer-key
  only: include enough reasoning for the learner to repair the misconception.
- When authoring a short question set, order items from lower intrinsic load to
  higher intrinsic load and cover multiple important taught targets rather than
  repeating one surface pattern.

## Course exam question authoring

- When creating course exam questions, check the syllabus and course materials
  specified by the user, and limit questions to the taught scope at the time of
  the exam.
- Confirm the exam's full score and time limit before finalizing the question
  set.
- Match the total scoring points to the exam's full score.
- For midterm exams in this course context, use 20 points unless the user
  specifies otherwise.
- For beginner course exams, write questions that students can answer when they
  can solve the course exercises for the taught scope.
- When the user specifies that certain skills are more important for continuing
  later classes, assign higher scoring weight to those skills.
- Before writing each question, decide its `出題意図`. Write the question so
  that it tests that intent.
- Put `出題意図` at the beginning of `## Explanation`.
- When creating a preparation set for a regular exam:
  - match each preparation question one-to-one with the regular exam question;
  - keep the same assessed skill;
  - use exactly the same `## Scoring` text;
  - change surface details so the student must apply the skill rather than copy
    the preparation answer.
- Write shared scoring text abstractly enough to apply to both the preparation
  question and the paired regular exam question.

Source: rules/domains/exam/exam-markdown-format.md

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
- In descriptive and choice questions, `{{...}}` is ordinary text and MAY appear in language examples or code snippets.
- Use `question_type: cloze` when `{{...}}` is intended as a fill-in answer marker.
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

Source: rules/domains/node/module-system.md

# Node module system (ESM)

- Default to TypeScript (.ts/.tsx); use JavaScript only for tool-required config
  files.
- Always set "type": "module" in package.json.
- Prefer ESM with .js extensions for JavaScript config/scripts (e.g.,
  next.config.js as ESM).

Source: rules/domains/node/npm-packages.md

# Node package publishing

- For scoped npm packages, set publishConfig.access = "public".
- Set files to constrain the published contents.
- If a clean npm install is insufficient, use prepare (or equivalent) to build.

## Verification

- Use npm pack --dry-run to inspect the package contents.
- Run npm test when tests exist.

Source: rules/domains/unreal/unreal-engine-core-guidelines.md

# Unreal Engine project rules

## Baseline

- Implement in C++ when possible; avoid Blueprint Event Graphs.
- Use Slate for widgets.
- Follow the UE coding standard and the C++ Core Guidelines:
  - [Epic C++ Coding Standard for Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine)
  - [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)

## Architecture and design

- Apply SOLID proportionally to context; enforce strictly for public
  APIs/plugins.
- Keep layers clean: business logic does not depend on infra; depend on
  abstractions.
- Separate plugins/modules by feature; do not mix unrelated features.
- Separate interface modules from implementation modules.
- Keep tests in a separate module.
- Strictly separate Runtime vs Editor; Editor dependencies only in Editor
  modules.
- Prefer components over deep inheritance; avoid dynamic-cast heavy designs; use
  UInterface.
- Avoid global state and service-locator patterns; inject dependencies via
  interfaces/factories.
- Use Gameplay Tags for extensible categories; consider GAS for generic
  buffs/debuffs.
- Use UDeveloperSettings for config; define cvars in module namespaces; avoid
  hardcoded values.
- Save with USaveGame and versioning when needed.

## C++/UE coding practices

- Do not use C++ exceptions.
- Prefer forward declarations and IWYU; include \*.generated.h last.
- Use explicit return types; avoid template/macro overuse.
- Use FName for identifiers, FText for UI, FString for transient text.
- Compare floats with tolerances (e.g., KINDA_SMALL_NUMBER).
- UObject references use UPROPERTY with TObjectPtr; non-UObject use
  TUniquePtr/TSharedPtr; non-null shared refs use TSharedRef.
- Avoid raw pointers; use TWeakObjectPtr/TWeakPtr for non-owning references.
- Create UObjects with NewObject/CreateDefaultSubobject, not direct
  constructors.
- Avoid GWorld/GEngine direct access; use GetWorld/WorldContext.

## Error handling and logging

- Use checkf only for fatal invariants; use ensureMsgf for recoverable
  anomalies.
- Log errors/warnings and return early; do not use LogTemp.
- Define module-specific log categories; keep logging appropriate for Shipping.
- Failure logs must include actionable context (e.g., url/path/status).
  Debug-only noise goes to `VeryVerbose`.

## Networking and security

- Server authoritative: validate client inputs; do not trust client state.
- Use appropriate RPC reliability; implement replication correctly; optimize
  with FastArray/COND\_\*/dormancy.
- Never ship secrets to clients; store keys in secure storage; gate dev-only
  features in editor/shipping guards.

## Performance and async

- Minimize Tick; prefer timers/delegates; avoid blocking I/O on the game thread.
- Pre-allocate hot paths; profile with TRACE_CPUPROFILER.
- Use AssetManager and soft references for assets; avoid hardcoded paths.
- Use Enhanced Input and centralized mapping contexts.
- Use UE5Coro for async; keep UObject access on the game thread and marshal
  results back.
- Avoid synchronous subprocess execution (e.g., `FPlatformProcess::ExecProcess`)
  in gameplay/async paths; prefer UE-native APIs (e.g., `FHttpModule`) and keep
  the game thread responsive.
- When dynamically creating components/layers and binding delegates, ensure
  teardown runs on all failure paths and on EndPlay/cancel.

## Build and tests

- UnrealBuildRunTestScript and UE5Coro are required when relevant; install
  before use.
- Build with UnrealBuildRunTestScript\\Fire-Build.ps1.bat --no-pause (add
  configuration/platform as needed).
- Add and run AutomationSpec/Functional Tests for important features.
- Run tests after relevant changes; record repro steps for issues.
- Use Fire-BuildAndTest.ps1.bat --no-pause -TestFilter "filter-pattern"
  for test runs.
- Tests should avoid Engine internal/private headers/APIs; prefer public `U*`
  APIs. If internals are unavoidable, isolate and document why.

Source: rules/domains/web/web-ui-and-testing.md

# Web UI and automation

## Browser automation

- For web automation, use the agent-browser Skill.
- If browser launch fails due to missing Playwright binaries, run npx playwright
  install chromium and retry.

## UI verification and E2E

- For user-visible UI changes, verify in a real browser using agent-browser; if
  not possible, explain and provide manual steps.
- Always add E2E tests for user-visible changes; if no harness exists, add one.
- Run E2E in CI and require it for PR merges; do not defer correctness coverage
  to scheduled runs.
- For React UI changes, add tests that cover initial mount and at least one
  update (re-render) path; include unmount/cleanup when relevant.
- If behavior differs between first render and later renders (effects, caching,
  hydration), cover both paths explicitly.
- Configure E2E to fail fast and avoid auto-opening browsers (headless/no-open).
- For Next.js E2E, prefer next build + next start.
- If Playwright tests fail to launch, clear playwright/.cache and retry.
- When adding/changing links, add tests that verify the target resolves; if not
  feasible, document manual verification.
- For cross-system integration flows, add an end-to-end test (or a contract test
  at the boundary). If impractical, document the limitation and get explicit
  user approval before skipping.
- Use established icon libraries; do not handcraft custom icons or inline SVGs.
