# HNS-EXEC-001 Immutable Implementation Manifest R3

## Metadata

| Field | Value |
|---|---|
| Work Item | `HNS-EXEC-001` |
| Branch Creation Commit | `27cf599b753196e8a1fa84cd3d2f64a4aebf7ff8` |
| R2 Candidate / TECH Evidence | `0f98124c9e053314f63e9fd3937918d176fc32c2` / `REV-HNS-EXEC-001-TECH-002` |
| Human Decision | one targeted remediation approved for `FND-HNS-EXEC-001-TECH-002-001`; not Accepted Risk or architecture change |
| R3 Candidate / Actual Parent | `a8dc2070d3ae19ff28daab4c30fcf4923b3fa0a0` / `89e96338c2ab9201cfbe5ad28841de0ec6512c1f` |
| Maker Execution ID | `EXE-HNS-EXEC-001-TARGETED-REMEDIATION-R3-001` |
| Supersedes Manifest | `docs/08_agent_reviews/manifests/HNS-EXEC-001-implementation-r2.md` / `sha256:1eddcedd96d643ecd27db655b61161d9985fe987aebf8f431c81f2759f344b9b` |
| Node / npm | `v24.19.0` / `11.17.0` |
| Risk / Required Profiles | `HIGH` / `TECH_REVIEWER`, `QA_REVIEWER`, `SECURITY_REVIEWER` |

## Validation Summary

| Check | Result |
|---|---|
| `npm ci` | `PASS`; 42 packages audited, 0 vulnerabilities |
| `npm run build` | `PASS` |
| `npm run typecheck` | `PASS` |
| Focused parser tests | `PASS`; 26 passed, 0 failed |
| `npm test` | `PASS`; 175 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo |
| `npm audit --audit-level=high` | `PASS`; 0 vulnerabilities |
| Scope | `PASS`; targeted remediation changed exactly two authorized parser files |

## Replacement Identity

| Path | Git Blob SHA | Content SHA-256 | Status |
|---|---|---|---|
| `harness/src/work-items/parser.ts` | `32367b104782368fe961fec27bcd4d2a6005287d` | `sha256:26ffa75410222276a122c65a9229fb9d6a92d82d8c59193709eedb3fef20f449` | `REPLACEMENT` |
| `harness/tests/unit/work-items/parser.test.mjs` | `05be058bdb26ece62e1a27b33a2e1f78b0e29768` | `sha256:38e520616c3ad010bca47f34157c4808689fcedcfc3c3c6e53441f507fe9b600` | `REPLACEMENT` |

## Inherited Effective Identity

| Path | Git Blob SHA | Content SHA-256 |
|---|---|---|
| `harness/package.json` | `10d8184cb9c136351ffcfa9104e40364344b2f0b` | `sha256:5cb391a5372e2f681bd4c258a1ff8274f03bb25f1f17455fdf9532c8bb77b0e7` |
| `harness/package-lock.json` | `d7988267bcd287379dcad336a2ec12433f66475e` | `sha256:57362c6472c6f207f2ef5c4f6c623c12804df8ffe2df835ffc35b77756ec39bc` |
| `harness/src/index.ts` | `cac25d69de85755a65705fdc72b39b43e5dc7893` | `sha256:b7a57c78cbe9b8bfd9d04a7d10b2d37f250dcd6964a998d7b1c908bfd1a909fd` |
| `harness/src/execution/state.ts` | `e2ba04e98bbd6e8a3fb5336fd10d5a569e22364f` | `sha256:b7e1cb3cd70fffcf2a88d5bb69899b27d7d2d42a9c154f89b13e5a74d0d0b3c9` |
| `harness/src/work-items/index.ts` | `da3ca11dd09fddd71a391d5c8101fc2d58190757` | `sha256:0506e8322f2ccab26de5cc10931232df93e8099505ac48b1cf5b049586662758` |
| `harness/tests/fixtures/work-items/HNS-FIXTURE-001.md` | `b59dc8161fa03d5bdca84f0abe1fc4ea6c85ebf1` | `sha256:d37a3e1bad7a39fd17063121f1e4c21fccc1755e9db93080b4ba5ed4901c5db0` |
| `harness/tests/unit/execution/state.test.mjs` | `8938cd88abf4a4ad98f78012bc38c9926f6723d4` | `sha256:31574a43b429d8265ce83bcac05c693bee24ed4a0cb24e55676760c9282bc68e` |

## Targeted Remediation

- `FND-HNS-EXEC-001-TECH-002-001`: REVIEWER Work Item parsing now requires its reviewed artifact path to be an existing entry in the supplied bounded canonical-target registry and requires exact registered SHA-256 metadata match; pending independent closure.
- Regression coverage includes registered/matching PASS and nonexistent, unregistered, traversal, absolute, unsupported metadata, hash mismatch, and malformed REVIEWER binding failures.
- Existing non-REVIEWER `N/A` rules, parser behavior, execution-state behavior, deterministic bounded lookup, and no-scan/no-I/O boundary are preserved.

## Scope Statement

- R3 is the single Human-approved targeted remediation for `FND-HNS-EXEC-001-TECH-002-001`.
- No new architecture, registry rewrite, filesystem crawler, Context Compiler, Gate Runner, Audit Recorder, adapter, enforcement, production execution, E2E Pilot, or Codex Adapter is included.
- Any further candidate artifact change invalidates reviews bound to this manifest hash.
