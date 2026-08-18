# github-project-sync

## 觸發條件

- 已核准的 Project Proposal 需要建立 GitHub Project Repo。
- 文件或功能完成後 commit / push。
- 需要建立 branch、PR 或同步 GitHub 時。

## Repository Provisioning

- Repo creation 必須符合 `.ai/PROJECT_INTAKE_CONTRACT.md`，且已有明確 `APPROVE_PROJECT`。
- 建立前驗證已核准的 owner、repository name 與 visibility；新 repo 預設為 private。
- Framework Repo 與 Project Repo 必須分離，並依 Project Bootstrap Manifest 初始化必要內容。
- Repo Provisioner 可在核准後建立並 push 一次 initial bootstrap commit，以建立 `main`、`develop` 與初始 canonical structure。
- Bootstrap 完成後，此例外立即失效。

## 一般 Git Strategy

- 一般 Agent 不直接修改 `main` 或 `develop`。
- 從最新 `develop` 建立 work branch。
- Work branch 完成後透過 PR merge 回 `develop`。
- Release 需取得核准後，才能由 `develop` merge / release 到 `main`。
- Push 或建立 PR 前同步 target branch，並執行 repository 定義的必要檢查。
- PR 內容需包含概要、更新內容、影響範圍、測試結果、風險與注意事項。

```text
develop
→ work branch
→ PR
→ develop
→ release approval
→ main
```

本 skill 不建立第二套 Git strategy；framework repo 的維護例外與高風險確認仍依 repository-level `AGENTS.md` 及較高層級治理規則。
