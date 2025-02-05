import { rollup } from 'rollup';
import { spawnProcess } from '../src';
import { mockCWD } from './tools/mock-cwd';

test('Should pass options to spawn method', async () => {

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  const setup = jest.fn<void, [unknown]>(() => { /*  */ });
  const options = { env: { mode: 'production' }, cwd: 'cwd' };

  await mockCWD(async () => {
    const build = await rollup({
      input: 'src/index.js',
      plugins: [
        spawnProcess({ setup, ...options }),
      ],
    });
    await build.write({ file: 'dist/index.js' });
  });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', ['dist/index.js'], options],
  });

});

test('Should not pass any plugin option to spawn method', async () => {

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  const setup = jest.fn<void, [unknown]>(() => { /*  */ });
  const options = { env: { mode: 'production' }, cwd: 'cwd' };

  await mockCWD(async () => {
    const build = await rollup({
      input: 'src/index.js',
      plugins: [
        spawnProcess({
          command: 'node',
          file: 'dist/index.js',
          args: [],
          key: 'key',
          global: true,
          events: {},
          setup,
          cleanup: () => null,
          ...options,
        }),
      ],
    });
    await build.write({ file: 'dist/index.js' });
  });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', ['dist/index.js'], options],
  });

});
