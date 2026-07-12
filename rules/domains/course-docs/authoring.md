# Course Docs Authoring

- Course documentation content MUST be written for beginner learners in clear Japanese unless the task explicitly requests another language.
- Course docs pages MUST use the shared course-docs MDX components when they express page structure, learner actions, verification, concept explanation, reference material, recovery steps, checkpoints, exercises, or answers.
- Use `<Section>`, `<Action>`, `<Verify>`, `<Concept>`, `<Reference>`, `<Recovery>`, `<Checkpoint>`, `<Exercise>`, `<QuickCheck>`, `<Hint>`, and `<Answer>` from `course-docs-platform` for structured tutorial pages.
- A top-level `<Section>` MUST declare `goal`.
- Learner-facing HTML examples MUST use normal HTML void elements without XHTML-style trailing slashes, such as `<input>` rather than `<input />`.
- The void-element rule applies to learner-facing HTML code fences and sample/complete files; it does not apply to MDX/JSX component syntax.
- Exercises MUST use `<Exercise>`, `<Hint>`, and `<Answer>` when the page expects learners to attempt a task and then compare with an answer.
- QuickCheck tasks MUST use `<QuickCheck>`, `<Hint>`, and `<Answer>` when the page expects learners to check understanding and then compare with an answer.
- Every `<Exercise>` and `<QuickCheck>` task MUST be structured as problem content, followed by one or more `<Hint>` blocks, followed by exactly one `<Answer>` block.
- A `<Hint>` MUST NOT reveal the answer first and MUST use only material already covered earlier in the same lesson or in a guaranteed earlier lesson.
- An `<Answer>` MUST include an explanation that corrects likely misconceptions, not only the final answer.
- Course docs MUST NOT use `<Solution>` or `authoringMode`.
- Course docs MUST NOT impose a fixed page-wide order for QuickCheck, Exercise, and extension exercise blocks; place each task where it best supports the learner's progression.
- Exercise headings MUST use `### 演習N` for standard exercises and `### 演習-発展N` for extension exercises.
- Exercise statements MUST include the expected result, success criteria, and enough context for learners to start without guessing.
- Extension exercises MUST be optional and must not be required for the base lesson completion.

## Beginner lesson material ordering

- Materials MUST be written assuming learners will read every word carefully, in natural reading order: top to bottom and left to right.
- At any point in the material, do not introduce a term or feature that has not been explained earlier in that same material (or in a strictly earlier lesson within the same course, when curriculum ordering guarantees it was already taught). Introduce new terms or features at the point where learners first need them.
- "Term or feature" is not limited to HTML/CSS/JS syntax or APIs. It also includes: quoted literal values used in prose or tables (e.g. a string like `active` used as a rule's classification key), variable/identifier names, and any word or metaphor used in a `<Section>`/`<Concept>`/heading title or in body prose, a table cell, or a bullet, before its meaning has been established.
- A `<Concept>` or `<Section>` title MUST NOT rely on a word, abbreviation, or metaphor that is only explained in that block's own body or in a later block. Titles MUST either be self-explanatory to a reader who has not yet read the body, or be phrased so the metaphor/label appears only after the body has explained the underlying idea (e.g. as a closing summary label, not as the heading itself).
- When a rule, table, or summary statement needs to reference a specific value, label, or term (e.g. a classification-rule sentence naming a value to count), the term MUST already be defined by that point, or the sentence MUST explicitly flag it as forthcoming rather than using it as if already known.
- When creating materials, first decide how learners should behave in each section, then write the content so that it naturally leads them to behave that way.
- Introduce only one new concept or element at a time.
- Do not include elements, such as terms, features, code, or markup, that learners will not use or engage with just because they might be realistic or useful later.

### Verification method for this rule

- Checking this rule requires a literal top-to-bottom "cold read" simulation, not a structural/component-level scan. To review material against this rule:
  1. Walk the material from the first word to the last, in rendered reading order, including titles/headings (which render before their own body).
  2. Maintain a running set of terms, values, and metaphors that have been explicitly explained so far.
  3. At each sentence, heading, table cell, and code comment, check every technical term, quoted value, and metaphor against that running set before accepting it as understandable at that point.
  4. Flag the first point where a word could not be resolved by a first-time reader using only what has been read so far. Headings/titles MUST be checked against content read strictly before that heading, never against the body that follows it.
- A structural check (e.g. "does this page use the required MDX components", "is `goal` present") does NOT satisfy this rule's verification requirement and MUST NOT be treated as a substitute for the cold-read simulation above.
