# AI Ledger Entry

- id: AILE-0005
- title: Drop pre-merge legacy worktree compatibility
- date: 2026-03-03
- contract: .ai-ledger/contracts/2026-03-03-drop-legacy-worktree-compat.contract.yaml

## Intent summary
Remove old-path compatibility code for detached ledger worktree and keep naming/docs focused on the simplified defaults.

## Actual changes
Removed fallback detection for `.git/.ai-ledger-log` so the CLI always uses `.git/.ai-ledger/worktree` for detached storage. Updated CLI README to remove compatibility language.

## Files changed
- packages/cli/src/index.ts
- packages/cli/README.md
- .ai-ledger/contracts/2026-03-03-drop-legacy-worktree-compat.contract.yaml
- .ai-ledger/entries/2026-03-03-drop-legacy-worktree-compat.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - "pnpm --filter @ai-ledger/cli build"
  - "tmpdir=$(mktemp -d) && cp -R /workspace/ai-ledger/. \"$tmpdir\" && cd \"$tmpdir\" && git init -q && pnpm --filter @ai-ledger/cli build >/dev/null && node packages/cli/dist/index.js init && node packages/cli/dist/index.js new --title \"compat removal smoke\" && git -C .git/.ai-ledger/worktree rev-parse --abbrev-ref HEAD && test ! -e .git/.ai-ledger-log && echo \"legacy path absent\""
- manual checks:
  - "Confirmed no remaining mentions of .git/.ai-ledger-log in CLI source and CLI README."

## Approval
- required: false
- approved_by: ""
- approved_at: ""
