# Contributing

## Branching & Workflow Guidelines

### Trunk-Based Development (TBD)

All code contributions MUST follow **Trunk-Based Development** practices.  
This applies to every bounded context/module in the modular monolith and to all teams contributing.

- **Main branch is the source of truth**  
  - All changes must be integrated into `main` frequently.  
  - Avoid long-lived branches (`develop`, `release/*`, `hotfix/*`) — they are not allowed.  

- **Short-lived feature branches**  
  - Create a branch from `main` for each feature, bugfix, or spike.  
  - Keep branches alive for **no more than a few days**.  
  - Rebase frequently to stay aligned with `main`.  

- **Merging**  
  - All merges must go back to `main` via **Pull Request (PR)** with automated checks (CI tests, lint, type checks).  
  - Prefer **squash merges** for clarity and to keep history clean.  

- **Releases**  
  - Releases are cut directly from `main` using **tags**.  
  - No release branches are permitted.  

- **Hotfixes**  
  - Fixes go directly into `main` (with a tag if urgent).  
  - Rollback is done via `git revert` or by redeploying a prior tag.  

- **Feature Flags**  
  - Incomplete features should be protected behind flags/configs.  
  - This allows merging early and often, without breaking production.  

> 🚫 **Do not use Git Flow.**  
> 🚫 **Do not maintain `develop`, `release/*`, or `hotfix/*` branches.**  
> ✅ **Always integrate early, always integrate often.**

## Branch Naming Convention

All new branches must follow this pattern:

### With ticket ID e.g. JIRA or Github project tasks
- `feature/<ticket-id>-<short-description>`
- `hotfix/<ticket-id>-<short-description>`

#### Examples
- `feature/123-add-login-endpoint`
- `hotfix/789-update-ssl-config`

### Without a ticket ID
- `feature/<short-description>`
- `hotfix/<short-description>`

#### Examples
- `feature/add-login-endpoint`
- `hotfix/update-ssl-config`