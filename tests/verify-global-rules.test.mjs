import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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
  assert.ok(job.split(/\r?\n/u).includes(`          ref: ${expectedRef}`));
  assert.match(job, /^          path: \.ci\/compose-agentsmd$/mu);
  assert.match(job, /^        working-directory: \.ci\/compose-agentsmd$/mu);
  assert.match(job, /^        run: npm ci$/mu);
  assert.match(job, /^        run: npm run build$/mu);
  assert.match(job, /^        run: npm link$/mu);
  assert.match(job, /^        run: pwsh -NoProfile -File tools\/verify\.ps1$/mu);
}

async function composeCanonicalGlobalRulesReport() {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rules-budget-'));
  try {
    await writeFile(path.join(projectRoot, 'agent-ruleset.json'), JSON.stringify({
      sources: [repoRoot],
      profile: 'agent-rules',
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
    return JSON.parse(result.stdout);
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
}

function assertWithinHardTokenBudget(report) {
  assert.equal(report.budget.totalExceeded, false);
  assert.ok(report.budget.totalTokens <= 8000);
}

test('profile JSON maps mixed Node and Python projects to their machine-readable domains', async () => {
  const { profiles } = JSON.parse(await readFile(path.join(repoRoot, 'agent-profiles.json'), 'utf8'));
  assert.deepEqual(profiles['node-python']?.domains, ['node', 'python']);

  const invalidProfiles = structuredClone(profiles);
  invalidProfiles['node-python'].domains.push('agent-tooling');
  assert.throws(() => assert.deepEqual(invalidProfiles['node-python']?.domains, ['node', 'python']));
});

test('canonical ruleset selects the unchanged profile and outputs without a global option', async () => {
  const ruleset = JSON.parse(await readFile(path.join(repoRoot, 'agent-ruleset.json'), 'utf8'));

  assert.equal(Object.hasOwn(ruleset, 'global'), false);
  assert.deepEqual(ruleset, {
    sources: ['.'],
    profile: 'agent-rules',
    claude: {
      enabled: true,
      output: 'CLAUDE.md',
    },
    output: 'AGENTS.md',
  });
});

test('compose-agentsmd computes global rules within the hard 8000-token limit', async () => {
  const report = await composeCanonicalGlobalRulesReport();
  assertWithinHardTokenBudget(report);

  const overBudgetReport = { budget: { totalExceeded: true, totalTokens: 8001 } };
  assert.throws(() => assertWithinHardTokenBudget(overBudgetReport));
});

test('compose-agentsmd check-budget reports effective limits without writing files or invoking Git', async () => {
  const canonical = await composeCanonicalGlobalRulesReport();
  const rulesetPath = path.join(repoRoot, 'agent-ruleset.json');
  const ruleset = JSON.parse(await readFile(rulesetPath, 'utf8'));
  assert.equal(Object.hasOwn(ruleset, 'global'), false);
  const gitStateBefore = spawnSync('git', ['-C', repoRoot, 'status', '--porcelain'], {
    encoding: 'utf8',
  });
  assert.equal(gitStateBefore.status, 0, gitStateBefore.stderr);

  const generatedPaths = ['AGENTS.md', 'CLAUDE.md'];
  const generatedBefore = await Promise.all(generatedPaths.map((file) =>
    readFile(path.join(repoRoot, file), 'utf8')));
  const traceRoot = await mkdtemp(path.join(os.tmpdir(), 'agent-rules-readonly-'));
  const tracePath = path.join(traceRoot, 'git-trace.log');
  assert.ok(path.resolve(tracePath).startsWith(path.resolve(traceRoot) + path.sep));
  let result;
  try {
    result = spawnSync('compose-agentsmd', [
      'check-budget', '--root', repoRoot, '--json',
    ], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      shell: process.platform === 'win32',
      env: { ...process.env, GIT_TRACE: tracePath },
    });
    await assert.rejects(stat(tracePath), { code: 'ENOENT' });
  } finally {
    await rm(traceRoot, { recursive: true, force: true });
  }

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  const effectiveTokens = Math.max(report.budget.actualTokens, report.budget.canonicalTokens);
  assert.ok(effectiveTokens > 0);
  assert.equal(report.budget.totalBudget, 8000);
  assert.equal(report.budget.softTargetTokens, 7000);
  assert.equal(report.budget.totalExceeded, false);
  assert.equal(typeof report.budget.softTargetExceeded, 'boolean');
  if (report.budget.softTargetExceeded) assert.equal(result.status, 0);
  assert.equal(report.budget.remainingTokens, 8000 - report.budget.totalTokens);
  assert.ok(report.budget.totalTokens >= canonical.budget.totalTokens);
  assert.ok(report.budget.actualTokens > 0);
  assert.ok(report.budget.canonicalTokens > 0);
  assert.equal(report.budget.totalTokens, effectiveTokens);

  const generatedAfter = await Promise.all(generatedPaths.map((file) =>
    readFile(path.join(repoRoot, file), 'utf8')));
  assert.deepEqual(generatedAfter, generatedBefore);
  const gitStateAfter = spawnSync('git', ['-C', repoRoot, 'status', '--porcelain'], {
    encoding: 'utf8',
  });
  assert.equal(gitStateAfter.status, 0, gitStateAfter.stderr);
  assert.equal(gitStateAfter.stdout, gitStateBefore.stdout);
});

test('task verifier configuration selects the canonical PowerShell command', async () => {
  const config = await readFile(path.join(repoRoot, '.mwt', 'config.toml'), 'utf8');
  assert.match(config, /command\s*=\s*"pwsh -NoProfile -File tools\/verify\.ps1"/u);
});

test('canonical verifier retains Node, pinned lint, composition checks and failure propagation', async () => {
  const verifierPath = path.join(repoRoot, 'tools', 'verify.ps1');
  const verifier = await readFile(verifierPath, 'utf8');
  const normalized = verifier.replace(/\s+/gu, ' ');

  assert.match(verifier, /^\$ErrorActionPreference = 'Stop'$/mu);
  assert.match(normalized, /node --test .*verify-global-rules\.test\.mjs/);
  assert.match(normalized, /npx --yes markdownlint-cli@0\.49\.1/);
  for (const markdownPath of [
    "'rules/**/*.md'",
    'README.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'SECURITY.md',
    '--ignore node_modules',
  ]) assert.ok(verifier.includes(markdownPath));
  assert.match(normalized, /compose-agentsmd check --refresh --quiet/);
  assert.doesNotMatch(normalized, /npx --yes markdownlint-cli(?:\s|$)/);
  assert.doesNotMatch(verifier, /^\s*compose-agentsmd\s*$/mu);
  assert.equal((verifier.match(/\$LASTEXITCODE -ne 0/gu) ?? []).length, 3);
  assert.ok(normalized.indexOf('node --test') < normalized.indexOf('npx --yes markdownlint-cli@0.49.1'));
  assert.ok(normalized.indexOf('npx --yes markdownlint-cli@0.49.1') < normalized.indexOf('compose-agentsmd check'));
});

test('CI workflow pins executable verification configuration', async () => {
  const workflowPath = path.join(repoRoot, '.github', 'workflows', 'ci.yml');
  const workflow = await readFile(workflowPath, 'utf8');

  assert.match(workflow, /^  push:\r?\n    branches:\r?\n      - main$/mu);
  assert.match(workflow, /^  pull_request:\s*$/mu);
  assert.match(workflow, /^permissions:\r?\n  contents: read$/mu);
  assert.doesNotMatch(workflow, /^  schedule:/mu);

  const canonicalJob = extractJobSection(workflow, 'verify');
  const pinnedRef = 'd66978e3be0bffe66f070ebb013796f3e8b52a20';
  assertComposeVerificationJob(canonicalJob, pinnedRef);
  const wrongPinnedRefJob = canonicalJob.replace(`ref: ${pinnedRef}`, 'ref: another-revision');
  assert.notEqual(wrongPinnedRefJob, canonicalJob);
  assert.throws(() => assertComposeVerificationJob(wrongPinnedRefJob, pinnedRef));
  assert.doesNotMatch(canonicalJob, /^\s+continue-on-error:\s*true$/mu);
  assert.doesNotMatch(canonicalJob, /^          ref: main$/mu);

  const compatibilityJob = extractJobSection(workflow, 'compatibility-compose-main');
  assertComposeVerificationJob(compatibilityJob, 'main');
  assert.match(compatibilityJob, /^    continue-on-error: true$/mu);
});
