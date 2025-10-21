import { createUniqueKey } from './unique-key'

type GlobalObject = typeof global & Record<string, unknown>
const globalObject = global as GlobalObject

export function getGlobal(globalKey: string) {
  return globalObject[globalKey]
}

export function deleteGlobal(globalKey: string): void {
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete globalObject[globalKey]
}

export function monitorGlobal<R>(callback: (globalObject: GlobalObject) => R) {

  // Get global scope snapshot before callback
  const before: GlobalObject = { ...globalObject }

  // Callback
  const result = callback(globalObject)

  // Get global scope snapshot after callback
  const after: GlobalObject = { ...globalObject }

  // Return results
  return { before, result, after }
}

export function uniqueGlobalKey(initial: string) {
  return createUniqueKey(initial, globalObject)
}
