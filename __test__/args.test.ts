import { rollup } from 'rollup'
import { spawnProcess } from '../src'
import { mockCWD } from './tools/mock-cwd'

test('Should use provided args', async () => {

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  const setup = jest.fn<void, [unknown]>(() => { /*  */ })
  const args = ['1', '2']

  await mockCWD(async () => {
    const build = await rollup({
      input: 'src/index.js',
      plugins: [
        spawnProcess({ setup, file: null, args }),
      ],
    })
    await build.write({ file: 'dist/index.js' })
  })

  expect(setup).toHaveBeenCalledTimes(1)
  expect(setup).toHaveBeenCalledWith({
    args: ['node', args, expect.any(Object)],
  })

})

test('Should use provided args after filename', async () => {

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  const setup = jest.fn<void, [unknown]>(() => { /*  */ })
  const file = 'dist/index.js'
  const args = ['1', '2']

  await mockCWD(async () => {
    const build = await rollup({
      input: 'src/index.js',
      plugins: [
        spawnProcess({ setup, file, args }),
      ],
    })
    await build.write({ file: 'dist/index.js' })
  })

  expect(setup).toHaveBeenCalledTimes(1)
  expect(setup).toHaveBeenCalledWith({
    args: ['node', [file, ...args], expect.any(Object)],
  })

})
