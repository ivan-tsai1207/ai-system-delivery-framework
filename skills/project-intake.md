# project-intake

## 觸發條件

- 使用者以自然語言提出新概念、新專案或新產品想法。
- 使用者說「幫我整理成系統」、「幫我做 MVP」或「幫我規劃一個產品」。
- 使用者同時提供 GitHub、PDF、Google Doc、SQL、Markdown、source code 或其他資料來源。

## Contract

依 `.ai/PROJECT_INTAKE_CONTRACT.md` 執行。此 skill 是操作入口，不建立新的 Authority、Role、Gate 或 Git strategy。

## 執行步驟

1. 記錄原始需求並分類 intent；無法確認時先做最小必要釐清。
2. 對 `NEW_PROJECT` 建立 Project Context；有資料來源時依 `skills/source-map-builder.md` 登錄。
3. 推導 safe facts、標示 assumptions，只詢問 material unknowns。
4. 產生完整 Project Proposal，呈現 repo target、visibility 與主要決策。
5. 等待 `APPROVE_PROJECT`、`REQUEST_CHANGES` 或 `CANCEL`。
6. 只有取得明確核准後，才依 `skills/github-project-sync.md` 交給 Repo Provisioner。
7. Provisioning 完成後，產生內部 spec work item，交由 Harness 以 `PRODUCT_ARCHITECT` 建立 canonical specs。

## 輸出

- Intent classification。
- Project Context。
- Project Proposal 與 approval state。
- Approved repository target 與 framework version provenance。
- Generated spec paths、initial work items 與 handoff status。

## 停止條件

- Intent 不明、缺少關鍵需求或發現規格衝突。
- Project Proposal 尚未核准、被要求修改或取消。
- Repository creation、bootstrap、spec generation、Spec Gate 或 Agent dispatch 失敗。
- 任務要求越過 Authority、Role、Gate、approval 或 repository boundary。
