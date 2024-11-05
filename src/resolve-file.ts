import { extname, join } from 'node:path';
import type { NormalizedOutputOptions, OutputBundle } from 'rollup';

export function resolveFileFromBuild(options: NormalizedOutputOptions, bundle: OutputBundle): string {

  const { file } = options;
  if (file) {
    return file;
  }

  const filename = Object.values(bundle)
    .map((output): string | null => (
      output.type === 'chunk' ? output.fileName : null
    ))
    .filter((filename): filename is string => !!filename)
    .find((filename) => extname(filename) === '.js');

  return join(
    options.dir as string,
    filename as string,
  );

}
