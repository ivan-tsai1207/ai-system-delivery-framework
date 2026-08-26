# HNS-CORE-005 Immutable Implementation Manifest

## Metadata

| Field | Value |
|---|---|
| Work Item | `HNS-CORE-005` |
| Test Discovery Companion | `HNS-CORE-005-TEST-DISCOVERY` |
| Base Branch | `develop` |
| Base Commit | `fb48e9ce63e2421ef5efb9dc90ea025f9526a371` |
| Control Plane Preparation Commit | `efbe79dc1ae03324b2c96938bebde134855dc8a7` |
| Final Implementation Commit | `69cc15276f254544d4d06ceaae0125d815e2ac9d` |
| Test Discovery / Candidate Commit | `86aa33f9fefdacbdd9577802861d49bb07477d2c` |
| Maker Execution IDs | `EXE-HNS-CORE-005-MAKER-001`; `EXE-HNS-CORE-005-TEST-DISCOVERY-MAKER-001` |
| Node / npm | `v24.19.0` / `11.17.0` |
| Risk Class | `MEDIUM` |
| Required Review Profiles | `TECH_REVIEWER`; `QA_REVIEWER`; `SECURITY_REVIEWER` |

This manifest binds the complete candidate tree before independent review. Any change to an artifact below invalidates this manifest and all review evidence bound to its SHA-256.

## Commit Lineage

```text
fb48e9ce63e2421ef5efb9dc90ea025f9526a371
  -> efbe79dc1ae03324b2c96938bebde134855dc8a7
  -> 69cc15276f254544d4d06ceaae0125d815e2ac9d
  -> 86aa33f9fefdacbdd9577802861d49bb07477d2c
```

## Validation Summary

| Check | Result |
|---|---|
| `npm ci` | `PASS`; 0 vulnerabilities |
| `npm run build` | `PASS` |
| `npm run typecheck` | `PASS` |
| Focused hash / config tests | `PASS`; 30 passed, 0 failed |
| `npm test` | `PASS`; 126 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo; count is evidence, not a permanent requirement |
| `npm audit --audit-level=high` | `PASS`; 0 vulnerabilities |
| Dependency boundary | `PASS`; no dependency or lockfile change |

## Artifact Identity

| Path | Git Blob SHA | Content SHA-256 |
|---|---|---|
| `work-items/HNS-CORE-005-TEST-DISCOVERY.md` | `70e9fa262ca67342e6bb30544035605f14dcc706` | `sha256:70d151083b3326e7b3facfde9f9f3eb9ac7a729603547990521189dc2d19cc67` |
| `harness/package.json` | `72bcacfdcc8c405d388c506959d7ddbaeaed35dc` | `sha256:dc36a72219f0cef6e967d32ff6268481f978554aeb10a8e27ff3b6094a04769a` |
| `harness/src/config/config.ts` | `410cc389a40c350f80e269d8fdb0a84b89c31afe` | `sha256:571495b6072d8dc637c96a5c82fbfb4c4d671cd1fc74ca9009d4ff40d6211440` |
| `harness/src/config/index.ts` | `baa285a27ed445096dd95c936f4525875cd5d2c5` | `sha256:5851ea2dbae760271c9ba166f35c3e71d8d99627b722a3feebd686a4b569cfbc` |
| `harness/src/core/hash/canonical.ts` | `f6329c92fde757b8c50ea67c4f887fe824d50f77` | `sha256:066b2a6b8a7d7b6fe41e394d08a87251f4af3cc361c3bafeb75042bb8bde208e` |
| `harness/src/core/hash/index.ts` | `21a6a35c2673a93bdc991ded622a4339e641eb72` | `sha256:8f3cb25d0fac720345f00f0d83c7485755545865e7a3327d2d25526ae59d6e4d` |
| `harness/src/core/hash/sha256.ts` | `ef093044f8a7f0df9e196fa5fd5d024afc43245b` | `sha256:c6b0b201d73d605d0f339046811ba659d4d6feb27b4d531cd17aa12d7105cf80` |
| `harness/tests/fixtures/config/canonical-a.json` | `d4a05772294fccad5b23ae0baf2caeba7bbe14f8` | `sha256:8a3463c95e38ff5e80b294afebcfdb5823346212137f89bad1c55d8125c4d3f8` |
| `harness/tests/fixtures/config/canonical-b.json` | `c146fff1566f289bb90eb5159ee8db1dda4fb843` | `sha256:2348bde25fcc4d3f2454759d6185f554ec233c9ee3ccd3152ff2a2606bab0fea` |
| `harness/tests/fixtures/config/host-valid.json` | `319470a2f611b5e2fdd09b772cd00b994ca11691` | `sha256:b6ef5d682275a950a7e565b42a32eb1db975b1c5877292c1680abf308466c42b` |
| `harness/tests/fixtures/config/project-narrow.json` | `0c18ecad2c24779279afdef839c1dc4817a14b79` | `sha256:37d5dfa66a2ddda0aa2087977c1a586597057678ac044d47746920daf0b8f24e` |
| `harness/tests/fixtures/config/secret-value.json` | `d44478f0d10c68345d93ce53516bdafc2e024867` | `sha256:04851c9bdce991e093109830b189ebffaf39cad4e052cbdce0698891d320d4fb` |
| `harness/tests/fixtures/config/unknown-key.json` | `f68a6cad63f00a9a59058e9f3a10d96eb0f58042` | `sha256:f3757aec77c16bb7f9e041db9a91bb5e82fc7ca59df3849518b9e2d5d53f0331` |
| `harness/tests/unit/config/config.test.mjs` | `029da4e07da6dc4adae198bbdb919c10a55c489a` | `sha256:8744c060553dc663b37ca91d2d2899c34e364b885e67be81f3d1df8e1b3cddde` |
| `harness/tests/unit/core/hash/hash.test.mjs` | `9eb7e2c54d3d7702aca4bfbb233538ba9d699f5f` | `sha256:3ed9f93968ac5bf422ffcab3d9f9ff7cd267c4237bbb9fbda3c21a85931ba76e` |

## Contract Summary

- Canonical serialization normalizes Unicode, sorts normalized keys, emits deterministic UTF-8 bytes, rejects unsupported values and cycles, and preserves path-independent identity.
- SHA-256 and mismatch verification are deterministic; mismatch diagnostics expose only hashes and a redacted artifact context.
- Config loading accepts only `harness.config/v1`, rejects unknown keys and secret-bearing keys/values, and produces immutable values.
- Effective precedence is secure built-ins, trusted host config, project narrowing, then invocation narrowing; lower layers cannot expand identity, visibility, adapter, context, timeout, or environment policy.
- Child environment policy starts empty and contains only an explicit validated allowlist; no process environment is read or injected.
- Default Node test discovery includes all prior suites plus hash and config suites.

## Scope Statement

- The candidate contains only the companion Work Item, authorized hash/config source and tests/fixtures, and the authorized package test-discovery change.
- No dependency, lockfile, Context/Policy compiler, audit store, runtime process, filesystem/network I/O, adapter, or later-phase implementation is included.
