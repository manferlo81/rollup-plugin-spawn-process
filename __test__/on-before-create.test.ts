import { rollup } from 'rollup';
import { spawnProcess } from '../src';

test('Should call onBeforeCreate', async () => {

  const onBeforeCreate = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ onBeforeCreate }),
    ],
  });
  await build.write({ file: 'dist/index.js' });
  await build.write({ file: 'dist/index.js' });

  expect(onBeforeCreate).toHaveBeenCalledTimes(2);
  expect(onBeforeCreate).toHaveBeenNthCalledWith(1, null);
  expect(onBeforeCreate).toHaveBeenNthCalledWith(2, ['node', ['dist/index.js'], expect.any(Object)]);

});
