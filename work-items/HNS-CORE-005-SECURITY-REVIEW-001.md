# Work Item Contract

| Field | Value |
|---|---|
| Schema Version | `harness.work-item/v2` |
| ID | `HNS-CORE-005-SECURITY-REVIEW-001` |
| Title | Independently Review HNS Core 005 Security Boundaries |
| Role | `REVIEWER` |
| Feature | `harness-core` |
| Phase | `REVIEW` |
| Status | `TODO` |
| Spec Version | `harness-v0.1-review` |
| Design Version | `N/A` |
| Risk Class | `MEDIUM` |
| Review Profile | `SECURITY_REVIEWER` |
| Reviewed Artifact | `docs/08_agent_reviews/manifests/HNS-CORE-005-implementation.md` |
| Reviewed Artifact Hash | `sha256:432afa16c262c514d36eb74e212d322f5579f641dc7e0883ac9266fee8a99b0d` |
| Maker Execution ID | `EXE-HNS-CORE-005-MAKER-001` |

## Objective

Independently verify HNS-CORE-005 fail-closed secret rejection, redacted diagnostics, config privilege narrowing, explicit environment allowlist, unsafe-input handling, and absence of runtime/credential/I/O expansion.

## Requirement References

- Requirement IDs：`AC-HNS-CORE-005-002` through `AC-HNS-CORE-005-004`; relevant test-discovery companion ACs
- Feature Spec：`N/A`
- Screen IDs / Screen Specs：`N/A`
- ADR：`N/A`
- Architecture / SDD sections：`docs/harness_v0.1_SDD.md` Sections 31-32、38、40.1、46 Phase 1
- Review / Evidence references：`RCE-HNS-CORE-005-IMPLEMENTATION-001`; current TECH evidence/findings

## Read Scope

- Tier 1 REVIEWER and `SECURITY_REVIEWER` context
- Assigned Work Item, active Implementation Gate, immutable manifest
- Maker evidence, current TECH evidence/findings, direct requirements, and all reviewed artifacts

## Write Scope

- `docs/08_agent_reviews/review_log.md`

## Forbidden Scope

- Reviewed manifest
- `harness/**`
- `.ai/**`
- `docs/**` except append-only `docs/08_agent_reviews/review_log.md`
- `templates/**`
- `work-items/**`

## Scope

- Verify secret-bearing keys/values and sensitive environment names fail closed without disclosure; project/invocation cannot expand host authority; diagnostics redact artifact context; parser inputs cannot trigger accessors, unsupported prototypes, prototype pollution, unsafe deserialization, or mutable policy escape; candidate adds no credential source, process environment read/injection, I/O, network, adapter, or dependency trust change.
- Use independent adversarial probes in addition to checked-in tests.

## Out of Scope

- Modifying reviewed artifacts or acting as TECH, QA, Gate Checker, Implementer, merger, accepted-risk authority, or lifecycle closer.

## Acceptance Criteria

- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-001-001`：Manifest/hash/candidate binding and independent Reviewer identity are valid.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-001-002`：Secret-key/value/environment rejection and diagnostics redaction pass adversarial checks without leakage.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-001-003`：Narrowing-only precedence, empty child baseline, immutable outputs, and unsafe object/input rejection fail closed.
- [ ] `AC-HNS-CORE-005-SECURITY-REVIEW-001-004`：No credential, environment injection, filesystem/network/process, adapter, dependency, production, or destructive boundary is introduced.

## Required Gates

- `IMPLEMENTATION_GATE`

## Dependencies

- `RCE-HNS-CORE-005-IMPLEMENTATION-001`

## Blockers

- None

## Notes

- Decision is limited to `PASS / REQUEST_CHANGES / BLOCK`.
- Reviewer must not modify implementation, manifest, Work Items, or prior evidence.
