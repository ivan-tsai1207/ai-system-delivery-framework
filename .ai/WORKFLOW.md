# Agentic SDLC Workflow

本文件定義 ChatGPT、Claude、Codex 與其他 Agent 的交接流程，避免 Intent Debt 與 Context Drift。

## 標準流程

```text
使用者原始需求
  ↓
ChatGPT / Product Architect：建立 Source of Truth
  ↓
PRODUCT_VISION / PRD / ARCHITECTURE / FEATURE SPEC
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

- `docs/PRD.md`、`docs/ARCHITECTURE.md`、`docs/SDD.md`、`specs/{feature}/spec.md` 描述系統應該是什麼。
- `work-items/*.md` 描述這一次要改什麼。
- Work item 不應重複整份規格，只引用相關 State 文件與版本。

## 交接規則

- ChatGPT / Product Architect 產出或更新規格，不直接產出未授權 UI 或 code。
- Claude / UX Designer 只能在既定規格內設計，不得改需求、角色、權限、API 或資料模型。
- Codex / Implementer 只能依 Feature Spec 與 Design Contract 實作，不得重設計或新增未授權能力。
- 任何角色發現規格不足，應提出 Change Request，而不是自行補完。
