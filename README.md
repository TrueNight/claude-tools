# defer-rare-tools

A Claude Code mod that shrinks the tool definitions sent with every request by moving rarely used built-in tools behind ToolSearch.

Claude Code sends the full schema of each non-deferred built-in tool on every turn. Some of them are large and seldom used: the Artifact tool alone is about 9k tokens. This mod marks these tools as deferred, so the model sees only their names and loads a schema through ToolSearch when it actually needs the tool:

- `Artifact`
- `Workflow`
- `ScheduleWakeup`
- `ReportFindings`
- `ReadNotifications`
- `ListAgents`
- `AskUserQuestion`

In the author's sessions this cut the upfront tool definitions from about 17.8k to 3.3k tokens per request. Every tool stays available.

## Install

At the prompt of a terminal session:

```
/plugin install defer-rare-tools --marketplace TrueNight/claude-reduced-system-prompt
```

Answer `y` to add the marketplace, then press Enter to install at the user scope.

From a shell:

```
claude plugin install defer-rare-tools --marketplace TrueNight/claude-reduced-system-prompt
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `TrueNight/claude-reduced-system-prompt`, then Add plugin.

## Checking it works

`/context` may keep showing the old "System tools" number. To see what a session really sends, open its transcript (`~/.claude/projects/<project>/<session-id>.jsonl`) and look at the `api-request-shape` record: its `shape.tools` entries without `defer_loading` are the tools sent in full.

## Changing the list

Edit `DEFERRED_TOOLS` in `hooks/register.ts`. To remove a tool from context entirely instead of deferring it, add its bare name to `permissions.deny` in `settings.json`.

## Notes

- Built on the Claude Code plugin hooks API (`tool.describe`), which is in early access and may change between releases. Written against Claude Code 2.1.300.
- With a tool deferred, Claude reaches for it less often unprompted, since it only sees the tool's name. Ask for it by name when you want it.
