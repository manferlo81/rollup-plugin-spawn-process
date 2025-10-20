import type { ChildProcess } from 'node:child_process'
import type { EventList } from './types'

export interface ProcessStored {
  proc: ChildProcess
  events: EventList
}

export type Context = Partial<Record<string, ProcessStored>>
export type GlobalObject = typeof global & Partial<Record<string, Context>>
