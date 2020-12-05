import { rollup } from 'rollup';
import { spawnProcess } from '../src';

test('Should pass options to spawn method', async () => {

  const setup = jest.fn<void, [unknown]>(() => { /*  */ });
  const options = { env: { mode: 'production' }, cwd: 'cwd' };

  const build = await rollup({
    input: 'src/index.js',
    plugins: [
      spawnProcess({ setup, ...options }),
    ],
  });
  await build.write({ file: 'dist/index.js' });

  expect(setup).toHaveBeenCalledTimes(1);
  expect(setup).toHaveBeenCalledWith({
    args: ['node', ['dist/index.js'], options],
    killed: false,
  });

});
