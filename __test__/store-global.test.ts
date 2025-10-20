import { spawnProcess } from '../src'

type GlobalObject = typeof global & Record<string, unknown>

const globalObject = global as GlobalObject
const globalSnapshot = (): GlobalObject => ({ ...globalObject })

function beforeAfterPlugin<R>(callback: (before: GlobalObject) => R) {
  const before = globalSnapshot()
  const result = callback(before)
  const after = globalSnapshot()
  return { result, before, after }
}

test('Should not use global scope by default', () => {
  const { before, after } = beforeAfterPlugin(() => spawnProcess())
  expect(after).toEqual(before)
})

test('Should use global scope with provided key', () => {
  const { before, after, result } = beforeAfterPlugin((before) => {
    let globalKey = 'TEST_GLOBAL_KEY'
    while (globalKey in before) {
      globalKey += '_'
    }
    spawnProcess({ global: globalKey })
    return globalKey
  })

  expect(after).not.toEqual(before)
  expect(after).toEqual({ ...before, [result]: {} })

  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete globalObject[result]
})

test('Should use global scope with default key', () => {
  const { before, after } = beforeAfterPlugin(() => {
    spawnProcess({ global: true })
  })

  expect(after).not.toEqual(before)
  expect(after).toEqual({ ...before, ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT: {} })

  delete globalObject.ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT
})

test('Should infer use of global scope based on env', () => {
  const { env } = process as { env: Record<string, unknown> }
  env.ROLLUP_WATCH = 'whatever'

  const { before, after } = beforeAfterPlugin(() => {
    spawnProcess()
  })

  expect(after).not.toEqual(before)
  expect(after).toEqual({ ...before, ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT: {} })

  delete globalObject.ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT
  delete env.ROLLUP_WATCH
})
