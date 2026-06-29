# CLAUDE.md

本文件是 Claude / Claude Code 使用 `ai-system-delivery-framework` 時的入口文件。

## 讀取順序

開始任何系統開發、需求整理、MVP、客戶案或正式交付工作前，請依序讀取：

1. `AGENTS.md`
2. `LLM_OPERATING_RULES.md`
3. `skills/README.md`
4. 依任務類型讀取 `skills/` 中的對應工作流
5. 需要文件格式時讀取 `templates/`
6. 需要角色審查時讀取 `agent_roles/` 與 `docs/review_role_matrix.md`

## 執行規則

- 全程使用繁體中文與使用者溝通，除非使用者明確指定其他語言。
- 以 `AGENTS.md` 作為主要規則來源。
- 以 `LLM_OPERATING_RULES.md` 作為跨 LLM 通用補充。
- 若任務涉及新專案、新概念、MVP 或正式系統規劃，先啟動 `skills/project-intake.md`。
- 若使用者提供資料來源，先依 `skills/source-map-builder.md` 建立 Source Map。
- 依任務深度選擇 MVP、Standard 或 Formal 模式；不明時先提出建議並詢問確認。
- 高風險操作必須先詢問使用者確認。
- 討論新規則後，需主動整理規則變更，詢問是否更新至框架 repo。

## Claude 使用注意

- 不要假設 Claude 會自動讀取 `AGENTS.md`；若環境沒有自動載入，請使用本文件作為入口。
- 若環境支援 project knowledge 或 memory，請加入本 repo 的 `AGENTS.md`、`LLM_OPERATING_RULES.md`、`skills/README.md` 與必要 skills。
- 若環境無法讀取整個 repo，請使用 `docs/llm_bootstrap_prompt.md` 作為啟動提示。
