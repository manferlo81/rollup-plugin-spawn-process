import { InputOptions, NormalizedOutputOptions, OutputAsset, OutputChunk, OutputOptions, Plugin, PluginContext } from 'rollup';

async function executeWriteBundleHook(plugin: Plugin, outputOptions: OutputOptions, inputFile: string | string[]) {
  if (plugin.writeBundle) {

    let bundle: Record<string, OutputAsset | OutputChunk> = {
      'styles.css': {
        type: 'asset',
        fileName: 'main.css',
      } as OutputAsset,
    };

    if (!Array.isArray(inputFile)) {
      bundle = {
        'index.js': {
          type: 'chunk',
          fileName: 'index.js',
        } as OutputChunk,
        ...bundle,
      };
    }

    await plugin.writeBundle.call(
      {} as PluginContext,
      outputOptions as NormalizedOutputOptions,
      bundle,
    );

  }
}

async function createBuild(inputOptions: InputOptions) {
  return Promise.resolve({
    async write(outputOptions: OutputOptions) {
      for (const plugin of inputOptions.plugins || []) {
        await executeWriteBundleHook(
          plugin,
          outputOptions,
          inputOptions.input as string | string[],
        );
      }
      return {
        inputOptions,
        outputOptions,
      };
    },
  });
}

export async function rollup(inputOptions: InputOptions): Promise<unknown> {
  return await createBuild(
    inputOptions,
  );
}
