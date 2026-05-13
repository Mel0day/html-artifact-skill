#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");
const home = os.homedir();
const argv = process.argv.slice(2);
const command = argv.find((arg) => !arg.startsWith("-")) || "install";
const flags = new Set(argv.filter((arg) => arg.startsWith("-")));

const help = `
html-artifact-skill

Install the html-artifact skill for Codex and Claude Code.

Usage:
  npx github:Mel0day/html-artifact-skill install
  npx html-artifact-skill install

Options:
  --codex-only    Install only Codex files
  --claude-only   Install only Claude Code files
  --force         Replace existing installed files
  --dry-run       Print planned changes without writing
  --help          Show this help
`;

if (flags.has("--help") || command === "help") {
  console.log(help.trim());
  process.exit(0);
}

if (command !== "install") {
  console.error(`Unknown command: ${command}`);
  console.error("Run with --help for usage.");
  process.exit(1);
}

const force = flags.has("--force");
const dryRun = flags.has("--dry-run");
const codexOnly = flags.has("--codex-only");
const claudeOnly = flags.has("--claude-only");

if (codexOnly && claudeOnly) {
  console.error("Choose at most one of --codex-only or --claude-only.");
  process.exit(1);
}

const targets = claudeOnly ? ["claude"] : codexOnly ? ["codex"] : ["codex", "claude"];
const installed = [];

function exists(filePath) {
  return fs.existsSync(filePath);
}

function prepareDestination(dest) {
  if (!exists(dest)) return;
  if (!force) {
    throw new Error(`${dest} already exists. Re-run with --force to replace it.`);
  }
  if (!dryRun) fs.rmSync(dest, { recursive: true, force: true });
}

function mkdirp(dir) {
  if (!dryRun) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  prepareDestination(dest);
  mkdirp(path.dirname(dest));
  if (!dryRun) fs.copyFileSync(src, dest);
}

function copyDir(src, dest, transformFile) {
  prepareDestination(dest);
  function walk(currentSrc, currentDest) {
    mkdirp(currentDest);
    for (const entry of fs.readdirSync(currentSrc, { withFileTypes: true })) {
      if (entry.name === ".DS_Store") continue;
      const childSrc = path.join(currentSrc, entry.name);
      const childDest = path.join(currentDest, entry.name);
      if (entry.isDirectory()) {
        walk(childSrc, childDest);
      } else if (entry.isFile()) {
        const transformed = transformFile ? transformFile(childSrc, fs.readFileSync(childSrc, "utf8")) : null;
        if (transformed === null || transformed === undefined) {
          if (!dryRun) fs.copyFileSync(childSrc, childDest);
        } else if (!dryRun) {
          fs.writeFileSync(childDest, transformed);
        }
      }
    }
  }
  walk(src, dest);
}

function installCodex() {
  const skillSrc = path.join(root, "html-artifact");
  const promptSrc = path.join(root, ".codex", "prompts", "html.md");
  const skillDest = path.join(home, ".agents", "skills", "html-artifact");
  const promptDest = path.join(home, ".codex", "prompts", "html.md");

  copyDir(skillSrc, skillDest);
  copyFile(promptSrc, promptDest);

  installed.push(`Codex skill: ${skillDest}`);
  installed.push(`Codex /html prompt: ${promptDest}`);
}

function installClaude() {
  const skillSrc = path.join(root, "html-artifact");
  const skillDest = path.join(home, ".claude", "skills", "html");

  copyDir(skillSrc, skillDest, (filePath, content) => {
    if (path.basename(filePath) !== "SKILL.md") return null;
    return content.replace(/^name:\s*html-artifact\s*$/m, "name: html");
  });

  installed.push(`Claude Code /html skill: ${skillDest}`);
}

try {
  for (const target of targets) {
    if (target === "codex") installCodex();
    if (target === "claude") installClaude();
  }

  console.log(dryRun ? "Dry run complete. Planned installs:" : "Installed html-artifact skill:");
  for (const line of installed) console.log(`- ${line}`);
  console.log("");
  console.log("Invoke with /html in supported agents.");
  console.log("If Claude Code was already running before ~/.claude/skills existed, restart Claude Code once.");
} catch (error) {
  console.error(`Install failed: ${error.message}`);
  process.exit(1);
}
