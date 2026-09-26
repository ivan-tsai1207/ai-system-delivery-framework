# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-TECH-REVIEW-007` |
| Title | Independently Review HNS Core 005 R7 Candidate |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `DONE` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `TECH_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r7.md` |
| Reviewed Artifact Hash | `sha256:de431db1016078d135bc561b44d83d7002c909768815b8b499d2c3c3a78f8ba3` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R7-001` |

## Objective

Independently verify R7 and the unquoted escaped-whitespace remediation without regression of every previously resolved TECH and Security boundary.

## Requirement References

- Requirement IDs：All HNS-CORE-005 primary and companion ACs
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 6、31-32、35、38、40.1、46 Phase 1
- Review / Evidence references：All R1-R7 evidence and historical Findings

## Read Scope

- Tier 1 REVIEWER / `TECH_REVIEWER`, assigned Work Item, gate, R7 manifest, requirements, evidence/findings, reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-TECH-REVIEW-007-001`：R7 identity, lineage, inheritance, immutability, and separation are valid.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-007-002`：Unquoted escaped-whitespace credentials fail closed without disclosure, broad escaping, or false-positive regression.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-007-003`：All historical findings, primary/companion behavior, commands, discovery, and forbidden boundaries pass.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-007-004`：Evidence/findings are appended only to the review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R7-001`

## Blockers

- None

## Notes

- Decision: `PASS / REQUEST_CHANGES / BLOCK` only.
