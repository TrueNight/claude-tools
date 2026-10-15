# cc-lean-system-tools

A Claude Code plugin that shrinks the tool definitions sent with every request by moving rarely used built-in tools behind ToolSearch.

Claude Code sends the full schema of each non-deferred built-in tool on every turn. Some of them are large and seldom used: the Artifact tool alone is about half of all the tool definitions sent upfront. This plugin marks these tools as deferred, so the model sees only their names and loads a schema through ToolSearch when it actually needs the tool:

- `Artifact`
- `Workflow`
- `ScheduleWakeup`
- `ReportFindings`
- `ReadNotifications`
- `ListAgents`
- `AskUserQuestion`

In the author's sessions this cut the tool definitions sent with each request by about 80%. Every tool stays available.

## Install

At the prompt of a terminal session:

```
/plugin install cc-lean-system-tools --marketplace TrueNight/claude-tools
```

Answer `y` to add the marketplace, then press Enter to install at the user scope.

From a shell:

```
claude plugin install cc-lean-system-tools --marketplace TrueNight/claude-tools
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `TrueNight/claude-tools`, then Add plugin.

## Checking it works

`/context` may keep showing the old "System tools" number. To see what a session really sends, open its transcript (`~/.claude/projects/<project>/<session-id>.jsonl`) and look at the `api-request-shape` record: its `shape.tools` entries without `defer_loading` are the tools sent in full.

## Changing the list

Edit `DEFERRED_TOOLS` in `hooks/register.ts`. To remove a tool from context entirely instead of deferring it, add its bare name to `permissions.deny` in `settings.json`.

## Notes

- Subagents may not be able to load a deferred built-in tool: [anthropics/claude-code#90085](https://github.com/anthropics/claude-code/issues/90085) reports that they have no ToolSearch. If your subagents rely on one of these tools, take it off the list.
- With a tool deferred, Claude reaches for it less often unprompted, since it only sees the tool's name. Ask for it by name when you want it.
- Built on the Claude Code plugin hooks API (`tool.describe`), which is in early access and may change between releases. Written against Claude Code 2.1.300.
