# Delivery Assurance Gate

Gate ID：`DELIVERY_ASSURANCE_GATE`

## Purpose

在 Release Gate前，獨立確認 Maker / Checker / Assurer separation、required reviews、findings、Gate results與 evidence完整性。此 Gate不重做 Spec、UX、coding、QA或 Security review。

## Required Work Item Binding

```text
Role: REVIEWER
Phase: REVIEW
Review Profile: DELIVERY_ASSURANCE_REVIEWER
Required Gates: DELIVERY_ASSURANCE_GATE
```

## Checks

- Delivery candidate artifact / commit與 reviewed manifest已固定並有 SHA-256。
- Required Work Items、Acceptance Criteria與 Professional Baselines完成。
- Required Reviewer Profiles由 Orchestrator / Harness指派並完成 independent executions。
- Maker與 final Checker execution IDs不同；Assurer未參與原始 artifact production。
- Existing phase Gates全部通過且綁定同一 candidate revisions。
- 無 `OPEN BLOCKING` finding、unresolved SPEC GAP / CONFLICT或 unauthorized scope change。
- MAJOR finding已 resolved或有有效 Human / governance `ACCEPTED_RISK` evidence。
- Role Completion Evidence、review logs、artifact hashes與 audit完整可驗證。

## Fail Conditions

- Required review / Gate / evidence缺失或 stale。
- Self approval、same-execution review、Reviewer self-selection或 Risk被 Agent降低。
- Artifact hash變更但沿用舊 PASS。
- 存在 `OPEN BLOCKING` finding、未授權變更或 unresolved conflict。
- Delivery Assurer修改受審 artifact或補寫 evidence後自行批准。

## Result

Delivery Assurance review decision使用 `PASS / REQUEST_CHANGES / BLOCK`；本 GateResult只使用 `PASS / FAILED / NEEDS_CLARIFICATION`。

Gate `PASS`只表示 delivery assurance完整，不自動 merge、release或 deploy，也不取代既有 Human approval。
