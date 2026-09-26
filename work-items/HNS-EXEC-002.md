# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-EXEC-002` |
| Title | Implement Minimal Deterministic Context Compiler |
| Role | `IMPLEMENTER` |
| Feature | `minimal-execution-engine` |
| Phase | `IMPLEMENTATION` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `HIGH` |
| Review Profile | `N/A` |
| Reviewed Artifact | `N/A` |
| Reviewed Artifact Hash | `N/A` |
| Maker Execution ID | `N/A` |

## Objective

Implement the deterministic least-context compiler needed to assemble a bounded execution context for the first real-project Pilot.

## Requirement References

- Requirement IDs: `AC-HNS-021`, `AC-HNS-023`, `AC-HNS-024`
- Feature Spec: `N/A`
- Screen IDs / Screen Specs: `N/A`
- ADR: `N/A`
- Architecture / SDD sections: `docs/harness_v0.1_SDD.md` Sections 5.3, 18, 31, 38, 40.1, 43, 46 Phase 3
- Review / Evidence references: `HNS-EXEC-001`

## Read Scope

- `.ai/CONSTITUTION.md`
- `.ai/AUTHORITY.md`
- `.ai/WORKFLOW.md`
- `.ai/HARNESS_CONTRACT.md`
- `.ai/roles/implementer.md`
- `.ai/gates/implementation-gate.md`
- `docs/harness_v0.1_SDD.md`
- `work-items/HNS-EXEC-001.md`
- `work-items/HNS-EXEC-002.md`
- `harness/src/core/**`
- `harness/src/errors/**`
- `harness/src/work-items/**`
- `harness/src/context/**`
- `harness/tests/**`

## Write Scope

- `harness/src/context/**`
- `harness/src/index.ts`
- `harness/tests/unit/context/**`
- `harness/tests/fixtures/context/**`

## Forbidden Scope

- `.ai/**`
- `docs/**`
- `templates/**`
- `work-items/**`
- `harness/package.json`
- `harness/package-lock.json`
- `harness/src/policy/**`
- `harness/src/risk/**`
- `harness/src/gates/**`
- `harness/src/audit/**`
- `harness/src/adapters/**`
- `harness/src/enforcement/**`
- `main`

## Scope

- Compile Tier 0 and Tier 1 context entries from explicitly supplied repository-relative sources and section references.
- Enforce normalized in-repository paths, read/forbidden scope, file/section/byte budgets, hard ceilings, deduplication, deterministic ordering, and content hashes.
- Extract Markdown sections by AST heading structure and record deterministic full-document fallback reasons only when required.
- Authorize or deny bounded Tier 2 requests against read scope, forbidden scope, policy read boundary, and remaining budget; return immutable before/after hashes suitable for audit.

## Out of Scope

- Policy compilation, filesystem write enforcement, vendor token counting, broad repository discovery, adapters, network access, or runtime process launch.

## Acceptance Criteria

- [ ] `AC-HNS-EXEC-002-001`: Identical inputs produce byte-identical immutable manifests and context hashes independent of caller ordering.
- [ ] `AC-HNS-EXEC-002-002`: Tier selection, section extraction, deduplication, unrelated-file exclusion, and bounded large-repository behavior follow Sections 18 and 43.
- [ ] `AC-HNS-EXEC-002-003`: Path escape, forbidden/sensitive input, concurrent hash drift, unresolved required context, and budget overflow fail closed without leaking content.
- [ ] `AC-HNS-EXEC-002-004`: On-demand load, deny, and defer decisions are deterministic and include audit-ready hash and budget deltas without expanding permissions.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-EXEC-001`

## Blockers

- None

## Notes

- Required independent profiles: `TECH_REVIEWER`, `QA_REVIEWER`, `SECURITY_REVIEWER`.

