# Authority Hierarchy

本文件分別定義治理規則與交付規格的權威順序。載入順序不等於權威順序；低層級文件或 Agent 假設不得靜默覆蓋高層級文件。

## Governance Authority

治理權威控制 Agent 應如何工作：

```text
1. .ai/CONSTITUTION.md
2. .ai/AUTHORITY.md
3. .ai/WORKFLOW.md
4. .ai/roles/<active-role>.md
5. .ai/gates/<active-gate>.md
6. AGENTS.md
7. Tool-specific adapters，例如 CLAUDE.md、LLM_OPERATING_RULES.md、docs/tool_adapters.md
8. skills/**
9. Runtime user prompt
10. Agent assumptions
```

- `AGENTS.md` 是 repository entrypoint，負責引導 Agent 載入治理文件，但不是最高治理權威。
- Tool-specific adapters 只補充工具載入方式，不得改寫共用治理規則。
- Active role 與 active gate 只在任務指派與目前階段內生效。

## Delivery Specification Authority

交付規格權威控制產品與系統應該做什麼：

```text
1. Human-approved requirements already incorporated into canonical specs
2. docs/02_product/PRODUCT_VISION.md
3. docs/02_product/PRD.md
4. docs/03_requirements/SRS.md
5. docs/04_system/ARCHITECTURE.md
6. docs/04_system/SDD.md
7. specs/<feature>/spec.md
8. design/<feature>/screens/<SCREEN-ID>.md
9. work-items/<WORK-ITEM-ID>.md
10. Raw design sources，例如 Figma、Claude Design、HTML prototype
11. Runtime user prompt
12. Agent assumptions
```

- Human approval 只有在內容已寫回 canonical spec 後，才形成可供下游 Agent 執行的正式規格。
- Lower-level artifacts 可以補充 higher-level specifications 的實作細節，但不得靜默推翻或改寫上層規格。
- Raw design source 是設計輸入，不是 Source of Truth。
- Work item 定義單次任務的 delta 與路徑範圍，不得改變產品或系統 state。

## Conflict Handling

若任何治理文件或交付產物與較高層級內容衝突：

1. 停止受衝突影響的設計、實作、審查或發布。
2. 回報 `SPEC CONFLICT`，列出衝突文件、規則與影響範圍。
3. 不得以檔案較新、對話較新或 Agent 偏好為理由自行選邊。
4. 由使用者或授權角色決定是否更新 canonical spec。
5. 規格更新並通過對應 Gate 後才能繼續。

範例：

```text
docs/02_product/PRD.md：只有 Admin 可以刪除商品。
design/inventory/screens/SCR-INV-001.md：Warehouse Staff 有 Delete Button。
```

判定：

```text
SPEC CONFLICT
DESIGN GATE FAILED
原因：Screen Spec violates permission requirement in PRD.
```

## ADR Rule

- ADR 儲存於 `docs/05_decisions/ADR-*.md`。
- 只有 `Status: Accepted` 的 ADR 可以形成正式技術決策。
- ADR 不會僅因建立或更新就自動覆蓋 `docs/04_system/ARCHITECTURE.md` 或 `docs/04_system/SDD.md`。
- 若 ADR 取代既有決策，必須明確標示 `Supersedes: ADR-XXX`。
- Accepted ADR 的結果必須同步更新相關 Architecture / SDD；下游 Agent 以更新後的 canonical spec 為執行依據。

## Change Request Rule

Change Request 本身不是永久 Source of Truth，狀態流程為：

```text
Proposed
→ Under Review
→ Approved
→ Canonical Spec Updated
→ Implemented
→ Closed
```

- Approved CR 必須先寫回受影響的 PRD、SRS、Architecture、SDD 或 Feature Spec。
- 在狀態成為 `Canonical Spec Updated` 前，下游 Agent 不得依 CR 內容改變設計或實作。
- CR 被拒絕時標記為 `Rejected`；被其他 CR 取代時標記為 `Superseded`。
- 正式規格更新後，CR 保留為變更脈絡與稽核紀錄，不與 canonical spec 競爭權威。
