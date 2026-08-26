# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-003-SECURITY-REVIEW-002` |
| Title | Independently Review HNS Core 003 R2 Dependency Security |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `DONE` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `SECURITY_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-003-implementation-r2.md` |
| Reviewed Artifact Hash | `sha256:e7dcf9d90061a20c78c1286278afecfbd9295a769772b3f818f45aaa118ee60c` |
| Maker Execution ID | `IMP-HNS-CORE-003-REMEDIATION-R2-001` |

## Objective

Independently verify the exact Ajv supply-chain change and R2 validation boundary against the latest immutable candidate.

## Requirement References

- Requirement IDs：all dependency companion ACs; `AC-HNS-CORE-003-004`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 5、6、40.1、46 Phase 1
- Review / Evidence references：Human dependency approval; R2 manifest and Maker evidence

## Read Scope

- Tier 1 REVIEWER and `SECURITY_REVIEWER` context
- Assigned Work Item, active Implementation Gate, R1/R2 manifests
- Package, lock, schema, registry, tests, Maker evidence, and direct requirements

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

- Verify exact `ajv@8.20.0`, integrity, tree, repository/provenance, MIT license, Node 24 compatibility, lifecycle scripts, audit, no alias/confusion, no `ajv-formats` or unauthorized dependency.
- Verify Ajv2020 usage and no fs/process/network/persistence/vendor-adapter security-boundary expansion, including R2 rollback change.

## Out of Scope

- Modifying reviewed artifacts, accepting risk, or acting as TECH, QA, Gate Checker, or Implementer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-003-SECURITY-REVIEW-002-001`：R2 manifest/hash/lineage and Maker separation are valid.
- [ ] `AC-HNS-CORE-003-SECURITY-REVIEW-002-002`：Dependency identity, integrity, license, provenance, tree, scripts, and audit are independently verified.
- [ ] `AC-HNS-CORE-003-SECURITY-REVIEW-002-003`：No unauthorized dependency or security-boundary capability is introduced.
- [ ] `AC-HNS-CORE-003-SECURITY-REVIEW-002-004`：Decision/findings are appended only to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-003-REMEDIATION-R2-001`

## Blockers

- None

## Notes

- R1 Security assignment is stale because the candidate changed before execution.
