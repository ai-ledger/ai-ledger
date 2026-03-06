# AI Ledger Entry

- id: AILE-0015
- title: Fix pre-push hook recursion when syncing ledger branch
- date: 2026-03-06
- contract: .ai-ledger/contracts/2026-03-06-fix-pre-push-hook-recursion.contract.yaml

## Intent summary
Prevent user push hangs caused by recursive invocation of the CLI-managed pre-push hook while still keeping the ledger branch synced automatically.

## Actual changes
- Updated `ensurePrePushHook` to generate a safer hook script:
  - Adds recursion guard via `AI_LEDGER_PRE_PUSH_ACTIVE`.
  - Uses `git push --no-verify` for the internal ledger push.
  - Skips secondary push when the ledger ref is already part of the current push.
- Made hook installation best-effort (warn-only) so `init` continues even if `.git/hooks` is not writable.
- Updated docs to clarify hook behavior and failure fallback in `packages/cli/README.md` and `CHANGELOG.md`.

## Files changed
- packages/cli/src/index.ts
- packages/cli/README.md
- CHANGELOG.md
- .ai-ledger/contracts/2026-03-06-fix-pre-push-hook-recursion.contract.yaml
- .ai-ledger/entries/2026-03-06-fix-pre-push-hook-recursion.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - pnpm --filter @ai-ledger/cli build
  - node packages/cli/dist/index.js init
- manual checks:
  - Confirmed `init` warns and exits successfully when hook file cannot be written in the sandbox.
  - Reviewed generated hook template for recursion guard and `--no-verify`.

## Approval
- required: false
- approved_by: ""
- approved_at: ""
