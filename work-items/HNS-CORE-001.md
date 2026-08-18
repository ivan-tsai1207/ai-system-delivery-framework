# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-001` |
| Title | Bootstrap TypeScript Harness Package |
| Role | `IMPLEMENTER` |
| Feature | `harness-core` |
| Phase | `IMPLEMENTATION` |
| Status | `DONE` |
| Spec Version | `harness-v0.1-approved-d98137c` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `N/A` |
| Reviewed Artifact | `N/A` |
| Reviewed Artifact Hash | `N/A` |
| Maker Execution ID | `N/A` |

## Objective

建立最小、可建置、strict TypeScript / ESM的 `harness/` package foundation，固定 Node / npm policy與測試入口，但不實作任何 Harness domain或 runtime behavior。

## Requirement References

- Requirement IDs：`N/A`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_implementation_architecture.md` Sections 16-17；`docs/harness_v0.1_SDD.md` Sections 2-4、45-46
- Review / Evidence references：`docs/08_agent_reviews/review_log.md#rev-hns-sdd-001---harness-v01-sdd-independent-review`

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
- `docs/harness_v0.1_development_plan.md`
- `work-items/HNS-CORE-001.md`

## Write Scope

- `harness/package.json`
- `harness/package-lock.json`
- `harness/tsconfig.json`
- `harness/src/**` limited to package entry placeholder with no runtime behavior
- `harness/tests/**` limited to package smoke / configuration tests

## Forbidden Scope

- `.ai/**`
- `docs/**`
- `templates/**`
- `work-items/**`
- `harness/src/adapters/**`
- `harness/src/enforcement/**`
- `harness/src/intake/**`
- `harness/src/repository/**`

## Scope

- Create package metadata、ESM / strict TypeScript configuration與 lockfile。
- Define build、typecheck與 Node test runner scripts。
- Pin supported Node LTS policy and package manager behavior from SDD。
- Add smoke tests that prove package build / test entrypoints work。

## Out of Scope

- Domain types、schema registry、error registry、config loader、hash implementation。
- Work Item parser、runtime、enforcement、Gates、adapters、Project Intake、GitHub integration。

## Acceptance Criteria

- [ ] `AC-HNS-CORE-001-001`：Package使用 ESM、TypeScript strict mode及 SDD指定的 Node-compatible module policy。
- [ ] `AC-HNS-CORE-001-002`：npm lockfile存在，build、typecheck與 test scripts可在 clean install後執行。
- [ ] `AC-HNS-CORE-001-003`：Smoke tests通過，且 package沒有 vendor adapter或 runtime behavior。
- [ ] `AC-HNS-CORE-001-004`：Diff只包含本 Work Item Write Scope，無 canonical governance修改。

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `REV-HNS-SDD-001` PASS for the exact SDD at commit `d98137c13110ed2c29be3ae5399d5b9d0c9ea96e`

## Blockers

- None. Independent SDD approval recorded as `REV-HNS-SDD-001`.

## Notes

- FIRST IMPLEMENTATION WORK ITEM。
- Approval evidence：`docs/08_agent_reviews/review_log.md#rev-hns-sdd-001---harness-v01-sdd-independent-review`。
- Implementer evidence：`docs/08_agent_reviews/review_log.md#rce-hns-core-001---implementer-role-completion-evidence`。
- Reviewed artifact manifest：`docs/08_agent_reviews/manifests/HNS-CORE-001-implementation.md` (`sha256:4de7f7fc6c0ff6154fa4765556b2cd6183847555132d95b01905e0d6ebb17fa8`)。
- 不依賴 Hard Enforcement、Codex / Claude Adapter capability或 GitHub Provisioning transport決策。
