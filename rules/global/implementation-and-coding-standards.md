## 実装・技術選定

- JavaScript ではなく TypeScript を標準とする（`.ts`/`.tsx`）。
- JavaScript は、ツール都合で必要な設定ファイル等に限定する。
- Prefer existing, maintained external dependencies for problems they can solve; use them proactively because they are typically better maintained and less bug-prone. Only build in-house when no suitable external option exists.
- 対象ツール/フレームワークに公式チュートリアルや推奨される標準手法がある場合は、それを第一優先で採用する（明確な理由がある場合を除く）。
- Use established icon libraries instead of creating custom icons or inline SVGs; do not handcraft new icons.
- Prefer existing internet-hosted tools/libraries for reusable functionality; if none exist, externalize the shared logic into a separate repository/module and reference it via remote dependency (never local filesystem paths).
- When building a feature that appears reusable across repositories or generally useful, explicitly assess reuse first: look for existing solutions, and if none fit, propose creating a new repository/module and publishing it with proper maintenance hygiene instead of embedding the logic in a single repo.
- 「既存に合わせる」よりも「理想的な状態（読みやすさ・保守性・一貫性・安全性）」を優先する。
- 根本原因を修正できる場合は、場当たり的なフォールバックや回避策を追加しない（ノイズ/負債化するため）。
- When a bug originates in a dependency you control or can patch, fix the dependency first; only add app-level workarounds as a last resort after documenting why the dependency fix is not feasible.
- Clarify uncertainties that materially affect outcomes, risk, or scope; otherwise choose the standard, lowest-risk option, state the assumption, and proceed.
- Do not act on speculation without evidence. If evidence is missing and the decision is material, verify first; if verification is not feasible, ask the user.
- Do not implement or fix based on unverified root causes; confirm the cause first, and if confirmation is not possible, ask the user with the minimum context needed.
- Externalize long embedded strings/templates/rules into separate files when possible to keep code readable and maintainable.
- When the user asks to rule-encode a request, infer the broader principle and update the most general applicable rule so it covers the request without requiring the user to restate a generalized form.

### 意思決定の優先順位

保守性 ＞ テスト容易性 ＞ 拡張性 ＞ 可読性

## 設計・実装の原則（共通）

- 責務を小さく保ち、関心を分離する（単一責任）。
- ツールやモジュールの責務は狭く定義し、用途が曖昧になる広い責務設計を避ける。
- 互換性維持（後方互換オプションやエイリアスなど）は、ユーザーが明示的に指示した場合のみ行う。
- 依存関係の方向を意識し、差し替えが必要な箇所は境界を分離する（抽象化/インターフェース等）。
- 継承より合成を優先し、差分を局所化する（過度な階層化を避ける）。
- グローバルな共有可変状態を増やさない（所有者と寿命が明確な場所へ閉じ込める）。
- 深いネストを避け、ガード節/関数分割で見通しを保つ。
- 意図が分かる命名にする（曖昧な省略や「Utils」的な雑多化を避ける）。
- ハードコードを避け、設定/定数/データへ寄せられるものは寄せる（変更点を1箇所に集約する）。
- Always keep everything DRY (implementations, schemas, specs, docs, tests, configs, scripts, and any other artifacts): extract shared structures into reusable definitions/modules and reference them instead of duplicating.
- 変更により不要になったコード/ヘルパー/分岐/コメント/暫定対応は、指示がなくても削除する（残すか迷う場合は確認する）。
- 未使用の関数/型/定数/ファイルは残さず削除する（意図的に残す場合は理由を明記する）。

## コーディング規約

- まずは各リポジトリの既存コード・設定（formatter/linter）に合わせる。
- 明示的な規約がない場合は、対象言語/フレームワークの一般的なベストプラクティスに合わせる。

## ドキュメント

- 仕様・挙動・入出力・制約・既定値・順序・命名・生成条件・上書き有無など、仕様に関わる内容は詳細かつ網羅的に記述する（要約だけにしない）。
- 実装を変更して仕様に影響がある場合は、同一変更セットで仕様書（例: `docs/`）も更新する。仕様書の更新が不要な場合でも、最終返答でその理由を明記する。
- Markdown ドキュメントの例は、テストケースのファイルで十分に示せる場合はテストケースを参照する。十分でない場合は、その例をテストケース化できるか検討し、可能ならテスト化して参照する。どちらも不適切な場合のみドキュメント内に例を記載する。
- CLIのコマンド例には、必須パラメーターを必ず含める。
- ドキュメントの例には、ユーザー固有のローカルパスや個人情報に該当する値を含めない（例: `D:\\ghws\\...` など）。
