# Design Gate

## 目的

確認 Claude 或 UX Designer 的設計沒有新增未授權 product capability，且可追溯到 Feature Spec。

## 檢查項目

- Figma、Claude design output、HTML prototype 或其他 raw design source 已記錄於 `design/<feature>/Design_Source_Map.md`。
- Raw design source 已轉成 Screen Spec / UX Contract，不直接作為 Source of Truth。
- 每個 screen 有 Screen ID，並保存於 `design/<feature>/screens/<SCREEN-ID>.md`。
- 每個 action 可追溯到 requirement 或 feature spec。
- Role visibility 與 permission 一致。
- API binding 不超出既有 API contract。
- States 包含 loading、empty、loaded、error、permission-denied 等必要狀態。
- Responsive、accessibility、empty state 與 error behaviour 已定義。

## Fail 條件

- 新增未授權 screen、action、role、permission、API 或 business rule。
- Design 與 Feature Spec / PRD 衝突。
- Screen 無法追溯到需求。
- Codex 直接依 raw Figma / Claude design / HTML prototype 實作，且未經 Design Gate。
