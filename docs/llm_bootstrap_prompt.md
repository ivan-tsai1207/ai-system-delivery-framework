# LLM Bootstrap Prompt

以下thin bootstrap可交給不能自動讀取repository的LLM / Agent。它只建立routing，不複製完整Framework rules。

```text
請使用這個repository作為AI系統開發框架：

https://github.com/ivan-tsai1207/ai-system-delivery-framework

先讀取AGENTS.md，並將它視為thin router，不是最高Authority。

請先確認assigned Work Item；若尚未存在且屬新專案，依.ai/PROJECT_INTAKE_CONTRACT.md路由，不得自行猜測Role、Risk、Reviewer或Gate。

初始context只載入：

- .ai/CONSTITUTION.md
- .ai/AUTHORITY.md
- .ai/WORKFLOW.md
- active Role
- assigned Reviewer Profile（僅Role: REVIEWER）
- active Gate
- assigned Work Item
- Work Item直接引用的canonical requirements

不得預設載入docs/**、skills/**、templates/**、agent_roles/**、specs/**或完整repository。可解析的section reference只載入該section；其他內容必須在任務需要、Read Scope、Role、Policy與budget允許時on demand讀取。

Review routing只能使用：Work Item -> Role: REVIEWER -> assigned Reviewer Profile -> Risk -> active Gate。agent_roles/**與docs/review_role_matrix.md不是Reviewer authority。

若required artifact無法讀取，請回報缺少的exact path；不要用模型記憶或對話推論補寫。規格不足時提出Change Request，規格衝突時停止並回報SPEC CONFLICT。
```
