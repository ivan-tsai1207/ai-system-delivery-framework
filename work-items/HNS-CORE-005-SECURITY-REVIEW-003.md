# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-SECURITY-REVIEW-003` |
| Title | Independently Review HNS Core 005 R3 Security Boundaries |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `SECURITY_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r3.md` |
| Reviewed Artifact Hash | `sha256:328a6a6bb984e37027275360c9b556e7eb3468fb874b078f73173f9292337410` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R3-001` |

## Objective

Independently verify the complete R3 security boundary and determine whether all three R2 Security findings can be resolved without bypass or overblocking.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-005-002` through `004`; relevant companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 31-32、38、40.1、46 Phase 1
- Review / Evidence references：All R1-R3 Maker/review evidence and all five historical Findings

## Read Scope

- Tier 1 REVIEWER / `SECURITY_REVIEWER`, assigned Work Item, gate, R3 manifest, Maker/review/finding evidence, direct requirements, reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Scope

- Reproduce all prior security findings, probe generalized provider/compact/quoted secret rejection, every error surface, credential/process env classes, safe-name and ordinary-text controls, hostile inputs, narrowing, immutability, empty baseline, and forbidden capability/dependency absence.

## Out of Scope

- Any artifact modification, TECH/QA/Gate/accepted-risk/merge/lifecycle authority.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-003-001`：R3 identity and independent Reviewer binding are valid.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-003-002`：All three R2 Security findings are independently closed without disclosure or bypass.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-003-003`：False-positive controls, narrowing, empty baseline, immutability, hostile inputs, and safe names pass.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-003-004`：No credential source, environment injection, I/O, process, adapter, dependency, production, or destructive expansion exists.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R3-001`

## Blockers

- None

## Notes

- Decision: `PASS / REQUEST_CHANGES / BLOCK` only; Findings close only on exact R3 hash.
