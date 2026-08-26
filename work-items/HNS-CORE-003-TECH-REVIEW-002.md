# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-003-TECH-REVIEW-002` |
| Title | Independently Re-review HNS Core 003 R2 Candidate |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `DONE` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `TECH_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-003-implementation-r2.md` |
| Reviewed Artifact Hash | `sha256:e7dcf9d90061a20c78c1286278afecfbd9295a769772b3f818f45aaa118ee60c` |
| Maker Execution ID | `IMP-HNS-CORE-003-REMEDIATION-R2-001` |

## Objective

Independently verify R2 closure of `FIND-HNS-CORE-003-TECH-001` and revalidate the complete HNS-CORE-003 technical candidate.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-003-001` through `AC-HNS-CORE-003-004`; all companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 5、6、40.1、46 Phase 1；`templates/Work_Item.md`
- Review / Evidence references：`REV-HNS-CORE-003-TECH-001`; `FIND-HNS-CORE-003-TECH-001`; `RCE-HNS-CORE-003-REMEDIATION-R2-001`

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

- Reproduce and verify transactional rollback for invalid-keyword and unresolved-reference failures followed by valid same-ID retry.
- Revalidate manifest inheritance/replacements, 12 IDs, version behavior, accountability contracts, determinism, non-mutation, dependency/type boundaries, tests, and scope.

## Out of Scope

- Modifying reviewed artifacts or acting as QA, Security, Gate Checker, or Implementer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-003-TECH-REVIEW-002-001`：R2 manifest/hash/lineage and Maker separation are valid.
- [ ] `AC-HNS-CORE-003-TECH-REVIEW-002-002`：`FIND-HNS-CORE-003-TECH-001` closure is independently validated or remains open with evidence.
- [ ] `AC-HNS-CORE-003-TECH-REVIEW-002-003`：Complete technical regression and required commands pass.
- [ ] `AC-HNS-CORE-003-TECH-REVIEW-002-004`：Decision/finding state is appended only to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-003-REMEDIATION-R2-001`

## Blockers

- None

## Notes

- A PASS may record `FIND-HNS-CORE-003-TECH-001` as `RESOLVED`; the Reviewer must not modify implementation.
