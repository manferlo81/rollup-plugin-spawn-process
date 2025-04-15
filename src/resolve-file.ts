import { extname, join } from 'node:path'
import type { NormalizedOutputOptions, OutputBundle } from 'rollup'

function resolveFileFromBuild(options: NormalizedOutputOptions, bundle: OutputBundle): string {

  const { file } = options

  // return file if rollup outputting a single file
  if (file) return file

  // get list of chunk filenames
  const filenameList = Object.values(bundle)
    .filter(({ type }) => type === 'chunk')
    .map(({ fileName }) => fileName)

  // search for filename on output files
  const filename = filenameList.find((filename) => extname(filename) === '.js')

  // return filename
  return join(
    options.dir as unknown as string,
    filename as unknown as string,
  )

}

type FileNameResolver = (...args: Parameters<typeof resolveFileFromBuild>) => string | null

export function createFileNameResolver(file?: string | null): FileNameResolver {

  // resolves to file if it's a string
  if (file) return () => file

  // resolves to null if it's explicitly set to null
  if (file === null) return () => null

  // resolves file from rollup build
  return resolveFileFromBuild
}
