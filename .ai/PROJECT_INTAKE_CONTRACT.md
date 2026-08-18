# Project Intake and Repository Provisioning Contract

本文件定義新專案從自然語言需求到 Project Repo 初始化、初始規格與下游 Agent 交接的 vendor-neutral contract。

本文件不是新的 Governance Authority，不得重新定義 `.ai/CONSTITUTION.md`、`.ai/AUTHORITY.md`、既有 Role、Gate 或 `.ai/HARNESS_CONTRACT.md`。若內容衝突，依 `.ai/AUTHORITY.md` 停止並回報。

## 1. Purpose and Boundary

Project Intake 負責正式 execution 前的 intake、initialization 與 orchestration：

```text
Natural Language Request
→ Intent Classification
→ Project Context
→ Project Proposal
→ Repository Approval and Provisioning
→ Canonical Specs
→ Internal Work Items
→ Harness Execution
```

Project Intake 不負責：

- 執行特定 Agent task 的 runtime boundary。
- 定義或修改 Authority、Role、Gate 或產品需求權威順序。
- 以技術建議取代 Architecture 或 ADR。
- 在未取得核准前建立 repository 或執行其他 external side effect。
- 要求使用者理解 Harness 的內部 schema 才能開始專案。

`.ai/HARNESS_CONTRACT.md` 只負責已建立 work item 的 runtime context、permission、tool、lifecycle、gate orchestration 與 audit evidence。Project Intake 可產生 work item 並交給 Harness，但 Harness 不得自行決定產品需求。

## 2. User Experience Principle

正常使用者只需以自然語言描述想建立的系統，例如：

```text
我要做一個倉庫庫存盤點系統，主要用手機與條碼槍操作。
```

使用者不需要知道或手動提供：

- Work Item ID。
- Role enum 或 Phase enum。
- Harness Execution Profile。
- Context Manifest。
- Agent Adapter。
- Gate implementation。
- Read / write scope。

系統在內部完成：

```text
Intent
→ Project Intake
→ Project Context
→ Canonical Specs
→ Internal Work Items
→ Harness Execution
```

使用者可進階指定上述資訊，但不得把這些內部欄位變成標準入口的必要條件。

## 3. Intent Classification

Project Intake 至少識別：

| Intent | Meaning | Route |
|---|---|---|
| `NEW_PROJECT` | 建立新的產品或系統 | 依本 Contract 執行完整 intake |
| `EXISTING_PROJECT_CHANGE` | 修改既有專案能力或規格 | 載入既有 Project Repo 與 canonical specs |
| `BUG_FIX` | 修正既有行為錯誤 | 進入既有專案的 bug work item 流程 |
| `DESIGN_CHANGE` | 修改既有 UX / UI contract | 進入既有專案的 design 流程 |
| `TECHNICAL_TASK` | 重構、效能、維運或工程設定 | 進入既有專案的 technical work item 流程 |
| `RESEARCH_ONLY` | 分析、探索或建議，不要求建立交付物 | 保持 research context，不建立 repo 或啟動實作 |

本 Contract 主要規範 `NEW_PROJECT`。若 intent 無法可靠判斷，狀態進入 `BLOCKED_MISSING_INFO` 並回報 `INTENT_UNCLEAR`；不得直接啟動 `IMPLEMENTER`。

## 4. New Project Lifecycle

正常 lifecycle：

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

Blocked / terminal states：

```text
BLOCKED_MISSING_INFO
BLOCKED_CONFLICT
REPO_CREATION_FAILED
SPEC_GATE_FAILED
CANCELLED
```

| State | Exit Condition |
|---|---|
| `RECEIVED` | 原始請求與可用來源已記錄 |
| `CLASSIFIED` | intent 已判定為 `NEW_PROJECT` |
| `DISCOVERY` | 已推導 safe facts 並釐清 material unknowns |
| `REQUIREMENTS_READY` | 已有足以提出 proposal 的 Project Context |
| `PROJECT_PROPOSED` | 已向使用者呈現完整 Project Proposal |
| `AWAITING_REPO_APPROVAL` | 等待明確 `APPROVE_PROJECT`、變更或取消 |
| `REPO_PROVISIONING` | 已核准 repo target，正在初始化 Project Repo |
| `SPEC_GENERATION` | Project Repo 已完成 bootstrap，正在產生初始規格 |
| `SPEC_REVIEW` | 初始規格正在執行 `SPEC_GATE` 與必要人工審查 |
| `READY_FOR_DESIGN` | Spec Gate 已通過，且沒有阻擋設計的重大未知事項 |

不得跳過 `AWAITING_REPO_APPROVAL` 直接建立 repository，也不得跳過 `SPEC_REVIEW` 直接建立 Design Work Item。

## 5. Discovery and Clarification Policy

`PRODUCT_ARCHITECT` 必須遵守：

```text
Infer safe facts
→ Identify material unknowns
→ Ask minimum necessary questions
```

可以從原始需求與來源可靠推導的資訊，應先記為 Project Context 或明示 assumption。只有會實質影響產品範圍、角色與權限、資料結構、架構、安全、整合或驗收的未知事項才需要提問。

禁止：

- 把 Project Context 每個欄位都轉成問卷。
- 一次提出大量不影響當前決策的問題。
- 把推測寫成已確認 business rule。
- 因次要資訊尚未確定而阻擋整個 proposal。

若缺少的資訊會導致錯誤 repo、重大需求歧義或無法產生可審查規格，進入 `BLOCKED_MISSING_INFO`。可延後決定的內容記入 `known_unknowns`，並在規格中標示 `TBD` 或 Open Question。

## 6. Project Context Schema

Project Context 是 vendor-neutral 的 intake output，不是 Product Spec Source of Truth。正式需求必須寫入 canonical specs 後，才可供下游 Agent 執行。

```yaml
project_id: string
project_name: string
project_slug: string
intent: NEW_PROJECT
summary: string
business_goal: string
target_users:
  - string
user_roles:
  - string
primary_workflows:
  - string
core_features:
  - string
constraints:
  - string
platforms:
  - string
integrations:
  - string
data_sources:
  - string
security_requirements:
  - string
non_functional_requirements:
  - string
known_unknowns:
  - string
assumptions:
  - string
out_of_scope:
  - string
preferred_stack:
  recommendation: string
  reason: string
  constraints:
    - string
  alternatives_considered:
    - string
repository:
  provider: github
  owner: string
  name: string
  visibility: private
  default_branch: main
  development_branch: develop
status: string
```

Array 可以是空陣列，但不得以空值掩蓋會阻擋 proposal 或 spec 的重大未知事項。所有未確認推論必須放入 `assumptions` 或 `known_unknowns`，不得混入 confirmed facts。

## 7. Naming and Technology Recommendation

### 7.1 Project Naming

- `project_name` 是人類可閱讀名稱。
- `project_slug` 是 repository-friendly 的 kebab-case 名稱。
- Project Architect 可提出建議名稱，但 Repo Provisioner 執行前必須讓使用者確認 `repository.owner` 與 `repository.name`。
- Repository name 發生衝突時不得自行改名建立，必須回報 `REPOSITORY_NAME_CONFLICT`。

### 7.2 Technology Recommendation

Project Intake 可依需求提出 frontend、backend、database 與 infrastructure 的初步選項，例如 React、Next.js、Vue、Node.js、Python、Laravel、Java、PostgreSQL、MySQL、MongoDB、AWS、GCP、Azure、Vercel 或 Docker。

每項建議必須記錄：

```text
recommendation
reason
constraints
alternatives_considered
```

這些內容是 proposal 階段的 recommendation，不是 Architecture Source of Truth。重大選型仍須由 `docs/04_system/ARCHITECTURE.md`、`docs/04_system/SDD.md` 與必要的 Accepted ADR 正式化。

## 8. Project Proposal and Approval

建立 repository 前，Project Architect 必須向使用者呈現至少以下內容：

```text
Project Name
Repository Name
Project Summary
Business Goal
Primary Users
Core Features
Primary Platform
Recommended Stack
Known Open Questions
Repository Visibility
```

Proposal 必須明確說明即將建立的專案與外部影響，並提供三種決策：

| Decision | Effect |
|---|---|
| `APPROVE_PROJECT` | 核准 proposal 與 repo target，允許進入 `REPO_PROVISIONING` |
| `REQUEST_CHANGES` | 回到 `DISCOVERY` 或 `REQUIREMENTS_READY` 更新內容，不建立 repo |
| `CANCEL` | 進入 `CANCELLED`，不建立 repo |

只說「我要做一個系統」不等於核准 repository creation。只有 Project Proposal 已呈現，且使用者對該 proposal 明確表示 `APPROVE_PROJECT` 或語意等價的核准後，Repo Provisioner 才能執行。

## 9. Repository Provisioning Contract

Repository creation 是 external side effect。核准後，Repo Provisioner 未來必須依序：

1. 再次驗證核准的 provider、owner、repository name 與 visibility。
2. 建立 GitHub repository；visibility 預設為 `private`。
3. 初始化 canonical project structure。
4. 依 Project Bootstrap Manifest 複製或生成必要治理檔案。
5. 建立 project-level `README.md`。
6. 建立 `main` default branch。
7. 建立 `develop` development branch。
8. 寫入 initial project metadata 與 framework version metadata。
9. 建立 canonical docs、specs、design、work-items 與 traceability 目錄。
10. 建立並 push 一次 initial bootstrap commit。

Framework Repo 與 Project Repo 必須分離：

- `ai-system-delivery-framework` 是治理、templates 與 bootstrap source。
- Project Repo 是實際專案的 canonical specs、design contracts、source code、tests 與 delivery history 的 Source of Truth。
- Project Repo 不得以 subdirectory 或工作 session 暫存區取代獨立 repository。

本 Contract 只定義未來 provisioner 的行為，不實作 GitHub API，也不授權在規格建立階段實際建立 Project Repo。

## 10. Project Bootstrap Manifest

Bootstrap Manifest 是「哪些 Framework artifacts 應進入 Project Repo」的明確清單。它應複製或生成：

```text
AGENTS.md
CLAUDE.md                  # 僅在專案使用 Claude 時
necessary .ai governance
README.md                  # project-level
canonical docs structure
specs/
design/
work-items/
traceability/
```

必要 `.ai` governance 應由 manifest 明列，且只能包含 Project execution 所需的穩定治理文件。不得預設複製：

- Framework 開發說明。
- Framework 自身的 Harness implementation architecture。
- 與 Project 無關的 skills。
- Framework repo 的歷史、issue、session 或 maintenance 文件。
- 任何未列入 manifest 的內部資料。

這個限制避免 Framework 內部內容污染 Project Repo，也避免 Project Repo 意外形成第二套 framework implementation。

### 10.1 Governance Version Metadata

Project Repo 必須記錄初始化來源：

```yaml
framework:
  repository: ivan-tsai1207/ai-system-delivery-framework
  version: <commit-sha-or-release>
  initialized_at: <timestamp>
```

`version` 必須是可解析的 commit SHA 或 release identifier；`initialized_at` 使用有時區的 timestamp。metadata 只記錄 provenance，不會讓 Framework Repo 取代 Project Repo 的 canonical specs。

## 11. Initial Specification Generation

Repo Provisioning 完成後，系統產生一個內部 specification work item，交由 Harness 以 `PRODUCT_ARCHITECT` 執行，建立：

```text
docs/02_product/PRODUCT_VISION.md
docs/02_product/PRD.md
docs/03_requirements/SRS.md
docs/04_system/ARCHITECTURE.md
docs/04_system/SDD.md
specs/<feature>/spec.md
```

規格內容必須來自 Project Context、使用者答案與已登錄資料來源。若 Architecture 或 SDD 仍有未知資訊，可以標示 `TBD` 或 Open Question，但不得自行虛構 business rule、role、permission、workflow、data field 或 integration contract。

初始規格完成後：

```text
Generate Specs
→ SPEC_GATE
→ Human Review when required
→ READY_FOR_DESIGN
```

存在重大未決需求時進入 `BLOCKED_MISSING_INFO`；存在規格衝突時進入 `BLOCKED_CONFLICT`。不得把未決產品問題交給 UX Designer 自行決定。

## 12. Design and Implementation Dispatch

### 12.1 Design Dispatch

只有 `READY_FOR_DESIGN` 才能由 Orchestrator 自動產生內部 Design Work Item：

```text
Harness
→ Role = UX_DESIGNER
→ selected compatible adapter
→ design/<feature>/**
→ DESIGN_GATE
```

Design output 必須區分：

- Git-tracked Design Contract：Screen Spec、Design Source Map、Design Tokens、UX flow，以及適合納入版本控制的 HTML / React prototype。
- External design source：Figma、Claude Design hosted artifact 或其他外部工具產物。

External design source 必須登錄於 `design/<feature>/Design_Source_Map.md`。Raw external artifact 不得取代 canonical Screen Spec。

### 12.2 Implementation Dispatch

只有 Design Gate 通過後，Orchestrator 才能依 Feature Spec 與 Screen Spec 自動拆分 implementation work items：

```text
Harness
→ Role = IMPLEMENTER
→ selected compatible adapter
→ source code and tests in Project Repo
→ IMPLEMENTATION_GATE
```

Source code 必須保存在 Project Repo 的 `src/**`、`app/**`、`tests/**`、`migrations/**` 或 Architecture 定義的等價路徑，不得只留在 Claude、Codex 或其他 Agent session。

## 13. Internal Work Items and Agent Selection

Work Item 是 system-generated internal execution contract。Project Architect / Orchestrator 根據 approved specs 自動建立 task ID、Role、Phase、read / write scope、required context 與 gates。正常情況下，使用者不需自行建立或填寫這些欄位。

Agent 選擇以 Role 為核心：

| Role | Runtime Selection Principle |
|---|---|
| `PRODUCT_ARCHITECT` | 選擇適合規劃與規格工作的 Agent adapter |
| `UX_DESIGNER` | 選擇具設計能力且符合 boundary 的 Agent adapter |
| `IMPLEMENTER` | 選擇具實作能力且符合 boundary 的 Agent adapter |
| `REVIEWER` | 選擇可讀取 evidence 並執行 gate review 的 Agent adapter |

Claude、Codex 或其他 vendor 是 runtime adapter selection，不是 Product Workflow Authority，也不得改寫 Role、Gate 或 canonical specs。

## 14. Git Strategy and Bootstrap Exception

一般開發沿用 `skills/github-project-sync.md` 的唯一 Git strategy：

```text
develop
→ work branch
→ PR
→ develop
→ release approval
→ main
```

一般 Agent 禁止直接修改 `main`。唯一的新 repo bootstrap 例外是：使用者核准 Project Proposal 與 repo target 後，Repo Provisioner 可以建立並 push 一次 initial bootstrap commit，以建立 `main`、`develop` 與必要初始結構。

Bootstrap 完成後例外立即失效；所有後續 Agent 必須恢復一般 branch / PR policy。此例外不得延伸為規格產生、設計、實作或 release 的 direct-to-main 權限。

## 15. Human Approval Points

至少在以下事項取得人工確認：

| Approval Point | Required Before |
|---|---|
| Project Proposal / Repository Creation | 建立 Project Repo 或 push bootstrap commit |
| Major requirement change | 修改已核准產品範圍、角色、權限、資料或重大架構方向 |
| Production deployment | 建立或更新 production environment |
| Destructive operation | 刪除、覆蓋、history rewrite 或資料破壞 |
| Merge / release to `main` | 依 Git policy 發布穩定版本 |

一般 read、推導、文件草稿與已授權 work item 內的小動作不應逐項詢問，避免 approval fatigue。高風險操作仍須遵守 Constitution、Authority 與 repository-level instructions。

## 16. Audit Contract

Project Intake 至少保留：

```yaml
original_request: string
clarification_questions: []
user_answers: []
project_context: object
project_proposal: object
approval: object
repo_target: object
framework_version: string
generated_specs: []
initial_work_items: []
handoff_status: string
```

Repo 建立前，audit 可保存在 Orchestrator 管理的暫時 execution state；Repo 建立後，應將必要 evidence 寫入 Project Repo 或受控 audit sink。Audit 只記錄決策與執行事實，不得取代 canonical specs，也不得以舊 audit 覆蓋較新的正式規格。

## 17. Failure Handling

| Failure | Retry | Human Intervention | New Execution Context |
|---|---|---|---|
| `INTENT_UNCLEAR` | 取得最小必要回答後可重試 classification | Required | No；可延續 intake context |
| `MISSING_CRITICAL_REQUIREMENT` | 補齊關鍵需求後可重試 discovery / spec generation | Required | No；需求重大改變時建立新的 spec execution |
| `PROJECT_REJECTED` | 除非使用者提出新 proposal，否則不重試 | Required to resume | Yes |
| `REPOSITORY_NAME_CONFLICT` | 使用者確認新名稱後可重試 | Required | Yes；建立新的 provisioning execution |
| `REPOSITORY_CREATION_FAILED` | 原因可恢復且 approval 仍有效時可重試 | Required if target、visibility 或 credential changes | Yes |
| `BOOTSTRAP_FAILED` | 清理不完整結果並驗證 target 後可重試 | Required for destructive cleanup or target change | Yes |
| `SPEC_GENERATION_FAILED` | 修正 context、tool 或 adapter failure 後可重試 | Required when requirement input is missing | Yes；交由新的 Harness execution |
| `SPEC_GATE_FAILED` | 規格修正後可重新執行 gate | Required for material requirement decisions | Yes；使用新的 review / spec execution |
| `AGENT_DISPATCH_FAILED` | 修正 adapter、capability 或 Harness 問題後可重試 | Required when policy or scope must change | Yes |

所有 retry 必須保留前次 failure evidence。不得在同一個已失效或越權的 Harness execution 中切換 Role、擴張 permission 或跳過 approval。

## 18. Validation Criteria

Contract implementation 必須驗證：

1. 使用者可只用自然語言開始新專案。
2. 使用者不需手動建立 Work Item。
3. 未經 Human Approval 不會建立 repository。
4. 新 repository 預設為 private。
5. Framework Repo 與 Project Repo 保持分離。
6. Project Repo 保存 Design Contract 與 source code。
7. Claude、Codex 與其他 vendor 只作為 Adapter，不是 workflow authority。
8. Project Intake 與 Harness Contract 的責任沒有重疊。
9. 本 Contract 沒有建立第二套 Authority。
10. 規格階段不建立實際 Project Repo、不寫 runtime code。
11. Bootstrap 完成後，一般 Agent 不可直接 push `main`。
