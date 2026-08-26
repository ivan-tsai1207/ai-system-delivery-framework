# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-003-DEPENDENCY-AJV` |
| Title | Add Approved Ajv Runtime Dependency |
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

Provide HNS-CORE-003 with the approved JSON Schema Draft 2020-12 runtime validation dependency using an exact `ajv@8.20.0` pin.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-003-DEPENDENCY-AJV-001` through `AC-HNS-CORE-003-DEPENDENCY-AJV-010`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 5、6、40.1、46 Phase 1
- Review / Evidence references：Human approval for exact `ajv@8.20.0`; HNS-CORE-003 dependency scope decision

## Read Scope

- `.ai/CONSTITUTION.md`
- `.ai/AUTHORITY.md`
- `.ai/WORKFLOW.md`
- `.ai/roles/implementer.md`
- `.ai/gates/implementation-gate.md`
- `templates/Work_Item.md`
- `work-items/HNS-CORE-003.md`
- `work-items/HNS-CORE-003-DEPENDENCY-AJV.md`
- `harness/package.json`
- `harness/package-lock.json`
- `harness/tsconfig.json`
- `harness/tests/**`

## Write Scope

- `harness/package.json`
- `harness/package-lock.json`

## Forbidden Scope

- `.ai/**`
- `docs/**`
- `templates/**`
- `work-items/**`
- `harness/src/**`
- `harness/tests/**`
- `harness/schemas/**`
- Any dependency other than exact `ajv@8.20.0`

## Scope

- Install exact runtime dependency `ajv@8.20.0` with npm.
- Synchronize package-lock integrity metadata.
- Validate the resolved dependency tree, existing build, typecheck, tests, and high-severity audit.

## Out of Scope

- Adding `ajv-formats` or any other dependency.
- Implementing schemas, registry behavior, validation behavior, test discovery, parser, migration, adapter, or runtime orchestration.
- Passing independent review or `IMPLEMENTATION_GATE`.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-003-DEPENDENCY-AJV-001`：`package.json` exact-pins `"ajv": "8.20.0"` without caret, tilde, tag, or alias.
- [ ] `AC-HNS-CORE-003-DEPENDENCY-AJV-002`：`package-lock.json` is synchronized and contains complete integrity metadata.
- [ ] `AC-HNS-CORE-003-DEPENDENCY-AJV-003`：No `ajv-formats` or other new dependency is added.
- [ ] `AC-HNS-CORE-003-DEPENDENCY-AJV-004`：`npm ci` passes.
- [ ] `AC-HNS-CORE-003-DEPENDENCY-AJV-005`：`npm run build` passes.
- [ ] `AC-HNS-CORE-003-DEPENDENCY-AJV-006`：`npm run typecheck` passes.
- [ ] `AC-HNS-CORE-003-DEPENDENCY-AJV-007`：Existing default `npm test` passes without CORE-001 or CORE-002 regression.
- [ ] `AC-HNS-CORE-003-DEPENDENCY-AJV-008`：`npm audit --audit-level=high` passes with no HIGH or CRITICAL vulnerability.
- [ ] `AC-HNS-CORE-003-DEPENDENCY-AJV-009`：The npm dependency tree resolves Ajv exactly to `8.20.0`.
- [ ] `AC-HNS-CORE-003-DEPENDENCY-AJV-010`：No filesystem, process, network, vendor adapter, or unrelated capability is introduced.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-CORE-002`
- Human approval for `ajv@8.20.0`

## Blockers

- None

## Notes

- Ajv is a runtime dependency because validation occurs at the external and persisted input boundary.
- HNS-CORE-003 requires independent `TECH_REVIEWER`, `QA_REVIEWER`, and `SECURITY_REVIEWER` evidence because this Work Item changes dependency trust and supply-chain state.
- Draft 2020-12 implementation must use the Ajv 2020 class / entrypoint, not the default Ajv class.
