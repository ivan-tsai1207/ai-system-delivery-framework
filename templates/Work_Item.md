# Work Item Contract

Canonical path：`work-items/<WORK-ITEM-ID>.md`

本文件是唯一 canonical Work Item schema 與生成模板。其他治理、Harness、architecture、skill 或 adapter 只能引用本文件，不得複製或建立第二套 Work Item schema。

Work Item 是 system-generated internal execution contract。Project Intake、Product Architect 或 Orchestrator 依 approved canonical specs 自動產生；正常使用者不需要手動建立 Work Item、知道 Work Item ID、指定 Role / Phase、填寫 boundary 或準備 Harness Execution Profile。

Work Item 只定義單次 task 的 delta、context 與 execution boundary，不得取代或修改 PRD、SRS、Architecture、SDD、Feature Spec、Screen Spec 或 Accepted ADR。

## Canonical Enums

### Role Enum

```text
PRODUCT_ARCHITECT
UX_DESIGNER
IMPLEMENTER
REVIEWER
```

### Phase Enum

```text
SPEC
DESIGN
IMPLEMENTATION
REVIEW
RELEASE
```

### Status Enum

```text
TODO
IN_PROGRESS
BLOCKED
REVIEW
DONE
CANCELLED
```

Work Item Status 與 `.ai/HARNESS_CONTRACT.md` 的 execution lifecycle 是不同狀態機。其他 artifact-specific Status，例如 ADR 或 Screen Spec Status，也不得當作 Work Item Status。

## Phase to Default Gate

Canonical Gate Registry：

| Gate ID | Governance Source |
|---|---|
| `SPEC_GATE` | `.ai/gates/spec-gate.md` |
| `DESIGN_GATE` | `.ai/gates/design-gate.md` |
| `IMPLEMENTATION_GATE` | `.ai/gates/implementation-gate.md` |
| `RELEASE_GATE` | `.ai/gates/release-gate.md` |

| Phase | Default Required Gate |
|---|---|
| `SPEC` | `SPEC_GATE` |
| `DESIGN` | `DESIGN_GATE` |
| `IMPLEMENTATION` | `IMPLEMENTATION_GATE` |
| `REVIEW` | 依被審查 artifact 所屬 phase 明確列出 canonical Gate ID |
| `RELEASE` | `RELEASE_GATE` |

Work Item 可以要求額外 Gate，但不能移除 Governance 或 Workflow 強制要求的 Gate。`REVIEW` 不得由 Harness 猜測 artifact phase；Work Item 必須在 Requirement References 指向被審查 artifact，並在 Required Gates 明列對應 Gate ID。

## Metadata

| Field | Value |
|---|---|
| ID | `<WORK-ITEM-ID>` |
| Title | `<concise task title>` |
| Role | `<PRODUCT_ARCHITECT \| UX_DESIGNER \| IMPLEMENTER \| REVIEWER>` |
| Feature | `<feature-slug>` |
| Phase | `<SPEC \| DESIGN \| IMPLEMENTATION \| REVIEW \| RELEASE>` |
| Status | `<TODO \| IN_PROGRESS \| BLOCKED \| REVIEW \| DONE \| CANCELLED>` |
| Spec Version | `<version-or-N/A>` |
| Design Version | `<version-or-N/A>` |

`Feature` 必須是明確、非空的 canonical feature identifier。Project-wide task 使用專案定義的明確 identifier，不得由 Harness 自行填補。版本欄位不適用時填 `N/A`，不得刪除欄位。

## Objective

<!-- 用一句到數句描述這個 task 要達成的可驗證結果。 -->

## Requirement References

只列與本 task 有直接關係且可解析的引用：

- Requirement IDs：
- Feature Spec：
- Screen IDs / Screen Specs：
- ADR：
- Architecture / SDD sections：

## Read Scope

<!-- Task-specific read context。只能縮小 active role 的 read boundary，不能擴張。 -->

-

## Write Scope

<!-- Effective write = Active Role Permission ∩ Work Item Write Scope。 -->

-

## Forbidden Scope

<!-- 明列禁止修改的 path / artifact。Forbidden 永遠優先於 Write Scope。 -->

-

## Scope

<!-- 本次必須完成的內容。 -->

-

## Out of Scope

<!-- 本次不得自行處理的內容。 -->

-

## Acceptance Criteria

每一條都必須使用可追蹤 ID：

- [ ] `AC-<WORK-ITEM-ID>-001`：
- [ ] `AC-<WORK-ITEM-ID>-002`：

## Required Gates

只使用下列 canonical Gate ID，並依 phase 與 Governance 要求保留所有 mandatory gates：

- `<SPEC_GATE | DESIGN_GATE | IMPLEMENTATION_GATE | RELEASE_GATE>`

## Dependencies

可引用相關 Work Item、Feature Spec、Screen Spec、ADR 或 external dependency：

-

## Blockers

記錄目前已知阻擋因素；沒有時明確填 `None`：

-

## Notes

-

## Validation Rules

Work Item 在交給 Harness 前必須通過：

1. `ID` required，且 filename 必須等於 `<ID>.md`。
2. `Title` required。
3. `Role` required，且必須符合本文件 Role Enum。
4. `Feature` required；Harness 不得從 ID、Title、filename、directory 或 Agent assumption 推導。
5. `Phase` required，且必須符合本文件 Phase Enum。
6. `Status` required，且必須符合本文件 Status Enum。
7. `Spec Version` 與 `Design Version` 欄位 required；不適用時明確填 `N/A`。
8. Requirement References 必須可解析，且只包含本 task 的直接依賴。
9. Read Scope 不得超過 active role read boundary。
10. Write Scope 不得超過 active role write boundary；effective write 取兩者交集。
11. Forbidden Scope 永遠優先於 Write Scope，衝突 path 必須拒絕 write。
12. Required Gate 必須是 canonical Gate ID，且可解析至 `.ai/gates/**` 中對應 gate 文件。
13. `DESIGN` 必須可追溯至相關 Feature Spec。
14. `IMPLEMENTATION` 若有 UI dependency，必須引用相關 Screen Spec / Screen ID，且 `Design Version` 不得為 `N/A`。
15. `REVIEW` 必須引用被審查 artifact，並依其 phase 明列 Required Gate。
16. `RELEASE` 必須包含 `RELEASE_GATE`。
17. Status 變更為 `DONE` 前，所有 Acceptance Criteria 必須完成。
18. Status 變更為 `DONE` 前，所有 Required Gates 必須通過並保留 evidence。

Harness 不得從 Work Item ID prefix、Title、filename、directory 或 Agent assumption 猜測 `Role`、`Feature` 或 `Phase`。任一 required metadata 缺失或 enum 無效時，必須 fail closed。
