# HNS-CORE-005 Immutable Implementation Manifest R2

## Metadata

| Field | Value |
|---|---|
| Work Item | `HNS-CORE-005` |
| Test Discovery Companion | `HNS-CORE-005-TEST-DISCOVERY` |
| Base Branch | `develop` |
| Base Commit | `fb48e9ce63e2421ef5efb9dc90ea025f9526a371` |
| Control Plane Preparation Commit | `efbe79dc1ae03324b2c96938bebde134855dc8a7` |
| Initial Implementation Commit | `69cc15276f254544d4d06ceaae0125d815e2ac9d` |
| Test Discovery Commit / R1 Candidate | `86aa33f9fefdacbdd9577802861d49bb07477d2c` |
| R1 TECH Review Commit | `48a0e3ee9a5f358799b1f709ebd95ba58043ea3c` |
| R2 Remediation / Candidate Commit | `0e0166d746f02c3e5ba00fcf3cc0812bfeeb34f9` |
| Maker Execution IDs | `EXE-HNS-CORE-005-MAKER-001`; `EXE-HNS-CORE-005-TEST-DISCOVERY-MAKER-001`; `EXE-HNS-CORE-005-REMEDIATION-R2-001` |
| Supersedes Manifest | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation.md` / `sha256:432afa16c262c514d36eb74e212d322f5579f641dc7e0883ac9266fee8a99b0d` |
| Node / npm | `v24.19.0` / `11.17.0` |
| Risk Class | `MEDIUM` |
| Required Review Profiles | `TECH_REVIEWER`; `QA_REVIEWER`; `SECURITY_REVIEWER` |

This manifest binds the complete R2 candidate tree after remediation of both R1 TECH findings. Any change to an artifact below invalidates this manifest and all review evidence bound to its SHA-256.

## Commit Lineage

```text
fb48e9ce63e2421ef5efb9dc90ea025f9526a371
  -> efbe79dc1ae03324b2c96938bebde134855dc8a7
  -> 69cc15276f254544d4d06ceaae0125d815e2ac9d
  -> 86aa33f9fefdacbdd9577802861d49bb07477d2c
  -> 7d0b7c35d498b12ebf8c37e274985e6d42b3a694
  -> 48a0e3ee9a5f358799b1f709ebd95ba58043ea3c
  -> 0e0166d746f02c3e5ba00fcf3cc0812bfeeb34f9
```

## Validation Summary

| Check | Result |
|---|---|
| `npm ci` | `PASS`; 0 vulnerabilities |
| `npm run build` | `PASS` |
| `npm run typecheck` | `PASS` |
| Focused hash / config tests | `PASS`; 32 passed, 0 failed |
| `npm test` | `PASS`; 128 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo; count is evidence, not a permanent requirement |
| `npm audit --audit-level=high` | `PASS`; 0 vulnerabilities |
| R2 remediation scope | `PASS`; only `config.ts` and `config.test.mjs` changed |
| Dependency boundary | `PASS`; no dependency or lockfile change |

## Artifact Identity

| Path | Git Blob SHA | Content SHA-256 | R2 Status |
|---|---|---|---|
| `work-items/HNS-CORE-005-TEST-DISCOVERY.md` | `70e9fa262ca67342e6bb30544035605f14dcc706` | `sha256:70d151083b3326e7b3facfde9f9f3eb9ac7a729603547990521189dc2d19cc67` | `INHERITED` |
| `harness/package.json` | `72bcacfdcc8c405d388c506959d7ddbaeaed35dc` | `sha256:dc36a72219f0cef6e967d32ff6268481f978554aeb10a8e27ff3b6094a04769a` | `INHERITED` |
| `harness/src/config/config.ts` | `9cf1621f2b5655a1eb42c8b6eadc80a9fa2d42bd` | `sha256:e4a71481edb26aecd3aa9d2bbf301f070757fe9a4f32bb5d041a1dc150983a37` | `REPLACEMENT` |
| `harness/src/config/index.ts` | `baa285a27ed445096dd95c936f4525875cd5d2c5` | `sha256:5851ea2dbae760271c9ba166f35c3e71d8d99627b722a3feebd686a4b569cfbc` | `INHERITED` |
| `harness/src/core/hash/canonical.ts` | `f6329c92fde757b8c50ea67c4f887fe824d50f77` | `sha256:066b2a6b8a7d7b6fe41e394d08a87251f4af3cc361c3bafeb75042bb8bde208e` | `INHERITED` |
| `harness/src/core/hash/index.ts` | `21a6a35c2673a93bdc991ded622a4339e641eb72` | `sha256:8f3cb25d0fac720345f00f0d83c7485755545865e7a3327d2d25526ae59d6e4d` | `INHERITED` |
| `harness/src/core/hash/sha256.ts` | `ef093044f8a7f0df9e196fa5fd5d024afc43245b` | `sha256:c6b0b201d73d605d0f339046811ba659d4d6feb27b4d531cd17aa12d7105cf80` | `INHERITED` |
| `harness/tests/fixtures/config/canonical-a.json` | `d4a05772294fccad5b23ae0baf2caeba7bbe14f8` | `sha256:8a3463c95e38ff5e80b294afebcfdb5823346212137f89bad1c55d8125c4d3f8` | `INHERITED` |
| `harness/tests/fixtures/config/canonical-b.json` | `c146fff1566f289bb90eb5159ee8db1dda4fb843` | `sha256:2348bde25fcc4d3f2454759d6185f554ec233c9ee3ccd3152ff2a2606bab0fea` | `INHERITED` |
| `harness/tests/fixtures/config/host-valid.json` | `319470a2f611b5e2fdd09b772cd00b994ca11691` | `sha256:b6ef5d682275a950a7e565b42a32eb1db975b1c5877292c1680abf308466c42b` | `INHERITED` |
| `harness/tests/fixtures/config/project-narrow.json` | `0c18ecad2c24779279afdef839c1dc4817a14b79` | `sha256:37d5dfa66a2ddda0aa2087977c1a586597057678ac044d47746920daf0b8f24e` | `INHERITED` |
| `harness/tests/fixtures/config/secret-value.json` | `d44478f0d10c68345d93ce53516bdafc2e024867` | `sha256:04851c9bdce991e093109830b189ebffaf39cad4e052cbdce0698891d320d4fb` | `INHERITED` |
| `harness/tests/fixtures/config/unknown-key.json` | `f68a6cad63f00a9a59058e9f3a10d96eb0f58042` | `sha256:f3757aec77c16bb7f9e041db9a91bb5e82fc7ca59df3849518b9e2d5d53f0331` | `INHERITED` |
| `harness/tests/unit/config/config.test.mjs` | `9e8cb3133c9236882dd527bfb913d0adae58f019` | `sha256:f62ae0beb566cc83fe14b6139e633b6801b105b456a45062478859e13de3033a` | `REPLACEMENT` |
| `harness/tests/unit/core/hash/hash.test.mjs` | `9eb7e2c54d3d7702aca4bfbb233538ba9d699f5f` | `sha256:3ed9f93968ac5bf422ffcab3d9f9ff7cd267c4237bbb9fbda3c21a85931ba76e` | `INHERITED` |

## R2 Finding Remediation

- `FND-HNS-CORE-005-TECH-001-001`: candidate now rejects normalized API-key, authorization, cookie, and private-key assignment markers without echoing values; pending independent closure.
- `FND-HNS-CORE-005-TECH-001-002`: candidate now rejects JWT-bearing environment names from Agent-visible allowlists; pending independent closure.

## Scope Statement

- R2 changes only the two authorized config implementation/test artifacts needed to remediate R1 findings; all other R1 candidate artifacts are inherited byte-for-byte.
- No dependency, lockfile, Context/Policy compiler, audit store, runtime process, filesystem/network I/O, adapter, or later-phase implementation is included.
