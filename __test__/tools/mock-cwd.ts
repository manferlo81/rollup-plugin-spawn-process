import mock, { restore as restoreMock } from 'mock-fs'

export async function mockCWD<R>(action: () => R | Promise<R>): Promise<R> {
  mock(
    {
      [process.cwd()]: {
        src: {
          'index.js': 'export default true;',
        },
      },
    },
    { createCwd: false, createTmp: false },
  )
  try {
    return await action()
  } finally {
    restoreMock()
  }
}
