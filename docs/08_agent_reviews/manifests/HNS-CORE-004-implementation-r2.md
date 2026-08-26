# HNS-CORE-004 Immutable Implementation Manifest R2

## Metadata

| Field | Value |
|---|---|
| Work Item | `HNS-CORE-004` |
| Test Discovery Companion | `HNS-CORE-004-TEST-DISCOVERY` |
| Base Branch / Commit | `develop` / `977a90fa373d3500285a628c4cf07fe31b1470cd` |
| R1 Manifest | `docs/08_agent_reviews/manifests/HNS-CORE-004-implementation.md` |
| R1 Manifest Hash | `sha256:3c7289da5b299798e853593fa3b904d77136d579a34891459f550cc520638d5a` |
| R1 Candidate Commit | `091307f9778ba5005e99b174b0a44f1d3c1d5147` |
| R1 TECH Evidence | `REV-HNS-CORE-004-TECH-001` (`REQUEST_CHANGES`) |
| Remediation Commit / R2 Candidate | `8541d2b192392885c1d033cb5f05992c1b37a0d6` |
| Remediation Maker Execution | `IMP-HNS-CORE-004-REMEDIATION-R2-001` |
| Finding Under Review | `FND-HNS-CORE-004-TECH-001-001` (`OPEN MAJOR`) |
| Node / npm | `v24.19.0` / `11.17.0` |
| Risk Class | `LOW` |
| Required Review Profiles | `TECH_REVIEWER`; `QA_REVIEWER`; Security trigger calculation pending |

This manifest is an immutable delta over the exact R1 manifest. The complete R2 artifact set is the same nine paths recorded by R1. Seven paths retain their R1 Git blob and SHA-256 identities; the two replacements below are authoritative for R2. The R1 manifest hash makes all inherited identities unambiguous.

## R2 Artifact Replacements

| Path | R1 Git Blob | R2 Git Blob | R2 Content SHA-256 |
|---|---|---|---|
| `harness/src/errors/safe-details.ts` | `b161b15dadd4d5d0d8972ebffe56f9503de0ea67` | `f0c00db864763cda0f72cb9192fb0116acdecd8a` | `sha256:66065b49582d380a9c985d6f487e5c6f9324ec4aea77cba94c085e772a550aca` |
| `harness/tests/unit/errors/errors.test.mjs` | `2caacb4a739eb6ca31682b11e94241054e3ad13c` | `45792deca18f191735fa4643c29018895be2f953` | `sha256:d6b2902138d1a6ef42e39fc52eafd4fd71859391a2e0b1cd2f565d3a532a0d57` |

## Remediation Contract

- Sensitive marker normalization must detect delimiter-free compact variants containing canonical token, authorization, password, secret, credential, cookie, bearer, and API-key markers.
- The same detector must govern details redaction and unsafe custom-message rejection.
- `tokenvalue`, `authorizationvalue`, `passwordhash`, `clientsecret`, `servicecredential`, and `sessioncookie` must not expose raw values.
- The synthetic sentinel must remain absent from details, message, stack, typed cause chain, and serialized JSON.
- Safe custom messages and all R1 error/exit behavior must remain unchanged.

## Validation Summary

| Check | Result |
|---|---|
| `npm ci` | `PASS`; 7 packages installed; 0 vulnerabilities |
| `npm run build` | `PASS` |
| `npm run typecheck` | `PASS` |
| `npm test` | `PASS`; 96 discovered tests passed, 0 failed, 0 cancelled, 0 skipped, 0 todo; count is evidence only |
| `npm audit --audit-level=high` | `PASS`; 0 vulnerabilities |
| Focused compact-marker reproductions | `PASS`; all six prior bypass variants redacted/rejected with sentinel absent |
| Skip / todo / only scan | `PASS`; no matches |

## Scope Statement

- R2 changes only `harness/src/errors/safe-details.ts` and `harness/tests/unit/errors/errors.test.mjs` relative to R1.
- No canonical catalog/exit mapping, HarnessError API, package/lock, dependency, Work Item, governance, SDD, CLI, process exit, runtime, adapter, filesystem/network capability, vendor normalization, HNS-CORE-005, or unrelated implementation changed.
- `FND-HNS-CORE-004-TECH-001-001` remains `OPEN` until a new independent TECH_REVIEWER validates closure against this manifest hash.

