# AI Ledger Entry

- id: AILE-0014
- title: Add project CHANGELOG for CLI 0.2.0 and earlier
- date: 2026-03-06
- contract: .ai-ledger/contracts/2026-03-06-add-changelog.contract.yaml

## Intent summary
Introduce a human-readable CHANGELOG.md that summarizes notable changes to the project, starting with CLI 0.2.0 and the earlier 0.1.0 baseline.

## Actual changes
- Added a top-level `CHANGELOG.md` describing:
  - The 0.2.0 release (detached ledger storage, migration behavior, CI workflow management, and docs updates).
  - The initial 0.1.0 release and its basic behavior.

## Files changed
- CHANGELOG.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - pnpm --filter @ai-ledger/cli build
- manual checks:
  - Reviewed `CHANGELOG.md` to confirm it accurately reflects the high-level changes for 0.2.0 and the initial 0.1.0 release.

## Approval
- required: false
- approved_by: ""
- approved_at: ""

