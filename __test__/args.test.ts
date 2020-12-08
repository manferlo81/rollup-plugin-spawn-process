import { rollup } from 'rollup';
import { spawnProcess } from '../src';

test('Should use provided args', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });
  const args = ['1', '2'];

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ setup, file: null, args }),
    ],
  });
  await build.write({ file: 'dist/index.js' });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', args, expect.any(Object)],
  });

});

test('Should use provided args after filename', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });
  const file = 'dist/index.js';
  const args = ['1', '2'];

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ setup, file, args }),
    ],
  });
  await build.write({ file: 'dist/index.js' });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', [file, ...args], expect.any(Object)],
  });

});
