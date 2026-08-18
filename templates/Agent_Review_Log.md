# Role Completion and Agent Review Log

Canonical project path：`docs/08_agent_reviews/review_log.md`

本模板是 Role Completion Evidence、Independent Review與 Finding的共用紀錄格式。Harness可投影成 versioned machine-readable audit record，但不得建立語意衝突的第二套 evidence / finding enum。

## Evidence Metadata

| Field | Value |
|---|---|
| Evidence ID | `<evidence-id>` |
| Execution ID | `<execution-id>` |
| Work Item | `work-items/<WORK-ITEM-ID>.md` |
| Role | `<PRODUCT_ARCHITECT \| UX_DESIGNER \| IMPLEMENTER \| REVIEWER>` |
| Review Profile | `<canonical-profile-or-N/A>` |
| Risk Class | `<LOW \| MEDIUM \| HIGH \| CRITICAL>` |
| Maker Execution ID | `<execution-id-or-N/A>` |
| Reviewer Execution ID | `<execution-id-or-N/A>` |
| Artifact | `<repository-relative-path-or-manifest>` |
| Artifact Hash | `<sha256:64-lowercase-hex>` |
| Commit Hash | `<commit-or-N/A>` |
| Timestamp | `<ISO-8601-with-timezone>` |

## Specification References

- Requirement IDs：
- Feature / System Spec：
- Screen Specs：
- Architecture / SDD：

## Checks Performed

| Check ID | Check | Method | Evidence Reference | Result |
|---|---|---|---|---|
|  |  |  |  | `PASS / FAILED / NOT_APPLICABLE` |

## Tests Performed

| Test Type | Command / Runner | Result | Evidence Reference |
|---|---|---|---|
| Typecheck |  |  |  |
| Lint |  |  |  |
| Unit Test |  |  |  |
| Integration Test |  |  |  |
| Build |  |  |  |
| Security Check |  |  |  |

Agent自述「測試都通過」不是足夠 evidence。測試 evidence必須可定位至 command / runner、result、timestamp及相同 artifact / commit hash；未執行時填理由與 impact。

## Implementer Scope Evidence

- Changed Files：
- Diff Scope：
- Unauthorized Change Check：
- Backward Compatibility：

非 Implementer填 `N/A`。

## Findings

| Finding ID | Review Profile | Owner Role | Work Item | Artifact / Hash | Requirement Reference | Description | Severity | Evidence Reference | Required Action | Status |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  | `BLOCKING / MAJOR / MINOR / OBSERVATION` |  |  | `OPEN / RESOLVED / ACCEPTED_RISK / SUPERSEDED` |

`OPEN BLOCKING` finding阻止 Delivery Assurance PASS。`ACCEPTED_RISK`必須引用既有 Governance授權的 Human / authority evidence，Agent不得自行決定。

## Known Limitations and Unresolved Issues

- Known Limitations：
- Unresolved Issues：
- Accepted Risk References：

## Result

Maker completion result：`READY_FOR_REVIEW / BLOCKED`。

Reviewer decision：`PASS / REQUEST_CHANGES / BLOCK`。

GateResult不是本欄位，仍由 active Gate記錄 `PASS / FAILED / NEEDS_CLARIFICATION`。

## Integrity and Independence Validation

- [ ] Artifact hash與實際 reviewed version一致。
- [ ] Maker與 final Checker execution ID不同。
- [ ] Reviewer Profile由 Orchestrator / Harness指派。
- [ ] Reviewer execution未修改受審 artifact。
- [ ] Required evidence與 findings已寫入受控 audit / review log。
- [ ] Artifact變更後舊 PASS已標示失效或 superseded。
