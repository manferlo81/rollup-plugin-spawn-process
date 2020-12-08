import { rollup } from 'rollup';
import { spawnProcess } from '../src';

test('Should use "node" if command not provided', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ setup }),
    ],
  });
  await build.write({ file: 'dist/index.js' });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', ['dist/index.js'], expect.any(Object)],
  });

});

test('Should use provided command', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });
  const command = 'command';

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ setup, command }),
    ],
  });
  await build.write({ file: 'dist/index.js' });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: [command, ['dist/index.js'], expect.any(Object)],
  });

});
