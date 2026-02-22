# AI Ledger Rules for Agents

This repository uses AI Ledger (spec/v0.1.md).

Follow these rules for any meaningful change.

## Non-negotiables

1) Append-only

Never edit or delete existing files in:
- .ai-ledger/contracts/
- .ai-ledger/entries/

If corrections are needed, create an amendment as a new contract and a new entry.

2) Before coding: create a contract

- Copy .ai-ledger/templates/contract.yaml
- Save to .ai-ledger/contracts/YYYY-MM-DD-<slug>.contract.yaml
- Fill required fields
- Declare scope.expected and scope.forbidden
- If review.requires_human_approval is true, do not proceed without an explicit approval step

3) Stay in scope

- Only modify files that match scope.expected
- Do not touch scope.forbidden
- If scope must expand, stop and create an amendment contract first

4) After coding: create an entry

- Copy .ai-ledger/templates/entry.md
- Save to .ai-ledger/entries/YYYY-MM-DD-<slug>.md
- Record actual changes, files changed, verification performed, and approval

## Behavior expectations

- Prefer small, scoped changes
- Avoid broad refactors unless explicitly requested and contracted
- If you discover unrelated improvements, propose them as a separate contract and entry