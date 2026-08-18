# Tool Adapters

本文件說明不同 LLM / Agent 工具如何讀取與使用 `ai-system-delivery-framework`。

## 共用原則

- 本 repo 是 AI 系統開發專案的規則與流程來源。
- `AGENTS.md` 是 agent repository entrypoint，不是最高治理權威。
- `.ai/` 是 Agentic Substrate 治理層，定義憲法、權威順序、工作流、角色邊界與 Gate。
- `.ai/HARNESS_CONTRACT.md` 是共用 runtime contract；各工具只負責轉換成自身支援的 permission、prompt、hook、sandbox 與 tool configuration。
- `LLM_OPERATING_RULES.md` 是跨 LLM 通用規則。
- `skills/` 與 `templates/` 只在 assigned Work Item需要時on demand載入。
- `agent_roles/` 與 `docs/review_role_matrix.md` 只是非 canonical professional reference / navigation，不決定 required review、Reviewer Profile、Risk或Gate。
- 所有工具都必須使用 `Work Item -> active Role -> assigned Reviewer Profile when applicable -> Risk -> active Gate` 路由，且initial context small-by-default。

## Codex

建議入口：`AGENTS.md` thin router → assigned Work Item → Tier 1 mandatory context。

使用方式：

- 在 Codex 工作目錄放置或引用本 repo 的 `AGENTS.md`。
- 若本 repo 是目前工作目錄，Codex先由`AGENTS.md`進入；其他governance、role、gate與requirements依active Work Item精準載入。
- 重複性流程可整理為正式Codex Skill，但Skill只在需要且Read Scope允許時載入。

## Claude / Claude Code

建議入口：`CLAUDE.md` vendor router → `AGENTS.md` shared router → assigned Work Item → Tier 1 mandatory context。

使用方式：

- 將`CLAUDE.md`作為Claude專用入口；載入後仍以`.ai/CONSTITUTION.md`為最高治理權威。
- Project knowledge只放thin routers；不得預設加入`.ai/**`、`docs/**`、`skills/**`、`templates/**`或整個repository。
- 若 Claude 環境無法自動讀 repo，將 `docs/llm_bootstrap_prompt.md` 貼入對話開頭。

## Google AI Studio / Gemini

建議入口：`docs/llm_bootstrap_prompt.md` → assigned Work Item → Tier 1 mandatory context。

使用方式：

- 將`docs/llm_bootstrap_prompt.md`放入System Instructions或對話開頭，並依其指示精準載入active governance、role、gate與requirements。
- Skills與templates只可按任務需要on demand加入，不以context尚有空間作為載入理由。
- 不要假設 Google AI Studio 會自動讀取 repo 檔案；需明確貼入或透過工具提供內容。

## 其他 LLM / Agent

建議入口：`docs/llm_bootstrap_prompt.md` → assigned Work Item → Tier 1 mandatory context。

使用方式：

- 先要求LLM讀取thin bootstrap，不要預載完整Framework handbook。
- 無法讀 repo 時，貼上 `docs/llm_bootstrap_prompt.md`。
- 若任務進入實作或規格產出，只提供Read Scope允許且直接相關的skill、template或section。

## 不同工具的責任分工

| 工具 | 主要入口 | 適合用途 |
|---|---|---|
| Codex | `AGENTS.md`（entrypoint） | Repo 工作、文件維護、程式實作、Git workflow |
| Claude / Claude Code | `CLAUDE.md` | 長文規劃、需求整理、文件審查、程式協作 |
| Google AI Studio / Gemini | `LLM_OPERATING_RULES.md` + bootstrap prompt | prompt-driven 規劃、原型討論、模型測試 |
| 其他 LLM | bootstrap prompt | 手動載入規則後執行特定任務 |

## 維護規則

- 跨工具共用規則優先寫入 `LLM_OPERATING_RULES.md`。
- Codex 專用或 agent 工作目錄規則寫入 `AGENTS.md`。
- Claude 專用入口或載入提醒寫入 `CLAUDE.md`。
- Agentic Substrate 治理規則寫入 `.ai/`。
- Vendor-specific adapter 不得複製或改寫 Harness Contract；只能實作工具支援的 enforcement mapping。
- Canonical project paths 的權威定義來自 `.ai/AUTHORITY.md` 與 `docs/project_repo_structure.md`；其他文件若列出路徑，只能同步反映這兩份定義，不得建立第二套規則。
- 工具使用方式改變時，更新本文件。
