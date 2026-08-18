# Implementation Gate

## 目的

確認 Codex 或 Implementer 的程式碼符合 Feature Spec、Design Contract 與 Work Item。

## 檢查項目

- Diff 只修改 work item 授權的路徑。
- 沒有新增未授權 API、DB schema、role、permission 或 UX flow。
- 測試涵蓋 acceptance scenarios。
- API 行為符合 contract。
- UI 符合 Screen Spec 與 Design Token Mapping。
- 已執行可用 formatter、linter、tests。

## Fail 條件

- Code 偏離 Feature Spec 或 Design Contract。
- 新增未授權能力。
- 重要 acceptance criteria 未驗證。
- 測試失敗且未說明。
