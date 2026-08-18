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
  .ai/
  agent_roles/
  docs/
  skills/
  templates/
```

## Agentic Substrate

本 repo 不只是 AI 工具使用手冊，而是 AI 開發治理層。核心概念：

```text
Constitution
  ↓
Authority
  ↓
Workflow
  ↓
Product Vision
  ↓
Architecture
  ↓
Living Feature Specs
  ↓
UX Contract
  ↓
Work Item
  ↓
Automated Gates
  ↓
Code
```

重要文件：

- `.ai/CONSTITUTION.md`：最高治理規則。
- `.ai/AUTHORITY.md`：規格衝突時的權威順序。
- `.ai/WORKFLOW.md`：ChatGPT / Claude / Codex 交接流程。
- `.ai/roles/`：角色邊界。
- `.ai/gates/`：Spec / Design / Implementation / Release Gate。
- `templates/PRODUCT_VISION.md`：Product Vision 模板。
- `templates/Feature_Spec.md`：Living Feature Spec 模板。
- `templates/Screen_Spec.md`：UX Contract / Screen Spec 模板。
- `templates/Design_Source_Map.md`：Figma、Claude design、HTML prototype 等設計來源整理模板。
- `templates/Work_Item.md`：單次 Agent 任務邊界模板。
- `templates/Change_Request.md`：規格不足或需要擴張時使用。

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
  .ai/
  docs/
    00_index.md
    01_sources/
    02_product/
      PRODUCT_VISION.md
      PRD.md
    03_requirements/
      SRS.md
    04_system/
      ARCHITECTURE.md
      SDD.md
    05_decisions/
      ADR-*.md
    06_risks/
    07_open_questions/
    08_agent_reviews/
    09_session_logs/
  specs/<feature>/spec.md
  design/<feature>/
    Design_Source_Map.md
    screens/<SCREEN-ID>.md
  work-items/<WORK-ITEM-ID>.md
  traceability/traceability.yaml
  README.md
  AGENTS.md
```

## 使用原則

1. 新系統概念先進行 project intake 與 Source Map。
2. 依任務深度選擇 MVP、Standard 或 Formal 模式。
3. 高風險操作必須先用繁體中文詢問使用者。
4. 產出文件需寫回專案記憶，並推送到 GitHub。
5. 重大技術決策需建立 ADR。
