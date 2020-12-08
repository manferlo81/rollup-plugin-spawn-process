import { rollup } from 'rollup';
import { spawnProcess } from '../src';

test('Should use provided key', async () => {

  let storeGlobal = 'TEST_GLOBAL_KEY';
  while (storeGlobal in global) {
    storeGlobal += '_';
  }

  const plugin = spawnProcess({ storeGlobal, key: 'test-key' });

  const snapshot = { ...global[storeGlobal] };

  const build = await rollup({
    input: [],
    plugins: [
      plugin,
    ],
  });
  await build.write({ dir: 'dist' });

  expect(global[storeGlobal]).not.toEqual(snapshot);
  expect(global[storeGlobal]).toEqual({
    ...snapshot,
    'test-key': {
      args: expect.any(Array) as unknown,
    },
  });
  delete global[storeGlobal];

});

test('Should use "spawn-process" is no key provided', async () => {

  let globalKey = 'TEST_GLOBAL_KEY';
  while (globalKey in global) {
    globalKey += '_';
  }

  const plugin = spawnProcess({ storeGlobal: globalKey });

  const snapshot = { ...global[globalKey] };

  const build = await rollup({
    input: [],
    plugins: [
      plugin,
    ],
  });
  await build.write({ dir: 'dist' });

  expect(global[globalKey]).not.toEqual(snapshot);
  expect(global[globalKey]).toEqual({
    ...snapshot,
    'spawn-process': {
      args: expect.any(Array) as unknown,
    },
  });
  delete global[globalKey];

});
