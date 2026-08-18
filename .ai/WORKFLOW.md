# Agentic SDLC Workflow

本文件定義 ChatGPT、Claude、Codex 與其他 Agent 的交接流程，避免 Intent Debt 與 Context Drift。

## 標準流程

```text
使用者原始需求
  ↓
ChatGPT / Product Architect：建立 Source of Truth
  ↓
PRODUCT_VISION / PRD / SRS / ARCHITECTURE / SDD / FEATURE SPEC
  ↓
SPEC GATE
  ↓
Claude / UX Designer：受約束的 UI/UX 設計
  ↓
UX CONTRACT / SCREEN SPEC / DESIGN TOKENS
  ↓
DESIGN GATE
  ↓
Codex / Implementer：受約束的實作
  ↓
CODE / TEST
  ↓
IMPLEMENTATION GATE
  ↓
PR / Review / Merge
  ↓
Living Spec Update
```

## State 與 Delta

- `docs/02_product/PRODUCT_VISION.md`、`docs/02_product/PRD.md`、`docs/03_requirements/SRS.md`、`docs/04_system/ARCHITECTURE.md`、`docs/04_system/SDD.md`、`specs/<feature>/spec.md` 描述系統應該是什麼。
- `work-items/<WORK-ITEM-ID>.md` 描述這一次要改什麼。
- Work item 不應重複整份規格，只引用相關 State 文件與版本。

## 交接規則

- ChatGPT / Product Architect 產出或更新規格，不直接產出未授權 UI 或 code。
- Claude / UX Designer 只能在既定規格內設計，不得改需求、角色、權限、API 或資料模型。
- Codex / Implementer 只能依 Feature Spec 與 Design Contract 實作，不得重設計或新增未授權能力。
- 任何角色發現規格不足，應提出 Change Request，而不是自行補完。

## Design Source Intake

設計來源不限於 Figma，也可能來自 Claude design output、HTML prototype、v0 output、static mockup 或其他可視化原型。

```text
Figma / Claude Design / HTML Prototype
  ↓
Design Source Map
  ↓
Screen Spec / UX Contract
  ↓
Design Gate
  ↓
Codex Implementation
```

規則：

- Raw design source 不能直接成為 Source of Truth。
- Raw design source 不得覆蓋 canonical Product Vision、PRD、SRS、Architecture、SDD 或 Feature Spec。
- Claude design output 與 HTML prototype 只能作為 design input、visual reference 或 implementation reference。
- 交給 Codex 實作前，必須先登錄於 `design/<feature>/Design_Source_Map.md`，並轉成 `design/<feature>/screens/<SCREEN-ID>.md` 或其他明確 Design Contract。
- 若 design source 包含未授權功能、API、欄位、角色、權限或流程，必須提出 Change Request。

## Canonical Spec Update

- Human approval、Accepted ADR 與 Approved Change Request 都必須寫回 canonical spec，才可供下游 Agent 執行。
- Change Request 不得取代正式規格；其狀態與寫回流程依 `.ai/AUTHORITY.md`。
- 發現上下層規格衝突時，停止受影響工作並回報 `SPEC CONFLICT`。
