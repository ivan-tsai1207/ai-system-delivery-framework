# Release Gate

## 目的

確認功能可進入 merge 或 release。

## 檢查項目

- Spec Gate、Design Gate、Implementation Gate 已通過或有明確豁免。
- Required Independent Reviews與 `DELIVERY_ASSURANCE_GATE`已通過，且 evidence綁定目前 release candidate。
- Unit / integration / E2E 測試依專案等級完成。
- Security review 依 MVP / Standard / Formal 模式完成。
- Migration、環境變數、外部服務與部署風險已確認。
- Living Spec 已更新。
- PR 說明包含更新內容、影響範圍、測試結果、風險與未解問題。

## Fail 條件

- 重大資安問題未處理。
- Production deployment 未經使用者確認。
- 規格與實作不一致。
- Required Delivery Assurance缺失、失效、存在 `OPEN BLOCKING` finding或 candidate hash已改變。

## Result Separation

Reviewer / Assurance decision使用 `PASS / REQUEST_CHANGES / BLOCK`；本 GateResult只使用 `PASS / FAILED / NEEDS_CLARIFICATION`。Release Gate PASS仍不取代 production deployment或 merge to `main`所需 Human approval。
