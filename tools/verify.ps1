$ErrorActionPreference = 'Stop'

Write-Host 'Running Node regression tests.'
node --test `
    tests/verify-course-authoring.test.mjs `
    tests/verify-global-rules.test.mjs

if ($LASTEXITCODE -ne 0) {
    Write-Host "Node regression tests failed with exit code $LASTEXITCODE."
    exit $LASTEXITCODE
}

Write-Host 'Running pinned Markdown lint.'
npx --yes markdownlint-cli@0.49.1 `
    'rules/**/*.md' `
    README.md `
    CHANGELOG.md `
    CONTRIBUTING.md `
    SECURITY.md `
    --ignore node_modules

if ($LASTEXITCODE -ne 0) {
    Write-Host "Markdown lint failed with exit code $LASTEXITCODE."
    exit $LASTEXITCODE
}

Write-Host 'Checking generated instruction freshness.'
compose-agentsmd check --refresh --quiet

if ($LASTEXITCODE -ne 0) {
    $checkExitCode = $LASTEXITCODE
    Write-Host "Generated instruction freshness check failed with exit code $checkExitCode. Details:"
    compose-agentsmd check --refresh
    exit $checkExitCode
}
