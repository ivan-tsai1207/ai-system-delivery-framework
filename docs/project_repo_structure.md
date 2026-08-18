# 專案 Repo Canonical Structure

本文件描述由 Framework 建立的實際專案 repo 結構。Framework repo 本身只保存治理文件、skills 與 templates，不建立下列專案實例文件。

```text
.ai/
  CONSTITUTION.md
  AUTHORITY.md
  WORKFLOW.md
  HARNESS_CONTRACT.md
  roles/
    product-architect.md
    ux-designer.md
    implementer.md
    reviewer.md
    reviewer-profiles/
      spec-reviewer.md
      ux-reviewer.md
      tech-reviewer.md
      qa-reviewer.md
      security-reviewer.md
      delivery-assurance-reviewer.md
  gates/
    spec-gate.md
    design-gate.md
    implementation-gate.md
    delivery-assurance-gate.md
    release-gate.md
docs/
  00_index.md
  01_sources/
  02_product/
    PRODUCT_VISION.md
    PRD.md
  03_requirements/
    SRS.md
  04_system/
    ARCHITECTURE.md
    SDD.md
    backend_architecture.md
    cloud_architecture.md
    data_model.md
    api_spec.md
  05_decisions/
    ADR-0001.md
  06_risks/
    risks.md
  07_open_questions/
    open_questions.md
  08_agent_reviews/
    review_log.md
    delivery-candidates/
      <DELIVERY-ID>.json
  09_session_logs/
    YYYY-MM-DD-session.md
specs/
  <feature>/
    spec.md
design/
  DESIGN_SYSTEM.md
  design-tokens.json
  COMPONENT_CATALOG.md
  <feature>/
    Design_Source_Map.md
    screens/
      <SCREEN-ID>.md
    flows/
    references/
work-items/
  <WORK-ITEM-ID>.md
traceability/
  traceability.yaml
README.md
AGENTS.md
```

## Canonical Paths

以下是正式且唯一的專案規格路徑：

```text
docs/02_product/PRODUCT_VISION.md
docs/02_product/PRD.md
docs/03_requirements/SRS.md
docs/04_system/ARCHITECTURE.md
docs/04_system/SDD.md
docs/05_decisions/ADR-*.md
specs/<feature>/spec.md
design/<feature>/Design_Source_Map.md
design/<feature>/screens/<SCREEN-ID>.md
work-items/<WORK-ITEM-ID>.md
```

Canonical review / assurance evidence paths：

```text
docs/08_agent_reviews/review_log.md
docs/08_agent_reviews/delivery-candidates/<DELIVERY-ID>.json
```

Review evidence與 delivery candidate manifest是 audit / assurance evidence，不是 Product Specification Source of Truth。Artifact hash改變時必須產生新 evidence，不得覆寫歷史結果。

舊的扁平規格路徑已 deprecated，禁止作為 canonical project path。若既有專案仍使用舊路徑，需透過明確 migration 更新引用，不得讓新舊路徑同時競爭權威。
