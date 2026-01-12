## パフォーマンス・アセット管理・UI/Slate・非同期処理

### パフォーマンス

#### Tick の最小化

Tick の使用を最小化し、Timer/Delegate で置換する。ポーリングはイベント/デリゲートへ置換する。

#### Tick 依存の排除

Tick 前提の順序依存を避け、初期化/シャットダウン順序と依存を明示する。

#### ホットパスの最適化

ホットパスの動的確保を避け、必要なら事前 reserve する。`TRACE_CPUPROFILER` で計測可能にする。

#### フレームあたり作業量

1フレームでの上限作業を設け、時間切り出し（分割処理/タスク化）でスパイクを回避する。

### 時間

ゲームロジックは `UWorld::GetTimeSeconds` 等のワールド時間を使用する。`FPlatformTime` は計測用途に限定する。

### アセット管理

#### 遅延ロード

重量アセットは `TSoftObjectPtr` を用い、`FStreamableManager` で遅延ロード。直接ハード参照を避け、ライフサイクルを明確化する。

#### UAssetManager

`UAssetManager` を使用し、Primary Asset Type/Id で一元管理・非同期ロードする。

#### アセット参照の安定性

パスは `FSoftObjectPath`/`PrimaryAssetId` を使用する。ファイルシステムの絶対/相対パス直書きは禁止。

#### Data Asset

調整可能な定数群は `UPrimaryDataAsset`/`UDataTable` で管理し、コード直書きを避ける。

### UI/Slate

#### 基本

`SCompoundWidget` + `SNew` 構文を標準とし、動的値は Attributes（`TAttribute`/`DELEGATE`）でバインドする。

#### パフォーマンス

`OnPaint` での重処理禁止。状態変更時は `Invalidate(EInvalidateWidgetReason::…)` を適切に呼び出す。

### 入力

#### Enhanced Input

Enhanced Input を統一採用する：

- MappingContext は集中管理
- キーコードのベタ書きを禁止
- マルチプレイ時の入力はサーバで検証

### 非同期処理

#### UE5Coro

非同期処理は UE5Coro を使用し、`co_await`, `co_return`, `co_yield` を使用する。

UE5Coro の使い方については、`Plugins/ue5coro/README.md` を確認する。

#### コルーチン引数

コルーチン関数の引数に参照を使用しない。ライフタイム問題を避けるため、値渡しや `TSharedPtr`/`TSharedRef` を用いる。

#### スレッド安全性

UObject はゲームスレッドのみで読み書きする。UPROPERTY 配列/オブジェクトの変更はゲームスレッドのみ。非同期結果は GameThread にマーシャリングする。

#### ブロッキング禁止

ゲームスレッドでの同期 I/O や長時間ブロックは避け、非同期＋タイムアウト/キャンセルを実装する。

#### 並列化

`UE::Tasks`（`Async`/`Tasks::Launch`）等の標準並列基盤を優先し、独自スレッド管理を避ける。
