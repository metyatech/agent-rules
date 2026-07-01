# OpenCode Repository Rules

## Repository workflow

- The default branch in this repository is `dev`.
- Local `main` may not exist; use `dev` or `origin/dev` for diffs when no other branch is specified.
- To regenerate the JavaScript SDK, run `./packages/sdk/js/script/build.ts`.
- Prefer automation: execute requested actions without confirmation unless blocked by missing information, safety, or irreversibility.
- Repository-local OpenCode workflows MUST live in `.opencode/commands/`.
- The canonical verification command MUST be the same command used for local validation before delivery.
- When no canonical verification command is configured, stop and report the missing bootstrap requirement instead of inventing a partial substitute.
- Bug fixes MUST add or strengthen a regression check before concluding.
- Irreversible operations such as destructive deletion, publish, release, force-push, or external side effects MUST remain approval-gated.

## Style guide

- Keep things in one function unless code is composable or reusable.
- Avoid `try` / `catch` where possible.
- Avoid the `any` type.
- Use Bun APIs when possible, such as `Bun.file()`.
- Rely on type inference when possible.
- Avoid explicit type annotations or interfaces unless necessary for exports or clarity.
- Prefer functional array methods such as `flatMap`, `filter`, and `map` over for loops.
- Use type guards on `filter` to maintain downstream type inference.
- Reduce total variable count by inlining a value when it is only used once.
- Avoid unnecessary destructuring; use dot notation to preserve context.
- Prefer `const` over `let`.
- Use ternaries or early returns instead of reassignment.
- Avoid `else`; prefer early returns.

## Drizzle schema definitions

- Use snake_case for Drizzle field names so column names do not need to be redefined as strings.

## Testing and type checking

- Avoid mocks as much as possible.
- Test the actual implementation; do not duplicate logic into tests.
- Tests MUST NOT run from the repository root.
- Run tests from package directories such as `packages/opencode`.
- Always run `bun typecheck` from package directories such as `packages/opencode`.
- Do not run `tsc` directly for this repository's package type checking.