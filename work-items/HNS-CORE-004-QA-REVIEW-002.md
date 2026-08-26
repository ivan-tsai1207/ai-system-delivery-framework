# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-004-QA-REVIEW-002` |
| Title | Independently Validate HNS Core 004 R2 Acceptance and Regression |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `LOW` |
| Review Profile | `QA_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-004-implementation-r2.md` |
| Reviewed Artifact Hash | `sha256:d9bee8dc562467809ae8a996d805250c3276d954d81a536e35987f3abbbee2ec` |
| Maker Execution ID | `IMP-HNS-CORE-004-REMEDIATION-R2-001` |

## Objective

Independently validate all HNS-CORE-004 R2 acceptance criteria, compact-marker redaction regression, deterministic behavior, and default root/core/schema/error test discovery after TECH-002 passes.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-004-001` through `AC-HNS-CORE-004-004`; all companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 33、34、40.1、46 Phase 1
- Review / Evidence references：`RCE-HNS-CORE-004-REMEDIATION-R2-001`; `REV-HNS-CORE-004-TECH-002` must be `PASS`

## Read Scope

- Tier 1 REVIEWER and `QA_REVIEWER` context
- Assigned Work Item, active Implementation Gate, R1/R2 manifests
- Maker evidence, latest TECH evidence/finding state, direct requirements, and all reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifests
- `harness/**`
- `.ai/**`
- `docs/**` except append-only `docs/08_agent_reviews/review_log.md`
- `templates/**`
- `work-items/**`

## Scope

- Verify every primary/companion AC, exact metadata/mapping matrices, negative integrity cases, all redaction forms including compact variants, nested causes/details, sentinel containment, immutability/isolation/determinism, default discovery, and CORE-001/002/003 regression.
- Execute only after current TECH-002 evidence is PASS on the same R2 hash.

## Out of Scope

- Modifying reviewed artifacts or acting as TECH, Security, Gate Checker, Implementer, merger, or lifecycle closer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-004-QA-REVIEW-002-001`：Current TECH-002 PASS and exact R2 manifest/hash/candidate binding are valid.
- [ ] `AC-HNS-CORE-004-QA-REVIEW-002-002`：Primary AC-001 through AC-004 and all companion ACs pass independent acceptance checks.
- [ ] `AC-HNS-CORE-004-QA-REVIEW-002-003`：Compact and canonical redaction, cause/details isolation, immutability, deterministic repeats, and negative cases pass.
- [ ] `AC-HNS-CORE-004-QA-REVIEW-002-004`：Default root/core/schema/error discovery and full regression pass with no failed/skipped/todo/focused tests.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-004-REMEDIATION-R2-001`
- `REV-HNS-CORE-004-TECH-002` (`PASS`) on `sha256:d9bee8dc562467809ae8a996d805250c3276d954d81a536e35987f3abbbee2ec`

## Blockers

- Current TECH-002 PASS required before execution

## Notes

- Reviewer must not modify implementation, manifests, Work Items, or prior evidence.

