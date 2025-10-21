import { rollup } from 'rollup'
import { spawnProcess } from '../../src'
import { mockCWD } from '../tools/mock-cwd'

describe('"command" option', () => {

  test('Should use "node" as default if not provided', async () => {

    const setup = jest.fn(() => { /*  */ })

    await mockCWD(async () => {
      const plugin = spawnProcess({ setup })
      const build = await rollup({
        input: 'src/index.js',
        plugins: [plugin],
      })
      await build.write({ file: 'dist/index.js' })
    })

    expect(setup).toHaveBeenCalledTimes(1)
    expect(setup).toHaveBeenCalledWith({
      args: ['node', ['dist/index.js'], expect.any(Object)],
    })

  })

  test('Should use provided "command" option', async () => {

    const setup = jest.fn(() => { /*  */ })
    const command = 'command'

    await mockCWD(async () => {
      const plugin = spawnProcess({ setup, command })
      const build = await rollup({
        input: 'src/index.js',
        plugins: [plugin],
      })
      await build.write({ file: 'dist/index.js' })
    })

    expect(setup).toHaveBeenCalledTimes(1)
    expect(setup).toHaveBeenCalledWith({
      args: [command, ['dist/index.js'], expect.any(Object)],
    })

  })

})
