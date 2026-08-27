# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-TECH-REVIEW-001` |
| Title | Independently Review HNS Core 005 Config and Canonical Hash Foundation |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `DONE` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `TECH_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation.md` |
| Reviewed Artifact Hash | `sha256:432afa16c262c514d36eb74e212d322f5579f641dc7e0883ac9266fee8a99b0d` |
| Maker Execution ID | `EXE-HNS-CORE-005-MAKER-001` |

## Objective

Independently verify HNS-CORE-005 canonical serialization, SHA-256, config loading/narrowing, environment-policy foundation, test discovery, and authorized candidate scope.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-005-001` through `AC-HNS-CORE-005-004`; all test-discovery companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 6、31-32、35、38、40.1、46 Phase 1
- Review / Evidence references：`RCE-HNS-CORE-005-IMPLEMENTATION-001`

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

- Verify canonical byte/hash correctness, normalized key/value handling, unsupported-value rejection, deterministic and path-independent behavior, mismatch redaction, config validation, narrowing-only precedence, immutable outputs, environment allowlist policy, dependency and capability boundaries, test discovery, and candidate identity.
- Use independent runtime probes in addition to checked-in tests.

## Out of Scope

- Modifying reviewed artifacts or acting as QA, Security, Gate Checker, Implementer, merger, or lifecycle closer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-TECH-REVIEW-001-001`：Manifest/hash/lineage, Maker separation, and all artifact identities are valid.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-001-002`：Canonical UTF-8/SHA-256 correctness, determinism, normalization, mismatch behavior, and fail-closed boundaries pass independent checks.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-001-003`：Config version/key/value validation, narrowing precedence, immutability, environment policy, and forbidden boundaries pass.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-001-004`：Required commands and default test discovery pass; decision/findings are appended only to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-IMPLEMENTATION-001`

## Blockers

- None

## Notes

- Decision is limited to `PASS / REQUEST_CHANGES / BLOCK`.
- Reviewer must not modify implementation, manifest, Work Items, or prior evidence.
