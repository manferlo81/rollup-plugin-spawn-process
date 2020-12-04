import { rollup } from 'rollup';
import { spawnProcess } from '../src';

test('Should use "node" if command not provided', async () => {

  const onCreated = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ onCreated }),
    ],
  });
  await build.write({ file: 'dist/index.js' });

  expect(onCreated).toHaveBeenCalledTimes(1);
  expect(onCreated).toHaveBeenCalledWith(['node', ['dist/index.js'], expect.any(Object)]);

});

test('Should use provided command', async () => {

  const onCreated = jest.fn<void, [unknown]>(() => { /*  */ });
  const command = 'command';

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ onCreated, command }),
    ],
  });
  await build.write({ file: 'dist/index.js' });

  expect(onCreated).toHaveBeenCalledTimes(1);
  expect(onCreated).toHaveBeenCalledWith([command, ['dist/index.js'], expect.any(Object)]);

});
