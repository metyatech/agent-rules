$ErrorActionPreference = 'Stop'

node --test `
    tests/verify-course-authoring.test.mjs `
    tests/verify-global-rules.test.mjs

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

npx --yes markdownlint-cli@0.49.1 `
    'rules/**/*.md' `
    README.md `
    CHANGELOG.md `
    CONTRIBUTING.md `
    SECURITY.md `
    --ignore node_modules

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

compose-agentsmd check --refresh --quiet

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
