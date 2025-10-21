export function simulateWatchMode<R>(callback: () => R): R {

  // Set environment variable
  const { env } = process as { env: Record<string, unknown> }
  env.ROLLUP_WATCH = 'true'

  try {
    return callback()
  } finally {
    // Cleanup environment variable
    delete env.ROLLUP_WATCH
  }

}
