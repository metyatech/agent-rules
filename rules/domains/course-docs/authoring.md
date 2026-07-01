# Course Docs Authoring

- Course documentation content MUST be written for beginner learners in clear Japanese unless the task explicitly requests another language.
- Course docs pages MUST use the shared course-docs MDX components when they express page structure, learner actions, verification, concept explanation, reference material, recovery steps, checkpoints, exercises, or solutions.
- Use `<Section>`, `<Action>`, `<Verify>`, `<Concept>`, `<Reference>`, `<Recovery>`, and `<Checkpoint>` from `course-docs-platform` for structured tutorial pages.
- A top-level `<Section>` MUST declare `goal`.
- Learner-facing HTML examples MUST use normal HTML void elements without XHTML-style trailing slashes, such as `<input>` rather than `<input />`.
- The void-element rule applies to learner-facing HTML code fences and sample/complete files; it does not apply to MDX/JSX component syntax.
- Exercises MUST use `<Exercise>` and `<Solution>` when the page expects learners to attempt a task and then compare with an answer.
- Exercise headings MUST use `### 演習N` for standard exercises and `### 演習-発展N` for extension exercises.
- Exercise statements MUST include the expected result, success criteria, and enough context for learners to start without guessing.
- Extension exercises MUST be optional and must not be required for the base lesson completion.