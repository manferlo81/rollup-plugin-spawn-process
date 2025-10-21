import { rollup } from 'rollup'
import { spawnProcess } from '../../src'
import { mockCWD } from '../tools/mock-cwd'

describe('"args" option', () => {

  test('Should use provided args', async () => {

    const setup = jest.fn(() => { /*  */ })
    const args = ['1', '2']

    await mockCWD(async () => {
      const plugin = spawnProcess({ setup, file: null, args })
      const { write } = await rollup({
        input: 'src/index.js',
        plugins: [plugin],
      })
      await write({ file: 'dist/index.js' })
    })

    expect(setup).toHaveBeenCalledTimes(1)
    expect(setup).toHaveBeenCalledWith({
      args: ['node', args, expect.any(Object)],
    })

  })

  test('Should use provided args after filename', async () => {

    const setup = jest.fn(() => { /*  */ })
    const file = 'dist/index.js'
    const args = ['1', '2']

    await mockCWD(async () => {
      const plugin = spawnProcess({ setup, file, args })
      const build = await rollup({
        input: 'src/index.js',
        plugins: [plugin],
      })
      await build.write({ file })
    })

    expect(setup).toHaveBeenCalledTimes(1)
    expect(setup).toHaveBeenCalledWith({
      args: ['node', [file, ...args], expect.any(Object)],
    })

  })

})
