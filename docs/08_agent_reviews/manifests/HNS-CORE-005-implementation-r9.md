# HNS-CORE-005 Immutable Implementation Manifest R9

## Metadata

| Field | Value |
|---|---|
| Work Item | `HNS-CORE-005` |
| Base Branch / Commit | `develop` / `fb48e9ce63e2421ef5efb9dc90ea025f9526a371` |
| R8 Candidate / Reviews | `27b14265ebb4a5870573abecae4a551014445982` / `REV-HNS-CORE-005-TECH-008`, `REV-HNS-CORE-005-QA-008` |
| R9 Remediation / Candidate | `a0877b3c79328b72fee12f477df6c0107373e121` |
| Maker Execution ID | `EXE-HNS-CORE-005-REMEDIATION-R9-001` |
| Supersedes Manifest | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation-r8.md` / `sha256:e66abaaa9318d7a17870e79509490411a0425f4ac3646e22ff6fc339a4588b95` |
| Node / npm | Required `v24.19.0` / `11.17.0`; local rerun observed `v24.16.0` / `11.13.0` |
| Risk / Required Profiles | `MEDIUM` / `TECH_REVIEWER`; `QA_REVIEWER`; `SECURITY_REVIEWER` |

This immutable delta is the single post-override remediation of the current R8 candidate. It replaces exactly two R8 rows. All other effective artifact identities are inherited from the complete prior manifest chain.

## Validation Summary

| Check | Result |
|---|---|
| `npm ci` | `PASS`; local engine warning because runner is below required Node/npm |
| `npm run build` | `PASS` |
| `npm run typecheck` | `PASS` |
| Focused config tests | `PASS`; 29 passed, 0 failed |
| Bounded Security probe | `PASS`; targeted `SECURITY-006-001`, historical classifier regressions, non-disclosure, environment deny, and safe-name controls |
| `npm test` | `PASS`; 140 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo |
| `npm audit --audit-level=high` | `PASS`; 0 vulnerabilities |
| Scope | `PASS`; only two authorized config files changed; no dependency/lock change |

## Replacement Identity

| Path | Git Blob SHA | Content SHA-256 | Status |
|---|---|---|---|
| `harness/src/config/config.ts` | `5cdf0303f3d00910bd80e914c979c926ec6da25a` | `sha256:be377db9617fc036a31f545e9bb46cd71751ea433e014c6711f988c13f5e035e` | `REPLACEMENT` |
| `harness/tests/unit/config/config.test.mjs` | `e5e5956d36e4a576b25f10d936ec55d18f97056d` | `sha256:d99799c881cd0bb0b5b540b1f17d6a0b593ce6324c4b9e9dafb7fd63e8b19bd2` | `REPLACEMENT` |

## Inherited Effective Identity

| Path | Git Blob SHA | Content SHA-256 |
|---|---|---|
| `work-items/HNS-CORE-005-TEST-DISCOVERY.md` | `70e9fa262ca67342e6bb30544035605f14dcc706` | `sha256:70d151083b3326e7b3facfde9f9f3eb9ac7a729603547990521189dc2d19cc67` |
| `harness/package.json` | `72bcacfdcc8c405d388c506959d7ddbaeaed35dc` | `sha256:dc36a72219f0cef6e967d32ff6268481f978554aeb10a8e27ff3b6094a04769a` |
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
| `harness/tests/unit/core/hash/hash.test.mjs` | `9eb7e2c54d3d7702aca4bfbb233538ba9d699f5f` | `sha256:3ed9f93968ac5bf422ffcab3d9f9ff7cd267c4237bbb9fbda3c21a85931ba76e` |

## R9 Remediation

- Closes `FND-HNS-CORE-005-SECURITY-006-001` by recognizing escaped-whitespace as a sensitive label/value separator for assignment and CLI-style config strings.
- Adds regression coverage for `_authToken\ value`, `--client-secret\ value`, `TOKENVALUE\ value`, and `password_hash\ value`.
- Preserves ordinary escaped text and safe environment names.

## Scope Statement

- No dependency, lockfile, Context/Policy compiler, audit store, runtime process, filesystem/network I/O, adapter, Execution Engine, Enforcement, Codex Adapter, Claude Adapter, E2E Pilot, Token Efficiency Audit, or A/B Regression implementation is included.
