import { resolve } from 'path';
import { rollup } from 'rollup';
import { spawnProcess } from '../src';

test('Should use provided file', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ setup, file: 'dist/out.js' }),
    ],
  });
  await build.write({ file: 'dist/index.js' });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', ['dist/out.js'], expect.any(Object)],
    killed: false,
  });

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
  expect(setup).toHaveBeenCalledWith({
    args: ['node', [file], expect.any(Object)],
    killed: false,
  });

});

test('Should ignore if no "file" nor "dir" option', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ setup }),
    ],
  });
  await build.write({});

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', [], expect.any(Object)],
    killed: false,
  });

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
  expect(setup).toHaveBeenCalledWith({
    args: ['node', [resolve('dist/index.js')], expect.any(Object)],
    killed: false,
  });

});

test('Should ignore even if it can resolve from bundle', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ setup, file: null }),
    ],
  });
  await build.write({ dir: 'dist' });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', [], expect.any(Object)],
    killed: false,
  });

});

test('Should ignore if it can\'t be resolved', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: [],
    plugins: [
      spawnProcess({ setup }),
    ],
  });
  await build.write({ dir: 'dist' });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', [], expect.any(Object)],
    killed: false,
  });

});
