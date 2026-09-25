# Course Docs Authoring

- Course documentation content MUST be written for beginner learners in clear
  Japanese unless the task explicitly requests another language.
- Use shared `course-docs-platform` MDX components for page structure, learner
  actions, explanations, checks, exercises, answers, references, and recovery
  support.
- Common components include `<Section>`, `<Action>`, `<Concept>`, `<Reference>`,
  `<Verify>`, `<QuickCheck>`, `<Checkpoint>`, `<Exercise>`, `<Evidence>`,
  `<Hint>`, `<Answer>`, and `<Recovery>`. `<Instruction>` and `<ProblemSolving>`
  are Learning System stage markers, not general-purpose containers.
- A top-level `<Section>` MUST declare `goal`.
- Learner-facing HTML examples MUST use normal HTML void elements without
  XHTML-style trailing slashes, such as `<input>` rather than `<input />`. This
  applies to HTML code fences and sample/complete files, not MDX/JSX components.
- Course docs MUST NOT use `<Solution>` or `authoringMode`.

## Learning System contract

- A Learning Unit is a canonical objective or capability with a stable ID.
  Define each Unit exactly once in the course-root `learning-units.yaml`; do not
  duplicate its `objective` in MDX.
- Units MAY have parent-child hierarchy. The platform derives Composite status
  for Units with children and Leaf status for Units without children. A
  Composite MAY have no direct Event; each Leaf MUST have Learning Event
  coverage.
- A Learning Event is one occurrence of how the learner learns targeted Units.
  Represent it with metadata on an existing `<Section>`. One Event MUST be
  contained in one MDX page; do not reuse an Event ID across pages or nest
  Event-bearing Sections.
- A Page is a display/distribution unit, not a Learning Unit. Derive course
  progression from the ordered Learning Events; do not maintain a separate
  Learning Plan or teacher lesson graph.
- Event metadata uses `eventId`, `targets`, and `phase`; `pattern` is required
  only for an initial Event. `strategy="productive-failure"` is optional and
  valid only for an initial, problem-solving-first Event.
- Valid `phase` values are `initial`, `practice`, `retrieval`, and `transfer`.
  Initial Events MUST set `pattern` to `instruction-first` or
  `problem-solving-first`; non-initial Events MUST NOT set `pattern`.
- Initial Events MUST use `<Instruction>` and `<ProblemSolving>` as explicit
  stage markers, each as a direct child of the Event Section. Markers MUST NOT
  appear outside an initial Event, inside non-initial Events, or nest inside one
  another.
- Order the stage markers to match `pattern`: Instruction before ProblemSolving
  for `instruction-first`, and ProblemSolving before Instruction for
  `problem-solving-first`.
- Do not treat Productive Failure as another name for problem-solving-first.
  Follow the platform metadata contract without inventing an agent-side semantic
  test for whether an Event qualifies.

## Tasks, evidence, and closure

- Exercise and QuickCheck tasks MUST present the problem, then one or more
  `<Hint>` blocks, then exactly one `<Answer>` block. Hints MUST NOT reveal the
  answer first and MUST use material already covered in this or a guaranteed
  earlier lesson. Answers MUST explain why they are correct and address a likely
  misconception only when one genuinely exists.
- Exercise is a task/container format, not a learning phase. Near-copy and
  routine application tasks MAY use `<Exercise>`; the component name alone does
  not make a task transfer.
- In Learning System content, bind objective evidence with metadata-only
  `<Evidence>` around an existing learner-facing surface when an explicit
  evidence mapping is needed. Allowed surfaces are `<Verify>`, `<QuickCheck>`,
  `<Checkpoint>`, and `<Exercise>`; `demonstrates` is `application`,
  `retrieval`, or `transfer`.
- Do not infer evidence kind from a component name. `<Recovery>` is not an
  Evidence surface. `<Evidence>` supplies a binding; it is not assessment UI.
- A transfer task MUST require selecting and adapting a learned principle under
  different conditions. Changing only values, names, or materials in a near-copy
  is not transfer.
- Each substantive learning goal MUST have an aligned closure that can test it.
  Choose closure based on needed evidence: `<Verify>` for observable state,
  `<QuickCheck>` for retrieval or understanding, `<Checkpoint>` for a
  multi-condition milestone, or `<Exercise>` for application or transfer tasks.
  This is a selection guide; component type alone does not determine evidence
  kind.
- Immediate success shows current performance, not durable mastery. Later
  recurrence alone does not establish distributed practice. Do not model spacing
  or interleaving as a single Event attribute.
- `<Recovery>` supports error diagnosis and recovery; it is not learning-goal
  closure. The platform currently reports missing explicit objective evidence as
  a note; do not describe that note as an enforced build failure.
- Do not impose a fixed page-wide order for QuickCheck, Exercise, and extension
  exercises; place tasks where they support the learner's progression.
- Exercise headings MUST use `### 演習N` for standard exercises and `### 演習-発展N`
  for extension exercises. Exercise statements MUST give the expected result,
  success criteria, and enough context to start without guessing. Extension
  exercises MUST be optional and not required for base lesson completion.

## Learner-facing explanations and guidance

- Introduce concepts when the learner needs them. A `<Concept>` MUST focus on
  one concept and include only information needed for imminent first use. First
  use MAY be an Action, Section, Verify, QuickCheck, or Exercise. Roughly 2–5
  sentences or one short table is preferred; 6+ sentences SHOULD trigger review
  for multiple concepts or reference material, not automatic rejection.
- Write so a learner reading once from the top can understand each idea without
  backtracking: establish the need or context, name and explain the concept,
  then use it (`Need / Context → Name + meaning → Use`). Do not rely on an
  unexplained concept as already known.
- A term may first appear where it is explicitly introduced and defined.
  Headings and titles follow the same rule: they may name a concept when the
  heading itself introduces it, its meaning is clear there, or the needed
  meaning has already been established. Do not require a glossary or predefine
  every term.
- Exact literal values, identifiers, and metaphors may appear before their
  meaning is explained; explain them before relying on the learner to know what
  they mean. Judge cold-read clarity by whether a learner reading downward from
  the start can understand the current material without going back, not by
  whether every string appeared only after a prior definition.
- Introduce only concepts and elements learners will use or engage with; do not
  add later-use realism without a learning need.
- Before choosing representation or assistance, identify whether the intended
  goal is immediate task performance, later retention, transfer, or a deliberate
  combination. Do not optimize only first-attempt speed when retention or
  transfer is an explicit goal.
- Choose the most efficient primary representation for the task and goal: visual
  for spatial UI/layout information, code or CodePreview for code authoring,
  text for short non-spatial operations, and diagrams/visuals for structural
  relationships. Do not add images merely because a step is operational.
- Treat one `<Action>` as one coherent learner action episode toward an
  immediate sub-goal. It MAY contain a short, locally unified sequence (for
  example, click → open menu → hover → choose) when splitting each click would
  increase integration cost.
- Do not duplicate a complete procedure across primary representation and prose
  merely for repetition. Short labels, identifiers, numbers, positional cues,
  and exact values MAY appear in both when they reduce search or integration
  cost.
- An `<Action>` MUST be executable without guessing. For a visual-primary
  Action, prose MAY add complementary details instead of repeating the full
  visual path, provided essential visual instructions have a complete accessible
  text-equivalent route.
- Preserve accessibility-equivalent instructions; avoid competing duplicate
  paths when the platform can expose an equivalent accessibly or on demand.
- For a new procedure with low or unestablished prior knowledge, provide enough
  worked or guided support before substantial independent construction. Fade,
  retain, or restore assistance based on established prior knowledge and learner
  performance; do not use a fixed second-time/third-time rule.
- Learner-facing prose MUST NOT contain author-facing audience descriptions such
  as `受講者は〜`, `学習者は〜`, or `初学者向け` when they do not help perform the task.
  Rewrite these as direct task prose. Do not ban `ユーザー` when it refers to a real
  product/domain end user rather than the tutorial reader.
- Informative tutorial visuals MUST have text alternatives appropriate to their
  role. For complex annotated screenshots or diagrams, use short `alt` text for
  purpose/identity and put the detailed equivalent in adjacent learner-visible
  text or another long-description mechanism.
- Screenshot annotation text and images of text MUST meet WCAG 2.2 SC 1.4.3
  contrast: 4.5:1 for normal text and 3:1 for large text. Meaningful non-text
  callout shapes and UI-state indicators MUST meet the applicable 3:1 non-text
  contrast requirement. Prefer real text over images of text when practical.
