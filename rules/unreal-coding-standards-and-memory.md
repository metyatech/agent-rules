## コーディング規約・メモリ管理

### 可読性

- 短い関数を心がける
- 早期 return を使用する
- 深いネスト（目安: 2段以上）を避け、ガード節/関数抽出で浅く保つ
- 明確な命名（曖昧な省略語を避ける。UE で一般的な略語は許容）
- 複雑化するテンプレート/マクロの回避
- 明示的な型と意図を示す変数名を優先

### ヘッダとインクルード

#### 前方宣言

ヘッダファイルでは可能な限り前方宣言を使用し、完全型が必要な場合のみ `#include` する（例: 継承、値メンバー、テンプレート/inline、UHT の要件）。実装ファイルでは必要な具体ヘッダを `#include` する。

#### IWYU（Include-What-You-Use）

Include-What-You-Use を徹底する。ヘッダは前方宣言＋最小限のインクルード、実装で具体ヘッダを包含する。

#### 生成コード

`*.generated.h` はヘッダ末尾に1回のみインクルードする。UHT警告を無視しない。

### 関数

#### 戻り値型の記述

UFUNCTION 以外の関数では、戻り値の型を `auto` と trailing return type（`->`）で記述する。ラムダ式においても戻り値を常に明示する。

```cpp
// 良い例
auto GetPlayerName() -> FString;
auto CalculateScore() -> int32;

// ラムダ
auto Lambda = [](int32 Value) -> bool { return Value > 0; };
```

### 命名

#### 文字列型の使い分け

| 型      | 用途                                          |
| ------- | --------------------------------------------- |
| FName   | 頻用識別子（文字列比較/ハッシュのコスト抑制） |
| FText   | ユーザー表示                                  |
| FString | 一時的文字列処理のみ                          |

### 数値

#### 浮動小数の比較

`==` を避け、`KINDA_SMALL_NUMBER` などの許容誤差で比較する。

#### マジックナンバー禁止

調整値は DataTable/設定/ConsoleVar に移動し、コードに値を直書きしない。

### 文字列

#### UTF-8 → TCHAR 変換

UTF-8 → TCHAR 変換は常に UE の `StringCast` を使用する。`UTF8_TO_TCHAR` 等の旧式マクロは使用しない。

```cpp
// 良い例
auto TCharPtr = StringCast<TCHAR>(Utf8Ptr, Len);

// 悪い例
auto TCharPtr = UTF8_TO_TCHAR(Utf8Ptr);
```

### メタデータ

#### AllowedClasses / DisallowedClasses

短縮名を使用しない。常にフルパスを記述する。

```cpp
// 良い例
UPROPERTY(meta = (AllowedClasses = "/Script/Engine.World"))

// 悪い例
UPROPERTY(meta = (AllowedClasses = "World"))
```

#### BindUFunction

常に `GET_FUNCTION_NAME_CHECKED` を使用する。文字列リテラル/TEXT/FName 直書きを禁止する。

```cpp
// 良い例
Delegate.BindUFunction(this, GET_FUNCTION_NAME_CHECKED(UMyClass, OnCallback));

// 悪い例
Delegate.BindUFunction(this, TEXT("OnCallback"));
```

### API とコメント

公開 API には簡潔な目的/前提/副作用のコメントを付与する。「なぜ」を記し、「どう」はコードで明確化する。

### 例外

C++ 例外は使用しない（UE 標準）。エラーは戻り値/Result型や ensure で扱い、未処理例外を残さない。

### メモリ管理

#### UObject ポインタ

UObject ベースのオブジェクトのポインタをメンバ変数等で維持する時は、生ポインタではなく `TObjectPtr` を使用する。

```cpp
// 良い例
UPROPERTY()
TObjectPtr<AActor> TargetActor;

// 悪い例
UPROPERTY()
AActor* TargetActor;
```

#### 非 UObject のスマートポインタ

非 UObject は `TUniquePtr`/`TSharedPtr`（`MakeUnique`/`MakeShared`）を使用する。

##### TSharedRef 優先

非 null が保証される共有参照は `TSharedRef` を優先し、`TSharedPtr` は「null を許す必要がある場合」に限定する。関数の返り値/メンバー/イベント引数でも、非 null 要件が満たせるなら `TSharedRef` を採用する。

##### 弱参照

循環参照に注意し、任意参照は `TWeakPtr`/`TWeakObjectPtr` を使用する。

#### GC 整合性

UObject 参照は必ず UPROPERTY で GC 管理する。非 UObject の UObject 参照には `TWeakObjectPtr` を使用し、ダングリング参照を防止する。

#### UObject 生成

`NewObject`/`CreateDefaultSubobject` を使用し、Outer/ライフサイクルを明確化する。直接コンストラクタ呼び出しは禁止。

#### 可変 static 禁止

共有可変状態の `static` は原則禁止。必要な共有状態は、所有者と寿命が明確なオブジェクトへ移し、スレッド安全・初期化/破棄順序を明確にする。
