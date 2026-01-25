## Node packages

### 公開（GitHub / npm）

- スコープ付きパッケージを npm 公開する場合は `publishConfig.access: "public"` を設定する。
- npm 公開時は `files` を設定し、配布物を意図どおりに限定する。
- クリーン環境の `npm install` だけで使えない場合は、`prepare` 等で必要なビルドを行う。

### 検証

- 配布物の想定がある場合は `npm pack --dry-run` で内容を確認する。
- テストがある場合は `npm test` を実行する。
