import crossSpawn from 'cross-spawn'
import type { Plugin } from 'rollup'
import { getContext } from './context'
import { normalizeEventList } from './normalize-events'
import { createFileNameResolver } from './resolve-file'
import type { SpawnProcessOptions } from './types'

export function spawnProcess(options: SpawnProcessOptions = {}): Plugin {

  const {
    command = 'node',
    file,
    args,
    key: contextKey = 'spawn-process',
    global: globalOption,
    events: eventsOption,
    setup,
    cleanup,
    ...spawnOptions
  } = options

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

      // create spawn arguments
      const spawnArgs = args
        ? filename ? [filename, ...args] : args
        : filename ? [filename] : []

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
