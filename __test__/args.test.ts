import { resolve } from 'path';
import { rollup } from 'rollup';
import { spawnProcess } from '../src';

test('Should use provided args', async () => {

  const onCreated = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ onCreated, args: [] }),
    ],
  });
  await build.write({ file: 'dist/index.js' });

  expect(onCreated).toHaveBeenCalledTimes(1);
  expect(onCreated).toHaveBeenCalledWith(['node', [], expect.any(Object)]);

});

test('Should use output "file" option', async () => {

  const onCreated = jest.fn<void, [unknown]>(() => { /*  */ });
  const file = 'dist/index.js';

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ onCreated }),
    ],
  });
  await build.write({ file });

  expect(onCreated).toHaveBeenCalledTimes(1);
  expect(onCreated).toHaveBeenCalledWith(['node', [file], expect.any(Object)]);

});

test('Should use empty array if no "file" nor "dir" option', async () => {

  const onCreated = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ onCreated }),
    ],
  });
  await build.write({});

  expect(onCreated).toHaveBeenCalledTimes(1);
  expect(onCreated).toHaveBeenCalledWith(['node', [], expect.any(Object)]);

});

test('Should resolve from bundle', async () => {

  const onCreated = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ onCreated }),
    ],
  });
  await build.write({ dir: 'dist' });

  expect(onCreated).toHaveBeenCalledTimes(1);
  expect(onCreated).toHaveBeenCalledWith(['node', [resolve('dist/index.js')], expect.any(Object)]);

});

test('Should use empty array if it cant be resolved', async () => {

  const onCreated = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: [],
    plugins: [
      spawnProcess({ onCreated }),
    ],
  });
  await build.write({ dir: 'dist' });

  expect(onCreated).toHaveBeenCalledTimes(1);
  expect(onCreated).toHaveBeenCalledWith(['node', [], expect.any(Object)]);

});
