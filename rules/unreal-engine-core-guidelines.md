## Unreal Engine プロジェクト共通ルール

### 実装方針

- C++のみで完結できる場合は、C++のみで実装する。
- ブループリントのイベントグラフは使用せず、すべてC++で実装する。
- ウィジェットは Slate を使用する。

以下のコーディング規約を遵守する：

- Unreal Engine 公式コーディング規約: https://dev.epicgames.com/documentation/ja-jp/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

### モジュール/プラグイン設計

- プラグインやモジュールは機能ごとに分離し、複数の異なる機能を1つに混在させない。
- インターフェースは具象型に依存させず、実装プラグイン/モジュールとは分離する。

| 種類             | 命名規則      | 例                       |
| ---------------- | ------------- | ------------------------ |
| インターフェース | 〇〇Interface | AssetDownloaderInterface |
| 実装             | 〇〇          | RuntimeAssetDownloader   |

- テストは実装とは別モジュールに分離する。

```
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

実装の汎用性に応じて配置先を選択する：

| 汎用性                     | 配置先                   | 例                               |
| -------------------------- | ------------------------ | -------------------------------- |
| UE全般で使える             | 独立したプラグイン       | 汎用ユーティリティ、共通インフラ |
| このプロジェクト内で汎用的 | プロジェクトのモジュール | プロジェクト共通の基盤機能       |
| 特定機能に固有             | その機能のモジュール内   | 機能固有のロジック               |

### アーキテクチャ/依存関係（UE固有）

- 共通機能は UActorComponent へ分離し、過度な継承階層を避ける。
- 動的キャスト濫用を避け、UInterface/インターフェース経由で疎結合化する。
- 非 UObject の C++ インターフェース（純粋仮想クラス）は、コピー/ムーブを `delete` し、デフォルトコンストラクタは `protected`、デストラクタは `public virtual` にする。
- 可換/テスタブルな箇所はインターフェース＋ファクトリで依存注入可能にする。サービスロケータの濫用を避ける。
- 追加のプロジェクト独自 Subsystem（`UGameInstanceSubsystem` 等）は可能な限り避ける。既存の Engine/公式 Subsystem は許容するが、サービスロケータとして扱わない。
- `GWorld`/`GEngine` への直接依存を避け、`GetWorld`/`WorldContext` から取得する。
- 拡張可能な分類は列挙型より Gameplay Tags を優先する。
- 汎用的な効果・バフ/デバフ等が必要な場合は GAS の利用を検討する。
- 設定は `UDeveloperSettings` で管理し、cvars はモジュール命名空間で宣言する。値のハードコードを避ける。
- 保存は `USaveGame` とカスタムバージョンでバージョニングし、必要に応じて `Serialize` を実装する。
- プラットフォーム依存は `FPlatform*`/`GenericPlatform` 経由で実装する。

### コーディング規約/メモリ管理（UE/C++）

- ヘッダでは前方宣言を優先し、完全型が必要な場合のみ `#include` する。
- Include-What-You-Use を徹底し、`*.generated.h` はヘッダ末尾に1回のみ include する。
- UFUNCTION 以外の関数は `auto` + trailing return type で戻り値を明示し、ラムダも戻り値型を明示する。

```cpp
auto GetPlayerName() -> FString;
auto Lambda = [](int32 Value) -> bool { return Value > 0; };
```

文字列型は用途で使い分ける：

| 型      | 用途                                          |
| ------- | --------------------------------------------- |
| FName   | 頻用識別子（比較/ハッシュのコスト抑制）       |
| FText   | ユーザー表示                                  |
| FString | 一時的文字列処理のみ                          |

- 浮動小数は `KINDA_SMALL_NUMBER` 等の許容誤差で比較する。
- 調整値は DataTable/設定/ConsoleVar に移動し、マジックナンバーを避ける。
- UTF-8 → TCHAR 変換は `StringCast` を使用し、旧式マクロは使用しない。
- `AllowedClasses`/`DisallowedClasses` はフルパスで記述する。
- `BindUFunction` は `GET_FUNCTION_NAME_CHECKED` を使用する。
- 公開 API には簡潔な目的/前提/副作用コメントを付与する。
- C++ 例外は使用しない。

UObject 参照は必ず UPROPERTY で管理し、`TObjectPtr` を使用する：

```cpp
UPROPERTY()
TObjectPtr<AActor> TargetActor;
```

非 UObject は `TUniquePtr`/`TSharedPtr` を使用し、非 null が保証される共有参照は `TSharedRef` を優先する。循環参照は `TWeakPtr`/`TWeakObjectPtr` で回避する。

UObject 生成は `NewObject`/`CreateDefaultSubobject` を使用し、直接コンストラクタ呼び出しはしない。

共有可変状態の `static` は避け、所有者と寿命が明確なオブジェクトへ閉じ込める。

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
- クライアント入力/ネットワークデータは不信任とし、サーバで検証/正規化する。
- RPC は意図に応じて `Reliable/Unreliable` を使い分ける。
- `UPROPERTY(Replicated/ReplicatedUsing)` と `GetLifetimeReplicatedProps` を正しく実装する。
- `FFastArraySerializer` や `COND_*` を使い、複製負荷を抑える。
- Dormancy を活用し、必要に応じて `ForceNetUpdate` を呼ぶ。
- `NetSerialize` を実装し、バージョン管理を付与する。
- 予測＋再同期を採用し、補正を小刻みに抑制する。
- シームレスラベルを前提とし、レベル固有参照を跨いで保持しない。
- 乱数は `FRandomStream` を使用し、シードをレプリケート/セーブする。
- HTTP/OSS は非同期化し、リトライ（指数バックオフ＋ジッタ）とタイムアウトを実装する。

### パフォーマンス/アセット/UI/入力/非同期

- Tick を最小化し、Timer/Delegate で置換する。
- Tick 前提の順序依存を避け、初期化/シャットダウン順序と依存を明示する。
- ホットパスの動的確保を避け、必要なら事前 reserve する。
- フレームあたりの作業量に上限を設け、分割処理でスパイクを回避する。

ゲームロジックは `UWorld::GetTimeSeconds` 等のワールド時間を使用する。

アセットは `TSoftObjectPtr` と `FStreamableManager` で遅延ロードし、`UAssetManager` で一元管理する。参照は `FSoftObjectPath`/`PrimaryAssetId` を用い、パス直書きを避ける。

`SCompoundWidget` + `SNew` を標準とし、`OnPaint` での重処理を避ける。状態変更時は `Invalidate(EInvalidateWidgetReason::…)` を適切に呼ぶ。

入力は Enhanced Input を統一採用し、MappingContext を集中管理する。キーコードのベタ書きは禁止する。

UObject はゲームスレッドのみで読み書きし、非同期結果は GameThread にマーシャリングする。ゲームスレッドでのブロッキング I/O を避け、並列化は `UE::Tasks` を優先する。

### セキュリティ/国際化

- 秘密情報はクライアントへ配布しない。
- 鍵/トークンは環境/プラットフォームセキュアストアへ保存する。
- バイナリ/アセットへの埋め込みを禁止する。
- 開発向けログ/機能は `WITH_EDITOR`/`UE_BUILD_SHIPPING` でガードする。

ユーザー向け文字列は `LOCTEXT`/`NSLOCTEXT` を使用し、数値/日時は `FText::As...` 系を使う。

