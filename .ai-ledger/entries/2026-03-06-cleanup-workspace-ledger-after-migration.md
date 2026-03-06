# AI Ledger Entry

- id: AILE-0010
- title: Clean up workspace .ai-ledger/contracts and entries after migration
- date: 2026-03-06
- contract: .ai-ledger/contracts/2026-03-06-cleanup-workspace-ledger-after-migration.contract.yaml

## Intent summary
Delete workspace `.ai-ledger/contracts` and `.ai-ledger/entries` files once their contents are safely present on the detached ledger branch so the branch/worktree is clearly the source of truth.

## Actual changes
- Added a new AI Ledger contract describing the behavior change to clean up workspace ledger files after migration.
- Updated `migrateWorkspaceLedgerToBranch` in the CLI to track which workspace files are safely represented on the ledger branch (either newly copied or already identical there).
- After performing any migration commit on the ledger worktree, the CLI now removes those migrated workspace files, leaving only conflicting or unmigrated files in `.ai-ledger/contracts` and `.ai-ledger/entries`.

## Files changed
- .ai-ledger/contracts/2026-03-06-cleanup-workspace-ledger-after-migration.contract.yaml
- .ai-ledger/entries/2026-03-06-cleanup-workspace-ledger-after-migration.md
- packages/cli/src/index.ts

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - pnpm --filter @ai-ledger/cli build
  - node packages/cli/dist/index.js --version
- manual checks:
  - Confirmed that existing workspace contracts and entries remain present in this repository (as historical records) while future runs of `init` against projects with workspace records will copy them to the ledger branch and then remove the workspace copies, except for any files reported as conflicts.

## Approval
- required: false
- approved_by: ""
- approved_at: ""

