import { rollup } from 'rollup';
import { spawnProcess } from '../src';
import { mockCWD } from './tools/mock-cwd';

const globalObject = global as Record<string, unknown>;

test('Should use provided key', async () => {

  let storeGlobal = 'TEST_GLOBAL_KEY';
  while (storeGlobal in globalObject) {
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

  expect(globalObject[storeGlobal]).toEqual({
    [key]: {
      proc: {
        args: expect.any(Array) as unknown,
      },
      events: expect.any(Array) as unknown,
    },
  });
  delete globalObject[storeGlobal];

});

test('Should use "spawn-process" if no key provided', async () => {

  let globalKey = 'TEST_GLOBAL_KEY';
  while (globalKey in globalObject) {
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

  expect(globalObject[globalKey]).toEqual({
    'spawn-process': {
      proc: {
        args: expect.any(Array) as unknown,
      },
      events: expect.any(Array) as unknown,
    },
  });
  delete globalObject[globalKey];

});
