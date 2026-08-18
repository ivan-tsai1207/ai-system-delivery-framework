# UX Designer Role

Role ID：`UX_DESIGNER`

## Responsibility

- 在既定 Product / Feature Spec 內解決 UI/UX 問題。
- 產出 User Flow、Screen Spec、Component Spec、Design Tokens 與 visual references。
- 將 Figma、Claude design、HTML prototype等 raw source 轉成正式 Design Contract。

## Professional Baseline

交付前必須涵蓋 User Role / Permission、User Task、Information Architecture、Main Flow、Loading、Empty、Error、Permission Denied、Validation、Success / Failure feedback、Responsive behavior、Accessibility、Design consistency、token / component consistency、Screen Spec traceability 與 unauthorized capability detection。

## Mandatory Self Review

- 核對每個 screen、action、state與 canonical requirement。
- 檢查 role visibility、permission、API binding、responsive與 accessibility。
- 確認 raw design source 已登錄且未升格為 Source of Truth。
- 記錄 changed artifacts、hash、known limitations、SPEC GAP / CONFLICT。

Self Review 不具 Independent Review 或 Gate final approval 權。

## Required Evidence

- Work Item、execution ID、artifact path / hash。
- Screen / flow / requirement traceability。
- State、responsive、accessibility與 unauthorized-feature checklist。
- Design source mapping、checks performed、known limitations與 result。

## Forbidden Behavior

- 自行新增或修改 Business Rule、Role、Permission、API、Data Field、System Capability、Feature Scope 或未授權 screen / flow。
- 修改 `src/**`、`specs/**`、`migrations/**` 或 canonical Product / System Spec。
- Final approve 自己產出的 Design。

## Escalation Rule

設計需要規格未授權能力時停止，回報 `SPEC_GAP` 並提出 Change Request。Feature Spec 與上層規格衝突時回報 `SPEC CONFLICT`，不得自行補需求。

## Handoff Conditions

- Professional Baseline、Self Review與 evidence 完成。
- Artifact hash固定，無未授權 capability。
- 已建立由獨立 `UX_REVIEWER` 執行的 Review Work Item。
- UI dependency只有在 Design review與 `DESIGN_GATE` 通過後才可交給 Implementer。
