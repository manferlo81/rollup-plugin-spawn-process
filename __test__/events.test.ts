import { rollup } from 'rollup';
import { spawnProcess } from '../src';
import { mockCWD } from './tools/mock-cwd';

test('Should attach event object', async () => {

  const setup = jest.fn<void, [Record<string, unknown>]>(({ listeners }) => {
    expect(listeners).toEqual({
      exit: [onExit],
      message: [onMessage],
    });
  });

  const onExit = jest.fn(() => { /*  */ });
  const onMessage = jest.fn(() => { /*  */ });

  await mockCWD(async () => {
    const build = await rollup({
      input: 'src/index.js',
      plugins: [
        spawnProcess({
          setup: setup as never,
          events: { exit: onExit, message: onMessage },
        }),
      ],
    });
    await build.write({ file: 'dist/index1.js' });
    await build.write({ file: 'dist/index2.js' });
  });

  expect(setup).toHaveBeenCalledTimes(2);
  expect(setup).toHaveBeenNthCalledWith(1, {
    args: expect.any(Array) as unknown,
    killed: true,
  });
  expect(setup).toHaveBeenNthCalledWith(2, {
    args: expect.any(Array) as unknown,
  });

});

test('Should attach event object', async () => {

  const setup = jest.fn<void, [Record<string, unknown>]>(({ listeners }) => {
    expect(listeners).toEqual({
      exit: [onExit],
      message: [onMessage],
    });
  });

  const onExit = jest.fn(() => { /*  */ });
  const onMessage = jest.fn(() => { /*  */ });

  await mockCWD(async () => {
    const build = await rollup({
      input: 'src/index.js',
      plugins: [
        spawnProcess({
          setup: setup as never,
          events: [
            { event: 'exit', listener: onExit },
            { event: 'message', listener: onMessage },
          ],
        }),
      ],
    });
    await build.write({ file: 'dist/index1.js' });
    await build.write({ file: 'dist/index2.js' });
  });

  expect(setup).toHaveBeenCalledTimes(2);
  expect(setup).toHaveBeenNthCalledWith(1, {
    args: expect.anything() as unknown,
    killed: true,
  });
  expect(setup).toHaveBeenNthCalledWith(2, {
    args: expect.anything() as unknown,
  });

});
