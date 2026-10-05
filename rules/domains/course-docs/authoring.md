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

## Research provenance

- Classify pedagogical claims by provenance before turning them into rules:
  - `R` — supported in the same direction by multiple independent studies or
    research syntheses within relevant boundary conditions.
  - `S` — a multi-study research synthesis whose inference chain is explicit
    and uses only research-supported premises.
  - `L` — a local, normative, product, authoring, or platform decision.
  - `U` — unresolved by the available research.
- Do not promote a claim to `R` or `S` by combining one research result with
  unaudited design intuition. For `S`, the supporting studies and inference
  chain MUST be traceable in the tutorial-authoring research foundation.
- `U` items MUST NOT become pedagogical authoring rules merely to fill a design
  gap. Gather more evidence or keep the choice explicitly local/experimental.
- Keep `L` contracts explicit; strict enforcement does not make a local rule a
  scientific finding.

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
- For the local Course Docs `phase="transfer"`, use a deliberately strict
  operational criterion: the learner MUST select and adapt a learned principle
  under meaningfully changed conditions. Changing only values, names, or
  materials in a near-copy does not satisfy this local phase criterion.
  This is a Course Docs contract, not a universal scientific definition of
  transfer; research also studies near transfer under smaller changes.
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
- Do not rely on an unexplained concept as already known. Explain the
  characteristics or relations the learner must understand before an activity
  depends on that understanding; do not impose a fixed local sequence for doing
  so.
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
- As a Course Docs research synthesis, review whether a learner-facing
  heading, its immediate explanation, the task statement, and relevant UI cues
  ask for the same learner action at the same stage. Treat a mismatch as a
  learner-facing defect when it leaves the learner unsure whether to look,
  write, choose, fix, try, check, answer, or create. Natural paraphrases are
  fine when they describe the same action; do not enforce identical words.
  Multiple actions are fine when their order is explicit and each stage is
  clear. Cold-read question: “この見出しを読んで learner が予想する次の行動と、実際に次に要求される行動は一致しているか”
  This is a Course Docs research synthesis from heading/signaling, coherence,
  and consistent task-action mapping evidence; it is not a directly tested rule
  about particular verb pairs.
- Review sequence / discourse continuity as a broader cold-read question than
  learner-action consistency. Especially in novice-oriented initial
  instruction, make it clear from the learner's current state why the next
  topic, operation, or concept appears now. A concise bridge may connect a
  learner goal, an observed result, a limitation of the current method, the
  need for a next concept or operation, or an explicit transition. Do not make
  learners infer a logical bridge that the material can state briefly.
  Sentences in novice initial instruction SHOULD normally be interpretable
  from information introduced up to that point; do not depend on future
  content to make earlier prose meaningful. When it fits the lesson's causal
  structure, prefer current/known state → need/problem → new concept → use;
  this is a local sequencing heuristic, not a research-established or
  universally optimal order.
  Cold-read questions:
  - “この部分は、直前まで読んだ learner にとって『なぜ今この話？』にならないか”
  - “新しい概念・道具・操作は、その必要性が生じてから導入されているか”
  - “見出しだけ先に読んだとき、learner state より先の結論へ飛んでいないか”
  - “前の結果 → 次の説明・操作の因果や目的が自然につながっているか”
  This is a bounded research synthesis for novice initial instruction, not a
  requirement to add transitions between every paragraph or to maximize
  coherence for every learner. Preserve intentional
  inference in retrieval and problem-solving activities; do not impose this as
  a universal high-coherence rule for learners with substantial prior knowledge.
- Learner-facing prompts MUST make clear at the point of asking the object or
  content, the judgment/action required, and the expected response form. The
  prompt, nearby instructions, and control labels MAY establish these together.
  Do not require learners to infer a missing referent or baseline from vague
  wording unless it is already unambiguous. Selection options SHOULD complete or
  answer the stem naturally; do not make decoding awkward wording an accidental
  extra task or presuppose the target category in a way that cues the answer.
  Treat exact Japanese-copy checks and option phrasing as local Course Docs
  conventions, not universal research laws. Preserve the pre-attempt
  retrieval/generation boundary below.
- Prefer direct learner-facing task language to authoring/meta labels when the
  task can be stated plainly. When showing a sentence-completion response back
  for comparison, prefer the complete semantic sentence over only the inserted
  fragment; this is a bounded local convention, not a directly tested rule.
- Use stable names or identifiers to refer to responsive-layout targets; do
  not rely on viewport-dependent locations such as left, right, above, or below
  as the sole identifier when layout can move the target. This is a local
  responsive-content convention.
- Keep an explanation needed for a later QuickCheck or operation on the main
  instructional path rather than relying only on a Hint, collapsed content, or
  optional callout. Keep mutually dependent operations, results, and
  explanations close enough to integrate without unnecessary search or split
  attention. Do not impose a fixed ordering among them unless the intended
  learning activity itself requires one.
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
- Prediction/prequestion activities SHOULD ask about a concrete upcoming
  relation or outcome. A research review finds pre-instruction questions can
  improve learning, with benefits varying by procedure and assessment; effects
  may be tied to prequestioned content and should not be assumed for unrelated
  material ([Pan & Carpenter, 2023](https://doi.org/10.1007/s10648-023-09814-5)).
  One study supports code-output prediction as an option in suitable novice
  programming instruction, not a mandatory pattern
  ([Tucker et al., 2024](https://doi.org/10.1016/j.learninstruc.2023.101871)).
  When self-explanation is useful, scaffold what relation, error, or concept to
  explain; one two-experiment physics study found benefits from scaffolded
  prompts for error correction and near transfer in its tested conditions, not
  universal superiority over generic prompts
  ([Tuckey et al., 2024](https://doi.org/10.1016/j.cedpsych.2024.102326)).
  Non-empty explanation text is not proof of correctness. If reflection is not
  semantically graded, this local assessment convention says not to make it a
  fake required gate; provide an explicit route to reveal the explanation or
  answer when appropriate.
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
- Make genuinely important, task-relevant information visually distinctive and
  limit competing emphasis so the signal remains informative. Do not infer an
  exact colour, border, radius, or size from signaling research.
- Use proximity, common region, alignment, or other grouping cues to communicate
  real semantic grouping when learners must integrate related information.
  Treat the exact visual encoding as a local design choice unless directly
  supported by applicable evidence.
- When learners must connect code, interface, diagram, or rendered output, make
  their semantic relationship explicit and use proximity or selective mapping
  cues where useful. A meta-analysis supports integrating related text and
  visual information in multimedia learning; applying that evidence to
  code/UI/output mapping is a local Course Docs heuristic, not evidence for a
  particular layout
  ([Schroeder & Cenkci, 2018](https://doi.org/10.1007/s10648-018-9435-9)).
  Do not assume novices infer which code state produced a nearby preview.
  Explain auxiliary notation rather than making symbols an extra decoding
  task. Exact placement/layout remains local or experimental.
- Keep task-action mappings and cues consistent when they represent the same
  meaning or operation. Do not treat surface uniformity by itself as a learning
  principle.
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
- A meta-analysis supports meaningful/coherent learner-paced segments in
  multimedia procedures. Applying semantic/causal boundaries to Course Docs,
  including whether simultaneous changes should be separated, is a local design
  heuristic; exact cut points remain a local decision
  ([Rey et al., 2019](https://doi.org/10.1007/s10648-018-9456-4)). Segment by
  meaningful semantic/causal boundaries, not screen count. Separate simultaneous
  changes when doing so makes each causal contribution observable; preserve an
  intentional “no visible change yet” state when it clarifies a role or mental
  model. Do not split mechanically when integration cost rises.
- When later learning requires comparison or integration with earlier material,
  keep covered information available or easy to reopen. Guided forward
  progression may coexist with reviewable prior content. Cumulative
  presentation is a promising candidate, not a proven universal or uniquely
  optimal UI. This is a local support heuristic; exact tabs, accordions,
  collapsing, and layout remain local or experimental. A compact re-entry
  reference may help when learners need it, but is not required on every page.
- In sequential dynamic tutorials, newly revealed instruction SHOULD normally
  appear at or after its triggering action in meaningful reading/focus order.
  Keep semantic, visual, programmatic reading, and keyboard focus order aligned
  when order affects meaning, consistent with WCAG meaningful sequence and focus
  order ([WCAG 2.2 SC 1.3.2](https://www.w3.org/TR/WCAG22/#meaningful-sequence),
  [SC 2.4.3](https://www.w3.org/TR/WCAG22/#focus-order)). Placing new content
  after its trigger and showing a major step change near the learner's current
  attention are local defaults, not universal tutorial laws; a remote progress
  indicator may supplement the nearby cue.
- After a meaningful state-changing action, identify the changed source,
  target, or result without requiring comparison from memory. Do not rely on
  transient animation alone; retain a changed value, line marker, result text,
  or equivalent cue until it can be inspected. Animation is supplemental;
  respect reduced-motion preferences and preserve text/UI contrast. When the
  change functions as a status message, make it programmatically determinable
  for assistive technologies as applicable under WCAG 2.2 SC 4.1.2/4.1.3
  ([Status Messages](https://www.w3.org/TR/WCAG22/#status-messages)). Do not narrate
  changes when direct signaling already makes them clear and prose adds no
  learning value; this is a local content convention.
- Apply a visible-prose value test: a learner-facing sentence that does not
  materially aid understanding, a decision, the next action, error
  prevention/recovery, state interpretation, reference, or accessibility is a
  candidate for removal or revision. UI narration that only repeats an obvious
  interaction/result is normally unnecessary. Retain useful causal explanation,
  misconception prevention, task instructions, status/accessibility messages,
  and clarifying elaboration. This local editorial heuristic does not mean
  shorter is always better; accessibility-equivalent content is not gratuitous
  redundancy.
- For a single-line interactive response with one primary submit/confirm action,
  prefer native form semantics so Enter and the visible submit control share
  their meaning where applicable (HTML Standard: [Implicit submission](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission)).
  Do not apply this to multiline inputs or controls with different standard
  keyboard behavior. Avoid custom Enter handlers that submit during IME
  composition unless composition is handled; Enter used to confirm Japanese,
  Chinese, or Korean IME composition must not prematurely submit the response
  ([Chrome IME-safe form guidance](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md)).
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
