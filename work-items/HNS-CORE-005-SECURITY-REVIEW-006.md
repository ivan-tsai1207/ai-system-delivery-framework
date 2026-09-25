# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-SECURITY-REVIEW-006` |
| Title | Independently Review HNS Core 005 R6 Security Boundaries |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `SECURITY_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r6.md` |
| Reviewed Artifact Hash | `sha256:a45ddb510402dab45b22a3d31b041ba7bbd230da4b3fa47f75b7cf72e4ae7740` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R6-001` |

## Objective

Independently verify the complete R6 security boundary and formally resolve or retain every Security-owned historical finding on exact R6.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-005-002` through `004`; relevant companion ACs
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 31-32、38、40.1、46 Phase 1
- Review / Evidence references：All R1-R6 evidence and historical Findings

## Read Scope

- Tier 1 REVIEWER / `SECURITY_REVIEWER`, assigned Work Item, gate, R6 manifest, requirements, evidence/findings, reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-006-001`：R6 identity and independent Reviewer binding are valid.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-006-002`：All historical security/classifier findings are closed without disclosure, bypass, or overblocking.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-006-003`：Narrowing, empty baseline, immutability, hostile inputs, safe names, and ordinary text pass.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-006-004`：No credential source, environment injection, I/O, process, adapter, dependency, production, or destructive expansion exists.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R6-001`

## Blockers

- None

## Notes

- Decision: `PASS / REQUEST_CHANGES / BLOCK` only; Security-owned findings close only on exact R6 hash.
