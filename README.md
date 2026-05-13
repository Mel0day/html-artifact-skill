# HTML Artifact Skill

[English](README.md) | [中文](README.zh-CN.md)

`html-artifact` turns already-produced complex Human-Agent output into a self-contained, reading-first HTML artifact.

It is designed for moments when a plan, research summary, code review, tradeoff, decision tree, or long explanation is too dense to hand back as plain chat or Markdown. The skill does not redo the upstream thinking. It restructures the existing substance into a portable HTML file that a human can read quickly, navigate, and hand back to an agent or memory system through Markdown export.

## Why This Skill Exists

Karpathy's HTML prompt pattern proves that HTML is a strong medium for agent output. This skill turns that one-off trick into a reusable output protocol.

Appending "structure this as HTML" to a prompt can work, but the result is inconsistent: sometimes it is only Markdown wrapped in HTML, sometimes it becomes decorative, sometimes it forgets export, and sometimes it leaks into app-building or upstream analysis. `html-artifact` gives the agent stable defaults: structure before style, reading before interaction, self-contained files, no remote dependencies, and Markdown export for handoff.

Use a prompt line for one-off experiments. Install the skill when you frequently ask agents to produce complex plans, reviews, research summaries, comparisons, or decision records and want a predictable way to turn them into readable, portable artifacts.

In short: HTML is the human reading layer; Markdown export is the agent and memory handoff layer.

## What It Produces

- A single `.html` file saved by default under `artifacts/html/{timestamp}-{topic}.html`
- Inline CSS and JavaScript only
- No CDN, remote scripts, analytics, network requests, remote fonts, or build step
- A clear top-line answer, scan-friendly structure, and lightweight local interactions
- Optional embedded Markdown export, usually exposed through a `Copy Markdown` button

## What It Is Not

- Not a web app generator
- Not a dashboard framework
- Not a template engine
- Not an upstream research, planning, or review agent
- Not a transcript-to-HTML wrapper

## Installation

Copy the skill folder into your agent skill root:

```bash
mkdir -p ~/.agents/skills
cp -R html-artifact ~/.agents/skills/html-artifact
```

Optional Codex slash prompt:

```bash
mkdir -p ~/.codex/prompts
cp .codex/prompts/html.md ~/.codex/prompts/html.md
```

After installation, invoke it with:

```text
/html
```

You can also provide a topic or content hint:

```text
/html turn this code review into a readable artifact
```

## Recommended Use Cases

- Product plans and execution plans
- Research summaries and source-backed briefs
- Option comparisons and tradeoff decisions
- Code review findings
- Architecture decisions
- Long explanations that need layers, navigation, or expandable detail
- Conversation synthesis where the useful substance is scattered across many turns

## Output Quality Bar

An artifact is considered successful when:

1. The reader can understand the topic and conclusion within five seconds.
2. The structure is clearer than the source output.
3. The interactions reduce reading or handoff effort.
4. The file is portable and self-contained.
5. The result can continue the Human-Agent loop through copy/export affordances.

## Repository Contents

```text
html-artifact/
  SKILL.md                         # Skill instructions
  agents/openai.yaml               # Optional agent metadata
  examples/complex-output-draft.md # Example source content
  examples/output-shape.md         # Expected artifact shape
.codex/prompts/html.md             # Optional /html slash prompt
README.md                          # English documentation
README.zh-CN.md                    # Chinese documentation
```

## Packaging

This repository includes a distributable archive under `dist/` after packaging:

```bash
mkdir -p dist
zip -r dist/html-artifact-skill-v0.1.0.zip html-artifact .codex README.md README.zh-CN.md CHANGELOG.md LICENSE -x "*.DS_Store"
```

## Design Principles

- Reading first, interaction second
- Structure before style
- Preserve substance, not full transcripts
- Keep local files portable
- Use light interactions only when they help comprehension
- Export concise Markdown for agent handoff or Obsidian-style memory storage

## License

MIT
