import crossSpawn from 'cross-spawn'
import type { Plugin } from 'rollup'
import { getContext } from './context'
import { normalizeEventList } from './normalize-events'
import { createFileNameResolver } from './resolve-file'
import type { SpawnProcessOptions } from './types'

export function spawnProcess(options?: SpawnProcessOptions): Plugin {

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  options = options || {}

  const {
    command: commandOption,
    file,
    args,
    key,
    global: globalOption,
    events: eventsOption,
    setup,
    cleanup,
    ...spawnOptions
  } = options

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const command = commandOption || 'node'
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const contextKey = key || 'spawn-process'

  const resolveFilename = createFileNameResolver(file)
  const context = getContext(globalOption)
  const events = normalizeEventList(eventsOption)

  return {
    name: 'spawn-process',

    writeBundle(outputOptions, bundle) {

      // get previous run from context
      const previousRun = context[contextKey]

      // check if there was a previous run
      if (previousRun) {

        // get data from previous run
        const { proc: previousProcess, events: previousEvents } = previousRun

        // call cleanup function if present
        cleanup?.(previousProcess)

        // unregister events
        previousEvents.forEach(({ event, listener }) => {
          previousProcess.off(event, listener)
        })

        // kill previous precess
        previousProcess.kill()

      }

      // resolve filename to pass
      const filename = resolveFilename(outputOptions, bundle)

      // create file argument
      const fileArg = filename ? [filename] : []

      // create spawn arguments
      const spawnArgs = args ? [...fileArg, ...args] : fileArg

      // create child precess
      const proc = crossSpawn(
        command,
        spawnArgs,
        spawnOptions,
      )

      // register child process events
      events.forEach(({ event, listener }) => {
        proc.on(event, listener)
      })

      // store current run in context with events in the reverse order
      const cleanupEvents = [...events].reverse()
      context[contextKey] = { proc, events: cleanupEvents }

      // call setup function if present
      setup?.(proc)

    },
  }
}
