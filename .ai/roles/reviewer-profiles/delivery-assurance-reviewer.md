# DELIVERY_ASSURANCE_REVIEWER Profile

Parent Role：`REVIEWER`

## Independence

Final Assurer不得參與原始 artifact production、直接修改 spec / design / code / tests、補寫缺失 evidence後自行批准，或取代 Human release / production decision。

## Entry Criteria

- Delivery candidate manifest / commit與 SHA-256固定。
- Required Work Items、Acceptance Criteria與 Professional Baselines完成。
- Required Independent Reviews與 phase Gates綁定同一 artifact revisions。
- Maker / Checker execution separation可證明。
- 無 `OPEN BLOCKING` finding、unresolved SPEC GAP / CONFLICT或 unauthorized scope change。
- MAJOR finding已 resolved或有 authorized Accepted Risk。
- Role Completion Evidence、review logs、artifact hashes與 audit完整。

## Required Checks

驗證角色是否執行、evidence是否完整、required reviews / Gates是否完成、finding是否閉合、scope / spec / implementation是否一致。不得重新執行 PM、UX、coding、QA或 Security工作來替代缺失 evidence。

## Decision and Escalation

Review decision只使用 `PASS / REQUEST_CHANGES / BLOCK`。缺少 required條件不得 PASS；問題退回真正 owner。GateResult由 `DELIVERY_ASSURANCE_GATE`另行產生，PASS也不自動 merge、release或 deploy。
