# AI System Delivery Framework

本 repo 是系統開發專案的全域交付框架，適用於 Codex、Claude Code 與其他可讀取 Markdown 規則的 LLM / Agent 工具。

## 目的

- 將新概念、MVP、客戶案與正式系統開發整理成可執行流程。
- 以 GitHub private repo 作為長期記憶與版本控制來源。
- 以 Obsidian-compatible Markdown vault 建立知識圖譜。
- 透過 Agent 角色、Skills、文件模板與 Git workflow，降低重複溝通與 token 消耗。

## Repo 類型

全域框架 repo：

```text
ai-system-delivery-framework/
  AGENTS.md
  CLAUDE.md
  LLM_OPERATING_RULES.md
  agent_roles/
  docs/
  skills/
  templates/
```

## 跨 LLM 使用入口

| 工具 | 建議入口 |
|---|---|
| Codex | `AGENTS.md` |
| Claude / Claude Code | `CLAUDE.md` |
| Google AI Studio / Gemini | `docs/llm_bootstrap_prompt.md` + `LLM_OPERATING_RULES.md` |
| 其他 LLM / Agent | `docs/llm_bootstrap_prompt.md` |

詳細載入方式見 `docs/tool_adapters.md`。

專案 repo：

```text
project-name/
  docs/
    00_index.md
    01_sources/
    02_product/
    03_design/
    04_system/
    05_decisions/
    06_risks/
    07_open_questions/
    08_agent_reviews/
    09_session_logs/
  README.md
  AGENTS.md
```

## 使用原則

1. 新系統概念先進行 project intake 與 Source Map。
2. 依任務深度選擇 MVP、Standard 或 Formal 模式。
3. 高風險操作必須先用繁體中文詢問使用者。
4. 產出文件需寫回專案記憶，並推送到 GitHub。
5. 重大技術決策需建立 ADR。
