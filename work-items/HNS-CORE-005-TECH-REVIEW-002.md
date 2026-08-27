# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-TECH-REVIEW-002` |
| Title | Independently Re-review HNS Core 005 R2 Candidate |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `DONE` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `TECH_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r2.md` |
| Reviewed Artifact Hash | `sha256:f9ad2bd656bed5a52d9c69c60cdbf2381282ee92aab34c8dab1b06bf44df25c0` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R2-001` |

## Objective

Independently verify the complete R2 candidate and determine whether both R1 TECH findings can be resolved without regression or scope expansion.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-005-001` through `AC-HNS-CORE-005-004`; all companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 6、31-32、35、38、40.1、46 Phase 1
- Review / Evidence references：`RCE-HNS-CORE-005-IMPLEMENTATION-001`; `RCE-HNS-CORE-005-REMEDIATION-R2-001`; `REV-HNS-CORE-005-TECH-001`; both R1 Findings

## Read Scope

- Tier 1 REVIEWER and `TECH_REVIEWER` context
- Assigned Work Item, active Implementation Gate, R2 manifest
- Maker evidence, R1 review/findings, direct requirements, and all reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Scope

- Re-run complete R1 technical checks and commands against R2; reproduce both R1 findings; verify assignment-marker/JWT rejection, diagnostic non-disclosure, safe-name regression, exact R2 artifact identities, and authorized remediation scope.

## Out of Scope

- Modifying reviewed artifacts or acting as QA, Security, Gate Checker, Implementer, merger, or lifecycle closer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-TECH-REVIEW-002-001`：R2 manifest/hash/lineage, artifact replacement/inheritance, and Maker separation are valid.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-002-002`：Both R1 findings are independently reproduced as fixed and may be marked `RESOLVED` only with exact R2 evidence.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-002-003`：All primary/companion contracts and prior technical probes pass without regression or unauthorized expansion.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-002-004`：Required commands/default discovery pass and evidence is appended only to the review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R2-001`

## Blockers

- None

## Notes

- Decision is limited to `PASS / REQUEST_CHANGES / BLOCK`; R1 evidence remains historical.
