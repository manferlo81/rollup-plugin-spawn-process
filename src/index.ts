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

export function spawnProcess(options?: SpawnProcessOptions): Plugin {

  options = options || {};

  const {
    command,
    file,
    args,
    key,
    storeGlobal,
    events: eventsOption,
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

  const resolveFilename: (options: NormalizedOutputOptions, bundle: OutputBundle) => string | null = (
    (file || file === null) ? () => file : (options, bundle) => {

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
  );

  let globalKey: boolean | string | null | undefined = storeGlobal;
  if (globalKey == null) {
    globalKey = !!process.env.ROLLUP_WATCH;
  }
  globalKey = !globalKey ? null : globalKey === true ? 'ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT' : globalKey;
  const context = !globalKey ? {} : global[globalKey] || (
    global[globalKey] = {}
  );

  const events: EventList = !eventsOption ? [] : Array.isArray(eventsOption) ? eventsOption : (Object.keys(eventsOption) as Array<keyof EventMap>).map((event) => ({
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
        for (let p = prevEvents.length - 1; p >= 0; p--) {
          const prevItem = prevEvents[p];
          prevProc.off(
            prevItem.event,
            prevItem.listener,
          );
        }
        prevProc.kill();
      }

      const filename = resolveFilename(
        outputOptions,
        bundle,
      );
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
        const eventItem = events[i];
        proc.on(
          eventItem.event,
          eventItem.listener,
        );
      }

      context[procKey] = { proc, events };

      if (setup) {
        setup(proc);
      }

    },
  };
}
