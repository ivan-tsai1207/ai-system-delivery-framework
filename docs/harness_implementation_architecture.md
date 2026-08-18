# Harness Implementation Architecture

## Document Status

| Field | Value |
|---|---|
| Status | Architecture Draft |
| Scope | Harness v0.1 project orchestration and task execution design |
| Project Intake Contract | `.ai/PROJECT_INTAKE_CONTRACT.md` |
| Runtime Contract | `.ai/HARNESS_CONTRACT.md` |
| Work Item Contract | `templates/Work_Item.md` |
| Implementation | Not started |

本文件只定義 Harness 的 implementation architecture，不是新的 Governance Authority，也不修改 Project Intake Contract、Harness Contract 或 Work Item Contract。若本文件與 Constitution、Authority、Workflow、active role、active gate 或既有 Contract 衝突，必須停止並依既有治理規則處理。

## 1. Design Goals

Harness architecture 必須具備：

- Natural-language entry：使用者可由自然語言開始新專案或既有專案變更，不必手動建立 Work Item。
- Two-plane separation：Project Orchestration Plane 管理專案初始化與 task handoff；Task Execution Plane 管理單一 Work Item 的受控執行。
- Vendor-neutral：核心不依賴單一 Agent vendor。
- Local-first：v0.1 在開發者本機與 repository checkout 執行，不要求常駐雲端服務。
- Repository-driven：work item、governance、specification、design contract 與 gate 都來自 repository。
- Human-controlled side effects：repository creation、destructive operation 與其他高風險行為有明確 owner 與 approval boundary。
- Least privilege：context、filesystem、tools、commands、environment 只開放任務最低需要。
- Auditable：每次 execution 都產生可核對的 context、policy、operation 與 gate evidence。
- Fail closed：無法驗證 input、context、policy 或 enforcement capability 時拒絕啟動或停止執行。
- Adapter-based：Claude、Codex 與未來 Agent 只負責轉譯 Execution Profile。
- Soft / hard enforcement 分離：prompt guidance 不可冒充安全邊界。
- Cross-platform aware：核心 schema 與 orchestration 跨平台；hard enforcement 由可驗證的 backend capability 提供。

Claude Code 與 Codex 是 v0.1 adapters。Gemini、Hermes、Copilot 可在未來透過相同 interface 擴充，但任何 vendor-specific adapter 都不得成為 Governance 或 Specification Source of Truth。

## 2. High-Level Architecture

```mermaid
flowchart TD
    U["User / Natural Language Request"]

    subgraph OP["A. Project Orchestration Plane"]
        IC["Intent Classifier"]
        PIO["Project Intake Orchestrator"]
        DM["Discovery Manager"]
        PCB["Project Context Builder"]
        PPB["Project Proposal Builder"]
        PAC["Project Approval Coordinator"]
        RP["Repository Provisioner"]
        PBM["Project Bootstrap Manager"]
        SGO["Specification Generation Orchestrator"]
        RC["Risk Classifier"]
        WIG["Work Item Generator"]
        RAR["Review Assignment Resolver"]
        DAC["Delivery Assurance Coordinator"]
        DC["Dispatch Coordinator"]
    end

    PR[("Project Repo")]
    WI["Canonical Work Item"]

    subgraph TP["B. Task Execution Plane"]
        IV["Input Validator"]
        RR["Role Resolver"]
        CC["Context Compiler"]
        PC["Policy Compiler"]
        EPB["Execution Profile Builder"]
        AA["Agent Adapter Interface"]
        ENF["Enforcement Backend"]
        RM["Runtime Monitor"]
        GR["Gate Runner"]
        FR["Finding Registry"]
        AH["Approval Handler"]
        AR["Audit Recorder"]
    end

    CA["Claude Adapter"]
    CO["Codex Adapter"]
    OUT["Git / Design / Code / Review Evidence"]

    U --> IC --> PIO --> DM --> PCB --> PPB --> PAC
    PAC -->|"APPROVE_PROJECT"| RP --> PBM
    PBM --> PR
    PBM --> SGO --> RC --> WIG --> DC --> WI --> IV
    IV --> RR
    RR --> CC
    RR --> PC
    CC --> EPB
    PC --> EPB
    EPB --> AA
    AA --> CA
    AA --> CO
    CA --> ENF
    CO --> ENF
    ENF --> RM
    RM --> GR
    RM --> FR
    RM --> AH
    GR --> AR
    FR --> AR
    AH --> AR
    RM --> AR
    AR --> OUT --> PR
    GR -->|"Maker / gate evidence"| RAR --> WIG
    GR -->|"Required reviews / phase gates"| DAC -->|"Assurance Work Item"| WIG
    GR -->|"Assurance result / next phase"| WIG
```

核心原則：

- Project Orchestration Plane 只能透過 canonical Work Item 與 Dispatch Coordinator 呼叫 Task Execution Plane，不得直接啟動 Claude、Codex 或其他 Agent。
- Work Item 是兩個 Plane 之間唯一正式 task handoff contract，其 schema 只來自 `templates/Work_Item.md`。
- Project Repo 是 canonical specs、design contracts、source code、tests 與 delivery history 的 Source of Truth；Project Context 只是轉換前的 intermediate artifact。
- Core components 產生 vendor-neutral artifacts。
- Adapter 只能降低或忠實映射權限，不能修改 compiled policy。
- Enforcement Backend 必須在 Agent process 外部或由不可被 Agent 改寫的 vendor / OS enforcement surface 提供。
- Runtime Monitor 是偵測與協調層，不取代 hard enforcement。
- Audit Recorder 使用 Agent 不可寫入的 host-owned storage。
- Risk Classifier、Review Assignment Resolver與 Delivery Assurance Coordinator都屬 Project Orchestration Plane；它們只能產生 policy decision、Work Item或 handoff，不能直接啟動 Agent。
- Finding Registry屬 Task Execution Plane的 host-owned evidence component；它不修改受審 artifact或 canonical spec。
- 本整合仍只有 Project Orchestration Plane與 Task Execution Plane，沒有第三個 Assurance Plane。

### 2.1 A. Project Orchestration Plane

Project Orchestration Plane 將自然語言請求轉成已核准、可追溯且可由 Harness 執行的 Work Item。它遵守 `.ai/PROJECT_INTAKE_CONTRACT.md`，不重建其 intent、lifecycle、Project Context 或 approval 規則。

`Project Context` 是 structured intermediate artifact，至少保留 confirmed facts、assumptions、known unknowns、technology recommendation 與 repository target。它不是 Product Source of Truth；內容必須經 `PRODUCT_ARCHITECT` execution 轉成 canonical specs，下游 Agent 不得直接把 Project Context 當作正式需求。

Project Intake Orchestrator 消費 `.ai/PROJECT_INTAKE_CONTRACT.md` 定義的 lifecycle：

```text
RECEIVED
→ CLASSIFIED
→ DISCOVERY
→ REQUIREMENTS_READY
→ PROJECT_PROPOSED
→ AWAITING_REPO_APPROVAL
→ REPO_PROVISIONING
→ SPEC_GENERATION
→ SPEC_REVIEW
→ READY_FOR_DESIGN
```

以上只表示 architecture orchestration order；state definition、blocked state 與 transition rule 的唯一來源仍是 Project Intake Contract。

### 2.2 Project Orchestration Component Responsibilities

| Component | Responsibility | Input | Output | Dependencies | Side Effects | Failure Behavior |
|---|---|---|---|---|---|---|
| Intent Classifier | 判斷請求 intent，不以不明 intent fallback 到 Implementer | Natural Language Request、existing repo context、user-provided source material | `NEW_PROJECT`、`EXISTING_PROJECT_CHANGE`、`BUG_FIX`、`DESIGN_CHANGE`、`TECHNICAL_TASK` 或 `RESEARCH_ONLY` | Project Intake Contract、source metadata | None | 不明時回報 `INTENT_UNCLEAR` 並停止 dispatch |
| Project Intake Orchestrator | 協調 intake lifecycle 與各元件，不自行改寫 state rule | Classified intent、orchestration state、audit context | 下一個合法 state、component command、handoff status | Project Intake Contract、Workflow | None | 非法 transition、missing info 或 conflict 時進入 Contract 定義的 blocked route |
| Discovery Manager | 推導 safe facts，只詢問 material unknowns | Original request、sources、current answers | Confirmed facts、assumptions、known unknowns、clarification record | Source Map、clarification policy | Human questions only | 關鍵資訊不足時 `MISSING_CRITICAL_REQUIREMENT`，不產生虛構需求 |
| Project Context Builder | 將 discovery 結果正規化為 vendor-neutral Project Context | Confirmed facts、answers、assumptions、source references | Versioned Project Context | Project Intake Contract schema | None | Schema 不完整或互相衝突時 block；不得降級為 Product SOT |
| Project Proposal Builder | 產生可供核准的專案、repo 與技術建議摘要 | Project Context、requested repository target、framework pin candidate | Project Proposal | Naming policy、technology recommendation rules | None | 無法形成可理解 proposal 時回到 Discovery / Requirements Ready |
| Project Approval Coordinator | 將使用者決策綁定 proposal、repo target 與 framework pin | Project Proposal、human decision | `APPROVE_PROJECT`、`REQUEST_CHANGES` 或 `CANCEL` evidence | Project Intake Contract、audit sink | Human approval record | Request changes 返回 discovery；cancel 終止；無明確 approval 不允許 repo creation |
| Repository Provisioner | 驗證 availability，建立 private Project Repo、initial `main` / `develop`、bootstrap commit 與 metadata | Approved proposal、repo target、immutable framework pin | Provisioned Project Repo identity、bootstrap target | GitHub integration、Git policy、credential boundary | Repository creation、initial branches、one bootstrap push | Name conflict、creation 或 bootstrap prerequisite failure 時停止；不交由 Agent 自行補救 |
| Project Bootstrap Manager | 依 manifest 從 pinned Framework version 複製、生成或排除 project artifacts | Project Bootstrap Manifest、framework pin、Project Context、empty Project Repo | Canonical project structure、README、framework provenance | Framework repository、project repo structure | Project Repo file generation within bootstrap transaction | Manifest、version 或 write 失敗時 `BOOTSTRAP_FAILED`，不留下可誤認為完成的 repo |
| Specification Generation Orchestrator | 建立 specification Work Item 並協調 `PRODUCT_ARCHITECT` execution；本身不寫規格邏輯 | Project Context、bootstrapped repo、canonical paths | Spec Work Item、spec execution result、Spec Gate request | Work Item Generator、Dispatch Coordinator、Task Execution Plane | None directly | Spec generation / Gate failure 依 Intake Contract block，不把問題交給 UX Designer |
| Risk Classifier | 依 canonical triggers計算 Work Item Risk，不接受 Agent降級 | Artifact type、changed paths、data / operation / environment signals、project policy | `LOW / MEDIUM / HIGH / CRITICAL` assignment與 evidence | Workflow、Work Item Contract、host policy | None | 無法解析 sensitive trigger時 fail closed，至少 HIGH並要求 clarification |
| Work Item Generator | 將 approved inputs 與 phase 轉成唯一 schema 的 system-generated Work Item | Approved canonical specs；初始 `SPEC` 時為 approved Project Context、proposal 與 source references；另含 phase、feature、traceability、active role | `work-items/<ID>.md` | `templates/Work_Item.md`、Role boundary、Gate registry | Project Repo Work Item write through governed integration | Schema、traceability 或 permission intersection 無效時拒絕生成；不得新增需求或擴權 |
| Review Assignment Resolver | 根據 artifact、Risk與 policy建立 independent Reviewer Work Items | Maker evidence、artifact / hash、Maker execution、Risk assignment | Required profile set、review assignments、REVIEWER Work Items | Reviewer Profile registry、Work Item Generator | Governed review Work Item generation | Self review、profile缺失、hash不明或 Agent自選時拒絕 assignment |
| Delivery Assurance Coordinator | 凍結 delivery candidate並建立 final assurance handoff | Required reviews、phase Gates、findings、candidate commit / manifest | Delivery candidate manifest、Delivery Assurance Work Item、release eligibility | Review Assignment Resolver、Finding Registry、Gate evidence | Governed manifest / Work Item write | Missing review、open blocking finding、stale hash或 conflict時 block |
| Dispatch Coordinator | 依 Work Item Role 選擇 compatible adapter，呼叫 Task Execution Plane | Valid Work Item、repo identity、adapter capability inventory | Harness invocation、dispatch record | Harness Input Contract、adapter registry | Agent execution request only | 無 compatible adapter 或 Harness 拒絕時 `AGENT_DISPATCH_FAILED`，不得繞過 Harness |

Role 決定 workflow authority；vendor 只決定 runtime adapter。`UX_DESIGNER` 可選 Claude-compatible adapter，`IMPLEMENTER` 可選 Codex 或 Claude-compatible adapter，`REVIEWER` 可選 review-capable adapter，但 vendor 不得修改 Role、Phase、Scope 或 Gate。

### 2.3 Repository Provisioning and Bootstrap Architecture

Repository Provisioner 是 repository creation 的唯一 owner。它只在 Project Proposal 已呈現且 Project Approval Coordinator 記錄明確 `APPROVE_PROJECT` 後執行。`REQUEST_CHANGES` 返回 Discovery / Requirements Ready；`CANCEL` 終止 orchestration 且不建立 repo。

Provisioning architecture 依序處理：

```text
Check GitHub repository availability
→ Create private repository
→ Pin immutable Framework version
→ Create initial main
→ Apply Project Bootstrap Manifest
→ Create initial bootstrap commit
→ Create develop
→ Record repository metadata and framework provenance
```

Project Bootstrap Manifest 使用下列 operation categories；實際 artifact 清單由 approved manifest 決定：

| Operation | Intended Content |
|---|---|
| `COPY` | `AGENTS.md`、Project execution 必要的 `.ai` governance |
| `GENERATE` | Project `README.md`、framework provenance、project metadata |
| `CREATE_DIRECTORY` | `docs/**`、`specs/**`、`design/**`、`work-items/**`、`traceability/**` |
| `OPTIONAL` | 使用 Claude 時的 `CLAUDE.md` 與明確核准的 project adapter entrypoint |
| `EXCLUDE` | Harness implementation architecture、Framework internal development docs、unrelated skills、Framework history |

Bootstrap 必須 pin immutable Framework version：

```yaml
framework_repository: ivan-tsai1207/ai-system-delivery-framework
framework_commit_sha: <immutable-commit-sha>
framework_release: <optional-release-id>
```

Provisioner 可以先解析指定 release 或 approved Framework source，但 bootstrap transaction 必須使用 resolved `framework_commit_sha`。禁止只讀 floating `main` 且不留下 version provenance。

### 2.4 Specification, Gate, and Work Item Handoff

Specification Generation Orchestrator 不直接產生規格內容。它要求 Work Item Generator 建立 `SPEC` Work Item，經 Dispatch Coordinator 呼叫 Task Execution Plane，由 `PRODUCT_ARCHITECT` 依 Governance 產生：

```text
docs/02_product/PRODUCT_VISION.md
docs/02_product/PRD.md
docs/03_requirements/SRS.md
docs/04_system/ARCHITECTURE.md
docs/04_system/SDD.md
specs/<feature>/spec.md
```

初始 `SPEC` Work Item 可以引用 approved Project Context、Project Proposal 與 source references 作為 intake input；這不會將 Project Context 升格為 Product SOT。`PRODUCT_ARCHITECT` execution 的責任正是將這些輸入轉換為可審查的 canonical specs。

Spec execution 完成後必須執行 `SPEC_GATE`。只有 Gate Pass 且沒有 material requirement gap / conflict 時，Project Intake 才能成為 `READY_FOR_DESIGN`。`SPEC_GAP`、`SPEC_CONFLICT` 或 missing material requirement 必須 block，不能交給 UX Designer 決策。

後續每個 phase 都使用同一 handoff：

```text
Approved Canonical Specs
→ Work Item Generator
→ Canonical Work Item
→ Dispatch Coordinator
→ Task Execution Plane
→ Active Role / Compatible Adapter
→ Required Gate
→ Evidence and next-phase decision
```

### 2.5 B. Task Execution Plane

Task Execution Plane 沿用 `.ai/HARNESS_CONTRACT.md`，只負責一張 canonical Work Item 的 runtime execution boundary。它不執行 Project discovery、不核准 Project Proposal、不建立產品需求，也不擁有 repository provisioning。

### 2.6 Task Execution Component Responsibilities

| Component | Responsibility | Input | Output | Dependencies | Failure Behavior |
|---|---|---|---|---|---|
| Harness CLI / Entry Point | 接收 task 與 adapter 選擇，建立 execution | CLI args、cwd、environment | Invocation Request | Input Validator | 參數不完整時不啟動 Agent |
| Input Validator | 驗證 input schema、repo、branch、work item | Invocation Request | Validated Input | Git metadata、schema | `INVALID_INPUT`，fail closed |
| Role Resolver | 將 role ID 對應 active role，確認 work item 無越權 | Validated Input、work item | Resolved Role | `.ai/roles/**`、Authority | 無映射或矛盾時 `POLICY_BUILD_FAILED` |
| Context Compiler | 組出 least-context manifest | Role、feature、phase、work item | Execution Context Manifest | Governance、specs、design、source tree | 缺檔或衝突時 block / fail |
| Policy Compiler | 將治理與任務邊界交集化 | Governance、role、gate、work item、Contract | Execution Policy | Authority、Harness Contract | 無法證明權限時 deny / fail |
| Execution Profile Builder | 合併 context 與 policy，凍結正式執行輸入 | Context Manifest、Execution Policy | Execution Profile | Schema registry | Schema/hash 不一致時 fail |
| Agent Adapter Interface | 定義所有 vendor adapter 的共同 lifecycle | Execution Profile | Adapter Result / Events | Adapter implementation | capability 不足時拒絕 prepare |
| Claude Adapter | 將 profile 映射到 Claude Code surfaces | Immutable Execution Profile | Claude launch plan | Claude Code capabilities | 無法硬性映射時 fail closed |
| Codex Adapter | 將 profile 映射到 Codex surfaces | Immutable Execution Profile | Codex launch plan | Codex CLI / config capabilities | 無法硬性映射時 fail closed |
| Enforcement Backend | 實際限制 filesystem、tools、commands、env | Compiled Policy、adapter capability | Enforced process boundary | Vendor sandbox / OS controls | 不可驗證時不 launch |
| Runtime Monitor | 消費 events、比對 policy、觸發 stop / approval | Runtime events、policy | Normalized Events、violations | Adapter、Enforcement Backend | violation 時 terminate / block |
| Gate Runner | 依 phase orchestration required gates並驗證 required review evidence | Artifacts、gate docs、role evidence、findings | Gate Results | `.ai/gates/**`、Reviewer / validators | missing review、open blocking finding或 failed gate進入 `FAILED_GATE` |
| Finding Registry | 保存 append-only finding lifecycle並驗證 owner / status transition | Review events、artifact hashes、accepted-risk evidence | Findings、closure / invalidation evidence | Audit Recorder、Authority、review profile | 非法 transition、Agent accepted risk或 stale hash時 fail closed |
| Audit Recorder | 記錄 execution facts 與 hashes | 所有 normalized events | Audit Event Stream、Final Record | Host-owned state store | audit 不可寫時不得開始 execution |
| Approval Handler | 管理 restricted operation 的人工決策 | Approval Request、policy hash | Approval Decision | Human channel、Audit Recorder | deny / timeout 時不執行 operation |

### 2.7 Side Effect Ownership and Enforcement

| Side Effect | Owner | Boundary |
|---|---|---|
| Repository creation | Repository Provisioner | Project Proposal + explicit `APPROVE_PROJECT`；hard approval boundary |
| Bootstrap Project Repo writes | Project Bootstrap Manager | Approved manifest + pinned framework commit + bootstrap transaction |
| Git commit / push after bootstrap | Git integration under repository policy | Branch / PR policy；host-side protection where available |
| Agent execution | Task Execution Plane | Valid Work Item、compiled policy、hard enforcement capability |
| Agent file writes | Enforcement Backend | Governance ∩ Role ∩ Work Item ∩ Host Baseline |
| Destructive operation | Approval Handler | Operation-bound, one-time human approval；default deny |
| Production deployment | None in v0.1 | Explicitly out of scope |

Agent、Adapter 與 runtime prompt 不得自行取得 side-effect ownership。Product workflow 由 Governance 與 Orchestration 強制；repo approval、branch protection、filesystem write 與 destructive operation 必須使用可用的 hard / host-side boundary，不能只依賴 prompt。

## 3. Architecture Flows

### 3.1 End-to-End New Project Flow

```text
User
→ Natural Language Request
→ Intent Classifier
→ Project Intake Orchestrator
→ Discovery Manager
→ Project Context Builder
→ Project Proposal Builder
→ Project Approval Coordinator
→ APPROVE_PROJECT
→ Repository Provisioner
→ Project Bootstrap Manager
→ Specification Generation Orchestrator
→ SPEC Work Item
→ Dispatch Coordinator
→ Task Execution Plane / PRODUCT_ARCHITECT
→ Canonical Specs
→ Self Review / Artifact Hash / Risk Classification
→ Review Work Item / SPEC_REVIEWER
→ SPEC_GATE
→ Design Work Item Generator
→ Dispatch Coordinator
→ Task Execution Plane / UX_DESIGNER
→ Design Contract
→ UX_REVIEWER
→ DESIGN_GATE
→ Implementation Work Item Generator
→ Dispatch Coordinator
→ Task Execution Plane / IMPLEMENTER
→ Source Code and Tests
→ TECH_REVIEWER
→ QA_REVIEWER / SECURITY_REVIEWER when required
→ IMPLEMENTATION_GATE
→ Verify Required Independent Reviews Complete
→ Delivery Candidate Manifest
→ DELIVERY_ASSURANCE_REVIEWER
→ DELIVERY_ASSURANCE_GATE
→ RELEASE_GATE
→ PR / Merge under Git policy
```

任何 Gate failure、spec gap、spec conflict 或 unauthorized scope 都依 Contract 停止受影響流程。Project Orchestration Plane 不得直接呼叫 vendor Agent 來跳過 Work Item、Harness 或 Gate。

### 3.2 Existing Project Flow

`EXISTING_PROJECT_CHANGE`、`BUG_FIX`、`DESIGN_CHANGE` 與 `TECHNICAL_TASK` 不執行 repository provisioning：

```text
Classified Existing-Project Intent
→ Resolve Existing Project Repo
→ Load Governance and Canonical Specs
→ Analyze Requested Delta
→ Change Request when canonical state must change
→ Canonical Spec Updated when required
→ System-generated Work Item
→ Dispatch Coordinator
→ Task Execution Plane
→ Required Gate
```

`RESEARCH_ONLY` 預設停留在 research context，不建立 repo 或 implementation Work Item。Existing Project Resolver 無法確認 repo identity、branch 或 canonical specs 時必須 block，不得把請求誤分類為 `NEW_PROJECT` 來建立新 repo。

### 3.3 Task Execution Flow

| Step | Action | Lifecycle Before | Lifecycle After | Failure Route |
|---|---|---|---|---|
| 1 | User / Work Item 啟動 Harness | None | `CREATED` | `INVALID_INPUT` |
| 2 | Validate Input、repo、branch、work item | `CREATED` | `CREATED` | `FAILED_RUNTIME` |
| 3 | Resolve active role 與 phase | `CREATED` | `CREATED` | `POLICY_BUILD_FAILED` |
| 4 | Load mandatory Governance | `CREATED` | `CREATED` | `CONTEXT_BUILD_FAILED` |
| 5 | Compile least Context Manifest | `CREATED` | `CREATED` | Spec gap / conflict / context failure |
| 6 | Compile filesystem、tool、command policy | `CREATED` | `CREATED` | `POLICY_BUILD_FAILED` |
| 7 | Build and hash Execution Profile | `CREATED` | `CONTEXT_READY` | `FAILED_RUNTIME` |
| 8 | Select adapter and verify capabilities | `CONTEXT_READY` | `CONTEXT_READY` | `ADAPTER_FAILED` |
| 9 | Apply hard boundary and launch Agent | `CONTEXT_READY` | `RUNNING` | `ADAPTER_FAILED` |
| 10 | Send context and monitor runtime | `RUNNING` | `RUNNING` | Runtime violation / stop condition |
| 11 | Collect result and validate output scope | `RUNNING` | `VALIDATING` | `RUNTIME_VIOLATION` |
| 12 | Execute required gates | `VALIDATING` | `VALIDATING` | `FAILED_GATE` |
| 13 | Finalize immutable audit record | `VALIDATING` | `COMPLETED` | `FAILED_RUNTIME` |

完整 sequence：

```text
User / Work Item
→ Harness Start
→ Validate Input
→ Resolve Role
→ Load Governance
→ Compile Context
→ Compile Permissions
→ Build Execution Profile
→ Select Agent Adapter
→ Verify Adapter Capabilities
→ Apply Enforcement Boundary
→ Launch Agent
→ Monitor Runtime
→ Validate Output
→ Execute Required Gates
→ Write Audit Evidence
→ Complete / Block / Fail
```

`COMPLETED` 只能在 required gates 通過、audit finalized 且沒有未處理 stop condition 時產生。

## 4. Input Model

### 4.1 Conceptual CLI

完整形式：

```text
harness run \
  --task PBI-INV-003 \
  --role IMPLEMENTER \
  --feature inventory \
  --agent codex
```

v0.1 建議形式：

```text
harness run --task PBI-INV-003 --agent codex
```

Harness 應從目前 repository 與 `work-items/PBI-INV-003.md` 取得：

- `task_id`：work item metadata 與檔名一致性驗證。
- `role`：work item `Role`。
- `feature`：work item 明確 metadata。
- `phase`：work item 明確 metadata。
- `risk_class`：Orchestrator / Harness產生的 canonical Risk assignment。
- `review_profile`、`reviewed_artifact`、`reviewed_artifact_hash`、`maker_execution_id`：Reviewer Work Item的 explicit binding；其他 Role為 `N/A`。
- `work_item`：由 task ID canonical resolution。
- `repository`：Git remote / repository identity。
- `branch`：目前 checkout branch。
- `spec_version`、`design_version`：work item metadata。
- `read_scope`、`write_scope`、`forbidden_scope`、`required_gates`：Work Item canonical sections。

CLI 提供的重複欄位只能用於 assertion，不得覆蓋 work item。若 `--role`、`--feature` 或 `--branch` 與 repository facts 不一致，Input Validator 必須 fail closed。

### 4.2 Canonical Work Item Schema

`templates/Work_Item.md` 是唯一 canonical Work Item schema，已明確定義 Metadata、Requirement References、task-specific scopes、Acceptance Criteria、Required Gates、Dependencies、Blockers 與 validation rules。

- Harness 必須直接解析 Work Item v2 的 `ID`、`Role`、`Feature`、`Phase`、`Status`、versions、Risk與 review binding。
- `task_id`、Metadata `ID` 與 `<ID>.md` filename 必須一致。
- Harness 不得從 ID prefix、Title、filename、directory 或 Agent assumption 猜測 `Role`、`Feature` 或 `Phase`。
- Work Item scope 只能縮小 active role boundary；effective permission 由 Governance、Role、Work Item 與 Host Baseline 取交集。
- `Forbidden Scope` 永遠優先於 `Write Scope`。
- Parser、validator 與 adapter 不得另建 enum、section name 或 Work Item schema。
- v1 Work Item只能經 deterministic migration成 v2後執行；不得猜測 Risk或 Reviewer Profile補欄位。

Work Item Status 與 Harness execution lifecycle 是不同狀態機；runtime 不得以 `IN_PROGRESS`、`DONE` 等 Work Item Status 取代 `RUNNING`、`COMPLETED` 等 execution state。

## 5. Context Compiler Architecture

Context Compiler 產生 immutable `Execution Context Manifest`：

```yaml
schema_version: harness.context/v1
execution_id: string
task_id: string
role: string
feature: string
phase: string
governance_context:
  - path: string
    sha256: string
delivery_context:
  - path: string
    sha256: string
source_context:
  - path: string
    sha256: string
design_context:
  - path: string
    sha256: string
work_item:
  path: string
  sha256: string
context_hash: string
spec_versions:
  feature: string
  design: string
excluded_context:
  - path: string
    reason: string
```

### 5.1 Context Classes

| Class | Definition | Inclusion Rule |
|---|---|---|
| Mandatory | Constitution、Authority、Workflow、active role、active gate、assigned work item | 缺少即停止 |
| Conditional | 與 role、feature、phase、screen、gate 直接相關的 specs / design / source | 有追溯關係才加入 |
| Optional | 使用者明確提供且在 read boundary 內的 additional context | 必須記錄原因與 hash |
| Excluded | 與任務無關、越界、敏感或被 deny 的內容 | 記錄 path pattern 與原因，不載入內容 |

### 5.2 Least Context Algorithm

1. 由 mandatory governance 建立基底。
2. 從 work item 解析 requirement、feature、screen、spec version 與 required gates。
3. 沿 traceability links 選取直接相關 delivery artifacts。
4. 依 role 加入必要 source / design context。
5. 將 additional context 與 read policy 取交集。
6. 排除 deny、敏感、無關或版本不符項目。
7. 對每個檔案計算 SHA-256，依 normalized relative path 排序。
8. 對 canonical manifest 計算 `context_hash`。

Context Compiler 不得把「整個 repo 都可能有用」當成載入理由。無法確定必要性時先排除；若因此缺少 required context，回報 `MISSING_REQUIRED_CONTEXT`。

## 6. Policy Compiler

Policy Compiler 的 inputs：

```text
CONSTITUTION
AUTHORITY
WORKFLOW
active role
active gate
assigned work item
HARNESS_CONTRACT
host environment baseline
```

輸出為 immutable `Execution Policy`：

```yaml
schema_version: harness.policy/v1
policy_hash: string
sources:
  - path: string
    sha256: string
filesystem:
  read: []
  write: []
  deny_write: []
tools:
  allow: []
  deny: []
commands:
  safe_read: []
  development_write: []
  restricted: []
environment:
  allowed: []
approval_required:
  operations: []
```

Compilation semantics：

- Allowed capability = Governance ∩ Active Role ∩ Work Item ∩ Host Baseline。
- Denied capability = 所有來源 deny 的聯集；deny 永遠優先。
- CLI request 與 adapter capability 只能縮小，不能擴張 compiled allow set。
- 未明確允許的 filesystem write、tool、command 與 environment variable 預設拒絕。
- Policy source hash 變更後，舊 Execution Profile 立即失效，必須重新 compile。
- 任何互相矛盾且無法由 Authority 解決的 policy input 產生 `SPEC_CONFLICT` 或 `POLICY_BUILD_FAILED`。

## 7. Execution Profile

Execution Profile 是 Harness Core 與 Agent Adapter 之間的唯一正式 runtime contract：

```yaml
schema_version: harness.execution-profile/v1
profile_hash: string
execution:
  execution_id: string
  task_id: string
  role: string
  feature: string
  phase: string
  adapter: claude | codex
repository:
  identity: string
  root: string
  branch: string
  commit_before: string
context:
  manifest_ref: string
  context_hash: string
filesystem:
  read: []
  write: []
  deny_write: []
tools:
  allow: []
  deny: []
commands:
  safe_read: []
  development_write: []
  restricted: []
environment:
  allowed: []
gates:
  required: []
audit:
  execution_sink: string
  redaction_policy: string
  required_fields: []
```

Profile Builder 必須：

- 驗證 Context Manifest 與 Policy hashes。
- 產生 deterministic canonical representation 與 `profile_hash`。
- 將 profile 設為 immutable；任何修改都建立新 execution。
- 不放入 secret value，只放入允許的 secret reference identifier。

## 8. Agent Adapter Interface

Language-neutral interface：

```text
prepare(profile) -> capability_report | adapter_error
apply_permissions(profile) -> enforcement_plan | adapter_error
launch(profile, enforcement_plan) -> session_handle | adapter_error
send_context(session_handle, context_manifest) -> accepted | adapter_error
monitor(session_handle) -> normalized_event_stream
terminate(session_handle, reason) -> termination_result
collect_result(session_handle) -> adapter_result
```

Adapter invariants：

- Input Execution Profile 為 immutable。
- Adapter 不得修改 governance、compiled policy 或 context hash。
- Adapter 不得擴張 filesystem、tool、command、environment boundary。
- Adapter 不得自行忽略 Stop Condition 或 Gate failure。
- `prepare()` 必須產生 capability report，逐項說明 soft / hard / unsupported。
- Critical hard boundary 若為 unsupported，Adapter 必須拒絕 `launch()`。
- Vendor events 必須正規化後交給 Runtime Monitor 與 Audit Recorder。

## 9. Claude Adapter Design

Claude Adapter 未來可將 Execution Profile 映射到：

| Profile Concern | Claude Surface | Enforcement Level |
|---|---|---|
| Repository guidance | `CLAUDE.md` 與明確 context package | Soft |
| Tool allow / deny | Claude Code permission allow / ask / deny rules | Hard-capable vendor control |
| Read / edit scope | Permission path rules與 Claude sandbox capability | Hard-capable，需 capability check |
| Command interception | `PreToolUse` / permission hooks | Hard-capable only when host-controlled |
| Approval request | Permission prompt或 SDK approval callback | Human control |
| Working directory | Adapter child process cwd | Process boundary |
| Context files | Adapter explicit context injection | Soft context delivery |
| Runtime events | Headless / SDK event stream | Audit / monitoring |

Design rules：

- `CLAUDE.md` 只提供 guidance，不可單獨承擔 `deny_write`。
- Claude permission evaluation 的 deny 規則必須優先於 allow；v0.1 不使用 bypass permission mode。
- Hooks 若用於 blocking，設定與 hook executable 必須位於 Agent 不可寫入的 host-controlled location。
- Permission / hook mapping 必須再由外層 filesystem、environment 與 credential isolation 防禦。
- Adapter 不得把 `allowedTools` 誤當完整 allowlist；未列出的工具仍需由 deny / mode / callback 明確處理。
- 本階段不建立 `.claude/settings.json`、hooks 或 SDK code。

## 10. Codex Adapter Design

Codex Adapter 未來可將 Execution Profile 映射到：

| Profile Concern | Codex Surface | Enforcement Level |
|---|---|---|
| Repository guidance | `AGENTS.md` 與 explicit context | Soft |
| Filesystem boundary | Codex permission profile或 sandbox configuration | Hard-capable vendor / OS control |
| Approval policy | `approval_policy` / CLI approval option | Human control |
| Restricted commands | Exec policy、hooks、sandbox escalation | Hard-capable when host-controlled |
| Working directory | `codex exec` cwd / project root | Process boundary |
| Context files | Explicit prompt/context package，不只依賴自動 `AGENTS.md` discovery | Soft context delivery |
| Runtime events | `codex exec --json` JSONL stream | Audit / monitoring |
| Structured result | Output schema / final result collection | Validation aid |

Design rules：

- v0.1 優先採 non-interactive `codex exec` 作為可監控 child process interface。
- Adapter 必須明確設定最小 sandbox / permission profile 與 approval policy，不依賴使用者全域預設。
- Project trust 會影響 project-local config、hooks 與 rules 是否載入；`prepare()` 必須驗證實際 effective capability。
- Harness enforcement config 必須由 host-controlled source 提供，不能放在 Agent 可寫路徑後期待 Agent 自律。
- `AGENTS.md` 有載入容量與 scope，Context Compiler 必須明確送入必要 context，不能假設所有 reference 都自動進入 model context。
- Full access / bypass sandbox 不可作為 v0.1 的正常 profile。
- 本階段不建立 `.codex/config.toml`、permission profile、hook 或 launch code。

## 11. Runtime Enforcement

### 11.1 Soft Enforcement

Soft enforcement 用於意圖、角色、任務與規格說明：

- Project Intake lifecycle 與 workflow guidance。
- Project Context、Project Proposal 與 Work Item generation instructions。
- Prompt。
- `AGENTS.md`。
- `CLAUDE.md`。
- Context Package。
- Work Item。
- Gate instructions。

Soft enforcement 可以降低誤解，但 Agent 可能忽略、誤讀或遭 prompt injection 影響，因此不能作為安全邊界。

### 11.2 Hard Enforcement

Hard enforcement 必須由 Agent 無法自行改寫的機制提供：

- Repository creation 前的 explicit human approval record 與 Provisioner authorization check。
- Immutable framework commit pin 與 bootstrap manifest verification。
- Git branch protection / host-side repository policy where available。
- Vendor / OS filesystem sandbox。
- Host-controlled permission profile與 deny rules。
- Host-controlled command / tool interception。
- Process isolation 與 child process termination。
- Environment allowlist 與 secret omission。
- 不向 session 注入 production deployment、database 或 credential tools。
- Audit sink 位於 Agent write boundary 外。

以下邊界不得只依賴 prompt：

| Boundary | Required Hard Control |
|---|---|
| `deny_write` | Sandbox / permission profile 阻止 write；diff monitor 僅作 defense-in-depth |
| Credential access | 不注入 secret、env allowlist、host credential isolation |
| Production deployment | 不提供 production credential / deployment tool，必要時人類批准後建立新 context |
| Destructive commands | Command interception + sandbox / tool deny，禁止單靠文字提醒 |

### 11.3 Enforcement Capability Negotiation

每個 adapter 在 `prepare()` 必須回報：

```yaml
filesystem_deny_write: hard | soft | unsupported
tool_deny: hard | soft | unsupported
command_interception: hard | soft | unsupported
environment_filtering: hard | soft | unsupported
credential_isolation: hard | soft | unsupported
runtime_events: complete | partial | unavailable
termination: supported | unsupported
```

Critical boundary 只要回報 `soft` 或 `unsupported`，Execution Profile 不得啟動。Runtime Monitor 的 pre/post diff、event inspection 與 output validation 只能作第二道防線。

## 12. Gate Runner

Gate Runner interface：

```text
resolve_required_gates(profile) -> gate_plan
resolve_required_reviews(work_item, risk, artifact) -> review_plan
validate_review_independence(review_plan, evidence) -> valid | rejected
load_gate_definition(gate_id) -> gate_definition
prepare_gate_context(profile, artifacts, audit) -> gate_context
execute_gate(gate_context) -> gate_result
record_gate_result(gate_result) -> audit_reference
```

Orchestration mapping：

| Phase | Default Gate ID | Gate Source |
|---|---|---|
| `SPEC` | `SPEC_GATE` | `.ai/gates/spec-gate.md` |
| `DESIGN` | `DESIGN_GATE` | `.ai/gates/design-gate.md` |
| `IMPLEMENTATION` | `IMPLEMENTATION_GATE` | `.ai/gates/implementation-gate.md` |
| `REVIEW` | Work Item 明確指定 | 被審查 phase Gate或 `DELIVERY_ASSURANCE_GATE`；不得自行推測 |
| `RELEASE` | `RELEASE_GATE` | `.ai/gates/release-gate.md` |

Mapping 與 enum 的 canonical definition 來自 `templates/Work_Item.md`。Required Gates 可以增加 Gate，但不能移除 Governance / Workflow 強制要求的 Gate。

Gate Runner 不重新定義 criteria。未來 validator 可以是 deterministic checks、Reviewer Agent 或 human review，但都必須輸出統一結果：

```yaml
gate_id: SPEC_GATE | DESIGN_GATE | IMPLEMENTATION_GATE | DELIVERY_ASSURANCE_GATE | RELEASE_GATE
status: PASS | FAILED | NEEDS_CLARIFICATION
definition_hash: string
evidence: []
findings: []
reviewer: string
```

Review decision另外使用 `PASS / REQUEST_CHANGES / BLOCK`，不得與 GateResult混為同一 enum。Gate Runner必須拒絕 self approval、missing required profile、stale artifact hash與 `OPEN BLOCKING` finding。本階段不實作 validator。

## 13. Audit Architecture

Audit Recorder 採 event stream + final record：

```text
Host-owned State Directory
  executions/<execution-id>/
    execution-profile.json
    context-manifest.json
    execution-policy.json
    events.jsonl
    gate-results.json
    final-record.json
```

以上只是 placement design，不在本次建立目錄。

Audit requirements：

- State directory 位於 Agent writable repository 之外。
- 每個 event 包含 execution ID、sequence、timestamp、type、sanitized payload 與前一事件 hash。
- Final record 包含 Harness Contract 要求的 metadata、commands、tools、file changes、blocked operations、approvals、gates 與 final status。
- Context、policy、profile 與 gate definition 都記錄 content hash。
- Command 與 tool payload 在寫入前遮罩 secret、token、credential 與敏感環境值。
- Agent session 只拿到 write-only event channel 或由 parent process觀察，不取得 audit storage filesystem path。
- Audit write / flush 失敗時 fail closed；不能在無 evidence 狀態下繼續。

v0.1 的 hash chain 提供 tamper evidence，不宣稱等同外部 WORM storage。遠端簽章、集中式 audit service 與法規級保存屬後續版本。

## 14. Human Approval Architecture

至少需要人工批准：

- Project Proposal / Repository Creation。
- Production deployment。
- Force push / history rewrite。
- Destructive database operation。
- Credential-sensitive operation。
- Governance modification。

Approval responsibility 分成兩種，不得互換：

- Project Approval Coordinator 管理 Project Proposal decision。只有綁定 proposal、repo target、visibility 與 framework pin 的 `APPROVE_PROJECT` 可以授權 Repository Provisioner；`REQUEST_CHANGES` 與 `CANCEL` 不產生 side-effect permission。
- Task Execution Plane 的 Approval Handler 管理已啟動 execution 中的 restricted operation。它不得核准 Project Proposal，也不得把單次 runtime approval 延伸成 repository provisioning 或產品需求核准。

Approval lifecycle：

```text
REQUESTED
→ APPROVED
→ operation executes once
```

或：

```text
REQUESTED → REJECTED
REQUESTED → EXPIRED
```

Approval Request 必須綁定：

```yaml
approval_id: string
execution_id: string
policy_hash: string
operation_class: string
normalized_operation: string
resource: string
requested_by: string
requested_at: string
expires_at: string
```

Project repository approval evidence 另需綁定：

```yaml
proposal_hash: string
repository_provider: string
repository_owner: string
repository_name: string
repository_visibility: private
framework_commit_sha: string
decision: APPROVE_PROJECT | REQUEST_CHANGES | CANCEL
decided_at: string
```

- Approval 只允許完全相同的 operation 一次；參數、resource、policy hash 或 execution 改變即失效。
- Agent Adapter、Runtime Monitor 與 Reviewer Agent 都不能自行產生 `APPROVED`。
- Approval decision 與執行結果都必須寫入 audit。
- v0.1 可使用 local terminal prompt，但本文件不實作 UI。

## 15. Failure Model

Project Orchestration Plane 的 failure ID、retry 與 human intervention 規則以 `.ai/PROJECT_INTAKE_CONTRACT.md` 為唯一來源。Architecture 只指定 detection owner 與 routing：

| Failure | Primary Detection Owner | Architecture Route |
|---|---|---|
| `INTENT_UNCLEAR` | Intent Classifier | Discovery clarification；不得 dispatch Implementer |
| `MISSING_CRITICAL_REQUIREMENT` | Discovery Manager / Project Context Builder | Block intake，取得必要 human input |
| `PROJECT_REJECTED` | Project Approval Coordinator | Stop orchestration；新 proposal 需新 context |
| `REPOSITORY_NAME_CONFLICT` | Repository Provisioner | Human confirms new target，new provisioning execution |
| `REPOSITORY_CREATION_FAILED` | Repository Provisioner | Preserve evidence，retry only under still-valid approval |
| `BOOTSTRAP_FAILED` | Project Bootstrap Manager | Mark provisioning incomplete；不得進入 spec generation |
| `SPEC_GENERATION_FAILED` | Specification Generation Orchestrator / Task Execution Plane | New governed spec execution |
| `SPEC_GATE_FAILED` | Gate Runner | Block before design，retain findings |
| `REQUIRED_REVIEW_MISSING` | Review Assignment Resolver / Gate Runner | Generate missing Reviewer Work Item；Gate不得 PASS |
| `SELF_APPROVAL_REJECTED` | Review Assignment Resolver | Reject assignment；new independent execution required |
| `DELIVERY_ASSURANCE_FAILED` | Delivery Assurance Coordinator | Return findings to owners；Release不可繼續 |
| `AGENT_DISPATCH_FAILED` | Dispatch Coordinator | Do not bypass Harness；retry with compatible capability |

Task Execution Plane failure mapping 沿用 Harness Contract：

| Failure | Detection Stage | Lifecycle Mapping | Required Behavior |
|---|---|---|---|
| `INVALID_INPUT` | Input Validator | `CREATED → FAILED_RUNTIME` | 不載入 Agent |
| `CONTEXT_BUILD_FAILED` | Context Compiler | `CREATED → FAILED_RUNTIME` | 記錄缺失與原因；若是 spec gap / conflict 改走專用 blocked state |
| `POLICY_BUILD_FAILED` | Policy Compiler | `CREATED → FAILED_RUNTIME` 或 `BLOCKED_PERMISSION` | 無法證明 allow 即 deny |
| `ADAPTER_FAILED` | prepare / launch / event collection | `CONTEXT_READY` 或 `RUNNING → FAILED_RUNTIME` | 終止 child process |
| `RUNTIME_VIOLATION` | Enforcement / Runtime Monitor | `RUNNING → BLOCKED_PERMISSION` | 阻擋 operation、終止受影響 execution |
| `SPEC_GAP` | Compiler、Agent、Gate | `→ BLOCKED_SPEC_GAP` | CR 流程與新 execution |
| `SPEC_CONFLICT` | Compiler、Agent、Gate | `→ BLOCKED_SPEC_CONFLICT` | 依 Authority 回報衝突 |
| `GATE_FAILED` | Gate Runner | `VALIDATING → FAILED_GATE` | 保存 evidence，不得 complete |
| `REVIEWED_ARTIFACT_CHANGED` | Context / Gate validation | `VALIDATING → FAILED_GATE` | Invalidate old review and recalculate required reviews |
| `OPEN_BLOCKING_FINDING` | Finding Registry / Assurance | `VALIDATING → FAILED_GATE` | Return to owner；Assurance不得 PASS |
| `APPROVAL_DENIED` | Approval Handler | `RUNNING → CANCELLED`，若 operation 可選則維持 `RUNNING` | operation 絕不執行 |

所有 failure 都必須先記錄 audit 再回傳；若 Audit Recorder 本身失敗，parent process 立即終止 Agent。

## 16. Repository Placement Proposal

未來實作可能採：

```text
harness/
  package.json
  tsconfig.json
  src/
    cli/
    orchestration/
      intent/
      intake/
      discovery/
      project-context/
      proposals/
      provisioning/
      bootstrap/
      specifications/
      risk/
      work-items/
      review-assignment/
      delivery-assurance/
      dispatch/
    core/
    input/
    roles/
    context/
    policy/
    profiles/
    adapters/
      claude/
      codex/
    enforcement/
    runtime/
    gates/
    findings/
    audit/
    approvals/
    security/
  schemas/
  tests/
    unit/
    contract/
    integration/
```

Placement rules：

- `harness/` 是 Framework 的未來 implementation package，不是 target project artifact。
- `orchestration/` 與 Task Execution modules 屬於同一個 Node.js / TypeScript Harness package，但以 interface 與 Work Item boundary 分離。
- Project Repo 由 Repository Provisioner 建立在 framework package 之外，不放入 `harness/`。
- Runtime state 與 audit 不放在 `harness/` 或 Agent writable repo。
- Adapter-specific config 由 profile 動態產生在 host-owned execution directory；不提交 vendor runtime secrets。
- 本次不建立任何上述目錄或檔案。

## 17. Technology Recommendation

### 17.1 Comparison

| Dimension | Python | Node.js / TypeScript |
|---|---|---|
| CLI development | 成熟，Typer / argparse 易用 | 成熟，Commander / native parsing 易用 |
| Process control | `subprocess` 穩定 | `child_process`、stream、AbortSignal 適合長執行與事件流 |
| Filesystem control | 標準庫完整 | 標準庫完整，適合 async event orchestration |
| YAML / Markdown parsing | PyYAML、markdown 生態成熟 | YAML、remark / unified AST 與 schema 工具成熟 |
| Claude integration | Python SDK 可用 | Claude Agent SDK / tool ecosystem 與 TS type mapping 自然 |
| Codex integration | 可包 CLI / JSONL | 可包 CLI / JSONL，亦容易對接 TypeScript SDK surfaces |
| Portability | 良好，但需管理 Python runtime / venv | 良好，單一 Node LTS runtime 與 package distribution 較直接 |
| Testing | pytest 非常成熟 | Vitest / Node test runner 適合 schema、stream、adapter contract tests |
| Maintenance | 簡潔，動態型別需額外 schema discipline | Static types 可讓 Manifest、Policy、Profile、Adapter contract 共用型別 |
| SI talent availability | 普遍 | 前後端與工具鏈人才普遍，較容易跨團隊維護 |
| Future orchestration | AI / data tooling強 | Event-driven adapters、JSON Schema、CLI orchestration 更貼近本架構 |

### 17.2 Decision

Harness project orchestration 與 task execution 的唯一推薦方案：**Node.js / TypeScript**。

理由：

- 本架構核心是長執行 child process、JSONL event stream、schema validation、adapter interface 與 immutable typed artifacts，而不是資料科學運算。
- TypeScript 可讓 Input、Context Manifest、Execution Policy、Execution Profile、Audit Event 與 Adapter capability 使用同一套型別與 schema，降低跨 adapter 漂移。
- Claude 與 Codex 的 CLI / SDK / JSON tooling 都容易由 Node parent process orchestration。
- SI 團隊通常可由既有前後端 TypeScript 人力共同維護，不需要額外維持 Python packaging 路線。

Python 不作為 Harness core 的第二套 runtime。未來若有 Python validator，只能透過明確 plugin / subprocess contract 接入，不能形成雙核心架構。

## 18. Security Model

| Risk | Architecture Control |
|---|---|
| Path traversal | Repository-relative path normalization；拒絕 `..`、absolute path 與 root escape |
| Symlink escape | 解析 realpath，確認 target 仍在允許 root；每次 write 前重新檢查 |
| Secret isolation | Secret 不進 context / audit；只在 host-controlled adapter 需要時以短生命週期 reference 提供 |
| Subprocess control | Parent process 建立、監控、timeout、signal 與 process-tree termination |
| Environment leakage | Environment allowlist；移除 token、cloud、SSH、package registry 與 production variables |
| Audit tampering | Host-owned storage、Agent 無 write、hash chain、final profile hash |
| Sandbox escape | Adapter capability negotiation；critical boundary unsupported 時拒絕 launch |
| Production credentials | 與 development execution 完全隔離；v0.1 不注入 production credentials |
| Tool escape | 未註冊 tool 不傳給 Agent；MCP / browser / DB / deployment 分別套用 allowlist |
| Prompt injection | External content 標示為 untrusted；不能修改 compiled policy；tools 仍受 hard boundary |

Security invariants：

- Agent process 不得取得 Harness state directory、policy source或 approval signing material 的 write access。
- Repository 內設定不能放寬 host baseline；只能縮小權限。
- Adapter / vendor sandbox 不足時不能以 Runtime Monitor 或 post-run diff 宣稱已硬性阻擋。
- Production credential isolation 與 audit redaction 必須在 launch 前完成。

## 19. Harness v0.1 Boundary

### Must Have

- Natural-language entry 與 Intent Classifier。
- Project Intake Orchestrator 與 Discovery Manager。
- Vendor-neutral Project Context Builder。
- Project Proposal Builder 與 Project Approval Coordinator。
- GitHub Repository Provisioner，預設 private 並建立 initial `main` / `develop`。
- Project Bootstrap Manager、manifest operation 與 immutable framework version pinning。
- Specification Generation Orchestrator，透過 `PRODUCT_ARCHITECT` Work Item 產生 canonical specs。
- System-generated Work Item Generator，唯一 schema 為 `templates/Work_Item.md`。
- Dispatch Coordinator，依 Role 選 compatible adapter 並只透過 Task Execution Plane 啟動 Agent。
- New Project 與 Existing Project intent routing。
- TypeScript CLI entry point 與 Input Validator。
- Role Resolver：`PRODUCT_ARCHITECT`、`UX_DESIGNER`、`IMPLEMENTER`、`REVIEWER`。
- Context Compiler 與 hashed Execution Context Manifest。
- Policy Compiler 與 immutable Execution Policy。
- Execution Profile Builder。
- Claude Adapter 與 Codex Adapter。
- Adapter capability negotiation 與 fail-closed launch。
- Filesystem `read / write / deny_write` hard mapping。
- Tool / Command Policy 與 restricted operation blocking。
- Lifecycle 與所有 Harness Contract Stop Conditions。
- Host-owned Audit Recorder 與 final record。
- Gate orchestration interface for Spec / Design / Implementation / Release。
- Risk Classifier、Review Assignment Resolver、Finding Registry與 Delivery Assurance Coordinator。
- Gate orchestration interface for Spec / Design / Implementation / Delivery Assurance / Release。
- Local Human Approval Handler for restricted operations。

### Should Have

- `harness dry-run` 類型的 profile / capability preview。
- Context、policy、profile JSON Schema validation。
- Adapter contract test suite 與 fake adapter。
- Audit redaction tests 與可攜式 evidence export。
- Context hash cache，僅作效能優化，不影響 correctness。
- Clear diagnostics for missing context、unsupported hard enforcement 與 policy intersection。

### Not in v0.1

- Production deployment automation。
- Production database operation。
- Docker / Kubernetes isolation platform。
- GitHub Actions / CI integration。
- Cloud-hosted Harness control plane。
- Gemini、Hermes、Copilot adapters。
- GUI / web approval console。
- Distributed multi-agent scheduling。
- Automatic Change Request approval或 canonical spec modification。
- Automatic release to production。
- Remote WORM audit service或 compliance archive。

## 20. Validation Against Contracts

| Validation | Result |
|---|---|
| Natural-language architecture entry | User request 先進 Intent Classifier 與 Project Intake Orchestrator |
| New Project end-to-end | Approval 後可到 Project Repo、Specs、Design、Implementation 與 Review |
| Existing Project routing | Existing change / bug / design / technical task 不建立新 repo |
| Plane responsibility separation | Orchestration 不直接執行 Agent；Task Execution 不決定產品或建立 repo |
| Work Item handoff | `templates/Work_Item.md` 是兩 Plane 之間唯一 task contract |
| Repository approval | Repository Provisioner 只接受綁定 proposal 與 target 的 `APPROVE_PROJECT` |
| Vendor-neutral core | Claude / Codex 僅存在於 adapters |
| No new Authority | 本文件明確 subordinate to existing governance and contract |
| No duplicate Work Item schema | Architecture 只引用 `templates/Work_Item.md` |
| Context boundary | Context Manifest 定義 mandatory / conditional / optional / excluded |
| Filesystem / tool / command boundary | Policy Compiler 與 Enforcement Backend 均有定義 |
| Soft vs hard | 已分離，critical boundaries 要求 hard capability |
| Lifecycle / stop conditions | Execution Flow 與 Failure Model 已對應 |
| Audit evidence | Host-owned event stream、hash 與 final record |
| Gate orchestration | 讀取 `.ai/gates/**`，不重寫 criteria |
| Accountability separation | Maker / Checker / Assurer有不同 execution與 artifact hash binding |
| Reviewer Profile model | 六個 profile都派生自 `REVIEWER`，未新增 top-level Role |
| Risk-based review | Orchestrator / Harness計算 Risk；QA / Security依 trigger而非全量套用 |
| Delivery Assurance | Delivery candidate經 independent Assurer與 `DELIVERY_ASSURANCE_GATE`後才可進 Release Gate |
| Two-Plane preservation | 新元件已分配至既有 Orchestration或 Task Execution Plane，沒有第三 Plane |
| Project Intake Contract alignment | Intent、lifecycle、approval、provisioning 與 blocked route 均引用既有 Contract |
| Harness Contract alignment | Task lifecycle、permissions、gates、stop conditions 與 audit 均沿用既有 Contract |
| No implementation | 本次只更新 architecture 文件，未建立 runtime code |
| Single runtime recommendation | Node.js / TypeScript |
| v0.1 boundary | Project orchestration 與 Task Execution 的 Must / Should / Not in v0.1 已定義 |

## 21. Official Capability References

以下文件只用於確認 adapter 可用的 vendor capability，不是 Governance Source of Truth：

- Codex Agent approvals & security: https://learn.chatgpt.com/docs/agent-approvals-security
- Codex permissions: https://learn.chatgpt.com/docs/permissions
- Codex non-interactive mode: https://learn.chatgpt.com/docs/non-interactive-mode
- Codex AGENTS.md: https://learn.chatgpt.com/docs/agent-configuration/agents-md
- Codex hooks: https://learn.chatgpt.com/docs/hooks
- Claude Code permissions: https://code.claude.com/docs/en/permissions
- Claude Code hooks: https://code.claude.com/docs/en/hooks
- Claude Code configuration: https://code.claude.com/docs/en/configuration
