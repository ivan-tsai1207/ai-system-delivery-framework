# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-003-TECH-REVIEW-001` |
| Title | Independently Review HNS Core 003 Technical Candidate |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `DONE` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `TECH_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-003-implementation.md` |
| Reviewed Artifact Hash | `sha256:2e4277a051fc05fe260c4cfea538ca70b9fb0284c8eaa2288e59871a23f8dc58` |
| Maker Execution ID | `IMP-HNS-CORE-003-SCHEMAS-001` |

## Objective

Independently verify the immutable HNS-CORE-003 candidate against its canonical schema registry, validation boundary, scope, dependency, and TypeScript contracts.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-003-001` through `AC-HNS-CORE-003-004`; all companion Acceptance Criteria
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 5、6、40.1、46 Phase 1；`templates/Work_Item.md`
- Review / Evidence references：`RCE-HNS-CORE-003-IMPLEMENTATION-001`; immutable manifest above

## Read Scope

- Tier 1 governance and `TECH_REVIEWER` profile
- Assigned Work Item and active Implementation Gate
- Reviewed manifest and every artifact bound by it
- Direct canonical requirements and Maker evidence

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

- Verify manifest SHA-256 and candidate lineage.
- Verify all 12 canonical IDs, exact resolution, duplicate/unknown fail-closed behavior, Work Item v1 migration-only behavior, v2 behavior, accountability schemas, deterministic results, no input mutation, Draft 2020-12 Ajv usage, strict TypeScript, and authorized scope.
- Independently run install, build, typecheck, default tests, audit, and targeted runtime probes.

## Out of Scope

- Modifying candidate artifacts or closing lifecycle status.
- Acting as QA, Security, Gate Checker, or Implementer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-003-TECH-REVIEW-001-001`：Manifest/hash/lineage and Maker separation are valid.
- [ ] `AC-HNS-CORE-003-TECH-REVIEW-001-002`：Technical contract and all HNS-CORE-003 ACs are independently verified.
- [ ] `AC-HNS-CORE-003-TECH-REVIEW-001-003`：Required commands and independent probes pass with no scope drift.
- [ ] `AC-HNS-CORE-003-TECH-REVIEW-001-004`：Decision and findings are appended only to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-003-IMPLEMENTATION-001`

## Blockers

- None

## Notes

- Manifest binds all Maker executions: dependency `IMP-HNS-CORE-003-DEPENDENCY-001`, schema `IMP-HNS-CORE-003-SCHEMAS-001`, and test discovery `IMP-HNS-CORE-003-TEST-DISCOVERY-001`.
- Reviewer decision uses `PASS / REQUEST_CHANGES / BLOCK`; it is not a GateResult.
