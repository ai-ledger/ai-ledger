# AI Ledger Entry

- id: AILE-20260302-ledger-storage
- title: Store AI Ledger logs outside the active branch history
- date: 2026-03-02
- contract: .ai-ledger/contracts/2026-03-02-ledger-storage-outside-user-branch.contract.yaml

## Intent summary
Add detached git-branch storage for contracts and entries so ledger records remain append-only without polluting user branches.

## Actual changes
Implemented a new storage abstraction in the CLI with two modes: `git-branch` and `workspace`. Default behavior in git repositories now writes contracts/entries into a dedicated ledger branch (`ai-ledger/log/v1`) via a managed worktree under `.git/.ai-ledger-log`, and commits records there. Updated docs/spec to describe the strategy and configuration.

## Files changed
- packages/cli/src/index.ts
- packages/cli/README.md
- README.md
- spec/v0.1.md
- .ai-ledger/contracts/2026-03-02-ledger-storage-outside-user-branch.contract.yaml
- .ai-ledger/entries/2026-03-02-ledger-storage-outside-user-branch.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - "pnpm --filter @ai-ledger/cli build"
  - "node packages/cli/dist/index.js --help"
  - "smoke test in temporary git repo: init + new + check to verify logs committed to ai-ledger/log/v1"
- manual checks:
  - "Confirmed active branch does not receive new .ai-ledger/contracts or .ai-ledger/entries files during `ai-ledger new` in git-branch mode"

## Approval
- required: false
- approved_by: ""
- approved_at: ""
