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

const extractProcessLifecycleSection = (content) => {
  const normalized = content.replace(/\r\n/gu, '\n');
  return normalized.split('## Process lifecycle safety\n')[1]?.split('\n## ')[0];
};

const extractWindowsSandboxSection = (content) => {
  const normalized = content.replace(/\r\n/gu, '\n');
  return normalized.split('## Windows sandbox and permission failures\n')[1]?.split('\n## ')[0];
};

test('process lifecycle section extraction works with LF and CRLF', () => {
  const sample = '## Before\n## Process lifecycle safety\n- Keep running\n## After\n';
  assert.equal(extractProcessLifecycleSection(sample), '- Keep running');
  assert.equal(extractProcessLifecycleSection(sample.replace(/\n/gu, '\r\n')), '- Keep running');
});

test('process lifecycle safety protects pre-existing and managed processes', async () => {
  const content = await readFile(path.join(globalRulesPath, 'command-execution.md'), 'utf8');
  const section = extractProcessLifecycleSection(content);

  assert.ok(section, 'command-execution.md must define Process lifecycle safety');
  for (const requirement of [
    'System diagnostics MUST be read-only by default.',
    'without explicit user\n  authorization for that specific action.',
    'A PID alone is insufficient;',
    'verify executable identity and creation time before termination.',
    'does not\n  make it an agent-owned disposable test process.',
    'Managed services MUST use their official lifecycle interface',
    'Force termination requires separate\n  explicit authorization',
    'broad process-name matching, unverified PID lists, or',
    'leave the\n  process running and report the uncertainty.',
  ]) assert.ok(section.includes(requirement), `missing process lifecycle requirement: ${requirement}`);
});

test('general OS and sandbox permission failures use one approved retry', async () => {
  const content = await readFile(path.join(globalRulesPath, 'command-execution.md'), 'utf8');
  const section = content.split('## General execution rules\n')[1]?.split('\n## ')[0];

  assert.ok(section, 'command-execution.md must define general execution rules');
  const normalizedSection = section.replace(/\s+/gu, ' ');
  for (const [requirement, pattern] of [
    ['EPERM and EACCES', /`EPERM`.*`EACCES`/u],
    ['filesystem and Git permission operations', /read\/write, create, rename, install, or Git operations/u],
    ['target and ownership checks', /verify the target, ownership, active conflicts, and side effects/u],
    ['same operation, one approved retry', /retry the same failed command or operation once through the approved sandbox or host route/u],
    ['no retry for HTTP authorization failures', /Do not treat HTTP 401\/403, authentication failures, timeouts, process locks, or configuration errors as OS permission failures/u],
    ['preserve approval gates', /Preserve other approval gates and prohibitions/u],
    ['report unresolved failures', /If the approved retry is unavailable or refused, or fails without evidence that OS administrator privileges are required, report and continue safe diagnosis.*If the administrator retry is unavailable, refused, or fails, do the same/u],
    ['do not overstate verification', /Do not claim full verification unless all required checks ran/u],
  ]) assert.match(normalizedSection, pattern, `missing ${requirement} requirement`);

  const privilegeSection = content.split('## Privilege elevation\n')[1]?.split('\n## ')[0];
  assert.ok(privilegeSection, 'command-execution.md must define privilege elevation');
  const normalizedPrivilegeSection = privilegeSection.replace(/\s+/gu, ' ');
  for (const [requirement, pattern] of [
    ['OS admin only after approved retry requires it', /only after the approved sandbox or host retry still fails because the operation genuinely requires those privileges/u],
    ['authorized sudo and Windows administrator route', /Use `sudo` or Windows administrator execution for the exact target with narrow side effects/u],
    ['honor existing explicit authorization without reprompting', /when the request or existing standing authorization permits it.*Do not ask again when that authorization is explicit/u],
    ['no broad security shortcut', /Do not use broad security changes or disable sandbox protections as a shortcut/u],
  ]) assert.match(normalizedPrivilegeSection, pattern, `missing ${requirement} requirement`);
  assert.doesNotMatch(normalizedPrivilegeSection, /Do not .*`sudo`|Do not .*Windows administrator/iu, 'genuine OS-admin execution must not be categorically prohibited');
});

test('Windows sandbox permission guidance preserves the reviewed junction procedure and assertions', async () => {
  const content = await readFile(path.join(globalRulesPath, 'command-execution.md'), 'utf8');
  const section = extractWindowsSandboxSection(content);

  assert.ok(section, 'command-execution.md must define Windows sandbox and permission failures');
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
      /`fs\.symlinkSync\(target,\s*link,\s*'junction'\)` creates a directory junction; it is not a standard file or directory symbolic-link privilege probe/iu,
    ],
    [
      'junction EPERM as MXC signature',
      /Under MXC, `EPERM` from this call is a known MXC capability signature/iu,
    ],
    [
      'no host privilege classification before native approval',
      /Do not classify it as host Developer Mode or Windows OS-level symbolic-link denial before trying one native approval/iu,
    ],
    ['MXC-specific escalation scope', /For this MXC-specific signature/iu],
    ['native sandbox escalation', /Codex native sandbox\s+escalation/iu],
    ['version-equivalent escalation option', /`require_escalated` or its version-equivalent/iu],
    ['same already-in-scope command', /same already-in-scope command/iu],
    ['same working directory', /same working directory/iu],
    [
      'original full test command escalation',
      /If the failure comes from a test run .* the command to escalate is the original full test command in that same working directory, preserving the test invocation/iu,
    ],
    [
      'no extracted link-only probe',
      /do not replace it with a manually extracted junction or link-only probe/iu,
    ],
    ['native require_escalated request', /Make only one escalation request, using native `require_escalated`/iu],
    ['brief justification', /brief justification/iu],
    ['single escalation request', /Make only one escalation request/iu],
    ['configured approval reviewer', /existing configured approval reviewer/iu],
    ['auto-review when available', /`auto_review` when available/iu],
    ['no approval reviewer bypass', /never bypass that reviewer/iu],
    ['one full rerun after approval', /If the request is approved, rerun the same full command once/iu],
    ['full test suite rerun', /including the whole test suite when the command was a test run/iu],
    ['actual exit code and all assertion checks', /verify its actual exit code and all assertions/iu],
    ['refusal and unsupported handling', /If escalation is refused, unsupported, or the command fails again/iu],
    ['no repeated escalation or unchanged diagnosis', /do not request escalation again or repeat diagnosis against unchanged evidence/iu],
    ['unresolved coverage reporting', /Report the unresolved verification coverage/iu],
    ['continue independent safe work', /continue independent safe work/iu],
    ['preservation of tests and assertions', /Preserve every test and assertion/iu],
    ['no disabled tests', /never weaken or disable them/iu],
    ['skips are not passes', /A skipped test is not a pass/iu],
    ['separate OS-level symlink capability case', /genuine Windows OS-level symbolic-link creation failures separately/iu],
    ['Developer Mode example', /Developer Mode/u],
    ['OS-admin execution remains scoped', /Keep any authorized OS administrator execution scoped as described in Privilege elevation/iu],
    ['no legacy elevated Windows sandbox', /legacy `elevated` Windows sandbox/iu],
    ['no danger-full-access', /`danger-full-access`/u],
    ['no global sandbox disablement', /global sandbox disablement/iu],
    ['no broad configuration or security shortcut', /broad configuration or system security changes as a shortcut/iu],
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
