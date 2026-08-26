# HNS-CORE-002 Implementation Manifest

| Field | Value |
|---|---|
| Manifest ID | `MANIFEST-HNS-CORE-002-IMPLEMENTATION` |
| Feature | `harness-core` |
| Reviewed Work Items | `HNS-CORE-002`, `HNS-CORE-002-TEST-FIX` |
| Base | `f165ac83811b46ac4dc7143296f5758694d6e30f` |
| Original HNS-CORE-002 Implementation | `e54950ede6677ee760905a734f4418968bb4a583` |
| Control Plane Remediation WI | `492621fb2533cf0c401d86a0469e38964a737b27` |
| Remediation Implementation | `e35aea8ac5c79f0ed026019d16df9bed598e73a1` |
| Prepared By | `CONTROL_PLANE_PREPARATION` |
| Preparation Execution ID | `CP-HNS-CORE-002-REVIEW-PREP-20260818T172636Z` |
| Prepared At | `2026-08-18T17:26:36Z` |

## Candidate Lineage

```text
f165ac83811b46ac4dc7143296f5758694d6e30f
  -> e54950ede6677ee760905a734f4418968bb4a583
  -> 492621fb2533cf0c401d86a0469e38964a737b27
  -> e35aea8ac5c79f0ed026019d16df9bed598e73a1
```

## HNS-CORE-002 Implementation Scope

Original implementation delta from `f165ac83811b46ac4dc7143296f5758694d6e30f` to `e54950ede6677ee760905a734f4418968bb4a583`:

- `harness/src/core/domain.ts`
- `harness/src/index.ts`
- `harness/tests/unit/core/domain.test.mjs`

## HNS-CORE-002-TEST-FIX Implementation Scope

Control-plane remediation work item delta from `e54950ede6677ee760905a734f4418968bb4a583` to `492621fb2533cf0c401d86a0469e38964a737b27`:

- `work-items/HNS-CORE-002-TEST-FIX.md`

Remediation implementation delta from `492621fb2533cf0c401d86a0469e38964a737b27` to `e35aea8ac5c79f0ed026019d16df9bed598e73a1`:

- `harness/package.json`

## Reviewed File Identities

| Path | Git Blob | SHA-256 |
|---|---|---|
| `harness/src/core/domain.ts` | `15470338adca09757f97abf0d68b2e3a254af528` | `059650ba908d2694e97d3dfff0a3f527c0f65033c018a62874ec0a241e97c6aa` |
| `harness/src/index.ts` | `352642b371004e83c1600663f63d9669e2918dcb` | `cce34c3e2595601772d3ef6ce59fe16510f4477a8c85409a2b1c49e7149743a5` |
| `harness/tests/unit/core/domain.test.mjs` | `deb9d70ba03a5317efc00b4449aeaa95519de9e8` | `92c59ce06c4f5c545dd4b802395fffb7248e8efb64a03fa8128fe34df0c4d9fa` |
| `harness/package.json` | `bacbf3f93170d4098f97f269259a198a75491edf` | `bb8db537032ed1c9471a61c9912db04831e3064c368cc976f6bdf90f2229db9c` |

## Review Boundary

- This manifest binds the immutable implementation candidate for independent `TECH_REVIEWER` execution.
- This manifest does not pass `IMPLEMENTATION_GATE`.
- The control-plane work item creation commit `492621fb2533cf0c401d86a0469e38964a737b27` is preparation lineage and is not part of `IMPLEMENTER` source scope.
