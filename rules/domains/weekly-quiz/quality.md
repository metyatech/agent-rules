# Weekly Quiz Quality

- Weekly quizzes MUST help students retrieve taught lesson content, check
  whether they understand it, and identify knowledge gaps.
- A weekly quiz for `wXX` MUST assess the content of lesson `XX`, where `XX` is
  the numeric part after `w` with leading zeros ignored. For example, `w01`
  assesses lesson 1, `w07` assesses lesson 7, and `w14` assesses lesson 14. Do
  not apply an off-by-one mapping such as `w07` to lesson 6.
- Before drafting or revising a weekly quiz, the agent MUST identify the target
  week, matching lesson number, schedule entry, syllabus scope, and relevant
  taught material.
- The agent MUST check both the syllabus and the actual lesson materials,
  textbook pages, worked examples, exercises, or instructor notes for the target
  lesson.
- Syllabus entries MUST be used only to identify the lesson scope.
- Quiz prompts, answers, distractors, and explanations MUST be grounded in
  actual taught material, not general subject knowledge.
- If the actual materials cannot be found, the agent MUST report the missing
  source instead of fabricating a quiz from the syllabus alone.
- Each quiz item MUST use only concepts, terms, operations, and syntax
  explicitly taught up to and including the target lesson.
- Quiz items MUST NOT depend on later-lesson content, untaught vocabulary,
  external general knowledge, or one-off classroom events.
- Prompts MUST NOT ask what happened in a specific lesson, such as `第N回で何をしましたか`.
- A question based on an in-class task MUST be rewritten as a content, scenario,
  or procedure question answerable without remembering that class event.
- Weekly quizzes MUST contain no more than 4 questions. Apply this cap when
  creating or revising a quiz; do not bulk-change existing quiz data as part of
  this authoring rule.
- Choice and cloze questions SHOULD be the default formats for weekly quizzes.
  Descriptive questions MAY be used when they can be answered quickly, normally
  within the existing 30-60 second per-question guideline. Questions requiring
  extended written responses MUST NOT be used in a weekly quiz.
- A quiz bundle SHOULD cover multiple important topics from the relevant lesson
  instead of repeating one topic.
- Each multiple-choice question MUST have one defensible correct answer.
- Multiple-choice distractors MUST be credible near-misses based on taught
  misconceptions, likely learner mistakes, procedure-order errors, vocabulary
  confusions, code/API mix-ups, or plausible alternatives from the covered
  material.
- Multiple-choice distractors MUST NOT be joke answers, obviously unrelated
  actions, absurd options, untaught content, or choices that can be eliminated
  without understanding the lesson.
- Multiple-choice prompts and choices MUST be written in parallel forms so the
  correct answer is not revealed by wording differences.
- Multiple-choice quiz bundles MUST vary the correct option position when item
  constraints allow it.
- Individual questions SHOULD normally take 30-60 seconds for Track-familiar learners.
- Exported quiz bundles MUST remain within the 3-7 minute duration window unless
  the schedule marks the week as no-quiz.
- Current quiz quality standards MUST take priority over past quiz practice.
  Past trends, formats, question counts, and difficulty levels do not need to be
  followed. Searching the question bank exists to find suitable questions for
  reuse, not to reproduce past patterns.
- Apply this reuse order when creating or revising a weekly quiz:
  1. Reuse an existing question unchanged when it meets the current quality
     standards and fits the taught scope.
  2. Directly revise a suitable existing question when revision can make it
     meet the current quality standards.
  3. Create a new question when no suitable existing question exists or
     revision would not make it suitable.
- The same current quality standards MUST apply to new and revised questions.
  A question that has appeared before MAY be reused. Do not check past use,
  learner attempts, or answer history, and do not make past assessment impact a
  condition of reuse or revision.
- Every question SHOULD include concise feedback suitable for short Track review.
- Before reporting a quiz bundle as ready, the agent MUST audit every item for
  answer uniqueness, answer-format clarity, plausible distractors,
  non-overlapping choices, and absence of wording giveaways.
- Review each changed question in isolation: read its Track-facing (when
  applicable) prompt and options before the intended answer or explanation,
  without other questions, source lessons, or answer metadata. Check the
  grounding of claimed target identity, state, and behavior; actively search
  for counterexamples before confirming the answer key and explanation.
- Validation, Track export, and CI check structure, not educational correctness.
  The agent MUST NOT report educational-quality PASS without a semantic review
  of the affected questions. Identify any environment-dependent behavior that
  was not verified rather than implying it was.
- Before reporting a weekly quiz change as complete, the agent MUST run the
  relevant question validation command, export the affected week, inspect the
  export result for Track-facing issues, and run the repository-standard
  verification command.
