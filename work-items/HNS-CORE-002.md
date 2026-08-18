# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-002` |
| Title | Implement Core Domain Types |
| Role | `IMPLEMENTER` |
| Feature | `harness-core` |
| Phase | `IMPLEMENTATION` |
| Status | `REVIEW` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `LOW` |
| Review Profile | `N/A` |
| Reviewed Artifact | `N/A` |
| Reviewed Artifact Hash | `N/A` |
| Maker Execution ID | `N/A` |

## Objective

實作 Phase 1 vendor-neutral domain types與 immutable value contracts，不加入 parser、orchestration或 side effects。

## Requirement References

- Requirement IDs：`N/A`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 4、5、42、46 Phase 1
- Review / Evidence references：Independent SDD approval evidence required before execution

## Read Scope

- `.ai/CONSTITUTION.md`
- `.ai/AUTHORITY.md`
- `.ai/WORKFLOW.md`
- `.ai/HARNESS_CONTRACT.md`
- `.ai/roles/implementer.md`
- `.ai/gates/implementation-gate.md`
- `templates/Work_Item.md`
- `docs/harness_implementation_architecture.md`
- `docs/harness_v0.1_SDD.md`
- `work-items/HNS-CORE-001.md`
- `work-items/HNS-CORE-002.md`
- `harness/package.json`
- `harness/tsconfig.json`

## Write Scope

- `harness/src/core/**`
- `harness/tests/unit/core/**`

## Forbidden Scope

- `.ai/**`
- `docs/**`
- `templates/**`
- `work-items/**`
- `harness/src/adapters/**`
- `harness/src/execution/**`
- `harness/src/enforcement/**`
- `harness/src/work-items/**`

## Scope

- Implement SDD core enums、interfaces與 immutable value types。
- Preserve exactly four Work Item Roles、five Phases、four Risk Classes、six Reviewer Profiles與 five Gate IDs。
- Add compile-time / unit tests for allowed values and immutable construction boundaries。

## Out of Scope

- JSON Schemas、Work Item parsing、persistence、runtime services、vendor adapters。

## Acceptance Criteria

- [ ] `AC-HNS-CORE-002-001`：Core types compile under strict mode without broad `any` or vendor imports。
- [ ] `AC-HNS-CORE-002-002`：Canonical Role、Phase、Risk、Profile、Gate、Finding與 decision enums match SDD / Work Item Contract exactly。
- [ ] `AC-HNS-CORE-002-003`：Tests cover valid construction and reject representative invalid enum / mutable input cases。
- [ ] `AC-HNS-CORE-002-004`：No parser、I/O、process或 adapter logic is introduced。

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-CORE-001`

## Blockers

- Harness v0.1 SDD must receive independent final approval before execution.

## Notes

- Phase 1 only。
