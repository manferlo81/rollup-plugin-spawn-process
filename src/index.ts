import type { ChildProcess, SpawnOptions } from 'child_process';
import spawn from 'cross-spawn';
import type { Server, Socket } from 'net';
import { extname, join } from 'path';
import type { NormalizedOutputOptions, OutputBundle, Plugin } from 'rollup';

interface SerializeCapableObject {
  [K: string]: SerializeCapable;
}
type SerializeCapable = string | SerializeCapableObject | number | boolean;

export interface EventMap {
  close: (code: number, signal: NodeJS.Signals) => void;
  disconnect: () => void;
  error: (error: Error) => void;
  exit: (code: number | null, signal: NodeJS.Signals | null) => void;
  message: (message: SerializeCapable, sendHandle: Socket | Server) => void;
}

export type EventType = keyof EventMap;

export interface EventItemFromMap<K extends EventType> {
  event: K;
  listener: EventMap[K];
}

export type EventItem =
  | EventItemFromMap<'close'>
  | EventItemFromMap<'disconnect'>
  | EventItemFromMap<'error'>
  | EventItemFromMap<'exit'>
  | EventItemFromMap<'message'>;

export type EventList = Array<EventItem>;

export interface SpawnProcessOptions extends SpawnOptions {
  command?: string;
  file?: string | null;
  args?: readonly string[];
  key?: string;
  global?: boolean | string;
  events?: Partial<EventMap> | EventList;
  setup?: (proc: ChildProcess) => void;
  cleanup?: (proc: ChildProcess) => void;
}

function resolveFileFromBuild(options: NormalizedOutputOptions, bundle: OutputBundle): string {

  const { file } = options;
  if (file) {
    return file;
  }

  const filename = Object.values(bundle)
    .map((output): string | null => (
      output.type === 'chunk' ? output.fileName : null
    ))
    .filter((filename): filename is string => !!filename)
    .find((filename) => extname(filename) === '.js');

  return join(
    options.dir as string,
    filename as string,
  );

}

export function spawnProcess(options?: SpawnProcessOptions): Plugin {

  options = options || {};

  const {
    command,
    file,
    args,
    key,
    global: storeGlobal,
    events: eventsOption,
    setup,
    cleanup,
  } = options;

  const procKey = key || 'spawn-process';

  delete options.command;
  delete options.file;
  delete options.args;
  delete options.key;
  delete options.global;
  delete options.events;
  delete options.setup;
  delete options.cleanup;

  const resolveFilename: (options: NormalizedOutputOptions, bundle: OutputBundle) => string | null = (
    (file || file === null)
      ? () => file
      : resolveFileFromBuild
  );

  let globalKey: boolean | string | null | undefined = storeGlobal;
  if (globalKey == null) {
    globalKey = !!process.env.ROLLUP_WATCH;
  }
  globalKey = !globalKey ? null : globalKey === true ? 'ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT' : globalKey;

  const context = !globalKey ? {} : global[globalKey] || (
    global[globalKey] = {}
  );

  const events: EventList = !eventsOption ? [] : Array.isArray(eventsOption) ? eventsOption : (Object.keys(eventsOption) as Array<EventType>).map((event) => ({
    event,
    listener: eventsOption[event] as never,
  }));
  const { length: eventsLength } = events;

  return {
    name: 'spawn-process',
    writeBundle(outputOptions, bundle) {

      const stored = context[procKey];

      if (stored) {
        const { proc: prevProc, events: prevEvents } = stored;
        if (cleanup) {
          cleanup(prevProc);
        }
        const { length: prevEventsLength } = prevEvents;
        for (let p = prevEventsLength - 1; p >= 0; p--) {
          const { event, listener } = prevEvents[p];
          prevProc.off(event, listener);
        }
        prevProc.kill();
      }

      const filename = resolveFilename(outputOptions, bundle);
      const spawnArgs = filename ? [filename] : [];

      if (args) {
        spawnArgs.push(...args);
      }

      const proc = spawn(
        command || 'node',
        spawnArgs,
        options,
      );

      for (let i = 0; i < eventsLength; i++) {
        const { event, listener } = events[i];
        proc.on(event, listener);
      }

      context[procKey] = { proc, events };

      if (setup) {
        setup(proc);
      }

    },
  };
}
