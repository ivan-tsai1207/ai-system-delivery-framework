# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-QA-REVIEW-008` |
| Title | Independently Validate HNS Core 005 R8 Acceptance and Regression |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `QA_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r8.md` |
| Reviewed Artifact Hash | `sha256:e66abaaa9318d7a17870e79509490411a0425f4ac3646e22ff6fc339a4588b95` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R8-001` |

## Objective

Independently validate every HNS-CORE-005 AC, historical finding regression, test discovery, and prior CORE regression on exact R8 after same-hash TECH PASS.

## Requirement References

- All primary/companion ACs; SDD Sections 6, 31-32, 35, 38, 40.1, 46 Phase 1; all R1-R8 evidence; `REV-HNS-CORE-005-TECH-008` same-hash PASS.

## Read Scope

- Tier 1 REVIEWER / `QA_REVIEWER`, assigned Work Item, gate, R8/R7 manifests, requirements, evidence/findings, reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed artifacts/manifests; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-QA-REVIEW-008-001`：Same-hash TECH PASS and effective 15-artifact manifest binding are valid.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-008-002`：All primary/companion ACs and historical regressions pass independently.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-008-003`：False-positive, diagnostics, immutability, narrowing, and negative cases pass.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-008-004`：Default/focused suites pass without failures, skips, todo, or prior CORE regression.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R8-001`; `REV-HNS-CORE-005-TECH-008` = `PASS`

## Blockers

- None

## Notes

- Decision: `PASS / REQUEST_CHANGES / BLOCK` only.
