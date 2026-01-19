# Unreal Engine プロジェクト共通ルール

## 実装方針

- C++のみで完結できる場合は、C++のみで実装する。
- ブループリントのイベントグラフは使用せず、すべてC++で実装する。
- ウィジェットは Slate を使用する。

以下のコーディング規約を遵守する：

- Unreal Engine 公式コーディング規約: <https://dev.epicgames.com/documentation/ja-jp/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine>
- C++ Core Guidelines: <https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines>

### 設計・アーキテクチャ

#### SOLID原則

SOLID原則は「コンテキスト」に応じて適用レベルを調整する。

徹底適用すべきコンテキスト：

- 外部から柔軟に使われることを想定するもの（プラグイン・モジュール・公開API・インターフェース）
- 外部利用者向けのドキュメントを提供する状況

相対的に判断するコンテキスト：

- 近い将来に変更/拡張が予想される箇所は責務を分離する
- 安定していて変更が予想されない箇所は簡潔さを優先する
- テスト容易性が必要な箇所はインターフェースで分離する

#### レイヤー設計

- 上位レイヤー（ビジネスロジック）は下位レイヤー（インフラ・ユーティリティ）に依存させない。
- 両者は抽象（インターフェース）に依存させる。
- 具象への依存は末端（エントリポイント・ファクトリ）に限定する。

機能はできるだけ汎用的・再利用可能な形で設計する。

汎用性に応じて配置先を選択する：

| 汎用性                     | 配置先                   | 例                               |
| -------------------------- | ------------------------ | -------------------------------- |
| UE全般で使える             | 独立したプラグイン       | 汎用ユーティリティ、共通インフラ |
| このプロジェクト内で汎用的 | プロジェクトのモジュール | プロジェクト共通の基盤機能       |
| 特定機能に固有             | その機能のモジュール内   | 機能固有のロジック               |

#### プラグイン/モジュール設計

- プラグインやモジュールは機能ごとに分離し、複数の異なる機能を1つに混在させない。
- インターフェースは具象型に依存させず、実装プラグイン/モジュールとは分離する。

| 種類             | 命名規則      | 例                       |
| ---------------- | ------------- | ------------------------ |
| インターフェース | 〇〇Interface | AssetDownloaderInterface |
| 実装             | 〇〇          | RuntimeAssetDownloader   |

- テストは実装とは別モジュールに分離する。

```text
Plugins/
  MyFeature/
    Source/
      MyFeature/        # 実装モジュール
        Private/
        Public/
        MyFeature.Build.cs
      MyFeatureTests/   # テストモジュール
        Private/
        MyFeatureTests.Build.cs
```

- Runtime と Editor は厳密に分離し、Editor 依存コードは Editor モジュールのみに配置する。
- `PublicDependencyModuleNames` と `PrivateDependencyModuleNames` を厳密に分離し、Editor 依存は Editor モジュール側のみに追加する。

#### アーキテクチャ/依存関係（UE固有）

- 共通機能は UActorComponent へ分離し、過度な継承階層を避ける。
- 動的キャスト濫用を避け、UInterface/インターフェース経由で疎結合化する。
- 非 UObject の C++ インターフェース（純粋仮想クラス）は、コピー/ムーブを `delete` し、デフォルトコンストラクタは `protected`、デストラクタは `public virtual` にする。
- 可換/テスタブルな箇所はインターフェース＋ファクトリで依存注入可能にする。サービスロケータの濫用を避ける。
- null を想定しない引数/戻り値は C++ 参照/TSharedRef で表現し、null があり得る場合のみ TOptional/TUniquePtr/TSharedPtr を使う。生ポインタは極力避ける。
- フレームワーク依存のリソースは初期化時ではなく、実使用時に遅延取得する。
- 複数の分散したコンポーネントは統合管理システムで一元化する。
- 追加のプロジェクト独自 Subsystem（`UGameInstanceSubsystem` 等）は可能な限り避ける。既存の Engine/公式 Subsystem は許容するが、サービスロケータとして扱わない。
- `GWorld`/`GEngine` への直接依存を避け、`GetWorld`/`WorldContext` から取得する。
- 拡張可能な分類は列挙型より Gameplay Tags を優先する。
- 汎用的な効果・バフ/デバフ等が必要な場合は GAS の利用を検討する。
- 設定は `UDeveloperSettings` で管理し、cvars はモジュール命名空間で宣言する。値のハードコードを避ける。
- 保存は `USaveGame` とカスタムバージョンでバージョニングし、必要に応じて `Serialize` を実装する。
- プラットフォーム依存は `FPlatform*`/`GenericPlatform` 経由で実装する。

#### デザインパターン/抽象化/実装一貫性

オブジェクト生成が必要な場合は、責務と拡張性に応じてファクトリパターンを使い分ける：

| パターン         | 用途                                         |
| ---------------- | -------------------------------------------- |
| Simple Factory   | 生成ロジックが単純で拡張性不要な場合         |
| Factory Method   | サブクラスに生成を委譲する場合               |
| Abstract Factory | 関連するオブジェクト群を一貫して生成する場合 |

新規に「Utils」的な雑多な namespace 関数を増やさない。外部依存を持つ共通処理はクラス化し、インターフェース経由で差し替え可能にする。

抽象化レベルは関数内で一貫させ、名前と責務の不一致を避ける：

| 問題             | 例                                                        |
| ---------------- | --------------------------------------------------------- |
| 名前より狭い責務 | `IDataProvider` が HTTP 固有の URL パラメータを要求       |
| 名前より広い責務 | `IFileReader` がファイル変換やキャッシュも担当            |
| 実装詳細の漏出   | `IAssetDownloader` が HTTP ヘッダー由来の情報を結果に含む |

対処方法：

- 名前を具体的にする（例: `IAssetDownloader` → `IUrlAssetDownloader`）
- 責務を分離する（追加の責務は別インターフェースに切り出す）

SOLID原則に基づく設計判断は、該当クラス/関数のコメントに「なぜその設計にしたか」を簡潔に記載する。

新規実装時は既存パターンを分析し、一貫性のあるアーキテクチャを維持する。実装アプローチを変更した場合は、変数名・コメント・ログメッセージを一貫して更新する。

### コーディング規約/メモリ管理（UE/C++）

#### 可読性

- 短い関数を心がける。
- 複雑化するテンプレート/マクロの濫用を避ける。
- 型と意図が明確になる変数名と型指定を優先する。

#### ヘッダとインクルード

- ヘッダでは前方宣言を優先し、完全型が必要な場合のみ `#include` する。
- Include-What-You-Use を徹底し、`*.generated.h` はヘッダ末尾に1回のみ include する。

#### 関数

UFUNCTION 以外の関数は `auto` + trailing return type で戻り値を明示し、ラムダも戻り値型を明示する。

```cpp
auto GetPlayerName() -> FString;
auto Lambda = [](int32 Value) -> bool { return Value > 0; };
```

#### 文字列型

| 型      | 用途                                    |
| ------- | --------------------------------------- |
| FName   | 頻用識別子（比較/ハッシュのコスト抑制） |
| FText   | ユーザー表示                            |
| FString | 一時的文字列処理のみ                    |

#### 数値

- 浮動小数は `KINDA_SMALL_NUMBER` 等の許容誤差で比較する。

#### 文字列

UTF-8 → TCHAR 変換は `StringCast` を使用し、旧式マクロは使用しない。

#### メタデータ

- `AllowedClasses`/`DisallowedClasses` はフルパスで記述する。
- `BindUFunction` は `GET_FUNCTION_NAME_CHECKED` を使用する。

#### API コメント

公開 API には簡潔な目的/前提/副作用コメントを付与する。

#### 例外

C++ 例外は使用しない。

#### メモリ管理

UObject 参照は必ず UPROPERTY で管理し、`TObjectPtr` を使用する：

```cpp
UPROPERTY()
TObjectPtr<AActor> TargetActor;
```

非 UObject は `TUniquePtr`/`TSharedPtr` を使用し、非 null が保証される共有参照は `TSharedRef` を優先する。循環参照は `TWeakPtr`/`TWeakObjectPtr` で回避する。

UObject を所有しない参照は `TWeakObjectPtr` を使用する。

UObject 生成は `NewObject`/`CreateDefaultSubobject` を使用し、直接コンストラクタ呼び出しはしない。

共有可変状態の `static` は避け、所有者と寿命が明確なオブジェクトへ閉じ込める。

### Unreal Engine 固有のルール

#### UI/座標変換

- ワールド座標からUIのスクリーン座標へ変換する場合は、`UWidgetLayoutLibrary::ProjectWorldLocationToWidgetPosition` を優先する（DPI/viewportスケールを考慮するため）。

#### 静的解析

- 全ての Unreal Engine プロジェクトは unreal-clangd を導入し、clangd による静的解析を必ず実行する。
- 静的解析は常に全て確認する（変更ファイルだけに限定せず、プロジェクトの設定で有効な静的解析を全て実行・確認する）。
- clangd を基準とし、clang-tidy の指摘も必ず確認する。
- 実行方法はプロジェクトの設定（ビルドシステムが生成する compile_commands.json と clangd 設定）に従う。
- 実行できない場合は理由と代替手順を明記する。
- `*.Build.cs` などビルド設定変更後は `compile_commands.json` を再生成してから再実行する。
- VSCode 関連のファイル（.vscode や .code-workspace など）には依存しない。

##### clangd（標準の診断と同等）

- compile_commands はビルドシステムが生成したものを使用する。
- 実行例:

```powershell
& "C:\Program Files\LLVM\bin\clangd.exe" --compile-commands-dir="<compile_commands_dir>" --clang-tidy --check="<file>"
```

##### clang-tidy（Magic number など clangd で出ない診断の補完）

- `<rsp>` は対象ファイルに対応するレスポンスファイルを使用する（`compile_commands.json` の該当エントリに含まれる `@...rsp` を参照）。
- 実行例:

```powershell
& "C:\Program Files\LLVM\bin\clang-tidy.exe" "<file>" -checks=cppcoreguidelines-avoid-magic-numbers -- --driver-mode=cl /std:c++20 @<rsp>
```

##### clang-tidy（標準の診断再現）

- 標準の診断結果と同等の結果を得る場合は、対象ファイルに対応するレスポンスファイル（rsp）を用いて `clang-tidy` を実行する。
- `--driver-mode=cl` と `/std:c++20` を必ず指定する。

```powershell
& "C:\Program Files\LLVM\bin\clang-tidy.exe" "<file>" -- --driver-mode=cl /std:c++20 @<rsp>
```

#### Lint 抑制

- 単一行の抑制は `NOLINTNEXTLINE(<rule-name>)` を使用する。
- 複数行に亘る抑制が必要な場合は `NOLINTBEGIN(<rule-name>)` と `NOLINTEND(<rule-name>)` を使用する。
- 可能な限り抑制ではなく修正で解消する。

#### Editor ガード

エディタ専用コードは `WITH_EDITOR`/`WITH_EDITORONLY_DATA` でガードし、ランタイムに混入させない。

#### ライフサイクル

- コンストラクタでの `GetWorld`/仮想呼び出しは禁止する。初期化は `OnRegister`/`BeginPlay`/`PostInitProperties` に分離する。
- `SpawnActorDeferred` は `FinishSpawning` 前に初期化や依存注入が必要なケースのみに限定する。
- `PostEditChangeProperty` は軽量な状態更新のみに使用し、構築/再構築は `OnConstruction` に集約する。

#### Delegates

動的デリゲートは必要時のみ使用し、Bind/Unbind の対称性を保つ。

### エラーハンドリング/ログ（UE固有）

- `checkf`: 継続不能な前提違反のみ。
- `ensureMsgf`: 回復可能だが早期検知すべき異常。
- 回復可能な異常は `UE_LOG(Error/Warning)` で記録し、早期 return する。
- `LogTemp` は禁止し、モジュールごとに専用ログカテゴリを定義する。
- 最小出力レベルは Shipping: Display / 非 Shipping: Log を基準とする。

MessageLog はモジュールごとに LogName を定義し、登録/解除と PIE 終了時の表示を行う：

```cpp
#if WITH_EDITOR
FMessageLogModule& MessageLogModule = FModuleManager::LoadModuleChecked<FMessageLogModule>("MessageLog");
MessageLogModule.RegisterLogListing(LogName, DisplayName);
EndPIEHandle = FEditorDelegates::EndPIE.AddRaw(this, &FMyModule::OnEndPIE);
#endif

#if WITH_EDITOR
FEditorDelegates::EndPIE.Remove(EndPIEHandle);
if (FModuleManager::Get().IsModuleLoaded("MessageLog"))
{
    FMessageLogModule& MessageLogModule = FModuleManager::GetModuleChecked<FMessageLogModule>("MessageLog");
    MessageLogModule.UnregisterLogListing(LogName);
}
#endif

void FMyModule::OnEndPIE(bool bIsSimulating)
{
    FMessageLog(LogName).Open(EMessageSeverity::Info, false);
}
```

### マルチプレイ/ネットワーク

- クライアントは状態を決定せず、`HasAuthority()` を厳密に確認する。
- クライアント入力/ネットワークデータは不信任とし、サーバで検証/正規化する。過大な Payload は禁止する。
- RPC は意図に応じて `Reliable/Unreliable` を使い分ける。
- `UPROPERTY(Replicated/ReplicatedUsing)` と `GetLifetimeReplicatedProps` を正しく実装する。
- `FFastArraySerializer` や `COND_*` を使い、複製負荷を抑える。
- `bNetUseOwnerRelevancy`/`NetCullDistanceSquared` を活用し、帯域を最適化する。
- Dormancy を活用し、必要に応じて `ForceNetUpdate` を呼ぶ。
- `NetSerialize` を実装し、バージョン管理を付与する。
- 予測＋再同期を採用し、補正を小刻みに抑制する。
- シームレストラベルを前提とし、レベル固有参照を跨いで保持しない。
- 乱数は `FRandomStream` を使用し、シードをレプリケート/セーブする。
- HTTP/OSS は非同期化し、リトライ（指数バックオフ＋ジッタ）とタイムアウトを実装する。

### パフォーマンス/アセット/UI/入力/非同期

- Tick を最小化し、Timer/Delegate で置換する。
- Tick 前提の順序依存を避け、初期化/シャットダウン順序と依存を明示する。
- ホットパスの動的確保を避け、必要なら事前 reserve する。
- `TRACE_CPUPROFILER` で計測可能にする。
- フレームあたりの作業量に上限を設け、分割処理でスパイクを回避する。

ゲームロジックは `UWorld::GetTimeSeconds` 等のワールド時間を使用し、`FPlatformTime` は計測用途に限定する。

アセットは `TSoftObjectPtr` と `FStreamableManager` で遅延ロードし、`UAssetManager` で一元管理する。参照は `FSoftObjectPath`/`PrimaryAssetId` を用い、パス直書きを避ける。

調整可能な定数群は `UPrimaryDataAsset`/`UDataTable` で管理する。

`SCompoundWidget` + `SNew` を標準とし、動的値は `TAttribute`/`DELEGATE` でバインドする。`OnPaint` での重処理を避け、状態変更時は `Invalidate(EInvalidateWidgetReason::…)` を適切に呼ぶ。

入力は Enhanced Input を統一採用し、MappingContext を集中管理する。キーコードのベタ書きは禁止し、マルチプレイ時の入力はサーバで検証する。

非同期処理は UE5Coro を使用し、`co_await`/`co_return`/`co_yield` を使用する。UE5Coro の使い方は `Plugins/ue5coro/README.md` を確認する。

コルーチン引数に参照を使用せず、値渡しや `TSharedPtr`/`TSharedRef` を使う。

UObject はゲームスレッドのみで読み書きし、非同期結果は GameThread にマーシャリングする。ゲームスレッドでのブロッキング I/O を避け、タイムアウト/キャンセルを実装する。並列化は `UE::Tasks` を優先する。

### セキュリティ/国際化

- 秘密情報はクライアントへ配布しない。
- 鍵/トークンは環境/プラットフォームセキュアストアへ保存する。
- バイナリ/アセットへの埋め込みを禁止する。
- 開発向けログ/機能は `WITH_EDITOR`/`UE_BUILD_SHIPPING` でガードする。

ユーザー向け文字列は `LOCTEXT`/`NSLOCTEXT` を使用し、数値/日時は `FText::As...` 系を使う。

### テスト/ビルドワークフロー

#### ツール導入（必須）

UnrealBuildRunTestScript と UE5Coro は必須とする。対象機能を使う場合に未導入なら、必ず導入してから進める。

#### 設計プロセス

実装を伴う作業では、次のプロセスで設計を検討する：

1. 機能の分解（指示された内容を構成する機能・責務を洗い出す）
2. 既存機能の確認（既に十分に汎用的な実装がある場合は活用する）
3. 汎用性の分析（UE全般/プロジェクト内/特定機能で配置先を判断する）
4. 依存関係の設計（抽象を通じた依存関係を設計する）
5. 実装順序の決定（汎用的な機能から順に実装する）

#### 実装前の確認

- デザイン仕様は複数回確認し、実装前に正確な理解を得る。
- コーディング規約は実装開始時に全項目を確認し、後戻りを防ぐ。

#### ビルド

- Lint エラーは信用せず、必ずビルド結果で確認する。
- ビルドは `UnrealBuildRunTestScript\\Fire-Build.ps1.bat --no-pause` を使用する。
  - 追加指定が必要な場合は `UnrealBuildRunTestScript\\Fire-Build.ps1.bat --no-pause -Configuration Development -Platform Win64` の形式で実行する。
- ソースコード/`*.Build.cs`/プラグイン設定変更後は必ずビルドを実行し、エラーがあれば修正を継続する。

#### 自動テスト

- 重要機能は AutomationSpec/Functional Tests を用意する。
- テストは可能な限り網羅的に作成し、通常時とリファクタリング時で同一基準を適用する。
- ユーザーから明示的な指示がなくても、関連部分を修正した場合は対応するテストを必ず実行する。
- テスト可能な状態になった時点で、自動テストを必ず追加する。

テスト可能の基準：

- 期待する挙動をテスト環境から再現・観測できる。
- 主要な外部依存が抽象越しに差し替え可能、またはテスト環境で再現可能。
- 成功/失敗/境界/例外的入力をプログラム的に生成でき、結果が決定的に検証できる。
- 非同期処理は完了条件を待機でき、結果/副作用が検証できる。

最低限のテストケース：

- 同期処理
- 非同期処理
- サーバ側
- クライアント側

#### テスト実行コマンド

AutomationSpec/Functional Test は次のコマンドで実行する：

- `UnrealBuildRunTestScript\\Fire-BuildAndTest.ps1.bat --no-pause -TestFilter <Filter>`
  - `<Filter>`: 実行するテストのフィルタ（例: `MySpec`、`MySpec.MyTestCase` など）

#### 再現性

再現手順をログに残す。
