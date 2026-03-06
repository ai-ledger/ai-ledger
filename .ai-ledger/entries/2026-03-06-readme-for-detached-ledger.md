# AI Ledger Entry

- id: AILE-0009
- title: Add .ai-ledger README explaining detached ledger branch
- date: 2026-03-06
- contract: .ai-ledger/contracts/2026-03-06-readme-for-detached-ledger.contract.yaml

## Intent summary
Ensure every project initialized with the CLI has a `.ai-ledger/README.md` that explains where contracts and entries live when using git-branch storage and how to inspect the dedicated ledger branch/worktree.

## Actual changes
- Added a new AI Ledger contract describing the change to document detached ledger storage via a `.ai-ledger/README.md`.
- Updated the CLI `init` command so that after ensuring config it calls a new helper to create or update `.ai-ledger/README.md` based on the current storage mode and branch.
- Implemented `ensureLedgerReadme` in the CLI to generate a deterministic README that documents storage mode (workspace vs git-branch), the ledger branch name, where canonical contracts/entries live, and which `.ai-ledger` files remain in the working copy.

## Files changed
- .ai-ledger/contracts/2026-03-06-readme-for-detached-ledger.contract.yaml
- .ai-ledger/entries/2026-03-06-readme-for-detached-ledger.md
- packages/cli/src/index.ts
- .ai-ledger/README.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - pnpm --filter @ai-ledger/cli build
  - node packages/cli/dist/index.js --version
  - node packages/cli/dist/index.js init
- manual checks:
  - Confirmed `.ai-ledger/README.md` exists and documents git-branch storage, the ledger branch name `ai-ledger/log`, and where contracts/entries are stored vs templates/config in the working copy.

## Approval
- required: false
- approved_by: ""
- approved_at: ""

