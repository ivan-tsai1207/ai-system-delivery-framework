# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-QA-REVIEW-003` |
| Title | Independently Validate HNS Core 005 R3 Acceptance and Regression |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `CANCELLED` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `QA_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r3.md` |
| Reviewed Artifact Hash | `sha256:328a6a6bb984e37027275360c9b556e7eb3468fb874b078f73173f9292337410` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R3-001` |

## Objective

Independently validate every HNS-CORE-005 acceptance criterion, all finding regressions, false-positive controls, test discovery, and prior CORE regression on R3 after current TECH PASS.

## Requirement References

- Requirement IDs：All HNS-CORE-005 primary and companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 6、31-32、35、38、40.1、46 Phase 1
- Review / Evidence references：All R1-R3 Maker evidence; prior findings; latest R3 TECH evidence must be `PASS`

## Read Scope

- Tier 1 REVIEWER / `QA_REVIEWER`, assigned Work Item, gate, R3 manifest, Maker/review/finding evidence, direct requirements, reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Scope

- Validate all ACs, normal/boundary/negative behavior, all five historical finding regressions, non-disclosure, safe-name/ordinary-text controls, default/focused suites, and CORE-001 through CORE-004 regression.

## Out of Scope

- Any artifact modification, TECH/Security/Gate/merge/lifecycle authority.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-QA-REVIEW-003-001`：Current R3 TECH PASS and exact manifest binding are valid.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-003-002`：All primary/companion ACs and historical finding regressions pass independently.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-003-003`：False-positive controls, diagnostics, immutability, narrowing, and negative cases pass.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-003-004`：Default/focused suites pass with no failed/skipped/todo or prior CORE regression.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R3-001`
- Latest `TECH_REVIEWER` evidence on `sha256:328a6a6bb984e37027275360c9b556e7eb3468fb874b078f73173f9292337410` must be `PASS`

## Blockers

- Latest R3 TECH PASS required

## Notes

- Decision: `PASS / REQUEST_CHANGES / BLOCK` only.
