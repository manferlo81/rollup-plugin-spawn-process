import { resolve } from 'path';
import { rollup } from 'rollup';
import { spawnProcess } from '../src';

test('Should use provided args', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ setup, args: [] }),
    ],
  });
  await build.write({ file: 'dist/index.js' });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith(['node', [], expect.any(Object)]);

});

test('Should use output "file" option', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });
  const file = 'dist/index.js';

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ setup }),
    ],
  });
  await build.write({ file });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith(['node', [file], expect.any(Object)]);

});

test('Should use empty array if no "file" nor "dir" option', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ setup }),
    ],
  });
  await build.write({});

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith(['node', [], expect.any(Object)]);

});

test('Should resolve from bundle', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ setup }),
    ],
  });
  await build.write({ dir: 'dist' });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith(['node', [resolve('dist/index.js')], expect.any(Object)]);

});

test('Should use empty array if it cant be resolved', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: [],
    plugins: [
      spawnProcess({ setup }),
    ],
  });
  await build.write({ dir: 'dist' });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith(['node', [], expect.any(Object)]);

});
