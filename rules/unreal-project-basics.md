## Unreal Engine プロジェクト基本方針

### 実装言語

- C++のみで完結できる場合は、C++のみで完結する。
- ブループリントのイベントグラフは使用せず、すべてC++で実装する。
- ウィジェットを作成する際は、Slate を使用する。

### コーディング規約

以下のコーディング規約を遵守する：

- Unreal Engine 公式コーディング規約: https://dev.epicgames.com/documentation/ja-jp/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine
- C++ Core Guidelines: https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines

### 意思決定の優先順位

設計判断が衝突する場合は、以下の優先順位で最適化する：

保守性 ＞ テスト可能性 ＞ 拡張性 ＞ 可読性
