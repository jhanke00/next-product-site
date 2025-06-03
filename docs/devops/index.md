# DevOps

Documentation on any DevOps changes made.

## 1 - Setting a single source of truth for Node/pnpm version and updating it

- Since currently configured Node version is deprecated and no longer supported with even maintenance updates, I updated Node to 22 LTS and set them on package.json.
- I updated the pnpm and its lockfile version to pnpm@10 because previous value of pnpm version range includes versions that are incompatible with each other in terms of reading pnpm-lock.yaml files. By adding a `packageManager` config on package.json to set pnpm to a fixed version with a sha checksum, fixed it to a specific version as a best pratice for CI pipelines.
- I removed special version settings on Github workflows because our tool installation actions (for Node and pnpm) should use our package.json versions. Having separate version configurations there is more error prone than having a central version configuration that our developers are going to use for development. Our pipelines and developers should rely on the same versions.
