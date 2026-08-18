# Tool Adapters

本文件說明不同 LLM / Agent 工具如何讀取與使用 `ai-system-delivery-framework`。

## 共用原則

- 本 repo 是 AI 系統開發專案的規則與流程來源。
- `AGENTS.md` 是 agent 主要規則入口。
- `.ai/` 是 Agentic Substrate 治理層，定義憲法、權威順序、工作流、角色邊界與 Gate。
- `LLM_OPERATING_RULES.md` 是跨 LLM 通用規則。
- `skills/` 是可重用工作流說明。
- `templates/` 是文件產出模板。
- `agent_roles/` 與 `docs/review_role_matrix.md` 是多 Agent 審查依據。

## Codex

建議入口：

1. `AGENTS.md`
2. `.ai/CONSTITUTION.md`
3. `.ai/AUTHORITY.md`
4. `.ai/WORKFLOW.md`
5. `LLM_OPERATING_RULES.md`
6. `skills/README.md`

使用方式：

- 在 Codex 工作目錄放置或引用本 repo 的 `AGENTS.md`。
- 若本 repo 是目前工作目錄，Codex 會依 `AGENTS.md` 作為專案規則。
- 重複性流程可再整理為正式 Codex Skill。

## Claude / Claude Code

建議入口：

1. `CLAUDE.md`
2. `AGENTS.md`
3. `.ai/CONSTITUTION.md`
4. `.ai/AUTHORITY.md`
5. `.ai/WORKFLOW.md`
6. `LLM_OPERATING_RULES.md`
7. `skills/README.md`

使用方式：

- 將 `CLAUDE.md` 作為 Claude 專用入口。
- 若 Claude 環境支援 project knowledge，加入 `AGENTS.md`、`LLM_OPERATING_RULES.md`、`skills/README.md` 與常用 skills。
- 若 Claude 環境無法自動讀 repo，將 `docs/llm_bootstrap_prompt.md` 貼入對話開頭。

## Google AI Studio / Gemini

建議入口：

1. `LLM_OPERATING_RULES.md`
2. `.ai/CONSTITUTION.md`
3. `.ai/AUTHORITY.md`
4. `.ai/WORKFLOW.md`
5. `docs/llm_bootstrap_prompt.md`
6. 依任務補充 `skills/` 與 `templates/`

使用方式：

- 將 `docs/llm_bootstrap_prompt.md` 放入 System Instructions 或對話開頭。
- 若 context 允許，再加入 `AGENTS.md` 與相關 skills。
- 不要假設 Google AI Studio 會自動讀取 repo 檔案；需明確貼入或透過工具提供內容。

## 其他 LLM / Agent

建議入口：

1. `docs/llm_bootstrap_prompt.md`
2. `LLM_OPERATING_RULES.md`
3. `AGENTS.md`
4. `skills/README.md`

使用方式：

- 先要求 LLM 讀取本 repo 的入口文件。
- 無法讀 repo 時，貼上 `docs/llm_bootstrap_prompt.md`。
- 若任務進入實作或規格產出，再提供對應 skill 與 template。

## 不同工具的責任分工

| 工具 | 主要入口 | 適合用途 |
|---|---|---|
| Codex | `AGENTS.md` | Repo 工作、文件維護、程式實作、Git workflow |
| Claude / Claude Code | `CLAUDE.md` | 長文規劃、需求整理、文件審查、程式協作 |
| Google AI Studio / Gemini | `LLM_OPERATING_RULES.md` + bootstrap prompt | prompt-driven 規劃、原型討論、模型測試 |
| 其他 LLM | bootstrap prompt | 手動載入規則後執行特定任務 |

## 維護規則

- 跨工具共用規則優先寫入 `LLM_OPERATING_RULES.md`。
- Codex 專用或 agent 工作目錄規則寫入 `AGENTS.md`。
- Claude 專用入口或載入提醒寫入 `CLAUDE.md`。
- Agentic Substrate 治理規則寫入 `.ai/`。
- 工具使用方式改變時，更新本文件。
