# AI Ledger Entry

- id: AILE-EXAMPLE-0001
- title: Align brand accent color with new marketing palette
- date: 2026-02-22
- contract: examples/color-change.contract.yaml

## Intent summary
Update accent colors to match the new palette.

## Actual changes
- Updated primaryAccent from #0A84FF to #0C6DFF
- Updated secondaryAccent to match the palette

## Files changed
- tokens/colors.ts
- theme/AppTheme.ts

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - pnpm test
  - pnpm lint
- manual checks:
  - Verified primary buttons and links in the app

## Approval
- required: true
- approved_by: "@example"
- approved_at: 2026-02-22