# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-EXEC-003` |
| Title | Implement Risk Review Assignment and Execution Profile |
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

Implement deterministic Risk Assignment, Reviewer Assignment, and immutable Execution Profile building for the minimal execution engine.

## Requirement References

- Requirement IDs: `AC-HNS-007`
- Feature Spec: `N/A`
- Screen IDs / Screen Specs: `N/A`
- ADR: `N/A`
- Architecture / SDD sections: `docs/harness_v0.1_SDD.md` Sections 5.3, 5.5, 16.1, 21, 35, 38, 40.1, 46 Phases 6-7
- Review / Evidence references: `HNS-EXEC-001`, `HNS-EXEC-002`

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
- `work-items/HNS-EXEC-003.md`
- `harness/src/core/**`
- `harness/src/schemas/**`
- `harness/src/context/**`
- `harness/src/risk/**`
- `harness/src/execution/**`
- `harness/tests/**`

## Write Scope

- `harness/src/risk/**`
- `harness/src/execution/profile.ts`
- `harness/src/index.ts`
- `harness/tests/unit/risk/**`
- `harness/tests/unit/execution/profile.test.mjs`

## Forbidden Scope

- `.ai/**`
- `docs/**`
- `templates/**`
- `work-items/**`
- `harness/package.json`
- `harness/package-lock.json`
- `harness/src/policy/**`
- `harness/src/gates/**`
- `harness/src/audit/**`
- `harness/src/adapters/**`
- `harness/src/enforcement/**`
- `main`

## Scope

- Classify deterministic risk from canonical trigger facts using highest-risk-wins semantics and fail closed on unknown sensitive triggers.
- Resolve deterministic artifact-aligned TECH plus risk-required QA and SECURITY assignments, enforce Maker/Reviewer separation inputs, and hash immutable assignments.
- Build and verify immutable execution profiles from validated Work Item, Context, supplied effective policy, gate, review, repository, adapter-requirement, and audit inputs.
- Reject risk downgrade, unassigned profile, stale/missing artifact hash, identity mismatch, missing mandatory gate, policy/context hash mismatch, and mutable output.

## Out of Scope

- Policy Compiler, reviewer execution, adapters, enforcement, production launch, finding registry, Delivery Assurance, or human approval implementation.

## Acceptance Criteria

- [ ] `AC-HNS-EXEC-003-001`: Same normalized trigger inputs produce the same immutable Risk Assignment hash and highest applicable risk.
- [ ] `AC-HNS-EXEC-003-002`: Reviewer assignments are deterministic, artifact-bound, role-aligned, and include TECH plus risk-required QA/SECURITY without self-assignment.
- [ ] `AC-HNS-EXEC-003-003`: Valid profile inputs produce a canonical deep-frozen profile whose hash changes for every execution-relevant field change.
- [ ] `AC-HNS-EXEC-003-004`: Downgrade, stale hash, missing gate, identity mismatch, and assignment collision fail closed without adapter or enforcement behavior.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-EXEC-001`
- `HNS-EXEC-002`

## Blockers

- None

## Notes

- Required independent profiles: `TECH_REVIEWER`, `QA_REVIEWER`, `SECURITY_REVIEWER`.

