import { rollup } from 'rollup'
import { spawnProcess } from '../../src'
import { deleteGlobal, getGlobal, uniqueGlobalKey } from '../tools/global'
import { mockCWD } from '../tools/mock-cwd'

describe('"key" option', () => {

  test('Should use provided "key" option', async () => {

    const globalKey = uniqueGlobalKey('TEST_GLOBAL_KEY')
    const key = 'test-key'

    await mockCWD(async () => {
      const plugin = spawnProcess({ global: globalKey, key })
      const { write } = await rollup({
        input: 'src/index.js',
        plugins: [plugin],
      })
      await write({ dir: 'dist' })
    })

    expect(getGlobal(globalKey)).toEqual({
      [key]: {
        proc: expect.any(Object) as unknown,
        events: expect.any(Array) as unknown,
      },
    })

    deleteGlobal(globalKey)

  })

  test('Should use "spawn-process" as default key if no key provided', async () => {

    const globalKey = uniqueGlobalKey('TEST_GLOBAL_KEY')

    await mockCWD(async () => {
      const plugin = spawnProcess({ global: globalKey })
      const { write } = await rollup({
        input: 'src/index.js',
        plugins: [plugin],
      })
      await write({ dir: 'dist' })
    })

    expect(getGlobal(globalKey)).toEqual({
      'spawn-process': {
        proc: {
          args: expect.any(Array) as unknown,
        },
        events: expect.any(Array) as unknown,
      },
    })

    deleteGlobal(globalKey)

  })

})
