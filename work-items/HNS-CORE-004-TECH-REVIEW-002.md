# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-004-TECH-REVIEW-002` |
| Title | Independently Re-review HNS Core 004 R2 Candidate |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `LOW` |
| Review Profile | `TECH_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-004-implementation-r2.md` |
| Reviewed Artifact Hash | `sha256:d9bee8dc562467809ae8a996d805250c3276d954d81a536e35987f3abbbee2ec` |
| Maker Execution ID | `IMP-HNS-CORE-004-REMEDIATION-R2-001` |

## Objective

Independently verify R2 closure of `FND-HNS-CORE-004-TECH-001-001` and revalidate the complete HNS-CORE-004 technical candidate.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-004-001` through `AC-HNS-CORE-004-004`; all companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 33、34、40.1、46 Phase 1
- Review / Evidence references：`REV-HNS-CORE-004-TECH-001`; `FND-HNS-CORE-004-TECH-001-001`; `RCE-HNS-CORE-004-REMEDIATION-R2-001`

## Read Scope

- Tier 1 REVIEWER and `TECH_REVIEWER` context
- Assigned Work Item, active Implementation Gate, R1 and R2 manifests
- Maker and prior TECH evidence, Finding, direct requirements, and all reviewed artifacts

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

- Reproduce all six compact-marker bypasses and verify details/message/stack/cause/JSON containment.
- Revalidate manifest inheritance/replacements, exact 30-row catalog, 0-8 exit registry, fail-closed behavior, immutability, typed causes, deterministic isolation, tests, and forbidden boundaries.

## Out of Scope

- Modifying reviewed artifacts or acting as QA, Security, Gate Checker, Implementer, merger, or lifecycle closer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-004-TECH-REVIEW-002-001`：R2 manifest/hash/lineage, inheritance, replacements, and Maker separation are valid.
- [ ] `AC-HNS-CORE-004-TECH-REVIEW-002-002`：`FND-HNS-CORE-004-TECH-001-001` closure is independently validated or remains open with evidence.
- [ ] `AC-HNS-CORE-004-TECH-REVIEW-002-003`：Complete technical contracts, regressions, runtime probes, and required commands pass.
- [ ] `AC-HNS-CORE-004-TECH-REVIEW-002-004`：Decision/finding state is appended only to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-004-REMEDIATION-R2-001`

## Blockers

- None

## Notes

- A PASS may record `FND-HNS-CORE-004-TECH-001-001` as `RESOLVED`; the Reviewer must not modify implementation.

