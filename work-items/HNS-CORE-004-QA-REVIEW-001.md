# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-004-QA-REVIEW-001` |
| Title | Independently Validate HNS Core 004 Acceptance and Regression |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `LOW` |
| Review Profile | `QA_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-004-implementation.md` |
| Reviewed Artifact Hash | `sha256:3c7289da5b299798e853593fa3b904d77136d579a34891459f550cc520638d5a` |
| Maker Execution ID | `IMP-HNS-CORE-004-ERRORS-001` |

## Objective

Independently validate all HNS-CORE-004 acceptance criteria, error/redaction regressions, deterministic behavior, and default root/core/schema/error test discovery after the latest TECH_REVIEWER passes.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-004-001` through `AC-HNS-CORE-004-004`; all test-discovery companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 33、34、40.1、46 Phase 1
- Review / Evidence references：`RCE-HNS-CORE-004-IMPLEMENTATION-001`; latest `TECH_REVIEWER` evidence must be `PASS`

## Read Scope

- Tier 1 REVIEWER and `QA_REVIEWER` context
- Assigned Work Item, active Implementation Gate, immutable manifest
- Maker evidence, latest TECH evidence/findings, direct requirements, and all reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest
- `harness/**`
- `.ai/**`
- `docs/**` except append-only `docs/08_agent_reviews/review_log.md`
- `templates/**`
- `work-items/**`

## Scope

- Verify every primary and companion AC, exact 30-code coverage and metadata, 0-8 mappings, duplicate/unknown/missing cases, nested redaction and sentinel behavior, typed cause and immutability, source/result isolation, deterministic repeats, default discovery, no skipped/todo/only, and CORE-001/002/003 regression.
- Execute only after current TECH evidence is PASS on the same artifact hash.

## Out of Scope

- Modifying reviewed artifacts or acting as TECH, Security, Gate Checker, Implementer, merger, or lifecycle closer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-004-QA-REVIEW-001-001`：Latest TECH PASS and exact manifest/hash/candidate binding are valid.
- [ ] `AC-HNS-CORE-004-QA-REVIEW-001-002`：Primary AC-001 through AC-004 and all companion ACs pass independent acceptance checks.
- [ ] `AC-HNS-CORE-004-QA-REVIEW-001-003`：Redaction, cause/details isolation, immutability, deterministic repeats, and negative cases pass.
- [ ] `AC-HNS-CORE-004-QA-REVIEW-001-004`：Default root/core/schema/error discovery and full regression pass with no failed/skipped/todo/focused tests.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-004-IMPLEMENTATION-001`
- Latest `TECH_REVIEWER` evidence on `sha256:3c7289da5b299798e853593fa3b904d77136d579a34891459f550cc520638d5a` must be `PASS`

## Blockers

- Latest TECH PASS required before execution

## Notes

- Decision is limited to `PASS / REQUEST_CHANGES / BLOCK`.
- Reviewer must not modify implementation, manifest, Work Items, or prior evidence.

