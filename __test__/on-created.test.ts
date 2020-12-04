import { rollup } from 'rollup';
import { spawnProcess } from '../src';

test('Should call onCreated', async () => {

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
