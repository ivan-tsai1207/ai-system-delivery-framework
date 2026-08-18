# Role Accountability & Assurance Model

Status：Governance Design Proposal

Scope：AI System Delivery Framework

Canonical change state：Not Applied

## 1. Purpose

本文件設計 Role Accountability、Independent Review 與 Delivery Assurance 的完整責任模型，回答：

1. 每個 Agent Role 負責什麼，以及最低專業工作標準。
2. 哪些決策超出 Role 權限，必須停止或升級。
3. 每個產物完成時必須留下哪些可驗證 evidence。
4. 誰負責獨立 review、誰可以退件、誰可以判定 review pass。
5. 如何避免 Maker 自我核准及 Checker 修改後自行核准。
6. 如何依 artifact 與 risk 指派專業 Reviewer Profile。
7. 如何處理 cross-role finding、conflict 與責任退回。
8. Delivery Assurance 如何在 release 前獨立確認整體完整性。

本文件是 governance design proposal，不是新的 Governance Authority、Role Contract、Gate Registry 或 Work Item Contract。核准前不得把本文中的 profile、risk class、evidence field 或 assurance result 當成現行 Harness 必須接受的 canonical enum。

本文遵守：

- `.ai/CONSTITUTION.md`
- `.ai/AUTHORITY.md`
- `.ai/WORKFLOW.md`
- `.ai/HARNESS_CONTRACT.md`
- `.ai/PROJECT_INTAKE_CONTRACT.md`
- `.ai/roles/**`
- `.ai/gates/**`
- `templates/Work_Item.md`
- `docs/harness_implementation_architecture.md`
- `docs/harness_v0.1_SDD.md`

若本文與上述 canonical artifact 衝突，canonical artifact 優先，受影響設計必須停止並回報 `SPEC CONFLICT`。

## 2. Governance Principle

```text
Permission Boundary
!=
Professional Responsibility
```

Permission Boundary 回答「Role 可以讀、寫或呼叫什麼」；Professional Responsibility 回答「Role 必須完成哪些專業判斷、驗證與 evidence，產物才有資格交接」。

例如 `IMPLEMENTER` 可以寫入已授權的 `src/**`，只代表該 write 沒有越權，不代表功能已正確完成。完成仍須同時滿足：

```text
Role Boundary
→ Professional Responsibility Baseline
→ Maker Self Review
→ Independent Review
→ Specialist Review when required by risk
→ Final Delivery Assurance
→ Existing Release Decision
```

完成判定必須建立在 canonical spec、Acceptance Criteria、artifact hash、tests、findings 與 Gate evidence 上。Agent 自述、流暢說明、沒有越權或 process exit code 為零，都不能單獨證明工作完成。

本文區分三種 decision：

| Decision | Owner | Meaning |
|---|---|---|
| Review decision | Assigned Reviewer Profile | 對特定 artifact hash 的專業審查結論 |
| Gate result | 現有 Gate criteria 與 Gate Runner | 依 `.ai/gates/**` 對 phase 產生 canonical Gate result |
| Delivery / release decision | Delivery Assurer 與既有 human / Git policy | Assurance 完整性及正式 merge、release、production 決策 |

Reviewer Profile 的 `PASS / REQUEST_CHANGES / BLOCK` 是本 proposal 的 review evidence，不直接新增或取代現有 Gate 的 `Pass / Failed / Needs Clarification` semantics。

## 3. Separation of Duties

### 3.1 Responsibility Classes

| Class | Responsibility | May change reviewed artifact | May approve own production |
|---|---|---|---|
| Maker | 依 assigned Role 產生或修改 artifact，完成 self review | Yes, within Role and Work Item boundary | No |
| Checker | 依指定 Reviewer Profile，對 immutable artifact version 執行專業 review | No, in the checking execution | No |
| Assurer | 確認 required work、reviews、gates、evidence 與 findings 已完整閉合 | No | No |

### 3.2 Independence Rules

1. Maker execution ID 不得等於其 final Checker execution ID。
2. `PRODUCT_ARCHITECT` 不得 final approve 自己產出的 Spec review。
3. `UX_DESIGNER` 不得 final approve 自己產出的 Design review。
4. `IMPLEMENTER` 不得 final approve 自己產出的 Implementation review。
5. Checker 不得在同一 review execution 修改被審查 artifact。
6. Checker 若改以 Maker 身分修正 artifact，該 artifact revision 必須由另一個 eligible Checker review。
7. Checker 可在 owner 修正後重新 review，但只能對新 artifact hash 產生新 decision，不得沿用舊 PASS。
8. `DELIVERY_ASSURANCE_REVIEWER` 不得參與原始 artifact production，也不得直接修正 spec、design、code 或 tests。
9. Assurer 發現問題時建立 finding 並退回真正 owner，不得自行消除 evidence gap。
10. Human release approval 不得被 Maker、Checker 或 Assurer 的結論取代。

任何 role switching 都必須結束目前 execution，建立新的 role binding、context、policy 與 audit identity。更換 prompt label 不構成 separation of duties。

## 4. Top-Level Execution Roles

本 proposal 完整保留目前 canonical Work Item Role Enum：

```text
PRODUCT_ARCHITECT
UX_DESIGNER
IMPLEMENTER
REVIEWER
```

角色責任：

| Role | Maker / Checker use | Primary artifact |
|---|---|---|
| `PRODUCT_ARCHITECT` | Maker | Product / requirement / system specification |
| `UX_DESIGNER` | Maker | Design Contract、Screen Spec、design system artifact |
| `IMPLEMENTER` | Maker | Source code、tests、authorized engineering artifact |
| `REVIEWER` | Checker or Final Assurer | Review evidence、findings、assurance result |

Reviewer Profile 不得作為 Work Item `Role` 值。未來若模型核准，review Work Item 仍使用 `Role: REVIEWER`，再以獨立、明確且可驗證的 profile binding 指定專業審查責任。

## 5. Reviewer Profiles

Reviewer Profile 是 `REVIEWER` execution 的專業責任綁定，不是 top-level Role、vendor、model、Gate 或權限提升。

```text
SPEC_REVIEWER
UX_REVIEWER
TECH_REVIEWER
QA_REVIEWER
SECURITY_REVIEWER
DELIVERY_ASSURANCE_REVIEWER
```

Profile binding 原則：

- 一個 review execution 綁定一個 primary profile。
- 需要另一個 profile 時建立另一個 review assignment / execution。
- Profile 只能增加該次 review 的 required checks，不能擴張 `REVIEWER` filesystem、tool 或 command permission。
- Profile 由 Orchestrator / Harness 根據 artifact type、risk 與 policy 指派，不能由 Agent 自選。
- Profile 結果只對指定 artifact hash、spec reference、Work Item 與 review version 有效。
- `agent_roles/**` 可作為既有專業視角參考，但在正式 migration 前，不等同本 proposal 的 canonical Reviewer Profile。

### 5.1 Common Review Decision

```text
PASS
REQUEST_CHANGES
BLOCK
```

| Decision | Meaning |
|---|---|
| `PASS` | 本 profile 的 required checks 對受審 artifact hash 無未解阻擋問題 |
| `REQUEST_CHANGES` | 問題可由 owner 修正，修正後需要新 hash 與重新 review |
| `BLOCK` | 發現 authority、spec conflict、重大安全或必要 evidence 缺失， affected workflow 必須停止 |

Profile PASS 不等於 Gate Pass，也不等於 release approval。

## 6. Product Architect Professional Baseline

`PRODUCT_ARCHITECT` 在交付前至少完成：

| Area | Minimum professional work |
|---|---|
| Business | Business Goal、success intent、scope、Out of Scope |
| Users | User Roles、responsibility、Permission Model |
| Rules | Business Rules、validation、invariants |
| Flow | Main Flow、Exception Flow、failure / recovery path |
| System impact | Data、API、integration、security implications |
| Quality | Non-functional requirements 與可驗收限制 |
| Uncertainty | Open Questions、assumption / confirmed fact separation |
| Verification | Requirement IDs、Acceptance Criteria、traceability |

禁止：

- 把 assumption 寫成 confirmed requirement。
- 忽略 material exception flow 或 permission behavior。
- 將未確認需求交給 UX Designer 或 Implementer 自行決定。
- 以較新對話、raw source 或 Agent preference 覆蓋 canonical spec。
- 產出後自行 final approve `SPEC_REVIEWER` 結果。

Required Evidence：

- Requirement traceability reference。
- Open-question disposition，包含 unresolved owner / impact。
- Acceptance Criteria 清單與 coverage 說明。
- Spec self-review checklist 與 result。
- Changed artifact paths 與 artifact hashes。
- Known limitations、assumptions 與 conflicts。

## 7. UX Designer Professional Baseline

`UX_DESIGNER` 在交付前至少完成：

| Area | Minimum professional work |
|---|---|
| Context | User Role、Permission、User Task、Feature Spec traceability |
| Structure | Information Architecture、navigation、main workflow |
| States | Loading、Empty、Error、Permission Denied、Validation、Success / Failure feedback |
| Adaptation | Responsive behavior、input modality、content overflow |
| Inclusion | Accessibility、keyboard / focus、semantic behavior、contrast expectations |
| Consistency | Design tokens、component catalog、interaction consistency |
| Contract | Screen ID、action、state、API binding、Acceptance Criteria mapping |
| Scope | No unauthorized capability，raw source 不升格為 SOT |

禁止自行新增或修改 Business Rule、Role、Permission、API、Data Field、System Capability、Feature Scope 或未授權 Screen / Flow。

發現必要規格缺口時：

```text
SPEC_GAP
→ Change Request
→ PRODUCT_ARCHITECT / authorized owner
→ Canonical Spec Updated
→ new Design execution
```

Required Evidence：screen / flow traceability、state coverage、responsive / accessibility checklist、design source mapping、unauthorized-feature self-check、known limitations、artifact hashes。

## 8. Implementer Professional Baseline

`IMPLEMENTER` 在交付前至少完成：

1. 讀取 assigned Work Item、relevant Feature Spec、Architecture / SDD 與 UI dependency 的 Screen Spec。
2. 遵守 API / Data Contract、permission 與 backward-compatibility requirements。
3. 實作 input validation、error handling、security boundary、type safety 與必要 logging。
4. 建立與 Acceptance Criteria 對應的 tests，執行可用 typecheck、lint、unit、integration、build。
5. 檢查 changed files、diff scope、dead code、dependency、migration 與 configuration 影響。
6. 避免不必要 architecture divergence、duplicate abstraction 與明顯 technical debt。
7. 完成 self review 後才交接 review。

禁止：

- 未授權修改 business rule、DB schema、API contract、role、permission 或 UX behavior。
- 使用 `any`、ignore directive、空 catch、catch-all 或 disabled validation 掩蓋問題。
- 為讓測試通過而刪除有效 validation 或 security check。
- 把 TODO、placeholder、skipped required test 或 known failure 當作完成。
- 新增未授權 dependency 或繞過 policy / Gate。

Required Evidence：changed files、diff scope、spec / AC mapping、typecheck、lint、unit tests、integration tests、build result、security checks、known limitations、unresolved issues、artifact / commit hash。

不存在的 repo command 不得虛構為已執行；無法執行時必須記錄原因與影響。

## 9. Spec Reviewer

`SPEC_REVIEWER` 檢查 `PRODUCT_ARCHITECT` output：

- Completeness、internal consistency、ambiguity。
- Business Goal、scope、Out of Scope。
- Roles、permissions、business rules、validation。
- Main / exception / failure flows。
- Data、API、integration、security implications。
- Acceptance Criteria 的可驗收性與 coverage。
- Requirement IDs、cross-document traceability 與 version alignment。
- Open Questions 是否有 owner、impact 與 disposition。
- 是否把 assumption 當成 confirmed requirement。

可輸出 `PASS / REQUEST_CHANGES / BLOCK`。不得自行修改需求再批准。Requirement ownership 問題一律退回 `PRODUCT_ARCHITECT`；上層規格衝突輸出 blocking finding 與 `SPEC CONFLICT` evidence。

## 10. UX Reviewer

`UX_REVIEWER` 檢查：

- User task 與 workflow completeness。
- Loading、empty、error、permission-denied、validation、success / failure states。
- Responsive behavior、accessibility 與 content resilience。
- Information Architecture、design-system、component / token consistency。
- Screen / action / state 到 requirement 的 traceability。
- Design Source Map 與 canonical Screen Spec 的一致性。
- Permission visibility、API binding 與 Feature Spec alignment。

`Unauthorized Feature Detection` 是 mandatory check：任何未由 canonical spec 授權的 action、field、screen、role、permission、API 或 business behavior 必須形成 finding；不得因設計看起來合理而接受。

## 11. Tech Reviewer

`TECH_REVIEWER` 檢查：

- Architecture / SDD、API / Data Contract compliance。
- Correctness、type safety、error handling、observability。
- Code structure、maintainability、testability、dependency use。
- Performance / concurrency / resource risks。
- Backward compatibility、migration safety、configuration impact。
- Dead code、duplicate logic、unsafe shortcut 與 technical debt。
- Diff scope、unauthorized change 與 build evidence。

Tech Review 不取代 QA Review、Security Review、Gate 或 product requirement decision。Reviewer 發現需求本身有缺口時不得以 code-level solution 改寫需求。

## 12. QA Reviewer

`QA_REVIEWER` 以 requirement 與 executable evidence 檢查：

- Acceptance Criteria coverage。
- Normal、boundary、exception、negative cases。
- Regression、integration 與 state transition。
- Role / permission behavior。
- Error recovery、retry、idempotency where applicable。
- Test result 可重現性、failure interpretation 與 skipped test。
- Test scope 是否匹配 changed behavior 與 risk。

「Agent 表示測試已完成」不是 evidence。最低 evidence 是可定位的 command / runner、result、timestamp、commit / artifact hash，以及足以重現的 test reference。無法執行 required test 時必須形成 finding，不得轉寫成 PASS。

## 13. Security Reviewer

`SECURITY_REVIEWER` 依 risk trigger 檢查：

- Authentication、authorization、permission escalation。
- Data exposure、privacy、secret / credential handling。
- Input validation、injection、unsafe deserialization。
- Filesystem / repository boundary、path / symlink escape。
- Command execution、shell composition、subprocess isolation。
- Dependency / supply-chain risk。
- Environment filtering、credential leakage、audit integrity。
- External API、payment、production data 與 destructive operation。

Security Review 不是所有 task 的固定要求。只有 risk matrix 或 project policy 命中 Security trigger 時為 Required；其他情況可為 Optional advisory review。重大安全 finding 依既有 Governance 停止 affected work 並要求授權處理。

## 14. Delivery Assurance Reviewer

`DELIVERY_ASSURANCE_REVIEWER` 是 `REVIEWER` 的獨立最終把關 profile，不重新執行 PM、UX、coding、QA 或 Security 工作，而是驗證整體責任鏈：

1. Required Work Items 已完成且 identity / hash 可追溯。
2. 每個 Maker 已完成適用 Professional Baseline 與 Self Review。
3. Required Evidence 存在、可讀、hash 匹配。
4. Required Independent Reviews 已完成且 profile / artifact version 正確。
5. Required Gates 已通過且 evidence 對應同一 delivery candidate。
6. 沒有 unresolved blocking finding。
7. 沒有未處理 role violation、scope drift 或 unauthorized change。
8. Canonical specs、design contract、implementation 與 tests 一致。
9. 沒有 unresolved `SPEC_GAP` / `SPEC_CONFLICT`。
10. Accepted Risk 具有授權 human decision、scope、expiry / review condition。
11. Audit evidence 完整，artifact hash 與 candidate commit 一致。

只允許 `PASS / REQUEST_CHANGES / BLOCKED`。Assurer 不得直接修改 artifact、修 code、修 spec、補寫缺失 review evidence後自行批准，也不得取代 human release / production approval。

## 15. Review Matrix

`Required` 必須完成；`Conditional` 由 risk / trigger 計算；`Optional` 只提供 advisory evidence，缺少時不阻擋。

| Maker output | Primary Checker | Additional Checker | Assurance |
|---|---|---|---|
| Product / Feature / System Spec | `SPEC_REVIEWER` Required | `SECURITY_REVIEWER` Conditional | Delivery candidate 時 Required |
| UX Contract / Screen Spec | `UX_REVIEWER` Required | `SECURITY_REVIEWER` Conditional for auth、permission、sensitive data flow | Delivery candidate 時 Required |
| Source code / config | `TECH_REVIEWER` Required | `QA_REVIEWER` Conditional by behavior/risk；`SECURITY_REVIEWER` Conditional | Delivery candidate 時 Required |
| Tests only | `QA_REVIEWER` Required | `TECH_REVIEWER` Conditional when production code / test architecture affected | Delivery candidate 時 Required |
| Migration / auth / payment / external integration | `TECH_REVIEWER` Required | `QA_REVIEWER` + `SECURITY_REVIEWER` Required | Required |
| Non-semantic typo / formatting | Artifact-aligned profile using lightweight checklist | Others Optional | Only when included in delivery candidate |
| Release candidate aggregation | Applicable completed profile evidence | Missing risk-required profile blocks | `DELIVERY_ASSURANCE_REVIEWER` Required |

Review Matrix 不代表所有 task 都要六個 Reviewer。Orchestrator 先由 artifact type 選 primary profile，再以 risk trigger 增加 specialist profiles，最後只在 delivery candidate 進行一次 aggregate assurance。

## 16. Risk-Based Review

### 16.1 Risk Classes

| Risk | Typical examples | Minimum review rule |
|---|---|---|
| `LOW` | 非語意 typo、format、isolated documentation metadata | Artifact-aligned independent lightweight review；specialists Optional |
| `MEDIUM` | Normal feature、UI behavior、ordinary API implementation | Primary profile Required；behavioral implementation 加 QA Required |
| `HIGH` | Auth、permission、DB migration、payment、external API、sensitive data | Primary + QA + Security Required；Assurance Required |
| `CRITICAL` | Production data、credential、deployment、security boundary、destructive operation | Primary + QA + Security + Assurance Required；human external-side-effect / release decision Required |

### 16.2 Risk Computation

Risk 由 Orchestrator / Harness 依以下輸入計算，取最高適用等級：

```text
Project policy floor
max Artifact type baseline
max Changed path trigger
max Requirement / data classification trigger
max Operation / environment trigger
max Dependency / migration trigger
```

Agent 不得自行降低 risk。無法解析的 sensitive trigger 採 fail closed，至少標為 `HIGH` 並要求 clarification。Risk override 只能提高；降低需要 authorized human decision、理由與 audit evidence。

Security trigger 包含 auth、permission、secret、credential、PII、payment、external write、filesystem / command boundary、production environment 與 dependency trust change。QA trigger包含可觀察 behavior、state、integration、permission、migration 或 regression risk。

## 17. Self Review

每個 Maker 在 handoff 前必須完成 Self Review。Self Review 是品質輸入，不是 Independent Review，也沒有 Gate final approval 權。

最低 Self Review evidence：

- Role-specific checklist 與每項 result。
- Scope / changed-file verification。
- Tests / validation performed 及結果。
- Known limitations、assumptions、unresolved issues。
- Spec gap / conflict check。
- Artifact paths、hashes、commit reference。
- Maker identity、execution ID、timestamp。

Self Review 發現阻擋問題時，Work Item 保持 blocked / incomplete，不得藉由「已揭露」把 failure 轉成完成。

## 18. Required Evidence Model

概念型別如下；本次不建立 schema 或修改 Work Item：

```ts
type ReviewProfile =
  | "SPEC_REVIEWER"
  | "UX_REVIEWER"
  | "TECH_REVIEWER"
  | "QA_REVIEWER"
  | "SECURITY_REVIEWER"
  | "DELIVERY_ASSURANCE_REVIEWER";

interface RoleCompletionEvidence {
  evidence_id: string;
  role: "PRODUCT_ARCHITECT" | "UX_DESIGNER" | "IMPLEMENTER" | "REVIEWER";
  review_profile?: ReviewProfile;
  work_item: string;
  maker_execution_id?: string;
  reviewer_execution_id?: string;
  artifact: readonly string[];
  artifact_hash: readonly string[];
  spec_reference: readonly string[];
  checks_performed: readonly CheckResult[];
  tests_performed: readonly TestResult[];
  findings: readonly string[];
  known_limitations: readonly string[];
  result: "READY_FOR_REVIEW" | "PASS" | "REQUEST_CHANGES" | "BLOCK" | "BLOCKED";
  timestamp: string;
}
```

Implementer evidence 額外支援：`typecheck`、`lint`、`unit_tests`、`integration_tests`、`build_result`、`changed_files`、`diff_scope`、`commit`。

Evidence invariants：

- Evidence 由 Harness / trusted runner 收集或驗證，不能只接受 Agent claim。
- Artifact、spec、Gate definition、command result都需 content hash 或 immutable reference。
- Review evidence append-only；新 review supersede 舊結果但不覆寫歷史。
- Secret、credential、raw hidden reasoning 不得進入 evidence。
- Review 只對記錄的 artifact hash 有效；artifact 改變即需重新計算 affected review。

## 19. Finding Model

### 19.1 Severity

```text
BLOCKING
MAJOR
MINOR
OBSERVATION
```

| Severity | Effect |
|---|---|
| `BLOCKING` | Affected work / assurance 必須停止；未解時不得 PASS |
| `MAJOR` | 影響 correctness、scope、security、AC 或 maintainability；預設要求修正或 human accepted risk |
| `MINOR` | 不阻擋核心行為，但需處理、排程或明確 disposition |
| `OBSERVATION` | Advisory；不直接阻擋，保留改善脈絡 |

### 19.2 Finding Record

```ts
interface Finding {
  finding_id: string;
  reviewer: string;
  review_profile: ReviewProfile;
  owner_role: string;
  artifact: readonly string[];
  artifact_hash: readonly string[];
  requirement: readonly string[];
  description: string;
  severity: "BLOCKING" | "MAJOR" | "MINOR" | "OBSERVATION";
  evidence: readonly string[];
  required_action: string;
  status: "OPEN" | "RESOLVED" | "ACCEPTED_RISK" | "SUPERSEDED";
}
```

`RESOLVED` 必須引用 owner 修正 evidence 與 successful re-review。`ACCEPTED_RISK` 只能由 authorized human / policy owner決定，必須記錄 scope、理由與 review condition。`SUPERSEDED` 必須指向 replacement finding。刪除或隱藏 finding 不等於 resolved。

## 20. Responsibility Escalation

| Finding subject | Responsible owner | Required return path |
|---|---|---|
| Business requirement、scope、role、permission、rule | `PRODUCT_ARCHITECT` | Update canonical spec through authorized flow，then Spec re-review |
| UX flow、state、accessibility、design consistency | `UX_DESIGNER` | Update Design Contract，then UX re-review |
| Code、config、dependency、technical debt | `IMPLEMENTER` | New implementation revision，then Tech / affected reviews |
| Test coverage or failed behavior | `IMPLEMENTER` owns product correction；QA workflow owns verification adequacy | Correct code / tests，then QA re-review |
| Security weakness | `IMPLEMENTER` or relevant Maker fixes；`SECURITY_REVIEWER` verifies | Security re-review；重大問題保持 blocked |
| Missing review / audit / hash evidence | Orchestrator / evidence owner | Re-run or recover evidence；Assurer不得代填 |

Final Assurer 只 routing findings、驗證 closure 與作 assurance decision，不成為 artifact owner。

## 21. Cross-Role Conflict

當不同 Reviewer 結論衝突時，不採多數決，也不讓 Agent 自行協商改需求。

```text
CONFLICT
→ Freeze affected artifact hashes and work
→ Record each finding and evidence
→ Identify governing authority / canonical source
→ Classify conflict owner
→ Return to authorized owner
→ Update canonical artifact when approved
→ Re-run all invalidated reviews
```

範例：UX Reviewer認為 workflow 完整，Tech Reviewer認為現有 Architecture 無法支援。若 Architecture 是有效 canonical constraint，Design review 不得因 UX PASS 繼續；問題退回 `UX_DESIGNER` 或在真正需要改 Architecture 時由 `PRODUCT_ARCHITECT` / authorized decision flow處理。

任何上、下層規格衝突依 `.ai/AUTHORITY.md` 回報 `SPEC CONFLICT`。Assurer 不能選擇較方便的一方。

## 22. Final Assurance Entry Criteria

Delivery Assurance 只能在以下條件全部可證明時開始：

1. Delivery candidate commit / artifact set 已凍結並有 hash。
2. Required Work Items 已到達符合現行 Contract 的完成狀態。
3. Required Acceptance Criteria 已通過且 evidence 可定位。
4. Required Gates 已通過，結果綁定同一 artifact revision。
5. Risk calculation、required Reviewer Profiles 與 assignment evidence 存在。
6. Required profile reviews 已完成，Maker / Checker separation 可證明。
7. 無 `OPEN BLOCKING` finding。
8. `MAJOR` finding 已 resolved 或具有有效 accepted-risk decision。
9. 無 unresolved `SPEC_GAP`、`SPEC_CONFLICT` 或 unauthorized scope change。
10. Audit evidence 可讀，artifact hashes 與 reviewed versions 相符。

任一 required condition 缺失時不得 `PASS`。可修正的缺失回 `REQUEST_CHANGES`；authority conflict、重大安全問題或無法證明 artifact identity 時回 `BLOCKED`。

## 23. Final Assurance Output

概念型別：

```ts
interface DeliveryAssuranceResult {
  delivery_id: string;
  project: string;
  commit: string;
  reviewed_work_items: readonly string[];
  required_reviews: readonly ReviewRequirement[];
  completed_reviews: readonly ReviewEvidenceRef[];
  gate_results: readonly GateEvidenceRef[];
  open_findings: readonly string[];
  accepted_risks: readonly AcceptedRiskRef[];
  evidence_refs: readonly string[];
  result: "PASS" | "REQUEST_CHANGES" | "BLOCKED";
  reviewer: string;
  reviewer_execution_id: string;
  timestamp: string;
}
```

Result semantics：

- `PASS`：entry criteria 全部成立；只代表 assurance 完整，不自動 merge、release 或 deploy。
- `REQUEST_CHANGES`：owner 可修正的 artifact / evidence / review gap。
- `BLOCKED`：authority conflict、open blocking finding、重大安全問題或不可驗證 identity。

任何 candidate artifact、commit、required review policy 或 accepted risk 變更，都使舊 result失效並要求新的 assurance execution。

## 24. Delivery Assurance Gate Proposal

### 24.1 Options Considered

將 Assurance 嵌入 `IMPLEMENTATION_GATE` 會把 code correctness 與 cross-role delivery completeness 混在一起，且無法涵蓋 spec / design / review evidence。只依賴 `RELEASE_GATE` 又會讓「專業責任鏈是否完整」與 migration、environment、production approval 等 release readiness criteria 混合，獨立性與可重用 evidence 都不足。

新增獨立 Gate 的成本是 registry、Work Item、Workflow、Harness 與 migration 都需更新；若每個 task 都執行，也會造成 gate explosion。因此 Gate 應以 delivery candidate 為 aggregation boundary，內部依 risk 計算 profiles，而不是為每個 profile 新增 Gate。

### 24.2 Unique Recommendation

**唯一建議：模型核准後，新增 canonical `DELIVERY_ASSURANCE_GATE`，位置為 `IMPLEMENTATION_GATE → DELIVERY_ASSURANCE_GATE → RELEASE_GATE`。**

理由：

1. 它驗證的是 Maker / Checker / Assurer separation、review coverage、finding closure 與 evidence completeness，責任與既有四個 Gate 不重複。
2. 它為 release candidate 提供獨立、hash-bound 的 aggregate decision。
3. 它允許 `RELEASE_GATE` 專注 release readiness 與 human external-side-effect decision。
4. 單一 assurance Gate 搭配 risk-based profiles，可避免 profile-to-gate explosion。

本次不新增 Gate file、不修改 Gate Registry、不改 Phase mapping。正式採用前必須先完成第 29 節的 canonical changes 與 migration。

## 25. Harness Integration Design

未來 Harness 應新增以下設計責任，但本次不實作：

```text
Work Item + Artifact Type + Canonical Risk Policy + Changed Scope
→ Risk Classifier
→ Required Review Resolver
→ Review Assignment
→ Separate REVIEWER Executions
→ Evidence / Finding Store
→ Assurance Eligibility Check
→ Delivery Assurance Execution
```

強制規則：

- Required reviewers 由 trusted Orchestrator / Harness 計算，Agent 不得宣告「這次不需要 QA / Security」。
- Maker identity、execution、artifact hash 與 reviewer identity 必須可比對。
- Self-approval、same-execution review、missing profile、stale artifact review 一律 fail closed。
- Finding lifecycle 由 host-owned audit / state 管理，Agent 不能刪除或改寫 finding history。
- Gate Runner 只消費 approved canonical gate criteria；在 Gate Registry 更新前不得執行虛構 Assurance Gate。
- Final Assurance 只讀 candidate artifacts；write scope 只允許未來指定的 review / assurance evidence sink，不能包含受審 artifact。

Harness 不評估專業內容的真理本身；它強制 assignment、independence、required checks、evidence presence、hash binding 與 stop conditions。

## 26. Review Assignment

Review assignment 由 Orchestrator / Harness 產生，至少包含：

```text
assignment_id
work_item
artifact_type
artifact_paths
artifact_hashes
risk_class
review_profile
maker_identity
maker_execution_id
reviewer_identity
reviewer_execution_id
required_checks
required_evidence
due / expiry policy
```

Agent 不可選 Reviewer、降低 Risk、改 required checks 或跳過 Required Review。

### 26.1 Same Underlying Model Analysis

同一 underlying model 可在資源受限情況下分別擔任 Maker 與 Checker，但只能在下列最低條件成立時提供有限的 execution independence：

- 不同 execution ID、role binding、context package 與 audit record。
- Reviewer 只取得 canonical artifacts、Maker evidence 與必要 specs，不取得 Maker hidden assumptions 或未記錄 reasoning。
- Reviewer 使用 profile-specific checklist，不能沿用 Maker self-review result 作結論。
- Artifact hash固定，Reviewer read-only。
- Assignment 明確揭露相同 vendor / model，以供 risk / assurance 判斷。

同模型不同 execution 只能降低直接自我核准風險，不能消除 correlated failure。Risk policy 可要求更強 model diversity 或 human accepted risk。

## 27. Model Diversity

同一 vendor / model 的 Maker + Reviewer 可能共享理解盲點、訓練偏差、工具限制與錯誤模式。原則：

| Risk | Diversity posture |
|---|---|
| `LOW` | Separate execution / role binding 即為最低要求；model diversity Optional |
| `MEDIUM` | 優先不同 review execution configuration；有可用選項時使用 independent model |
| `HIGH` | 優先不同 model 或 vendor；無法做到時記錄 independence limitation 與補強 evidence |
| `CRITICAL` | 強烈優先 different model / vendor 或 authorized human specialist review；policy 可設為 mandatory |

Model diversity 不得取代 deterministic tests、security tooling、artifact hashes、hard gates、independent context 或 evidence。不同 vendor 同意同一錯誤，也不構成 correctness proof。

## 28. Human Role

Human 保留高價值與高風險決策：

- Business requirement / scope approval。
- Accepted Risk，尤其 MAJOR / security / compliance risk。
- High-risk external side effect。
- Merge to protected branch、release 與 production decision。
- Authority conflict 或 canonical spec change 的授權。

Framework 應以 traceability、automated checks、risk assignment、specialist reviews、Gate 與 Assurance summary降低 Human manual inspection。Human 不需逐檔重做 PM、UX、code、QA 與 security review。

「最後讓人全部重新看一次」不是品質模型；Human 應收到可定位的 unresolved findings、accepted risks、Gate status、evidence refs 與 decision scope。

## 29. Proposed Governance Changes

以下只是在本模型核准後的 migration proposal；本次全部未修改。

| Canonical artifact | Required change | Reason | Compatibility impact | Migration needed |
|---|---|---|---|---|
| `.ai/roles/product-architect.md` | 加入 Professional Baseline、Self Review、Required Evidence、禁止 self approval | 讓 spec Maker 的完成條件可驗證 | Additive responsibility；可能使舊 task evidence不足 | Yes：舊 active spec task需補 evidence或 grandfather policy |
| `.ai/roles/ux-designer.md` | 加入 state / accessibility / unauthorized-feature baseline與 evidence | 防止設計只滿足 write boundary | Additive | Yes for active design tasks |
| `.ai/roles/implementer.md` | 加入 engineering baseline、tests / diff evidence與 self review | 定義 code 完成標準 | Additive；可能提高 Done bar | Yes for active implementation tasks |
| `.ai/roles/reviewer.md` | 定義 profile binding、independence、review decision與 read-only rule | 讓 `REVIEWER` 可承載專業 Checker / Assurer | Additive但 runtime需要辨識 profile | Yes |
| `.ai/roles/reviewer-profiles/**` | 新增六個 profile checklist文件，由 reviewer role引用 | 避免新增 top-level Role Enum | New governed artifacts | Yes：Context Compiler / bootstrap manifest需納入 |
| `.ai/WORKFLOW.md` | 加入 Self Review、risk-based independent review、Assurance sequence | 固定跨 role handoff | Workflow behavior change | Yes：active workflow需版本 pin |
| `.ai/PROJECT_INTAKE_CONTRACT.md` | 將 `SPEC_REVIEW` 綁定獨立 `SPEC_REVIEWER` evidence | 防止初始規格由 Maker 自行放行 | Tightens lifecycle guard，不新增 state | Yes：in-flight intake需補 review或採明確 transition policy |
| `.ai/HARNESS_CONTRACT.md` | 增加 profile binding、risk resolver、separation、evidence / finding lifecycle | 讓 Harness 可 fail closed | Contract additive / runtime breaking if immediately required | Yes：schema + staged rollout |
| `templates/Work_Item.md` | 保留 Role Enum；為 REVIEW task設計 profile、risk、maker / artifact refs等 canonical fields | 不讓 Harness猜 Reviewer Profile | Schema version change | Yes：parser、generator、fixtures與舊 Work Item migration |
| `.ai/gates/spec-gate.md`、`design-gate.md`、`implementation-gate.md` | 分別要求適用的 Spec、UX、Tech / QA獨立 review evidence，並驗證 artifact hash | 讓現有 phase Gate真正消費 professional review | Tightens Gate criteria | Yes：active Gate run需依 policy版本處理 |
| `.ai/gates/delivery-assurance-gate.md` | 新增 aggregate assurance criteria | 建立獨立 final accountability checkpoint | New Gate | Yes：registry、phase / workflow mapping |
| `.ai/gates/release-gate.md` | 將 Assurance Gate結果列為 release prerequisite | 保持 assurance與release decision分離 | Tightens release | Yes for in-flight releases |
| Gate Registry in `templates/Work_Item.md` | 加入 `DELIVERY_ASSURANCE_GATE` | 使 Work Item與Gate可解析 | Canonical enum / validation change | Yes |
| Evidence / Finding canonical schema | 新增 versioned Role Completion Evidence、Review Assignment、Finding、Assurance Result | 提供 machine-readable audit contract | New schema set | Yes：retention、hash、redaction policy |
| `docs/harness_implementation_architecture.md` | 加入 Review Assignment / Assurance component ownership | 對齊 Two-Plane architecture | Additive architecture update | Yes before runtime implementation |
| `docs/harness_v0.1_SDD.md` | 補上 module、interface、error、state、test與migration design | 讓工程實作可拆 task | SDD revision | Yes before implementation |

不建議修改 `.ai/AUTHORITY.md` 的 hierarchy 或四個 top-level Role Enum。Reviewer Profile 應從 `REVIEWER` role 派生，不能成為新的平行權威。

## 30. Validation

| Check | Result | Evidence in this proposal |
|---|---|---|
| 1. Permission 與 Professional Responsibility 分離 | PASS | Sections 2、6-8 |
| 2. Maker / Checker / Assurer 分離 | PASS | Section 3 |
| 3. Agent 不可 self approve | PASS | Sections 3、25-26 |
| 4. 每個 Maker 有 Professional Baseline | PASS | Sections 6-8 |
| 5. Reviewer 有明確 Profile | PASS | Sections 5、9-14 |
| 6. Review 有 risk-based assignment | PASS | Sections 15-16、25-27 |
| 7. QA / Security 非無條件套用所有 task | PASS | Sections 12-16 |
| 8. Final Assurance 是獨立角色責任 | PASS | Sections 3、14、22-24 |
| 9. Final Assurer 不修改被審查產物 | PASS | Sections 3、14、20、25 |
| 10. 以 evidence 而非 Agent claim 判斷 | PASS | Sections 17-19 |
| 11. Blocking finding 阻止 release | PASS | Sections 19、22-24 |
| 12. Human 不需逐項檢查 Agent | PASS | Section 28 |
| 13. 未修改 Authority | PASS | 本次只新增 proposal文件 |
| 14. 未修改 Role Enum | PASS | Section 4保留四個 canonical Role |
| 15. 未開始 runtime implementation | PASS | 無 source、schema、script、Action或runtime config變更 |

### Current Governance Conflict Assessment

未發現本 proposal 與目前 Governance 的直接衝突，因為 profile、risk class、evidence與Assurance Gate皆明確標示為尚未生效的設計。現況存在的是 governance capability gap：目前 `REVIEWER`、Gate與Work Item尚未定義 profile binding、separation of duties、risk-based assignment、finding lifecycle與final assurance。

在第 29 節 canonical changes 完成前，Harness 不得假裝上述能力已可被 machine-enforced，也不得產生 `DELIVERY_ASSURANCE_GATE` 作為現行 Required Gate。
