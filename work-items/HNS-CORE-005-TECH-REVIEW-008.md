# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-TECH-REVIEW-008` |
| Title | Independently Review HNS Core 005 R8 Candidate |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `TECH_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r8.md` |
| Reviewed Artifact Hash | `sha256:e66abaaa9318d7a17870e79509490411a0425f4ac3646e22ff6fc339a4588b95` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R8-001` |

## Objective

Independently verify exact R8, the npm-style escaped-whitespace/quoted-key remediation, and all previously resolved HNS-CORE-005 boundaries.

## Requirement References

- All HNS-CORE-005 primary/companion ACs; SDD Sections 6, 31-32, 35, 38, 40.1, 46 Phase 1; all R1-R8 evidence and findings.

## Read Scope

- Tier 1 REVIEWER / `TECH_REVIEWER`, assigned Work Item, gate, R8/R7 manifests, requirements, evidence/findings, reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed artifacts/manifests; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-TECH-REVIEW-008-001`：R8 delta identity, inherited R7 identities, lineage, immutability, and separation are valid.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-008-002`：All npm-style sensitive variants fail closed without disclosure, broad parsing, or false positives.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-008-003`：All historical findings, commands, discovery, primary/companion behavior, and forbidden boundaries pass.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-008-004`：Evidence/findings are appended only to the review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R8-001`

## Blockers

- None after exact manifest hash binding.

## Notes

- Decision: `PASS / REQUEST_CHANGES / BLOCK` only.
