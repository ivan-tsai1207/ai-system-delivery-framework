# Harness v0.1 Development Plan

## Status

| Field | Value |
|---|---|
| Plan Status | Implementation Active |
| SDD Status | Approved |
| Runtime Implementation | Not started |
| Execution Blocker | None for `HNS-CORE-001`; phase dependencies remain enforced |
| First Implementation Work Item | `HNS-CORE-001` |

本計畫只將 `docs/harness_v0.1_SDD.md` 第46節既有12個 phases整理成可管理 batches，不重新設計 Harness或改變dependency。`REV-HNS-SDD-001`已核准exact reviewed SDD，現只授權依dependency順序啟動`HNS-CORE-001`；其他Work Item仍受各自dependency與Gate約束。

## Implementation Principles

- 每張 Work Item使用 `harness.work-item/v2`，由 Orchestrator / Harness指派 Risk與後續 Reviewer Work Items。
- 實作由 `develop`建立 work branch，通過 independent reviews與 required Gates後才可合併。
- Batch dependency不可跳過；未完成 prerequisite不得以 mock claim或 prompt substitute。
- Vendor adapter、hard enforcement、GitHub provisioning的 blocking decisions只在其對應 phase前需要，不阻擋 Phase 1 foundation。
- SDD artifact hash改變時，既有 approval失效並需要新的 independent review。

## Batch Map

| Batch | Name | SDD Phases | Objective | Exit Criteria |
|---|---|---|---|---|
| A | Core Foundation | 1-5 | 建立 typed core、Work Item v2、Context / Policy compiler foundations及 evidence persistence | Phase 1-5 tests與 contract checks通過；無 vendor side effect |
| B | Execution Engine | 6-7 | 建立 execution lifecycle、profile、enforcement ports、fake adapter、five-Gate / review integration與 Git port | Fake end-to-end Work Item → Review → Gate flow通過 |
| C | Real Adapters + Project Flow | 8-11 | 依序完成 Codex、Claude、Project Intake與 Repo Provisioning / Bootstrap | Adapter contract、intake與 mock provider transaction tests通過 |
| D | End-to-End Pilot | 12 | 串接 CLI、dispatch、packaging與 controlled pilot | `AC-HNS-001`至`AC-HNS-024`通過 |

## SDD Phase Dependencies

| Phase | Batch | Depends On | Implementation Outcome |
|---:|---|---|---|
| 1 | A | Independently Approved SDD | Core types、schemas、errors、config、canonical hash |
| 2 | A | Phase 1 | Work Item v2 parser / generator |
| 3 | A | Phases 1-2 | Deterministic Context Compiler |
| 4 | A | Phases 1-3 | Policy Compiler |
| 5 | A | Phase 1 | Audit、role evidence、findings、state、locks、approvals |
| 6 | B | Phases 3-5 | Task Execution Core與 enforcement ports |
| 7 | B | Phases 2、5-6 | Fake adapter、Risk / Review / Assurance、Gates、Git port |
| 8 | C | Phases 6-7 + Codex capability verification | Codex Adapter |
| 9 | C | Phases 6-7 + Claude capability verification | Claude Adapter |
| 10 | C | Phases 1、5、7 | Natural-language Project Intake |
| 11 | C | Phases 1、5、7、10 + GitHub transport decision | Repository Provisioning / Bootstrap |
| 12 | D | Phases 1-11 | Controlled end-to-end pilot |

## Phase 1 Work Items

| Order | Work Item | Risk | Dependency | Purpose |
|---:|---|---|---|---|
| 1 | `HNS-CORE-001` | MEDIUM | `REV-HNS-SDD-001` PASS | Bootstrap TypeScript Harness package |
| 2 | `HNS-CORE-002` | LOW | HNS-CORE-001 | Implement Core Domain Types |
| 3 | `HNS-CORE-003` | MEDIUM | HNS-CORE-001、002 | Implement Versioned Schema Registry |
| 4 | `HNS-CORE-004` | LOW | HNS-CORE-001、002 | Implement Error and Exit Code Registry |
| 5 | `HNS-CORE-005` | MEDIUM | HNS-CORE-001 through 004 | Implement Config and Canonical Hash Foundation |

Phase 1不得實作 Work Item parser、Context / Policy Compiler、runtime lifecycle、enforcement、Gate Runner、adapter、Project Intake或 GitHub transport；這些屬後續 phases。

## First Implementation Work Item

`HNS-CORE-001` 是唯一 `FIRST IMPLEMENTATION WORK ITEM`。

Dependency audit：它只需要 independently Approved SDD、Node.js / TypeScript / npm toolchain與 repository work branch。它不依賴 Hard Enforcement decision、Codex Adapter capability、Claude Adapter capability或 GitHub Provisioning transport，因此是最小且正確的 kickoff task。

## Approval and Start Condition

開始 HNS-CORE-001 前必須同時存在：

1. 獨立 Reviewer execution對 `docs/harness_v0.1_SDD.md` 的 exact artifact hash產生 PASS evidence。
2. Authorized integration將 SDD Status由 `Review`更新為 `Approved`，並引用 review evidence。
3. HNS-CORE-001 Work Item blocker被 Orchestrator依 evidence正式解除。
4. 從最新 `develop`建立 implementation work branch。

上述條件已由`REV-HNS-SDD-001`與本次authorized integration滿足；只解除`HNS-CORE-001`的approval blocker，不預先核准後續Work Item、Implementation Gate或release。
