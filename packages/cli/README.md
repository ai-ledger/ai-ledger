# @ai-ledger/cli

Reference CLI for AI Ledger. Run with `npx` (no install):

```bash
npx @ai-ledger/cli init
npx @ai-ledger/cli new --title "..."
npx @ai-ledger/cli check
```

- `init` — scaffold `.ai-ledger/` (templates, config)
- `new --title "..."` — generate a new contract and entry
- `check` — validate append-only and presence of contracts/entries (e.g. in CI)