import { spawnProcess } from '../src';

test('Should not use global scope by default', () => {
  const snapshot = { ...global };
  spawnProcess();
  expect(global).toEqual(snapshot);
});

test('Should use global scope with provided key', () => {
  let storeGlobal = 'TEST_GLOBAL_KEY';
  while (storeGlobal in global) {
    storeGlobal += '_';
  }
  const snapshot = { ...global };
  spawnProcess({ storeGlobal });
  expect(global).not.toEqual(snapshot);
  expect(global).toEqual({ ...snapshot, [storeGlobal]: {} });
  delete global[storeGlobal];
});

test('Should use global scope with default key', () => {
  const snapshot = { ...global };
  spawnProcess({ storeGlobal: true });
  expect(global).not.toEqual(snapshot);
  expect(global).toEqual({ ...snapshot, ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT: {} });
  delete global.ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT;
});
