import { expect, test } from 'claude-code/testing'

const ENGINE = { plugin: 'engine', tier: 'core' } as const

test('moves each listed tool behind ToolSearch', async ($, on) => {
  on('tool.describe', ($, e) => ({ description: e.description }))

  for (const tool of ['Artifact', 'Workflow', 'ScheduleWakeup', 'ReportFindings', 'ReadNotifications', 'ListAgents', 'AskUserQuestion']) {
    const placed = await $.tool.describe({ tool, description: `${tool} text`, provider: ENGINE })
    expect(placed.isDeferred).toBe(true)
    expect(placed.description).toBe(`${tool} text`)
  }
})

test('leaves other tools where the engine placed them', async ($, on) => {
  on('tool.describe', ($, e) => ({ description: e.description }))

  for (const tool of ['Bash', 'Read', 'Agent', 'ArtifactCheck', 'mcp__docs__Artifact']) {
    const placed = await $.tool.describe({ tool, description: 'x', provider: ENGINE })
    expect(placed.isDeferred).toBeUndefined()
  }
})
