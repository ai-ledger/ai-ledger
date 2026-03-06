# AI Ledger

This project uses AI Ledger to manage intent contracts and change entries for AI-assisted work.

## Where are the contracts and entries?

- **Storage mode**: git-branch
- **Ledger branch**: `ai-ledger/log`

The canonical `.ai-ledger/contracts/` and `.ai-ledger/entries/` live on the dedicated ledger branch, not on your feature branches.
Locally, the CLI manages a git worktree rooted under the main repo's `.git` directory for this branch.

To inspect the ledger records:

1. Run `git worktree list` to find the AI Ledger worktree, or
2. Run `git checkout ai-ledger/log` to view the branch directly.

## Templates and configuration

The following files always live in this working copy:
- `.ai-ledger/templates/contract.yaml`
- `.ai-ledger/templates/entry.md`
- `.ai-ledger/config.json`

You can edit these to customize how AI Ledger behaves in this repository.

