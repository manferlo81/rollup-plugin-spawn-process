import { rollup } from 'rollup'
import { spawnProcess } from '../../src'
import { mockCWD } from '../tools/mock-cwd'

describe('"events" option', () => {

  describe('"events" option as an object', () => {

    test('Should attach "events" option as object', async () => {

      const setup = jest.fn(({ listeners }) => {
        expect(listeners).toEqual({
          exit: [onExit],
          message: [onMessage],
        })
      })

      const onExit = () => { /*  */ }
      const onMessage = () => { /*  */ }

      await mockCWD(async () => {
        const plugin = spawnProcess({
          setup: setup as never,
          events: { exit: onExit, message: onMessage },
        })
        const { write } = await rollup({
          input: 'src/index.js',
          plugins: [plugin],
        })
        await write({ file: 'dist/index1.js' })
        await write({ file: 'dist/index2.js' })
      })

      expect(setup).toHaveBeenCalledTimes(2)
      expect(setup).toHaveBeenNthCalledWith(1, {
        args: expect.any(Array) as unknown,
        killed: true,
      })
      expect(setup).toHaveBeenNthCalledWith(2, {
        args: expect.any(Array) as unknown,
      })

    })

  })

  describe('"events" option as a list', () => {

    test('Should attach event list', async () => {

      const setup = jest.fn(({ listeners }) => {
        expect(listeners).toEqual({
          exit: [onExit],
          message: [onMessage],
        })
      })

      const onExit = () => { /*  */ }
      const onMessage = () => { /*  */ }

      await mockCWD(async () => {
        const plugin = spawnProcess({
          setup: setup as never,
          events: [
            { event: 'exit', listener: onExit },
            { event: 'message', listener: onMessage },
          ],
        })
        const { write } = await rollup({
          input: 'src/index.js',
          plugins: [plugin],
        })
        await write({ file: 'dist/index1.js' })
        await write({ file: 'dist/index2.js' })
      })

      expect(setup).toHaveBeenCalledTimes(2)
      expect(setup).toHaveBeenNthCalledWith(1, {
        args: expect.anything() as unknown,
        killed: true,
      })
      expect(setup).toHaveBeenNthCalledWith(2, {
        args: expect.anything() as unknown,
      })

    })

  })

})
