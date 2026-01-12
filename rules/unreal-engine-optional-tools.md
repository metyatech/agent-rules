## Unreal Engine ツール運用（任意）

以下のツールを導入しているプロジェクトのみ適用する：

- UnrealBuildRunTestScript
- UE5Coro

### UnrealBuildRunTestScript

- Lint エラーは信用せず、必ず `Fire-Build.ps1.bat` のビルド結果で確認する。
- ビルドは `UnrealBuildRunTestScript\\Fire-Build.ps1.bat --no-pause` を使用する。
  - 追加指定が必要な場合は `UnrealBuildRunTestScript\\Fire-Build.ps1.bat --no-pause -Configuration Development -Platform Win64` の形式で実行する。
- ソースコード/`*.Build.cs`/プラグイン設定変更後は必ずビルドを実行し、エラーがあれば修正を継続する。

AutomationSpec/Functional Test は次のコマンドで実行する：

- `UnrealBuildRunTestScript\\Fire-BuildAndTest.ps1.bat --no-pause -TestFilter <Filter>`
  - `<Filter>`: 実行するテストのフィルタ（例: `MySpec`、`MySpec.MyTestCase` など）

### UE5Coro

- 非同期処理は UE5Coro を使用し、`co_await`/`co_return`/`co_yield` を使用する。
- UE5Coro の使い方は `Plugins/ue5coro/README.md` を確認する。
- コルーチン引数に参照を使用せず、値渡しや `TSharedPtr`/`TSharedRef` を使う。
