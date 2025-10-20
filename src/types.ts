import type { ChildProcess, SpawnOptions } from 'node:child_process'
import type { Server, Socket } from 'node:net'

interface SerializeCapableObject {
  [K: string]: SerializeCapable
}
type SerializeCapable = string | SerializeCapableObject | number | boolean

export interface EventMap {
  close: (code: number, signal: NodeJS.Signals) => void
  disconnect: () => void
  error: (error: Error) => void
  exit: (code: number | null, signal: NodeJS.Signals | null) => void
  message: (message: SerializeCapable, sendHandle: Socket | Server) => void
}

export type EventType = keyof EventMap

interface EventItemFromType<T extends EventType> {
  event: T
  listener: EventMap[T]
}
export type EventItem<T extends EventType = EventType> = T extends EventType ? EventItemFromType<T> : never
export type EventList = readonly EventItem[]

export interface SpawnProcessOptions extends SpawnOptions {
  command?: string
  file?: string | null
  args?: readonly string[]
  key?: string
  global?: boolean | string
  events?: Partial<EventMap> | EventList
  setup?: (proc: ChildProcess) => void
  cleanup?: (proc: ChildProcess) => void
}
