# github-project-sync

## 觸發條件

- 新專案建立時，直接建立 GitHub private repo。
- 文件或功能完成後 commit / push。
- 需要建立 branch、PR 或同步 GitHub 時。

## 規則

- 不直接改 `main` 或 `develop`。
- 從 `develop` 建立工作 branch。
- push 前同步 `develop`。
- merge `main` 前必問。
- PR 內容需包含概要、更新內容、影響範圍、測試結果、風險與注意事項。

