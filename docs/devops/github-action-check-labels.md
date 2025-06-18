# 🚦 Check Labels

This GitHub Action ensures that a pull request contains at least one of the required labels. It is designed to enforce label usage for better workflow visibility and automation.

## ✅ Features

- Verifies presence of at least one required label on pull requests
- Fails the workflow if none are found
- Lightweight: implemented using a composite action with `github-script`
- Easy to customize with your own label set

## 📦 Usage

Include this action in a workflow step:

```yaml
- name: Check for required labels
  uses: ./.github/actions/check-labels
  with:
    required-labels: backend, devops, frontend, infrastructure
```
