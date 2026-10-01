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
- Section `goal` is optional learner-facing orientation at every depth,
  including Event-bearing Sections; its presence is not Evidence.
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

## Tasks and aligned evidence

- Exercise and QuickCheck tasks MUST present the problem, then zero or more
  `<Hint>` blocks, then exactly one `<Answer>` block.
- The first Hint SHOULD avoid unnecessarily revealing the answer immediately.
  Multiple Hints MAY become progressively stronger or more explicit.
- Hints SHOULD default to material already covered in this or a guaranteed
  earlier lesson. Hints MAY explicitly teach new information; they MUST NOT
  require unfamiliar information as already known without explaining it.
- Answers MUST provide feedback that lets learners understand correctness.
  Answers MAY be concise for simple, self-explanatory tasks when additional
  explanation adds no learning value. Explain the reasoning or address a likely
  misconception when it helps the learner; do not invent a misconception.
- When present, Hints MUST be non-empty direct children of the task before its
  final Answer; they MAY provide progressively stronger support.
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
- Design appropriate evidence for Unit objectives at suitable points in the
  Event/course progression; do not require Section-local closure.
  Choose assessment surfaces based on needed evidence: `<Verify>` for
  observable state,
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
- Exercise headings SHOULD identify the task; numbering is optional, for
  example `### 演習1：価格だけ色を変える`. Extension headings MUST make the
  extension task explicit. Exercise statements MUST give the expected result,
  success criteria, and enough context to start without guessing. Extension
  exercises MUST be optional and not required for base lesson completion.

## Learner-facing explanations and guidance

- A `<Concept>` SHOULD focus on conceptual knowledge needed to understand or
  perform a current or near learning activity. Near-first-use placement is a
  default; earlier pre-training, summary, retrieval, or reference contexts MAY
  be appropriate. Sentence counts are review triggers for mixed concepts or
  reference detail, not preferred lengths, hard limits, or research thresholds.
- Treat `Need / Context → Name + meaning → Use` as a context-dependent heuristic,
  not a required or default authoring sequence. Do not rely on an unexplained
  concept as already known.
- A new term may first appear in a heading or title; its name alone does not
  introduce the concept. When first named there, the heading/title and its
  explanation MUST make the meaning explicit before understanding of the term
  is required. Do not assume the learner already knows it or require a glossary
  before every first textual appearance. Headings SHOULD predict the task,
  topic, or capability.
- Exact literal values, identifiers, and metaphors may appear before their
  meaning is explained; explain them before relying on the learner to know what
  they mean. Use cold-read review to detect accidental difficulty: unexplained
  prerequisites, ambiguous instructions, missing state, unnecessary backtracking,
  undefined assumptions, terminology gaps, and visual/prose mismatches.
- As a bounded Course Docs quality heuristic, review whether a learner-facing
  heading, its immediate explanation, the task statement, and relevant UI cues
  ask for the same learner action at the same stage. Treat a mismatch as a
  learner-facing defect when it leaves the learner unsure whether to look,
  write, choose, fix, try, check, answer, or create. Natural paraphrases are
  fine when they describe the same action; do not enforce identical words.
  Multiple actions are fine when their order is explicit and each stage is
  clear. Cold-read question: “Does the next action the learner expects from this
  heading match the action actually required next?” This applies signaling and
  coherence research as a local review heuristic; it is not a directly tested
  rule about particular verb pairs.
- Review learner-facing orientation (including page introductions, prerequisite
  callouts, objective summaries, Section goals, previews, and sequence
  announcements) for concrete value to the current activity, structure, or
  decision at that point. Rework or remove candidates that only restate a
  heading or adjacent prose, a guaranteed course sequence, a canonical Unit
  objective, or information the learner cannot yet use. This review does not
  reject objectives or advance organizers. Klauer (1984) found that presenting
  behavioral objectives, learning directions, or questions before instructional
  text improved goal-relevant learning, reduced goal-irrelevant learning, and
  slightly improved overall learning; effects depended on text/task conditions
  ([Klauer, 1984](https://doi.org/10.3102/00028312021002323)). Hamilton (1985)
  provides a context-sensitive framework for evaluating adjunct questions and
  objectives that accounts for text structure and learner characteristics; it
  is not direct evidence that objectives are effective
  ([Hamilton, 1985](https://doi.org/10.3102/00346543055001047)). Advance
  organizers may facilitate learning and retention
  ([Luiten, Ames, & Ackerson, 1980](https://doi.org/10.3102/00028312017002211)).
- A term may appear in orientation or a heading before it is explained. If the
  learner needs its meaning to understand or act, explain it before relying on
  that understanding; a name-only list is not pre-training. Mayer's multimedia
  pre-training principle concerns learning the names and characteristics of
  main concepts before a complex multimedia lesson. Applying it to Course Docs
  text/code tutorials by explaining a needed relation before an activity depends
  on it is a bounded application, not a finding directly established by Mayer.
  Use pre-training when the later activity needs it; do not require explanation
  before every first appearance or pre-training in every lesson.
- For guided demonstration, when observing or comparing the result is itself
  meaningful learner processing, review whether stating the exact consequence
  beforehand removes that observation. Consider `fully guided action/code →
  observable result → explanation`. This is a bounded quality heuristic, not a
  retrieval-rule extension or a universal sequencing law: actions and code may
  be fully supplied, and it does not require discovery, weaken worked examples
  or explicit guidance, or apply to every instruction.
- Prior knowledge being important does not make a prerequisite callout useful
  on every page. In a guaranteed linear progression, do not add one mechanically
  when it adds no actionable preparation, re-entry, or recovery value; retain it
  when it helps learners make a relevant decision or act on a real use.
- Preserve intended retrieval effort, problem solving, decision making,
  productive struggle, and changed-condition transfer during cold-read review.
- When a task is intended to elicit retrieval or learner generation, the
  learner-visible prompt and default pre-attempt material MUST NOT reveal the
  target response or a decisive cue in a way that removes the intended
  retrieval or generation before the learner's first attempt. If the response
  is deliberately supplied as worked or guided instruction, do not count that
  attempt as evidence of unaided retrieval or generation. This narrow principle
  is supported by research on classroom retrieval practice and the generation
  effect ([Agarwal, Nunes, & Blunt, 2021](https://doi.org/10.1007/s10648-021-09595-9);
  [Bertsch, Pesta, Wiscott, & McDaniel, 2007](https://doi.org/10.3758/BF03193441));
  it does not prescribe withholding answers in other task types.
- Prioritize clarity over brevity; retain needed causal relations, UI/state
  correspondence, action purpose, state transitions, and term meanings.
- Introduce only concepts and elements learners will use or engage with; do not
  add later-use realism without a learning need.
- Before choosing representation or assistance, identify whether the intended
  goal is initial performance, learning (including retention), transfer, or a
  deliberate combination. Do not optimize only initial performance when
  learning or transfer is an explicit goal.
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
- Aim for appropriate assistance for the learner, performance, and goal;
  guidance minimization is not an objective.
- Design meaningful learner processing such as retrieval, explanation,
  prediction, comparison, selection, organization, debugging, adaptation, or
  creation where the outcome needs it; do not require it on every job-aid or
  initial-performance-only page.
- Support positive engagement through authentic relevance, meaningful challenge,
  visible progress, competence-supportive feedback, or meaningful choice and
  learner control when useful; do not impose all of these as a checklist.
- Do not invent relevance or add choice solely for its own sake.
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
