# Claude instructions (example)

Add this to your CLAUDE.md (or create one):

Read AGENTS.md before making changes.

For any meaningful change:
- create a new contract in .ai-ledger/contracts/
- implement only within scope.expected and avoid scope.forbidden
- create a new entry in .ai-ledger/entries/
- never edit or delete existing contracts or entries (append-only)
- if scope expands, add an amendment as new files