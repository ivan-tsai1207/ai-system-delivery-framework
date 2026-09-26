# HNS-EXEC-001 Immutable Implementation Manifest

## Metadata

| Field | Value |
|---|---|
| Work Item | `HNS-EXEC-001` |
| Base Branch / Commit | `feature/minimal-execution-engine` / `27cf599be8b56842318a2469913d941ba5765545` |
| Candidate Commit | `2ab7924e1c95facf41bbf4bdd01124c04ca021e0` |
| Maker Execution ID | `EXE-HNS-EXEC-001-IMPLEMENTATION-001` |
| Node / npm | `v24.19.0` / `11.17.0` |
| Risk / Required Profiles | `HIGH` / `TECH_REVIEWER`, `QA_REVIEWER`, `SECURITY_REVIEWER` |

## Validation Summary

| Check | Result |
|---|---|
| `npm ci` | `PASS`; 42 packages audited |
| `npm run build` | `PASS` |
| `npm run typecheck` | `PASS` |
| `npm test` | `PASS`; 168 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo |
| `npm audit --audit-level=high` | `PASS`; 0 vulnerabilities |
| `git diff --check` | `PASS` |
| Scope | `PASS`; all nine changed files are authorized by `HNS-EXEC-001` |

## Artifact Identity

| Path | Git Blob SHA | Content SHA-256 |
|---|---|---|
| `harness/package.json` | `10d8184cb9c136351ffcfa9104e40364344b2f0b` | `sha256:5cb391a5372e2f681bd4c258a1ff8274f03bb25f1f17455fdf9532c8bb77b0e7` |
| `harness/package-lock.json` | `d7988267bcd287379dcad336a2ec12433f66475e` | `sha256:57362c6472c6f207f2ef5c4f6c623c12804df8ffe2df835ffc35b77756ec39bc` |
| `harness/src/index.ts` | `cac25d69de85755a65705fdc72b39b43e5dc7893` | `sha256:b7a57c78cbe9b8bfd9d04a7d10b2d37f250dcd6964a998d7b1c908bfd1a909fd` |
| `harness/src/execution/state.ts` | `e2ba04e98bbd6e8a3fb5336fd10d5a569e22364f` | `sha256:b7e1cb3cd70fffcf2a88d5bb69899b27d7d2d42a9c154f89b13e5a74d0d0b3c9` |
| `harness/src/work-items/index.ts` | `bb745df04e251cf4a3ce3f6d036e343d3c4ce29f` | `sha256:79f07d9b383a05510093f4449f504a1422bb4ab42755d9514088b19f812a0d46` |
| `harness/src/work-items/parser.ts` | `2445817d87bcf2f3f5b01d8abccee9b02b6c0185` | `sha256:8b52c6f5e387f231c6cb6b3f507fdaef07f4dc17c8031e420b10ef0c2d86ef02` |
| `harness/tests/fixtures/work-items/HNS-FIXTURE-001.md` | `b59dc8161fa03d5bdca84f0abe1fc4ea6c85ebf1` | `sha256:d37a3e1bad7a39fd17063121f1e4c21fccc1755e9db93080b4ba5ed4901c5db0` |
| `harness/tests/unit/execution/state.test.mjs` | `8938cd88abf4a4ad98f78012bc38c9926f6723d4` | `sha256:31574a43b429d8265ce83bcac05c693bee24ed4a0cb24e55676760c9282bc68e` |
| `harness/tests/unit/work-items/parser.test.mjs` | `93b9e82c563479cd3d7e522218cf3af97116aca2` | `sha256:b19d09493167e65cc8fe462764ba4268ee796529157d323488a380589a4c41f4` |

## Scope Statement

- Implements Work Item v2 AST parsing/loading, deterministic immutable hashes, execution-state transitions, exact Markdown AST dependency, and tests only.
- No Work Item generator, Context/Policy compiler, Gate Runner, Audit Recorder, adapter, enforcement, network, credential, production execution, E2E Pilot, or Codex Adapter is included.
- This manifest is immutable review input. Any candidate artifact change invalidates reviews bound to its hash.
