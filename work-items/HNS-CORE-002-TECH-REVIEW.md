# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-002-TECH-REVIEW` |
| Title | Independent Technical Re-Review for HNS Core 002 |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `LOW` |
| Review Profile | `TECH_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-002-implementation.md` |
| Reviewed Artifact Hash | `3dcd349f370c4f30a5c9a5cad44d788dc4641b09af62ae92a30ec83d0de98013` |
| Maker Execution ID | `MULTIPLE:CP-HNS-CORE-002-IMPLEMENTATION-LINEAGE` |

## Objective

獨立重新審查 HNS-CORE-002 core domain type implementation 與 HNS-CORE-002-TEST-FIX test discovery remediation，驗證 domain contract、immutability、test coverage、scope、validation commands 與 candidate lineage；不得修改受審 implementation 或自行通過 `IMPLEMENTATION_GATE`。

## Requirement References

- Requirement IDs：`N/A`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 4、5、42、46 Phase 1
- Review / Evidence references：`docs/08_agent_reviews/manifests/HNS-CORE-002-implementation.md`

## Read Scope

- `.ai/CONSTITUTION.md`
- `.ai/AUTHORITY.md`
- `.ai/WORKFLOW.md`
- `.ai/roles/reviewer.md`
- `.ai/roles/reviewer-profiles/tech-reviewer.md`
- `.ai/gates/implementation-gate.md`
- `templates/Agent_Review_Log.md`
- `docs/harness_v0.1_SDD.md` Sections 4、5、42、46
- `docs/08_agent_reviews/manifests/HNS-CORE-002-implementation.md`
- `docs/08_agent_reviews/review_log.md`
- `work-items/HNS-CORE-002.md`
- `work-items/HNS-CORE-002-TEST-FIX.md`
- `work-items/HNS-CORE-002-TECH-REVIEW.md`
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

- `docs/08_agent_reviews/manifests/HNS-CORE-002-implementation.md`
- `work-items/HNS-CORE-002-TECH-REVIEW.md`
- `work-items/HNS-CORE-002.md`
- `work-items/HNS-CORE-002-TEST-FIX.md`
- `harness/**`
- `docs/harness_v0.1_SDD.md`
- `docs/harness_implementation_architecture.md`
- `.ai/**`
- `templates/**`
- `specs/**`
- `agent_roles/**`

## Scope

- Verify repository and environment preflight evidence.
- Verify commit lineage and diff scope boundaries for original implementation, control-plane preparation, and remediation implementation.
- Review SDD Section 4、5、42、46 and `HNS-CORE-002` contract compliance.
- Review immutable value behavior, including nested objects, arrays, mutation blocking, circular references, shared references, and mutable non-plain objects.
- Review unit test coverage for canonical allowed values, especially `WORK_ITEM_STATUSES`.
- Run required validation commands in the required Node/npm environment.
- Append independent `TECH_REVIEWER` evidence and findings to `docs/08_agent_reviews/review_log.md`.

## Out of Scope

- Modifying implementation code, tests, package files, SDD, Architecture, governance, manifest, or work items during formal review.
- Passing `IMPLEMENTATION_GATE`.
- Merging `develop` or `main`.
- Starting `HNS-CORE-003`.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-002-TECH-REVIEW-001`：Repository preflight, candidate commit, manifest hash, and file identities are independently verified.
- [ ] `AC-HNS-CORE-002-TECH-REVIEW-002`：Domain contract and immutable value behavior are reviewed against canonical references.
- [ ] `AC-HNS-CORE-002-TECH-REVIEW-003`：Test discovery and required validation commands are executed under Node `>=24.19.0 <25` and npm `>=11.17.0 <12`.
- [ ] `AC-HNS-CORE-002-TECH-REVIEW-004`：Scope boundaries for original implementation, control-plane preparation, and remediation are verified.
- [ ] `AC-HNS-CORE-002-TECH-REVIEW-005`：Independent reviewer decision and any findings are appended to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-CORE-002`
- `HNS-CORE-002-TEST-FIX`
