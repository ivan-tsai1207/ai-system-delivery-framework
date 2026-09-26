# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-EXEC-001` |
| Title | Implement Work Item Loading and Execution State Foundation |
| Role | `IMPLEMENTER` |
| Feature | `minimal-execution-engine` |
| Phase | `IMPLEMENTATION` |
| Status | `DONE` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `HIGH` |
| Review Profile | `N/A` |
| Reviewed Artifact | `N/A` |
| Reviewed Artifact Hash | `N/A` |
| Maker Execution ID | `N/A` |

## Objective

Implement deterministic Work Item v2 loading and validation plus the legal execution-state transition foundation required by the minimal execution engine.

## Requirement References

- Requirement IDs: `AC-HNS-005`
- Feature Spec: `N/A`
- Screen IDs / Screen Specs: `N/A`
- ADR: `N/A`
- Architecture / SDD sections: `docs/harness_v0.1_SDD.md` Sections 5.2-5.3, 17, 35, 40.1, 46 Phase 2
- Review / Evidence references: `HNS-CORE-005` lifecycle closure

## Read Scope

- `.ai/CONSTITUTION.md`
- `.ai/AUTHORITY.md`
- `.ai/WORKFLOW.md`
- `.ai/HARNESS_CONTRACT.md`
- `.ai/roles/implementer.md`
- `.ai/gates/implementation-gate.md`
- `templates/Work_Item.md`
- `docs/harness_v0.1_SDD.md`
- `work-items/HNS-EXEC-001.md`
- `work-items/HNS-CORE-001.md`
- `work-items/HNS-CORE-002.md`
- `work-items/HNS-CORE-003.md`
- `work-items/HNS-CORE-004.md`
- `work-items/HNS-CORE-005.md`
- `harness/src/core/**`
- `harness/src/schemas/**`
- `harness/src/errors/**`
- `harness/src/work-items/**`
- `harness/src/execution/state.ts`
- `harness/tests/**`
- `harness/package.json`
- `harness/package-lock.json`
- `harness/tsconfig.json`

## Write Scope

- `harness/src/work-items/**`
- `harness/src/execution/state.ts`
- `harness/src/index.ts`
- `harness/tests/unit/work-items/**`
- `harness/tests/unit/execution/state.test.mjs`
- `harness/tests/fixtures/work-items/**`
- `harness/package.json`
- `harness/package-lock.json`

## Forbidden Scope

- `.ai/**`
- `docs/**`
- `templates/**`
- `work-items/**`
- `harness/src/context/**`
- `harness/src/risk/**`
- `harness/src/gates/**`
- `harness/src/audit/**`
- `harness/src/adapters/**`
- `harness/src/enforcement/**`
- `main`

## Scope

- Load repository-relative Work Item Markdown through an AST parser and validate every required v2 section, metadata field, scope, AC, dependency, and gate reference.
- Reject v1, malformed, duplicate, path-escaping, mismatched filename/ID, invalid review binding, and unresolved canonical gate inputs with structured `HNS-WI-001` details.
- Produce deterministic immutable Work Item values and document hashes.
- Implement legal execution-state transitions and fail closed on illegal transitions or stale expected state.
- Exact-pin the minimum Markdown AST dependency and update test discovery for the new unit suites.

## Out of Scope

- Work Item generation, ID allocation, migration, dispatch, Policy Compiler, Context Compiler, adapters, enforcement, production execution, or automatic state persistence.

## Acceptance Criteria

- [x] `AC-HNS-EXEC-001-001`: Canonical v2 Work Items load into immutable normalized values with deterministic document hashes.
- [x] `AC-HNS-EXEC-001-002`: Malformed, duplicate, v1, path-escaping, filename/ID mismatch, invalid review-only fields, AC, and gate inputs fail closed with `HNS-WI-001` details.
- [x] `AC-HNS-EXEC-001-003`: Every canonical legal execution transition succeeds and representative illegal, terminal, and stale-state transitions fail closed.
- [x] `AC-HNS-EXEC-001-004`: No generator, adapter, enforcement, network, credential, or production capability is introduced.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-CORE-005`
- Exact `mdast-util-from-markdown@2.0.3`

## Blockers

- None

## Notes

- Required independent profiles: `TECH_REVIEWER`, `QA_REVIEWER`, `SECURITY_REVIEWER`.
