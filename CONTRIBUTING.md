# Contributing to AI Ledger

Thanks for contributing.

AI Ledger is a governance standard for AI-assisted development.  
It is specification-first and tooling-agnostic.

Please read this document before opening a pull request.

---

## What This Repository Contains

- `spec/` — the official AI Ledger specification
- `.ai-ledger/` — reference folder structure and templates
- `examples/` — example contracts, entries, and tool integrations
- `.github/workflows/` — basic enforcement workflows
- `packages/cli/` — reference CLI (`@ai-ledger/cli`)

---

## Core Principles

AI Ledger is built on these principles:

1. Append-only history
2. Explicit intent before change
3. Recorded outcome after change
4. Clear scope boundaries
5. Tool-agnostic design

All contributions must respect these principles.

---

## Append-Only Rule (Very Important)

Files inside:

- `.ai-ledger/contracts/`
- `.ai-ledger/entries/`

Must never be modified or deleted once committed.

If something needs correction:

- Create a new contract
- Create a new entry referencing the original

History is extended — never rewritten.

Pull requests that modify existing contracts or entries will be rejected.

---

## Contribution Types Welcome

We welcome:

- Improvements to the specification
- Clarifications and better examples
- CI enforcement improvements
- Alternative language tooling implementations
- Adoption guides and documentation improvements

We do NOT want:

- Spec changes that break v0.1 without version bump
- Overly complex governance additions
- Tool-specific lock-in

---

## Spec Changes

If you modify `spec/v0.1.md`:

- Explain the reasoning clearly in the PR description
- Include before/after examples when relevant
- Consider whether the change requires a spec version bump

Breaking changes require:
- Updating the version
- Documenting migration guidance

---

## Tooling Contributions

Reference implementations (e.g., `@ai-ledger/cli`) should:

- Follow the spec exactly
- Not introduce behavior that contradicts the spec
- Treat the spec as the source of truth

Tooling must not redefine governance semantics.

---

## Pull Request Expectations

Each meaningful PR should:

- Include an AI Ledger contract
- Include a corresponding AI Ledger entry
- Respect append-only rules

We dogfood AI Ledger in this repository.

---

## Philosophy Reminder

AI increases change velocity.

Velocity without traceability erodes architectural clarity.

AI Ledger exists to preserve intent, boundaries, and auditability — without heavy process or external systems.

Keep contributions aligned with that spirit.

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.