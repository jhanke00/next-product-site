# DevOps

Documentation on any DevOps changes made.

## DevOps Label Check Workflow

### Overview

This workflow verifies that a pull request (PR) includes at least one of the required labels.

### Implementation

- **Trigger**: The workflow runs on `pull_request` events, including when a PR is opened, synchronized, or labeled, specifically on the `main` branch.

- **Steps**:
  1. **Checkout Code**: Retrieves the code from the repository to perform checks.
  2. **Validate Required Labels**:
     - Extracts the labels from the PR.
     - Checks if any of the following required labels are present: `Feature request`, `Infrastructure`, `Backend`, `Frontend`, `DevOps`.
     - If a required label is found, the workflow passes.
     - If none of the required labels are present, the workflow fails with an error message.

### Purpose

Ensures that PRs contain relevant labels to maintain proper categorization and workflow management.
