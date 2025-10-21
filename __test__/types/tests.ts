import type { ChildProcess, SendHandle, Serializable, SpawnOptions } from 'node:child_process'
import type { Plugin, PluginImpl } from 'rollup'
import type { EventItem, EventItemFromMap, EventList, EventMap, EventType, EventsObject, SpawnProcessOptions, spawnProcess } from '../../src'
import type { And, AssignableTo, Expect, StrictEquals } from './tools'

type PluginImplementation = typeof spawnProcess

type SetupCleanupCallback = (process: ChildProcess) => void

export type Results = And<[
  // Aliases
  Expect<StrictEquals<EventItemFromMap, EventItem>>,
  Expect<StrictEquals<EventItemFromMap<'close'>, EventItem<'close'>>>,
  Expect<StrictEquals<EventItemFromMap<'disconnect'>, EventItem<'disconnect'>>>,
  Expect<StrictEquals<EventItemFromMap<'error'>, EventItem<'error'>>>,
  Expect<StrictEquals<EventItemFromMap<'exit'>, EventItem<'exit'>>>,
  Expect<StrictEquals<EventItemFromMap<'message'>, EventItem<'message'>>>,
  Expect<StrictEquals<EventItemFromMap<'spawn'>, EventItem<'spawn'>>>,

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
  Expect<StrictEquals<SpawnProcessOptions['events'], EventsObject | EventList | undefined>>,
  Expect<AssignableTo<EventsObject, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<EventMap, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<Record<EventType, () => void>, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<{ close: EventMap['close'] }, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<{ disconnect: EventMap['disconnect'] }, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<{ error: EventMap['error'] }, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<{ exit: EventMap['exit'] }, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<{ message: EventMap['message'] }, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<{ spawn: EventMap['spawn'] }, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<EventList, SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<EventItem[], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[EventItem, EventItem], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<readonly EventItem[], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<readonly [EventItem, EventItem], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[EventItem<'close'>], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[EventItem<'disconnect'>], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[EventItem<'error'>], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[EventItem<'exit'>], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[EventItem<'message'>], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[EventItem<'spawn'>], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<[{ event: EventType, listener: () => void }], SpawnProcessOptions['events']>>,
  Expect<AssignableTo<undefined, SpawnProcessOptions['events']>>,

  Expect<StrictEquals<EventsObject, Partial<EventMap>>>,
  Expect<StrictEquals<EventList, readonly EventItem[]>>,

  Expect<StrictEquals<EventItem, EventItem<'message'> | EventItem<'error'> | EventItem<'disconnect'> | EventItem<'close'> | EventItem<'exit'> | EventItem<'spawn'>>>,
  Expect<StrictEquals<EventItem<'close'>, { event: 'close', listener: EventMap['close'] }>>,
  Expect<StrictEquals<EventItem<'disconnect'>, { event: 'disconnect', listener: EventMap['disconnect'] }>>,
  Expect<StrictEquals<EventItem<'error'>, { event: 'error', listener: EventMap['error'] }>>,
  Expect<StrictEquals<EventItem<'exit'>, { event: 'exit', listener: EventMap['exit'] }>>,
  Expect<StrictEquals<EventItem<'message'>, { event: 'message', listener: EventMap['message'] }>>,
  Expect<StrictEquals<EventItem<'spawn'>, { event: 'spawn', listener: EventMap['spawn'] }>>,

  Expect<AssignableTo<EventMap, object>>,
  Expect<StrictEquals<keyof EventMap, EventType>>,
  Expect<StrictEquals<EventType, 'close' | 'disconnect' | 'error' | 'exit' | 'message' | 'spawn'>>,
  Expect<StrictEquals<EventMap['close'], (code: number | null, signal: NodeJS.Signals | null) => void>>,
  Expect<StrictEquals<EventMap['disconnect'], () => void>>,
  Expect<StrictEquals<EventMap['error'], (error: Error) => void>>,
  Expect<StrictEquals<EventMap['exit'], (code: number | null, signal: NodeJS.Signals | null) => void>>,
  Expect<StrictEquals<EventMap['message'], (message: Serializable, sendHandle: SendHandle) => void>>,
  Expect<StrictEquals<EventMap['spawn'], () => void>>,

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
