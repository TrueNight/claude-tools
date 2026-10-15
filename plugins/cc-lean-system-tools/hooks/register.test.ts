import { expect, test } from 'claude-code/testing'

const ENGINE = { plugin: 'engine', tier: 'core' } as const

const DEFAULT_LIST = ['Artifact', 'Workflow', 'ScheduleWakeup', 'ReportFindings', 'ReadNotifications', 'ListAgents', 'AskUserQuestion']

test('by default moves each listed tool behind ToolSearch', async ($, on) => {
  on('tool.describe', ($, e) => ({ description: e.description }))

  for (const tool of DEFAULT_LIST) {
    const placed = await $.tool.describe({ tool, description: `${tool} text`, provider: ENGINE })
    expect(placed.isDeferred).toBe(true)
    expect(placed.description).toBe(`${tool} text`)
  }
})

test('by default leaves other tools where the engine placed them', async ($, on) => {
  on('tool.describe', ($, e) => ({ description: e.description }))

  for (const tool of ['Bash', 'Read', 'Agent', 'ArtifactCheck', 'mcp__docs__Artifact']) {
    const placed = await $.tool.describe({ tool, description: 'x', provider: ENGINE })
    expect(placed.isDeferred).toBeUndefined()
  }
})

test('a configured list replaces the default one', { options: { defer: ['WebFetch', 'mcp__docs__read'] } }, async ($, on) => {
  on('tool.describe', ($, e) => ({ description: e.description }))

  for (const tool of ['WebFetch', 'mcp__docs__read']) {
    const placed = await $.tool.describe({ tool, description: 'x', provider: ENGINE })
    expect(placed.isDeferred).toBe(true)
  }
  const artifact = await $.tool.describe({ tool: 'Artifact', description: 'x', provider: ENGINE })
  expect(artifact.isDeferred).toBeUndefined()
})

test('a list saved by `claude plugin configure` as one string works too', { options: { defer: 'WebFetch, Artifact' } }, async ($, on) => {
  on('tool.describe', ($, e) => ({ description: e.description }))

  for (const tool of ['WebFetch', 'Artifact']) {
    const placed = await $.tool.describe({ tool, description: 'x', provider: ENGINE })
    expect(placed.isDeferred).toBe(true)
  }
  const workflow = await $.tool.describe({ tool: 'Workflow', description: 'x', provider: ENGINE })
  expect(workflow.isDeferred).toBeUndefined()
})

test('an empty list defers nothing', { options: { defer: [] } }, async ($, on) => {
  on('tool.describe', ($, e) => ({ description: e.description }))

  const placed = await $.tool.describe({ tool: 'Artifact', description: 'x', provider: ENGINE })
  expect(placed.isDeferred).toBeUndefined()
})
