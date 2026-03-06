# @ai-ledger/cli

Reference CLI for AI Ledger. Run with `npx` (no install):

```bash
npx @ai-ledger/cli init
npx @ai-ledger/cli new --title "..."
npx @ai-ledger/cli check
```

- `init` — scaffold `.ai-ledger/` (templates, config), ensure `AGENTS.md` has AI Ledger setup instructions, set up storage mode, and manage a basic CI workflow
- `new --title "..."` — generate a new contract and entry
- `check` — validate that contracts/entries exist and are non-empty in the configured storage (workspace or git-branch); suitable for CI

## Storage strategy (0.2.0)

By default, `init` chooses storage mode automatically:

- `git-branch` (default when inside a git repository):
  - contracts and entries are committed to a dedicated ledger branch, by default `ai-ledger/log`
  - files are written in a dedicated git worktree under `.git/.ai-ledger/worktree`
  - `init` automatically migrates existing workspace ledger files into the detached branch when possible, then deletes the migrated copies (and their now-empty `contracts` / `entries` folders) from the working tree
  - your active branch stays clean (no ledger-file noise), while the ledger branch contains the append-only history
- `workspace` (fallback outside git):
  - contracts and entries are written to `.ai-ledger/contracts` and `.ai-ledger/entries` in your working tree

You can control this via `.ai-ledger/config.json`:

```json
{
  "storage": {
    "mode": "git-branch",
    "branch": "ai-ledger/log"
  }
}
```

Why these names:
- `ai-ledger/log` is a plain-language branch name for the ledger stream.
- `.git/.ai-ledger/worktree` groups internals under a single `.ai-ledger` directory instead of a one-off folder name.

## What `init` actually does

When you run:

```bash
npx @ai-ledger/cli@0.2.0 init
```

the CLI will:

- Create `.ai-ledger/` if needed:
  - `.ai-ledger/templates/contract.yaml`
  - `.ai-ledger/templates/entry.md`
  - `.ai-ledger/config.json`
  - `.ai-ledger/README.md` explaining where contracts/entries live (workspace vs ledger branch)
- Ensure `AGENTS.md` contains the AI Ledger non‑negotiables.
- If `storage.mode = "git-branch"`:
  - Create or reuse a worktree for the ledger branch (default `ai-ledger/log`) under `.git/.ai-ledger/worktree`.
  - Migrate any existing `.ai-ledger/contracts/*` and `.ai-ledger/entries/*` in the workspace into the ledger worktree, committing them on the ledger branch.
  - Delete migrated workspace files (and remove now-empty `.ai-ledger/contracts` / `.ai-ledger/entries` directories), leaving the ledger branch as the source of truth.
  - Install a `pre-push` hook that pushes the ledger branch to the same remote whenever you push any ref (skipped if you already have a custom pre-push hook).
- Manage a basic GitHub Actions workflow:
  - If `.github/workflows/ai-ledger-basic.yml` does **not** exist, create one that runs `npx @ai-ledger/cli@0.2.0 check` on pull requests.
  - If it **does** exist and matches the old pattern that diffs `.ai-ledger/contracts` / `.ai-ledger/entries` and prints `AI Ledger: missing new contract and/or entry.`, rewrite it to the CLI‑based check.

This means:

- Existing projects on 0.1.0 that used the documented `ai-ledger-basic.yml` will be migrated to detached storage **and** get a compatible CI workflow when they run `init`.
- New projects get storage + CI set up in one step.

## Using `check` in CI

For consumer projects, the recommended CI pattern is to call the CLI, not to diff `.ai-ledger/` directly, for example:

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
        run: npx @ai-ledger/cli@0.2.0 check
```

The `check` command:

- In `workspace` mode: verifies `.ai-ledger/contracts/` and `.ai-ledger/entries/` exist and are non‑empty.
- In `git-branch` mode: ensures the ledger worktree exists for the configured branch and that its `.ai-ledger/contracts/` and `.ai-ledger/entries/` are non‑empty.

## Pushing the ledger branch

The CLI writes and commits to the ledger branch locally. When using git-branch storage, `init` installs a **pre-push hook** that pushes the ledger branch (e.g. `ai-ledger/log`) to the same remote whenever you push any ref.

So when you run `git push origin main` or `git push origin your-feature-branch`, the hook also runs a secondary `git push --no-verify origin ai-ledger/log` (with recursion protection), keeping the remote ledger in sync without looping.

If you have a custom `pre-push` hook already, the CLI will not overwrite it. If the hook cannot be installed/updated (for example due to permissions), `init` warns and continues. In either case you can push the ledger branch manually:

```bash
git push origin ai-ledger/log
```

