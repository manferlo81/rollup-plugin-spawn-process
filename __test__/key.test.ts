import { rollup } from 'rollup';
import { spawnProcess } from '../src';
import { mockCWD } from './tools/mock-cwd';

test('Should use provided key', async () => {

  let storeGlobal = 'TEST_GLOBAL_KEY';
  while (storeGlobal in global) {
    storeGlobal += '_';
  }
  const key = 'test-key';

  await mockCWD(async () => {
    const build = await rollup({
      input: 'src/index.js',
      plugins: [
        spawnProcess({ global: storeGlobal, key }),
      ],
    });
    await build.write({ dir: 'dist' });
  });

  expect(global[storeGlobal]).toEqual({
    [key]: {
      proc: {
        args: expect.any(Array) as unknown,
      },
      events: expect.any(Array) as unknown,
    },
  });
  delete global[storeGlobal];

});

test('Should use "spawn-process" if no key provided', async () => {

  let globalKey = 'TEST_GLOBAL_KEY';
  while (globalKey in global) {
    globalKey += '_';
  }

  const plugin = spawnProcess({ global: globalKey });

  await mockCWD(async () => {
    const build = await rollup({
      input: 'src/index.js',
      plugins: [
        plugin,
      ],
    });
    await build.write({ dir: 'dist' });
  });

  expect(global[globalKey]).toEqual({
    'spawn-process': {
      proc: {
        args: expect.any(Array) as unknown,
      },
      events: expect.any(Array) as unknown,
    },
  });
  delete global[globalKey];

});
