import crossSpawn from 'cross-spawn';
import type { NormalizedOutputOptions, OutputBundle, Plugin } from 'rollup';
import { normalizeEventList } from './normalize-events';
import { resolveFileFromBuild } from './resolve-file';
import type { EventList, ProcessStored, SpawnProcessOptions } from './types';

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
    ...spawnOptions
  } = options;

  const procKey = key || 'spawn-process';

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

  const g = global as unknown as Record<string, Record<string, ProcessStored>>;
  const context = !globalKey ? {} : g[globalKey] || (
    g[globalKey] = {}
  );

  const events: EventList = normalizeEventList(eventsOption);
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

      const proc = crossSpawn(
        command || 'node',
        spawnArgs,
        spawnOptions,
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
