# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-TECH-REVIEW-006` |
| Title | Independently Review HNS Core 005 R6 Candidate |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `DONE` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `TECH_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r6.md` |
| Reviewed Artifact Hash | `sha256:a45ddb510402dab45b22a3d31b041ba7bbd230da4b3fa47f75b7cf72e4ae7740` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R6-001` |

## Objective

Independently verify R6 and closure of the final escaped-colon/equal finding without regression of narrow decoding, resolved environment controls, or benign boundaries.

## Requirement References

- Requirement IDs：All HNS-CORE-005 primary and companion ACs
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 6、31-32、35、38、40.1、46 Phase 1
- Review / Evidence references：All R1-R6 evidence and historical Findings

## Read Scope

- Tier 1 REVIEWER / `TECH_REVIEWER`, assigned Work Item, gate, R6 manifest, direct requirements, evidence/findings, reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest; `harness/**`; `.ai/**`; `docs/**` except append-only review log; `templates/**`; `work-items/**`

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-TECH-REVIEW-006-001`：R6 identity, lineage, inheritance, immutability, and separation are valid.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-006-002`：Escaped colon/equal assignments fail closed without bypass, disclosure, broad decoding, or false-positive regression.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-006-003`：All historical findings, primary/companion behavior, commands, discovery, and forbidden boundaries pass.
- [ ] `AC-HNS-CORE-005-TECH-REVIEW-006-004`：Evidence/findings are appended only to the review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-REMEDIATION-R6-001`

## Blockers

- None

## Notes

- Decision: `PASS / REQUEST_CHANGES / BLOCK` only.
