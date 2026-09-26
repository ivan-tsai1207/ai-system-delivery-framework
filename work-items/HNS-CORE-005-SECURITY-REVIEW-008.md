# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-SECURITY-REVIEW-008` |
| Title | Independently Review HNS Core 005 R8 Security Boundaries |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `SECURITY_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r8.md` |
| Reviewed Artifact Hash | `sha256:e66abaaa9318d7a17870e79509490411a0425f4ac3646e22ff6fc339a4588b95` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R8-001` |

## Objective

Independently verify complete R8 security boundaries and formally resolve or retain `FND-HNS-CORE-005-SECURITY-006-001` without reopening prior findings.

## Requirement References

- AC-HNS-CORE-005-002 through 004; companion ACs; SDD Sections 31-32, 38, 40.1, 46 Phase 1; all R1-R8 evidence/findings.

## Read Scope

- Tier 1 REVIEWER / `SECURITY_REVIEWER`, assigned Work Item, gate, R8/R7 manifests, requirements, evidence/findings, reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed artifacts/manifests; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-008-001`：R8 identity and independent Reviewer binding are valid.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-008-002`：Security-006-001 and all historical security/classifier findings close without disclosure, bypass, or overblocking.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-008-003`：Narrowing, empty baseline, immutability, hostile inputs, safe names, and ordinary text pass.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-008-004`：No credential source, environment injection, I/O, process, adapter, dependency, production, or destructive expansion exists.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R8-001`

## Blockers

- None

## Notes

- Decision: `PASS / REQUEST_CHANGES / BLOCK` only; Security finding closure only on exact R8 hash.
