# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-FIXTURE-001` |
| Title | Parser fixture |
| Role | `IMPLEMENTER` |
| Feature | `fixture-feature` |
| Phase | `IMPLEMENTATION` |
| Status | `TODO` |
| Spec Version | `fixture-v1` |
| Design Version | `N/A` |
| Risk Class | `LOW` |
| Review Profile | `N/A` |
| Reviewed Artifact | `N/A` |
| Reviewed Artifact Hash | `N/A` |
| Maker Execution ID | `N/A` |

## Objective

Exercise the canonical Work Item parser.

## Requirement References

- Requirement IDs: `AC-HNS-005`
- Feature Spec: `N/A`
- Screen IDs / Screen Specs: `N/A`
- ADR: `N/A`
- Architecture / SDD sections: `docs/harness_v0.1_SDD.md` Section 17
- Review / Evidence references: `N/A`

## Read Scope

- `harness/src/**`

## Write Scope

- `harness/src/work-items/**`

## Forbidden Scope

- `docs/**`

## Scope

- Parse one fixture.

## Out of Scope

- Runtime execution.

## Acceptance Criteria

- [ ] `AC-HNS-FIXTURE-001-001`: The fixture parses.
- [x] `AC-HNS-FIXTURE-001-002`: Checkbox state is preserved.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- None

## Blockers

- None

## Notes

- None
