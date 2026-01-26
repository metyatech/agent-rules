# Multi-repo workflow

## マルチリポジトリ運用

- リポジトリは基本的に独立しており、変更は「影響のあるリポジトリ」に限定して行う。
- 共通モジュール/共有ライブラリを更新した場合は、利用側リポジトリでも参照（サブモジュール/依存関係/バージョン）を更新し、必要な検証まで同じ変更セットで行う。

## Workspace repository management (ghws)

- The `D:\ghws` repository is the workspace that mirrors the user's GitHub repositories and is the default place to manage them.
- If the target repository already exists under `D:\ghws`, edit it in place.
- If the target repository is not present under `D:\ghws`, clone it from GitHub with `--recursive` and then work in the cloned folder.
- When adding a new repository, create a new folder under `D:\ghws` and push it to GitHub.

## ブランチ/PR 運用

- ブランチの指定がない場合は、現在のブランチで作業してよい。
- `main`/`master` への直接コミット/プッシュを許可する。

## 変更の局所化

- 変更対象（影響範囲）を明確にし、無関係な別リポジトリへ不用意に波及させない。

## 検証

- 変更したリポジトリ内の手元検証を優先する（例: `npm run build`, `npm test`）。
- 共通モジュール側の変更が利用側に影響しうる場合は、少なくとも1つの利用側リポジトリで動作確認（ビルド等）を行う。
