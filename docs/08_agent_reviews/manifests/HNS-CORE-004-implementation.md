# HNS-CORE-004 Immutable Implementation Manifest

## Metadata

| Field | Value |
|---|---|
| Work Item | `HNS-CORE-004` |
| Test Discovery Companion | `HNS-CORE-004-TEST-DISCOVERY` |
| Base Branch | `develop` |
| Base Commit | `977a90fa373d3500285a628c4cf07fe31b1470cd` |
| Control Plane Preparation Commit | `a78ab0baf33c286f8441d1fa4ca2695fdccdbcaa` |
| Initial Error Registry Commit | `449a24c55b093b7aca29a536c99b659bbca49e9b` |
| Error Registry Self-Review Correction / Final Implementation Commit | `b56bf1092ed107aa71e6fc2e833569023a6645bf` |
| Test Discovery Commit / Candidate Commit | `091307f9778ba5005e99b174b0a44f1d3c1d5147` |
| Maker Execution IDs | `IMP-HNS-CORE-004-ERRORS-001`; `IMP-HNS-CORE-004-TEST-DISCOVERY-001` |
| Node | `v24.19.0` |
| npm | `11.17.0` |
| Risk Class | `LOW` |
| Required Review Profiles | `TECH_REVIEWER`; `QA_REVIEWER`; Security trigger calculation pending |

This manifest binds the complete candidate tree before independent review. Any change to an artifact below invalidates this manifest and all review evidence bound to its SHA-256.

## Commit Lineage

```text
977a90fa373d3500285a628c4cf07fe31b1470cd
  -> a78ab0baf33c286f8441d1fa4ca2695fdccdbcaa
  -> 449a24c55b093b7aca29a536c99b659bbca49e9b
  -> b56bf1092ed107aa71e6fc2e833569023a6645bf
  -> 091307f9778ba5005e99b174b0a44f1d3c1d5147
```

## Validation Summary

| Check | Result |
|---|---|
| `npm ci` | `PASS`; 7 packages installed; 0 vulnerabilities |
| `npm run build` | `PASS` |
| `npm run typecheck` | `PASS` |
| `npm test` | `PASS`; 94 discovered tests passed, 0 failed, 0 cancelled, 0 skipped, 0 todo; count is evidence, not a permanent requirement |
| `npm audit --audit-level=high` | `PASS`; 0 vulnerabilities |
| Skip / todo / only scan | `PASS`; no matches |
| Production boundary scan | `PASS`; no process exit, filesystem/network capability, vendor import, or broad `any` in `src/errors` |

## Artifact Identity

| Path | Git Blob SHA | Content SHA-256 |
|---|---|---|
| `work-items/HNS-CORE-004-TEST-DISCOVERY.md` | `85785481300f6be511c9c66625186aa7e45b6624` | `sha256:7ade47ad8cf45b84118473672fba3bcd04807f8efaad126f3a7a39a606a5e429` |
| `harness/package.json` | `f4dc6e4d7ecf35fa56493623e78a4d9d5a7f2562` | `sha256:8949f0350c37f0da1e5b4bd77c880ef9e53d75f09494e133c4ab1ceb330e9dd9` |
| `harness/src/errors/error-catalog.ts` | `8e21fb31747af4ec7af607b4101cab63f88c52cc` | `sha256:8025c4b45bffe920cb04868d18b934bde6e75e114fe28a4f41845844eb7dd982` |
| `harness/src/errors/exit-code-registry.ts` | `00b1962a1954def3c28d0101dd1ef643de1bf554` | `sha256:9e16fe96618c092ed48518db7189f32b2dc2039bfa878bd1c211ddb58fc31f32` |
| `harness/src/errors/harness-error.ts` | `a137dc20a534c9042f2baa9470ab8cda7b9579b8` | `sha256:71a31700b20b3b7b018648a0173f6ece1bb460605e3d9e7d2510b1d5cccfa81b` |
| `harness/src/errors/index.ts` | `af5a40b22966237747635ee85234c6a5390e5587` | `sha256:4ed4efb10f5af8550f7c4cca3a8890f13f972d56291b170cc1046f51ee520353` |
| `harness/src/errors/safe-details.ts` | `b161b15dadd4d5d0d8972ebffe56f9503de0ea67` | `sha256:4e3bf7abcef35c427f1362341687f8114a28d523b5a27275a2df1b20db5d6e5f` |
| `harness/tests/unit/errors/errors.test.mjs` | `2caacb4a739eb6ca31682b11e94241054e3ad13c` | `sha256:698ac4ae8534e3b7772853b401d5568b1bcf078f2a576d7097b88b68c4736eda` |
| `harness/tests/unit/errors/harness-error.types.ts` | `203a25a1a0d5086c70bf759bfd6cb1393ab27cc8` | `sha256:eae46354acc7ff6ab7945e30394cf826bbc98101148cb86a8651b1f93b365ea3` |

## Contract Summary

- The catalog contains exactly the 30 SDD Section 33 codes and their canonical metadata.
- Every canonical error maps to exactly one Section 34 exit code; the central exit registry contains exactly 0 through 8.
- Unknown codes, duplicate catalog entries, missing mappings, unknown exit codes, and caller exit-code overrides fail closed.
- `HarnessError`, nested details, typed causes, catalog entries, exit definitions, and serialized snapshots are immutable and deterministic.
- Raw `Error`, vendor-shaped, forged, accessor-backed, circular, mutable non-plain, and unsafe detail inputs are rejected.
- Representative sensitive keys are recursively redacted; unsafe custom-message markers fail before `Error` construction; the synthetic sentinel does not reach message, stack, cause chain, or serialized output.
- The default Node test runner discovers root, core, schema, and error suites.

## Scope Statement

- The candidate includes only the Control Plane companion contract, authorized `harness/src/errors/**` and `harness/tests/unit/errors/**` implementation artifacts, and the authorized `harness/package.json` discovery change.
- No dependency or lockfile change was made.
- No CLI, `process.exit()`, runtime, retry engine, adapter, filesystem/network capability, vendor normalization, HNS-CORE-005 implementation, canonical requirement, governance, or architecture change is included.
- Maker self-review correction `b56bf109...` occurred before this immutable manifest and before any independent review.

