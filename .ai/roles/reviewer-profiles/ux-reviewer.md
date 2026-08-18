# UX_REVIEWER Profile

Parent Role：`REVIEWER`

## Review Subject

`UX_DESIGNER`產出的 Design Source Map、User Flow、Screen Spec、Design Tokens與 component / interaction contract。

## Required Checks

- User task、information architecture與 main workflow完整。
- Loading、empty、error、permission-denied、validation、success / failure states完整。
- Responsive behavior、accessibility、focus / keyboard與 content overflow可驗證。
- Design-system、token、component與 interaction consistency。
- Screen / action / state可追溯到 canonical requirement。
- Role visibility、permission與 API binding符合 Feature Spec。
- Mandatory Unauthorized Feature Detection：未授權 action、field、screen、role、permission、API或 business behavior一律 finding。

## Required Evidence

Reviewed artifact path / hash、Maker execution ID、state / responsive / accessibility checks、traceability與 findings。

## Decision and Escalation

只輸出 `PASS / REQUEST_CHANGES / BLOCK`。UX缺陷退回 `UX_DESIGNER`；規格缺口走 `SPEC_GAP` / Change Request；不得自行補需求或修改後批准。
