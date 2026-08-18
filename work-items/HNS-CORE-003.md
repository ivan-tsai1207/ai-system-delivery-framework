# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-003` |
| Title | Implement Versioned Schema Registry |
| Role | `IMPLEMENTER` |
| Feature | `harness-core` |
| Phase | `IMPLEMENTATION` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `N/A` |
| Reviewed Artifact | `N/A` |
| Reviewed Artifact Hash | `N/A` |
| Maker Execution ID | `N/A` |

## Objective

實作 SDD定義的 versioned schema registry與 validation boundary，不實作 Work Item Markdown parser或 orchestration。

## Requirement References

- Requirement IDs：`N/A`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 5、6、40.1、46 Phase 1；`templates/Work_Item.md`
- Review / Evidence references：Independent SDD approval evidence required before execution

## Read Scope

- `.ai/**`
- `templates/Work_Item.md`
- `templates/Agent_Review_Log.md`
- `docs/harness_v0.1_SDD.md`
- `work-items/HNS-CORE-001.md`
- `work-items/HNS-CORE-002.md`
- `work-items/HNS-CORE-003.md`
- `harness/src/core/**`

## Write Scope

- `harness/schemas/**`
- `harness/src/schemas/**`
- `harness/tests/unit/schemas/**`
- `harness/tests/fixtures/schemas/**`

## Forbidden Scope

- `.ai/**`
- `docs/**`
- `templates/**`
- `work-items/**`
- `harness/src/work-items/**`
- `harness/src/adapters/**`
- `harness/src/execution/**`

## Scope

- Register all SDD schema IDs and supported versions。
- Implement fail-closed unknown-version handling and canonical validation result。
- Define explicit v1 Work Item non-executable / migration-required result and v2 support。
- Add valid / invalid fixtures for accountability schemas。

## Out of Scope

- Markdown AST parser、migration implementation、Context / Policy compiler、runtime persistence。

## Acceptance Criteria

- [ ] `AC-HNS-CORE-003-001`：Registry包含 SDD Section 6全部 schema IDs，且 duplicate / unknown ID fail closed。
- [ ] `AC-HNS-CORE-003-002`：Work Item v1回傳 migration-required，不會直接通過 executable validation；v2 valid fixture通過。
- [ ] `AC-HNS-CORE-003-003`：Review Assignment、Role Evidence、Finding與 Delivery Assurance valid / invalid fixtures有 deterministic results。
- [ ] `AC-HNS-CORE-003-004`：Registry不 import vendor adapter或執行 filesystem / process side effects。

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-CORE-001`
- `HNS-CORE-002`

## Blockers

- Harness v0.1 SDD must receive independent final approval before execution.

## Notes

- Phase 1 only；Work Item parser屬 Phase 2。
