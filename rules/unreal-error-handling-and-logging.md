## エラーハンドリング（Unreal Engine）

### ensure / check の使い分け

| マクロ       | 用途                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| `checkf`     | 継続不能な致命的前提違反。直ちに停止すべき場合のみ                                                       |
| `ensureMsgf` | 前提条件の破れや必須資源の取得失敗など、開発時に必ず気付くべき異常。処理継続は可能だが早期検知したい場合 |

### 異常検知

確実に取得できるはずのオブジェクト/設定が取得できない場合は「異常」として扱う：

- 致命的なら `checkf` で即時停止
- 回復可能なら `ensureMsgf` で即時検知し、早期 return

### if + UE_LOG

フォールバックで継続可能な異常には `if` + `UE_LOG(Error/Warning)` を使用する。重要度に応じて Error/Warning を選択する。

## ログ出力（Unreal Engine）

### ログカテゴリ

`LogTemp` の使用を禁止し、モジュールごとに専用のログカテゴリを定義して使用する。

### 出力方針

- 出力時には識別子（UserId・EntityId 等）を付与する

### デフォルトの最小出力レベル

| ビルド      | 最小出力レベル |
| ----------- | -------------- |
| Shipping    | Display        |
| 非 Shipping | Log            |

### MessageLog

#### 用途

エディター利用者が設定で解決すべき項目が未設定/不正な場合に通知する。

#### 実装要件

モジュールごとに独自の LogName を定義し、StartupModule で登録、ShutdownModule で解除する。PIE 終了時に `FMessageLog(LogName).Open()` で表示する。

```cpp
// StartupModule
#if WITH_EDITOR
FMessageLogModule& MessageLogModule = FModuleManager::LoadModuleChecked<FMessageLogModule>("MessageLog");
MessageLogModule.RegisterLogListing(LogName, DisplayName);
EndPIEHandle = FEditorDelegates::EndPIE.AddRaw(this, &FMyModule::OnEndPIE);
#endif

// ShutdownModule
#if WITH_EDITOR
FEditorDelegates::EndPIE.Remove(EndPIEHandle);
if (FModuleManager::Get().IsModuleLoaded("MessageLog"))
{
    FMessageLogModule& MessageLogModule = FModuleManager::GetModuleChecked<FMessageLogModule>("MessageLog");
    MessageLogModule.UnregisterLogListing(LogName);
}
#endif

// OnEndPIE
void FMyModule::OnEndPIE(bool bIsSimulating)
{
    FMessageLog(LogName).Open(EMessageSeverity::Info, false);
}
```

エディター時のみ有効化（`WITH_EDITOR` ガード必須）。
