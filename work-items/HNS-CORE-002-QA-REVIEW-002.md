# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-002-QA-REVIEW-002` |
| Title | Independent QA Review for HNS Core 002 R3 Remediation Candidate |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `LOW` |
| Review Profile | `QA_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-002-implementation-r3.md` |
| Reviewed Artifact Hash | `89565b900374509f58cfe8ebe51306944dca3d30183af1eae9f68c7740f641ec` |
| Maker Execution ID | `RCE-HNS-CORE-002-REMEDIATION-R3-001` |

## Objective

Independently verify R3 QA readiness, acceptance coverage, test discovery, all regression coverage, and reproducibility for the HNS-CORE-002 remediation candidate.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-002-001` through `AC-HNS-CORE-002-004`; `AC-HNS-CORE-002-TEST-FIX-001` through `AC-HNS-CORE-002-TEST-FIX-004`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 4, 5, 42, 46 Phase 1
- Review / Evidence references：`docs/08_agent_reviews/manifests/HNS-CORE-002-implementation-r3.md`; `RCE-HNS-CORE-002-REMEDIATION-R3-001`; `REV-HNS-CORE-002-TECH-002`; `FIND-HNS-CORE-002-TECH-004`

## Read Scope

- `.ai/CONSTITUTION.md`
- `.ai/AUTHORITY.md`
- `.ai/WORKFLOW.md`
- `.ai/roles/reviewer.md`
- `.ai/roles/reviewer-profiles/qa-reviewer.md`
- `.ai/gates/implementation-gate.md`
- `templates/Agent_Review_Log.md`
- `docs/harness_v0.1_SDD.md` Sections 4, 5, 42, 46
- `docs/08_agent_reviews/manifests/HNS-CORE-002-implementation-r3.md`
- `docs/08_agent_reviews/review_log.md`
- `work-items/HNS-CORE-002.md`
- `work-items/HNS-CORE-002-TEST-FIX.md`
- `work-items/HNS-CORE-002-QA-REVIEW-002.md`
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

- `docs/08_agent_reviews/manifests/HNS-CORE-002-implementation-r3.md`
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
- All regression coverage.
- Accessor rejection coverage.
- Getter not invoked coverage.
- Proxy snapshot coverage.
- Shared alias coverage.
- Cycle rejection coverage.
- Unsupported types coverage.
- Symbol keys coverage.
- Snapshot isolation coverage.
- Null prototype coverage.
- Arrays and sparse arrays coverage.
- Repeatability and reproducibility.
- Default `npm test` complete suite.
- Tests not skipped or disabled.

## Out of Scope

- Modifying implementation code, tests, manifest, work items, SDD, Architecture, or governance.
- Passing `IMPLEMENTATION_GATE`.
- Merging `develop` or `main`.
- Starting `HNS-CORE-003`.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-002-QA-REVIEW-002-001`：QA scope items are independently verified and recorded.
- [ ] `AC-HNS-CORE-002-QA-REVIEW-002-002`：Default `npm test` complete suite is executed under Node `>=24.19.0 <25` and npm `>=11.17.0 <12`.
- [ ] `AC-HNS-CORE-002-QA-REVIEW-002-003`：Tests are verified not skipped or disabled.
- [ ] `AC-HNS-CORE-002-QA-REVIEW-002-004`：Independent QA reviewer decision and any findings are appended to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-CORE-002`
- `HNS-CORE-002-TEST-FIX`
- `REV-HNS-CORE-002-TECH-002`
- `RCE-HNS-CORE-002-REMEDIATION-R3-001`

## Blockers

- None

## Notes

- QA reviewer write scope is limited to `docs/08_agent_reviews/review_log.md`.
- This assignment supersedes stale, never-executed `work-items/HNS-CORE-002-QA-REVIEW-001.md`.
