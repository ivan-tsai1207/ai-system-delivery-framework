# HNS-CORE-005 Immutable Implementation Manifest R4

## Metadata

| Field | Value |
|---|---|
| Work Item | `HNS-CORE-005` |
| Test Discovery Companion | `HNS-CORE-005-TEST-DISCOVERY` |
| Base Branch / Commit | `develop` / `fb48e9ce63e2421ef5efb9dc90ea025f9526a371` |
| Initial Implementation Commit | `69cc15276f254544d4d06ceaae0125d815e2ac9d` |
| Test Discovery Commit / R1 Candidate | `86aa33f9fefdacbdd9577802861d49bb07477d2c` |
| R2 Candidate | `0e0166d746f02c3e5ba00fcf3cc0812bfeeb34f9` |
| R3 Candidate / TECH Review | `d230f65f3590b6a69952a7567133e9288b58d9bd` / `REV-HNS-CORE-005-TECH-003` |
| R4 Remediation / Candidate Commit | `2d79a2cbeb3a1d133b979067aaa45d4df165c593` |
| Maker Execution IDs | `EXE-HNS-CORE-005-MAKER-001`; `EXE-HNS-CORE-005-TEST-DISCOVERY-MAKER-001`; `EXE-HNS-CORE-005-REMEDIATION-R2-001`; `EXE-HNS-CORE-005-REMEDIATION-R3-001`; `EXE-HNS-CORE-005-REMEDIATION-R4-001` |
| Supersedes Manifest | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r3.md` / `sha256:328a6a6bb984e37027275360c9b556e7eb3468fb874b078f73173f9292337410` |
| Node / npm | `v24.19.0` / `11.17.0` |
| Risk Class / Required Profiles | `MEDIUM` / `TECH_REVIEWER`; `QA_REVIEWER`; `SECURITY_REVIEWER` |

This manifest binds the complete R4 candidate after remediation of all R3 TECH findings. Any reviewed-artifact change invalidates this manifest and dependent evidence.

## Commit Lineage

```text
fb48e9ce... -> efbe79dc... -> 69cc1527... -> 86aa33f9...
-> 7d0b7c35... -> 48a0e3ee... -> 0e0166d7... -> 2a84841b...
-> 8bea2c33... -> ea601405... -> dd191f42... -> d230f65f...
-> 0fc3ce6a... -> 6b30eff3... -> 2d79a2cb...
```

## Validation Summary

| Check | Result |
|---|---|
| `npm ci` / build / typecheck | `PASS` |
| Focused hash / config tests | `PASS`; covered by default discovery |
| `npm test` | `PASS`; 135 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo; count is evidence only |
| `npm audit --audit-level=high` | `PASS`; 0 vulnerabilities |
| R4 scope / dependency boundary | `PASS`; only `config.ts` and `config.test.mjs`; no dependency or lockfile change |

## Artifact Identity

| Path | Git Blob SHA | Content SHA-256 | R4 Status |
|---|---|---|---|
| `work-items/HNS-CORE-005-TEST-DISCOVERY.md` | `70e9fa262ca67342e6bb30544035605f14dcc706` | `sha256:70d151083b3326e7b3facfde9f9f3eb9ac7a729603547990521189dc2d19cc67` | `INHERITED` |
| `harness/package.json` | `72bcacfdcc8c405d388c506959d7ddbaeaed35dc` | `sha256:dc36a72219f0cef6e967d32ff6268481f978554aeb10a8e27ff3b6094a04769a` | `INHERITED` |
| `harness/src/config/config.ts` | `4210fc29f6a8331033b3f79dd5d7e5567193f150` | `sha256:c586dab826a577f2804f0917883031774c8b818319cccad88ca6e10b2306db1f` | `REPLACEMENT` |
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
| `harness/tests/unit/config/config.test.mjs` | `4628009937be18eee61cb77bee27c8db0895c50e` | `sha256:8ed5941ae25cac821706da3a8b7d949c5b1b4bbd1ea20d57095b609532d5e4c9` | `REPLACEMENT` |
| `harness/tests/unit/core/hash/hash.test.mjs` | `9eb7e2c54d3d7702aca4bfbb233538ba9d699f5f` | `sha256:3ed9f93968ac5bf422ffcab3d9f9ff7cd267c4237bbb9fbda3c21a85931ba76e` | `INHERITED` |

## R4 Finding Remediation

- `FND-HNS-CORE-005-TECH-003-001`: boundary-aware generalized secret value/key classification covers high-confidence provider, compact, quoted, CLI, escaped, and npm credential forms while redacting before diagnostics; pending independent closure.
- `FND-HNS-CORE-005-TECH-003-002`: explicit Git config/executable, compiler-wrapper, command-prefix, and related process-injection environment classes are denied; pending independent closure.
- `FND-HNS-CORE-005-TECH-003-003`: token-boundary classification preserves benign assignment labels and safe names including `KEYBOARD_LAYOUT`, `TOKENIZER_MODE`, and `AUTHORS_STYLE`; pending independent closure.

## Scope Statement

- R4 changes only the two authorized config implementation/test artifacts. All other R3 candidate artifacts are inherited byte-for-byte.
- No dependency, lockfile, Context/Policy compiler, audit store, runtime process, filesystem/network I/O, adapter, or later-phase implementation is included.
