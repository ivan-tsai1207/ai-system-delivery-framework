# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-003-TEST-DISCOVERY` |
| Title | Include Schema Tests in Default Test Discovery |
| Role | `IMPLEMENTER` |
| Feature | `harness-core` |
| Phase | `IMPLEMENTATION` |
| Status | `DONE` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `LOW` |
| Review Profile | `N/A` |
| Reviewed Artifact | `N/A` |
| Reviewed Artifact Hash | `N/A` |
| Maker Execution ID | `N/A` |

## Objective

Ensure the default `npm test` command discovers root smoke tests, core unit tests, and HNS-CORE-003 schema unit tests.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-003-TEST-DISCOVERY-001` through `AC-HNS-CORE-003-TEST-DISCOVERY-004`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 40.1、46 Phase 1
- Review / Evidence references：`work-items/HNS-CORE-003.md`

## Read Scope

- `.ai/CONSTITUTION.md`
- `.ai/AUTHORITY.md`
- `.ai/WORKFLOW.md`
- `.ai/roles/implementer.md`
- `.ai/gates/implementation-gate.md`
- `templates/Work_Item.md`
- `work-items/HNS-CORE-003.md`
- `work-items/HNS-CORE-003-TEST-DISCOVERY.md`
- `harness/package.json`
- `harness/package-lock.json`
- `harness/tests/*.test.mjs`
- `harness/tests/unit/core/*.test.mjs`
- `harness/tests/unit/schemas/**/*.test.mjs`

## Write Scope

- `harness/package.json`

## Forbidden Scope

- `.ai/**`
- `docs/**`
- `templates/**`
- `work-items/**`
- `harness/src/**`
- `harness/tests/**`
- `harness/schemas/**`
- Any new test framework or dependency

## Scope

- Update the default Node built-in test runner command so one `npm test` invocation discovers root, core, and schema tests.
- Preserve existing test discovery and avoid a permanent exact test-count contract.

## Out of Scope

- Adding a test framework or runtime dependency.
- Modifying schema, core, parser, adapter, execution, SDD, Architecture, or test implementation.
- Passing independent review or `IMPLEMENTATION_GATE`.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-003-TEST-DISCOVERY-001`：Default `npm test` executes existing root smoke tests.
- [ ] `AC-HNS-CORE-003-TEST-DISCOVERY-002`：Default `npm test` executes existing core unit tests.
- [ ] `AC-HNS-CORE-003-TEST-DISCOVERY-003`：Default `npm test` executes all schema tests under `tests/unit/schemas/**`.
- [ ] `AC-HNS-CORE-003-TEST-DISCOVERY-004`：All discovered tests pass with 0 failed; no exact count is treated as a permanent requirement and no source, test, schema, or dependency change is made.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-CORE-003`

## Blockers

- None

## Notes

- The implementation commit must remain separate from the HNS-CORE-003 schema implementation commit.
- The default runner remains Node's built-in test runner.
