# AI Ledger Entry

- id: AILE-0012
- title: Update basic CI workflow for detached ledger storage
- date: 2026-03-06
- contract: .ai-ledger/contracts/2026-03-06-update-basic-workflow-for-detached-storage.contract.yaml

## Intent summary
Ensure that projects upgrading to CLI 0.2.0 and switching to git-branch storage do not have their existing AI Ledger CI checks break by automatically updating the stock ai-ledger-basic.yml workflow when init is run.

## Actual changes
- Added a contract describing the need to migrate the default AI Ledger CI workflow when using detached ledger storage.
- Planned changes to the CLI init command (in packages/cli/src/index.ts) so that it detects the old ai-ledger-basic.yml pattern and rewrites it to a CLI-based check that is compatible with git-branch storage.

## Files changed
- .ai-ledger/contracts/2026-03-06-update-basic-workflow-for-detached-storage.contract.yaml
- .ai-ledger/entries/2026-03-06-update-basic-workflow-for-detached-storage.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - (to be executed after implementing the init behavior) pnpm --filter @ai-ledger/cli build
- manual checks:
  - None yet; this entry documents intent and scope prior to implementing the CLI change.

## Approval
- required: false
- approved_by: ""
- approved_at: ""

