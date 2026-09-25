# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-QA-REVIEW-004` |
| Title | Independently Validate HNS Core 005 R4 Acceptance and Regression |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `CANCELLED` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `QA_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r4.md` |
| Reviewed Artifact Hash | `sha256:b9767c48f911032bee57416e024f1363fb20c15a7d9862731fbae50151052314` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R4-001` |

## Objective

Independently validate every HNS-CORE-005 acceptance criterion, all finding regressions, false-positive controls, test discovery, and prior CORE regression on R4 after current TECH PASS.

## Requirement References

- Requirement IDs：All HNS-CORE-005 primary and companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 6、31-32、35、38、40.1、46 Phase 1
- Review / Evidence references：All R1-R4 Maker evidence; prior findings; latest R4 TECH evidence must be `PASS`

## Read Scope

- Tier 1 REVIEWER / `QA_REVIEWER`, assigned Work Item, gate, R4 manifest, Maker/review/finding evidence, direct requirements, reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Scope

- Validate all ACs, normal/boundary/negative behavior, every historical finding regression, non-disclosure, safe-name/ordinary-text controls, default/focused suites, and CORE-001 through CORE-004 regression.

## Out of Scope

- Any artifact modification, TECH/Security/Gate/merge/lifecycle authority.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-QA-REVIEW-004-001`：Current R4 TECH PASS and exact manifest binding are valid.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-004-002`：All primary/companion ACs and historical finding regressions pass independently.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-004-003`：False-positive controls, diagnostics, immutability, narrowing, and negative cases pass.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-004-004`：Default/focused suites pass with no failed/skipped/todo or prior CORE regression.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R4-001`
- Latest `TECH_REVIEWER` evidence on `sha256:b9767c48f911032bee57416e024f1363fb20c15a7d9862731fbae50151052314` must be `PASS`

## Blockers

- Latest R4 TECH PASS required

## Notes

- Decision: `PASS / REQUEST_CHANGES / BLOCK` only.
