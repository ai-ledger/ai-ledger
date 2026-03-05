# AI Ledger Entry

- id: AILE-20260303-storage-naming
- title: Simplify detached storage naming for branch and worktree
- date: 2026-03-03
- contract: .ai-ledger/contracts/2026-03-03-simplify-detached-storage-naming.contract.yaml

## Intent summary
Use simpler default names for detached storage and clarify why branch/worktree names differ.

## Actual changes
Changed the default detached branch from `ai-ledger/log/v1` to `ai-ledger/log`, moved the default worktree path to `.git/.ai-ledger/worktree`, and kept compatibility by auto-detecting legacy `.git/.ai-ledger-log` locations. Updated documentation to explain the naming clearly.

## Files changed
- packages/cli/src/index.ts
- packages/cli/README.md
- README.md
- .ai-ledger/contracts/2026-03-03-simplify-detached-storage-naming.contract.yaml
- .ai-ledger/entries/2026-03-03-simplify-detached-storage-naming.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - "pnpm --filter @ai-ledger/cli build"
  - "node packages/cli/dist/index.js --help"
  - "smoke test in temporary git repo: init + new + check; confirmed branch ai-ledger/log and worktree .git/.ai-ledger/worktree"
- manual checks:
  - "Reviewed docs language to ensure branch/worktree distinction is explicit"

## Approval
- required: false
- approved_by: ""
- approved_at: ""
