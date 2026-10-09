import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readRule = async (name) =>
  (await readFile(new URL(`../rules/domains/${name}.md`, import.meta.url), 'utf8'))
    .replace(/\s+/g, ' ');

test('assessment rules reject inferred targets and missing decisive conditions', async () => {
  const authoring = await readRule('education/question-authoring');
  assert.match(authoring, /follows from stated conditions, shown code\/data, or guaranteed domain behavior/);
  assert.match(authoring, /variable named `heading` does not establish an `h1` element/);
  assert.match(authoring, /Do not silently import facts from the teaching example/);
  assert.match(authoring, /plausible counterexample that satisfies all stated conditions/);
  assert.match(authoring, /child with an overriding text color/);
  assert.match(authoring, /state the missing decisive condition or narrow the claim/);
});

test('weekly quiz acceptance separates semantic review from structural checks', async () => {
  const quality = await readRule('weekly-quiz/quality');
  assert.match(quality, /Review each changed question in isolation/);
  assert.match(quality, /prompt and options before the intended answer or explanation/);
  assert.match(quality, /grounding of claimed target identity, state, and behavior/);
  assert.match(quality, /actively search for counterexamples/);
  assert.match(quality, /Validation, Track export, and CI check structure, not educational correctness/);
  assert.match(quality, /MUST NOT report educational-quality PASS without a semantic review/);
  assert.match(quality, /environment-dependent behavior that was not verified/);
});

test('weekly quiz quality caps item count and favors quickly answered formats', async () => {
  const quality = await readRule('weekly-quiz/quality');
  assert.match(quality, /weekly quizzes MUST contain no more than 4 questions/i);
  assert.match(quality, /choice and cloze questions SHOULD be the default formats/i);
  assert.match(quality, /descriptive questions MAY be used when they can be answered quickly/i);
  assert.match(quality, /questions requiring extended written responses MUST NOT be used/i);
  assert.match(quality, /30-60 seconds/);
  assert.match(quality, /3-7 minute duration window/);
});

test('weekly quiz reuse follows current quality and permits direct improvement', async () => {
  const quality = await readRule('weekly-quiz/quality');
  assert.match(quality, /current quiz quality standards MUST take priority over past quiz practice/i);
  assert.match(quality, /Apply this reuse order when creating or revising a weekly quiz/);
  assert.match(quality, /reuse.*unchanged.*when.*current quality standards/i);
  assert.match(quality, /directly revise.*existing question.*when.*revision.*meet.*current quality standards/i);
  assert.match(quality, /create.*new question.*when.*no suitable existing question.*or revision would not make it suitable/i);
  assert.match(quality, /question that has appeared before MAY be reused/i);
  assert.match(quality, /same current quality standards MUST apply to new and revised questions/i);
  assert.doesNotMatch(quality, /match past (?:question )?trends|follow past (?:quiz )?formats|match past difficulty/i);
  assert.doesNotMatch(quality, /check (?:whether|if) (?:the )?question has been used before|review (?:past )?(?:attempt|answer|use) history/i);
});

test('weekly quiz reuse does not protect past assessments or require derivative files', async () => {
  const authoring = await readRule('course-exams/question-authoring');
  const weeklyQuizRules = authoring.split(/- When creating course exam questions/)[0];
  assert.match(weeklyQuizRules, /search.*existing.*question-bank\/quizzes/i);
  assert.doesNotMatch(weeklyQuizRules, /Do not modify an existing question-bank question.*past assessment/i);
  assert.doesNotMatch(weeklyQuizRules, /same learners have already answered.*avoid repeating/i);
  assert.doesNotMatch(weeklyQuizRules, /prefer a derived version/i);
  assert.doesNotMatch(weeklyQuizRules, /derived question file (?:MUST|is required)/i);
  assert.doesNotMatch(weeklyQuizRules, /past assessment.*protect|protect.*past assessment/i);
  assert.match(authoring, /Preparation questions MUST keep the same assessed skill and the same `## Scoring` bullet list/);
  assert.match(authoring, /The `## Scoring` bullet list carries no inline points/);
  assert.match(authoring, /For midterm exams in this course context, use 20 points/);
  assert.match(authoring, /For regular term exams in this course context, use 80 points/);
});

test('submission question and manifest requirements remain unchanged', async () => {
  const format = await readRule('course-exams/markdown-qti-format');
  assert.match(format, /Submission questions MUST NOT contain `## Scoring`/i);
  assert.match(format, /Submission manifest items MUST NOT contain `points`/i);
  assert.match(format, /Submission manifests MUST contain `time_limit_seconds`/i);
});

test('weekly quiz grounding, lesson scope, and semantic quality requirements remain', async () => {
  const quality = await readRule('weekly-quiz/quality');
  for (const preserved of [
    /identify the target week, matching lesson number, schedule entry, syllabus scope, and relevant taught material/,
    /check both the syllabus and the actual lesson materials/,
    /Syllabus entries MUST be used only to identify the lesson scope/,
    /MUST be grounded in actual taught material/,
    /If the actual materials cannot be found, the agent MUST report the missing source/,
    /answer uniqueness, answer-format clarity, plausible distractors/,
    /semantic review of the affected questions/,
  ]) assert.match(quality, preserved);
});

test('weekly quiz quality and course-specific authoring rules have separate owners', async () => {
  const quality = await readRule('weekly-quiz/quality');
  const authoring = await readRule('course-exams/question-authoring');

  assert.match(quality, /A weekly quiz for `wXX` MUST assess the content of lesson `XX`/);
  assert.match(quality, /Apply this reuse order when creating or revising a weekly quiz/);
  assert.match(quality, /MUST contain no more than 4 questions/);
  assert.match(quality, /Current quiz quality standards MUST take priority/);
  assert.doesNotMatch(quality, /Searching the question bank exists to find suitable questions for reuse/);

  assert.match(authoring, /search the owning course's existing `question-bank\/quizzes\/`/);
  assert.match(authoring, /The system-derived title of a weekly quiz/);
  assert.match(authoring, /<year> <official course name> 第XX回小テスト/);
  assert.doesNotMatch(authoring, /MUST assess lesson `XX`/);
  assert.doesNotMatch(authoring, /weekly-quiz\/quality\.md/);
  assert.doesNotMatch(authoring, /Apply this reuse order/);
  assert.doesNotMatch(authoring, /Directly revise a suitable existing question/);
  assert.doesNotMatch(authoring, /learner attempts|answer history|past assessment impact/i);
  assert.doesNotMatch(authoring, /derived question file/i);

  assert.match(authoring, /For midterm exams in this course context, use 20 points/);
  assert.match(authoring, /For regular term exams in this course context, use 80 points/);
  assert.match(authoring, /Preparation questions MUST keep the same assessed skill and the same `## Scoring` bullet list/);
});

const overclaimedCourseRules = [
  /always use current state.{0,100}(?:need|problem).{0,80}concept.{0,60}use/i,
  /cumulative presentation (?:is|has been proven|is proven to be) optimal/i,
  /all feedback must explain why/i,
  /all reflection must be required/i,
  /animation (?:alone|by itself) is sufficient/i,
  /shorter text is always better/i,
];

const assertNoCourseAuthoringOverclaims = (authoring) => {
  for (const claim of overclaimedCourseRules) assert.doesNotMatch(authoring, claim);
};

test('course rules keep optional presentation separate from Unit evidence', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /Section `goal` is optional.*at every depth/);
  assert.match(authoring, /zero or more `<Hint>` blocks, then exactly one `<Answer>`/);
  assert.match(authoring, /not require Section-local closure/);
  assert.match(authoring, /Define each Unit exactly once.*learning-units.yaml/);
  for (const obsolete of [
    /top-level.*MUST declare goal/i,
    /one or more `<Hint>`/,
    /MUST.*`### 演習N`/,
    /goal-first ordering/,
  ]) assert.doesNotMatch(authoring, obsolete);
});

test('course purpose is normative and support follows the learner', async () => {
  const purpose = await readRule('education/course-purpose');
  const authoring = await readRule('course-docs/authoring');
  assert.match(purpose, /normative educational purpose/);
  assert.match(purpose, /value judgment/);
  assert.match(purpose, /not.*unique educational purpose established by empirical research/);
  assert.match(purpose, /Do not equate enjoyment with ease/);
  assert.doesNotMatch(purpose, /happiness is the highest-level goal/);
  assert.match(authoring, /guidance minimization is not an objective/);
  assert.match(authoring, /do not impose a fixed local sequence for doing so/);
  assert.match(authoring, /accidental difficulty/);
});

test('orientation is useful and result withholding is limited to intended retrieval or generation', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /concrete value to the current activity, structure, or decision/);
  assert.match(authoring, /guaranteed course sequence/);
  assert.match(authoring, /canonical Unit objective/);
  assert.match(authoring, /name-only list is not pre-training/);
  assert.match(authoring, /term may appear in orientation or a heading before it is explained/);
  assert.match(authoring, /task is intended to elicit retrieval or learner generation/);
  assert.match(authoring, /MUST NOT reveal the target response or a decisive cue/);
  assert.match(authoring, /does not prescribe withholding answers in other task types/);
  assert.match(authoring, /no actionable preparation, re-entry, or recovery value/);
  assert.match(authoring, /This review does not reject objectives or advance organizers/);
  assert.doesNotMatch(authoring, /fully guided action\/code → observable result → explanation/);
});

test('task assistance permits taught information and concise useful feedback', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /first Hint SHOULD avoid unnecessarily revealing the answer immediately/);
  assert.match(authoring, /Multiple Hints MAY become progressively stronger or more explicit/);
  assert.match(authoring, /Hints SHOULD default to material already covered/);
  assert.match(authoring, /Hints MAY explicitly teach new information/);
  assert.match(authoring, /MUST NOT require unfamiliar information as already known without explaining it/);
  assert.match(authoring, /Answers MUST provide feedback that lets learners understand correctness/);
  assert.match(authoring, /Answers MAY be concise for simple, self-explanatory tasks when additional explanation adds no learning value/);
  assert.doesNotMatch(authoring, /MUST use material already covered/);
  assert.doesNotMatch(authoring, /Answers MUST explain why they are correct/);
});

test('course cold-read checks learner-action consistency without exact-word matching', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /heading, its immediate explanation, the task statement, and relevant UI cues/);
  assert.match(authoring, /Treat a mismatch as a learner-facing defect/);
  assert.match(authoring, /Natural paraphrases are fine/);
  assert.match(authoring, /Multiple actions are fine when their order is explicit/);
  assert.match(authoring, /この見出しを読んで learner が予想する次の行動と、実際に次に要求される行動は一致しているか/);
  assert.match(authoring, /not a directly tested rule about particular verb pairs/);
  assert.doesNotMatch(authoring, /MUST use the same (word|verb)/i);
});

test('course cold-read reviews local continuity without fixed sequence heuristics', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /sequence \/ discourse continuity as a broader cold-read question than learner-action consistency/);
  assert.match(authoring, /novice-oriented initial instruction/);
  for (const question of [
    /なぜ今この話/,
    /新しい概念・道具・操作は、その必要性が生じてから導入されているか/,
    /見出しだけ先に読んだとき、learner state より先の結論へ飛んでいないか/,
    /前の結果 → 次の説明・操作の因果や目的が自然につながっているか/
  ]) assert.match(authoring, question);
  assert.match(authoring, /Preserve intentional inference in retrieval and problem-solving activities/);
  assert.match(authoring, /do not impose this as a universal high-coherence rule for learners with substantial prior knowledge/);
  assert.match(authoring, /needed for a later QuickCheck or operation on the main instructional path/);
  assert.match(authoring, /mutually dependent operations, results, and explanations close enough to integrate/);
  assert.doesNotMatch(authoring, /concrete need → example operation → result check/);
  assert.doesNotMatch(authoring, /operation → result check → generalization/);
});


test('course rules separate research provenance from local contracts and unresolved choices', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /`R` — supported.*multiple independent studies or research syntheses/);
  assert.match(authoring, /`S` — a multi-study research synthesis/);
  assert.match(authoring, /`L` — a local, normative, product, authoring, or platform decision/);
  assert.match(authoring, /`U` — unresolved by the available research/);
  assert.match(authoring, /Do not promote a claim to `R` or `S` by combining one research result with unaudited design intuition/);
  assert.match(authoring, /For the local Course Docs `phase="transfer"`/);
  assert.match(authoring, /not a universal scientific definition of transfer/);
  assert.match(authoring, /Do not infer an exact colour, border, radius, or size from signaling research/);
});

test('new learner guidance keeps research claims bounded and local choices explicit', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /current\/known state → need\/problem → new concept → use/);
  assert.match(authoring, /local sequencing heuristic, not a research-established or universally optimal order/);
  assert.match(authoring, /Learner-facing prompts MUST make clear what content is being asked about, what action or answer is required, and the expected response form/);
  assert.match(authoring, /Japanese-copy checks and option phrasing are local Course Docs conventions/);
  assert.match(authoring, /complete semantic sentence over only the inserted fragment/);
  assert.match(authoring, /In responsive layouts, do not use viewport-dependent positions as the sole identifier/);
  assert.match(authoring, /Prediction\/prequestion activities SHOULD present the object, code, or content clearly and ask for a concrete result or relation immediately about to be learned/);
  assert.match(authoring, /After an attempt, give concrete, task-focused feedback about the actual outcome or relation/);
  assert.match(authoring, /Prequestion benefits apply to tested content, not automatically to unrelated content/);
  assert.match(authoring, /When self-explanation is useful, scaffold toward a causal or relational idea instead of assuming a generic “Why\?” is best/);
  assert.match(authoring, /For reflection that is not semantically assessed, do not create a false correctness gate/);
  assert.match(authoring, /When learners connect code, explanation, interface, diagram, or rendered output, explicitly support mapping among corresponding elements/);
  assert.match(authoring, /Divide material at meaningful semantic or causal boundaries rather than by arbitrary screen-sized chunks/);
  assert.match(authoring, /Treat cumulative presentation as a strong, research-constrained candidate, not a universal or uniquely optimal pattern/);
  assert.match(authoring, /newly revealed instructional content SHOULD normally appear at or after its trigger\/current reading position/);
  assert.match(authoring, /do not rely on transient motion alone/);
  assert.match(authoring, /For visible learner-facing prose, ask whether each sentence changes understanding, a decision, the next action, the causal model, error recovery, or needed orientation\/accessibility/);
  assert.match(authoring, /For a single-line learner response with one confirm\/apply action, prefer native form semantics/);
  assert.match(authoring, /Enter used to confirm Japanese, Chinese, or Korean IME composition must not prematurely submit the response/);
});

test('new learner guidance preserves retrieval, prior-knowledge, and accessibility boundaries', async () => {
  const authoring = await readRule('course-docs/authoring');
  assert.match(authoring, /task is intended to elicit retrieval or learner generation/);
  assert.match(authoring, /does not prescribe withholding answers in other task types/);
  assert.match(authoring, /Preserve intentional inference in retrieval and problem-solving activities/);
  assert.match(authoring, /do not impose this as a universal high-coherence rule for learners with substantial prior knowledge/);
  assert.match(authoring, /Applying this evidence to exact Course Docs cut points or separating simultaneous changes is a local design decision/);
  assert.match(authoring, /Exact tabs, accordions, compaction\/collapse, and layout are local implementation choices/);
  assert.match(authoring, /In responsive layouts, do not use viewport-dependent positions as the sole identifier/);
  assert.match(authoring, /This coherence\/redundancy test is an S synthesis, not “shorter is always better”/);
  assert.match(authoring, /Do not mechanically treat a visual result plus concise text mapping or accessibility equivalent as gratuitous duplication/);
  assert.match(authoring, /do not rely on transient motion alone/);
  assert.match(authoring, /retrieval or generation before the learner's first attempt/);
  assert.match(authoring, /Do not generalize this rule to multiline textareas or standard checkbox\/radio interactions/);
  assert.match(authoring, /account for composition/);
  assertNoCourseAuthoringOverclaims(authoring);
});

test('overclaim guard rejects unsafe research and interaction generalizations', async () => {
  const authoring = await readRule('course-docs/authoring');
  const invalidClaims = [
    'Always use current state → problem → concept → use.',
    'Cumulative presentation is optimal.',
    'All feedback must explain why.',
    'All reflection must be required.',
    'Animation alone is sufficient.',
    'Shorter text is always better.',
  ];
  for (const claim of invalidClaims) {
    assert.throws(
      () => assertNoCourseAuthoringOverclaims(`${authoring} ${claim}`),
      (error) => error instanceof assert.AssertionError,
    );
  }
});
