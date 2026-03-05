# AI Ledger Entry

- id: AILE-0007
- title: Have init create or append required AGENTS.md setup guidance
- date: 2026-03-04
- contract: .ai-ledger/contracts/2026-03-04-init-manage-agents-instructions.contract.yaml

## Intent summary
Ensure `ai-ledger init` writes the required AI Ledger setup guidance into `AGENTS.md` so agent workflows are configured consistently by default.

## Actual changes
Updated CLI `init` to call a new `ensureAgentsInstructions()` helper. The helper creates `AGENTS.md` if missing, or appends a managed AI Ledger setup block if the file exists and does not already contain that block. The managed block mirrors the required setup bullets in the README section for AI tool integration. Updated CLI README command summary to mention this behavior.

## Files changed
- packages/cli/src/index.ts
- packages/cli/README.md
- .ai-ledger/contracts/2026-03-04-init-manage-agents-instructions.contract.yaml
- .ai-ledger/entries/2026-03-04-init-manage-agents-instructions.md

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - "pnpm --filter @ai-ledger/cli build"
  - "tmpdir=$(mktemp -d) && cp -R /workspace/ai-ledger/. \"$tmpdir\" && cd \"$tmpdir\" && git init -q && node packages/cli/dist/index.js init && test -f AGENTS.md && rg -n \"Create a contract before meaningful changes\" AGENTS.md"
  - "tmpdir=$(mktemp -d) && cp -R /workspace/ai-ledger/. \"$tmpdir\" && cd \"$tmpdir\" && printf \"# Existing\\n\" > AGENTS.md && node packages/cli/dist/index.js init && rg -n \"# Existing\" AGENTS.md && rg -n \"AI Ledger Required Setup \\\(managed by ai-ledger init\\\)\" AGENTS.md"
  - "tmpdir=$(mktemp -d) && cp -R /workspace/ai-ledger/. \"$tmpdir\" && cd \"$tmpdir\" && printf \"# Existing\\n\" > AGENTS.md && node packages/cli/dist/index.js init >/dev/null && node packages/cli/dist/index.js init >/dev/null && [ \"$(rg -n \"AI Ledger Required Setup \\\(managed by ai-ledger init\\\)\" AGENTS.md | wc -l)\" -eq 1 ] && echo \"managed block not duplicated\""
- manual checks:
  - "Confirmed AGENTS managed block includes the four required setup bullets and read-first instruction from README guidance."

## Approval
- required: false
- approved_by: ""
- approved_at: ""
