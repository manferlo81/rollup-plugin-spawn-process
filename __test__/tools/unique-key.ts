export function createUniqueKey(initial: string, referenceObj: Record<string, unknown>) {
  let uniqueKey = initial
  while (uniqueKey in referenceObj) {
    uniqueKey += '_'
  }
  return uniqueKey
}
