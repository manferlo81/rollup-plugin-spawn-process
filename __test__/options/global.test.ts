import { spawnProcess } from '../../src'
import { deleteGlobal, monitorGlobal, uniqueGlobalKey } from '../tools/global'
import { simulateWatchMode } from '../tools/watch-mode'

describe('"global" option', () => {

  test('Should not use global scope by default on build mode', () => {

    const cases = [
      undefined,
      { global: undefined },
    ]

    cases.forEach((options) => {
      const { before, after } = monitorGlobal(() => {
        spawnProcess(options)
      })
      expect(after).toEqual(before)
    })

  })

  test('Should use global scope by default on watch mode', () => {
    simulateWatchMode(() => {

      const cases = [
        undefined,
        { global: undefined },
      ]

      cases.forEach((options) => {

        const { before, after } = monitorGlobal(() => {
          spawnProcess(options)
        })

        const defaultGlobalKey = 'ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT'

        expect(after).not.toEqual(before)
        expect(after).toEqual({ ...before, [defaultGlobalKey]: {} })

        deleteGlobal(defaultGlobalKey)
      })

    })
  })

  test('Should use "global" option as global key', () => {

    const { before, after, result: globalKey } = monitorGlobal(() => {
      const globalKey = uniqueGlobalKey('TEST_GLOBAL_KEY')
      spawnProcess({ global: globalKey })
      return globalKey
    })

    expect(after).not.toEqual(before)
    expect(after).toEqual({ ...before, [globalKey]: {} })

    deleteGlobal(globalKey)
  })

  test('Should use global scope with default key', () => {

    const { before, after } = monitorGlobal(() => {
      spawnProcess({ global: true })
    })

    const defaultGlobalKey = 'ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT'

    expect(after).not.toEqual(before)
    expect(after).toEqual({ ...before, [defaultGlobalKey]: {} })

    deleteGlobal(defaultGlobalKey)
  })

})
