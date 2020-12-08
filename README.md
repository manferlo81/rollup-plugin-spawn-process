# rollup-plugin-spawn-process

A rollup plugin to spawn a process

## Install

### Using npm

```bash
npm install rollup-plugin-spawn-process
```

### Using yarn

```bash
yarn add rollup-plugin-spawn-process
```

## Usage

```javascript
// rollup.config.js

import { spawnProcess } from 'rollup-plugin-spawn-process';

export default {
  ...
  plugins: [
    spawnProcess({ ...options }),
  ],
  ...
};
```

See the [Options](#options) section for available options.

## Options

### command

```typescript
string
default "node"
```

The command to be passed to the `spawn` method.

### file

```typescript
string | null
default <bundleOutputFile>
```

A file path to be passed as first argument to the `spawn` method.

If not specified, the plugin will try to find the output file of your bundle.

If set explicitly to `null` it will ignore the file and pass only the argument set by the [`args`](#args) option.

### args

```typescript
string[]
default []
```

Extra arguments to be passed to the `spawn` method after the file path specified with the [`file`](#file) option.

### key

```typescript
string
default "spawn-process"
```

The key to be used to store the process into the plugin context.

### storeGlobal

```typescript
boolean | string
```

Whether or not to use a global variable to store the plugin context.

If a string is passed it will be used as a key to store the plugin context into the global scope otherwise "ROLLUP_PLUGIN_SPAWN_PROCESS_CONTEXT" will be used.

If not specified the plugin will infer the correct value base on `process.env.ROLLUP_WATCH` environment variable.

#### The reason behind this option

When rollup is in watch mode and `rollup.config.js` is modified rollup will reload the config file causing plugins to be recreated, it causes the plugin context to be recreated as well, and since the previous process was stored in the previous local plugin context it wont be detected, nor passed to the [`cleanup`](#cleanup) method, nor killed before the new one is created, which will result in multiple instances of the running process.

### setup

```typescript
function (process: ChildProcess): void
```

A function to be called right after a new process has been created. It will receive the newly created process as only argument.

Usually used for process setup such as adding event listeners.

### cleanup

```typescript
function (process: ChildProcess): void
```

A function to be called right before a new process will be created. It will receive the previously created process as only argument.

Usually used for process cleanup such as removing event listeners or some general cleanup before a new process is created.

## LICENSE

MIT &copy; 2020 [Manuel Fernández](https://github.com/manferlo81)
