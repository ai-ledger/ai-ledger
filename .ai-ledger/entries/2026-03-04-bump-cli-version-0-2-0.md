# AI Ledger Entry

- id: AILE-0008
- title: Bump CLI package version to 0.2.0 for release
- date: 2026-03-04
- contract: .ai-ledger/contracts/2026-03-04-bump-cli-version-0-2-0.contract.yaml

## Intent summary
Prepare the CLI package for release by bumping version metadata to `0.2.0`.

## Actual changes
Updated `packages/cli/package.json` version from `0.1.0` to `0.2.0` and updated the CLI-reported Commander version string in `packages/cli/src/index.ts` to `0.2.0`.

## Files changed
- packages/cli/package.json
- packages/cli/src/index.ts
- .ai-ledger/contracts/2026-03-04-bump-cli-version-0-2-0.contract.yaml
- .ai-ledger/entries/2026-03-04-bump-cli-version-0-2-0.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - "pnpm --filter @ai-ledger/cli build"
  - "node packages/cli/dist/index.js --version"
- manual checks:
  - "Confirmed both package metadata and CLI runtime version output report 0.2.0."

## Approval
- required: false
- approved_by: ""
- approved_at: ""
