# HNS-CORE-005 Immutable Implementation Manifest R8

## Metadata

| Field | Value |
|---|---|
| Work Item | `HNS-CORE-005` |
| Base Branch / Commit | `develop` / `fb48e9ce63e2421ef5efb9dc90ea025f9526a371` |
| R7 Candidate / TECH Review | `137788993cc588836ee52292413b06b553b18ac1` / `REV-HNS-CORE-005-TECH-007` |
| R8 Remediation / Candidate | `27b14265ebb4a5870573abecae4a551014445982` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R8-001` |
| Supersedes Manifest | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r7.md` / `sha256:de431db1016078d135bc561b44d83d7002c909768815b8b499d2c3c3a78f8ba3` |
| Node / npm | `v24.19.0` / `11.17.0` |
| Risk / Required Profiles | `MEDIUM` / `TECH_REVIEWER`; `QA_REVIEWER`; `SECURITY_REVIEWER` |

This immutable delta replaces exactly two rows of the complete R7 manifest. The other thirteen artifact identities are inherited byte-for-byte through the declared R7 manifest hash.

## Validation Summary

| Check | Result |
|---|---|
| Install / build / typecheck | `PASS` |
| Focused hash / config | `PASS`; 44 passed, 0 failed |
| Default tests | `PASS`; 140 passed, 0 failed/skipped/todo |
| High audit | `PASS`; 0 vulnerabilities |
| Scope | `PASS`; only two authorized files; no dependency/lock change |

## Replacement Identity

| Path | Git Blob SHA | Content SHA-256 | Status |
|---|---|---|---|
| `harness/src/config/config.ts` | `bae9499f822e45947ce5a3e3e1675e75f06f53f0` | `sha256:df9d6596169e182cc2e92fc15b9661c4ae9539a1d1058e954f410a5035c4b32b` | `REPLACEMENT` |
| `harness/tests/unit/config/config.test.mjs` | `eee8c9a78cd47fbed0e578af8aedbdfcb69e639c` | `sha256:7d98486aa4c0ba60255667b40aedc23696da380463b81039bad0a75ffd225191` | `REPLACEMENT` |

## R8 Remediation

- `FND-HNS-CORE-005-TECH-007-001`: npm-style extraction now handles bounded escaped-whitespace and quoted npm key forms before existing sensitive-label normalization; pending independent closure.
- R7 escaped-whitespace, narrow escape/URL decoding, non-disclosure, historical credential/key/environment, false-positive, narrowing, immutability, hash, and capability behavior remains covered.

## Scope Statement

- No dependency, lockfile, Context/Policy compiler, audit store, runtime process, filesystem/network I/O, adapter, or later-phase implementation is included.
