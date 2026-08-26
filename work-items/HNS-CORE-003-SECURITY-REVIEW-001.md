# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-003-SECURITY-REVIEW-001` |
| Title | Independently Review HNS Core 003 Dependency Security |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `SECURITY_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-003-implementation.md` |
| Reviewed Artifact Hash | `sha256:2e4277a051fc05fe260c4cfea538ca70b9fb0284c8eaa2288e59871a23f8dc58` |
| Maker Execution ID | `IMP-HNS-CORE-003-SCHEMAS-001` |

## Objective

Independently assess the exact Ajv dependency trust change and HNS-CORE-003 validation boundary against the immutable candidate.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-003-DEPENDENCY-AJV-001` through `AC-HNS-CORE-003-DEPENDENCY-AJV-010`; `AC-HNS-CORE-003-004`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 5、6、40.1、46 Phase 1
- Review / Evidence references：Human dependency approval; `RCE-HNS-CORE-003-IMPLEMENTATION-001`; immutable manifest above

## Read Scope

- Tier 1 governance and `SECURITY_REVIEWER` profile
- Assigned Work Item and active Implementation Gate
- Reviewed manifest and all package, lock, schema, registry, and test artifacts bound by it
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

- Verify exact `ajv@8.20.0`, lockfile integrity, dependency tree, registry/repository identity, MIT license, Node 24 compatibility, lifecycle/install-script behavior, audit status, absence of aliases/confusion, and absence of `ajv-formats` or other unauthorized dependencies.
- Verify Ajv uses Draft 2020-12 entrypoint and production schema code adds no filesystem/process/network/persistence or vendor-adapter capability.
- Independently run install, build, typecheck, tests, audit, package-tree and package-metadata checks.

## Out of Scope

- Modifying candidate artifacts, accepting risk, or closing lifecycle status.
- Acting as TECH, QA, Gate Checker, or Implementer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-003-SECURITY-REVIEW-001-001`：Manifest/hash/lineage and Maker separation are valid.
- [ ] `AC-HNS-CORE-003-SECURITY-REVIEW-001-002`：Dependency identity, exact pin, integrity, license, provenance, tree, scripts, and audit are independently verified.
- [ ] `AC-HNS-CORE-003-SECURITY-REVIEW-001-003`：No unauthorized dependency or security-boundary capability is introduced.
- [ ] `AC-HNS-CORE-003-SECURITY-REVIEW-001-004`：Decision and findings are appended only to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-003-IMPLEMENTATION-001`

## Blockers

- None

## Notes

- Manifest binds all three Maker execution IDs; dependency Maker is `IMP-HNS-CORE-003-DEPENDENCY-001`.
- Reviewer decision uses `PASS / REQUEST_CHANGES / BLOCK`; it is not a GateResult.
