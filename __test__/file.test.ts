import { resolve } from 'path';
import { rollup } from 'rollup';
import { spawnProcess } from '../src';
import { mockCWD } from './tools/mock-cwd';

test('Should use provided file', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });

  await mockCWD(async () => {
    const build = await rollup({
      input: 'src/index.js',
      plugins: [
        spawnProcess({ setup, file: 'dist/out.js' }),
      ],
    });
    await build.write({ file: 'dist/index.js' });
  });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', ['dist/out.js'], expect.any(Object)],
  });

});

test('Should use output "file" option', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });
  const file = 'dist/index.js';

  await mockCWD(async () => {
    const build = await rollup({
      input: 'src/index.js',
      plugins: [
        spawnProcess({ setup }),
      ],
    });
    await build.write({ file });
  });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', [file], expect.any(Object)],
  });

});

test('Should resolve from bundle', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });

  await mockCWD(async () => {
    const build = await rollup({
      input: 'src/index.js',
      plugins: [
        spawnProcess({ setup }),
      ],
    });
    await build.write({ dir: 'dist' });
  });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', [resolve('dist/index.js')], expect.any(Object)],
  });

});

test('Should ignore even if it can resolve from bundle', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });

  await mockCWD(async () => {
    const build = await rollup({
      input: 'src/index.js',
      plugins: [
        spawnProcess({ setup, file: null }),
      ],
    });
    await build.write({ dir: 'dist' });
  });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', [], expect.any(Object)],
  });

});
