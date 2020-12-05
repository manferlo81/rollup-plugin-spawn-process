import { rollup } from 'rollup';
import { spawnProcess } from '../src';

test('Should call setup', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ setup }),
    ],
  });
  await build.write({ file: 'dist/index.js' });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith(['node', ['dist/index.js'], expect.any(Object)]);

});
