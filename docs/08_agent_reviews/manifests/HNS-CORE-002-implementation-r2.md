# HNS-CORE-002 Implementation Manifest R2

| Field | Value |
|---|---|
| Manifest ID | `MANIFEST-HNS-CORE-002-IMPLEMENTATION-R2` |
| Feature | `harness-core` |
| Reviewed Work Items | `HNS-CORE-002`, `HNS-CORE-002-TEST-FIX` |
| Reviewed Candidate Commit | `2b96a9177b22258d58d2668e88c3872aa4828509` |
| Prepared By | `CONTROL_PLANE_PREPARATION` |
| Preparation Execution ID | `CP-HNS-CORE-002-REVIEW-PREP-R2-20260818T174236Z` |
| Maker Execution ID | `CP-HNS-CORE-002-REMEDIATION-CANDIDATE-20260818T174236Z` |
| Prepared At | `2026-08-18T17:42:36Z` |

## Candidate Lineage

```text
f165ac83811b46ac4dc7143296f5758694d6e30f
  -> e54950ede6677ee760905a734f4418968bb4a583
  -> 492621fb2533cf0c401d86a0469e38964a737b27
  -> e35aea8ac5c79f0ed026019d16df9bed598e73a1
  -> a9b55033c4d344fb922e0893b772da9339a933cf
  -> 76c69945d57ccf66869c0a81ab2e0b7ba155860c
  -> 2b96a9177b22258d58d2668e88c3872aa4828509
```

## Lineage Classification

| Commit | Classification | Notes |
|---|---|---|
| `f165ac83811b46ac4dc7143296f5758694d6e30f` | Base | Pre-HNS-CORE-002 baseline. |
| `e54950ede6677ee760905a734f4418968bb4a583` | Implementation commit | Original HNS-CORE-002 domain implementation candidate. |
| `492621fb2533cf0c401d86a0469e38964a737b27` | Control-plane commit | Created HNS-CORE-002-TEST-FIX remediation work item. |
| `e35aea8ac5c79f0ed026019d16df9bed598e73a1` | Implementation commit | Test discovery remediation candidate. |
| `a9b55033c4d344fb922e0893b772da9339a933cf` | Reviewer evidence commit | Recorded `REV-HNS-CORE-002-TECH-001` request-changes evidence and findings. |
| `76c69945d57ccf66869c0a81ab2e0b7ba155860c` | Control-plane commit | Prepared remediation work item routing after technical findings. |
| `2b96a9177b22258d58d2668e88c3872aa4828509` | Implementation commit | Remediated HNS-CORE-002 technical findings and added regression coverage. |

## Candidate Implementation File Identities

| Path | Git Blob | SHA-256 |
|---|---|---|
| `harness/src/core/domain.ts` | `1e71a839bb520e2fc2fb0fea6a61c7265a49dfe2` | `c6e76e7b32430415c4ecccbdcae9d269a6872620075d62c4a6cf993f80238811` |
| `harness/src/index.ts` | `352642b371004e83c1600663f63d9669e2918dcb` | `cce34c3e2595601772d3ef6ce59fe16510f4477a8c85409a2b1c49e7149743a5` |
| `harness/tests/unit/core/domain.test.mjs` | `933f69055ec0f525ce806c9796b92a7df34813c7` | `ef1f13a0615f039c136adb65447e87a99fa86b3149a878afa09393b555dee18a` |
| `harness/package.json` | `bacbf3f93170d4098f97f269259a198a75491edf` | `bb8db537032ed1c9471a61c9912db04831e3064c368cc976f6bdf90f2229db9c` |

## Review Boundary

- This manifest binds the immutable remediation candidate for independent `TECH_REVIEWER` and `QA_REVIEWER` execution.
- This manifest does not pass `IMPLEMENTATION_GATE`.
- Prior manifest `docs/08_agent_reviews/manifests/HNS-CORE-002-implementation.md` remains immutable evidence for the previous review.
- Open findings from `REV-HNS-CORE-002-TECH-001` remain `OPEN` until independent reviewers validate closure.
