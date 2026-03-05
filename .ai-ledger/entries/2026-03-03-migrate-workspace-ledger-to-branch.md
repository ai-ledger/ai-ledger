# AI Ledger Entry

- id: AILE-0006
- title: Migrate existing workspace ledger files into detached ledger branch
- date: 2026-03-03
- contract: .ai-ledger/contracts/2026-03-03-migrate-workspace-ledger-to-branch.contract.yaml

## Intent summary
Make `ai-ledger init` automatically migrate pre-existing workspace contracts/entries into detached git-branch storage so users can adopt the cleaner setup without losing prior ledger history.

## Actual changes
Added migration logic that scans workspace `.ai-ledger/contracts` and `.ai-ledger/entries`, copies missing files to the detached worktree, and commits them to the ledger branch during `init` in `git-branch` mode. Added conflict handling: when a file with the same name already exists but content differs on the ledger branch, migration skips that file and reports a warning. Updated CLI README to document automatic migration behavior.

## Files changed
- packages/cli/src/index.ts
- packages/cli/README.md
- .ai-ledger/contracts/2026-03-03-migrate-workspace-ledger-to-branch.contract.yaml
- .ai-ledger/entries/2026-03-03-migrate-workspace-ledger-to-branch.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - "pnpm --filter @ai-ledger/cli build"
  - "tmpdir=$(mktemp -d) && cp -R /workspace/ai-ledger/. \"$tmpdir\" && cd \"$tmpdir\" && git init -q && mkdir -p .ai-ledger/contracts .ai-ledger/entries .ai-ledger/templates && cp .ai-ledger/templates/contract.yaml .ai-ledger/contracts/2026-03-03-old.contract.yaml && cp .ai-ledger/templates/entry.md .ai-ledger/entries/2026-03-03-old.md && node packages/cli/dist/index.js init && test -f .git/.ai-ledger/worktree/.ai-ledger/contracts/2026-03-03-old.contract.yaml && test -f .git/.ai-ledger/worktree/.ai-ledger/entries/2026-03-03-old.md && git -C .git/.ai-ledger/worktree log --oneline -n 1"
- manual checks:
  - "Confirmed init reports migration summary output when files are migrated."

## Approval
- required: false
- approved_by: ""
- approved_at: ""
