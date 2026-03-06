<p align="center">
  <img src="ai-ledger-logo.png" alt="AI Ledger Logo" width="220" />
</p>

# AI Ledger

Git-native, append-only governance for AI-assisted software development.

It makes AI-generated changes traceable and reviewable using:

- Intent contracts (before change)
- Ledger entries (after change)
- Append-only history (no edits, only new entries)
- Optional CI enforcement

AI Ledger is tool-agnostic. It works with Cursor, Claude, Codex, Gemini, Copilot, or manual development, including human-only workflows. The standard is just files in your repository.

---

## Why AI Ledger Exists

Agentic AI tools can:

- Change more than requested
- Refactor opportunistically
- Modify unrelated files
- Silently alter copy, tokens, or behavior

Fast loops are powerful, but they can lose traceability.

AI Ledger keeps velocity while preserving the how, when, and why behind changes.

---

## What “Ledger” Means

A ledger is a permanent, append-only record of transactions.

In accounting:
- You never erase entries.
- If something is wrong, you add a correcting entry.
- You can reconstruct history at any time.

AI Ledger applies this principle to software changes.

Every meaningful change becomes a transaction with:

- Declared intent
- Explicit scope
- Recorded outcome

---

## Real Example

Question:

> How / when / why did that color change?

Without AI Ledger:
- Git blame
- Commit archaeology
- Slack archaeology
- Guesswork

With AI Ledger:

### Contract (before change)

```yaml
title: "Align brand accent color with new marketing palette"
reason: "Rebrand update Q1 2026"
scope:
  expected:
    - "tokens/colors.ts"
    - "theme/**"
  forbidden:
    - "auth/**"
    - "infra/**"
```

### Entry (after change)

```md
## Actual changes
- Updated primaryAccent from #0A84FF to #0C6DFF
- Updated secondaryAccent to match the palette

## Scope drift
- No drift
```

---

## Repository Structure

```text
.ai-ledger/
  README.md             # Storage mode notes for this repository
  templates/            # Templates used by humans/agents
  config.json           # Policy/config for this repo
# Canonical ledger records are on branch ai-ledger/log:
#   .ai-ledger/contracts/
#   .ai-ledger/entries/
spec/
packages/
  cli/          # @ai-ledger/cli
  spec/         # @ai-ledger/spec
examples/
.github/workflows/
AGENTS.md
README.md
LICENSE
```

---

## Quick Start

### Node project (recommended)

From your repository root:

```bash
npx --yes @ai-ledger/cli@0.2.0 init
npx --yes @ai-ledger/cli@0.2.0 new --title "Describe the change"
npx --yes @ai-ledger/cli@0.2.0 check
```

What this does:

- `init` sets up `.ai-ledger/` templates/config and configures storage (detached ledger branch in git repos).
- `new` creates a contract+entry pair using your templates.
- `check` validates contracts/entries in the configured storage for CI/manual checks.

### Manual workflow (no CLI)

1. Before starting meaningful work
   - Copy `.ai-ledger/templates/contract.yaml`
   - Save it to `.ai-ledger/contracts/YYYY-MM-DD-your-slug.contract.yaml`
   - Fill in intent, scope, verification expectations, and review policy

2. Do the work (human or AI)

3. After finishing
   - Copy `.ai-ledger/templates/entry.md`
   - Save it to `.ai-ledger/entries/YYYY-MM-DD-your-slug.md`
   - Record what actually happened, verification performed, and approval

4. Never edit old contracts or entries
   - Corrections require amendments (new contract + new entry)

---

## Core Rules (v0.1)

Per meaningful change set (typically per PR):

- At least one NEW file in `.ai-ledger/contracts/`
- At least one NEW file in `.ai-ledger/entries/`

Append-only:

- Do not modify or delete existing files in:
  - `.ai-ledger/contracts/`
  - `.ai-ledger/entries/`

Scope:

- `scope.expected` defines what may change
- `scope.forbidden` defines what must not change
- If work exceeds expected scope, record scope drift and create an amendment

---

## Philosophy

- AI increases change velocity.
- Velocity requires stronger traceability.
- Intent must be explicit.
- History must be append-only.
- Scope must be enforceable.
- Governance should not require new infrastructure.

---

## Why not just use good commit messages?

Commit messages help, but they do not solve the core problems:

- Unstructured: hard to validate or enforce
- No explicit scope boundaries
- Often missing meaningful intent
- Squash merges compress context
- AI can make broad changes that a commit message does not capture

AI Ledger adds:

- A pre-change intent contract with explicit boundaries
- An append-only, structured record of what happened
- A path to CI enforcement

Use commit messages and AI Ledger together.

---

## AI Tool Integration (Making Agents Follow the Rules)

AI Ledger is tool-agnostic.

However, to get value, your AI editor or agent must be instructed to respect the standard.

Every AI tool should be configured to:

1. Create a contract before meaningful changes
2. Stay within declared scope
3. Create an entry after changes
4. Never edit existing files in `.ai-ledger/contracts/` or `.ai-ledger/entries/` (append-only)

Agent instructions are advisory.
CI and human review remain authoritative.

### Universal Setup (Recommended)

This repo includes `AGENTS.md`.

Tell your agent:

- Read `AGENTS.md` first
- Follow the non-negotiables

### Claude / Claude Code

Add this to your `CLAUDE.md` (or create one):

- Read `AGENTS.md` before making changes
- Follow AI Ledger append-only and scope rules

See `examples/CLAUDE.md`.

### Cursor

Option A:
- Create `.cursor/rules.md` and add:
  - Read `AGENTS.md` and follow AI Ledger rules

Option B:
- Copy the non-negotiables from `AGENTS.md` into your existing Cursor rules file

See `examples/cursor-rules.md`.

### Codex and CLI agents

- Add the contents of `AGENTS.md` to your system prompt
- Or instruct the agent to open `AGENTS.md` before operating

### GitHub Copilot Chat

When prompting:
- Ask Copilot to read `AGENTS.md`
- Include: follow AI Ledger append-only rules

---

## CI Enforcement

### This repository

This repo includes a basic GitHub Actions workflow at:

- `.github/workflows/ai-ledger-basic.yml`

This repository uses detached ledger storage (`ai-ledger/log`) and the workflow runs:

- `npx --yes @ai-ledger/cli@0.2.0 check`

That check validates contracts/entries in the configured storage location (for this repo: the ledger branch/worktree), rather than assuming `.ai-ledger/contracts` and `.ai-ledger/entries` are present in the active branch.

### Consumer projects using the CLI

The reference CLI (`@ai-ledger/cli`) supports an optional **detached storage** mode where:

- Contracts and entries are written to a dedicated ledger branch (by default `ai-ledger/log`) via a git worktree under `.git/.ai-ledger/worktree`.
- Your feature branches stay free of ledger-only commits.

For those projects, the recommended CI pattern is to call the CLI’s `check` command instead of diffing `.ai-ledger/` directly, for example:

```yaml
name: AI Ledger (basic)

on:
  pull_request:

jobs:
  basic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: AI Ledger check
        run: npx --yes @ai-ledger/cli@0.2.0 check
```

The CLI’s `init` command can scaffold or update this workflow for you when you adopt 0.2.0.

---

## Spec

See `spec/v0.1.md`.

The current normative specification document is `v0.1`.

Package versions may advance independently of the spec document version:

- `@ai-ledger/cli@0.2.0` includes tooling and workflow improvements.
- `@ai-ledger/spec@0.2.0` is a packaged distribution that currently contains `spec/v0.1.md` as the normative spec content.

AI Ledger is a specification first, and tooling/package versions may evolve independently.

---

## Reference CLI

The `@ai-ledger/cli` package provides the Node.js reference implementation.

For full command details, configuration, migration behavior, and CI guidance, see:

- `packages/cli/README.md`

---

## Contributing

Contributions welcome:

- Spec improvements
- Templates
- Alternative language tooling
- CI integrations
- Adoption examples

---

## License

MIT