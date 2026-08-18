# Agentic SDLC Workflow

本文件定義 ChatGPT、Claude、Codex 與其他 Agent 的交接流程，避免 Intent Debt 與 Context Drift。新專案在進入正式規格與 Harness execution 前，依 `.ai/PROJECT_INTAKE_CONTRACT.md` 完成 intake 與 repository provisioning。

## 標準流程

```text
Natural Language Request
  ↓
Intent Classification
  ↓
Project Intake / Discovery
  ↓
Project Context / Project Proposal
  ↓
Human Repo Approval
  ↓
Repo Provisioning / Framework Bootstrap
  ↓
ChatGPT / Product Architect：建立 Source of Truth
  ↓
PRODUCT_VISION / PRD / SRS / ARCHITECTURE / SDD / FEATURE SPEC
  ↓
Maker Self Review / Artifact Hash / Risk Classification
  ↓
Independent SPEC_REVIEWER
  ↓
SPEC GATE
  ↓
Claude / UX Designer：受約束的 UI/UX 設計
  ↓
UX CONTRACT / SCREEN SPEC / DESIGN TOKENS
  ↓
Maker Self Review / Independent UX_REVIEWER
  ↓
DESIGN GATE
  ↓
Codex / Implementer：受約束的實作
  ↓
CODE / TEST
  ↓
Maker Self Review / Independent TECH_REVIEWER
  ↓
QA_REVIEWER / SECURITY_REVIEWER when required by Risk
  ↓
IMPLEMENTATION GATE
  ↓
Required Independent Reviews Complete / Candidate Aggregation
  ↓
Delivery Candidate
  ↓
DELIVERY_ASSURANCE_REVIEWER
  ↓
DELIVERY_ASSURANCE_GATE
  ↓
RELEASE_GATE
  ↓
PR / Review / Merge
  ↓
Living Spec Update
```

## New Project Intake

- 使用者以自然語言提出新專案，不需手動建立 Work Item、指定 Role / Phase 或準備 Harness Execution Profile。
- Intent 無法確認時先進行最小必要釐清，不得直接啟動 Implementer。
- 建立 Project Repo 前必須呈現 Project Proposal，並取得使用者對 repo target 與 visibility 的明確核准。
- 新 repo 預設 private；Framework Repo 與 Project Repo 必須分離。
- Repo Provisioning 完成後，由系統建立內部 specification work item，交由 Harness 綁定 `PRODUCT_ARCHITECT`。
- 初始規格通過 Spec Gate 後才能進入 Design；Design Gate 通過後才能建立 implementation work items。
- 初始 specification Maker不得自行通過 Spec review；Orchestrator必須產生 `SPEC_REVIEWER` Work Item並驗證 artifact hash。
- Project Intake 負責 execution 前的 intake、initialization 與 orchestration；Harness 只負責特定 Agent task 的 runtime boundary，不決定產品需求。

## State 與 Delta

- `docs/02_product/PRODUCT_VISION.md`、`docs/02_product/PRD.md`、`docs/03_requirements/SRS.md`、`docs/04_system/ARCHITECTURE.md`、`docs/04_system/SDD.md`、`specs/<feature>/spec.md` 描述系統應該是什麼。
- `work-items/<WORK-ITEM-ID>.md` 描述這一次要改什麼。
- Work item 不應重複整份規格，只引用相關 State 文件與版本。

## Harness Runtime Binding

當任務由 Agent Harness 執行時：

```text
Active Role + Phase + Feature + Work Item
  ↓
.ai/HARNESS_CONTRACT.md
  ↓
Risk + Review Profile + Context Package + Filesystem Boundary + Tool Boundary
  ↓
Agent Execution
  ↓
Role Completion Evidence + Findings + Active Gate + Audit Evidence
```

- Harness Contract 只負責 runtime enforcement，不建立新的 Authority、Role 或 Gate 規則。
- Runtime permissions 必須由 active role、assigned work item 與既有治理規則的交集產生。
- Harness 無法組成 required context 或發現越權、spec gap、spec conflict 時，必須依 contract 停止受影響工作。

## Accountability and Independent Review

```text
Maker Execution
→ Mandatory Self Review
→ Immutable Artifact Hash
→ Orchestrator / Harness Risk Classification
→ Independent Review Assignment
→ Required REVIEWER Executions
→ Existing Phase Gate
→ Delivery Candidate Manifest
→ DELIVERY_ASSURANCE_REVIEWER
→ DELIVERY_ASSURANCE_GATE
→ RELEASE_GATE
```

- Maker不得 final approve自己的 Spec、Design或 Implementation。
- Reviewer Profile是 `REVIEWER` 的 subordinate binding，不是新的 Role；Agent不得自選 profile或降低 Risk。
- 一個 review execution綁定一個 primary profile與 reviewed artifact hash。
- Checker不得在同一 execution修改並批准 artifact；若成為 Maker修正，必須有新 execution、新 hash與新的 independent Checker。
- Artifact hash變更後，所有針對舊 hash的 review PASS失效。
- Review decision使用 `PASS / REQUEST_CHANGES / BLOCK`；GateResult使用 `PASS / FAILED / NEEDS_CLARIFICATION`。
- Risk-based assignment不得讓所有 task機械式經過全部 profile；QA / Security依 artifact與 risk trigger決定。

### Responsibility Return Path

| Finding subject | Return owner |
|---|---|
| Requirement / scope / business rule | `PRODUCT_ARCHITECT` |
| UX flow / state / accessibility | `UX_DESIGNER` |
| Implementation / code / test correction | `IMPLEMENTER` |
| Test coverage verification | `IMPLEMENTER` correction + `QA_REVIEWER` re-review |
| Security finding | `IMPLEMENTER` or actual Maker correction + `SECURITY_REVIEWER` re-review |

Final Assurer只驗證 completion chain與 finding closure，不得自行修改受審 artifact。

### Delivery Assurance

Required reviews與 existing phase Gates完成後，Orchestrator建立 immutable delivery candidate manifest與 `DELIVERY_ASSURANCE_REVIEWER` Work Item。`OPEN BLOCKING` finding、missing review、stale artifact hash、unresolved SPEC GAP / CONFLICT或 scope drift都阻止 `DELIVERY_ASSURANCE_GATE` PASS。

Delivery Assurance PASS不自動 merge、release或 deploy；Human仍保留 business approval、accepted risk、high-risk side effect與 release / production decision。

## 交接規則

- ChatGPT / Product Architect 產出或更新規格，不直接產出未授權 UI 或 code。
- Claude / UX Designer 只能在既定規格內設計，不得改需求、角色、權限、API 或資料模型。
- Codex / Implementer 只能依 Feature Spec 與 Design Contract 實作，不得重設計或新增未授權能力。
- 任何角色發現規格不足，應提出 Change Request，而不是自行補完。

## Design Source Intake

設計來源不限於 Figma，也可能來自 Claude design output、HTML prototype、v0 output、static mockup 或其他可視化原型。

```text
Figma / Claude Design / HTML Prototype
  ↓
Design Source Map
  ↓
Screen Spec / UX Contract
  ↓
Design Gate
  ↓
Codex Implementation
```

規則：

- Raw design source 不能直接成為 Source of Truth。
- Raw design source 不得覆蓋 canonical Product Vision、PRD、SRS、Architecture、SDD 或 Feature Spec。
- Claude design output 與 HTML prototype 只能作為 design input、visual reference 或 implementation reference。
- 交給 Codex 實作前，必須先登錄於 `design/<feature>/Design_Source_Map.md`，並轉成 `design/<feature>/screens/<SCREEN-ID>.md` 或其他明確 Design Contract。
- 若 design source 包含未授權功能、API、欄位、角色、權限或流程，必須提出 Change Request。

## Canonical Spec Update

- Human approval、Accepted ADR 與 Approved Change Request 都必須寫回 canonical spec，才可供下游 Agent 執行。
- Change Request 不得取代正式規格；其狀態與寫回流程依 `.ai/AUTHORITY.md`。
- 發現上下層規格衝突時，停止受影響工作並回報 `SPEC CONFLICT`。
