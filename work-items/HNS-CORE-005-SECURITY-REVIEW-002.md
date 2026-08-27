# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-SECURITY-REVIEW-002` |
| Title | Independently Review HNS Core 005 R2 Security Boundaries |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `SECURITY_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r2.md` |
| Reviewed Artifact Hash | `sha256:f9ad2bd656bed5a52d9c69c60cdbf2381282ee92aab34c8dab1b06bf44df25c0` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R2-001` |

## Objective

Independently verify the complete R2 secret-isolation, redaction, privilege-narrowing, environment allowlist, unsafe-input, and capability boundaries.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-005-002` through `AC-HNS-CORE-005-004`; relevant companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 31-32、38、40.1、46 Phase 1
- Review / Evidence references：R1/R2 Maker evidence; `REV-HNS-CORE-005-TECH-001`; both R1 Findings; current R2 TECH evidence

## Read Scope

- Tier 1 REVIEWER and `SECURITY_REVIEWER` context
- Assigned Work Item, active Implementation Gate, R2 manifest
- Maker evidence, R1/R2 TECH evidence/findings, direct requirements, and reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Scope

- Reproduce both R1 security-boundary findings against R2; adversarially verify normalized secret assignment/JWT rejection, diagnostic non-disclosure, narrowing-only authority, empty child baseline, safe-name preservation, immutable outputs, hostile object handling, and absence of credential/I/O/runtime/dependency expansion.

## Out of Scope

- Modifying reviewed artifacts or acting as TECH, QA, Gate Checker, Implementer, accepted-risk authority, merger, or lifecycle closer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-002-001`：R2 identity and independent Reviewer binding are valid.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-002-002`：Both R1 secret-isolation gaps are closed without raw-value disclosure.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-002-003`：Narrowing, empty environment baseline, safe-name behavior, immutability, and hostile-input checks pass.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-002-004`：No credential source, environment injection, filesystem/network/process, adapter, dependency, production, or destructive boundary is introduced.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R2-001`

## Blockers

- None

## Notes

- Decision is limited to `PASS / REQUEST_CHANGES / BLOCK`; no Accepted Risk is implied.
