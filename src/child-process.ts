import type { SendHandle, Serializable } from 'node:child_process'

export interface ChildProcessListenerMap {
  readonly close: (code: number | null, signal: NodeJS.Signals | null) => void
  readonly disconnect: () => void
  readonly error: (err: Error) => void
  readonly exit: (code: number | null, signal: NodeJS.Signals | null) => void
  readonly message: (message: Serializable, sendHandle: SendHandle) => void
  readonly spawn: () => void
}

export type ChildProcessEventType = keyof ChildProcessListenerMap
