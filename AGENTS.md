# AI Ledger Rules for Agents

This repository uses AI Ledger (spec/v0.1.md).

Follow these rules for any meaningful change.

## Non-negotiables

1) Append-only

Never edit or delete existing ledger files on the detached ledger branch/worktree:
- .git/.ai-ledger/worktree/.ai-ledger/contracts/
- .git/.ai-ledger/worktree/.ai-ledger/entries/

If corrections are needed, create an amendment as a new contract and a new entry.

2) Before coding: create a contract

- Run `npx @ai-ledger/cli@0.2.0 new --title "<short title>"` from the repo root.
- This creates a contract and entry pair on `ai-ledger/log`.
- Fill required contract fields (intent, scope, verification, links).
- If `review.requires_human_approval` is true, do not proceed without an explicit approval step.

3) Stay in scope

- Only modify files that match scope.expected
- Do not touch scope.forbidden
- If scope must expand, stop and create an amendment contract first

4) After coding: create an entry

- Update the generated entry on the ledger worktree with:
  - actual changes
  - files changed
  - verification performed
  - approval status/details

## Behavior expectations

- Prefer small, scoped changes
- Avoid broad refactors unless explicitly requested and contracted
- If you discover unrelated improvements, propose them as a separate contract and entry

## AI Ledger Required Setup (managed by ai-ledger init)

Every AI tool should be configured to:

1. Create a contract before meaningful changes
2. Stay within declared scope
3. Create an entry after changes
4. Never edit existing files in `.ai-ledger/contracts/` or `.ai-ledger/entries/` (append-only)

Tell your agent:

- Read `AGENTS.md` first
- Follow the non-negotiables
