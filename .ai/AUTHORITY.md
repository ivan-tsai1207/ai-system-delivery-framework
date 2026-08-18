# Authority Hierarchy

本文件定義規格衝突時的優先順序。低層級文件或 Agent 假設不得覆蓋高層級文件。

## 權威順序

```text
1. .ai/CONSTITUTION.md
2. docs/PRODUCT_VISION.md
3. docs/PRD.md
4. docs/ARCHITECTURE.md / docs/SDD.md
5. specs/{feature}/spec.md
6. design/**
7. work-items/**
8. User prompt / chat instruction
9. Agent assumption
```

## 衝突處理

- 若低層級文件違反高層級文件，判定為 Gate Failed。
- 若使用者在對話中要求覆蓋已存在規格，必須先詢問是否更新對應 repo 文件。
- 若規格之間互相矛盾，Agent 不得自行選邊，需整理衝突與建議修正。

## 範例

```text
PRD：只有 Admin 可以刪除商品。
design/screens/SCR-INV-001.md：Warehouse Staff 有 Delete Button。
```

判定：

```text
DESIGN GATE FAILED
原因：Design violates permission requirement.
```
