import { normalize } from 'path'
import { rollup } from 'rollup'
import { spawnProcess } from '../../src'
import { mockCWD } from '../tools/mock-cwd'

describe('"file" option', () => {

  test('Should use provided file', async () => {

    const setup = jest.fn(() => { /*  */ })

    await mockCWD(async () => {
      const plugin = spawnProcess({ setup, file: 'dist/out.js' })
      const { write } = await rollup({
        input: 'src/index.js',
        plugins: [plugin],
      })
      await write({ file: 'dist/index.js' })
    })

    expect(setup).toHaveBeenCalledTimes(1)
    expect(setup).toHaveBeenCalledWith({
      args: ['node', ['dist/out.js'], expect.any(Object)],
    })

  })

  test('Should use file from rollup output options if not provided', async () => {

    const setup = jest.fn(() => { /*  */ })
    const file = 'dist/index.js'

    await mockCWD(async () => {
      const plugin = spawnProcess({ setup })
      const { write } = await rollup({
        input: 'src/index.js',
        plugins: [plugin],
      })
      await write({ file })
    })

    expect(setup).toHaveBeenCalledTimes(1)
    expect(setup).toHaveBeenCalledWith({
      args: ['node', [file], expect.any(Object)],
    })

  })

  test('Should resolve from bundle if output "dir" option is used', async () => {

    const setup = jest.fn(() => { /*  */ })

    await mockCWD(async () => {
      const plugin = spawnProcess({ setup })
      const { write } = await rollup({
        input: 'src/index.js',
        plugins: [plugin],
      })
      await write({ dir: 'dist' })
    })

    expect(setup).toHaveBeenCalledTimes(1)
    expect(setup).toHaveBeenCalledWith({
      args: ['node', [normalize('dist/index.js')], expect.any(Object)],
    })

  })

  test('Should ignore if null is passed as "file" option', async () => {

    const setup = jest.fn(() => { /*  */ })

    await mockCWD(async () => {
      const plugin = spawnProcess({ setup, file: null })
      const { write } = await rollup({
        input: 'src/index.js',
        plugins: [plugin],
      })
      await write({ dir: 'dist' })
    })

    expect(setup).toHaveBeenCalledTimes(1)
    expect(setup).toHaveBeenCalledWith({
      args: ['node', [], expect.any(Object)],
    })

  })

})
