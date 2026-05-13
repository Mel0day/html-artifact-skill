# HTML Artifact Skill

[English](README.md) | [中文](README.zh-CN.md)

`html-artifact` 用来把已经产出的复杂 Human-Agent 内容，整理成自包含、阅读优先的 HTML Artifact。

它适合处理计划、调研总结、代码审查、方案对比、决策树、长解释等内容。这个 skill 不负责重新做上游分析，也不是把聊天记录原样套一层 HTML；它只把已经形成的关键 substance 重新组织成更适合人阅读、导航和继续协作的 HTML 文件。

## 为什么需要这个 skill

Karpathy 那个 HTML prompt pattern 证明了 HTML 是很适合 agent 输出的介质。这个 skill 的价值，是把一次性的 prompt 技巧固化成可复用的输出协议。

在提示词后面加一句“请用 HTML 结构化输出”确实能工作，但结果不稳定：有时只是 Markdown 套 HTML，有时变成花哨页面，有时忘了导出，有时跑偏成前端项目或重新分析。`html-artifact` 给 agent 一组稳定默认值：先结构后样式、先阅读后交互、单文件自包含、无远程依赖，并提供 Markdown Export 用于回传。

一次性实验，用一句 prompt 就够了。高频让 agent 产出复杂计划、审查、调研总结、方案对比、决策记录时，安装这个 skill 的价值是让 `/html` 代表一整套稳定偏好和质量下限。

一句话：HTML 是给人读的表达层；Markdown Export 是给 Agent 和记忆系统继续使用的回传层。

## 产物是什么

- 默认保存为 `artifacts/html/{timestamp}-{topic}.html`
- 单文件 HTML，CSS 和 JavaScript 都内联
- 不使用 CDN、远程脚本、统计、网络请求、远程字体或构建步骤
- 顶部快速给出主题、结论和结构
- 可包含轻交互：目录、筛选、折叠、复制按钮、主题切换等
- 可包含 Markdown Export，用于回传给 Agent 或放入 Obsidian / 记忆系统

## 不是什么

- 不是前端项目生成器
- 不是 dashboard 框架
- 不是模板引擎
- 不是调研、规划、审查本身
- 不是 transcript 转 HTML

## 安装

把 skill 目录复制到本地 agent skill 根目录：

```bash
mkdir -p ~/.agents/skills
cp -R html-artifact ~/.agents/skills/html-artifact
```

可选：安装 Codex 的 `/html` slash prompt：

```bash
mkdir -p ~/.codex/prompts
cp .codex/prompts/html.md ~/.codex/prompts/html.md
```

安装后可以这样调用：

```text
/html
```

也可以附带主题或内容提示：

```text
/html 把这个代码审查整理成可阅读的 HTML Artifact
```

## 适合场景

- 产品计划和执行计划
- 调研总结和资料 brief
- 方案对比和取舍决策
- 代码审查结论
- 架构决策
- 需要分层阅读的长解释
- 多轮对话后的结构化总结

## 成功标准

一个 HTML Artifact 应该满足：

1. 打开 5 秒内能看懂主题和结论。
2. 结构比原始输出更清楚。
3. 轻交互确实降低阅读或 handoff 成本。
4. 文件可携带、可归档、自包含。
5. 能通过复制或导出继续 Human-Agent 协作。

## 仓库内容

```text
html-artifact/
  SKILL.md                         # skill 指令
  agents/openai.yaml               # 可选 agent 元数据
  examples/complex-output-draft.md # 示例输入
  examples/output-shape.md         # 预期输出结构
.codex/prompts/html.md             # 可选 /html slash prompt
README.md                          # 英文文档
README.zh-CN.md                    # 中文文档
```

## 打包

发布包会放在 `dist/` 下：

```bash
mkdir -p dist
zip -r dist/html-artifact-skill-v0.1.0.zip html-artifact .codex README.md README.zh-CN.md CHANGELOG.md LICENSE -x "*.DS_Store"
```

## 设计原则

- 阅读优先，交互其次
- 先做结构，再做样式
- 保留关键 substance，不搬运完整 transcript
- 单文件、可携带、无远程依赖
- 轻交互必须服务理解
- Markdown Export 用于 Agent 回传和 Obsidian 记忆存储

## License

MIT
