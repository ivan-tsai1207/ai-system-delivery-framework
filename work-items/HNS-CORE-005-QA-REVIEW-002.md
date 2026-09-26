# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-QA-REVIEW-002` |
| Title | Independently Validate HNS Core 005 R2 Acceptance and Regression |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `DONE` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `QA_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r2.md` |
| Reviewed Artifact Hash | `sha256:f9ad2bd656bed5a52d9c69c60cdbf2381282ee92aab34c8dab1b06bf44df25c0` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R2-001` |

## Objective

Independently validate all HNS-CORE-005 and companion acceptance criteria, R1 finding regressions, and full suite behavior on the R2 candidate after current TECH PASS.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-005-001` through `AC-HNS-CORE-005-004`; all companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 6、31-32、35、38、40.1、46 Phase 1
- Review / Evidence references：R1/R2 Maker evidence; both R1 Findings; latest R2 TECH evidence must be `PASS`

## Read Scope

- Tier 1 REVIEWER and `QA_REVIEWER` context
- Assigned Work Item, active Implementation Gate, R2 manifest
- Maker evidence, R1/R2 TECH evidence/findings, direct requirements, and reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Scope

- Verify every primary/companion AC, normal/boundary/negative cases, R1 finding regressions, Unicode/hash behavior, config narrowing/redaction/environment behavior, immutability, default discovery, and prior CORE regression.

## Out of Scope

- Modifying reviewed artifacts or acting as TECH, Security, Gate Checker, Implementer, merger, or lifecycle closer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-QA-REVIEW-002-001`：Latest R2 TECH PASS and exact manifest/hash binding are valid.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-002-002`：Every primary and companion AC passes independent acceptance tests.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-002-003`：Both R1 regressions, diagnostic non-disclosure, safe-name preservation, and negative cases pass.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-002-004`：Default/focused suites pass with no failed/skipped/todo tests or prior CORE regression.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R2-001`
- Latest `TECH_REVIEWER` evidence on `sha256:f9ad2bd656bed5a52d9c69c60cdbf2381282ee92aab34c8dab1b06bf44df25c0` must be `PASS`

## Blockers

- Latest R2 TECH PASS required before execution

## Notes

- Decision is limited to `PASS / REQUEST_CHANGES / BLOCK`.
