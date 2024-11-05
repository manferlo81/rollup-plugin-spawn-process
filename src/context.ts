import type { Context, GlobalObject } from './types';

function resolveGlobalKey(option?: string | boolean): string | null {

  // normalize global key from option
  const globalKey = option == null ? Boolean(process.env.ROLLUP_WATCH) : option;

  // return null if key if not a string or true
  if (!globalKey) return null;

  // return default global key if key is true
  if (globalKey === true) return 'ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT';

  // return global key as string
  return globalKey;

}

function getContextFromGlobal(globalKey: string | null): Context {

  // return empty context if no global key provided
  if (!globalKey) return {};

  // get existing context from global
  const globalObject = global as GlobalObject;
  const existingContext = globalObject[globalKey];

  // return existing context if defined
  if (existingContext) return existingContext;

  // return empty context and store it into global for next time
  return globalObject[globalKey] = {};

}

export function getContext(globalOption?: string | boolean): Context {
  return getContextFromGlobal(
    resolveGlobalKey(
      globalOption,
    ),
  );
}
