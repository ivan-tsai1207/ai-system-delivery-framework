# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005` |
| Title | Implement Config and Canonical Hash Foundation |
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

實作 deterministic canonical serialization / SHA-256與 non-secret config foundation，作為後續 compiler與 evidence hash的共用底層。

## Requirement References

- Requirement IDs：`N/A`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 6、31-32、35、38、40.1、46 Phase 1
- Review / Evidence references：Independent SDD approval evidence required before execution

## Read Scope

- `.ai/**`
- `docs/harness_v0.1_SDD.md`
- `work-items/HNS-CORE-001.md`
- `work-items/HNS-CORE-002.md`
- `work-items/HNS-CORE-003.md`
- `work-items/HNS-CORE-004.md`
- `work-items/HNS-CORE-005.md`
- `harness/src/core/**`
- `harness/src/schemas/**`
- `harness/src/errors/**`

## Write Scope

- `harness/src/core/hash/**`
- `harness/src/config/**`
- `harness/tests/unit/core/hash/**`
- `harness/tests/unit/config/**`
- `harness/tests/fixtures/config/**`

## Forbidden Scope

- `.ai/**`
- `docs/**`
- `templates/**`
- `work-items/**`
- `harness/src/context/**`
- `harness/src/policy/**`
- `harness/src/audit/**`
- `harness/src/adapters/**`
- `harness/src/execution/**`

## Scope

- Implement canonical key ordering、UTF-8 serialization、normalized collections與 SHA-256 API。
- Implement config schema loading / merge where project config can only narrow host defaults。
- Reject unknown keys、secret values與 invalid version；build child environment policy from explicit allowlist model only。
- Add determinism、secret rejection與 precedence tests。

## Out of Scope

- Context / Policy compilation、audit persistence、runtime environment injection、adapter configuration。

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-001`：Equivalent normalized input產生 byte-identical canonical bytes與 SHA-256；ordering變化不改 hash。
- [ ] `AC-HNS-CORE-005-002`：Config precedence只允許 narrowing，unknown key與 secret value fail closed。
- [ ] `AC-HNS-CORE-005-003`：Tests涵蓋 Unicode / path-independent canonicalization、hash mismatch與 redacted diagnostics。
- [ ] `AC-HNS-CORE-005-004`：No Context / Policy compiler、audit store、runtime process或 adapter behavior is introduced。

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `HNS-CORE-001`
- `HNS-CORE-002`
- `HNS-CORE-003`
- `HNS-CORE-004`

## Blockers

- Harness v0.1 SDD must receive independent final approval before execution.

## Notes

- Phase 1 only。
