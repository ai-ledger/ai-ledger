# AI Ledger Entry

- id: AILE-1772822938198
- title: Align docs and release workflow after 0.2.0
- date: 2026-03-06
- contract: .ai-ledger/contracts/2026-03-06-align-docs-and-release-workflow-after-0-2-0.contract.yaml

## Intent summary
Align repository docs with detached ledger storage behavior and harden the publish workflow to skip already-published versions.

## Actual changes
- Updated repository-level docs to reflect detached ledger storage:
  - `README.md` no longer states this repository stores contracts/entries in workspace mode.
  - `AGENTS.md` now tells contributors to create contract+entry pairs via the CLI (`ai-ledger new`) on the ledger branch.
- Updated `.github/workflows/ai-ledger-basic.yml` to run `npx --yes @ai-ledger/cli@0.2.0 check` for non-interactive CI execution.
- Hardened `.github/workflows/publish.yml` so each package publish step first checks whether `<name>@<version>` already exists on npm and skips publish if it does.
- Added an `[Unreleased]` section in `CHANGELOG.md` documenting these follow-up maintenance changes.

## Files changed
- README.md
- AGENTS.md
- .github/workflows/ai-ledger-basic.yml
- .github/workflows/publish.yml
- CHANGELOG.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - pnpm --filter @ai-ledger/cli build
  - node packages/cli/dist/index.js check
- manual checks:
  - Confirmed updated documentation matches detached storage behavior used by this repository.
  - Reviewed publish workflow guard logic to confirm tag runs skip already-published versions.

## Approval
- required: false
- approved_by: ""
- approved_at: ""