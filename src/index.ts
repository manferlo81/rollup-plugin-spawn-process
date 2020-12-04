import type { ChildProcess, SpawnOptions } from 'child_process';
import spawn from 'cross-spawn';
import { extname, resolve } from 'path';
import type { NormalizedOutputOptions, OutputBundle, Plugin } from 'rollup';

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

export interface SpawnProcessOptions extends SpawnOptions {
  command?: string;
  args?: readonly string[];
  key?: string;
  globalKey?: string;
  onBeforeCreate?: (proc: ChildProcess | null) => void;
  onCreated?: (proc: ChildProcess) => void;
}

export function spawnProcess(options: SpawnProcessOptions = {}): Plugin {

  const {
    command = 'node',
    args,
    key = 'spawn-process',
    globalKey,
    onBeforeCreate,
    onCreated,
    ...spawnOptions
  } = options;

  const context = !globalKey ? {} : global[globalKey] || (
    global[globalKey] = {}
  );

  return {
    name: 'spawn-process',
    writeBundle(options: NormalizedOutputOptions, bundle: OutputBundle) {

      const processArgs = resolveArgs(
        args,
        options,
        bundle,
      );

      if (onBeforeCreate) {
        onBeforeCreate(context[key] || null);
      }

      const proc = context[key] = spawn(
        command,
        processArgs,
        spawnOptions,
      );

      if (onCreated) {
        onCreated(proc);
      }

    },
  };
}
