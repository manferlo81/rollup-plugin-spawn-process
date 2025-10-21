import type { SpawnOptions } from 'node:child_process'
import { rollup } from 'rollup'
import { spawnProcess } from '../../src'
import { mockCWD } from '../tools/mock-cwd'

describe('spawn options', () => {

  test('Should pass extra options to spawn method', async () => {

    const setup = jest.fn(() => { /*  */ })
    const options: SpawnOptions = { env: { mode: 'production' }, cwd: 'cwd' }

    await mockCWD(async () => {
      const plugin = spawnProcess({ setup, ...options })
      const build = await rollup({
        input: 'src/index.js',
        plugins: [plugin],
      })
      await build.write({ file: 'dist/index.js' })
    })

    expect(setup).toHaveBeenCalledTimes(1)
    expect(setup).toHaveBeenCalledWith({
      args: ['node', ['dist/index.js'], options],
    })

  })

  test('Should not pass any plugin option to spawn method', async () => {

    const setup = jest.fn(() => { /*  */ })
    const options = { env: { mode: 'production' }, cwd: 'cwd' }

    await mockCWD(async () => {
      const plugin = spawnProcess({
        command: 'node',
        file: 'dist/index.js',
        args: [],
        key: 'key',
        global: true,
        events: {},
        setup,
        cleanup: () => null,
        ...options,
      })
      const build = await rollup({
        input: 'src/index.js',
        plugins: [plugin],
      })
      await build.write({ file: 'dist/index.js' })
    })

    expect(setup).toHaveBeenCalledTimes(1)
    expect(setup).toHaveBeenCalledWith({
      args: ['node', ['dist/index.js'], options],
    })

  })

})
