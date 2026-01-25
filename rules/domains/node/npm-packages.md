## Node packages

### 公開（GitHub / npm）

- 公開予定のパッケージは最低限 `LICENSE` を含める。
- `files` を設定して配布物を限定し、不要なファイル（例: `node_modules/`, テスト生成物, ローカル設定）を含めない。
- スコープ付きパッケージを npm 公開する場合は `publishConfig.access: "public"` を設定する。
- 利用側が「クリーン環境の `npm install`」だけで使える状態を担保する（必要なら `prepare` 等でビルドする）。
- 公開内容が変わる場合は `version` を更新し、変更点が追えるようにする。

### 検証

- 配布物の想定がある場合は `npm pack --dry-run` で内容を確認する。
- テストがある場合は `npm test` を実行する。
