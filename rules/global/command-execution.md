## コマンド実行

- ユーザーが明示しない限り、コマンドにラッパーやパイプを付加しない。
- ビルド/テスト/実行は、各リポジトリの標準スクリプト/手順（`package.json`、README等）を優先する。
- When running git commands that could open an editor, avoid interactive prompts by using `--no-edit` where applicable or setting `GIT_EDITOR=true` for that command.
- When a user reports a runtime/behavioral issue with a command, reproduce the issue by running the same command (or the closest equivalent) before proposing a fix.
- If an operation requires administrator privileges, do not fail immediately: attempt elevation using `sudo` when available; otherwise fall back to running as Administrator.
