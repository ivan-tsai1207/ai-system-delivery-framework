# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-SECURITY-REVIEW-004` |
| Title | Independently Review HNS Core 005 R4 Security Boundaries |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `CANCELLED` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `SECURITY_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r4.md` |
| Reviewed Artifact Hash | `sha256:b9767c48f911032bee57416e024f1363fb20c15a7d9862731fbae50151052314` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R4-001` |

## Objective

Independently verify the complete R4 security boundary and determine whether all historical Security and R3 TECH findings can be resolved without bypass or overblocking.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-005-002` through `004`; relevant companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 31-32、38、40.1、46 Phase 1
- Review / Evidence references：All R1-R4 Maker/review evidence and all historical Findings

## Read Scope

- Tier 1 REVIEWER / `SECURITY_REVIEWER`, assigned Work Item, gate, R4 manifest, Maker/review/finding evidence, direct requirements, reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Scope

- Reproduce all prior security and R3 TECH findings, probe generalized secret rejection and diagnostics, process-injection environment classes, safe-name and ordinary-text controls, hostile inputs, narrowing, immutability, empty baseline, and forbidden capability/dependency absence.

## Out of Scope

- Any artifact modification, TECH/QA/Gate/accepted-risk/merge/lifecycle authority.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-004-001`：R4 identity and independent Reviewer binding are valid.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-004-002`：All historical security/classifier findings are independently closed without disclosure, bypass, or overblocking.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-004-003`：Narrowing, empty baseline, immutability, hostile inputs, safe names, and ordinary text pass.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-004-004`：No credential source, environment injection, I/O, process, adapter, dependency, production, or destructive expansion exists.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R4-001`

## Blockers

- None

## Notes

- Decision: `PASS / REQUEST_CHANGES / BLOCK` only; Findings close only on exact R4 hash.
