#!/usr/bin/env node
import { Command } from "commander";
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync, chmodSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

type StorageMode = "workspace" | "git-branch";

type LedgerConfig = {
  version: string;
  defaultRiskLevel: string;
  requireHumanApproval: boolean;
  storage: {
    mode: StorageMode;
    branch: string;
  };
};


type MigrationResult = {
  copiedContracts: number;
  copiedEntries: number;
  conflicts: string[];
};

const program = new Command();

const ROOT = process.cwd();
const BASE = join(ROOT, ".ai-ledger");
const CONTRACTS = join(BASE, "contracts");
const ENTRIES = join(BASE, "entries");
const TEMPLATES = join(BASE, "templates");
const CONFIG = join(BASE, "config.json");
const README = join(BASE, "README.md");
const AGENTS_FILE = join(ROOT, "AGENTS.md");
const WORKFLOWS_DIR = join(ROOT, ".github", "workflows");
const BASIC_WORKFLOW = join(WORKFLOWS_DIR, "ai-ledger-basic.yml");
const DEFAULT_STORAGE_BRANCH = "ai-ledger/log";

const AGENTS_MANAGED_HEADER = "## AI Ledger Required Setup (managed by ai-ledger init)";
const AGENTS_MANAGED_BLOCK = `${AGENTS_MANAGED_HEADER}

Every AI tool should be configured to:

1. Create a contract before meaningful changes
2. Stay within declared scope
3. Create an entry after changes
4. Never edit existing files in \`.ai-ledger/contracts/\` or \`.ai-ledger/entries/\` (append-only)

Tell your agent:

- Read \`AGENTS.md\` first
- Follow the non-negotiables
`;

function runGit(args: string[], cwd = ROOT): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function inGitRepo(): boolean {
  try {
    runGit(["rev-parse", "--is-inside-work-tree"]);
    return true;
  } catch {
    return false;
  }
}

function gitBranchExists(branch: string): boolean {
  try {
    runGit(["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]);
    return true;
  } catch {
    return false;
  }
}

function getGitDir(): string {
  const gitDir = runGit(["rev-parse", "--git-dir"]);
  return resolve(ROOT, gitDir);
}

function getWorktreePath(): string {
  const gitDir = getGitDir();
  return join(gitDir, ".ai-ledger", "worktree");
}

function ensureAgentsInstructions() {
  if (!existsSync(AGENTS_FILE)) {
    writeFileSync(
      AGENTS_FILE,
      `# Agent Instructions

${AGENTS_MANAGED_BLOCK}`,
      "utf8"
    );
    return;
  }

  const current = readFileSync(AGENTS_FILE, "utf8");
  if (current.includes(AGENTS_MANAGED_HEADER)) {
    return;
  }

  const separator = current.endsWith("\n") ? "\n" : "\n\n";
  writeFileSync(AGENTS_FILE, `${current}${separator}${AGENTS_MANAGED_BLOCK}`, "utf8");
}

function ensureWorkspaceDirs() {
  mkdirSync(CONTRACTS, { recursive: true });
  mkdirSync(ENTRIES, { recursive: true });
}

function ensureBaseDirs() {
  mkdirSync(BASE, { recursive: true });
  mkdirSync(TEMPLATES, { recursive: true });
}

function ensureLedgerReadme(config: LedgerConfig) {
  const lines: string[] = [];

  lines.push("# AI Ledger");
  lines.push("");
  lines.push("This project uses AI Ledger to manage intent contracts and change entries for AI-assisted work.");
  lines.push("");
  lines.push("## Where are the contracts and entries?");
  lines.push("");

  if (config.storage.mode === "git-branch") {
    lines.push("- **Storage mode**: git-branch");
    lines.push(`- **Ledger branch**: \`${config.storage.branch}\``);
    lines.push("");
    lines.push(
      "The canonical `.ai-ledger/contracts/` and `.ai-ledger/entries/` live on the dedicated ledger branch, not on your feature branches."
    );
    lines.push(
      "Locally, the CLI manages a git worktree rooted under the main repo's `.git` directory for this branch."
    );
    lines.push("");
    lines.push("To inspect the ledger records:");
    lines.push("");
    lines.push("1. Run `git worktree list` to find the AI Ledger worktree, or");
    lines.push(`2. Run \`git checkout ${config.storage.branch}\` to view the branch directly.`);
    lines.push("");
  } else {
    lines.push("- **Storage mode**: workspace");
    lines.push("");
    lines.push("Contracts and entries are stored directly in this working copy under:");
    lines.push("- `.ai-ledger/contracts/`");
    lines.push("- `.ai-ledger/entries/`");
    lines.push("");
  }

  lines.push("## Templates and configuration");
  lines.push("");
  lines.push("The following files always live in this working copy:");
  lines.push("- `.ai-ledger/templates/contract.yaml`");
  lines.push("- `.ai-ledger/templates/entry.md`");
  lines.push("- `.ai-ledger/config.json`");
  lines.push("");
  lines.push("You can edit these to customize how AI Ledger behaves in this repository.");
  lines.push("");

  const current = existsSync(README) ? readFileSync(README, "utf8") : null;
  const next = lines.join("\n") + "\n";

  if (current === next) {
    return;
  }

  writeFileSync(README, next, "utf8");
}

function ensureCiWorkflow(config: LedgerConfig) {
  const next = `name: AI Ledger (basic)

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
`;

  if (!existsSync(BASIC_WORKFLOW)) {
    mkdirSync(WORKFLOWS_DIR, { recursive: true });
    writeFileSync(BASIC_WORKFLOW, next, "utf8");
    return;
  }

  const current = readFileSync(BASIC_WORKFLOW, "utf8");
  const looksLikeOldBasic =
    current.includes("AI Ledger (basic)") &&
    current.includes("AI Ledger: missing new contract and/or entry.");

  if (!looksLikeOldBasic || current === next) {
    return;
  }

  writeFileSync(BASIC_WORKFLOW, next, "utf8");
}

const PRE_PUSH_HOOK_MARKER = "# Managed by @ai-ledger/cli";

function ensurePrePushHook(config: LedgerConfig) {
  if (config.storage.mode !== "git-branch") {
    return;
  }

  const gitDir = getGitDir();
  const hooksDir = join(gitDir, "hooks");
  const prePushPath = join(hooksDir, "pre-push");

  if (existsSync(prePushPath)) {
    const current = readFileSync(prePushPath, "utf8");
    if (!current.includes(PRE_PUSH_HOOK_MARKER)) {
      return;
    }
  }

  const branch = config.storage.branch;
  const hookContent = `#!/bin/sh
${PRE_PUSH_HOOK_MARKER} - do not edit manually
remote="$1"
url="$2"

# Push the ledger branch when any ref is pushed
if git rev-parse --verify "${branch}" >/dev/null 2>&1; then
  git push "$remote" "${branch}" 2>/dev/null || echo "ai-ledger: warning - failed to push ${branch} to $remote"
fi
exit 0
`;

  mkdirSync(hooksDir, { recursive: true });
  writeFileSync(prePushPath, hookContent, "utf8");
  chmodSync(prePushPath, 0o755);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function readConfig(): LedgerConfig {
  if (!existsSync(CONFIG)) {
    return {
      version: "0.1",
      defaultRiskLevel: "low",
      requireHumanApproval: true,
      storage: {
        mode: inGitRepo() ? "git-branch" : "workspace",
        branch: DEFAULT_STORAGE_BRANCH
      }
    };
  }

  const parsed = JSON.parse(readFileSync(CONFIG, "utf8")) as Partial<LedgerConfig>;
  return {
    version: parsed.version ?? "0.1",
    defaultRiskLevel: parsed.defaultRiskLevel ?? "low",
    requireHumanApproval: parsed.requireHumanApproval ?? true,
    storage: {
      mode: parsed.storage?.mode ?? (inGitRepo() ? "git-branch" : "workspace"),
      branch: parsed.storage?.branch ?? DEFAULT_STORAGE_BRANCH
    }
  };
}

function writeDefaultConfig() {
  const config = readConfig();
  writeFileSync(CONFIG, JSON.stringify(config, null, 2) + "\n", "utf8");
}

function ensureLedgerWorktree(branch: string): string {
  const worktree = getWorktreePath();
  if (!existsSync(worktree)) {
    if (gitBranchExists(branch)) {
      runGit(["worktree", "add", "--force", worktree, branch]);
    } else {
      runGit(["worktree", "add", "--force", "-b", branch, worktree]);
    }
  }

  const wtBase = join(worktree, ".ai-ledger");
  mkdirSync(join(wtBase, "contracts"), { recursive: true });
  mkdirSync(join(wtBase, "entries"), { recursive: true });
  return worktree;
}


function listVisibleFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir).filter((f) => !f.startsWith("."));
}

function migrateWorkspaceLedgerToBranch(branch: string): MigrationResult {
  const workspaceContracts = listVisibleFiles(CONTRACTS);
  const workspaceEntries = listVisibleFiles(ENTRIES);

  if (workspaceContracts.length === 0 && workspaceEntries.length === 0) {
    return { copiedContracts: 0, copiedEntries: 0, conflicts: [] };
  }

  const worktree = ensureLedgerWorktree(branch);
  const worktreeContracts = join(worktree, ".ai-ledger/contracts");
  const worktreeEntries = join(worktree, ".ai-ledger/entries");

  let copiedContracts = 0;
  let copiedEntries = 0;
  const conflicts: string[] = [];
  const migratedSources: string[] = [];

  const copyIfNeeded = (kind: "contracts" | "entries", fileName: string) => {
    const source = join(kind === "contracts" ? CONTRACTS : ENTRIES, fileName);
    const target = join(kind === "contracts" ? worktreeContracts : worktreeEntries, fileName);

    if (existsSync(target)) {
      const sourceContent = readFileSync(source, "utf8");
      const targetContent = readFileSync(target, "utf8");
      if (sourceContent !== targetContent) {
        conflicts.push(`.ai-ledger/${kind}/${fileName}`);
      }
      if (sourceContent === targetContent) {
        migratedSources.push(source);
      }
      return;
    }

    writeFileSync(target, readFileSync(source, "utf8"), "utf8");
    if (kind === "contracts") {
      copiedContracts += 1;
    } else {
      copiedEntries += 1;
    }
    migratedSources.push(source);
  };

  for (const fileName of workspaceContracts) {
    copyIfNeeded("contracts", fileName);
  }
  for (const fileName of workspaceEntries) {
    copyIfNeeded("entries", fileName);
  }

  if (copiedContracts > 0 || copiedEntries > 0) {
    runGit(["-C", worktree, "add", ".ai-ledger/contracts", ".ai-ledger/entries"]);
    runGit([
      "-C",
      worktree,
      "commit",
      "-m",
      `ai-ledger: migrate existing workspace records (${copiedContracts} contracts, ${copiedEntries} entries)`
    ]);
  }

  for (const source of migratedSources) {
    if (existsSync(source)) {
      rmSync(source);
    }
  }

  const remainingWorkspaceContracts = listVisibleFiles(CONTRACTS);
  const remainingWorkspaceEntries = listVisibleFiles(ENTRIES);

  if (remainingWorkspaceContracts.length === 0 && existsSync(CONTRACTS)) {
    rmSync(CONTRACTS, { recursive: true });
  }
  if (remainingWorkspaceEntries.length === 0 && existsSync(ENTRIES)) {
    rmSync(ENTRIES, { recursive: true });
  }

  return { copiedContracts, copiedEntries, conflicts };
}

function writeLedgerFiles(config: LedgerConfig, contractPathRel: string, contractContent: string, entryPathRel: string, entryContent: string, title: string) {
  if (config.storage.mode === "workspace") {
    ensureWorkspaceDirs();
    writeFileSync(join(ROOT, contractPathRel), contractContent, "utf8");
    writeFileSync(join(ROOT, entryPathRel), entryContent, "utf8");
    return {
      contractPath: join(ROOT, contractPathRel),
      entryPath: join(ROOT, entryPathRel),
      storageDescription: "workspace"
    };
  }

  if (!inGitRepo()) {
    throw new Error("storage.mode=git-branch requires a git repository. Use workspace mode or initialize git.");
  }

  const worktree = ensureLedgerWorktree(config.storage.branch);
  const contractPath = join(worktree, contractPathRel);
  const entryPath = join(worktree, entryPathRel);

  writeFileSync(contractPath, contractContent, "utf8");
  writeFileSync(entryPath, entryContent, "utf8");

  runGit(["-C", worktree, "add", contractPathRel, entryPathRel]);
  runGit(["-C", worktree, "commit", "-m", `ai-ledger: ${title}`]);

  return {
    contractPath,
    entryPath,
    storageDescription: `git branch ${config.storage.branch}`
  };
}

program
  .name("ai-ledger")
  .description("AI Ledger reference CLI")
  .version("0.2.0");

program
  .command("init")
  .description("Initialize .ai-ledger templates and config")
  .action(() => {
    ensureBaseDirs();
    ensureAgentsInstructions();

    const contractTpl = join(TEMPLATES, "contract.yaml");
    const entryTpl = join(TEMPLATES, "entry.md");

    if (!existsSync(contractTpl)) {
      writeFileSync(
        contractTpl,
        `id: "AILE-0001"
title: "Short descriptive title"
date: "YYYY-MM-DD"
author: "your name or handle"

intent:
  summary: "One sentence: what is supposed to change."
  reason: "Why this change is happening."
  risk_level: "low" # low | medium | high

scope:
  expected:
    - "src/**"
  forbidden:
    - "infra/**"
    - "auth/**"

verification:
  expected_tests:
    - "pnpm test"
    - "pnpm lint"
  manual_checks:
    - "Describe any manual checks expected"

review:
  requires_human_approval: true

links:
  entry: ".ai-ledger/entries/YYYY-MM-DD-slug.md"
`,
        "utf8"
      );
    }

    if (!existsSync(entryTpl)) {
      writeFileSync(
        entryTpl,
        `# AI Ledger Entry

- id: AILE-0001
- title: Short descriptive title
- date: YYYY-MM-DD
- contract: .ai-ledger/contracts/YYYY-MM-DD-slug.contract.yaml

## Intent summary
One sentence.

## Actual changes
What changed in reality.

## Files changed
- path/to/file

## Scope drift
- drift: no
- notes: ""

## Verification performed
- tests run:
  - ""
- manual checks:
  - ""

## Approval
- required: true
- approved_by: ""
- approved_at: ""
`,
        "utf8"
      );
    }

    if (!existsSync(CONFIG)) {
      writeDefaultConfig();
    }

    const config = readConfig();
    ensureLedgerReadme(config);
    ensureCiWorkflow(config);
    ensurePrePushHook(config);
    if (config.storage.mode === "workspace") {
      ensureWorkspaceDirs();
      console.log(`Initialized .ai-ledger (storage: ${config.storage.mode})`);
      return;
    }

    const migration = migrateWorkspaceLedgerToBranch(config.storage.branch);
    console.log(`Initialized .ai-ledger (storage: ${config.storage.mode})`);
    if (migration.copiedContracts > 0 || migration.copiedEntries > 0) {
      console.log(
        `Migrated existing records to ${config.storage.branch}: ${migration.copiedContracts} contract(s), ${migration.copiedEntries} entr${migration.copiedEntries === 1 ? "y" : "ies"}.`
      );
    }
    if (migration.conflicts.length > 0) {
      console.warn(
        `Skipped ${migration.conflicts.length} conflicting file(s) already present on ${config.storage.branch}: ${migration.conflicts.join(", ")}`
      );
    }
  });

program
  .command("new")
  .description("Create a new contract and entry from templates")
  .requiredOption("-t, --title <title>", "Title")
  .option("-i, --id <id>", "ID (defaults to timestamp-based)")
  .action((opts) => {
    if (!existsSync(BASE)) {
      console.error("Missing .ai-ledger. Run: ai-ledger init");
      process.exit(1);
    }
    ensureBaseDirs();

    const d = today();
    const slug = slugify(opts.title);
    const id = (opts.id as string | undefined) ?? `AILE-${Date.now()}`;
    const contractPathRel = `.ai-ledger/contracts/${d}-${slug}.contract.yaml`;
    const entryPathRel = `.ai-ledger/entries/${d}-${slug}.md`;

    const contractTpl = readFileSync(join(TEMPLATES, "contract.yaml"), "utf8")
      .replaceAll("AILE-0001", id)
      .replaceAll("YYYY-MM-DD", d)
      .replaceAll("Short descriptive title", opts.title)
      .replaceAll(".ai-ledger/entries/YYYY-MM-DD-slug.md", entryPathRel);

    const entryTpl = readFileSync(join(TEMPLATES, "entry.md"), "utf8")
      .replaceAll("AILE-0001", id)
      .replaceAll("YYYY-MM-DD", d)
      .replaceAll("Short descriptive title", opts.title)
      .replaceAll(".ai-ledger/contracts/YYYY-MM-DD-slug.contract.yaml", contractPathRel);

    const config = readConfig();
    const result = writeLedgerFiles(config, contractPathRel, contractTpl, entryPathRel, entryTpl, opts.title);

    console.log(`Created (${result.storageDescription}):`);
    console.log(`- ${result.contractPath}`);
    console.log(`- ${result.entryPath}`);
  });

program
  .command("check")
  .description("Basic checks: contracts/entries exist and are non-empty")
  .action(() => {
    const config = readConfig();

    if (config.storage.mode === "workspace") {
      if (!existsSync(CONTRACTS) || !existsSync(ENTRIES)) {
        console.error("Missing .ai-ledger folders. Run: ai-ledger init");
        process.exit(1);
      }
      const c = readdirSync(CONTRACTS).filter((f) => !f.startsWith("."));
      const e = readdirSync(ENTRIES).filter((f) => !f.startsWith("."));
      if (c.length === 0 || e.length === 0) {
        console.error("AI Ledger check failed: contracts/entries are empty.");
        process.exit(1);
      }
      console.log("AI Ledger check passed.");
      return;
    }

    if (!inGitRepo()) {
      console.error("AI Ledger check failed: git-branch storage requires a git repository.");
      process.exit(1);
    }

    const worktree = ensureLedgerWorktree(config.storage.branch);
    const c = readdirSync(join(worktree, ".ai-ledger/contracts")).filter((f) => !f.startsWith("."));
    const e = readdirSync(join(worktree, ".ai-ledger/entries")).filter((f) => !f.startsWith("."));
    if (c.length === 0 || e.length === 0) {
      console.error("AI Ledger check failed: contracts/entries are empty in ledger branch.");
      process.exit(1);
    }
    console.log(`AI Ledger check passed (${config.storage.branch}).`);
  });

program.parse(process.argv);
