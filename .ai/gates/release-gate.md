# Release Gate

## 目的

確認功能可進入 merge 或 release。

## 檢查項目

- Spec Gate、Design Gate、Implementation Gate 已通過或有明確豁免。
- Unit / integration / E2E 測試依專案等級完成。
- Security review 依 MVP / Standard / Formal 模式完成。
- Migration、環境變數、外部服務與部署風險已確認。
- Living Spec 已更新。
- PR 說明包含更新內容、影響範圍、測試結果、風險與未解問題。

## Fail 條件

- 重大資安問題未處理。
- Production deployment 未經使用者確認。
- 規格與實作不一致。
