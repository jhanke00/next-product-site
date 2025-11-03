# Trivy Infrastructure Scan

## Overview

Infrastructure security scanning is handled by [Trivy](https://aquasecurity.github.io/trivy/), scanning both vulnerabilities and secrets across the repository. The scan runs automatically via the `Infrastructure Scan` GitHub Actions workflow and can also be triggered locally using the helper script under `infra/security/trivy`.

## GitHub Actions Workflow

- **Workflow file**: `.github/workflows/trivy-scan.yml`
- **Triggers**: `push`, `pull_request`, and manual `workflow_dispatch`
- **Behaviour**:
  1. Checks out the repository.
  2. Restores a cache for Trivy databases to speed up subsequent runs.
  3. Executes `aquasecurity/trivy-action` against the repository working tree with the `vuln` and `secret` scanners enabled.
  4. Fails the job if any `HIGH` or `CRITICAL` findings are detected.

## Local Execution

To mirror the workflow locally, ensure Trivy is installed (see the official installation guide) and run the helper script:

```bash
cd infra/security/trivy
chmod +x scan.sh  # First run only
./scan.sh
```

The script exits with a non-zero status if high or critical issues are discovered, matching the behaviour in CI.

## Next Steps

- Extend the scan to include container images produced by the Docker build workflow.
- Add allowlists for known false positives when required, keeping the workflow signal strong.
