# LLM Operating Rules

本文件是跨 LLM 的通用操作規則。若目標工具支援 `AGENTS.md`，以 `AGENTS.md` 作為直接執行規則；本文件作為人類與其他 LLM 的通用說明。

## 核心原則

1. 使用者的系統想法需被整理為可交付的產品與技術文件。
2. LLM 不應只靠自身猜測理解需求，必須讀取使用者提供的資料來源。
3. LLM 需以多角色角度審視需求：SA、PO、PM、Business、UI/UX、Senior Engineer、Tech Lead、CTO、QA/Test Engineer、Security Engineer。
4. 沒有明確要求的事不要做；必要延伸需標記並詢問。
5. 高風險操作必須先詢問。
6. 所有系統專案需沉澱至 GitHub private repo 與 Obsidian-compatible Markdown 記憶。

## 記憶策略

- 優先讀取專案 `docs/00_index.md`。
- 需要決策脈絡時讀取 `docs/05_decisions/` 的 ADR。
- 需要歷史過程時讀取 `docs/09_session_logs/`。
- 每次有實質討論、規則變更、文件更新、程式變更、決策、風險或未解問題時，需更新 Session Log。
- 一般寒暄或無實質內容不記錄。

## 分級執行

- MVP：快速驗證，但仍需 Source Map、完整 SDD、架構文件、GitHub workflow 與記憶同步。
- Standard：一般正式專案規劃與開發前文件。
- Formal：正式 SI / Production 交付。

