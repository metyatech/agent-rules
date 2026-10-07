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
    assert.equal(report.budget.totalExceeded, false);
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
