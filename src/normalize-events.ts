import type { ChildProcessEventType } from './child-process'
import type { EventItem, EventList, SpawnProcessOptions } from './types'

export function normalizeEventList(events: SpawnProcessOptions['events']): EventList {
  if (!events) return []
  if (Array.isArray(events)) return events as EventList
  const entries = Object.entries(events) as Array<[ChildProcessEventType, never]>
  return entries.map<EventItem>(([event, listener]) => ({ event, listener }))
}
