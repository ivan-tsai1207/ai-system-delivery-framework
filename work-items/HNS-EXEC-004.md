# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-EXEC-004` |
| Title | Implement Gate Runner and Minimal Audit Evidence |
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

Implement deterministic Gate Runner validation and minimal append-only audit/execution evidence sufficient to close a Pilot execution without vendor or production execution.

## Requirement References

- Requirement IDs: `AC-HNS-012`
- Feature Spec: `N/A`
- Screen IDs / Screen Specs: `N/A`
- ADR: `N/A`
- Architecture / SDD sections: `docs/harness_v0.1_SDD.md` Sections 5.4-5.5, 29-30, 35, 38-40, 44, 46 Phases 5 and 7
- Review / Evidence references: `HNS-EXEC-001`, `HNS-EXEC-003`

## Read Scope

- `.ai/CONSTITUTION.md`
- `.ai/AUTHORITY.md`
- `.ai/WORKFLOW.md`
- `.ai/HARNESS_CONTRACT.md`
- `.ai/roles/implementer.md`
- `.ai/gates/**`
- `docs/harness_v0.1_SDD.md`
- `work-items/HNS-EXEC-001.md`
- `work-items/HNS-EXEC-003.md`
- `work-items/HNS-EXEC-004.md`
- `harness/src/core/**`
- `harness/src/schemas/**`
- `harness/src/errors/**`
- `harness/src/execution/**`
- `harness/src/risk/**`
- `harness/src/gates/**`
- `harness/src/audit/**`
- `harness/tests/**`

## Write Scope

- `harness/src/gates/**`
- `harness/src/audit/**`
- `harness/src/index.ts`
- `harness/tests/unit/gates/**`
- `harness/tests/unit/audit/**`

## Forbidden Scope

- `.ai/**`
- `docs/**`
- `templates/**`
- `work-items/**`
- `harness/package.json`
- `harness/package-lock.json`
- `harness/src/policy/**`
- `harness/src/adapters/**`
- `harness/src/enforcement/**`
- `harness/src/git/**`
- `main`

## Scope

- Resolve canonical required gates without removing phase-mandatory gates and validate exact gate-definition hashes supplied by the host.
- Validate required artifact-bound review evidence, Maker/Checker separation, profile assignment, findings, and stale-hash conditions before Gate PASS.
- Produce immutable `PASS`, `FAILED`, or `NEEDS_CLARIFICATION` Gate Results with evidence and exact artifact/gate hashes.
- Record sequential redacted lifecycle, review, finding, gate, and final execution evidence in an in-memory append-only hash chain with idempotent finalization and tamper verification.
- Bind legal lifecycle completion to all required Gate PASS results and fail closed on audit or Gate failure.

## Out of Scope

- Filesystem audit store, WORM claims, Policy Compiler, adapters, enforcement, Git integration, production execution, Release Gate execution, or Delivery Assurance coordinator.

## Acceptance Criteria

- [ ] `AC-HNS-EXEC-004-001`: Missing/stale review evidence, Maker/Checker collision, unassigned profile, open blocking finding, or missing mandatory Gate prevents PASS and completion.
- [ ] `AC-HNS-EXEC-004-002`: Valid evidence produces deterministic immutable Gate Results with distinct Gate and review decision enums.
- [ ] `AC-HNS-EXEC-004-003`: Audit events use contiguous sequence and hash chaining, redact sensitive values before hashing, detect tampering, and finalize idempotently.
- [ ] `AC-HNS-EXEC-004-004`: Minimal execution evidence can reconstruct context/profile references, state transitions, reviews, findings, gates, and final status without filesystem, adapter, Git, or production side effects.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-EXEC-001`
- `HNS-EXEC-003`

## Blockers

- None

## Notes

- Required independent profiles: `TECH_REVIEWER`, `QA_REVIEWER`, `SECURITY_REVIEWER`.
