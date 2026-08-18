# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-002-TECH-REVIEW-002` |
| Title | Independent Technical Review for HNS Core 002 Remediation Candidate |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `LOW` |
| Review Profile | `TECH_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-002-implementation-r2.md` |
| Reviewed Artifact Hash | `0bde3d45f6328c083a387c9de6c8e365d9c075966dbf213fcd3b957785dc6418` |
| Maker Execution ID | `CP-HNS-CORE-002-REMEDIATION-CANDIDATE-20260818T174236Z` |

## Objective

重新獨立驗證 `FIND-HNS-CORE-002-TECH-001`、`FIND-HNS-CORE-002-TECH-002`、`FIND-HNS-CORE-002-TECH-003`，以及完整 HNS-CORE-002 domain contract、scope、validation。

## Requirement References

- Requirement IDs：`AC-HNS-CORE-002-001` through `AC-HNS-CORE-002-004`; `AC-HNS-CORE-002-TEST-FIX-001` through `AC-HNS-CORE-002-TEST-FIX-004`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 4、5、42、46 Phase 1
- Review / Evidence references：`docs/08_agent_reviews/manifests/HNS-CORE-002-implementation-r2.md`; `REV-HNS-CORE-002-TECH-001`

## Read Scope

- `.ai/CONSTITUTION.md`
- `.ai/AUTHORITY.md`
- `.ai/WORKFLOW.md`
- `.ai/roles/reviewer.md`
- `.ai/roles/reviewer-profiles/tech-reviewer.md`
- `.ai/gates/implementation-gate.md`
- `templates/Agent_Review_Log.md`
- `docs/harness_v0.1_SDD.md` Sections 4、5、42、46
- `docs/08_agent_reviews/manifests/HNS-CORE-002-implementation-r2.md`
- `docs/08_agent_reviews/review_log.md`
- `work-items/HNS-CORE-002.md`
- `work-items/HNS-CORE-002-TEST-FIX.md`
- `work-items/HNS-CORE-002-TECH-REVIEW.md`
- `work-items/HNS-CORE-002-TECH-REVIEW-002.md`
- `harness/src/core/domain.ts`
- `harness/src/index.ts`
- `harness/tests/unit/core/domain.test.mjs`
- `harness/package.json`
- `harness/package-lock.json`
- `harness/tsconfig.json`
- `harness/tests/*.test.mjs`
- `harness/tests/unit/core/*.test.mjs`

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- `docs/08_agent_reviews/manifests/HNS-CORE-002-implementation-r2.md`
- `work-items/**`
- `harness/**`
- `docs/harness_v0.1_SDD.md`
- `docs/harness_implementation_architecture.md`
- `.ai/**`
- `templates/**`
- `specs/**`
- `agent_roles/**`
- `Architecture`
- `governance`

## Scope

- Verify remediation of `FIND-HNS-CORE-002-TECH-001`, `FIND-HNS-CORE-002-TECH-002`, and `FIND-HNS-CORE-002-TECH-003`.
- Verify complete HNS-CORE-002 domain contract compliance.
- Verify implementation scope boundaries and validation commands under Node `>=24.19.0 <25` and npm `>=11.17.0 <12`.
- Append independent `TECH_REVIEWER` evidence and decision to `docs/08_agent_reviews/review_log.md`.

## Out of Scope

- Modifying manifest, work items, `harness/**`, SDD, Architecture, governance, or implementation artifacts.
- Marking findings `RESOLVED` without independent review evidence.
- Passing `IMPLEMENTATION_GATE`.
- Merging `develop` or `main`.
- Starting `HNS-CORE-003`.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-002-TECH-REVIEW-002-001`：Repository preflight, candidate commit, manifest hash, and file identities are independently verified.
- [ ] `AC-HNS-CORE-002-TECH-REVIEW-002-002`：All three prior technical findings are independently reviewed against the remediation candidate.
- [ ] `AC-HNS-CORE-002-TECH-REVIEW-002-003`：Full HNS-CORE-002 domain contract, immutable value behavior, scope, and validation are reviewed.
- [ ] `AC-HNS-CORE-002-TECH-REVIEW-002-004`：Independent reviewer decision and any findings are appended to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-CORE-002`
- `HNS-CORE-002-TEST-FIX`
- `REV-HNS-CORE-002-TECH-001`

## Blockers

- None

## Notes

- This work item is a new independent review assignment and does not reuse the old reviewer execution.
- Reviewer write scope is limited to `docs/08_agent_reviews/review_log.md`.
