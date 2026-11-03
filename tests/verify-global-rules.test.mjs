import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const globalRulesPath = path.join(repoRoot, 'rules', 'global');
const profilesPath = path.join(repoRoot, 'agent-profiles.json');

function normalizeNewlines(content) {
  return content.replace(/\r\n/gu, '\n');
}

function extractMarkdownSection(content, heading) {
  const normalized = normalizeNewlines(content);
  return normalized.split(`${heading}\n`)[1]?.split('\n## ')[0];
}

function extractJobSection(workflow, jobName) {
  const lines = workflow.split(/\r?\n/u);
  const jobsIndex = lines.findIndex((line) => line === 'jobs:');
  assert.notEqual(jobsIndex, -1, 'workflow must define jobs');

  const jobsEnd = lines.findIndex((line, index) =>
    index > jobsIndex && line.length > 0 && !/^\s/u.test(line));
  const sectionEnd = jobsEnd === -1 ? lines.length : jobsEnd;
  const jobHeader = `  ${jobName}:`;
  const jobStart = lines.findIndex((line, index) =>
    index > jobsIndex && index < sectionEnd && line === jobHeader);
  assert.notEqual(jobStart, -1, `workflow must define the ${jobName} job`);

  const nextJob = lines.findIndex((line, index) =>
    index > jobStart && index < sectionEnd && /^  [a-z0-9_-]+:\s*$/iu.test(line));
  return lines.slice(jobStart, nextJob === -1 ? sectionEnd : nextJob).join('\n');
}

function assertComposeVerificationJob(job, expectedRef) {
  assert.match(job, /^    runs-on: windows-latest$/mu);
  assert.match(job, /^    timeout-minutes: 10$/mu);
  assert.match(job, /^          node-version: "24"$/mu);
  assert.match(job, /^        uses: actions\/checkout@v7$/mu);
  assert.match(job, /^        uses: actions\/setup-node@v7$/mu);
  assert.match(job, /^          repository: metyatech\/compose-agentsmd$/mu);
  assert.ok(
    job.split(/\r?\n/u).includes(`          ref: ${expectedRef}`),
    `expected compose-agentsmd ref ${expectedRef}`,
  );
  assert.match(job, /^          path: \.ci\/compose-agentsmd$/mu);
  assert.match(job, /^        working-directory: \.ci\/compose-agentsmd$/mu);
  assert.match(job, /^        run: npm ci$/mu);
  assert.match(job, /^        run: npm run build$/mu);
  assert.match(job, /^        run: npm link$/mu);
  assert.match(job, /^        run: pwsh -NoProfile -File tools\/verify\.ps1$/mu);
}

test('retired tracking tools are absent from active global rules', async () => {
  await assert.rejects(stat(path.join(globalRulesPath, 'persistent-tracking.md')), {
    code: 'ENOENT',
  });

  const ruleFiles = (await readdir(globalRulesPath))
    .filter((file) => file.endsWith('.md'));
  for (const file of ruleFiles) {
    const content = await readFile(path.join(globalRulesPath, file), 'utf8');
    assert.equal(content.includes('task-tracker'), false, `${file} references task-tracker`);
    assert.equal(content.includes('thread-inbox'), false, `${file} references thread-inbox`);
  }
});

test('GitHub Actions billing blocks require direct evidence and passing local gates', async () => {
  const rules = await readFile(path.join(globalRulesPath, 'quality-and-verification.md'), 'utf8');
  const section = extractMarkdownSection(rules, '## GitHub Actions billing blocks');

  assert.ok(section, 'quality-and-verification.md must define GitHub Actions billing blocks');
  assertBillingSection(section);
});

function assertBillingSection(section) {
  const normalized = section.replace(/\s+/gu, ' ');
  for (const [requirement, pattern] of [
    ['billing or spending-limit annotation', /annotation explicitly stating failed account payments or a spending limit/u],
    ['unassigned runner and zero steps', /`runner_id=0`, and zero steps/u],
    ['explicit unrun classification', /`未実行（課金制限）`/u],
    ['local verification must pass', /repo-standard local gates and applicable tests\/format\/lint\/build pass/u],
    ['CI unverified status', /record CI unrun\/unverified/u],
    ['per-job decisions', /Judge jobs independently/u],
    ['fail-closed uncertainty', /Missing\/empty annotations, API\/tool errors, timeouts, assigned runners, executed steps, unclear causes, test failures, or failed\/unrun local gates block/u],
    ['no skipped or weakened checks', /Never skip checks or weaken tests\/assertions/u],
    ['no billing or workflow changes', /Do not change billing settings\/workflows\/branch protection\/runner config/u],
    ['no pointless billing rerun', /or rerun just to retry billing/u],
    ['branch protection is not bypassed', /do not bypass it; stop and report/u],
    ['diagnostic retrieves jobs and annotations', /repos\/\$repo\/actions\/runs\/\$run\/jobs.*repos\/\$repo\/check-runs\/\$id\/annotations/u],
  ]) assert.match(normalized, pattern, `missing ${requirement} requirement`);
}

const extractProcessLifecycleSection = (content) => extractMarkdownSection(content, '## Processes');

const extractWindowsSandboxSection = (content) => extractMarkdownSection(content, '## Sandbox');

test('Markdown section extraction handles LF and CRLF headings and boundaries', () => {
  for (const [heading, nextHeading, expected] of [
    ['# Commands', '## Processes', '- Run the command'],
    ['## GitHub Actions billing blocks', '## Runtime verification', '- Require direct evidence'],
  ]) {
    const lfDocument = `${heading}\n${expected}\n${nextHeading}\n- outside the section\n`;
    const crlfDocument = lfDocument.replace(/\n/gu, '\r\n');

    const lfSection = extractMarkdownSection(lfDocument, heading);
    const crlfSection = extractMarkdownSection(crlfDocument, heading);
    assert.ok(lfSection, `${heading} must produce a nonempty LF section`);
    assert.ok(crlfSection, `${heading} must produce a nonempty CRLF section`);
    assert.equal(lfSection, expected);
    assert.equal(crlfSection, lfSection);
  }

  for (const heading of ['# Commands', '## GitHub Actions billing blocks']) {
    const document = `${heading}\n- present policy\n## Next section\n`;
    for (const text of [document, document.replace(/\n/gu, '\r\n')]) {
      assert.equal(extractMarkdownSection(text, `${heading} typo`), undefined);
      assert.equal(extractMarkdownSection(text, '## Missing section'), undefined);
    }
  }
});

test('billing policy assertions still fail when a CRLF section loses a required statement', async () => {
  const content = await readFile(path.join(globalRulesPath, 'quality-and-verification.md'), 'utf8');
  const crlfContent = normalizeNewlines(content).replace(/\n/gu, '\r\n');
  const section = extractMarkdownSection(crlfContent, '## GitHub Actions billing blocks');

  assert.ok(section, 'quality-and-verification.md must define GitHub Actions billing blocks');
  assertBillingSection(section);
  const missingStatement = section.replace('Never skip checks or weaken tests/assertions.', '');
  assert.notEqual(missingStatement, section, 'fixture must remove a required policy statement');
  assert.throws(() => assertBillingSection(missingStatement), {
    name: 'AssertionError',
    message: /missing no skipped or weakened checks requirement/u,
  });
});

test('process lifecycle section extraction works with LF and CRLF', () => {
  const sample = '## Before\n## Processes\n- Keep running\n## After\n';
  assert.equal(extractProcessLifecycleSection(sample), '- Keep running');
  assert.equal(extractProcessLifecycleSection(sample.replace(/\n/gu, '\r\n')), '- Keep running');
});

test('process lifecycle safety protects pre-existing and managed processes', async () => {
  const content = await readFile(path.join(globalRulesPath, 'command-execution.md'), 'utf8');
  const section = extractProcessLifecycleSection(content);

  assert.ok(section, 'command-execution.md must define process safety');
  const normalizedSection = section.replace(/\s+/gu, ' ');
  for (const requirement of [
    'System diagnostics MUST be read-only by default.',
    'without explicit action-specific user authorization.',
    'Agent-started isolated temporary test fixtures MAY be cleaned without approval only with verified ownership/identity.',
    'A PID alone is insufficient;',
    'retain a process handle or verify executable identity and creation time before termination.',
    'verify executable identity and creation time before termination.',
    'Starting/discovering managed/shared daemons during diagnostics doesn\'t make them agent-owned disposable test processes.',
    'Managed services MUST use official lifecycle',
    'force termination requires separate explicit authorization after managed shutdown fails.',
    'broad process-name matches, unverified PIDs, or',
    'If ownership/identity is uncertain, the agent MUST leave it running and report why.',
  ]) assert.ok(normalizedSection.includes(requirement), `missing process lifecycle requirement: ${requirement}`);
});

test('OS administrator and sandbox permission failures use distinct routes', async () => {
  const content = await readFile(path.join(globalRulesPath, 'command-execution.md'), 'utf8');
  const section = extractMarkdownSection(content, '# Commands');

  assert.ok(section, 'command-execution.md must define general execution rules');
  const normalizedSection = section.replace(/\s+/gu, ' ');
  for (const [requirement, pattern] of [
    ['EPERM and EACCES', /`EPERM`.*`EACCES`/u],
    ['filesystem and Git permission operations', /denied file\/Git operations \(read\/write, create, rename, install\)/u],
    ['target and ownership checks', /verify target, ownership, conflicts,\s+side effects/u],
    ['ambiguous failures use one approved retry', /If ambiguous, retry same operation once via approved sandbox\/host/u],
    ['intrinsic OS-admin bypasses futile sandbox retry', /for clearly OS-admin-only failures, use scoped admin/u],
    ['known MXC follows native route', /Known MXC signatures require native approval first/u],
    ['no retry for HTTP authentication failures', /HTTP 401\/403, auth, timeouts, locks, and config errors aren't OS permission failures/u],
    ['preserve approval gates', /Preserve approval gates/u],
    ['report unresolved failures', /report failed\/refused\/unavailable retries/u],
    ['do not overstate verification', /claim full verification only after all required checks pass/iu],
  ]) assert.match(normalizedSection, pattern, `missing ${requirement} requirement`);

  const privilegeSection = extractMarkdownSection(content, '## Privilege');
  assert.ok(privilegeSection, 'command-execution.md must define privilege elevation');
  const normalizedPrivilegeSection = privilegeSection.replace(/\s+/gu, ' ');
  for (const [requirement, pattern] of [
    ['intrinsic OS-admin route permits direct sudo', /For clearly in-scope operations requiring OS-admin rights, MAY run `sudo` directly/u],
    ['no separate per-command authorization or confirmation', /without separate per-command authorization or confirmation/u],
    ['Windows administrator route is narrow', /on Windows use the narrowest available admin execution per operation/u],
    ['standing permission does not expand scope', /This doesn't expand scope, authorize destructive or hard-to-reverse work, override explicit prohibitions, or allow broad security changes/u],
    ['ambiguous failure keeps sandbox or host retry first', /Retry ambiguous denials via approved sandbox\/host/u],
    ['MXC keeps native sandbox approval first', /for MXC use native Codex approval, not `sudo`/u],
    ['no broad security shortcut', /Never disable sandbox protections as a shortcut/u],
  ]) assert.match(normalizedPrivilegeSection, pattern, `missing ${requirement} requirement`);
  assert.doesNotMatch(normalizedPrivilegeSection, /(?:^|[.!?]\s+)Do not (?:invoke|use) `sudo`(?:[.!?]| under any circumstances)/iu, 'genuine OS-admin execution must not be categorically prohibited');
});

test('Windows sandbox permission guidance preserves the reviewed junction procedure and assertions', async () => {
  const content = await readFile(path.join(globalRulesPath, 'command-execution.md'), 'utf8');
  const section = extractWindowsSandboxSection(content);

  assert.ok(section, 'command-execution.md must define sandbox failures');
  const normalizedSection = section.replace(/\s+/gu, ' ');
  for (const [requirement, pattern] of [
    ['MXC sandbox signature', /\bMXC\b/u],
    ['permission error codes', /\bEPERM\b/u],
    ['access error codes', /\bEACCES\b/u],
    ['WinError 5', /WinError\s*5/iu],
    ['Junction creation', /\bJunction\b/iu],
    ['hard-link creation', /hard link/iu],
    ['atomic file replacement', /atomically replacing a file/iu],
    ['temporary path class', /%TEMP%/u],
    ['local application data path class', /%LOCALAPPDATA%/u],
    [
      'Node junction API classification',
      /`fs\.symlinkSync\(target,\s*link,\s*'junction'\)` creates a directory junction, not a symlink privilege probe/iu,
    ],
    [
      'junction EPERM as MXC signature',
      /MXC `EPERM` is a known capability signature/iu,
    ],
    [
      'no host privilege classification before native approval',
      /Do not attribute it to Developer Mode\/OS denial before native approval/iu,
    ],
    ['MXC-specific escalation scope', /For this MXC-specific signature/iu],
    ['native sandbox escalation', /Codex native sandbox escalation/iu],
    ['version-equivalent escalation option', /`require_escalated` or equivalent/iu],
    ['same in-scope command and directory', /same in-scope command\/directory/iu],
    [
      'original full test command escalation',
      /For test failures, escalate the original full test command/iu,
    ],
    [
      'no extracted link-only probe',
      /never a link-only probe/iu,
    ],
    ['native require_escalated request', /one Codex native sandbox escalation \(`require_escalated` or equivalent\)/iu],
    ['brief justification', /with a brief reason/iu],
    ['single escalation request', /make one Codex native sandbox escalation/iu],
    ['configured approval reviewer', /configured reviewer/iu],
    ['auto-review when available', /`auto_review` when available/iu],
    ['no approval reviewer bypass', /never bypass it/iu],
    ['one full rerun after approval', /If approved, rerun the same full command once/iu],
    ['full test suite rerun', /including the whole suite for test commands/iu],
    ['actual exit code and all assertion checks', /verify its exit code and every assertion/iu],
    ['partial results never count as success', /Do not infer success from partial results/iu],
    ['refusal and unsupported handling', /If refused, unavailable, or failing/iu],
    ['no repeated escalation or unchanged diagnosis', /don't repeat escalation\/unchanged diagnosis/iu],
    ['unresolved coverage reporting', /report uncovered verification/iu],
    ['continue independent safe work', /continue independent safe work/iu],
    ['preservation of all tests and assertions', /Preserve all tests\/assertions/iu],
    ['no weakening or disabling tests or assertions', /never weaken\/disable them/iu],
    ['skipped tests are not passes', /Skips aren't passes/iu],
    ['separate OS-level symlink capability case', /Classify genuine OS symlink failures as Windows capability\/privilege issues.*distinct from MXC/iu],
    ['Developer Mode example', /Developer Mode/u],
    ['OS-admin execution remains scoped', /scope admin actions/iu],
    ['no legacy elevated Windows sandbox', /legacy `elevated` Windows sandbox/iu],
    ['no danger-full-access', /`danger-full-access`/u],
    ['no global sandbox disablement', /global sandbox disablement/iu],
    ['no broad configuration or security shortcut', /broad security\/config changes/iu],
  ]) assert.match(normalizedSection, pattern, `missing ${requirement} requirement`);
  assert.doesNotMatch(normalizedSection, /legacy `elevated` sandbox/iu, 'obsolete legacy elevated comparison must not return');
  assert.doesNotMatch(normalizedSection, /Windows CI/iu, 'obsolete Windows CI workaround must not return');
});

test('mixed Node and Python repositories exclude agent tooling rules', async () => {
  const { profiles } = JSON.parse(await readFile(profilesPath, 'utf8'));

  assert.deepEqual(profiles['node-python']?.domains, ['node', 'python']);
  assert.equal(profiles['node-python'].domains.includes('agent-tooling'), false);
});

test('delegation rules do not use retired tier labels', async () => {
  const content = await readFile(path.join(globalRulesPath, 'sub-agent-delegation.md'), 'utf8');

  assert.doesNotMatch(content, /\bLight work\b/u);
  assert.doesNotMatch(content, /\bStandard(?: work| implementation| review)\b/u);
  assert.doesNotMatch(content, /\bHeavy(?: work| implementation| review)\b/u);
  assert.doesNotMatch(content, /\btask is Heavy\b/u);
});

test('global rules stay within the hard 8000-token budget', async () => {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rules-budget-'));
  try {
    await writeFile(path.join(projectRoot, 'agent-ruleset.json'), JSON.stringify({
      sources: [repoRoot],
      profile: 'agent-rules',
      global: true,
    }));

    const result = spawnSync('compose-agentsmd', [
      '--root', projectRoot,
      '--dry-run',
      '--json',
    ], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      shell: process.platform === 'win32',
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    const report = JSON.parse(result.stdout);
    assert.equal(
      report.budget.totalExceeded,
      false,
      `global rules exceed hard budget: ${report.budget.totalTokens}/8000`,
    );
    assert.ok(
      report.budget.totalTokens <= 8000,
      `global rules exceed hard budget: ${report.budget.totalTokens}/8000`,
    );
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test('canonical verification uses the shared PowerShell verifier', async () => {
  const config = await readFile(path.join(repoRoot, '.mwt', 'config.toml'), 'utf8');
  assert.match(config, /command\s*=\s*"pwsh -NoProfile -File tools\/verify\.ps1"/);
});

test('canonical verifier checks tests, pinned Markdown lint, then non-mutating composition', async () => {
  const verifierPath = path.join(repoRoot, 'tools', 'verify.ps1');
  const verifier = await readFile(verifierPath, 'utf8');
  const normalized = verifier.replace(/\s+/g, ' ');

  assert.match(verifier, /^\$ErrorActionPreference = 'Stop'$/mu);
  assert.match(normalized, /node --test .*verify-course-authoring\.test\.mjs .*verify-global-rules\.test\.mjs/);
  assert.match(normalized, /npx --yes markdownlint-cli@0\.49\.1/);
  for (const markdownPath of [
    "'rules/**/*.md'",
    'README.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'SECURITY.md',
    '--ignore node_modules',
  ]) assert.ok(verifier.includes(markdownPath), `missing markdownlint input: ${markdownPath}`);
  assert.match(normalized, /compose-agentsmd check --refresh --quiet/);
  assert.doesNotMatch(normalized, /npx --yes markdownlint-cli(?:\s|$)/);
  assert.doesNotMatch(verifier, /^\s*compose-agentsmd\s*$/mu);
  assert.equal((verifier.match(/\$LASTEXITCODE -ne 0/gu) ?? []).length, 3);
  assert.ok(normalized.indexOf('node --test') < normalized.indexOf('npx --yes markdownlint-cli@0.49.1'));
  assert.ok(normalized.indexOf('npx --yes markdownlint-cli@0.49.1') < normalized.indexOf('compose-agentsmd check'));
});

test('README documents the canonical verifier and its checks', async () => {
  const readme = await readFile(path.join(repoRoot, 'README.md'), 'utf8');
  assert.match(readme, /pwsh -NoProfile -File tools\/verify\.ps1/);
  assert.match(readme, /markdownlint-cli@0\.49\.1/);
  assert.match(readme, /non-mutating compose-agentsmd check/);
  assert.ok(readme.includes('command in [.mwt/config.toml]'));
  assert.match(readme, /and CI both use the same\s+canonical verifier/);
});

test('CI verifies a pinned compose release and current main compatibility', async () => {
  const workflowPath = path.join(repoRoot, '.github', 'workflows', 'ci.yml');
  const workflow = await readFile(workflowPath, 'utf8');

  assert.match(workflow, /^  push:\r?\n    branches:\r?\n      - main$/mu);
  assert.match(workflow, /^  pull_request:\s*$/mu);
  assert.match(workflow, /^permissions:\r?\n  contents: read$/mu);
  assert.doesNotMatch(workflow, /^  schedule:/mu);

  const canonicalJob = extractJobSection(workflow, 'verify');
  assertComposeVerificationJob(
    canonicalJob,
    'ade39fc513f02f7e84927074387a4bc7bc2a7011',
  );
  assert.match(canonicalJob, /^    name: Verify with pinned compose-agentsmd$/mu);
  assert.doesNotMatch(canonicalJob, /^\s+continue-on-error:\s*true$/mu);
  assert.doesNotMatch(canonicalJob, /^          ref: main$/mu);

  const compatibilityJob = extractJobSection(workflow, 'compatibility-compose-main');
  assertComposeVerificationJob(compatibilityJob, 'main');
  assert.match(compatibilityJob, /^    name: Compatibility with compose-agentsmd main$/mu);
  assert.match(compatibilityJob, /^    continue-on-error: true$/mu);
});
test('Git worktree placement rules forbid nested worktree directories', async () => {
  const rules = await readFile(path.join(globalRulesPath, 'command-execution.md'), 'utf8');
  assert.match(rules, /New Git worktrees MUST be outside every existing Git\s+working-tree root/u);
  assert.match(rules, /MUST NOT create or move a worktree into a repository's own directory/u);
  assert.match(rules, /canonical destination before `git worktree add`\s+or `git worktree move`/u);
});

test('task completion requires safe cleanup and reports blocked leftovers', async () => {
  const rules = await readFile(path.join(globalRulesPath, 'command-execution.md'), 'utf8');
  const normalizedRules = rules.replace(/\r\n/gu, '\n');
  const section = normalizedRules.split('## Git\n')[1]?.split('\n## ')[0];

  assert.ok(section, 'command-execution.md must define Git and identity rules');
  const normalized = section.replace(/\s+/gu, ' ');
  for (const [requirement, pattern] of [
    ['mandatory worktree, branch, and temp/prompt cleanup', /Task completion MUST remove task-owned temp worktrees, local\/remote task branches, and temp\/prompt files/u],
    ['ownership and unused state', /verifying ownership, unused and clean/u],
    ['clean and integrated state', /clean \(no uncommitted\/unmerged work\), integration\/commit\/push where relevant/u],
    ['active reference protection', /no active worker\/PR\/process references/u],
    ['dirty, shared, unowned, and active preservation', /Preserve dirty\/unmerged, shared, unowned, or active resources/u],
    ['itemized leftover reporting', /report each unsafe leftover and why/u],
    ['no false completion', /Unsafe leftovers prevent completion/u],
    ['active CGCL lock stops same-directory work', /On CGCL `lock_active` from another task-directory worker, stop: no wait, worker termination, or same-dir retry/u],
    ['lock recovery uses an isolated verified path', /distinct canonical path from a verified base/u],
    ['lock recovery preserves pending resources', /Preserve the original checkout, other worktrees\/workers, and pending changes/u],
    ['lock integration avoids force-push', /integrate without force-push/u],
    ['ambiguous work is never duplicated', /Retry only if work definitely never began; never duplicate ambiguous work/u],
    ['unavailable isolation is reported', /If isolation is unavailable, report it/u],
    ['worktree registration and directory verification', /verify directory and Git registration are gone/u],
    ['junction targets preserved', /Unlink only verified task-owned `node_modules` junctions\/symlinks, never targets/u],
    ['unexpected worktree content preserved', /remove empty remnants; preserve\/report unexpected content/u],
  ]) assert.match(normalized, pattern, `missing ${requirement} requirement`);

  const fullRules = normalizedRules.replace(/\s+/gu, ' ');
  assert.match(fullRules, /The agent MUST NOT terminate, force-kill, restart, or otherwise disrupt pre-existing processes/u);
  assert.match(fullRules, /one Codex native sandbox escalation \(`require_escalated` or equivalent\)/u);
  assert.match(fullRules, /never bypass it/u);
});

test('test isolation rules confine fallback and retry writes and protect real user state', async () => {
  const rules = await readFile(path.join(globalRulesPath, 'engineering-standards.md'), 'utf8');
  const normalizedRules = rules.replace(/\r\n/gu, '\n');
  const section = normalizedRules.split('## Automated test isolation and user-data protection\n')[1]?.split('\n## ')[0];

  assert.ok(section, 'engineering-standards.md must define test isolation');
  const normalized = section.replace(/\s+/gu, ' ');
  for (const [requirement, pattern] of [
    ['real user data and sensitive state protected', /Tests\/fixtures\/mocks MUST NOT mutate real user data\/config, credentials\/tokens, browser profiles, or auth\/session files/u],
    ['per-user defaults treated as real', /Per-user home\/app-data defaults are real until redirected to a test-owned path/u],
    ['unique test-owned root before writes', /Before any test write, inject a unique test-owned temp root/u],
    ['missing-file defaults included', /missing-file defaults/u],
    ['fallback and login/retry writes included', /fallback paths, login\/retry callbacks/u],
    ['resolved target validated before write', /Validate\s+resolved targets inside it BEFORE writing/u],
    ['mocked reads insufficient', /mocked reads don't stop callbacks writing to production defaults/u],
    ['shared environment races avoided', /For concurrent tests, prefer injected paths\/isolated subprocesses over shared home\/config changes/u],
    ['destructive tests require isolated targets', /isolate targets before destructive tests/u],
    ['fallback regression and unchanged state verified', /Add regression coverage for original fallback writes; verify user state unchanged/u],
    ['secrets and sensitive contents not exposed', /without exposing secrets or sensitive file contents/u],
  ]) assert.match(normalized, pattern, `missing ${requirement} requirement`);
});

test('documentation rule compression retains every reporting and authoring obligation', async () => {
  const rules = await readFile(path.join(globalRulesPath, 'writing-and-documentation.md'), 'utf8');
  const normalized = rules.replace(/\s+/gu, ' ');
  for (const [requirement, pattern] of [
    ['Japanese user replies by default', /Reply in Japanese unless requested otherwise/u],
    ['commit and push reporting tied to file changes', /Report commits\/pushes only if this turn changed files/u],
    ['new artifact explanation', /Explain new tools\/features\/artifacts' purpose, use, key capabilities/u],
    ['short user-focused progress updates', /Keep progress reports short\/user-focused/u],
    ['uninterrupted work and requested internals', /prefer long uninterrupted execution blocks; explain internals on request/u],
    ['no unsolicited command transcripts', /Omit command transcripts unless requested/u],
    ['end-of-task friction report', /Report unresolved technical\/environment issues at task end/u],
    ['developer-facing English', /Developer docs\/comments, commit messages, pull-request descriptions, and rule modules MUST be in English/u],
    ['complete README coverage', /Every repo MUST have a README: purpose, environments, setup\/usage\/development commands, required variables\/config, release\/deployment steps, companion doc links/u],
    ['affected documentation updated with behavior', /Assess doc impact; update all affected docs in the same change set to match behavior/u],
    ['no-op doc notes omitted', /omit no-op notes/iu],
    ['code conventions followed and every mismatch reported', /If docs conflict with code, follow code conventions and report each inconsistency/u],
    ['CLI parameter descriptions and examples', /CLI docs MUST describe every parameter and include an example invocation and an end-to-end example command/u],
    ['first-use and top-level CLI help', /`--help`\/`-h` MUST explain first use without external docs; top-level help MUST show workflows, shared flags, and `<tool> <command> -h` syntax/u],
    ['invalid CLI usage points to authoritative help', /Invalid usage\/unknown commands MUST point to authoritative help/u],
    ['documentation examples avoid personal paths', /Documentation examples MUST omit user-specific paths, fixed workspaces, drive letters, and personal data/u],
    ['repository-relative examples', /use repo-relative paths\/placeholders/u],
    ['findings reused and recorded without sensitive material', /Reuse findings before investigating\. Record conclusions, evidence, failed approaches, and unknowns in repo docs; omit secrets\/logs/u],
    ['relative Markdown links', /Local Markdown links MUST be relative to their document/u],
  ]) assert.match(normalized, pattern, `missing ${requirement} requirement`);
});

test('identity wording compression preserves repository authority and scope', async () => {
  const rules = await readFile(path.join(globalRulesPath, 'identity-and-scope.md'), 'utf8');
  const normalized = rules.replace(/\s+/gu, ' ');
  for (const [requirement, pattern] of [
    ['user identity', /human operator, "metyatech"/u],
    ['repository ownership definition', /metyatech-owned GitHub repo or one where metyatech has authoritative write permission/u],
    ['read-only ownership verification', /verify with `gh repo view --json owner,viewerPermission`/u],
    ['controlled GitHub/npm ownership scope', /`metyatech` controls GitHub user\/org, npm `@metyatech`, and `github\.com\/metyatech\/\*`/u],
    ['external identity default and evidence exception', /external metyatech references as user-controlled absent contrary direct evidence/u],
    ['identity uncertainty resolved with gh', /resolve via `gh` before acting/u],
    ['owned repository end-to-end authority', /agents MAY handle issues, PRs, default-branch pushes, releases, package publishing, and administration end-to-end/u],
    ['account-wide and repository lifecycle scope', /Account-wide scope covers all such repos and creation\/splitting\/deletion/u],
    ['default placement under user ownership', /Unless user specifies another owner, publish, clone, add submodules, or split under `metyatech` ownership/u],
    ['third-party explicit write request', /Third-party writes MUST have prior explicit per-repo requests, even with push access/u],
    ['ambiguous target verified before writing', /Ambiguous targets: confirm canonical repo from request purpose before writing/u],
    ['uncertain target kept isolated', /isolate work on a separate branch\/worktree until confirmed/u],
  ]) assert.match(normalized, pattern, `missing ${requirement} requirement`);
});
