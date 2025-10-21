import { rollup } from 'rollup'
import { spawnProcess } from '../../src'
import { mockCWD } from '../tools/mock-cwd'

describe('"cleanup" option', () => {

  test('Should call "cleanup" function before process is killed', async () => {

    const cleanup = jest.fn(({ killed }) => {
      expect(killed).toBe(false)
    })

    await mockCWD(async () => {
      const { write } = await rollup({
        input: 'src/index.js',
        plugins: [
          spawnProcess({ cleanup: cleanup as never }),
        ],
      })
      await write({ file: 'dist/index.js' })
      await write({ file: 'dist/index.js' })
    })

    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(cleanup).toHaveBeenCalledWith({
      args: ['node', ['dist/index.js'], expect.any(Object)],
      killed: true,
    })

  })

})
