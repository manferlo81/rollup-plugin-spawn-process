import { rollup } from 'rollup'
import { spawnProcess } from '../../src'
import { mockCWD } from '../tools/mock-cwd'

describe('"setup" option', () => {

  test('Should call "setup" function after process is created', async () => {

    const setup = jest.fn(({ killed }) => {
      expect(killed).toBe(false)
    })

    await mockCWD(async () => {
      const plugin = spawnProcess({ setup: setup as never })
      const build = await rollup({
        input: 'src/index.js',
        plugins: [plugin],
      })
      await build.write({ file: 'dist/index1.js' })
      await build.write({ file: 'dist/index2.js' })
    })

    expect(setup).toHaveBeenCalledTimes(2)
    expect(setup).toHaveBeenNthCalledWith(1, {
      args: ['node', ['dist/index1.js'], expect.any(Object)],
      killed: true,
    })
    expect(setup).toHaveBeenNthCalledWith(2, {
      args: ['node', ['dist/index2.js'], expect.any(Object)],
    })

  })

})
