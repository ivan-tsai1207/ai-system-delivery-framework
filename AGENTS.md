# AGENTS.md

本文件是 AI 系統開發專案的總規則，給 Codex、Claude Code 與類似 agent 工具直接讀取。

## 0. Agentic Substrate 讀取順序

開始任何系統開發、需求整理、UI/UX 設計、程式實作或審查前，必須先讀取：

1. `.ai/CONSTITUTION.md`
2. `.ai/AUTHORITY.md`
3. `.ai/WORKFLOW.md`
4. `docs/PRODUCT_VISION.md`
5. 與任務相關的 `specs/{feature}/spec.md`、`design/**`、`work-items/**`

若上述文件在目標專案尚不存在，需依 `templates/` 建立或詢問使用者是否建立。

核心原則：

- Git repo 內的規格是 Source of Truth。
- ChatGPT、Claude、Codex 與其他 Agent 都不是 Source of Truth。
- 低層級文件、work item、user prompt 或 Agent 假設不得覆蓋高層級規格。
- 規格不足時提出 Change Request，不得自行新增未授權需求。

## 1. 語言與溝通

- 全程使用繁體中文與使用者溝通，除非使用者明確指定其他語言。
- 在有疑義時，先整理目前理解、判斷邏輯與建議做法，再詢問使用者確認。
- 不做使用者沒有要求的事情；若為完成目標所需的合理延伸，必須清楚標記為推論或建議。
- 討論新規則後，需主動整理規則變更，詢問是否更新至框架 repo。

## 2. 高風險操作必問

以下操作必須先詢問使用者確認：

- 刪除、覆蓋、公開、分享、外傳資料。
- 建立或修改正式環境資源。
- merge 到 `main`。
- 正式部署 production。
- 新增付費服務、第三方服務、API key、雲端資源。
- 需求有重大歧義。
- 多 Agent 審查出現重大衝突。
- 改變既有框架規則。
- 遇到或檢測出重大資安問題。

## 3. 執行模式

若使用者未指定執行深度，需根據任務規模選擇最輕量但足以完成目標的模式；若判斷不明，先提出建議模式與原因並詢問確認。

可用明確指令指定模式：

```text
/mode mvp
/mode standard
/mode formal
```

也可使用自然語言指定，例如：

```text
用 MVP 模式做
用正式 SI 模式整理
這次只要快速驗證
這次要完整規格
```

### Mode 1: MVP 快速驗證模式

適用於新想法、概念驗證、小工具、內部 demo。

必做：

- Source Map。
- Obsidian 記憶同步。
- GitHub private repo / branch / commit / push。
- 正式 GitHub workflow。
- 完整 SDD。
- 架構文件。
- 核心目標與使用情境。
- Mini PRD。
- 基本功能測試。
- 重要決策與未解問題。

可簡化：

- 完整 SRS。
- 完整多 Agent 審查。
- 完整資安測試。
- 完整 UI/UX 文件。
- 完整雲端架構細節。
- 正式部署流程。

### Mode 2: Standard 專案模式

適用於準備交給工程師、客戶討論、正式開發前規劃。

包含 Source Map、PRD、SRS、SDD、架構文件、多 Agent 審查、QA 測試計畫、Security 基礎檢查、GitHub 同步、Obsidian 記憶同步與 branch 測試環境部署。

### Mode 3: Formal SI / Production 模式

適用於客戶專案、正式交付與上線系統。

包含完整 PRD / SRS / SDD、ADR、API spec、data model、cloud architecture、backend architecture、UI/UX flows、完整角色審查紀錄、測試計畫與測試報告、資安審查、部署策略、變更紀錄、驗收標準與正式部署前確認。

## 4. 預設新專案工作流

1. 收集資料來源。
2. 建立 Source Map。
3. 多角色初步理解。
4. 產生問題清單。
5. 向使用者確認關鍵問題。
6. 建立 `.ai/CONSTITUTION.md`、`.ai/AUTHORITY.md`、`.ai/WORKFLOW.md`。
7. 建立 `docs/PRODUCT_VISION.md`、PRD、ARCHITECTURE / SDD。
8. 建立 `specs/{feature}/spec.md` 作為 Living Feature Spec。
9. 建立 `work-items/*.md` 限定本次任務的 read / write / forbidden 範圍。
10. 建立 Obsidian 專案記憶。
11. 建立 GitHub repo / branch。
12. 依工作類型進入 Spec Gate、Design Gate、Implementation Gate 或 Release Gate。
13. 多 Agent 審查。
14. 更新角色審查紀錄、traceability 與 session log。
15. commit 並 push。
16. branch 部署到測試環境。
17. 回報 repo、branch、preview URL、更新內容、未解問題。

## 5. Obsidian 與記憶

- 採用 Obsidian-compatible Markdown vault。
- GitHub private repo 是長期記憶來源，本地資料夾只是工作副本。
- 專案知識分為全域記憶、專案記憶與 Session 記憶。
- 使用 `[[雙向連結]]` 建立知識圖譜。
- 必連：PRD、SRS、SDD、決策、未解問題、功能模組、資料模型、API、角色、風險。
- 可連：客戶名、外部工具、技術名詞、第三方服務。
- 不連：普通描述文字、一次性備註、低價值名詞。

## 6. GitHub Workflow

- 新專案直接建立 private repo 並回報 URL。
- 不直接在 `main` 或 `develop` 開發。
- 開發前從 `develop` 建立工作 branch。
- push 前同步 `develop` 最新內容。
- 文件或功能完成後 commit / push。
- merge 到 `main` 前必問。
- production 部署只有使用者明確說「部署」才執行。
- branch 完成功能後可自動部署到測試環境並回報 preview URL。

### 框架 repo 維護流程

- `main` 是穩定正式版。
- `develop` 是下一版整合區。
- 框架 repo 的日常維護，也需從 `develop` 建立工作 branch。
- 工作 branch 完成後可 merge 回 `develop`。
- 若使用者明確要求，也可以直接 commit 到 `develop`。
- 更新到 `develop` 後，需注意其他 agent 可能會讀到新版規則，並回報更新內容。
- 更新到 `main` 前必須詢問使用者確認。
- merge 或更新到 `main` 時，必須告知使用者本次更新內容與影響範圍。

### Branch 命名

```text
feature/add_user_manage
fix/user_manage
refactor/performance_optimize
docs/update_prd
test/add_login_tests
chore/update_ci
```

規則：

- 新功能：`feature/<task-name>`。
- 修 bug：`fix/<task-name>`。
- 重構、效能或架構整理：`refactor/<task-name>`。
- 文件：`docs/<task-name>`。
- 測試：`test/<task-name>`。
- 工程設定：`chore/<task-name>`。
- branch 名稱使用英文小寫、數字、底線或 hyphen。
- branch 名稱避免空白與中文。

### Commit 規範

使用 `type: description`：

```text
feat: add admin manage page
fix: correct login permission check
docs: update PRD and SDD
refactor: simplify user service
test: add auth flow tests
chore: update github action
```

允許類型：`feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`chore`。

### PR 規範

PR title 可使用以下格式：

```text
[Feature] User用戶管理頁面建置
[WIP] User用戶管理頁面建置
[Fix] User頁面Bug對應
```

PR content 需包含：

- 概要。
- 更新的內容。
- 影響範圍。
- 測試結果。
- 風險與注意事項。
- 備註。

預設不需要發 Slack；若專案或使用者另有要求，再依指定流程通知。

### Push 前檢查

- local 測試通過。
- 依專案技術棧執行 formatter / linter / tests。
- 移除前端 `console.log()`。
- 移除後端 `dd();`、`exit;`、`echo "";`、`print_r();`、`var_dump();`。
- 若 repo 沒有指定指令，不得硬跑不存在的指令。

## 7. 多 Agent 審查

- 依文件類型指定相關角色審查，不強制所有 Agent 參與。
- 每個參與 Agent 都要明列，內容保持簡短。
- 即使無問題，也寫「無重大問題」。
- 若有重大問題或角色衝突，需展開說明並統整解決方案。

## 8. Agent 角色邊界

### Product Architect / PM / SA

- 可建立與更新 Product Vision、PRD、Architecture、SDD、Feature Spec、ADR 與 Work Item。
- 不直接實作未授權 code。
- 不用對話推論覆蓋 repo 已確認規格。

### UX Designer

- 只能在既定規格內設計。
- 可產出或更新 `design/**`、Screen Spec、Design Tokens、Component Catalog。
- 可整理 Figma、Claude design output、HTML prototype、v0 output 或 static mockup，並轉成 Design Source Map 與 Screen Spec。
- 不得修改 product scope、business rules、roles、permissions、API contract、DB schema 或 source code。
- 若 UX 需要新增能力，必須提出 Change Request。

### Implementer

- 只能依 Feature Spec、Design Contract 與 Work Item 實作。
- 可修改 work item 授權的 `src/**`、`tests/**` 與必要工程檔案。
- 不得自行新增 feature、role、permission、API、DB field、UX flow 或 screen。
- 若實作需要新增能力，必須停止並提出 Change Request。

## 9. Gate

- MVP：基本功能測試與基礎資安風險檢查，重大資安問題必須停止推進並詢問。
- Standard：測試案例、驗收標準、可執行測試與基礎 Security Review。
- Formal：完整測試計畫、測試報告、自動化測試、OWASP、dependency、secret、權限、資料流與雲端設定檢查。
- Spec Gate：確認 PRD、Architecture / SDD 與 Feature Spec 不衝突。
- Design Gate：確認設計來源已轉成 Screen Spec / UX Contract，Screen / Action 可追溯到 requirement，且未新增未授權能力。
- Implementation Gate：確認 code 符合 Feature Spec、Design Contract 與 Work Item。
- Release Gate：確認測試、資安、traceability 與 Living Spec 已更新。
