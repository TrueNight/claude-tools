# claude-tools

Claude Code plugins by TrueNight, published as a plugin marketplace.

| Plugin | What it does |
| --- | --- |
| [cc-lean-system-tools](plugins/cc-lean-system-tools) | Moves rarely used built-in tools behind ToolSearch, cutting the tool definitions sent with each request by about 80% |

## Install a plugin

At the prompt of a terminal session:

```
/plugin install <plugin> --marketplace TrueNight/claude-tools
```

Answer `y` to add the marketplace, then press Enter to install at the user scope.

From a shell:

```
claude plugin install <plugin> --marketplace TrueNight/claude-tools
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `TrueNight/claude-tools`, then Add plugin.
