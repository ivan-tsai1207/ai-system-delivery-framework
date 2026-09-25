# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-SECURITY-REVIEW-005` |
| Title | Independently Review HNS Core 005 R5 Security Boundaries |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `SECURITY_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r5.md` |
| Reviewed Artifact Hash | `sha256:499514daba7b8d7da9cd8cdb83ccfe5499b5a48b614459479741b6b55ee16a71` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R5-001` |

## Objective

Independently verify the complete R5 security boundary and whether all historical Security and TECH findings are closed without bypass or overblocking.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-005-002` through `004`; relevant companion ACs
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 31-32、38、40.1、46 Phase 1
- Review / Evidence references：All R1-R5 evidence and historical Findings

## Read Scope

- Tier 1 REVIEWER / `SECURITY_REVIEWER`, assigned Work Item, gate, R5 manifest, direct requirements, evidence/findings, reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-005-001`：R5 identity and independent Reviewer binding are valid.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-005-002`：All historical security/classifier findings are closed without disclosure, bypass, or overblocking.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-005-003`：Narrowing, empty baseline, immutability, hostile inputs, safe names, and ordinary text pass.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-005-004`：No credential source, environment injection, I/O, process, adapter, dependency, production, or destructive expansion exists.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R5-001`

## Blockers

- None

## Notes

- Decision: `PASS / REQUEST_CHANGES / BLOCK` only; Findings close only on exact R5 hash.
