# Changelog

All notable changes to this project will be documented in this file.

The format is inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), but kept intentionally lightweight.

## [Unreleased]

### Changed

- Updated repository docs (`README.md`, `AGENTS.md`) to reflect that this repository now uses detached ledger storage (`ai-ledger/log`) instead of workspace contracts/entries on active branches.
- Reworked README quick start to put CLI-first Node project setup before the manual workflow and clarified spec-document version (`v0.1`) vs package versions (`0.2.0`).
- Updated `.github/workflows/ai-ledger-basic.yml` to use `npx --yes @ai-ledger/cli@0.2.0 check` for non-interactive CI runs.
- Hardened `.github/workflows/publish.yml` to skip publishing a package when the exact version already exists on npm, preventing tag workflow failures from duplicate publishes.
- Bumped `@ai-ledger/spec` to `0.2.0` and synced `packages/spec/spec/v0.1.md` with `spec/v0.1.md`.

## [0.2.0] – 2026-03-06

### Added

- **Detached ledger storage (git-branch mode) in the CLI**  
  - `ai-ledger init` now prefers `git-branch` storage when run inside a git repository.  
  - Contracts and entries are written to a dedicated ledger branch (default: `ai-ledger/log`) via a worktree under `.git/.ai-ledger/worktree`.  
  - The active feature branch stays free of ledger-only commits.

- **Workspace → ledger-branch migration**  
  - On first run in a repo that already has `.ai-ledger/contracts/` and `.ai-ledger/entries/`, `init` migrates those files into the ledger worktree and commits them on the ledger branch.  
  - Successfully migrated files are deleted from the workspace, and empty `.ai-ledger/contracts` / `.ai-ledger/entries` directories are removed.  
  - Conflicting files (different content between workspace and ledger branch) are left in place and reported.

- **`.ai-ledger/README.md`**  
  - `init` creates or updates `.ai-ledger/README.md` to explain:
    - Whether the project is using workspace or git-branch storage.  
    - Which ledger branch is in use (e.g. `ai-ledger/log`).  
    - Where contracts/entries live vs where templates/config live.

- **Automatic CI workflow scaffolding and upgrade**  
  - If `.github/workflows/ai-ledger-basic.yml` does not exist, `init` creates a basic workflow that runs:

    ```yaml
    name: AI Ledger (basic)

    on:
      pull_request:

    jobs:
      basic:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
            with:
              fetch-depth: 0

          - name: AI Ledger check
            run: npx @ai-ledger/cli@0.2.0 check
    ```

  - If an existing `ai-ledger-basic.yml` matches the older pattern that diffed `.ai-ledger/contracts/` and `.ai-ledger/entries/` directly and printed  
    `AI Ledger: missing new contract and/or entry.`, `init` rewrites it to the CLI-based check so projects upgrading from 0.1.0 keep passing CI after migration.

- **CLI `check` behavior clarified**  
  - In workspace mode, `check` validates that `.ai-ledger/contracts/` and `.ai-ledger/entries/` exist and are non-empty in the working tree.  
  - In git-branch mode, `check` ensures the ledger worktree exists for the configured branch and that its `.ai-ledger/contracts/` and `.ai-ledger/entries/` are non-empty.

- **Pre-push hook for ledger branch**  
  - When using git-branch storage, `init` installs a `pre-push` hook that pushes the ledger branch (e.g. `ai-ledger/log`) to the same remote whenever you push any ref.  
  - Keeps the remote ledger in sync without requiring manual `git push origin ai-ledger/log`.  
  - Uses recursion protection (`--no-verify` + guard) for the internal ledger push.  
  - Installation is best-effort: if hooks cannot be updated (permissions/custom policy), `init` warns and continues.
  - If a custom `pre-push` hook already exists (without the AI Ledger marker), it is left unchanged.

- **Documentation updates**  
  - Root `README.md`, `packages/cli/README.md`, and `spec/v0.1.md` have been updated to describe:
    - Storage modes and migration behavior.  
    - The CLI-managed CI workflow.  
    - Expectations around pushing the ledger branch (e.g. `git push origin ai-ledger/log`).

### Notes

- A **pre-push hook** (installed by `init` when using git-branch storage) pushes the ledger branch to the same remote whenever you push.  
  You can also push it manually with `git push origin ai-ledger/log` if needed.

## [0.1.0] – Initial release

- Initial reference implementation of the AI Ledger spec.  
- Workspace-based `.ai-ledger/contracts/` and `.ai-ledger/entries/`.  
- Basic GitHub Actions workflow for this repository enforcing:
  - At least one new contract and one new entry per PR.  
  - Append-only behavior for `.ai-ledger/contracts/` and `.ai-ledger/entries/`.

