# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-QA-REVIEW-006` |
| Title | Independently Validate HNS Core 005 R6 Acceptance and Regression |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `QA_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r6.md` |
| Reviewed Artifact Hash | `sha256:a45ddb510402dab45b22a3d31b041ba7bbd230da4b3fa47f75b7cf72e4ae7740` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R6-001` |

## Objective

Independently validate all HNS-CORE-005 acceptance criteria, historical finding regressions, test discovery, and prior CORE regression on exact R6 after same-hash TECH PASS.

## Requirement References

- Requirement IDs：All HNS-CORE-005 primary and companion ACs
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 6、31-32、35、38、40.1、46 Phase 1
- Review / Evidence references：All R1-R6 evidence; `REV-HNS-CORE-005-TECH-006` must be same-hash `PASS`

## Read Scope

- Tier 1 REVIEWER / `QA_REVIEWER`, assigned Work Item, gate, R6 manifest, requirements, evidence/findings, reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-QA-REVIEW-006-001`：Same-hash R6 TECH PASS and exact manifest binding are valid.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-006-002`：All primary/companion ACs and historical finding regressions pass independently.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-006-003`：False-positive controls, diagnostics, immutability, narrowing, and negative cases pass.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-006-004`：Default/focused suites pass without failed/skipped/todo or prior CORE regression.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R6-001`
- `REV-HNS-CORE-005-TECH-006` = `PASS` on exact R6 hash

## Blockers

- None

## Notes

- Decision: `PASS / REQUEST_CHANGES / BLOCK` only.
