import { spawnProcess } from '../src';

const globalObject = global as Record<string, unknown>;

test('Should not use global scope by default', () => {
  const snapshot = { ...globalObject };
  spawnProcess();
  expect(globalObject).toEqual(snapshot);
});

test('Should use global scope with provided key', () => {
  let storeGlobal = 'TEST_GLOBAL_KEY';
  while (storeGlobal in globalObject) {
    storeGlobal += '_';
  }
  const snapshot = { ...globalObject };
  spawnProcess({ global: storeGlobal });
  expect(globalObject).not.toEqual(snapshot);
  expect(globalObject).toEqual({ ...snapshot, [storeGlobal]: {} });
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete globalObject[storeGlobal];
});

test('Should use global scope with default key', () => {
  const snapshot = { ...globalObject };
  spawnProcess({ global: true });
  expect(globalObject).not.toEqual(snapshot);
  expect(globalObject).toEqual({ ...snapshot, ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT: {} });
  delete globalObject.ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT;
});

test('Should infer use of global scope based on env', () => {
  const { env } = process as { env: Record<string, unknown> };
  env.ROLLUP_WATCH = 'whatever';
  const snapshot = { ...globalObject };
  spawnProcess();
  expect(globalObject).not.toEqual(snapshot);
  expect(globalObject).toEqual({ ...snapshot, ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT: {} });
  delete globalObject.ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT;
  delete env.ROLLUP_WATCH;
});
