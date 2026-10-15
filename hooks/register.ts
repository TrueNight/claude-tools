import type { Register } from 'claude-code'

// Few sessions call these, so carrying each full schema on every turn costs
// more than one ToolSearch load in the session that does.
export const DEFERRED_TOOLS = [
  'Artifact',
  'Workflow',
  'ScheduleWakeup',
  'ReportFindings',
  'ReadNotifications',
  'ListAgents',
  'AskUserQuestion',
] as const

const DEFERRED = new RegExp(`^(${DEFERRED_TOOLS.join('|')})$`)

export const register: Register = on => {
  on('tool.describe', { tool: DEFERRED }, async ($, e, next) => ({
    ...(await next(e)),
    isDeferred: true,
  }))

  // A resumed session replays the tool placement it recorded; asking again
  // applies the deferral there too.
  on('session.start', ($, e, next) => {
    $.ui.invalidate('tool.describe')
    return next(e)
  })
}
