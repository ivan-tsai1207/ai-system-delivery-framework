# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-002-TEST-FIX` |
| Title | Fix HNS Core 002 Test Discovery |
| Role | `IMPLEMENTER` |
| Feature | `harness-core` |
| Phase | `IMPLEMENTATION` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `LOW` |
| Review Profile | `N/A` |
| Reviewed Artifact | `N/A` |
| Reviewed Artifact Hash | `N/A` |
| Maker Execution ID | `N/A` |

## Objective

讓 `npm test` 自動執行既有 root smoke tests 以及 nested HNS-CORE-002 unit tests。

## Requirement References

- Requirement IDs：`N/A`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 4、5、42、46 Phase 1
- Review / Evidence references：HNS-CORE-002 TECH_REVIEW finding: default `npm test` does not discover `tests/unit/core/domain.test.mjs`

## Read Scope

- `.ai/CONSTITUTION.md`
- `.ai/AUTHORITY.md`
- `.ai/WORKFLOW.md`
- `.ai/roles/implementer.md`
- `.ai/gates/implementation-gate.md`
- `templates/Work_Item.md`
- `work-items/HNS-CORE-002.md`
- `work-items/HNS-CORE-002-TEST-FIX.md`
- `harness/package.json`
- `harness/package-lock.json`
- `harness/tests/*.test.mjs`
- `harness/tests/unit/core/*.test.mjs`

## Write Scope

- `harness/package.json`
- `harness/package-lock.json`

## Forbidden Scope

- `.ai/**`
- `docs/**`
- `Architecture`
- `docs/harness_v0.1_SDD.md`
- `work-items/HNS-CORE-001.md`
- `work-items/HNS-CORE-002.md`
- `work-items/HNS-CORE-003.md`
- `work-items/HNS-CORE-004.md`
- `work-items/HNS-CORE-005.md`
- `harness/src/core/domain.ts`
- `harness/tests/unit/core/domain.test.mjs`
- `harness/src/adapters/**`
- `harness/src/execution/**`
- `harness/src/enforcement/**`
- `harness/src/work-items/**`
- Any runtime, parser, adapter, architecture, SDD, or unrelated work item code

## Scope

- Update the default Node built-in test runner command so `npm test` discovers:
  - `tests/*.test.mjs`
  - `tests/unit/core/*.test.mjs`
- Keep the remediation limited to test discovery.

## Out of Scope

- Redesigning HNS-CORE-002.
- Changing domain types or domain unit test behavior.
- Adding third-party test frameworks.
- Passing Implementation Gate or issuing independent reviewer approval.
- Merging `develop` or `main`.
- Starting HNS-CORE-003.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-002-TEST-FIX-001`：`npm test` executes the existing root smoke test file.
- [ ] `AC-HNS-CORE-002-TEST-FIX-002`：`npm test` executes `tests/unit/core/domain.test.mjs`.
- [ ] `AC-HNS-CORE-002-TEST-FIX-003`：Validation reports 8 passed and 0 failed tests.
- [ ] `AC-HNS-CORE-002-TEST-FIX-004`：No runtime, parser, adapter, SDD, Architecture, or HNS-CORE-002 source/test implementation files are modified.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-CORE-002`

## Blockers

- None

## Notes

- Previous TECH_REVIEW false positives for missing `harness/src/core/domain.ts` and `harness/tests/unit/core/domain.test.mjs` were caused by reviewer workspace state, not implementation defects.
- The previous TECH_REVIEW execution is not valid final review evidence if its workspace had no `.git`, did not contain the HNS-CORE-002 implementation files, and used unsupported Node/npm versions.
