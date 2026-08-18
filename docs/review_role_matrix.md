# Review Routing Compatibility View

Status：Compatibility / Navigation Only

本文件不定義 required review、Reviewer authority 或 Gate criteria。Canonical routing 位於：

- `templates/Work_Item.md`
- `.ai/WORKFLOW.md`
- `.ai/HARNESS_CONTRACT.md`
- `.ai/roles/reviewer.md`
- `.ai/roles/reviewer-profiles/**`
- `.ai/gates/**`

## Canonical Navigation

| Review Subject | Top-Level Role | Primary Reviewer Profile | Canonical Gate | Requirement Rule |
|---|---|---|---|---|
| Specification / PRD / SRS / Architecture / SDD / Feature Spec | `REVIEWER` | `SPEC_REVIEWER` | `SPEC_GATE` | Required for canonical specification review |
| Design / UX Contract / Screen Spec | `REVIEWER` | `UX_REVIEWER` | `DESIGN_GATE` | Required for canonical design review |
| Implementation / code / migration | `REVIEWER` | `TECH_REVIEWER` | `IMPLEMENTATION_GATE` | Required for implementation review |
| Test coverage / acceptance / regression evidence | `REVIEWER` | `QA_REVIEWER` | Artifact phase Gate | Conditional，依 Risk與 artifact type計算 |
| Security boundary / auth / credential / sensitive data | `REVIEWER` | `SECURITY_REVIEWER` | Artifact phase Gate | Conditional，依 Risk與 security triggers計算 |
| Delivery candidate aggregate evidence | `REVIEWER` | `DELIVERY_ASSURANCE_REVIEWER` | `DELIVERY_ASSURANCE_GATE` | Release前 required |

實際 required Reviewer set 由 Orchestrator / Harness依 canonical Risk policy、artifact type與 changed scope產生。Agent不得從本表自行選 Reviewer、降低 Risk或跳過 review。

## Legacy Professional References

`agent_roles/**` 可以協助理解專業觀點，但：

- 不得決定 required reviews。
- 不得取代 Reviewer Profile。
- 不得成為 Gate或Authority來源。
- 不得要求固定召集 PO、PM、SA、CTO、QA、Security等一整組 Agent。

若本 compatibility view與 canonical governance不同，以 canonical governance為準並回報文件漂移。
