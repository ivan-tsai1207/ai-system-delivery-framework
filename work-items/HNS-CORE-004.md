# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-004` |
| Title | Implement Error and Exit Code Registry |
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

實作唯一 HarnessError catalog與 CLI exit-code registry，不加入 CLI command或 runtime behavior。

## Requirement References

- Requirement IDs：`N/A`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 33-34、40.1、46 Phase 1
- Review / Evidence references：Independent SDD approval evidence required before execution

## Read Scope

- `.ai/HARNESS_CONTRACT.md`
- `docs/harness_v0.1_SDD.md`
- `work-items/HNS-CORE-001.md`
- `work-items/HNS-CORE-002.md`
- `work-items/HNS-CORE-004.md`
- `harness/src/core/**`

## Write Scope

- `harness/src/errors/**`
- `harness/tests/unit/errors/**`

## Forbidden Scope

- `.ai/**`
- `docs/**`
- `templates/**`
- `work-items/**`
- `harness/src/cli/**`
- `harness/src/adapters/**`
- `harness/src/execution/**`

## Scope

- Implement every SDD error code with immutable metadata and redacted cause support。
- Implement one exit-code registry for categories 0-8。
- Reject duplicate code、missing mapping與 module-local ad hoc exit code registration。

## Out of Scope

- CLI rendering、process exit、retry engine、vendor error normalization。

## Acceptance Criteria

- [ ] `AC-HNS-CORE-004-001`：Every SDD Section 33 code maps exactly one Section 34 exit code。
- [ ] `AC-HNS-CORE-004-002`：Duplicate / unknown error code and unmapped catalog entry fail tests。
- [ ] `AC-HNS-CORE-004-003`：Error details support safe redaction and immutable typed causes without raw secrets。
- [ ] `AC-HNS-CORE-004-004`：Modules cannot assign an exit code outside the central registry API。

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-CORE-001`
- `HNS-CORE-002`

## Blockers

- Harness v0.1 SDD must receive independent final approval before execution.

## Notes

- Phase 1 only。
