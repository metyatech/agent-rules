# 品質（テスト・検証・エラーハンドリング）

## 方針

- 品質（正確性・安全性・堅牢性・検証容易性）を最優先とする。納期/速度/簡便さより品質を優先する。

## 検証（ビルド/テスト/静的解析）

- 変更に関連する最小範囲のビルド/テスト/静的解析を実行する。
- 実行方法は各リポジトリが用意しているスクリプト/コマンドを優先する（例: `npm run build`, `npm test`）。
- Test commands that emit artifacts must control the output location and ensure the output path is gitignored.
- Before creating any commit, run the repository's lint, test, and build (or closest equivalents). If any are missing, add them in the same change set; if they cannot be run, state the reason and list the exact commands the user should run.
- Enforce commit-time automation: set up a pre-commit hook (or repo-native equivalent) so lint/test/build run automatically before any commit; if the repo lacks a hook system, add one in the same change set.
- For user-visible UI changes, verify in a real browser using agent-browser and report the result; if that is not possible, explain why and provide manual verification steps.
- Configure E2E tests to fail fast (stop after the first failure) to avoid compounding wait times; allow overriding via environment variable when needed.
- Configure test runs to avoid automatically opening a browser window; set headless or no-open options where supported.
- For Next.js E2E, prefer `next build` + `next start` over `next dev` to match production behavior and reduce dev-mode overhead.
- 静的解析（lint / 型チェック / 静的検証）は必須とし、対象リポジトリに未整備なら同一変更セット内で追加する（必須）。
- Prefer existing, maintained external testing tools/libraries and adopt them proactively when they solve the need; avoid reinventing the wheel.
- 実行できない場合は、その理由と、ユーザーが実行するコマンドを明記する。

## テスト

- 進め方: 実装や修正より先にテストを追加し、先に失敗を確認してから本実装を行う（test-first）を必ず守る。
- Always add end-to-end (E2E) tests for user-visible changes. If an E2E harness is missing, add one in the same change set (prefer existing ecosystem tools) and run it; if it cannot be run, document why and provide a manual verification plan.
- 常に多様な入力パターンを想定したテストを作成する（必須）。
- テストは、合理的に想定できる限りの観点を網羅する（成功/失敗/境界値/無効入力/状態遷移/並行実行/再試行/回復など）。不足がある場合は理由と代替検証を明記し、ユーザーの明示許可を得る。
- 最小のテストだけにせず、期待される挙動の全範囲（成功/失敗、境界値、無効入力、代表的な状態遷移）を網羅する。
- 原則: 挙動が変わる変更（仕様追加/変更/バグ修正/リファクタ等）には、同一変更セット内で自動テスト（ユニット/統合/スナップショット等）を追加/更新する（必須）。
- 仕様追加/変更時は、既存仕様の挙動が維持されていることを保証する回帰テストを追加/更新する（必須）。
- When adding or changing links, add or update automated tests that verify the link target resolves correctly (e.g., href + navigation or request). If automated verification is not feasible, document why and provide a manual verification plan.
- 出力ファイルの仕様を定義している場合、決定的な内容については全文一致のテスト（ゴールデン/スナップショット等）で検証する（必須）。
- 網羅性: 変更箇所の分岐・状態遷移・入力パターンについて、結果が変わり得るすべてのパターンを自動テストで網羅する（必須）。少なくとも「成功/失敗」「境界値」「無効入力」「代表的な状態遷移（例: 直前状態の影響、切り替え、解除/復帰）」を含める。
- 失敗系: 期待されるエラー/例外/不正入力の失敗ケースも必ずテストする（必須）。
- テスト未整備: 対象リポジトリにテストが存在しない場合は、まず実用的に運用できるテスト基盤を同一変更セット内で追加し、変更範囲の全挙動を確認できる十分なテストを追加する。新規依存追加が必要な場合は、候補と影響範囲を提示してユーザーへ報告したうえで進める。
- 例外: テスト追加や網羅が困難/不適切な場合は、理由と不足しているパターン（カバレッジギャップ）を明記し、代替検証（手動確認手順・実行コマンド等）を提示してユーザーの明示許可を得る（独断で省略しない）。
- テストは決定的にする（時刻/乱数/外部I/O/グローバル状態への依存を最小化し、必要なら差し替え可能にする）。
- Playwright のテストが動作しない場合は、`playwright/.cache` を削除してから再実行する（例: `npm run test-ct:clean`）。

## 再発防止

- 仕様追加/変更に起因する不具合が発生した場合は、再発防止のために回帰テストを追加し、必要に応じてルール/プロセスも更新する（必須）。
- ユーザーが問題点を指摘した場合は、種別（バグ/仕様/運用/手順）に関わらず、再発防止のためにルール/プロセス/テストの更新を行う（必須）。

## バグ修正（手順）

バグ修正は必ず、次の順で行う:

1. バグを再現する自動テストを追加/更新し、テストが失敗することを確認する。
2. バグ修正を行う。
3. 関連するテストを実行し、修正によってテストが通ることを確認する。

上記の自動テスト追加が困難な場合は、理由と代替検証手順を明記し、ユーザーに確認してから省略する。

## エラーハンドリング

- 失敗を握りつぶさない（空の catch / 黙殺 / サイレントフォールバックを避ける）。
- 回復可能なら早期 return + 明示的なエラー通知、回復不能なら明確に停止/失敗させる。
- エラーメッセージは実際の原因を簡潔に示し、必要な場合は対象の入力名と値（例: パス）を含める。
- Error messages must accurately reflect the current state; avoid wording that implies a failed action when it has not been attempted.
- Before emitting any user prompt, ensure the user has already been given the information required to make that decision; prompts must not appear without their context.
- For yes/no prompts, treat Enter as "Yes" and "n" as "No".

## 設定検証

- 設定値や外部入力（環境変数/設定ファイル/CLIオプション等）は、起動時または入力境界で検証する。
- 誤った設定はサイレントに補正せず、「何を直せばよいか」が分かる明示的なエラーで停止する。

## ログ

- ログは冗長にしないが、原因特定に必要なコンテキスト（識別子や入力条件）を含める。
- 秘密情報/個人情報をログに出さない（必要ならマスク/分離する）。
