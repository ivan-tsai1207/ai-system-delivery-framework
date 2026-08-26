# HNS-CORE-003 Immutable Implementation Manifest

## Metadata

| Field | Value |
|---|---|
| Work Item | `HNS-CORE-003` |
| Dependency Companion | `HNS-CORE-003-DEPENDENCY-AJV` |
| Test Discovery Companion | `HNS-CORE-003-TEST-DISCOVERY` |
| Base Branch | `develop` |
| Base Commit | `5ef3e18432440f52230130512ec097ec1ac6bd3f` |
| Control Plane Preparation Commit | `49edddf17a8ec24bfc0934f6b2f9e1f0b91aa2d7` |
| Dependency Commit | `d9f65defb55cdc51a8786e3735807ba752d77d34` |
| Schema Implementation Commit | `b1474326e1672ce7e8201e9c209f199fff11c322` |
| Test Discovery Commit / Candidate Commit | `b12b416c51bbd4dc268c5e3d2cdbe811eba7565c` |
| Maker Execution IDs | `IMP-HNS-CORE-003-DEPENDENCY-001`; `IMP-HNS-CORE-003-SCHEMAS-001`; `IMP-HNS-CORE-003-TEST-DISCOVERY-001` |
| Node | `v24.19.0` |
| npm | `11.17.0` |
| Risk Class | `MEDIUM` |
| Required Review Profiles | `TECH_REVIEWER`; `QA_REVIEWER`; `SECURITY_REVIEWER` |

This manifest binds the complete candidate tree before independent review. Any change to an artifact below invalidates this manifest and all review evidence bound to its SHA-256.

## Commit Lineage

```text
5ef3e18432440f52230130512ec097ec1ac6bd3f
  -> 49edddf17a8ec24bfc0934f6b2f9e1f0b91aa2d7
  -> d9f65defb55cdc51a8786e3735807ba752d77d34
  -> b1474326e1672ce7e8201e9c209f199fff11c322
  -> b12b416c51bbd4dc268c5e3d2cdbe811eba7565c
```

## Validation Summary

| Check | Result |
|---|---|
| `npm ci` | `PASS`; 7 packages installed; 0 vulnerabilities |
| `npm run build` | `PASS` |
| `npm run typecheck` | `PASS` |
| `npm test` | `PASS`; 52 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo |
| `npm audit --audit-level=high` | `PASS`; 0 vulnerabilities |
| `npm ls ajv --all` | `PASS`; exact `ajv@8.20.0` |
| Skip / todo / only scan | `PASS`; no matches |

## Artifact Identity

| Path | Git Blob SHA | Content SHA-256 |
|---|---|---|
| `work-items/HNS-CORE-003-DEPENDENCY-AJV.md` | `22cb865412f6ccb78c854754a00cdfb92056f9d3` | `sha256:4f0073d7b5019ea95bcf43d69373dc9dc6a919756a88b0cc69837ece046ca890` |
| `work-items/HNS-CORE-003-TEST-DISCOVERY.md` | `d93a8d80612d9f5b10fa409e26869642d0c76d86` | `sha256:ffd4a583dff723d43d476f82b4d18fe99ce4fe7f6b4d634314e64b87949dde3a` |
| `harness/package-lock.json` | `d9bfe8cc5c94b833d16ce1e5125efc3e61c879fe` | `sha256:3edf6b4f5c392ab946f1616b2b100cf494ba106e33a269e0796e8cd60a4736c3` |
| `harness/package.json` | `262ff99dd0985b960461f0da7c3af57c1452ef17` | `sha256:d1737a4dd2a7e2dad72997ac8b9d8057931fe988c84085da7f4aff45d1970d4f` |
| `harness/schemas/audit-v2.schema.json` | `847bf1ea88332782cc82b9c85eb651d1d3f5b081` | `sha256:3151da6f45da61587cdfc5e949ae31b08981b5538d824ee1c3b8e4c58dd563b1` |
| `harness/schemas/bootstrap-v1.schema.json` | `70b3b959f3074d6bc978b449c6ba5c975549e06f` | `sha256:9f4f4046ff5a6b285b2d7151ceb587a9c727d2d7a023e73769a282bc5277f657` |
| `harness/schemas/context-v3.schema.json` | `baf80f58e8d9056f7ce31d2ff69a0f09dbac84cd` | `sha256:770c711593207504f302fb72dd3bff5f831817cd9e30459cfee118621f7b4550` |
| `harness/schemas/delivery-assurance-v1.schema.json` | `2bc1931a4383d22a5d20386f6f1e07b42c3568b3` | `sha256:440e3ab3af36995ffb53662e495ebde8ab0fa3372a5d0418554b359b51355170` |
| `harness/schemas/execution-profile-v2.schema.json` | `1a553746e23f964e92855a4a02b8ba09e059b550` | `sha256:2167fd03e41b2024aa81f8c1dd8b3323de1b71fbf90b5e209a25f918c14800de` |
| `harness/schemas/finding-v1.schema.json` | `8bd77616215bf22f5dc87af7f2d4b3c8c9fbea5e` | `sha256:6923bc30e3266118a19aa2c4cb7662324a928500af4982eb1a1f39bee90ce948` |
| `harness/schemas/policy-v1.schema.json` | `1bc06fab88f6be82eb426572995379e71f11028a` | `sha256:c5badb35ef794e9f1e656309985688cc85105f023ebc84dee2d56912d51cdcf5` |
| `harness/schemas/project-context-v1.schema.json` | `e24c0f3b1e2b74ba3f6caf6ba64ebd2dba0f6512` | `sha256:040754eab6b1c0f48f37da605e6bbe79aa38c230a397ff0005ec112fa8649ef8` |
| `harness/schemas/review-assignment-v1.schema.json` | `d7974c1d34e3a3b0c121a608f76fb430f434ce5b` | `sha256:c79ae6089c108d15a150dcab45c5a2b1e7ea3968407f64f6ec93056f76c3aeb0` |
| `harness/schemas/risk-assignment-v1.schema.json` | `f16c6a0762744fe500b3fab240cf5806cc1808d9` | `sha256:c7e7dc6b44f063f950584159310147d8266571b1abfe545b86f5b9d0956c1ab9` |
| `harness/schemas/role-evidence-v1.schema.json` | `4b0b760776189ff7a0dcb1df787fea513195e167` | `sha256:daa6bc27ad15b8e54516344261f02bbd61d9a4b2e0ba84ed6eb7ab86f372ed12` |
| `harness/schemas/work-item-v2.schema.json` | `b86efe219eb155311a0c558eafcb137eb381bfff` | `sha256:b3b4172cd8a5584b8718520bb000158f030c08a051298e0765f8075a7abd5919` |
| `harness/src/schemas/documents.ts` | `4e5fba3a1338feeca062f746029ea455898a4655` | `sha256:47ff3f04e5e0067a23be64b0f98685b6ae37b7ba113c9b6aea629eaa6349b6aa` |
| `harness/src/schemas/index.ts` | `d0607cbb503f6a6fb9cb9613fc9ead7ecd4abf78` | `sha256:518a74d88930222b0922d4c46cb889e9e364ab11cc0f69698af7a47a549969e4` |
| `harness/src/schemas/registry.ts` | `20b2298123e25d40c5da5ded41552c7290c5114d` | `sha256:219cde8beef004f1f120a15ccd1bdda182617cafa0c14953bf7a573ee810c70b` |
| `harness/tests/fixtures/schemas/delivery-assurance-invalid-enum.json` | `c16f9dba65c5f504013bd8f84885cba42ae8b042` | `sha256:6efbd54b091c44a5b334a14fa0d65d2386bc6954606cee20f90a2925e9300f02` |
| `harness/tests/fixtures/schemas/delivery-assurance-missing-required.json` | `b4544a4c0cf51dd8964a4b53dd09e8ee3f0b1d58` | `sha256:6ea1975f17d4cefc52df1429e185728205574747f0ebdf13cda65638ad61a24a` |
| `harness/tests/fixtures/schemas/delivery-assurance-valid.json` | `f25b8fce0a23aedbc8c402ecc8110ed56f2cc72b` | `sha256:51a08f99f27b4d40d670a7e6d5fc015077d12a205512ac7b678ae36b62bb7da0` |
| `harness/tests/fixtures/schemas/delivery-assurance-wrong-schema-version.json` | `a5c903366107d87ebbdedadd29a8cbd151c22962` | `sha256:37776e24a0c8fd752ab4768e8bbe697e9625cbe3616cab24d74ed82fd411192c` |
| `harness/tests/fixtures/schemas/finding-invalid-enum.json` | `8b73ce958f2934475786e3262d73b18d61fe2764` | `sha256:f3311d08a1cc6c759d305ff611950bec0067de98b818c23c23f56783956def37` |
| `harness/tests/fixtures/schemas/finding-missing-required.json` | `64ff202f8a9de8c35c6d79ce90970cd47cf81161` | `sha256:9599e86eec5789f9683e7581f9b89a0907c0e83377c155ebd5fb9a8b5896df6f` |
| `harness/tests/fixtures/schemas/finding-valid.json` | `bec41a251b8c646f215a78bbbd163caf25fc32dc` | `sha256:ebec6898637bf7aece2d6d4fede898256e4c6746a4f7f8a14932ba98ab944081` |
| `harness/tests/fixtures/schemas/finding-wrong-schema-version.json` | `5d57f840a2ac9ec4dc6515a3df06a734cfd3e2b0` | `sha256:4d66ab2c677f14502b9e105f7c736f304844c2f72b4c1836106031735461f3ca` |
| `harness/tests/fixtures/schemas/review-assignment-invalid-enum.json` | `024c84fa3b2a1a272b1f1adfaf2b002f1d27a759` | `sha256:8c3300d491ad0720e0adfc4c71c4d9ff97d284e5ff03d279746af89eae894d0f` |
| `harness/tests/fixtures/schemas/review-assignment-missing-required.json` | `970a6badb6a20ea780806a8b5791033719616e3d` | `sha256:2c9c23fb161baea7c4ecf04f76940eb8c8e8a8bd030e097eff0601a135558abd` |
| `harness/tests/fixtures/schemas/review-assignment-valid.json` | `12c742eb85865caae9aa8e8098c9a9edaa5b552d` | `sha256:c20bdc0e2f99488f4ab4119691b35d79d8ba4e6c22e7c6cb7d65c5c47257494d` |
| `harness/tests/fixtures/schemas/review-assignment-wrong-schema-version.json` | `c694bc4ca10eec9c4dfbe2980b21583b0dfb6d02` | `sha256:2cab19702fc9afeafe1c05cfd9f7d3494783d859ef4090997692bfb0da88ca89` |
| `harness/tests/fixtures/schemas/role-evidence-invalid-enum.json` | `281eb9dc518decfeb786c7dfae22d5f7c07f1d9f` | `sha256:c4c4b0328d7f5f1f65df063d66b8414360c20026a2521da2abb7460722ae78ce` |
| `harness/tests/fixtures/schemas/role-evidence-missing-required.json` | `59c20384cdfe2ca740f2d66ba63b54c5b3e16f22` | `sha256:4d62c7d3c1adcaf1dcf199ba039b40ff1455743e393f5cfcc348f46da4038b1f` |
| `harness/tests/fixtures/schemas/role-evidence-valid.json` | `e242d8a1edfe176f16850566db09705bb715fa39` | `sha256:721713c0af1f9deb1fa60d50287cc5c6eab4107c04f734528aec60fe936a909c` |
| `harness/tests/fixtures/schemas/role-evidence-wrong-schema-version.json` | `474789ae68500b05a50e4f79fa756d963b8b2a8f` | `sha256:a65a8f11041a637993d05a9e799e8b26e58611d1fe67aef6bb0d1986e91320b8` |
| `harness/tests/fixtures/schemas/work-item-v1-legacy.json` | `507665ad1b905f4ef4a1910f554ed443280e600f` | `sha256:3a7f46cebd8255dc51e4fae6c1af8c153b83cca05dfd5bdc8fcda057564ab9a0` |
| `harness/tests/fixtures/schemas/work-item-v2-invalid-enum.json` | `a282ae6029a5ce41f7edb0570f379ce03406b498` | `sha256:f747f816cd9b47d147e18517391f48bc88dfdba1041b3d37198fa2d5323f3548` |
| `harness/tests/fixtures/schemas/work-item-v2-missing-required.json` | `3a48140bcd90e1563722db47a7045ba9a440f7db` | `sha256:94d9590360b5f9408049e23b77a9fe01a43163798e2321bb2cf38fa50f1378de` |
| `harness/tests/fixtures/schemas/work-item-v2-valid.json` | `eed8ca9cf5e3fe78bab2228e1ccd999b686577fe` | `sha256:99fae0a1d3ec031ef95c8e42422cd7a4e81e4925ac7c5c50253edf99b383ccac` |
| `harness/tests/fixtures/schemas/work-item-v2-wrong-schema-version.json` | `b28241a1be9f7ef947991a6ed9fee784142021f0` | `sha256:093932d912e89228de4039d7ac22e90ac513e6f1b44c7498f72b9a1f5f751a6f` |
| `harness/tests/unit/schemas/accountability.test.mjs` | `8e32612c96801f13a8685bfee38631aceada408a` | `sha256:63f386268a9440ad98949e9f3e8e95d002ee85b404a5147e5a7a48f7fae0867c` |
| `harness/tests/unit/schemas/artifacts.test.mjs` | `2fda71033c40810e871f2674f25cfa05d52694d8` | `sha256:750f9671c7e61b4babb1ea3877e24e07f3b86451f322cfe6e00f1dda78ee6ef5` |
| `harness/tests/unit/schemas/boundary.test.mjs` | `ce1bafd956c1e6642968ff2a7537ee0cf47921a5` | `sha256:58fe80ee2ea1a1d732aed646ba2e41e68e7b77b98734875ad749ecc9bbfde9b5` |
| `harness/tests/unit/schemas/registry.test.mjs` | `654cb9716aa159e44e8e3073119c5bab30fd479f` | `sha256:195a7a5096ddec20cbbdc16bdf5a4a5d7783ca2bd05dd416ff471889eaf853e1` |
| `harness/tests/unit/schemas/work-item.test.mjs` | `d35662d22891da3a9691409a29b22c6914df8046` | `sha256:952d4e9631cf5ee4df86264ff36efa28e725455e4bf12110a76e3e3e0d8e6ed0` |

## Scope Statement

- Candidate includes only the two Control Plane companion contracts and authorized HNS-CORE-003 dependency, schema, fixture, test, and test-discovery paths.
- Production schema code is pure, deterministic, vendor-neutral at its public boundary, and uses Ajv's Draft 2020-12 entrypoint internally.
- No Work Item Markdown parser, migration engine, Context Compiler, Policy Compiler, persistence, filesystem/process/network side effect, vendor adapter, HNS-CORE-004, or HNS-CORE-005 implementation is included.
