# LLM Operating Rules

本文件是跨 LLM 的通用操作規則。若目標工具支援 `AGENTS.md`，以 `AGENTS.md` 作為直接執行規則；本文件作為人類與其他 LLM 的通用說明。

## 核心原則

1. 使用者的系統想法需被整理為可交付的產品與技術文件。
2. LLM 不應只靠自身猜測理解需求，必須讀取使用者提供的資料來源。
3. LLM 需以多角色角度審視需求：SA、PO、PM、Business、UI/UX、Senior Engineer、Tech Lead、CTO、QA/Test Engineer、Security Engineer。
4. 沒有明確要求的事不要做；必要延伸需標記並詢問。
5. 高風險操作必須先詢問。
6. 所有系統專案需沉澱至 GitHub private repo 與 Obsidian-compatible Markdown 記憶。
7. Git repository 內的規格文件是 Source of Truth；LLM 不得用對話推論覆蓋 repo 規格。

## Agentic Substrate

- `.ai/CONSTITUTION.md` 定義最高治理規則。
- `.ai/AUTHORITY.md` 定義規格衝突時的權威順序。
- `.ai/WORKFLOW.md` 定義 ChatGPT / Claude / Codex 的交接流程。
- `specs/{feature}/spec.md` 是功能開發的 Living Feature Spec。
- `design/**` 是 UX Contract，不得新增未授權 product capability。
- `work-items/**` 定義單次任務的 delta、read / write / forbidden 範圍。
- `traceability/**` 或 `templates/Traceability.yaml` 用於追蹤 requirement、screen、API 與 tests。

## 記憶策略

- 優先讀取專案 `docs/00_index.md`。
- 需要決策脈絡時讀取 `docs/05_decisions/` 的 ADR。
- 需要歷史過程時讀取 `docs/09_session_logs/`。
- 每次有實質討論、規則變更、文件更新、程式變更、決策、風險或未解問題時，需更新 Session Log。
- 一般寒暄或無實質內容不記錄。
- Session Log 不寫逐字稿、不寫流水帳，只記錄能幫助未來恢復上下文的內容。
- Session Log 長度原則：一般討論約 300 到 800 字；複雜討論可到約 1,500 字。

## 分級執行

- MVP：快速驗證，但仍需 Source Map、完整 SDD、架構文件、GitHub workflow 與記憶同步。
- Standard：一般正式專案規劃與開發前文件。
- Formal：正式 SI / Production 交付。

## Gate

- Spec Gate：PRD、Architecture / SDD、Feature Spec 不得互相矛盾。
- Design Gate：Screen、Action、State 必須可追溯到 requirement；不得新增未授權能力。
- Implementation Gate：Code 必須符合 Feature Spec、Design Contract 與 Work Item。
- Release Gate：測試、資安、traceability、Living Spec 與 PR 說明完成後才可 merge 或 release。

## 框架 repo 分支策略

- `main` 是穩定正式版，更新前必須取得使用者確認。
- `develop` 是下一版整合區，更新後需回報更新內容，並注意其他 agent 可能讀到新版規則。
- 日常框架維護需從 `develop` 建立工作 branch；若使用者明確要求，才可直接 commit 到 `develop`。
- merge 或更新到 `main` 時，必須告知本次更新內容與影響範圍。

## 模式指定

可用明確指令指定：

```text
/mode mvp
/mode standard
/mode formal
```

也可使用自然語言指定，例如「用 MVP 模式做」、「用正式 SI 模式整理」、「這次只要快速驗證」或「這次要完整規格」。
