# 配布と公開

- 公開物には最低限 `LICENSE` を含める。
- 配布物に不要なファイル（例: 生成物、テスト生成物、ローカル設定）を含めない。
- 利用側がクリーン環境から README に書かれた手順だけで利用できる状態を担保する。
- 公開内容が変わる場合は、バージョン情報があるなら更新し、変更点を追跡可能にする。

## GitHub リポジトリの公開情報

- 外部公開リポジトリでは、GitHub 側の Description / Topics / Homepage を必ず設定する。
- GitHub 上での運用に必要なファイルをリポジトリ内に用意する。
- `.github/workflows/ci.yml`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/pull_request_template.md`
- `SECURITY.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- CI は、当該リポジトリの標準コマンド（例: `npm run lint`, `npm test`）を実行する構成にする。

## Release 運用

- 公開リポジトリでは `CHANGELOG.md` を用意し、公開内容の変更を追跡可能にする。
- 公開（npm 等）を行ったら、対応する Git タグ（例: `v1.2.3`）を作成して push する。
- GitHub Releases を作成し、本文は `CHANGELOG.md` の該当バージョンを基準に記述する。
- バージョンは `package.json`（等の管理対象）と Git タグの間で不整合を起こさない。
- When bumping a version, always create the GitHub Release and publish the package (e.g., npm) as part of the same update.
