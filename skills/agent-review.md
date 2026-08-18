# agent-review

## 觸發條件

- 產出或更新 PRD / SRS / SDD。
- 產出或更新 API 文件、架構文件、資料模型、雲端架構等文件。

## 規則

- 依文件類型指定相關 Agent 審查。
- 若審查已包含於前述文件內，不重複產生額外審查文件。
- MVP 可做簡短審查。
- Standard / Formal 做完整審查紀錄。
- 有重大衝突時展開各 Agent 意見並統整方案。
- 審查紀錄保存於 `docs/08_agent_reviews/`，並使用 `templates/Agent_Review_Log.md`。
