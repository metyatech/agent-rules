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