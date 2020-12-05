import { rollup } from 'rollup';
import { spawnProcess } from '../src';

test('Should call cleanup', async () => {

  const cleanup = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ cleanup }),
    ],
  });
  await build.write({ file: 'dist/index.js' });
  await build.write({ file: 'dist/index.js' });

  expect(cleanup).toHaveBeenCalledTimes(1);
  expect(cleanup).toHaveBeenCalledWith(['node', ['dist/index.js'], expect.any(Object)]);

});
