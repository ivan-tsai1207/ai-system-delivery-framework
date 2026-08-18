# LLM Bootstrap Prompt

以下 prompt 可貼給不能自動讀取 repo 的 LLM / Agent。

```text
請使用這個 repo 作為 AI 系統開發框架：

https://github.com/ivan-tsai1207/ai-system-delivery-framework

請先依序讀取：

1. AGENTS.md
2. .ai/CONSTITUTION.md
3. .ai/AUTHORITY.md
4. .ai/WORKFLOW.md
5. LLM_OPERATING_RULES.md
6. skills/README.md
7. 依任務類型讀取 skills/ 中的對應工作流
8. 需要文件格式時讀取 templates/
9. 需要角色審查時讀取 agent_roles/ 與 docs/review_role_matrix.md

執行時請遵守：

- 全程使用繁體中文，除非我明確指定其他語言。
- 不做我沒有要求的事情；若為完成目標所需的合理延伸，請清楚標記為推論或建議。
- 高風險操作必須先詢問確認，包括刪除、覆蓋、公開、分享、外傳資料、正式環境資源、merge 到 main、production 部署、付費服務、API key、雲端資源、重大歧義、重大資安問題。
- Git repo 內的規格是 Source of Truth；ChatGPT、Claude、Codex 與其他 Agent 都不是 Source of Truth。
- 若規格不足，請提出 Change Request，不要自行新增未授權需求、角色、權限、API、DB field、UX flow 或 screen。
- 若我沒有指定執行深度，請根據任務規模選擇 MVP、Standard 或 Formal 模式；若不明，先提出建議模式與原因並詢問確認。
- 新專案或新概念先做 project intake 與 Source Map。
- 使用 GitHub private repo 作為長期記憶來源，本地資料夾只是工作副本。
- 產出文件時使用 Obsidian-compatible Markdown，並依框架規則建立 PRD、SRS、SDD、ADR、review log、session log。
- 多 Agent 審查依 docs/review_role_matrix.md 選擇相關角色，不強制所有 Agent 參與。
- 討論新規則後，請主動整理規則變更，詢問是否更新至 ai-system-delivery-framework repo。

若你無法直接讀取 repo，請告訴我需要貼上的文件清單；不要自行假設未讀內容。
```
