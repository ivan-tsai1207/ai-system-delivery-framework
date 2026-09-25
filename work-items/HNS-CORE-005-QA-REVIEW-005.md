# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-QA-REVIEW-005` |
| Title | Independently Validate HNS Core 005 R5 Acceptance and Regression |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `QA_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r5.md` |
| Reviewed Artifact Hash | `sha256:499514daba7b8d7da9cd8cdb83ccfe5499b5a48b614459479741b6b55ee16a71` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R5-001` |

## Objective

Independently validate every HNS-CORE-005 acceptance criterion, all historical finding regressions, false-positive controls, test discovery, and prior CORE regression on R5 after current TECH PASS.

## Requirement References

- Requirement IDs：All HNS-CORE-005 primary and companion ACs
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 6、31-32、35、38、40.1、46 Phase 1
- Review / Evidence references：All R1-R5 evidence and latest same-hash R5 TECH PASS

## Read Scope

- Tier 1 REVIEWER / `QA_REVIEWER`, assigned Work Item, gate, R5 manifest, direct requirements, evidence/findings, reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-QA-REVIEW-005-001`：Current R5 TECH PASS and exact manifest binding are valid.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-005-002`：All primary/companion ACs and historical finding regressions pass independently.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-005-003`：False-positive controls, diagnostics, immutability, narrowing, and negative cases pass.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-005-004`：Default/focused suites pass with no failed/skipped/todo or prior CORE regression.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R5-001`
- Latest same-hash `TECH_REVIEWER` evidence must be `PASS`

## Blockers

- Latest R5 TECH PASS required

## Notes

- Decision: `PASS / REQUEST_CHANGES / BLOCK` only.
