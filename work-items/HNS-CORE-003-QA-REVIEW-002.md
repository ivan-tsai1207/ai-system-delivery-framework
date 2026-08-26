# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-003-QA-REVIEW-002` |
| Title | Independently Review HNS Core 003 R2 Quality Candidate |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `DONE` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `QA_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-003-implementation-r2.md` |
| Reviewed Artifact Hash | `sha256:e7dcf9d90061a20c78c1286278afecfbd9295a769772b3f818f45aaa118ee60c` |
| Maker Execution ID | `IMP-HNS-CORE-003-REMEDIATION-R2-001` |

## Objective

Independently verify R2 acceptance coverage, fixture behavior, rollback regression, default discovery, and CORE-001/002 regression safety.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-003-001` through `AC-HNS-CORE-003-004`; all companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 5、6、40.1、46 Phase 1；`templates/Work_Item.md`
- Review / Evidence references：R2 manifest; latest R2 TECH PASS; `FIND-HNS-CORE-003-TECH-001`

## Read Scope

- Tier 1 REVIEWER and `QA_REVIEWER` context
- Assigned Work Item, active Implementation Gate, R1/R2 manifests
- Maker evidence, latest TECH evidence, Finding, requirements, and all reviewed artifacts

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

- Verify all primary/companion ACs, valid/invalid/boundary fixtures, duplicate/unknown/version/migration behavior, rollback retry cases, determinism, non-mutation, test discovery, and CORE-001/002 regression.
- Independently run install, build, typecheck, default tests, audit, skip scan, and QA probes.

## Out of Scope

- Modifying reviewed artifacts or acting as TECH, Security, Gate Checker, or Implementer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-003-QA-REVIEW-002-001`：R2 manifest/hash/lineage and latest TECH PASS are valid.
- [ ] `AC-HNS-CORE-003-QA-REVIEW-002-002`：All ACs and rollback regression have independent behavior evidence.
- [ ] `AC-HNS-CORE-003-QA-REVIEW-002-003`：Default suite discovers all required classes with 0 failed/skipped/todo.
- [ ] `AC-HNS-CORE-003-QA-REVIEW-002-004`：Decision/findings are appended only to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- Latest R2 `TECH_REVIEWER` PASS bound to the same manifest hash

## Blockers

- Latest R2 TECH PASS required before execution

## Notes

- R1 QA assignment is stale because the candidate changed before execution.
