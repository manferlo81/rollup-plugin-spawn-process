import { rollup } from 'rollup';
import { spawnProcess } from '../src';

test('Should use provided key', async () => {

  let globalKey = 'TEST_GLOBAL_KEY';
  while (globalKey in global) {
    globalKey += '_';
  }

  const plugin = spawnProcess({ globalKey, key: 'test-key' });

  const snapshot = { ...global[globalKey] };

  const build = await rollup({
    input: [],
    plugins: [
      plugin,
    ],
  });
  await build.write({ dir: 'dist' });

  expect(global[globalKey]).not.toEqual(snapshot);
  expect(global[globalKey]).toEqual({ ...snapshot, 'test-key': expect.any(Array) as unknown });
  delete global[globalKey];

});

test('Should use "spawn-process" is no key provided', async () => {

  let globalKey = 'TEST_GLOBAL_KEY';
  while (globalKey in global) {
    globalKey += '_';
  }

  const plugin = spawnProcess({ globalKey });

  const snapshot = { ...global[globalKey] };

  const build = await rollup({
    input: [],
    plugins: [
      plugin,
    ],
  });
  await build.write({ dir: 'dist' });

  expect(global[globalKey]).not.toEqual(snapshot);
  expect(global[globalKey]).toEqual({ ...snapshot, 'spawn-process': expect.any(Array) as unknown });
  delete global[globalKey];

});
