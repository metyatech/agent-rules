## セキュリティ・国際化

### セキュリティ

#### 秘密情報

- 秘密情報はクライアントに配布しない
- 鍵/トークンは環境/プラットフォームセキュアストアに保存
- バイナリ/アセットへの埋め込み禁止

#### Shipping 配慮

開発向けログ/機能は `WITH_EDITOR`/`UE_BUILD_SHIPPING` ガードで除外または減衰する。秘匿情報をビルド物へ含めない。

### 国際化

#### ユーザー向け文字列

`LOCTEXT`/`NSLOCTEXT` を必須とし、`FString` 直書きを禁止する。

#### 数値/日時

`FText::As…` 系を使用する。

```cpp
// 良い例
FText::AsNumber(Value);
FText::AsDateTime(DateTime);

// 悪い例
FString::Printf(TEXT("%d"), Value);
```
