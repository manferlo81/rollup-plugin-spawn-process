import { rollup } from 'rollup'
import { spawnProcess } from '../src'
import { mockCWD } from './tools/mock-cwd'

test('Should call cleanup', async () => {

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  const cleanup = jest.fn<void, [Record<string, unknown>]>(({ killed }) => {
    expect(killed).toBe(false)
  })

  await mockCWD(async () => {
    const build = await rollup({
      input: 'src/index.js',
      plugins: [
        spawnProcess({ cleanup: cleanup as never }),
      ],
    })
    await build.write({ file: 'dist/index.js' })
    await build.write({ file: 'dist/index.js' })
  })

  expect(cleanup).toHaveBeenCalledTimes(1)
  expect(cleanup).toHaveBeenCalledWith({
    args: ['node', ['dist/index.js'], expect.any(Object)],
    killed: true,
  })

})
