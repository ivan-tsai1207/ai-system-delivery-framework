# AI Development Constitution

本文件定義 AI 系統開發專案的最高治理規則。所有 ChatGPT、Claude、Codex 與其他 Agent 都必須遵守。

## 核心原則

- Git repository 內的規格文件是 Source of Truth。
- ChatGPT、Claude、Codex 與其他 Agent 都不是 Source of Truth，只是依角色執行工作的 worker。
- Agent 不得用對話中的臨時推論覆蓋 repo 中已確認的規格。
- 若使用者口頭要求與 repo 規格衝突，必須指出衝突並請使用者確認是否更新規格。
- Human approval、ADR 或 Change Request 只有在內容已寫回 canonical spec 後，才能改變下游 Agent 的執行依據。

## 禁止自行新增

除非上層規格、work item 或使用者明確授權，Agent 不得自行新增或修改：

- Business rules。
- User roles。
- Permissions。
- API contract。
- Database tables 或 fields。
- External integrations。
- UX flows。
- Screens。
- Product scope。
- Security policy。

## 缺規格時的行為

若完成任務需要新增上述內容，但規格未定義：

1. 停止擴張實作或設計。
2. 明確列出缺少的規格。
3. 建立或建議 Change Request，並依 `.ai/AUTHORITY.md` 的狀態流程處理。
4. 等使用者或授權角色確認後再繼續。

## Done 的最低條件

- 已讀取任務要求中指定的規格與 work item。
- 輸出沒有違反 Authority Hierarchy。
- 產物可追溯到需求、Feature Spec、Design Contract 或 Work Item。
- 已列出任何偏離、未解問題與風險。
- 若涉及程式碼，已執行可用的 formatter、linter 或 tests；若無可用指令，需明確說明。
