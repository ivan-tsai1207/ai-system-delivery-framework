# Design Gate

## 目的

確認 Claude 或 UX Designer 的設計沒有新增未授權 product capability，且可追溯到 Feature Spec。

## 檢查項目

- 每個 screen 有 Screen ID。
- 每個 action 可追溯到 requirement 或 feature spec。
- Role visibility 與 permission 一致。
- API binding 不超出既有 API contract。
- States 包含 loading、empty、loaded、error、permission-denied 等必要狀態。
- Responsive、accessibility、empty state 與 error behaviour 已定義。

## Fail 條件

- 新增未授權 screen、action、role、permission、API 或 business rule。
- Design 與 Feature Spec / PRD 衝突。
- Screen 無法追溯到需求。
