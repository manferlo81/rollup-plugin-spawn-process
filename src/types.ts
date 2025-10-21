import type { ChildProcess, SpawnOptions } from 'node:child_process'
import type { ChildProcessEventType, ChildProcessListenerMap } from './child-process'

export type EventsObject = Partial<ChildProcessListenerMap>

interface SpecificEventItem<T extends ChildProcessEventType> {
  event: T
  listener: ChildProcessListenerMap[T]
}

export type EventItem<T extends ChildProcessEventType = ChildProcessEventType> = T extends ChildProcessEventType ? SpecificEventItem<T> : never
export type EventList = readonly EventItem[]

export interface SpawnProcessOptions extends SpawnOptions {
  readonly command?: string
  readonly file?: string | null
  readonly args?: readonly string[]
  readonly key?: string
  readonly global?: boolean | string
  readonly events?: EventsObject | EventList
  readonly setup?: (proc: ChildProcess) => void
  readonly cleanup?: (proc: ChildProcess) => void
}
