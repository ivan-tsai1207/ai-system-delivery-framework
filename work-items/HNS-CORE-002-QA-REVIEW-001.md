# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-002-QA-REVIEW-001` |
| Title | Independent QA Review for HNS Core 002 Remediation Candidate |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `CANCELLED` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `LOW` |
| Review Profile | `QA_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-002-implementation-r2.md` |
| Reviewed Artifact Hash | `0bde3d45f6328c083a387c9de6c8e365d9c075966dbf213fcd3b957785dc6418` |
| Maker Execution ID | `CP-HNS-CORE-002-REMEDIATION-CANDIDATE-20260818T174236Z` |

## Objective

依 `.ai/WORKFLOW.md` 的 test coverage verification return path，對 HNS-CORE-002 remediation candidate 進行獨立 QA re-review，驗證 acceptance coverage、regression tests、test discovery 與 reproducibility。

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
- `.ai/roles/reviewer-profiles/qa-reviewer.md`
- `.ai/gates/implementation-gate.md`
- `templates/Agent_Review_Log.md`
- `docs/harness_v0.1_SDD.md` Sections 4、5、42、46
- `docs/08_agent_reviews/manifests/HNS-CORE-002-implementation-r2.md`
- `docs/08_agent_reviews/review_log.md`
- `work-items/HNS-CORE-002.md`
- `work-items/HNS-CORE-002-TEST-FIX.md`
- `work-items/HNS-CORE-002-QA-REVIEW-001.md`
- `harness/src/core/domain.ts`
- `harness/src/index.ts`
- `harness/tests/package-smoke.test.mjs`
- `harness/tests/unit/core/domain.test.mjs`
- `harness/package.json`
- `harness/package-lock.json`
- `harness/tsconfig.json`

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

## Scope

- AC coverage.
- Test discovery.
- `WORK_ITEM_STATUSES` exact values.
- Shared reference regression.
- True circular reference negative case.
- `Date` rejection.
- `Map` rejection.
- `Set` rejection.
- Custom class rejection.
- Existing nested freeze regression.
- Default `npm test` complete suite.
- Tests not skipped or disabled.
- Results reproducible.

## Out of Scope

- Modifying implementation code, tests, manifest, work items, SDD, Architecture, or governance.
- Passing `IMPLEMENTATION_GATE`.
- Merging `develop` or `main`.
- Starting `HNS-CORE-003`.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-002-QA-REVIEW-001-001`：QA scope items are independently verified and recorded.
- [ ] `AC-HNS-CORE-002-QA-REVIEW-001-002`：Default `npm test` complete suite is executed under Node `>=24.19.0 <25` and npm `>=11.17.0 <12`.
- [ ] `AC-HNS-CORE-002-QA-REVIEW-001-003`：Tests are verified not skipped or disabled.
- [ ] `AC-HNS-CORE-002-QA-REVIEW-001-004`：Independent QA reviewer decision and any findings are appended to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-CORE-002`
- `HNS-CORE-002-TEST-FIX`
- `REV-HNS-CORE-002-TECH-001`

## Blockers

- None

## Notes

- QA reviewer write scope is limited to `docs/08_agent_reviews/review_log.md`.
- Cancelled because the reviewed R2 artifact is stale and this QA review was never executed.
- Superseded by R3 QA assignment `work-items/HNS-CORE-002-QA-REVIEW-002.md`.
