# HNS-EXEC-001 Immutable Implementation Manifest R2

## Metadata

| Field | Value |
|---|---|
| Work Item | `HNS-EXEC-001` |
| Branch Creation Commit | `27cf599b753196e8a1fa84cd3d2f64a4aebf7ff8` |
| Original Candidate | `2ab7924e1c95facf41bbf4bdd01124c04ca021e0` |
| Original Candidate Parent | `27cf599b753196e8a1fa84cd3d2f64a4aebf7ff8` |
| R1 TECH Evidence Commit | `5d89027dd6b4f15b929935bbb91a6b20502a3827` |
| R2 Candidate / Actual Parent | `0f98124c9e053314f63e9fd3937918d176fc32c2` / `5d89027dd6b4f15b929935bbb91a6b20502a3827` |
| Maker Execution ID | `EXE-HNS-EXEC-001-REMEDIATION-R2-001` |
| Supersedes Manifest | `docs/08_agent_reviews/manifests/HNS-EXEC-001-implementation.md` / `sha256:2a1a7086a5614ab042e542e277a700fee5f5463a7086e2483b531741d5179b95` |
| Node / npm | `v24.19.0` / `11.17.0` |
| Risk / Required Profiles | `HIGH` / `TECH_REVIEWER`, `QA_REVIEWER`, `SECURITY_REVIEWER` |

## Validation Summary

| Check | Result |
|---|---|
| `npm ci` | `PASS`; 42 packages audited, 0 vulnerabilities |
| `npm run build` | `PASS` |
| `npm run typecheck` | `PASS` |
| Focused parser tests | `PASS`; 23 passed, 0 failed |
| `npm test` | `PASS`; 172 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo |
| `npm audit --audit-level=high` | `PASS`; 0 vulnerabilities |
| Scope | `PASS`; remediation changed exactly three authorized parser files |

## Replacement Identity

| Path | Git Blob SHA | Content SHA-256 | Status |
|---|---|---|---|
| `harness/src/work-items/index.ts` | `da3ca11dd09fddd71a391d5c8101fc2d58190757` | `sha256:0506e8322f2ccab26de5cc10931232df93e8099505ac48b1cf5b049586662758` | `REPLACEMENT` |
| `harness/src/work-items/parser.ts` | `84814f94004621e978e2ca104c5ac7b1b52feba3` | `sha256:0ea4fd7546334f38fb05c19ba36e923ed0394fc090456206cbd8b93b029985e0` | `REPLACEMENT` |
| `harness/tests/unit/work-items/parser.test.mjs` | `8c652e929e662ece361f99ad5711f282765c7b23` | `sha256:5345ab6b4e6d66737fd4d3077f05da1a095afa5032483abde8828be92945aa23` | `REPLACEMENT` |

## Inherited Effective Identity

| Path | Git Blob SHA | Content SHA-256 |
|---|---|---|
| `harness/package.json` | `10d8184cb9c136351ffcfa9104e40364344b2f0b` | `sha256:5cb391a5372e2f681bd4c258a1ff8274f03bb25f1f17455fdf9532c8bb77b0e7` |
| `harness/package-lock.json` | `d7988267bcd287379dcad336a2ec12433f66475e` | `sha256:57362c6472c6f207f2ef5c4f6c623c12804df8ffe2df835ffc35b77756ec39bc` |
| `harness/src/index.ts` | `cac25d69de85755a65705fdc72b39b43e5dc7893` | `sha256:b7a57c78cbe9b8bfd9d04a7d10b2d37f250dcd6964a998d7b1c908bfd1a909fd` |
| `harness/src/execution/state.ts` | `e2ba04e98bbd6e8a3fb5336fd10d5a569e22364f` | `sha256:b7e1cb3cd70fffcf2a88d5bb69899b27d7d2d42a9c154f89b13e5a74d0d0b3c9` |
| `harness/tests/fixtures/work-items/HNS-FIXTURE-001.md` | `b59dc8161fa03d5bdca84f0abe1fc4ea6c85ebf1` | `sha256:d37a3e1bad7a39fd17063121f1e4c21fccc1755e9db93080b4ba5ed4901c5db0` |
| `harness/tests/unit/execution/state.test.mjs` | `8938cd88abf4a4ad98f78012bc38c9926f6723d4` | `sha256:31574a43b429d8265ce83bcac05c693bee24ed4a0cb24e55676760c9282bc68e` |

## Finding Remediation

- `FND-HNS-EXEC-001-TECH-001-001`: corrected by this replacement manifest's exact lineage; pending independent closure.
- `FND-HNS-EXEC-001-TECH-001-002`: unsupported embedded/extended glob syntax now rejects; supported whole-segment overlap is tested bidirectionally; pending independent closure.
- `FND-HNS-EXEC-001-TECH-001-003`: caller-supplied bounded canonical target registry now resolves Work Items, paths, and anchors without repository scan; pending independent closure.

## Scope Statement

- R2 is the single automatic remediation cycle allowed for `HNS-EXEC-001`.
- No Context/Policy compiler, Gate Runner, Audit Recorder, adapter, enforcement, network, credential, production execution, E2E Pilot, or Codex Adapter is included.
- Any further candidate artifact change invalidates reviews bound to this manifest hash.
