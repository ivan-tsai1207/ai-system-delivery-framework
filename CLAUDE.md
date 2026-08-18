# CLAUDE.md

本文件只處理 Claude / Claude Code 的 bootstrap routing。共用規則以 `AGENTS.md` 與 canonical governance 為準，本文件不複製完整 Workflow、Git、Role 或 Review policy。

## Claude Bootstrap

1. 以 `AGENTS.md` 作為 thin router；若環境不會自動載入，先讀取它。
2. 從 assigned Work Item 解析 active Role、Risk、Required Gates 與 review binding。
3. 依 `AGENTS.md` 載入最小 Tier 1 context；`Role: REVIEWER` 時只載入被指派的 Reviewer Profile。
4. Skills、templates、其他 specs、source 與 tests 只在任務確實需要且位於 Read Scope 時 on demand 載入。

正常 review workflow 不得預設讀取 `agent_roles/**` 或 `docs/review_role_matrix.md`。Review routing只能是：

```text
Work Item
-> Role: REVIEWER
-> assigned Reviewer Profile
-> Risk Class
-> active Gate
```

`agent_roles/**` 只是非 canonical professional reference，不決定 required review、Reviewer Profile 或 Gate。

## Claude Adapter Boundary

- Claude adapter 不得以 prompt、memory、project knowledge 或 tool capability 擴張 canonical Role、Read / Write Scope、Risk、Gate 或 permission。
- 不得預設將 `.ai/**`、`docs/**`、`skills/**`、`templates/**` 或完整 repository 加入 project knowledge。
- 額外 context 必須通過 Role、Work Item Read Scope、Policy 與 Context Budget，並記錄載入原因。
- 若無法讀取 required canonical artifact，停止並回報缺少的 path；不得以模型記憶補寫規則。
- 若環境無法直接讀取 repository，可用 `docs/llm_bootstrap_prompt.md` 建立連線入口，但後續仍依 assigned Work Item 精準載入 context。
