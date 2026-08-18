# Spec Gate

## 目的

確認 Product Vision、PRD、Architecture / SDD 與 Feature Spec 之間沒有重大矛盾。

## 檢查項目

- 所有 functional requirement 有 Requirement ID。
- 重要需求有 acceptance criteria。
- Roles 與 permissions 已定義。
- Business rules 沒有互相矛盾。
- Feature Spec 指向 canonical PRD、SRS、Architecture 與 SDD。
- 未解問題已列入 open questions 或 work item。
- 存在由獨立 `SPEC_REVIEWER` 產生、綁定目前 Spec artifact hash 的 required review evidence。
- Maker execution與 final Checker execution不同，且 review decision為 `PASS`。

## Fail 條件

- Feature Spec 違反 PRD 或 Product Vision。
- API、資料模型、權限或角色未定義但被下游文件使用。
- 需求範圍重大不明。
- 下層文件與上層 canonical spec 衝突；此時回報 `SPEC CONFLICT`。
- 缺少 required `SPEC_REVIEWER` evidence、artifact hash不符、self approval或存在 `OPEN BLOCKING` finding。

## Result Separation

Reviewer decision使用 `PASS / REQUEST_CHANGES / BLOCK`；本 GateResult只使用 `PASS / FAILED / NEEDS_CLARIFICATION`，不得混為同一 enum。
