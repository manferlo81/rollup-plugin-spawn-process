import type { ChildProcess, SpawnOptions } from 'child_process';
import spawn from 'cross-spawn';
import { extname, resolve } from 'path';
import type { NormalizedOutputOptions, OutputBundle, Plugin } from 'rollup';

export interface SpawnProcessOptions extends SpawnOptions {
  command?: string;
  args?: readonly string[];
  key?: string;
  storeGlobal?: string | boolean;
  setup?: (proc: ChildProcess) => void;
  cleanup?: (proc: ChildProcess | null) => void;
}

function resolveArgs(
  args: readonly string[] | undefined,
  options: NormalizedOutputOptions,
  bundle: OutputBundle,
): readonly string[] {
  if (args) {
    return args;
  }
  const { file } = options;
  if (file) {
    return [file];
  }
  const { dir } = options;
  if (!dir) {
    return [];
  }
  const filename = Object.values(bundle)
    .map((output): string | null => (
      output.type === 'chunk' ? output.fileName : null
    ))
    .filter((filename): filename is string => !!filename)
    .find((filename) => extname(filename) === '.js');
  return filename ? [resolve(dir, filename)] : [];
}

export function spawnProcess(options?: SpawnProcessOptions): Plugin {

  options = options || {};

  const {
    command,
    args,
    key,
    storeGlobal,
    cleanup,
    setup,
  } = options;

  const procKey = key || 'spawn-process';

  delete options.command;
  delete options.args;
  delete options.key;
  delete options.storeGlobal;
  delete options.setup;
  delete options.cleanup;

  const globalKey = !storeGlobal ? null : storeGlobal === true ? 'ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT' : storeGlobal;
  const context = !globalKey ? {} : global[globalKey] || (
    global[globalKey] = {}
  );

  return {
    name: 'spawn-process',
    writeBundle(outputOptions: NormalizedOutputOptions, bundle: OutputBundle) {

      if (cleanup) {
        cleanup(context[procKey] || null);
      }

      const proc = context[procKey] = spawn(
        command || 'node',
        resolveArgs(
          args,
          outputOptions,
          bundle,
        ),
        options,
      );

      if (setup) {
        setup(proc);
      }

    },
  };
}
