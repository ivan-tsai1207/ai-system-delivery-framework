# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-001-TECH-REVIEW` |
| Title | Independently Review HNS-CORE-001 Package Foundation |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `DONE` |
| Spec Version | `harness-v0.1-approved-d98137c` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `TECH_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-001-implementation.md` |
| Reviewed Artifact Hash | `sha256:4de7f7fc6c0ff6154fa4765556b2cd6183847555132d95b01905e0d6ebb17fa8` |
| Maker Execution ID | `maker-hns-core-001-b1d635a` |

## Objective

獨立驗證HNS-CORE-001的Node 24、ESM、strict TypeScript、package / lockfile、smoke tests、dependency與scope evidence，產生`TECH_REVIEWER` decision；不得修改受審artifact或自行通過Gate。

## Requirement References

- Requirement IDs：`AC-HNS-CORE-001-001` through `AC-HNS-CORE-001-004`
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_implementation_architecture.md` Sections 16-17；`docs/harness_v0.1_SDD.md` Sections 2-4、40、45-46
- Review / Evidence references：`REV-HNS-SDD-001`、`RCE-HNS-CORE-001`、reviewed manifest above

## Read Scope

- `.ai/CONSTITUTION.md`
- `.ai/AUTHORITY.md`
- `.ai/WORKFLOW.md`
- `.ai/HARNESS_CONTRACT.md`
- `.ai/roles/reviewer.md`
- `.ai/roles/reviewer-profiles/tech-reviewer.md`
- `.ai/gates/implementation-gate.md`
- `templates/Work_Item.md`
- `templates/Agent_Review_Log.md`
- `docs/harness_implementation_architecture.md`
- `docs/harness_v0.1_SDD.md`
- `docs/08_agent_reviews/review_log.md`
- `docs/08_agent_reviews/manifests/HNS-CORE-001-implementation.md`
- `work-items/HNS-CORE-001.md`
- `work-items/HNS-CORE-001-TECH-REVIEW.md`
- `harness/package.json`
- `harness/package-lock.json`
- `harness/tsconfig.json`
- `harness/src/index.ts`
- `harness/tests/package-smoke.test.mjs`

## Write Scope

- `docs/08_agent_reviews/review_log.md` limited to this independent review evidence and findings

## Forbidden Scope

- `.ai/**`
- `docs/harness_implementation_architecture.md`
- `docs/harness_v0.1_SDD.md`
- `docs/08_agent_reviews/manifests/HNS-CORE-001-implementation.md`
- `templates/**`
- `work-items/HNS-CORE-001.md`
- `harness/**`

## Scope

- Verify reviewed manifest SHA-256 and implementation commit identity.
- Inspect package metadata、lockfile、TypeScript config、placeholder source and smoke/config tests.
- Re-run or independently validate clean install、build、typecheck、test and security evidence.
- Verify implementation diff remains within HNS-CORE-001 Write Scope and contains no Phase 2 logic.
- Record `PASS / REQUEST_CHANGES / BLOCK` with evidence and findings.

## Out of Scope

- Modifying reviewed files、specification、Work Item AC or governance.
- Implementing HNS-CORE-002 or any Harness runtime behavior.
- Passing `IMPLEMENTATION_GATE`、merging branches or releasing.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-001-TECH-REVIEW-001`：Reviewed manifest hash、implementation commit and file identities are independently verified.
- [ ] `AC-HNS-CORE-001-TECH-REVIEW-002`：Node 24、ESM、strict TypeScript、dependency and package configuration satisfy HNS-CORE-001.
- [ ] `AC-HNS-CORE-001-TECH-REVIEW-003`：Clean install、build、typecheck、test and audit evidence are reproducible or any failure is recorded as a finding.
- [ ] `AC-HNS-CORE-001-TECH-REVIEW-004`：Implementation scope contains no unauthorized governance、adapter、domain or Phase 2 change.
- [ ] `AC-HNS-CORE-001-TECH-REVIEW-005`：Independent Reviewer decision and findings are appended to the canonical review log.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- Implementation commit `b1d635a34271b4bafa39891a167e6d83412e4083`
- `RCE-HNS-CORE-001` Role Completion Evidence

## Blockers

- None.

## Notes

- Reviewer execution ID must differ from `maker-hns-core-001-b1d635a`.
- Artifact hash change invalidates any decision and requires a new Review Work Item or regenerated binding.
- This Work Item requests technical review only；it does not authorize artifact modification or Gate PASS by the Maker.
