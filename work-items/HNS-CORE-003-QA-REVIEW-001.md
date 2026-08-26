# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-003-QA-REVIEW-001` |
| Title | Independently Review HNS Core 003 Quality Candidate |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `CANCELLED` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `QA_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-003-implementation.md` |
| Reviewed Artifact Hash | `sha256:2e4277a051fc05fe260c4cfea538ca70b9fb0284c8eaa2288e59871a23f8dc58` |
| Maker Execution ID | `IMP-HNS-CORE-003-SCHEMAS-001` |

## Objective

Independently verify HNS-CORE-003 acceptance coverage, fixture behavior, regression safety, and default test discovery against the immutable candidate.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-003-001` through `AC-HNS-CORE-003-004`; all companion Acceptance Criteria
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 5、6、40.1、46 Phase 1；`templates/Work_Item.md`
- Review / Evidence references：`RCE-HNS-CORE-003-IMPLEMENTATION-001`; latest TECH evidence; immutable manifest above

## Read Scope

- Tier 1 governance and `QA_REVIEWER` profile
- Assigned Work Item and active Implementation Gate
- Reviewed manifest and every artifact bound by it
- Direct canonical requirements, Maker evidence, and latest TECH evidence

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest
- `harness/**`
- `.ai/**`
- `docs/**` except append-only review evidence in `docs/08_agent_reviews/review_log.md`
- `templates/**`
- `work-items/**`

## Scope

- Verify all AC coverage, fixture discovery, valid/invalid/boundary behavior, unknown and duplicate handling, Work Item v1/v2 behavior, accountability schemas, wrong enum/version/missing fields, repeatability, non-mutation, and CORE-001/002 regression safety.
- Verify default `npm test` discovers root, core, and all schema tests with no skipped/todo/focused tests.
- Independently run install, build, typecheck, tests, audit, and QA runtime probes.

## Out of Scope

- Modifying candidate artifacts or closing lifecycle status.
- Acting as TECH, Security, Gate Checker, or Implementer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-003-QA-REVIEW-001-001`：Manifest/hash/lineage and latest TECH PASS are valid.
- [ ] `AC-HNS-CORE-003-QA-REVIEW-001-002`：All primary and companion ACs have independent behavior evidence.
- [ ] `AC-HNS-CORE-003-QA-REVIEW-001-003`：Default suite discovers all required test classes with 0 failed/skipped/todo and no regression.
- [ ] `AC-HNS-CORE-003-QA-REVIEW-001-004`：Decision and findings are appended only to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-003-IMPLEMENTATION-001`
- Latest `TECH_REVIEWER` PASS bound to the same manifest hash

## Blockers

- Latest TECH PASS required before execution

## Notes

- Manifest binds all three Maker execution IDs.
- Reviewer decision uses `PASS / REQUEST_CHANGES / BLOCK`; it is not a GateResult.
