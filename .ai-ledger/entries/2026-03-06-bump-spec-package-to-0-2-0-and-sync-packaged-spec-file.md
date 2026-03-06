# AI Ledger Entry

- id: AILE-1772823524709
- title: Bump spec package to 0.2.0 and sync packaged spec file
- date: 2026-03-06
- contract: .ai-ledger/contracts/2026-03-06-bump-spec-package-to-0-2-0-and-sync-packaged-spec-file.contract.yaml

## Intent summary
Publish @ai-ledger/spec as 0.2.0 and ensure its packaged spec file matches the current root spec content.

## Actual changes
- Updated `packages/spec/package.json` version from `0.1.0` to `0.2.0`.
- Synced `packages/spec/spec/v0.1.md` with the current root `spec/v0.1.md` content, including storage-mode guidance.
- Added an `[Unreleased]` note in `CHANGELOG.md` for the spec package version/content alignment.

## Files changed
- packages/spec/package.json
- packages/spec/spec/v0.1.md
- CHANGELOG.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - pnpm --filter @ai-ledger/cli build
  - node packages/cli/dist/index.js check
- manual checks:
  - Confirmed packages/spec/spec/v0.1.md matches spec/v0.1.md.
  - Confirmed @ai-ledger/spec package.json version is 0.2.0.

## Approval
- required: false
- approved_by: ""
- approved_at: ""