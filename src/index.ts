import type { ChildProcess, SpawnOptions } from 'child_process';
import spawn from 'cross-spawn';
import type { Server, Socket } from 'net';
import { extname, resolve } from 'path';
import type { NormalizedOutputOptions, OutputBundle, Plugin } from 'rollup';

interface SerializeCapableObject {
  [K: string]: SerializeCapable;
}
type SerializeCapable = string | SerializeCapableObject | number | boolean;

export interface EventMap {
  close: (code: number, signal: NodeJS.Signals) => void;
  disconnect: () => void;
  error: (err: Error) => void;
  exit: (code: number | null, signal: NodeJS.Signals | null) => void;
  message: (message: SerializeCapable, sendHandle: Socket | Server) => void;
}

export interface EventItemFromMap<K extends keyof EventMap> {
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
  storeGlobal?: boolean | string;
  events?: Partial<EventMap> | EventList;
  setup?: (proc: ChildProcess) => void;
  cleanup?: (proc: ChildProcess) => void;
}

function resolveFile(
  options: NormalizedOutputOptions,
  bundle: OutputBundle,
): string | null {

  const { file } = options;
  if (file) {
    return file;
  }

  const { dir } = options;
  if (!dir) {
    return null;
  }

  const filename = Object.values(bundle)
    .map((output): string | null => (
      output.type === 'chunk' ? output.fileName : null
    ))
    .filter((filename): filename is string => !!filename)
    .find((filename) => extname(filename) === '.js');

  return filename ? resolve(dir, filename) : null;

}

export function spawnProcess(options?: SpawnProcessOptions): Plugin {

  options = options || {};

  const {
    command,
    file,
    args,
    key,
    storeGlobal,
    events,
    cleanup,
    setup,
  } = options;

  const procKey = key || 'spawn-process';

  delete options.command;
  delete options.file;
  delete options.args;
  delete options.key;
  delete options.storeGlobal;
  delete options.events;
  delete options.setup;
  delete options.cleanup;

  let globalKey: boolean | string | null | undefined = storeGlobal;
  if (globalKey == null) {
    globalKey = !!process.env.ROLLUP_WATCH;
  }
  globalKey = !globalKey ? null : globalKey === true ? 'ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT' : globalKey;
  const context = !globalKey ? {} : global[globalKey] || (
    global[globalKey] = {}
  );

  const eventList: EventList = !events ? [] : Array.isArray(events) ? events : (Object.keys(events) as Array<keyof EventMap>).map((event) => ({
    event,
    listener: events[event] as never,
  }));
  const eventListLength = eventList.length;

  return {
    name: 'spawn-process',
    writeBundle(outputOptions, bundle) {

      const prevProc = context[procKey];

      if (prevProc) {
        if (cleanup) {
          cleanup(prevProc);
        }
        if (eventListLength > 0) {
          for (let i = eventListLength - 1; i >= 0; i--) {
            const item = eventList[i];
            prevProc.off(item.event, item.listener);
          }
        }
        prevProc.kill();
      }

      const filename = file || file === null ? file : resolveFile(outputOptions, bundle);
      const spawnArgs = filename ? [filename] : [];

      if (args) {
        spawnArgs.push(...args);
      }

      const proc = context[procKey] = spawn(
        command || 'node',
        spawnArgs,
        options,
      );

      if (eventListLength > 0) {
        for (let i = 0; i < eventListLength; i++) {
          const item = eventList[i];
          proc.on(item.event, item.listener);
        }
      }

      if (setup) {
        setup(proc);
      }

    },
  };
}
