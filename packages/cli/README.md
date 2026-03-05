# @ai-ledger/cli

Reference CLI for AI Ledger. Run with `npx` (no install):

```bash
npx @ai-ledger/cli init
npx @ai-ledger/cli new --title "..."
npx @ai-ledger/cli check
```

- `init` — scaffold `.ai-ledger/` (templates, config) and ensure `AGENTS.md` has AI Ledger setup instructions
- `new --title "..."` — generate a new contract and entry
- `check` — validate append-only and presence of contracts/entries (e.g. in CI)

## Storage strategy

By default, `init` now chooses storage mode automatically:

- `git-branch` (default when inside a git repository):
  - contracts and entries are committed to `ai-ledger/log`
  - files are written in a dedicated git worktree under `.git/.ai-ledger/worktree`
  - `init` automatically migrates existing workspace ledger files into the detached branch when possible
  - your active branch stays clean (no ledger-file noise)
- `workspace` (fallback outside git):
  - contracts and entries are written to `.ai-ledger/contracts` and `.ai-ledger/entries` in your working tree

You can control this via `.ai-ledger/config.json`:

```json
{
  "storage": {
    "mode": "git-branch",
    "branch": "ai-ledger/log"
  }
}
```

Why these names:
- `ai-ledger/log` is a plain-language branch name for the ledger stream.
- `.git/.ai-ledger/worktree` groups internals under a single `.ai-ledger` directory instead of a one-off folder name.
