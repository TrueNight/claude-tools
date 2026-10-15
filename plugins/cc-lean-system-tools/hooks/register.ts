import type { Register } from 'claude-code'

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// settings.json can hold the list as an array, but `claude plugin configure`
// saves it as one comma-separated string.
const toolNames = (value: unknown): string[] =>
  (Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [])
    .map(name => String(name).trim())
    .filter(name => name !== '')

// The `defer` option's default in plugin.json lists built-in tools few
// sessions call: carrying each full schema on every turn costs more than one
// ToolSearch load in the session that does. A user's list replaces it.
export const register: Register = (on, options) => {
  const tools = toolNames(options.defer)
  if (tools.length === 0) return

  const deferred = new RegExp(`^(${tools.map(escapeRegExp).join('|')})$`)

  on('tool.describe', { tool: deferred }, async ($, e, next) => ({
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
