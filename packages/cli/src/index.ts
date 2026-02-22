#!/usr/bin/env node
import { Command } from "commander";
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const program = new Command();

const ROOT = process.cwd();
const BASE = join(ROOT, ".ai-ledger");
const CONTRACTS = join(BASE, "contracts");
const ENTRIES = join(BASE, "entries");
const TEMPLATES = join(BASE, "templates");

function ensureDirs() {
  mkdirSync(CONTRACTS, { recursive: true });
  mkdirSync(ENTRIES, { recursive: true });
  mkdirSync(TEMPLATES, { recursive: true });
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

program
  .name("ai-ledger")
  .description("AI Ledger reference CLI")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize .ai-ledger structure and templates")
  .action(() => {
    ensureDirs();

    const contractTpl = join(TEMPLATES, "contract.yaml");
    const entryTpl = join(TEMPLATES, "entry.md");
    const config = join(BASE, "config.json");

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

    if (!existsSync(config)) {
      writeFileSync(
        config,
        JSON.stringify(
          {
            version: "0.1",
            defaultRiskLevel: "low",
            requireHumanApproval: true
          },
          null,
          2
        ) + "\n",
        "utf8"
      );
    }

    console.log("Initialized .ai-ledger");
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
    ensureDirs();

    const d = today();
    const slug = slugify(opts.title);
    const id = (opts.id as string | undefined) ?? `AILE-${Date.now()}`;
    const contractPath = join(CONTRACTS, `${d}-${slug}.contract.yaml`);
    const entryPath = join(ENTRIES, `${d}-${slug}.md`);

    const contractTpl = readFileSync(join(TEMPLATES, "contract.yaml"), "utf8")
      .replaceAll("AILE-0001", id)
      .replaceAll("YYYY-MM-DD", d)
      .replaceAll("Short descriptive title", opts.title)
      .replaceAll(".ai-ledger/entries/YYYY-MM-DD-slug.md", `.ai-ledger/entries/${d}-${slug}.md`);

    const entryTpl = readFileSync(join(TEMPLATES, "entry.md"), "utf8")
      .replaceAll("AILE-0001", id)
      .replaceAll("YYYY-MM-DD", d)
      .replaceAll("Short descriptive title", opts.title)
      .replaceAll(".ai-ledger/contracts/YYYY-MM-DD-slug.contract.yaml", `.ai-ledger/contracts/${d}-${slug}.contract.yaml`);

    writeFileSync(contractPath, contractTpl, "utf8");
    writeFileSync(entryPath, entryTpl, "utf8");

    console.log("Created:");
    console.log(`- ${contractPath}`);
    console.log(`- ${entryPath}`);
  });

program
  .command("check")
  .description("Basic checks: append-only directories exist and are non-empty")
  .action(() => {
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
  });

program.parse(process.argv);