# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-004-TECH-REVIEW-001` |
| Title | Independently Review HNS Core 004 Error Registry |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `LOW` |
| Review Profile | `TECH_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-004-implementation.md` |
| Reviewed Artifact Hash | `sha256:3c7289da5b299798e853593fa3b904d77136d579a34891459f550cc520638d5a` |
| Maker Execution ID | `IMP-HNS-CORE-004-ERRORS-001` |

## Objective

Independently verify the HNS-CORE-004 error catalog, exit-code registry, immutable HarnessError contract, redaction boundary, test discovery companion, and authorized candidate scope.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-004-001` through `AC-HNS-CORE-004-004`; all test-discovery companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 33、34、40.1、46 Phase 1
- Review / Evidence references：`RCE-HNS-CORE-004-IMPLEMENTATION-001`

## Read Scope

- Tier 1 REVIEWER and `TECH_REVIEWER` context
- Assigned Work Item, active Implementation Gate, immutable manifest
- Maker evidence, direct requirements, and all reviewed artifacts

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

- Verify all 30 canonical codes and exact metadata/mappings, registry integrity, fail-closed behavior, immutability, typed causes, redaction/message safety, source/result isolation, deterministic behavior, forbidden capability absence, full default tests, and candidate identity.
- Use independent runtime probes in addition to checked-in tests.

## Out of Scope

- Modifying reviewed artifacts or acting as QA, Security, Gate Checker, Implementer, merger, or lifecycle closer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-004-TECH-REVIEW-001-001`：Manifest/hash/lineage, Maker separation, and all artifact identities are valid.
- [ ] `AC-HNS-CORE-004-TECH-REVIEW-001-002`：All Section 33/34 contracts and fail-closed registry behavior pass independent checks.
- [ ] `AC-HNS-CORE-004-TECH-REVIEW-001-003`：HarnessError immutability, typed causes, redaction, message safety, deterministic isolation, and forbidden boundaries pass.
- [ ] `AC-HNS-CORE-004-TECH-REVIEW-001-004`：Required commands and default test discovery pass; decision/findings are appended only to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-004-IMPLEMENTATION-001`

## Blockers

- None

## Notes

- Decision is limited to `PASS / REQUEST_CHANGES / BLOCK`.
- Reviewer must not modify implementation, manifest, Work Items, or prior evidence.

