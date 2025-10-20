import type { ChildProcess, SpawnOptions } from 'node:child_process'
import type { Server, Socket } from 'node:net'
import type { Plugin, PluginImpl } from 'rollup'
import type { EventItem, EventItemFromMap, EventList, EventMap, EventType, SpawnProcessOptions, spawnProcess } from '../../src'
import type { And, AssignableTo, Expect, StrictEquals } from './tools'

type PluginImplementation = typeof spawnProcess

type SetupCleanupCallback = (process: ChildProcess) => void

interface SerializableObject {
  [K: string]: Serializable
}
type Serializable = string | number | boolean | SerializableObject

export type Results = And<[
  // Implementation
  Expect<StrictEquals<PluginImplementation, PluginImpl<SpawnProcessOptions>>>,
  Expect<StrictEquals<ReturnType<PluginImplementation>, Plugin>>,

  // Options
  Expect<AssignableTo<SpawnProcessOptions, SpawnOptions>>,
  Expect<AssignableTo<keyof SpawnOptions, keyof SpawnProcessOptions>>,
  Expect<StrictEquals<Exclude<keyof SpawnProcessOptions, keyof SpawnOptions>, 'command' | 'file' | 'args' | 'setup' | 'cleanup' | 'events' | 'key' | 'global'>>,

  // "command" option
  Expect<StrictEquals<SpawnProcessOptions['command'], string | undefined>>,
  Expect<AssignableTo<string, SpawnProcessOptions['command']>>,
  Expect<AssignableTo<'some string', SpawnProcessOptions['command']>>,
  Expect<AssignableTo<undefined, SpawnProcessOptions['command']>>,

  // "file" option
  Expect<StrictEquals<SpawnProcessOptions['file'], string | null | undefined>>,
  Expect<AssignableTo<string, SpawnProcessOptions['file']>>,
  Expect<AssignableTo<'some string', SpawnProcessOptions['file']>>,
  Expect<AssignableTo<null, SpawnProcessOptions['file']>>,
  Expect<AssignableTo<undefined, SpawnProcessOptions['file']>>,

  // "args" option
  Expect<StrictEquals<SpawnProcessOptions['args'], readonly string[] | undefined>>,
  Expect<AssignableTo<string[], SpawnProcessOptions['args']>>,
  Expect<AssignableTo<['some string 1', 'some string 2'], SpawnProcessOptions['args']>>,
  Expect<AssignableTo<readonly string[], SpawnProcessOptions['args']>>,
  Expect<AssignableTo<readonly ['some string 1', 'some string 2'], SpawnProcessOptions['args']>>,
  Expect<AssignableTo<undefined, SpawnProcessOptions['args']>>,

  // "setup" option
  Expect<StrictEquals<SpawnProcessOptions['setup'], SetupCleanupCallback | undefined>>,
  Expect<AssignableTo<SetupCleanupCallback, SpawnProcessOptions['setup']>>,
  Expect<AssignableTo<(process: ChildProcess) => void, SpawnProcessOptions['setup']>>,
  Expect<AssignableTo<() => void, SpawnProcessOptions['setup']>>,
  Expect<AssignableTo<undefined, SpawnProcessOptions['setup']>>,

  // "cleanup" option
  Expect<StrictEquals<SpawnProcessOptions['cleanup'], SetupCleanupCallback | undefined>>,
  Expect<AssignableTo<SetupCleanupCallback, SpawnProcessOptions['cleanup']>>,
  Expect<AssignableTo<(process: ChildProcess) => void, SpawnProcessOptions['cleanup']>>,
  Expect<AssignableTo<() => void, SpawnProcessOptions['cleanup']>>,
  Expect<AssignableTo<undefined, SpawnProcessOptions['cleanup']>>,

  // "events" option
  Expect<StrictEquals<SpawnProcessOptions['events'], Partial<EventMap> | EventList | undefined>>,
  Expect<AssignableTo<Partial<EventMap>, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<EventMap, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<Record<EventType, () => void>, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<{ message: EventMap['message'] }, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<{ error: EventMap['error'] }, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<{ disconnect: EventMap['disconnect'] }, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<{ close: EventMap['close'] }, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<{ exit: EventMap['exit'] }, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<EventList, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<EventItem[], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[EventItem, EventItem], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<readonly EventItem[], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<readonly [EventItem, EventItem], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[EventItemFromMap<'message'>], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[EventItemFromMap<'error'>], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[EventItemFromMap<'disconnect'>], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[EventItemFromMap<'close'>], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[EventItemFromMap<'exit'>], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[{ event: EventType, listener: () => void }], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<undefined, SpawnProcessOptions['events']>>,

  Expect<StrictEquals<EventList, readonly EventItem[]>>,
  Expect<StrictEquals<EventItem, EventItemFromMap<'message'> | EventItemFromMap<'error'> | EventItemFromMap<'disconnect'> | EventItemFromMap<'close'> | EventItemFromMap<'exit'>>>,
  Expect<StrictEquals<EventItemFromMap<'message'>, { event: 'message', listener: EventMap['message'] }>>,
  Expect<StrictEquals<EventItemFromMap<'error'>, { event: 'error', listener: EventMap['error'] }>>,
  Expect<StrictEquals<EventItemFromMap<'disconnect'>, { event: 'disconnect', listener: EventMap['disconnect'] }>>,
  Expect<StrictEquals<EventItemFromMap<'close'>, { event: 'close', listener: EventMap['close'] }>>,
  Expect<StrictEquals<EventItemFromMap<'exit'>, { event: 'exit', listener: EventMap['exit'] }>>,

  Expect<AssignableTo<EventMap, object>>,
  Expect<StrictEquals<keyof EventMap, EventType>>,
  Expect<StrictEquals<EventType, 'message' | 'error' | 'disconnect' | 'close' | 'exit'>>,
  Expect<StrictEquals<EventMap['message'], (message: Serializable, sendHandle: Socket | Server) => void>>,
  Expect<StrictEquals<EventMap['error'], (error: Error) => void>>,
  Expect<StrictEquals<EventMap['disconnect'], () => void>>,
  Expect<StrictEquals<EventMap['close'], (code: number, signal: NodeJS.Signals) => void>>,
  Expect<StrictEquals<EventMap['exit'], (code: number | null, signal: NodeJS.Signals | null) => void>>,

  // "key" option
  Expect<StrictEquals<SpawnProcessOptions['key'], string | undefined>>,
  Expect<AssignableTo<string, SpawnProcessOptions['key']>>,
  Expect<AssignableTo<'some string', SpawnProcessOptions['key']>>,
  Expect<AssignableTo<undefined, SpawnProcessOptions['key']>>,

  // "global" option
  Expect<StrictEquals<SpawnProcessOptions['global'], string | boolean | undefined>>,
  Expect<AssignableTo<string, SpawnProcessOptions['global']>>,
  Expect<AssignableTo<'some string', SpawnProcessOptions['global']>>,
  Expect<AssignableTo<boolean, SpawnProcessOptions['global']>>,
  Expect<AssignableTo<true, SpawnProcessOptions['global']>>,
  Expect<AssignableTo<false, SpawnProcessOptions['global']>>,
  Expect<AssignableTo<undefined, SpawnProcessOptions['global']>>,
]>
