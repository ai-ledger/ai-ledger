# AI Ledger Entry

- id: AILE-0013
- title: Document detached ledger storage, migration, and CI behavior for CLI 0.2.0
- date: 2026-03-06
- contract: .ai-ledger/contracts/2026-03-06-docs-detached-storage-and-ci.contract.yaml

## Intent summary
Clarify in the main README, CLI README, and spec how CLI 0.2.0 handles storage modes, migration from workspace to git-branch storage, CI workflow scaffolding/upgrades, and expectations around pushing and checking the ledger branch.

## Actual changes
- Updated documentation to describe workspace vs git-branch storage, how `init` migrates existing workspace records and cleans up `.ai-ledger/contracts` and `.ai-ledger/entries`, and how the CLI now manages a basic GitHub Actions workflow that calls `ai-ledger check`.
- Clarified how this repository’s own AI Ledger workflow differs from the generated workflow used by consumer projects.

## Files changed
- README.md
- packages/cli/README.md
- spec/v0.1.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - pnpm --filter @ai-ledger/cli build
- manual checks:
  - Reviewed the rendered sections in README.md, packages/cli/README.md, and spec/v0.1.md to ensure they accurately match the implemented 0.2.0 behavior and CI scaffolding.

## Approval
- required: false
- approved_by: ""
- approved_at: ""

