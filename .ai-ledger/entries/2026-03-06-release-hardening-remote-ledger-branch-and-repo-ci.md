# AI Ledger Entry

- id: AILE-0016
- title: Harden 0.2.0 release flow for remote ledger branch and repository CI
- date: 2026-03-06
- contract: .ai-ledger/contracts/2026-03-06-release-hardening-remote-ledger-branch-and-repo-ci.contract.yaml

## Intent summary
Remove last-minute release blockers by restoring strict repository PR governance checks and ensuring CLI ledger worktree setup uses existing remote ledger history when available.

## Actual changes
- Restored `.github/workflows/ai-ledger-basic.yml` to enforce append-only plus new contract/new entry checks per PR for this repository (instead of invoking unpublished npm CLI version).
- Updated `ensureLedgerWorktree` to:
  - detect existing local ledger branch first,
  - otherwise detect/fetch `origin/<ledger-branch>`,
  - and create local ledger branch from `origin/<ledger-branch>` when available.
- Kept fallback behavior to create a new local ledger branch only when no local or remote ledger branch exists.

## Files changed
- .github/workflows/ai-ledger-basic.yml
- packages/cli/src/index.ts
- .ai-ledger/contracts/2026-03-06-release-hardening-remote-ledger-branch-and-repo-ci.contract.yaml
- .ai-ledger/entries/2026-03-06-release-hardening-remote-ledger-branch-and-repo-ci.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - pnpm --filter @ai-ledger/cli build
  - node packages/cli/dist/index.js check
- manual checks:
  - Verified in a temporary remote/clone scenario that `init` + `check` succeeds when ledger history exists on `origin/ai-ledger/log`.
  - Confirmed repository workflow once again checks per-PR ledger file additions and append-only behavior.

## Approval
- required: false
- approved_by: ""
- approved_at: ""

