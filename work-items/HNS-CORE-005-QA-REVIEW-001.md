# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-QA-REVIEW-001` |
| Title | Independently Validate HNS Core 005 Acceptance and Regression |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `QA_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation.md` |
| Reviewed Artifact Hash | `sha256:432afa16c262c514d36eb74e212d322f5579f641dc7e0883ac9266fee8a99b0d` |
| Maker Execution ID | `EXE-HNS-CORE-005-MAKER-001` |

## Objective

Independently validate all HNS-CORE-005 acceptance criteria, negative/boundary behavior, determinism, redacted diagnostics, narrowing precedence, and full regression after the current TECH review passes.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-005-001` through `AC-HNS-CORE-005-004`; all test-discovery companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 6、31-32、35、38、40.1、46 Phase 1
- Review / Evidence references：`RCE-HNS-CORE-005-IMPLEMENTATION-001`; latest `TECH_REVIEWER` evidence must be `PASS`

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

- Verify every primary and companion AC, normal/boundary/negative cases, Unicode and path-independent determinism, known SHA-256 vectors and mismatch diagnostics, config version/unknown/secret rejection, narrowing precedence, environment allowlist behavior, immutability, default discovery, and prior CORE regression.

## Out of Scope

- Modifying reviewed artifacts or acting as TECH, Security, Gate Checker, Implementer, merger, or lifecycle closer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-QA-REVIEW-001-001`：Latest TECH PASS and exact manifest/hash/candidate binding are valid.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-001-002`：Primary AC-001 through AC-004 and all companion ACs pass independent acceptance checks.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-001-003`：Determinism, Unicode, hash mismatch redaction, config rejection/narrowing, immutability, and environment negative cases pass.
- [ ] `AC-HNS-CORE-005-QA-REVIEW-001-004`：Default and focused suites pass with no failed/skipped/todo tests and no prior CORE regression.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-IMPLEMENTATION-001`
- Latest `TECH_REVIEWER` evidence on `sha256:432afa16c262c514d36eb74e212d322f5579f641dc7e0883ac9266fee8a99b0d` must be `PASS`

## Blockers

- Latest TECH PASS required before execution

## Notes

- Decision is limited to `PASS / REQUEST_CHANGES / BLOCK`.
- Reviewer must not modify implementation, manifest, Work Items, or prior evidence.
